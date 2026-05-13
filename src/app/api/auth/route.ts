import { NextResponse } from "next/server";
import crypto from "crypto";
import { queryOne, execute } from "@/lib/database";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action, username, password, newPassword } = body;

  if (action === "login") {
    if (!username || !password) {
      return NextResponse.json({ error: "Username dan password wajib diisi" }, { status: 400 });
    }
    if (username !== "admin") {
      return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
    }
    const row = await queryOne<{ value: string }>("SELECT value FROM settings WHERE key = 'adminPassword'");
    const storedHash = row?.value || hashPassword("admin123");
    if (hashPassword(password) !== storedHash) {
      return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
    }
    return NextResponse.json({ ok: true });
  }

  if (action === "change-password") {
    if (!password || !newPassword) {
      return NextResponse.json({ error: "Password lama dan baru wajib diisi" }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password baru minimal 6 karakter" }, { status: 400 });
    }
    const row = await queryOne<{ value: string }>("SELECT value FROM settings WHERE key = 'adminPassword'");
    const storedHash = row?.value || hashPassword("admin123");
    if (hashPassword(password) !== storedHash) {
      return NextResponse.json({ error: "Password lama salah" }, { status: 401 });
    }
    await execute(
      `INSERT INTO settings (key, value) VALUES ('adminPassword', @value) ON CONFLICT(key) DO UPDATE SET value=@value`,
      { value: hashPassword(newPassword) }
    );
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Action tidak dikenal" }, { status: 400 });
}
