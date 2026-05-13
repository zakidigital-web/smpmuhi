import { NextResponse } from "next/server";
import { query, execute, queryOne } from "@/lib/database";

export async function GET() {
  const items = await query("SELECT * FROM agenda ORDER BY date ASC");
  return NextResponse.json(items);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, title, date, time, location, description, type } = body;

  if (!id || !title) {
    return NextResponse.json({ error: "ID and title required" }, { status: 400 });
  }

  const existing = await queryOne("SELECT id FROM agenda WHERE id = @id", { id }) as { id: string } | undefined;

  if (existing) {
    await execute(
      `UPDATE agenda SET title=@title, date=@date, time=@time, location=@location, description=@description, type=@type WHERE id=@id`,
      { id, title, date, time, location, description, type }
    );
  } else {
    await execute(
      `INSERT INTO agenda (id, title, date, time, location, description, type) VALUES (@id, @title, @date, @time, @location, @description, @type)`,
      { id, title, date, time, location, description, type }
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await execute("DELETE FROM agenda WHERE id = @id", { id });
  return NextResponse.json({ ok: true });
}
