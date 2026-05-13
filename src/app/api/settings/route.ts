import { NextResponse } from "next/server";
import { query, execute } from "@/lib/database";

export async function GET() {
  const rows = await query<{ key: string; value: string }>("SELECT key, value FROM settings");
  const settings: Record<string, string> = {};
  rows.forEach((r) => { settings[r.key] = r.value; });
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const body = await request.json();

  if (body.settings && typeof body.settings === "object") {
    const entries = Object.entries(body.settings);
    for (const [key, value] of entries) {
      await execute(
        `INSERT INTO settings (key, value) VALUES (@key, @value) ON CONFLICT(key) DO UPDATE SET value=@value`,
        { key, value: String(value) }
      );
    }
  } else {
    await execute(
      `INSERT INTO settings (key, value) VALUES (@key, @value) ON CONFLICT(key) DO UPDATE SET value=@value`,
      { key: body.key, value: String(body.value) }
    );
  }

  return NextResponse.json({ ok: true });
}
