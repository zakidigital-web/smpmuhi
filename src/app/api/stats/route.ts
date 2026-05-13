import { NextResponse } from "next/server";
import { query, getDb } from "@/lib/database";
import fs from "fs";

export async function GET() {
  const [heroCount, beritaCount, galeriCount, agendaCount, spmbCount, settingsCount] = await Promise.all([
    query("SELECT COUNT(*) as c FROM hero").then((r: any) => r[0].c),
    query("SELECT COUNT(*) as c FROM berita").then((r: any) => r[0].c),
    query("SELECT COUNT(*) as c FROM galeri").then((r: any) => r[0].c),
    query("SELECT COUNT(*) as c FROM agenda").then((r: any) => r[0].c),
    query("SELECT COUNT(*) as c FROM spmb_registrations").then((r: any) => r[0].c),
    query("SELECT COUNT(*) as c FROM settings").then((r: any) => r[0].c),
  ]);

  const db = await getDb();
  let dbSize = 0;
  if (!db.isTurso) {
    try { dbSize = fs.statSync(db.name).size; } catch {}
  }

  const dbSizeFormatted =
    dbSize < 1024 ? `${dbSize} B` :
    dbSize < 1024 * 1024 ? `${(dbSize / 1024).toFixed(1)} KB` :
    `${(dbSize / (1024 * 1024)).toFixed(2)} MB`;

  const categories = await query("SELECT category, COUNT(*) as count FROM berita GROUP BY category") as any[];

  return NextResponse.json({
    tables: { hero: heroCount, berita: beritaCount, galeri: galeriCount, agenda: agendaCount, spmb: spmbCount, settings: settingsCount },
    totalRows: heroCount + beritaCount + galeriCount + agendaCount + spmbCount + settingsCount,
    categories,
    dbSize: dbSizeFormatted,
    dbSizeBytes: dbSize,
    status: "connected",
    engine: db.isTurso ? "Turso (SQLite)" : "SQLite",
  });
}
