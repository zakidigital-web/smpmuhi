import { NextResponse } from "next/server";
import { query, execute, queryOne } from "@/lib/database";

export async function GET() {
  const items = query("SELECT * FROM berita ORDER BY date DESC");
  return NextResponse.json(items);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, title, excerpt, content, date, author, category, slug } = body;

  if (!id || !title) {
    return NextResponse.json({ error: "ID and title required" }, { status: 400 });
  }

  const existing = queryOne("SELECT id FROM berita WHERE id = @id", { id }) as { id: string } | undefined;

  if (existing) {
    execute(
      `UPDATE berita SET title=@title, excerpt=@excerpt, content=@content, date=@date, author=@author, category=@category, slug=@slug WHERE id=@id`,
      { id, title, excerpt, content, date, author, category, slug }
    );
  } else {
    execute(
      `INSERT INTO berita (id, title, excerpt, content, date, author, category, slug) VALUES (@id, @title, @excerpt, @content, @date, @author, @category, @slug)`,
      { id, title, excerpt, content, date, author, category, slug }
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  execute("DELETE FROM berita WHERE id = @id", { id });
  return NextResponse.json({ ok: true });
}
