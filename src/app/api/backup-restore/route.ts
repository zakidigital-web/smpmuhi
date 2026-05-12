import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function getBackupDir() {
  const dir = path.join(process.cwd(), "backups");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");

  if (!file) {
    return NextResponse.json({ ok: false, error: "Missing 'file' parameter" }, { status: 400 });
  }

  // Prevent directory traversal
  const safeName = path.basename(file);
  const filePath = path.join(getBackupDir(), safeName);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ ok: false, error: "File not found" }, { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${safeName}"`,
    },
  });
}
