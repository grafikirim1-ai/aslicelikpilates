import { NextResponse } from "next/server";
import { db } from "@/db";
import { events, members } from "@/db/schema";
import { desc, inArray } from "drizzle-orm";
import { queueEventNotification } from "@/lib/email-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const list = await db.select().from(events).orderBy(desc(events.createdAt));
    return NextResponse.json({ ok: true, events: list });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Etkinlikler getirilemedi" }, { status: 500 });
  }
}

export async function POST(req: Request) {
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
    return NextResponse.json({ error: error.message || "Etkinlik eklenemedi" }, { status: 500 });
  }
}
