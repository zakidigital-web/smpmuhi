import { NextResponse } from "next/server";
import { getDb } from "@/lib/database";
import fs from "fs";
import path from "path";

function getBackupDir() {
  const dir = path.join(process.cwd(), "backups");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function listBackups() {
  const backupDir = getBackupDir();
  return fs.readdirSync(backupDir)
    .filter((f) => f.endsWith(".db"))
    .map((f) => {
      const stat = fs.statSync(path.join(backupDir, f));
      return {
        name: f,
        size:
          stat.size < 1024 ? `${stat.size} B` :
          stat.size < 1024 * 1024 ? `${(stat.size / 1024).toFixed(1)} KB` :
          `${(stat.size / (1024 * 1024)).toFixed(2)} MB`,
        date: stat.mtime.toISOString(),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function GET() {
  try {
    const db = getDb();
    const sourcePath = db.name;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = path.join(getBackupDir(), `backup-${timestamp}.db`);

    db.backup(backupPath);

    const stat = fs.statSync(backupPath);
    const size =
      stat.size < 1024 ? `${stat.size} B` :
      stat.size < 1024 * 1024 ? `${(stat.size / 1024).toFixed(1)} KB` :
      `${(stat.size / (1024 * 1024)).toFixed(2)} MB`;

    return NextResponse.json({
      ok: true,
      file: `backup-${timestamp}.db`,
      path: backupPath,
      size,
      timestamp,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ ok: false, error: "No file uploaded" }, { status: 400 });
    }

    if (!file.name.endsWith(".db")) {
      return NextResponse.json({ ok: false, error: "File must be a .db file" }, { status: 400 });
    }

    const db = getDb();
    const targetPath = db.name;
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(targetPath, buffer);

    return NextResponse.json({ ok: true, message: "Database restored successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const backupDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupDir)) {
      return NextResponse.json({ ok: true, files: [] });
    }
    const files = fs.readdirSync(backupDir)
      .filter((f) => f.endsWith(".db"))
      .map((f) => {
        const stat = fs.statSync(path.join(backupDir, f));
        return {
          name: f,
          size:
            stat.size < 1024 ? `${stat.size} B` :
            stat.size < 1024 * 1024 ? `${(stat.size / 1024).toFixed(1)} KB` :
            `${(stat.size / (1024 * 1024)).toFixed(2)} MB`,
          date: stat.mtime.toISOString(),
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));

    return NextResponse.json({ ok: true, files });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
