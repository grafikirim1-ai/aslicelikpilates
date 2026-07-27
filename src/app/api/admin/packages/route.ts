import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { packages } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, sessionsCount, durationDays, price, focus, includes, isPopular } = body;

    const slug = `${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}`;

    const [inserted] = await db
      .insert(packages)
      .values({
        slug,
        name,
        description,
        sessionsCount: Number(sessionsCount),
        durationDays: Number(durationDays),
        price: String(price),
        focus,
        includes: Array.isArray(includes) ? includes : includes.split(",").map((s: string) => s.trim()),
        isPopular: Boolean(isPopular),
        isActive: true,
      })
      .returning();

    return NextResponse.json({ ok: true, package: inserted });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, description, sessionsCount, durationDays, price, focus, includes, isPopular, isActive } = body;

    const [updated] = await db
      .update(packages)
      .set({
        name,
        description,
        sessionsCount: Number(sessionsCount),
        durationDays: Number(durationDays),
        price: String(price),
        focus,
        includes: Array.isArray(includes) ? includes : includes.split(",").map((s: string) => s.trim()),
        isPopular: Boolean(isPopular),
        isActive: Boolean(isActive),
      })
      .where(eq(packages.id, Number(id)))
      .returning();

    return NextResponse.json({ ok: true, package: updated });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ ok: false, error: "ID required" }, { status: 400 });

    await db.delete(packages).where(eq(packages.id, Number(id)));
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
