import { NextResponse } from "next/server";
import { factoryResetDb } from "@/lib/database";

export async function POST() {
  try {
    await factoryResetDb();
    return NextResponse.json({
      ok: true,
      message: "Database berhasil direset! Semua data dikembalikan ke awal.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mereset database";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
