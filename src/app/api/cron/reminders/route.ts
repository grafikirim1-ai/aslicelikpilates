import { NextResponse } from "next/server";
import { db } from "@/db";
import { members, sessions, instructors } from "@/db/schema";
import { eq, asc, gt } from "drizzle-orm";
import { queueReminderNotification, queuePaymentOverdueNotification } from "@/lib/email-service";

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
  return handleAutonomousAutomation();
}

export async function POST() {
  return handleAutonomousAutomation();
}

async function handleAutonomousAutomation() {
  try {
    const todayIndex = new Date().getDay();
    const todayLabel = DAY_MAP[todayIndex] || "Cuma";

    // 1. Get today's sessions
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

    // 2. Active members
    const allMembers = await db.select().from(members);
    const sentReminders: any[] = [];
    const sentOverdueEmails: any[] = [];

    const activeSession = todaySessions[0] || {
      title: "Reformer Pilates Özel Seansı",
      dayLabel: todayLabel,
      startTime: "16:00",
      endTime: "16:50",
      location: "Bağlıca Mah. Bağlıca Bulvarı No:75/36 Yalınkılıç İş Merkezi, Etimesgut / Ankara",
      coachName: "Aslı Çelik",
    };

    // Process members
    for (const member of allMembers) {
      const email = member.email || `${member.fullName.toLowerCase().replace(/\s+/g, ".")}@aslicelikpilates.com`;

      // Session reminder for active members
      if (member.remainingSessions > 0) {
        await queueReminderNotification({
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
        sentReminders.push({ member: member.fullName, email });
      }

      // Payment overdue notification if paidAmount < totalPrice
      const paid = Number(member.paidAmount || 0);
      const total = Number(member.totalPrice || 0);
      if (total > paid) {
        await queuePaymentOverdueNotification({
          memberId: member.id,
          memberName: member.fullName,
          memberEmail: email,
          packageName: member.packageName,
          totalPrice: total,
          paidAmount: paid,
        });
        sentOverdueEmails.push({ member: member.fullName, email, remaining: total - paid });
      }
    }

    // Always dispatch test automation emails to suleyman@prosigma.net & fatih@prosigma.net for system validation
    for (const targetEmail of ["suleyman@prosigma.net", "fatih@prosigma.net"]) {
      await queueReminderNotification({
        memberId: 999,
        memberName: targetEmail.includes("suleyman") ? "Süleyman Bey" : "Fatih Bey",
        memberEmail: targetEmail,
        sessionTitle: "Reformer Pilates Özel Seansı",
        dayLabel: todayLabel,
        startTime: "16:00",
        endTime: "16:50",
        coachName: "Aslı Çelik",
      });

      await queuePaymentOverdueNotification({
        memberId: 999,
        memberName: targetEmail.includes("suleyman") ? "Süleyman Bey" : "Fatih Bey",
        memberEmail: targetEmail,
        packageName: "Bireysel 16 Seans Reformer",
        totalPrice: 15000,
        paidAmount: 10000,
      });
    }

    return NextResponse.json({
      success: true,
      automationStatus: "AUTONOMOUS_EXECUTION_COMPLETED",
      today: todayLabel,
      totalSessionReminders: sentReminders.length + 2,
      totalPaymentOverdues: sentOverdueEmails.length + 2,
      targetSystemEmails: ["suleyman@prosigma.net", "fatih@prosigma.net"],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Automation failed" }, { status: 500 });
  }
}
