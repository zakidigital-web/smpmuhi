import { NextResponse } from "next/server";
import { query, execute, getDb } from "@/lib/database";

export async function GET() {
  const rows = query<{ key: string; value: string }>("SELECT key, value FROM settings");
  const settings: Record<string, string> = {};
  rows.forEach((r) => { settings[r.key] = r.value; });
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const body = await request.json();

  if (body.settings && typeof body.settings === "object") {
    const upsert = getDb().prepare(
      `INSERT INTO settings (key, value) VALUES (@key, @value) ON CONFLICT(key) DO UPDATE SET value=@value`
    );
    const tx = getDb().transaction(() => {
      for (const [key, value] of Object.entries(body.settings)) {
        upsert.run({ key, value: String(value) });
      }
    });
    tx();
  } else {
    execute(
      `INSERT INTO settings (key, value) VALUES (@key, @value) ON CONFLICT(key) DO UPDATE SET value=@value`,
      { key: body.key, value: String(body.value) }
    );
  }

  return NextResponse.json({ ok: true });
}
