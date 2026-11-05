import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { gallery } from "@/db/schema";

export async function POST(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const body = await req.json();
    const { title, category, imageUrl, description } = body;

    const [inserted] = await db
      .insert(gallery)
      .values({
        title,
        category: category || "Stüdyomuz",
        imageUrl,
        description: description || "",
        order: 1,
        isActive: true,
      })
      .returning();

    return NextResponse.json({ ok: true, gallery: inserted });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ ok: false, error: "ID required" }, { status: 400 });

    await db.delete(gallery).where(eq(gallery.id, Number(id)));
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
