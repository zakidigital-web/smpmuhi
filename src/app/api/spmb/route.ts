import { NextResponse } from "next/server";
import { query, execute, queryOne } from "@/lib/database";

export async function GET() {
  const items = await query("SELECT * FROM spmb_registrations ORDER BY created_at DESC");
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action } = body;

  if (action === "register") {
    const { nama_lengkap, nisn, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, alamat, nama_ayah, pekerjaan_ayah, no_hp_ortu, nama_ibu, pekerjaan_ibu, nama_sekolah, alamat_sekolah, program_pilihan } = body;

    if (!nama_lengkap || !nisn) {
      return NextResponse.json({ error: "Nama dan NISN wajib diisi" }, { status: 400 });
    }

    const id = "SPMB-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
    const nomor_pendaftaran = "SPMB-" + Date.now().toString().slice(-8);
    const created_at = new Date().toISOString();

    await execute(
      `INSERT INTO spmb_registrations (id, nomor_pendaftaran, nama_lengkap, nisn, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, alamat, nama_ayah, pekerjaan_ayah, no_hp_ortu, nama_ibu, pekerjaan_ibu, nama_sekolah, alamat_sekolah, program_pilihan, status, created_at)
       VALUES (@id, @nomor_pendaftaran, @nama_lengkap, @nisn, @tempat_lahir, @tanggal_lahir, @jenis_kelamin, @agama, @alamat, @nama_ayah, @pekerjaan_ayah, @no_hp_ortu, @nama_ibu, @pekerjaan_ibu, @nama_sekolah, @alamat_sekolah, @program_pilihan, 'menunggu', @created_at)`,
      { id, nomor_pendaftaran, nama_lengkap, nisn, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, alamat, nama_ayah, pekerjaan_ayah, no_hp_ortu, nama_ibu, pekerjaan_ibu, nama_sekolah, alamat_sekolah, program_pilihan, created_at }
    );

    return NextResponse.json({ ok: true, nomor_pendaftaran });
  }

  if (action === "check") {
    const { nomor_pendaftaran } = body;
    if (!nomor_pendaftaran) {
      return NextResponse.json({ error: "Nomor pendaftaran wajib diisi" }, { status: 400 });
    }
    const item = await queryOne("SELECT nomor_pendaftaran, nama_lengkap, program_pilihan, status, created_at FROM spmb_registrations WHERE nomor_pendaftaran = @n", { n: nomor_pendaftaran });
    if (!item) {
      return NextResponse.json({ error: "Nomor pendaftaran tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(item);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json({ error: "ID and status required" }, { status: 400 });
  }

  await execute("UPDATE spmb_registrations SET status = @status WHERE id = @id", { id, status });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await execute("DELETE FROM spmb_registrations WHERE id = @id", { id });
  return NextResponse.json({ ok: true });
}
