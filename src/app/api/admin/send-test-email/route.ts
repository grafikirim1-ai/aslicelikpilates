import { NextResponse } from "next/server";
import {
  queueWelcomeNotification,
  queueLowSessionsNotification,
  queueReminderNotification,
  queuePaymentOverdueNotification,
} from "@/lib/email-service";
import { db } from "@/db";
import { members } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return executeEmailTest(req);
}

export async function POST(req: Request) {
  return executeEmailTest(req);
}

async function executeEmailTest(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const targetEmail = searchParams.get("email");
    const previewType = searchParams.get("preview"); // 'welcome' | 'low_sessions' | 'reminder' | 'payment'

    // HTML Previews for testing design in browser
    if (previewType === "welcome") {
      const result = await queueWelcomeNotification({
        memberId: 999,
        memberName: "Selin Yılmaz",
        memberEmail: targetEmail || "selin@example.com",
        packageName: "Bireysel 8 Seans Reformer",
        totalSessions: 8,
        instructorName: "Aslı Çelik",
      });
      return new NextResponse(result?.htmlContent, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (previewType === "low_sessions") {
      const result = await queueLowSessionsNotification({
        memberId: 999,
        memberName: "Selin Yılmaz",
        memberEmail: targetEmail || "selin@example.com",
        packageName: "Bireysel 8 Seans Reformer",
        remainingSessions: 1,
        totalSessions: 8,
      });
      return new NextResponse(result?.htmlContent, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (previewType === "payment") {
      const result = await queuePaymentOverdueNotification({
        memberId: 999,
        memberName: "Selin Yılmaz",
        memberEmail: targetEmail || "selin@example.com",
        packageName: "Bireysel 16 Seans Reformer",
        totalPrice: 15000,
        paidAmount: 10000,
      });
      return new NextResponse(result?.htmlContent, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (previewType === "reminder") {
      const result = await queueReminderNotification({
        memberId: 999,
        memberName: "Selin Yılmaz",
        memberEmail: targetEmail || "selin@example.com",
        sessionTitle: "Reformer Akışı & Omurga Sağlığı",
        dayLabel: "Cuma",
        startTime: "16:00",
        endTime: "16:50",
        coachName: "Aslı Çelik",
      });
      return new NextResponse(result?.htmlContent, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // If specific email is passed, dispatch tailored test to that email
    if (targetEmail) {
      const welcome = await queueWelcomeNotification({
        memberId: 999,
        memberName: "Değerli Üyemiz",
        memberEmail: targetEmail,
        packageName: "Bireysel 8 Seans Reformer",
        totalSessions: 8,
      });

      const low = await queueLowSessionsNotification({
        memberId: 999,
        memberName: "Değerli Üyemiz",
        memberEmail: targetEmail,
        packageName: "Bireysel 8 Seans Reformer",
        remainingSessions: 2,
        totalSessions: 8,
      });

      return NextResponse.json({
        success: true,
        message: `Üyeye özel e-posta testleri '${targetEmail}' adresine gönderildi.`,
        welcomeNotificationId: welcome?.notif?.id,
        lowSessionsNotificationId: low?.notif?.id,
      });
    }

    // Default: Dispatch strictly to registered DB members with emails
    const dbMembers = await db.select().from(members);
    const dispatchedMembers = [];

    for (const m of dbMembers) {
      if (m.email && m.email.includes("@")) {
        if (m.remainingSessions <= 2 && m.remainingSessions > 0) {
          await queueLowSessionsNotification({
            memberId: m.id,
            memberName: m.fullName,
            memberEmail: m.email,
            packageName: m.packageName,
            remainingSessions: m.remainingSessions,
            totalSessions: m.totalSessions,
          });
        }
        dispatchedMembers.push({ id: m.id, name: m.fullName, email: m.email });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Tüm kayıtlı üyelerin kendi e-posta adreslerine otonom bildirimler gönderildi.`,
      membersProcessedCount: dispatchedMembers.length,
      dispatchedMembers,
      previews: {
        welcomeEmailPreview: `/api/admin/send-test-email?preview=welcome`,
        lowSessionsEmailPreview: `/api/admin/send-test-email?preview=low_sessions`,
        sessionReminderPreview: `/api/admin/send-test-email?preview=reminder`,
        paymentOverduePreview: `/api/admin/send-test-email?preview=payment`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "E-posta gönderimi başarısız" }, { status: 500 });
  }
}
