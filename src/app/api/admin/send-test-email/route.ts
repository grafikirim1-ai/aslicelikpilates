import { NextResponse } from "next/server";
import { queueReminderNotification, queuePaymentOverdueNotification } from "@/lib/email-service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return executeAutomatedTest(req);
}

export async function POST(req: Request) {
  return executeAutomatedTest(req);
}

async function executeAutomatedTest(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const customEmail = searchParams.get("email");
    const previewType = searchParams.get("preview"); // 'reminder' | 'payment'

    // If html preview is requested for browser view
    if (previewType === "payment") {
      const html = queuePaymentOverdueNotification({
        memberId: 999,
        memberName: "Süleyman Bey / Fatih Bey",
        memberEmail: "test@prosigma.net",
        packageName: "Bireysel 16 Seans Reformer",
        totalPrice: 15000,
        paidAmount: 10000,
      });
      return new NextResponse((await html).htmlContent, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (previewType === "reminder") {
      const html = queueReminderNotification({
        memberId: 999,
        memberName: "Süleyman Bey / Fatih Bey",
        memberEmail: "test@prosigma.net",
        sessionTitle: "Reformer Akışı & Omurga Sağlığı",
        dayLabel: "Cuma",
        startTime: "16:00",
        endTime: "16:50",
        coachName: "Aslı Çelik",
      });
      return new NextResponse((await html).htmlContent, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // Default target emails requested by the user
    const targetEmails = customEmail ? [customEmail] : ["suleyman@prosigma.net", "fatih@prosigma.net"];

    const dispatchedLogs = [];

    for (const email of targetEmails) {
      // 1. Send Session Reminder Email
      const reminderResult = await queueReminderNotification({
        memberId: 101,
        memberName: email.includes("suleyman") ? "Süleyman Bey" : "Fatih Bey",
        memberEmail: email,
        sessionTitle: "Özel Reformer Pilates Seansı",
        dayLabel: "Bugün (Cuma)",
        startTime: "16:00",
        endTime: "16:50",
        coachName: "Aslı Çelik",
        location: "Bağlıca Mah. Bağlıca Bulvarı No:75/36 Yalınkılıç İş Merkezi, Etimesgut / Ankara",
      });

      // 2. Send Payment Overdue / Balance Email
      const paymentResult = await queuePaymentOverdueNotification({
        memberId: 102,
        memberName: email.includes("suleyman") ? "Süleyman Bey" : "Fatih Bey",
        memberEmail: email,
        packageName: "Bireysel 16 Seans Reformer",
        totalPrice: 15000,
        paidAmount: 10000,
      });

      dispatchedLogs.push({
        email,
        sessionReminderNotificationId: reminderResult.notif.id,
        paymentOverdueNotificationId: paymentResult.notif.id,
        status: "SUCCESSFULLY_QUEUED_AND_DISPATCHED",
      });
    }

    return NextResponse.json({
      success: true,
      message: `Otonom test e-postaları suleyman@prosigma.net ve fatih@prosigma.net adreslerine başarıyla gönderildi ve veritabanı kayıtlarına işlendi.`,
      dispatchedCount: dispatchedLogs.length * 2, // 2 emails per address
      targetEmails,
      logs: dispatchedLogs,
      previews: {
        sessionReminderPreviewUrl: `/api/admin/send-test-email?preview=reminder`,
        paymentOverduePreviewUrl: `/api/admin/send-test-email?preview=payment`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "E-posta gönderimi başarısız oldu" }, { status: 500 });
  }
}
