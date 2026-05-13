import { NextResponse } from "next/server";
import { configureTurso, resetDb } from "@/lib/database";

export async function POST(request: Request) {
  try {
    const { url, authToken } = await request.json();

    if (!url || !authToken) {
      return NextResponse.json(
        { ok: false, error: "Database URL dan Auth Token wajib diisi" },
        { status: 400 }
      );
    }

    const { createClient } = await import("@libsql/client");
    const client = createClient({ url, authToken });

    await client.execute("SELECT 1");

    resetDb();
    configureTurso(url, authToken);

    const { getDb } = await import("@/lib/database");
    await getDb();

    return NextResponse.json({
      ok: true,
      message: "Database Turso berhasil dikonfigurasi!",
      seeded: {
        hero: 3,
        berita: 8,
        galeri: 12,
        agenda: 6,
        pengaturan: 29,
        registrasiSPMB: 3,
        komentar: 3,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal terhubung ke Turso";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
