import path from "path";
import { createClient } from "@libsql/client";
import type { Config as TursoConfig } from "@libsql/client";
import fs from "fs";

import { heroSlides } from "@/data/hero";
import { beritaList } from "@/data/berita";
import { galeriList } from "@/data/galeri";
import { agendaList } from "@/data/agenda";
import { siteSettings } from "@/data/settings";

type DbAdapter = {
  query: <T = unknown>(sql: string, params?: Record<string, unknown> | any[]) => Promise<T[]>;
  queryOne: <T = unknown>(sql: string, params?: Record<string, unknown> | any[]) => Promise<T | undefined>;
  execute: (sql: string, params?: Record<string, unknown> | any[]) => Promise<{ changes: number }>;
  exec: (sql: string) => Promise<void>;
  isTurso: boolean;
  name: string;
};

let adapter: DbAdapter | null = null;
let tursoRuntimeConfig: TursoConfig | null = null;

const TURSO_CONFIG_PATH = "/tmp/turso-config.json";

export function configureTurso(url: string, authToken: string) {
  tursoRuntimeConfig = { url, authToken };
  try {
    fs.writeFileSync(TURSO_CONFIG_PATH, JSON.stringify({ url, authToken }), "utf-8");
  } catch {}
  adapter = null;
}

export function getTursoConfig(): TursoConfig | null {
  if (tursoRuntimeConfig) return tursoRuntimeConfig;
  if (process.env.TURSO_DB_URL && process.env.TURSO_DB_AUTH_TOKEN) {
    return { url: process.env.TURSO_DB_URL, authToken: process.env.TURSO_DB_AUTH_TOKEN };
  }
  try {
    if (fs.existsSync(TURSO_CONFIG_PATH)) {
      const data = JSON.parse(fs.readFileSync(TURSO_CONFIG_PATH, "utf-8"));
      if (data.url && data.authToken) {
        tursoRuntimeConfig = { url: data.url, authToken: data.authToken };
        return tursoRuntimeConfig;
      }
    }
  } catch {}
  return null;
}

function createTursoAdapter(config: TursoConfig): DbAdapter {
  const client = createClient(config);

  const query = async <T = unknown>(sql: string, params?: Record<string, unknown> | any[]): Promise<T[]> => {
    const result = params
      ? await client.execute({ sql, args: params as any })
      : await client.execute(sql);
    return result.rows as unknown as T[];
  };

  const queryOne = async <T = unknown>(sql: string, params?: Record<string, unknown> | any[]): Promise<T | undefined> => {
    const rows = await query<T>(sql, params);
    return rows.length > 0 ? rows[0] : undefined;
  };

  const execute = async (sql: string, params?: Record<string, unknown> | any[]): Promise<{ changes: number }> => {
    const result = params
      ? await client.execute({ sql, args: params as any })
      : await client.execute(sql);
    return { changes: Number(result.rowsAffected) };
  };

  const exec = async (sql: string) => {
    const stmts = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
    if (stmts.length <= 1) {
      await client.execute(sql);
    } else {
      for (const stmt of stmts) {
        await client.execute(stmt);
      }
    }
  };

  return { query, queryOne, execute, exec, isTurso: true, name: config.url };
}

function createSqliteAdapter(): DbAdapter {
  const Database: any = require("better-sqlite3");
  const DB_PATH = path.join(process.cwd(), "data.db");
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");

  const query = async <T = unknown>(sql: string, params?: Record<string, unknown> | any[]): Promise<T[]> => {
    return (params ? db.prepare(sql).all(params) : db.prepare(sql).all()) as T[];
  };

  const queryOne = async <T = unknown>(sql: string, params?: Record<string, unknown> | any[]): Promise<T | undefined> => {
    return (params ? db.prepare(sql).get(params) : db.prepare(sql).get()) as T | undefined;
  };

  const execute = async (sql: string, params?: Record<string, unknown> | any[]): Promise<{ changes: number }> => {
    return params ? db.prepare(sql).run(params) : db.prepare(sql).run();
  };

  const exec = async (sql: string) => { db.exec(sql); };

  return { query, queryOne, execute, exec, isTurso: false, name: DB_PATH };
}

export async function getDb(): Promise<DbAdapter> {
  if (adapter) return adapter;

  const tursoConfig = getTursoConfig();
  if (tursoConfig) {
    adapter = createTursoAdapter(tursoConfig);
  } else {
    adapter = createSqliteAdapter();
  }

  await initTables();
  return adapter;
}

export function resetDb() {
  adapter = null;
}

export async function factoryResetDb() {
  const db = await getDb();
  await db.exec(`
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS spmb_registrations;
    DROP TABLE IF EXISTS settings;
    DROP TABLE IF EXISTS agenda;
    DROP TABLE IF EXISTS galeri;
    DROP TABLE IF EXISTS berita;
    DROP TABLE IF EXISTS hero
  `);
  resetDb();
  await getDb();
}

