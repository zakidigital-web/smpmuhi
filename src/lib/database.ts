import Database from "better-sqlite3";
import path from "path";
import { heroSlides } from "@/data/hero";
import { beritaList } from "@/data/berita";
import { galeriList } from "@/data/galeri";
import { agendaList } from "@/data/agenda";
import { siteSettings } from "@/data/settings";

const DB_PATH = path.join(process.cwd(), "data.db");

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initTables();
  }
  return db;
}

function initTables() {
  db.exec(`
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

    CREATE TABLE IF NOT EXISTS galeri (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      desc TEXT NOT NULL DEFAULT '',
      media_type TEXT NOT NULL DEFAULT 'photo',
      url TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS agenda (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      date TEXT NOT NULL DEFAULT '',
      time TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL DEFAULT ''
    );

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

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    );
  `);

  try { db.exec("ALTER TABLE galeri ADD COLUMN media_type TEXT NOT NULL DEFAULT 'photo'"); } catch {}
  try { db.exec("ALTER TABLE galeri ADD COLUMN url TEXT NOT NULL DEFAULT ''"); } catch {}
  try { db.exec("ALTER TABLE berita ADD COLUMN image TEXT NOT NULL DEFAULT ''"); } catch {}
  try { db.exec("ALTER TABLE hero ADD COLUMN image TEXT NOT NULL DEFAULT ''"); } catch {}
  try { db.exec("ALTER TABLE berita ADD COLUMN allow_comments INTEGER NOT NULL DEFAULT 1"); } catch {}

  db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      berita_id TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT 'Anonim',
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (berita_id) REFERENCES berita(id)
    )
  `);

  const count = db.prepare("SELECT COUNT(*) as c FROM hero").get() as { c: number };
  if (count.c === 0) seedData();
}

function seedData() {
  const insertHero = db.prepare(`
    INSERT INTO hero (id, headline, tagline, description, ctaText, ctaHref, ctaSecondaryText, ctaSecondaryHref, gradient, active, sort_order)
    VALUES (@id, @headline, @tagline, @description, @ctaText, @ctaHref, @ctaSecondaryText, @ctaSecondaryHref, @gradient, @active, @sort_order)
  `);
  const insertBerita = db.prepare(`
    INSERT INTO berita (id, title, excerpt, content, date, author, category, slug)
    VALUES (@id, @title, @excerpt, @content, @date, @author, @category, @slug)
  `);
  const insertGaleri = db.prepare(`
    INSERT INTO galeri (id, title, category, desc, media_type, url)
    VALUES (@id, @title, @category, @desc, @media_type, @url)
  `);
  const insertAgenda = db.prepare(`
    INSERT INTO agenda (id, title, date, time, location, description, type)
    VALUES (@id, @title, @date, @time, @location, @description, @type)
  `);
  const insertSetting = db.prepare(`
    INSERT INTO settings (key, value) VALUES (?, ?)
  `);

  const tx = db.transaction(() => {
    heroSlides.forEach((s, i) => {
      insertHero.run({ ...s, active: s.active ? 1 : 0, sort_order: i });
    });
    beritaList.forEach((b) => insertBerita.run(b));
    galeriList.forEach((g) => insertGaleri.run(g));
    agendaList.forEach((a) => insertAgenda.run(a));
    Object.entries(siteSettings).forEach(([key, value]) => {
      insertSetting.run(key, String(value));
    });
  });
  tx();
}

export function query<T = unknown>(sql: string, params?: Record<string, unknown>): T[] {
  return (params ? getDb().prepare(sql).all(params) : getDb().prepare(sql).all()) as T[];
}

export function queryOne<T = unknown>(sql: string, params?: Record<string, unknown>): T | undefined {
  return (params ? getDb().prepare(sql).get(params) : getDb().prepare(sql).get()) as T | undefined;
}

export function execute(sql: string, params?: Record<string, unknown>): Database.RunResult {
  return params ? getDb().prepare(sql).run(params) : getDb().prepare(sql).run();
}
