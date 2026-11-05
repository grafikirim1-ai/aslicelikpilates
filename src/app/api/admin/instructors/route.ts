import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { instructors } from "@/db/schema";

export async function POST(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const body = await req.json();
    const { fullName, role, specialties, bio, phone, email, experienceYears } = body;

    const [inserted] = await db
      .insert(instructors)
      .values({
        fullName,
        role,
        specialties: Array.isArray(specialties) ? specialties : specialties.split(",").map((s: string) => s.trim()),
        bio,
        phone,
        email,
        experienceYears: Number(experienceYears) || 1,
        isActive: true,
      })
      .returning();

    return NextResponse.json({ ok: true, instructor: inserted });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const body = await req.json();
    const { id, fullName, role, specialties, bio, phone, email, experienceYears, isActive } = body;

    const [updated] = await db
      .update(instructors)
      .set({
        fullName,
        role,
        specialties: Array.isArray(specialties) ? specialties : specialties.split(",").map((s: string) => s.trim()),
        bio,
        phone,
        email,
        experienceYears: Number(experienceYears),
        isActive: Boolean(isActive),
      })
      .where(eq(instructors.id, Number(id)))
      .returning();

    return NextResponse.json({ ok: true, instructor: updated });
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

    await db.delete(instructors).where(eq(instructors.id, Number(id)));
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
