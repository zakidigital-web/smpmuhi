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
    await client.execute(sql);
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

async function initTables() {
  const db = adapter!;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS hero (
      id TEXT PRIMARY KEY,
      headline TEXT NOT NULL DEFAULT '',
      tagline TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      ctaText TEXT NOT NULL DEFAULT '',
      ctaHref TEXT NOT NULL DEFAULT '',
      ctaSecondaryText TEXT DEFAULT '',
      ctaSecondaryHref TEXT DEFAULT '',
      gradient TEXT NOT NULL DEFAULT '',
      active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS berita (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      excerpt TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      date TEXT NOT NULL DEFAULT '',
      author TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      slug TEXT NOT NULL DEFAULT ''
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS galeri (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      desc TEXT NOT NULL DEFAULT '',
      media_type TEXT NOT NULL DEFAULT 'photo',
      url TEXT NOT NULL DEFAULT ''
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS agenda (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      date TEXT NOT NULL DEFAULT '',
      time TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL DEFAULT ''
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS spmb_registrations (
      id TEXT PRIMARY KEY,
      nomor_pendaftaran TEXT UNIQUE NOT NULL,
      nama_lengkap TEXT NOT NULL,
      nisn TEXT NOT NULL,
      tempat_lahir TEXT NOT NULL,
      tanggal_lahir TEXT NOT NULL,
      jenis_kelamin TEXT NOT NULL,
      agama TEXT NOT NULL,
      alamat TEXT NOT NULL,
      nama_ayah TEXT NOT NULL,
      pekerjaan_ayah TEXT NOT NULL,
      no_hp_ortu TEXT NOT NULL,
      nama_ibu TEXT NOT NULL,
      pekerjaan_ibu TEXT NOT NULL,
      nama_sekolah TEXT NOT NULL,
      alamat_sekolah TEXT NOT NULL,
      program_pilihan TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'menunggu',
      created_at TEXT NOT NULL
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      berita_id TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT 'Anonim',
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (berita_id) REFERENCES berita(id)
    )
  `);

  try { await db.exec("ALTER TABLE galeri ADD COLUMN media_type TEXT NOT NULL DEFAULT 'photo'"); } catch {}
  try { await db.exec("ALTER TABLE galeri ADD COLUMN url TEXT NOT NULL DEFAULT ''"); } catch {}
  try { await db.exec("ALTER TABLE berita ADD COLUMN image TEXT NOT NULL DEFAULT ''"); } catch {}
  try { await db.exec("ALTER TABLE hero ADD COLUMN image TEXT NOT NULL DEFAULT ''"); } catch {}
  try { await db.exec("ALTER TABLE berita ADD COLUMN allow_comments INTEGER NOT NULL DEFAULT 1"); } catch {}

  const count = await db.queryOne<{ c: number }>("SELECT COUNT(*) as c FROM hero");
  if (count && count.c === 0) await seedData();
}

async function seedData() {
  const db = adapter!;
  for (const [i, s] of heroSlides.entries()) {
    await db.execute(
      `INSERT INTO hero (id, headline, tagline, description, ctaText, ctaHref, ctaSecondaryText, ctaSecondaryHref, gradient, active, sort_order)
       VALUES (@id, @headline, @tagline, @description, @ctaText, @ctaHref, @ctaSecondaryText, @ctaSecondaryHref, @gradient, @active, @sort_order)`,
      { ...s, active: s.active ? 1 : 0, sort_order: i } as any
    );
  }
  for (const b of beritaList) {
    await db.execute(
      `INSERT INTO berita (id, title, excerpt, content, date, author, category, slug)
       VALUES (@id, @title, @excerpt, @content, @date, @author, @category, @slug)`,
      b as any
    );
  }
  for (const g of galeriList) {
    await db.execute(
      `INSERT INTO galeri (id, title, category, desc, media_type, url)
       VALUES (@id, @title, @category, @desc, @media_type, @url)`,
      g as any
    );
  }
  for (const a of agendaList) {
    await db.execute(
      `INSERT INTO agenda (id, title, date, time, location, description, type)
       VALUES (@id, @title, @date, @time, @location, @description, @type)`,
      a as any
    );
  }
  for (const [key, value] of Object.entries(siteSettings)) {
    await db.execute("INSERT INTO settings (key, value) VALUES (@key, @value)", { key, value: String(value) });
  }

  const dummyRegistrations = [
    { nama_lengkap: "Ahmad Fauzi", nisn: "1234567890", tempat_lahir: "Banyuwangi", tanggal_lahir: "2011-08-15", jenis_kelamin: "L", agama: "Islam", alamat: "Jl. Merdeka No.10, Genteng", nama_ayah: "Suparman", pekerjaan_ayah: "Petani", no_hp_ortu: "081234567890", nama_ibu: "Siti Aminah", pekerjaan_ibu: "Ibu Rumah Tangga", nama_sekolah: "SD Negeri 1 Genteng", alamat_sekolah: "Jl. Raya Genteng No.1", program_pilihan: "Reguler", status: "diterima", nomor_pendaftaran: "SPMB-240101001", created_at: "2026-01-15T08:30:00.000Z" },
    { nama_lengkap: "Nurul Hidayah", nisn: "2234567891", tempat_lahir: "Banyuwangi", tanggal_lahir: "2011-12-20", jenis_kelamin: "P", agama: "Islam", alamat: "Ds. Krajan, Kec. Genteng", nama_ayah: "Hasanudin", pekerjaan_ayah: "Guru", no_hp_ortu: "082345678901", nama_ibu: "Fatimah", pekerjaan_ibu: "Guru", nama_sekolah: "SD Muhammadiyah 1 Genteng", alamat_sekolah: "Jl. Pesantren No.5", program_pilihan: "Reguler", status: "menunggu", nomor_pendaftaran: "SPMB-240201002", created_at: "2026-02-20T10:15:00.000Z" },
    { nama_lengkap: "Dimas Prasetyo", nisn: "3234567892", tempat_lahir: "Jember", tanggal_lahir: "2012-03-10", jenis_kelamin: "L", agama: "Islam", alamat: "Perum Griya Asri Blok A5, Genteng", nama_ayah: "Agus Prasetyo", pekerjaan_ayah: "Wiraswasta", no_hp_ortu: "083456789012", nama_ibu: "Dewi Sartika", pekerjaan_ibu: "Perawat", nama_sekolah: "SD Negeri 2 Genteng", alamat_sekolah: "Jl. Pendidikan No.10", program_pilihan: "Prestasi", status: "diterima", nomor_pendaftaran: "SPMB-240301003", created_at: "2026-03-05T14:00:00.000Z" },
  ];
  for (const r of dummyRegistrations) {
    const id = "DUM-" + r.nomor_pendaftaran;
    await db.execute(
      `INSERT INTO spmb_registrations (id, nomor_pendaftaran, nama_lengkap, nisn, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, alamat, nama_ayah, pekerjaan_ayah, no_hp_ortu, nama_ibu, pekerjaan_ibu, nama_sekolah, alamat_sekolah, program_pilihan, status, created_at)
       VALUES (@id, @nomor_pendaftaran, @nama_lengkap, @nisn, @tempat_lahir, @tanggal_lahir, @jenis_kelamin, @agama, @alamat, @nama_ayah, @pekerjaan_ayah, @no_hp_ortu, @nama_ibu, @pekerjaan_ibu, @nama_sekolah, @alamat_sekolah, @program_pilihan, @status, @created_at)`,
      { ...r, id } as any
    );
  }

  const dummyComments = [
    { name: "Ani", content: "Informasi pendaftarannya sangat jelas. Terima kasih.", created_at: "2026-01-16T09:00:00.000Z" },
    { name: "Budi Santoso", content: "Apakah ada jalur beasiswa untuk siswa kurang mampu?", created_at: "2026-01-18T14:30:00.000Z" },
    { name: "Citra Dewi", content: "Anak saya sudah daftar, semoga diterima! Aamiin.", created_at: "2026-02-01T07:15:00.000Z" },
  ];
  for (const c of dummyComments) {
    await db.execute(
      "INSERT INTO comments (id, berita_id, name, content, created_at) VALUES (@id, @berita_id, @name, @content, @created_at)",
      { id: "c" + Date.now() + Math.random().toString(36).slice(2, 6), berita_id: "1", ...c }
    );
  }
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
