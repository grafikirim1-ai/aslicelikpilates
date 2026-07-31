import { db } from "@/db";
import { notifications } from "@/db/schema";
import nodemailer from "nodemailer";

export type SessionReminderParams = {
  memberId: number;
  memberName: string;
  memberEmail: string;
  sessionTitle: string;
  dayLabel: string;
  startTime: string;
  endTime: string;
  coachName?: string;
  location?: string;
};

export type PaymentOverdueParams = {
  memberId: number;
  memberName: string;
  memberEmail: string;
  packageName: string;
  totalPrice: number;
  paidAmount: number;
  dueDate?: string;
};

function getTransporter() {
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpUser = process.env.SMTP_USER || "aslicelikpilates@gmail.com";
  const smtpPass = process.env.SMTP_PASS || "";

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });
  }
  return null;
}

export function buildSessionReminderHtml(params: SessionReminderParams): string {
  const { memberName, sessionTitle, dayLabel, startTime, endTime, coachName, location } = params;

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bugünkü Pilates Seans Hatırlatması | Aslı Çelik Pilates</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050507; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #f5f3f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #050507; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background-color: #0c0c0e; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; overflow: hidden;">
          
          <tr>
            <td align="center" style="padding: 35px 30px 20px 30px; background-color: #000000; border-bottom: 1px solid rgba(255,255,255,0.06);">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 24px; color: #c9a66b; font-weight: 300; letter-spacing: 2px;">ASLI ÇELİK PILATES</h1>
              <p style="margin: 5px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #bfa38e;">Studio & Reformer Academy</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 35px 30px;">
              <p style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #c9a66b; font-weight: 600;">⏰ Otomatik Seans Hatırlatması</p>
              
              <h2 style="margin: 0 0 18px 0; font-family: Georgia, serif; font-size: 26px; color: #ffffff; font-weight: 300;">
                Sayın <span style="color: #c9a66b;">${memberName}</span>,
              </h2>

              <p style="margin: 0 0 22px 0; font-size: 14px; line-height: 1.7; color: rgba(232, 228, 220, 0.75);">
                Bugün stüdyomuzda planlanmış kişiye özel reformer pilates seansınız bulunmaktadır. Konforlu bir ders deneyimi için seans saatinizden 10 dakika önce stüdyomuzda olmanızı rica ederiz.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(201, 166, 107, 0.08); border: 1px solid rgba(201, 166, 107, 0.3); border-radius: 16px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #bfa38e;">Seans Programı:</span>
                          <p style="margin: 3px 0 0 0; font-family: Georgia, serif; font-size: 19px; color: #ffffff;">${sessionTitle}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #bfa38e;">Tarih / Gün:</span>
                          <p style="margin: 3px 0 0 0; font-size: 15px; color: #f5f3f0; font-weight: 500;">Bugün (${dayLabel})</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #bfa38e;">Seans Saati:</span>
                          <p style="margin: 3px 0 0 0; font-size: 20px; color: #c9a66b; font-weight: 600;">${startTime} — ${endTime}</p>
                        </td>
                      </tr>
                      ${
                        coachName
                          ? `
                      <tr>
                        <td>
                          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #bfa38e;">Eğitmeniniz:</span>
                          <p style="margin: 3px 0 0 0; font-size: 14px; color: #ffffff;">${coachName}</p>
                        </td>
                      </tr>`
                          : ""
                      }
                    </table>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 16px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 18px;">
                    <p style="margin: 0 0 4px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #bfa38e;">Stüdyo Adresi & İletişim</p>
                    <p style="margin: 0 0 6px 0; font-size: 13px; color: #ffffff; line-height: 1.5;">
                      ${location || "Bağlıca Mah. Bağlıca Bulvarı No:75/36 Yalınkılıç İş Merkezi, Etimesgut / Ankara"}
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #c9a66b; font-weight: 500;">
                      İletişim Hattı: 0543 219 42 20
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; color: rgba(232, 228, 220, 0.5); text-align: center; line-height: 1.6;">
                Mazeret veya randevu değişikliği talepleriniz için lütfen seans saatinden en az 4 saat öncesinden bizimle iletişime geçiniz.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 20px 30px; background-color: #000000; border-top: 1px solid rgba(255,255,255,0.06); font-size: 11px; color: rgba(232, 228, 220, 0.4);">
              © Aslı Çelik Pilates Studio — Otomatik Seans Hatırlatma Sistemi
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function buildPaymentOverdueHtml(params: PaymentOverdueParams): string {
  const { memberName, packageName, totalPrice, paidAmount } = params;
  const remaining = Math.max(0, totalPrice - paidAmount);

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ödeme Hatırlatması | Aslı Çelik Pilates</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050507; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #f5f3f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #050507; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background-color: #0c0c0e; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; overflow: hidden;">
          
          <tr>
            <td align="center" style="padding: 35px 30px 20px 30px; background-color: #000000; border-bottom: 1px solid rgba(255,255,255,0.06);">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 24px; color: #c9a66b; font-weight: 300; letter-spacing: 2px;">ASLI ÇELİK PILATES</h1>
              <p style="margin: 5px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #bfa38e;">Studio & Financial Tracking</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 35px 30px;">
              <p style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #f59e0b; font-weight: 600;">💳 Ödeme / Bakiye Hatırlatması</p>
              
              <h2 style="margin: 0 0 18px 0; font-family: Georgia, serif; font-size: 26px; color: #ffffff; font-weight: 300;">
                Sayın <span style="color: #c9a66b;">${memberName}</span>,
              </h2>

              <p style="margin: 0 0 22px 0; font-size: 14px; line-height: 1.7; color: rgba(232, 228, 220, 0.75);">
                Stüdyomuzdaki <strong>${packageName}</strong> üyelik paketinize ait kalan bakiye ödemeniz ile ilgili bilgilendirmedir. Seanslarınızın kesintisiz devam edebilmesi için kalan tutarın tamamlanmasını rica ederiz.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 16px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #bfa38e;">Aktif Üyelik Paketi:</span>
                          <p style="margin: 3px 0 0 0; font-family: Georgia, serif; font-size: 18px; color: #ffffff;">${packageName}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #bfa38e;">Paket Toplam Tutarı:</span>
                          <p style="margin: 3px 0 0 0; font-size: 15px; color: #f5f3f0; font-weight: 500;">${totalPrice.toLocaleString("tr-TR")} TL</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #bfa38e;">Ödenen Tutar:</span>
                          <p style="margin: 3px 0 0 0; font-size: 15px; color: #10b981; font-weight: 500;">${paidAmount.toLocaleString("tr-TR")} TL</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #bfa38e;">Kalan Gecikmiş / Bekleyen Bakiye:</span>
                          <p style="margin: 3px 0 0 0; font-size: 22px; color: #f59e0b; font-weight: 700;">${remaining.toLocaleString("tr-TR")} TL</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 16px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 18px;">
                    <p style="margin: 0 0 4px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #bfa38e;">Ödeme Seçenekleri & IBAN</p>
                    <p style="margin: 0 0 6px 0; font-size: 13px; color: #ffffff; line-height: 1.5;">
                      Stüdyomuzda Kredi Kartı, Nakit veya Havale / EFT ile ödemelerinizi yapabilirsiniz.
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #c9a66b; font-weight: 500;">
                      Bilgi ve Destek için: 0543 219 42 20
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; color: rgba(232, 228, 220, 0.5); text-align: center; line-height: 1.6;">
                Ödemenizi gerçekleştirdiyseniz lütfen bu bildirimi dikkate almayınız. Teşekkür ederiz.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 20px 30px; background-color: #000000; border-top: 1px solid rgba(255,255,255,0.06); font-size: 11px; color: rgba(232, 228, 220, 0.4);">
              © Aslı Çelik Pilates Studio — Otomatik Finans Takip Sistemi
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function queueReminderNotification(params: SessionReminderParams) {
  const htmlContent = buildSessionReminderHtml(params);
  const transporter = getTransporter();

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Aslı Çelik Pilates" <${process.env.SMTP_USER}>`,
        to: params.memberEmail,
        subject: `⏰ Bugünkü Pilates Seansınız Var: ${params.sessionTitle} (${params.startTime})`,
        html: htmlContent,
      });
    } catch (err: any) {
      console.error("SMTP error sending session reminder:", err);
    }
  }

  const [notif] = await db
    .insert(notifications)
    .values({
      channel: "email",
      recipient: params.memberEmail || params.memberName,
      title: `Seans Hatırlatması: ${params.sessionTitle} (${params.startTime})`,
      message: `Sayın ${params.memberName}, bugün saat ${params.startTime} - ${params.endTime} arasında ${params.sessionTitle} seansınız bulunmaktadır.`,
      eventType: "morning_reminder",
      status: "sent",
    })
    .returning();

  return { notif, htmlContent };
}

export async function queuePaymentOverdueNotification(params: PaymentOverdueParams) {
  const htmlContent = buildPaymentOverdueHtml(params);
  const transporter = getTransporter();

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Aslı Çelik Pilates Financial" <${process.env.SMTP_USER}>`,
        to: params.memberEmail,
        subject: `💳 Ödeme Bakiye Hatırlatması: ${params.packageName}`,
        html: htmlContent,
      });
    } catch (err: any) {
      console.error("SMTP error sending payment overdue email:", err);
    }
  }

  const remaining = Math.max(0, params.totalPrice - params.paidAmount);

  const [notif] = await db
    .insert(notifications)
    .values({
      channel: "email",
      recipient: params.memberEmail || params.memberName,
      title: `Ödeme Hatırlatması: ${params.packageName}`,
      message: `Sayın ${params.memberName}, ${params.packageName} paketiniz için kalan ${remaining} TL bakiye hatırlatması gönderildi.`,
      eventType: "payment_overdue",
      status: "sent",
    })
    .returning();

  return { notif, htmlContent };
}
