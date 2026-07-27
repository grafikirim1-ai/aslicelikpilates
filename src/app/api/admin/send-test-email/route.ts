import { NextResponse } from "next/server";
import { queueReminderNotification } from "@/lib/email-service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return sendTest(req);
}

export async function POST(req: Request) {
  return sendTest(req);
}

async function sendTest(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const targetEmail = searchParams.get("email") || "fatih@prosigma.net";
    const wantsPreviewHtml = searchParams.get("preview") === "1" || searchParams.get("html") === "1";

    const result = await queueReminderNotification({
      memberId: 999,
      memberName: "Fatih Bey",
      memberEmail: targetEmail,
      sessionTitle: "Sabah Reformer Flow",
      dayLabel: "Pazartesi",
      startTime: "09:00",
      endTime: "09:50",
      coachName: "Aslı Çelik",
      location: "Bağlıca Mah. Bağlıca Bulvarı No:75/36 Yalınkılıç İş Merkezi, Etimesgut / Ankara",
    });

    if (wantsPreviewHtml) {
      return new NextResponse(result.htmlContent, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Test hatırlatma e-postası '${targetEmail}' adresine başarıyla gönderildi ve bildirimi veritabanına işlendi.`,
      targetEmail,
      notification: result.notif,
      visualPreviewUrl: `/api/admin/send-test-email?email=${encodeURIComponent(targetEmail)}&preview=1`,
      htmlPreview: result.htmlContent,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Test email gönderilemedi" }, { status: 500 });
  }
}
