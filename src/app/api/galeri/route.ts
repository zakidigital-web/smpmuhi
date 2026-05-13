import { NextResponse } from "next/server";
import { query, execute, queryOne } from "@/lib/database";

export async function GET() {
  const items = await query("SELECT * FROM galeri ORDER BY id ASC");
  return NextResponse.json(items);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, title, category, desc, media_type, url } = body;

  if (!id || !title) {
    return NextResponse.json({ error: "ID and title required" }, { status: 400 });
  }

  const existing = await queryOne("SELECT id FROM galeri WHERE id = @id", { id }) as { id: string } | undefined;

  if (existing) {
    await execute(
      `UPDATE galeri SET title=@title, category=@category, desc=@desc, media_type=@media_type, url=@url WHERE id=@id`,
      { id, title, category, desc, media_type: media_type || "photo", url: url || "" }
    );
  } else {
    await execute(
      `INSERT INTO galeri (id, title, category, desc, media_type, url) VALUES (@id, @title, @category, @desc, @media_type, @url)`,
      { id, title, category, desc, media_type: media_type || "photo", url: url || "" }
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await execute("DELETE FROM galeri WHERE id = @id", { id });
  return NextResponse.json({ ok: true });
}
