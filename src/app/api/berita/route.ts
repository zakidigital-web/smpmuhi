import { NextResponse } from "next/server";
import { query, execute, queryOne } from "@/lib/database";

export async function GET() {
  const items = await query("SELECT * FROM berita ORDER BY date DESC");
  return NextResponse.json(items);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, title, excerpt, content, date, author, category, slug, image, allow_comments } = body;

  if (!id || !title) {
    return NextResponse.json({ error: "ID and title required" }, { status: 400 });
  }

  const existing = await queryOne("SELECT id FROM berita WHERE id = @id", { id }) as { id: string } | undefined;

  if (existing) {
    await execute(
      `UPDATE berita SET title=@title, excerpt=@excerpt, content=@content, date=@date, author=@author, category=@category, slug=@slug, image=@image, allow_comments=@allow_comments WHERE id=@id`,
      { id, title, excerpt, content, date, author, category, slug, image: image || "", allow_comments: allow_comments ?? 1 }
    );
  } else {
    await execute(
      `INSERT INTO berita (id, title, excerpt, content, date, author, category, slug, image, allow_comments) VALUES (@id, @title, @excerpt, @content, @date, @author, @category, @slug, @image, @allow_comments)`,
      { id, title, excerpt, content, date, author, category, slug, image: image || "", allow_comments: allow_comments ?? 1 }
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await execute("DELETE FROM berita WHERE id = @id", { id });
  return NextResponse.json({ ok: true });
}
