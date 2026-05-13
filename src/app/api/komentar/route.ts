import { NextResponse } from "next/server";
import { query, execute, queryOne } from "@/lib/database";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const berita_id = searchParams.get("berita_id");
  if (!berita_id) {
    return NextResponse.json({ error: "berita_id required" }, { status: 400 });
  }
  const items = await query(
    "SELECT * FROM comments WHERE berita_id = @berita_id ORDER BY created_at ASC",
    { berita_id }
  );
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const { berita_id, name, content } = await request.json();

  if (!berita_id || !content) {
    return NextResponse.json({ error: "berita_id and content required" }, { status: 400 });
  }

  const berita = await queryOne("SELECT allow_comments FROM berita WHERE id = @id", { id: berita_id }) as { allow_comments: number } | undefined;
  if (!berita || !berita.allow_comments) {
    return NextResponse.json({ error: "Komentar tidak diizinkan untuk artikel ini" }, { status: 403 });
  }

  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const now = new Date().toISOString();
  await execute(
    "INSERT INTO comments (id, berita_id, name, content, created_at) VALUES (@id, @berita_id, @name, @content, @created_at)",
    { id, berita_id, name: name || "Anonim", content, created_at: now }
  );

  return NextResponse.json({ ok: true, id });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await execute("DELETE FROM comments WHERE id = @id", { id });
  return NextResponse.json({ ok: true });
}
