import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { sessions } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, sessionType, level, dayLabel, weekday, startTime, endTime, capacity, location, description, instructorId, isPrivate, memberId, memberName } = body;

    const slug = `${(title || "seans").toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}`;

    const [inserted] = await db
      .insert(sessions)
      .values({
        slug,
        title,
        sessionType: sessionType || "Reformer Pilates",
        level: level || "Tüm Seviyeler",
        dayLabel,
        weekday: Number(weekday) || 1,
        startTime,
        endTime,
        capacity: Number(capacity) || 6,
        location: location || "Bağlıca Stüdyo",
        description: description || "",
        instructorId: Number(instructorId) || 1,
        isFeatured: true,
        isPrivate: Boolean(isPrivate),
        memberId: memberId ? Number(memberId) : null,
        memberName: memberName || null,
        isActive: true,
      })
      .returning();

    return NextResponse.json({ ok: true, session: inserted });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, dayLabel, weekday, startTime, endTime, capacity, location, description, isActive, isPrivate, memberId, memberName } = body;

    const [updated] = await db
      .update(sessions)
      .set({
        title,
        dayLabel,
        weekday: Number(weekday),
        startTime,
        endTime,
        capacity: Number(capacity),
        location,
        description,
        isPrivate: Boolean(isPrivate),
        memberId: memberId ? Number(memberId) : null,
        memberName: memberName || null,
        isActive: Boolean(isActive),
      })
      .where(eq(sessions.id, Number(id)))
      .returning();

    return NextResponse.json({ ok: true, session: updated });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ ok: false, error: "ID required" }, { status: 400 });

    await db.delete(sessions).where(eq(sessions.id, Number(id)));
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
