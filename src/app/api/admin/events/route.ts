import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { events, members } from "@/db/schema";
import { desc, inArray } from "drizzle-orm";
import { queueEventNotification } from "@/lib/email-service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const list = await db.select().from(events).orderBy(desc(events.createdAt));
    return NextResponse.json({ ok: true, events: list });
  } catch (error: any) {
    return NextResponse.json({ error: "İşlem tamamlanamadı." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const body = await req.json();
    const {
      title,
      description,
      eventDate,
      startTime,
      endTime,
      location,
      recipientType, // 'all' | 'selected'
      selectedMemberIds, // Array<number>
    } = body;

    if (!title || !description || !eventDate || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Etkinlik başlığı, açıklama, tarih ve saatler zorunludur." },
        { status: 400 }
      );
    }

    if ([title, description, eventDate, startTime, endTime].some((value) => typeof value !== "string") || title.length > 200 || description.length > 5000 || (location !== undefined && (typeof location !== "string" || location.length > 255)) || !["all", "selected"].includes(recipientType) || (recipientType === "selected" && (!Array.isArray(selectedMemberIds) || !selectedMemberIds.length || selectedMemberIds.length > 500 || selectedMemberIds.some((id: unknown) => !Number.isSafeInteger(id) || Number(id) <= 0)))) {
      return NextResponse.json({ error: "Etkinlik ve alıcı bilgilerini kontrol edin." }, { status: 400 });
    }

    let targetMembers: any[] = [];

    if (recipientType === "selected" && Array.isArray(selectedMemberIds) && selectedMemberIds.length > 0) {
      targetMembers = await db
        .select()
        .from(members)
        .where(inArray(members.id, selectedMemberIds));
    } else {
      // Default: All active members
      targetMembers = await db.select().from(members);
    }

    const eventLocation = location || "Aslı Çelik Pilates Studio";

    const [newEvent] = await db
      .insert(events)
      .values({
        title: title.trim(),
        description: description.trim(),
        eventDate: eventDate.trim(),
        startTime: startTime.trim(),
        endTime: endTime.trim(),
        location: eventLocation.trim(),
        recipientType: recipientType === "selected" ? "selected" : "all",
        recipientCount: targetMembers.length,
        status: "sent",
      })
      .returning();

    // Dispatch emails to each targeted member's own email
    const dispatchedLogs = [];
    for (const member of targetMembers) {
      if (member.email && member.email.includes("@")) {
        await queueEventNotification({
          memberEmail: member.email.trim(),
          memberName: member.fullName,
          eventTitle: title.trim(),
          eventDate: eventDate.trim(),
          startTime: startTime.trim(),
          endTime: endTime.trim(),
          location: eventLocation.trim(),
          description: description.trim(),
        });
        dispatchedLogs.push({ id: member.id, name: member.fullName, email: member.email });
      }
    }

    return NextResponse.json({
      ok: true,
      event: newEvent,
      message: `Etkinlik oluşturuldu ve ${dispatchedLogs.length} üyeye e-posta ile davet gönderildi.`,
      dispatchedCount: dispatchedLogs.length,
      dispatchedLogs,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "İşlem tamamlanamadı." }, { status: 500 });
  }
}