async function initTables() {
  const db = adapter!;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS hero (
      id TEXT PRIMARY KEY, headline TEXT NOT NULL DEFAULT '',
      tagline TEXT NOT NULL DEFAULT '', description TEXT NOT NULL DEFAULT '',
      ctaText TEXT NOT NULL DEFAULT '', ctaHref TEXT NOT NULL DEFAULT '',
      ctaSecondaryText TEXT DEFAULT '', ctaSecondaryHref TEXT DEFAULT '',
      gradient TEXT NOT NULL DEFAULT '', active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS berita (
      id TEXT PRIMARY KEY, title TEXT NOT NULL DEFAULT '',
      excerpt TEXT NOT NULL DEFAULT '', content TEXT NOT NULL DEFAULT '',
      date TEXT NOT NULL DEFAULT '', author TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '', slug TEXT NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS galeri (
      id TEXT PRIMARY KEY, title TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '', desc TEXT NOT NULL DEFAULT '',
      media_type TEXT NOT NULL DEFAULT 'photo', url TEXT NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS agenda (
      id TEXT PRIMARY KEY, title TEXT NOT NULL DEFAULT '',
      date TEXT NOT NULL DEFAULT '', time TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '', description TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS spmb_registrations (
      id TEXT PRIMARY KEY, nomor_pendaftaran TEXT UNIQUE NOT NULL,
      nama_lengkap TEXT NOT NULL, nisn TEXT NOT NULL,
      tempat_lahir TEXT NOT NULL, tanggal_lahir TEXT NOT NULL,
      jenis_kelamin TEXT NOT NULL, agama TEXT NOT NULL,
      alamat TEXT NOT NULL, nama_ayah TEXT NOT NULL,
      pekerjaan_ayah TEXT NOT NULL, no_hp_ortu TEXT NOT NULL,
      nama_ibu TEXT NOT NULL, pekerjaan_ibu TEXT NOT NULL,
      nama_sekolah TEXT NOT NULL, alamat_sekolah TEXT NOT NULL,
      program_pilihan TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'menunggu',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL DEFAULT '');
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY, berita_id TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT 'Anonim', content TEXT NOT NULL,
      created_at TEXT NOT NULL, FOREIGN KEY (berita_id) REFERENCES berita(id)
    )
  `);

  try {
    await db.exec(`
      ALTER TABLE galeri ADD COLUMN media_type TEXT NOT NULL DEFAULT 'photo';
      ALTER TABLE galeri ADD COLUMN url TEXT NOT NULL DEFAULT '';
      ALTER TABLE berita ADD COLUMN image TEXT NOT NULL DEFAULT '';
      ALTER TABLE hero ADD COLUMN image TEXT NOT NULL DEFAULT '';
      ALTER TABLE berita ADD COLUMN allow_comments INTEGER NOT NULL DEFAULT 1
    `);
  } catch {}

  const count = await db.queryOne<{ c: number }>("SELECT COUNT(*) as c FROM hero");
  if (count && count.c === 0) await seedData();
}

async function seedData() {
  const db = adapter!;
  const esc = (v: any) => v == null ? "NULL" : `'${String(v).replace(/'/g, "''")}'`;

  const heroSQL = heroSlides.map((s, i) =>
    `INSERT INTO hero (id,headline,tagline,description,ctaText,ctaHref,ctaSecondaryText,ctaSecondaryHref,gradient,active,sort_order) VALUES (${[esc(s.id), esc(s.headline), esc(s.tagline), esc(s.description), esc(s.ctaText), esc(s.ctaHref), esc(s.ctaSecondaryText ?? ""), esc(s.ctaSecondaryHref ?? ""), esc(s.gradient), esc(s.active ? 1 : 0), esc(i)].join(",")})`
  ).join(";\n");
  await db.exec(heroSQL);

  const beritaSQL = beritaList.map(b =>
    `INSERT INTO berita (id,title,excerpt,content,date,author,category,slug) VALUES (${[esc(b.id), esc(b.title), esc(b.excerpt), esc(b.content), esc(b.date), esc(b.author), esc(b.category), esc(b.slug)].join(",")})`
  ).join(";\n");
  await db.exec(beritaSQL);

  const galeriSQL = galeriList.map(g =>
    `INSERT INTO galeri (id,title,category,"desc",media_type,url) VALUES (${[esc(g.id), esc(g.title), esc(g.category), esc(g.desc), esc(g.media_type), esc(g.url)].join(",")})`
  ).join(";\n");
  await db.exec(galeriSQL);

  const agendaSQL = agendaList.map(a =>
    `INSERT INTO agenda (id,title,date,time,location,description,type) VALUES (${[esc(a.id), esc(a.title), esc(a.date), esc(a.time), esc(a.location), esc(a.description), esc(a.type)].join(",")})`
  ).join(";\n");
  await db.exec(agendaSQL);

  const settingsSQL = Object.entries(siteSettings).map(([k, v]) =>
    `INSERT INTO settings (key,value) VALUES (${esc(k)},${esc(String(v))})`
  ).join(";\n");
  await db.exec(settingsSQL);

  const regRows = [
    { id: "DUM-SPMB-240101001", n: "Ahmad Fauzi", ns: "1234567890", tl: "Banyuwangi", tgl: "2011-08-15", jk: "L", a: "Islam", al: "Jl. Merdeka No.10, Genteng", na: "Suparman", pa: "Petani", hp: "081234567890", ni: "Siti Aminah", pi: "Ibu Rumah Tangga", ns_: "SD Negeri 1 Genteng", al_: "Jl. Raya Genteng No.1", pp: "Reguler", s: "diterima", np: "SPMB-240101001", ca: "2026-01-15T08:30:00.000Z" },
    { id: "DUM-SPMB-240201002", n: "Nurul Hidayah", ns: "2234567891", tl: "Banyuwangi", tgl: "2011-12-20", jk: "P", a: "Islam", al: "Ds. Krajan, Kec. Genteng", na: "Hasanudin", pa: "Guru", hp: "082345678901", ni: "Fatimah", pi: "Guru", ns_: "SD Muhammadiyah 1 Genteng", al_: "Jl. Pesantren No.5", pp: "Reguler", s: "menunggu", np: "SPMB-240201002", ca: "2026-02-20T10:15:00.000Z" },
    { id: "DUM-SPMB-240301003", n: "Dimas Prasetyo", ns: "3234567892", tl: "Jember", tgl: "2012-03-10", jk: "L", a: "Islam", al: "Perum Griya Asri Blok A5, Genteng", na: "Agus Prasetyo", pa: "Wiraswasta", hp: "083456789012", ni: "Dewi Sartika", pi: "Perawat", ns_: "SD Negeri 2 Genteng", al_: "Jl. Pendidikan No.10", pp: "Prestasi", s: "diterima", np: "SPMB-240301003", ca: "2026-03-05T14:00:00.000Z" },
  ];
  const regSQL = regRows.map(r =>
    `INSERT INTO spmb_registrations (id,nomor_pendaftaran,nama_lengkap,nisn,tempat_lahir,tanggal_lahir,jenis_kelamin,agama,alamat,nama_ayah,pekerjaan_ayah,no_hp_ortu,nama_ibu,pekerjaan_ibu,nama_sekolah,alamat_sekolah,program_pilihan,status,created_at) VALUES (${esc(r.id)},${esc(r.np)},${esc(r.n)},${esc(r.ns)},${esc(r.tl)},${esc(r.tgl)},${esc(r.jk)},${esc(r.a)},${esc(r.al)},${esc(r.na)},${esc(r.pa)},${esc(r.hp)},${esc(r.ni)},${esc(r.pi)},${esc(r.ns_)},${esc(r.al_)},${esc(r.pp)},${esc(r.s)},${esc(r.ca)})`
  ).join(";\n");
  await db.exec(regSQL);

  const now = Date.now();
  const cmtRows = [
    { name: "Ani", content: "Informasi pendaftarannya sangat jelas. Terima kasih.", created_at: "2026-01-16T09:00:00.000Z" },
    { name: "Budi Santoso", content: "Apakah ada jalur beasiswa untuk siswa kurang mampu?", created_at: "2026-01-18T14:30:00.000Z" },
    { name: "Citra Dewi", content: "Anak saya sudah daftar, semoga diterima! Aamiin.", created_at: "2026-02-01T07:15:00.000Z" },
  ];
  const cmtSQL = cmtRows.map((c, i) =>
    `INSERT INTO comments (id,berita_id,name,content,created_at) VALUES (${esc("c" + (now + i) + Math.random().toString(36).slice(2, 6))},${esc("1")},${esc(c.name)},${esc(c.content)},${esc(c.created_at)})`
  ).join(";\n");
  await db.exec(cmtSQL);
}



export async function query<T = unknown>(sql: string, params?: Record<string, unknown> | any[]): Promise<T[]> {
  const db = await getDb();
  return db.query<T>(sql, params);
}

export async function queryOne<T = unknown>(sql: string, params?: Record<string, unknown> | any[]): Promise<T | undefined> {
  const db = await getDb();
  return db.queryOne<T>(sql, params);
}

export async function execute(sql: string, params?: Record<string, unknown> | any[]): Promise<{ changes: number }> {
  const db = await getDb();
  return db.execute(sql, params);
}
