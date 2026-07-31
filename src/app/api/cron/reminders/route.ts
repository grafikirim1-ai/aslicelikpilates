import { NextResponse } from "next/server";
import { db } from "@/db";
import { members, sessions, instructors } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import {
  queueReminderNotification,
  queuePaymentOverdueNotification,
  queueLowSessionsNotification,
} from "@/lib/email-service";

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
  return handleAutonomousMemberAutomation();
}

export async function POST() {
  return handleAutonomousMemberAutomation();
}

async function handleAutonomousMemberAutomation() {
  try {
    const todayIndex = new Date().getDay();
    const todayLabel = DAY_MAP[todayIndex] || "Pazartesi";

    // 1. Get today's scheduled sessions with coach info
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

    // Fallback default session if no sessions configured for today
    const activeSession = todaySessions[0] || {
      title: "Reformer Pilates Özel Seansı",
      dayLabel: todayLabel,
      startTime: "09:00",
      endTime: "09:50",
      location: "Bağlıca Mah. Bağlıca Bulvarı No:75/36 Yalınkılıç İş Merkezi, Etimesgut / Ankara",
      coachName: "Aslı Çelik",
    };

    // 2. Get all members from database
    const allMembers = await db.select().from(members);

    const logs = {
      sessionRemindersSent: [] as any[],
      lowSessionsAlertsSent: [] as any[],
      paymentOverdueAlertsSent: [] as any[],
    };

    // Iterate through members and process tailored automated notifications strictly to member's own email
    for (const member of allMembers) {
      if (!member.email || !member.email.includes("@")) {
        continue; // Skip members without a valid personal email
      }

      const targetEmail = member.email.trim();

      // SCENARIO 1: Session Reminder Email (for members with active session rights)
      if (member.remainingSessions > 0) {
        await queueReminderNotification({
          memberId: member.id,
          memberName: member.fullName,
          memberEmail: targetEmail,
          sessionTitle: activeSession.title,
          dayLabel: todayLabel,
          startTime: activeSession.startTime,
          endTime: activeSession.endTime,
          coachName: activeSession.coachName,
          location: activeSession.location,
        });

        logs.sessionRemindersSent.push({
          memberId: member.id,
          memberName: member.fullName,
          targetEmail,
          session: activeSession.title,
        });
      }

      // SCENARIO 2: Low Remaining Sessions Alert Email (<= 2 sessions remaining)
      if (member.remainingSessions <= 2 && member.remainingSessions > 0) {
        await queueLowSessionsNotification({
          memberId: member.id,
          memberName: member.fullName,
          memberEmail: targetEmail,
          packageName: member.packageName,
          remainingSessions: member.remainingSessions,
          totalSessions: member.totalSessions,
        });

        logs.lowSessionsAlertsSent.push({
          memberId: member.id,
          memberName: member.fullName,
          targetEmail,
          remainingSessions: member.remainingSessions,
        });
      }

      // SCENARIO 3: Payment Overdue / Remaining Balance Email (paidAmount < totalPrice)
      const paid = Number(member.paidAmount || 0);
      const total = Number(member.totalPrice || 0);
      if (total > paid) {
        await queuePaymentOverdueNotification({
          memberId: member.id,
          memberName: member.fullName,
          memberEmail: targetEmail,
          packageName: member.packageName,
          totalPrice: total,
          paidAmount: paid,
        });

        logs.paymentOverdueAlertsSent.push({
          memberId: member.id,
          memberName: member.fullName,
          targetEmail,
          remainingBalance: total - paid,
        });
      }
    }

    return NextResponse.json({
      success: true,
      automationStatus: "MEMBER_PERSONALIZED_AUTONOMOUS_EXECUTION_COMPLETED",
      today: todayLabel,
      totalMembersProcessed: allMembers.length,
      summary: {
        sessionRemindersCount: logs.sessionRemindersSent.length,
        lowSessionsAlertsCount: logs.lowSessionsAlertsSent.length,
        paymentOverdueAlertsCount: logs.paymentOverdueAlertsSent.length,
      },
      details: logs,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Autonomous execution failed" }, { status: 500 });
  }
}
