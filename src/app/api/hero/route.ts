import { NextResponse } from "next/server";
import { query, queryOne, execute } from "@/lib/database";

export async function GET() {
  const items = await query<Record<string, unknown>>(
    "SELECT * FROM hero ORDER BY sort_order ASC"
  );
  return NextResponse.json(items.map(normalize));
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, headline, tagline, description, ctaText, ctaHref, ctaSecondaryText, ctaSecondaryHref, gradient, active } = body;

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const existing = await queryOne("SELECT id FROM hero WHERE id = @id", { id }) as { id: string } | undefined;

  if (existing) {
    await execute(
      `UPDATE hero SET headline=@headline, tagline=@tagline, description=@description, ctaText=@ctaText, ctaHref=@ctaHref, ctaSecondaryText=@ctaSecondaryText, ctaSecondaryHref=@ctaSecondaryHref, gradient=@gradient, active=@active WHERE id=@id`,
      { id, headline, tagline, description, ctaText, ctaHref, ctaSecondaryText: ctaSecondaryText || "", ctaSecondaryHref: ctaSecondaryHref || "", gradient, active: active ? 1 : 0 }
    );
  } else {
    const maxSort = await queryOne("SELECT COALESCE(MAX(sort_order), -1) + 1 as next FROM hero") as { next: number };
    await execute(
      `INSERT INTO hero (id, headline, tagline, description, ctaText, ctaHref, ctaSecondaryText, ctaSecondaryHref, gradient, active, sort_order) VALUES (@id, @headline, @tagline, @description, @ctaText, @ctaHref, @ctaSecondaryText, @ctaSecondaryHref, @gradient, @active, @sort_order)`,
      { id, headline, tagline, description, ctaText, ctaHref, ctaSecondaryText: ctaSecondaryText || "", ctaSecondaryHref: ctaSecondaryHref || "", gradient, active: active ? 1 : 0, sort_order: maxSort.next }
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await execute("DELETE FROM hero WHERE id = @id", { id });
  return NextResponse.json({ ok: true });
}

function normalize(row: Record<string, unknown>) {
  return {
    ...row,
    active: row.active === 1 || row.active === true,
    ctaSecondaryText: row.ctaSecondaryText || undefined,
    ctaSecondaryHref: row.ctaSecondaryHref || undefined,
  };
}
