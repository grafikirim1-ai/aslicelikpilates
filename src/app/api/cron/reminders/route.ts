import { NextResponse } from "next/server";
import { db } from "@/db";
import { members, sessions, instructors } from "@/db/schema";
import { eq, asc, gt } from "drizzle-orm";
import { queueReminderNotification } from "@/lib/email-service";

export const dynamic = "force-dynamic";

const DAY_MAP: Record<number, string> = {
  0: "Pazar",
  1: "Pazartesi",
  2: "Salı",
  3: "Çarşamba",
  4: "Perşembe",
  5: "Cuma",
  6: "Cumartesi",
};

export async function GET() {
  return handleReminders();
}

export async function POST() {
  return handleReminders();
}

async function handleReminders() {
  try {
    const todayIndex = new Date().getDay();
    const todayLabel = DAY_MAP[todayIndex] || "Pazartesi";

    // 1. Get today's scheduled sessions with coach details
    const todaySessions = await db
      .select({
        id: sessions.id,
        title: sessions.title,
        dayLabel: sessions.dayLabel,
        startTime: sessions.startTime,
        endTime: sessions.endTime,
        location: sessions.location,
        coachName: instructors.fullName,
      })
      .from(sessions)
      .innerJoin(instructors, eq(sessions.instructorId, instructors.id))
      .where(eq(sessions.dayLabel, todayLabel))
      .orderBy(asc(sessions.startTime));

    // 2. Get active members who have remaining sessions (>0)
    const activeMembers = await db
      .select()
      .from(members)
      .where(gt(members.remainingSessions, 0));

    const sentReminders: any[] = [];

    // If today is Sunday or no sessions, fallback to notifying active members with next upcoming session
    const activeSession = todaySessions[0] || {
      title: "Reformer Pilates Seansı",
      dayLabel: todayLabel,
      startTime: "09:00",
      endTime: "09:50",
      location: "Bağlıca Mah. Bağlıca Bulvarı No:75/36 Yalınkılıç İş Merkezi, Etimesgut / Ankara",
      coachName: "Aslı Çelik",
    };

    for (const member of activeMembers) {
      const email = member.email || `${member.fullName.toLowerCase().replace(/\s+/g, ".")}@aslicelikpilates.com`;

      const result = await queueReminderNotification({
        memberId: member.id,
        memberName: member.fullName,
        memberEmail: email,
        sessionTitle: activeSession.title,
        dayLabel: todayLabel,
        startTime: activeSession.startTime,
        endTime: activeSession.endTime,
        coachName: activeSession.coachName,
        location: activeSession.location,
      });

      sentReminders.push({
        memberId: member.id,
        memberName: member.fullName,
        recipientEmail: email,
        session: activeSession.title,
        time: `${activeSession.startTime} - ${activeSession.endTime}`,
        status: "GÖNDERİLDİ",
      });
    }

    return NextResponse.json({
      success: true,
      today: todayLabel,
      totalRemindersSent: sentReminders.length,
      sentReminders,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Reminders failed" }, { status: 500 });
  }
}
