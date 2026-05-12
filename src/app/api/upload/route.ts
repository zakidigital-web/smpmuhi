import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const { data } = await request.json();
    if (!data || typeof data !== "string" || !data.startsWith("data:")) {
      return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
    }

    const matches = data.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ error: "Unsupported format" }, { status: 400 });
    }

    const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
