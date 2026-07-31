import { db } from "@/db";
import { notifications } from "@/db/schema";
import nodemailer from "nodemailer";

// Type Definitions
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
};

export type WelcomeMemberParams = {
  memberId: number;
  memberName: string;
  memberEmail: string;
  packageName: string;
  totalSessions: number;
  instructorName?: string;
};

export type LowSessionsParams = {
  memberId: number;
  memberName: string;
  memberEmail: string;
  packageName: string;
  remainingSessions: number;
  totalSessions: number;
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

// 1. WELCOME EMAIL TEMPLATE (Yeni Üye Karşılama)
export function buildWelcomeHtml(params: WelcomeMemberParams): string {
  const { memberName, packageName, totalSessions, instructorName } = params;

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Aslı Çelik Pilates Ailesine Hoş Geldiniz</title>
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
              <p style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #c9a66b; font-weight: 600;">✨ Ailemize Hoş Geldiniz</p>
              <h2 style="margin: 0 0 18px 0; font-family: Georgia, serif; font-size: 26px; color: #ffffff; font-weight: 300;">
                Sevgili <span style="color: #c9a66b;">${memberName}</span>,
              </h2>
              <p style="margin: 0 0 22px 0; font-size: 14px; line-height: 1.7; color: rgba(232, 228, 220, 0.75);">
                Stüdyomuza üyelik kaydınız başarıyla tamamlanmıştır. Sağlıklı bir beden, duruş düzeltme ve özel pilates yolculuğunuzda sizinle birlikte olmaktan mutluluk duyuyoruz.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(201, 166, 107, 0.08); border: 1px solid rgba(201, 166, 107, 0.3); border-radius: 16px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #bfa38e;">Üyelik Detaylarınız</p>
                    <p style="margin: 0 0 4px 0; font-size: 16px; color: #ffffff;"><strong>Paketiniz:</strong> ${packageName}</p>
                    <p style="margin: 0 0 4px 0; font-size: 15px; color: #c9a66b;"><strong>Seans Hakkınız:</strong> ${totalSessions} Seans</p>
                    ${instructorName ? `<p style="margin: 0; font-size: 14px; color: #f5f3f0;"><strong>Eğitmeniniz:</strong> ${instructorName}</p>` : ""}
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 20px 0; font-size: 13px; color: rgba(232, 228, 220, 0.6); line-height: 1.6;">
                Seans takviminizi ve kalan ders haklarınızı stüdyomuz üzerinden kolayca takip edebilirsiniz. İlk derse gelmeden 10 dakika önce stüdyomuzda hazır bulunmanızı rica ederiz.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 30px; background-color: #000000; border-top: 1px solid rgba(255,255,255,0.06); font-size: 11px; color: rgba(232, 228, 220, 0.4);">
              © Aslı Çelik Pilates Studio — Karşılama ve Bilgilendirme Sistemi
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

// 2. LOW SEESSIONS / RENEWAL TEMPLATE (Seansı Bitiyor / Yenileme Uyarısı)
export function buildLowSessionsHtml(params: LowSessionsParams): string {
  const { memberName, packageName, remainingSessions, totalSessions } = params;

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Seanslarınız Bitmek Üzere | Aslı Çelik Pilates</title>
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
              <p style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #f59e0b; font-weight: 600;">⚠️ Paket Yenileme & Seans Uyarısı</p>
              <h2 style="margin: 0 0 18px 0; font-family: Georgia, serif; font-size: 26px; color: #ffffff; font-weight: 300;">
                Sayın <span style="color: #c9a66b;">${memberName}</span>,
              </h2>
              <p style="margin: 0 0 22px 0; font-size: 14px; line-height: 1.7; color: rgba(232, 228, 220, 0.75);">
                <strong>${packageName}</strong> paketinizde seanslarınız bitmek üzere! Gelişimizin ve kas hafızanızın kesintiye uğramaması için yeni paket yüklemenizi önceden planlayabilirsiniz.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 16px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #bfa38e;">Kalan Seans Sayınız</span>
                    <p style="margin: 6px 0 0 0; font-family: Georgia, serif; font-size: 32px; color: #f59e0b; font-weight: 700;">
                      ${remainingSessions} / ${totalSessions} Seans Kalan
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; color: rgba(232, 228, 220, 0.6); text-align: center; line-height: 1.6;">
                Eğitmeniniz veya stüdyo danışmanımızla görüşerek yeni paket yenilemenizi yapabilir, ders saatlerinizi ayırtmaya devam edebilirsiniz.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 30px; background-color: #000000; border-top: 1px solid rgba(255,255,255,0.06); font-size: 11px; color: rgba(232, 228, 220, 0.4);">
              © Aslı Çelik Pilates Studio — Otomatik Seans Takip Sistemi
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

// 3. SESSION REMINDER TEMPLATE
export function buildSessionReminderHtml(params: SessionReminderParams): string {
  const { memberName, sessionTitle, dayLabel, startTime, endTime, coachName, location } = params;

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
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
                Bugün stüdyomuzda planlanmış reformer pilates seansınız bulunmaktadır. Ders saatinizden 10 dakika önce stüdyomuzda olmanızı rica ederiz.
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
                      ${coachName ? `<tr><td><span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #bfa38e;">Eğitmeniniz:</span><p style="margin: 3px 0 0 0; font-size: 14px; color: #ffffff;">${coachName}</p></td></tr>` : ""}
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

// 4. PAYMENT OVERDUE TEMPLATE
export function buildPaymentOverdueHtml(params: PaymentOverdueParams): string {
  const { memberName, packageName, totalPrice, paidAmount } = params;
  const remaining = Math.max(0, totalPrice - paidAmount);

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
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
                Stüdyomuzdaki <strong>${packageName}</strong> üyelik paketinize ait kalan bakiye ödemeniz ile ilgili bilgilendirmedir.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 16px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #bfa38e;">Bakiye Durumu:</p>
                    <p style="margin: 0 0 4px 0; font-size: 15px; color: #ffffff;">Paket: ${packageName}</p>
                    <p style="margin: 0 0 4px 0; font-size: 14px; color: #10b981;">Ödenen: ${paidAmount.toLocaleString("tr-TR")} TL / ${totalPrice.toLocaleString("tr-TR")} TL</p>
                    <p style="margin: 6px 0 0 0; font-size: 20px; color: #f59e0b; font-weight: 700;">Kalan Borç: ${remaining.toLocaleString("tr-TR")} TL</p>
                  </td>
                </tr>
              </table>
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

// ---- DISPATCH SERVICE FUNCTIONS (Sends directly to member's email) ----

export async function queueWelcomeNotification(params: WelcomeMemberParams) {
  if (!params.memberEmail) return null;
  const htmlContent = buildWelcomeHtml(params);
  const transporter = getTransporter();

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Aslı Çelik Pilates" <${process.env.SMTP_USER}>`,
        to: params.memberEmail,
        subject: `✨ Aslı Çelik Pilates Ailesine Hoş Geldiniz, Sayın ${params.memberName}`,
        html: htmlContent,
      });
    } catch (err: any) {
      console.error("SMTP Welcome Error:", err);
    }
  }

  const [notif] = await db
    .insert(notifications)
    .values({
      channel: "email",
      recipient: params.memberEmail,
      title: `Hoş Geldiniz: ${params.memberName}`,
      message: `Sayın ${params.memberName}, ${params.packageName} paketi kaydınız yapılmıştır.`,
      eventType: "welcome_member",
      status: "sent",
    })
    .returning();

  return { notif, htmlContent };
}

export async function queueLowSessionsNotification(params: LowSessionsParams) {
  if (!params.memberEmail) return null;
  const htmlContent = buildLowSessionsHtml(params);
  const transporter = getTransporter();

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Aslı Çelik Pilates" <${process.env.SMTP_USER}>`,
        to: params.memberEmail,
        subject: `⚠️ Seanslarınız Bitmek Üzere (${params.remainingSessions} Seans Kalan): ${params.packageName}`,
        html: htmlContent,
      });
    } catch (err: any) {
      console.error("SMTP Low Sessions Error:", err);
    }
  }

  const [notif] = await db
    .insert(notifications)
    .values({
      channel: "email",
      recipient: params.memberEmail,
      title: `Seans Uyarısı: ${params.remainingSessions} Seans Kalan`,
      message: `Sayın ${params.memberName}, ${params.packageName} paketinizde son ${params.remainingSessions} seansınız kalmıştır.`,
      eventType: "low_sessions_alert",
      status: "sent",
    })
    .returning();

  return { notif, htmlContent };
}

export async function queueReminderNotification(params: SessionReminderParams) {
  if (!params.memberEmail) return null;
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
      console.error("SMTP Session Reminder Error:", err);
    }
  }

  const [notif] = await db
    .insert(notifications)
    .values({
      channel: "email",
      recipient: params.memberEmail,
      title: `Seans Hatırlatması: ${params.sessionTitle} (${params.startTime})`,
      message: `Sayın ${params.memberName}, bugün saat ${params.startTime} - ${params.endTime} arasında ${params.sessionTitle} seansınız bulunmaktadır.`,
      eventType: "morning_reminder",
      status: "sent",
    })
    .returning();

  return { notif, htmlContent };
}

export async function queuePaymentOverdueNotification(params: PaymentOverdueParams) {
  if (!params.memberEmail) return null;
  const htmlContent = buildPaymentOverdueHtml(params);
  const transporter = getTransporter();

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Aslı Çelik Pilates" <${process.env.SMTP_USER}>`,
        to: params.memberEmail,
        subject: `💳 Ödeme / Bakiye Hatırlatması: ${params.packageName}`,
        html: htmlContent,
      });
    } catch (err: any) {
      console.error("SMTP Payment Overdue Error:", err);
    }
  }

  const remaining = Math.max(0, params.totalPrice - params.paidAmount);

  const [notif] = await db
    .insert(notifications)
    .values({
      channel: "email",
      recipient: params.memberEmail,
      title: `Ödeme Hatırlatması: ${params.packageName}`,
      message: `Sayın ${params.memberName}, ${params.packageName} paketiniz için kalan ${remaining} TL bakiye hatırlatması gönderildi.`,
      eventType: "payment_overdue",
      status: "sent",
    })
    .returning();

  return { notif, htmlContent };
}

// 5. INSTANT MEMBER APPROVAL EMAIL (Üyeye Eğitmen Ataması ve Kayıt Onay Maili)
export async function queueMemberApprovalNotification(params: {
  memberEmail: string;
  memberName: string;
  packageName: string;
  instructorName: string;
}) {
  if (!params.memberEmail) return null;

  const htmlContent = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Üye Kaydınız & Eğitmen Atamanız Onaylandı | Aslı Çelik Pilates</title>
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
              <p style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #10b981; font-weight: 600;">✅ Kaydınız & Eğitmen Atamanız Onaylandı</p>
              <h2 style="margin: 0 0 18px 0; font-family: Georgia, serif; font-size: 26px; color: #ffffff; font-weight: 300;">
                Sayın <span style="color: #c9a66b;">${params.memberName}</span>,
              </h2>
              <p style="margin: 0 0 22px 0; font-size: 14px; line-height: 1.7; color: rgba(232, 228, 220, 0.75);">
                Stüdyomuza yaptığınız üyelik başvurusu ve kayıt onaylanmış olup kişisel reformer pilates eğitmeniniz atanmıştır!
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 16px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #bfa38e;">Atama Bilgileri</p>
                    <p style="margin: 0 0 6px 0; font-size: 18px; color: #ffffff;"><strong>Atanan Eğitmeniniz:</strong> <span style="color: #c9a66b;">${params.instructorName}</span></p>
                    <p style="margin: 0; font-size: 14px; color: #f5f3f0;"><strong>Paketiniz:</strong> ${params.packageName}</p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; color: rgba(232, 228, 220, 0.6); text-align: center; line-height: 1.6;">
                İlk seans saatlerinizi belirlemek ve ders takvimi oluşturmak için eğitmeniniz veya stüdyo danışmanımız sizinle kısa süre içinde iletişime geçecektir.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 30px; background-color: #000000; border-top: 1px solid rgba(255,255,255,0.06); font-size: 11px; color: rgba(232, 228, 220, 0.4);">
              © Aslı Çelik Pilates Studio — Otomatik Anlık Atama Bildirim Sistemi
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Aslı Çelik Pilates" <${process.env.SMTP_USER}>`,
        to: params.memberEmail,
        subject: `✅ Kaydınız ve Eğitmeniniz Onaylandı: ${params.instructorName}`,
        html: htmlContent,
      });
    } catch (err: any) {
      console.error("SMTP Member Approval Email Error:", err);
    }
  }

  const [notif] = await db
    .insert(notifications)
    .values({
      channel: "email",
      recipient: params.memberEmail,
      title: `Eğitmen Ataması Onaylandı: ${params.instructorName}`,
      message: `Sayın ${params.memberName}, ${params.instructorName} eğitmeniniz olarak atanmış ve kaydınız onaylanmıştır.`,
      eventType: "member_approved",
      status: "sent",
    })
    .returning();

  return { notif, htmlContent };
}

// 6. INSTANT INSTRUCTOR ASSIGNMENT EMAIL (Eğitmene Yeni Öğrenci Atama Maili)
export async function queueInstructorAssignmentNotification(params: {
  instructorEmail: string;
  instructorName: string;
  memberName: string;
  memberPhone: string;
  packageName: string;
  notes?: string | null;
}) {
  if (!params.instructorEmail) return null;

  const htmlContent = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Yeni Pilates Öğrencisi Atandı | Aslı Çelik Pilates</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050507; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #f5f3f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #050507; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background-color: #0c0c0e; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; overflow: hidden;">
          <tr>
            <td align="center" style="padding: 35px 30px 20px 30px; background-color: #000000; border-bottom: 1px solid rgba(255,255,255,0.06);">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 24px; color: #c9a66b; font-weight: 300; letter-spacing: 2px;">ASLI ÇELİK PILATES</h1>
              <p style="margin: 5px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #bfa38e;">Instructor Management Portal</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 35px 30px;">
              <p style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #c9a66b; font-weight: 600;">🏋️‍♂️ Yeni Öğrenci Ataması</p>
              <h2 style="margin: 0 0 18px 0; font-family: Georgia, serif; font-size: 26px; color: #ffffff; font-weight: 300;">
                Merhaba <span style="color: #c9a66b;">${params.instructorName}</span>,
              </h2>
              <p style="margin: 0 0 22px 0; font-size: 14px; line-height: 1.7; color: rgba(232, 228, 220, 0.75);">
                Stüdyo yönetimi tarafından kadronuza yeni bir pilates öğrencisi atanmıştır. Üye detayları aşağıdadır:
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(201, 166, 107, 0.08); border: 1px solid rgba(201, 166, 107, 0.3); border-radius: 16px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 6px 0; font-size: 18px; color: #ffffff;"><strong>Üye Adı:</strong> ${params.memberName}</p>
                    <p style="margin: 0 0 6px 0; font-size: 14px; color: #c9a66b;"><strong>Telefon:</strong> ${params.memberPhone}</p>
                    <p style="margin: 0 0 6px 0; font-size: 14px; color: #f5f3f0;"><strong>Paket:</strong> ${params.packageName}</p>
                    ${params.notes ? `<p style="margin: 6px 0 0 0; font-size: 13px; color: rgba(232, 228, 220, 0.8); font-style: italic;"><strong>Sağlık / Seans Notu:</strong> "${params.notes}"</p>` : ""}
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; color: rgba(232, 228, 220, 0.6); text-align: center; line-height: 1.6;">
                Yönetim panelinize giriş yaparak üyeleriniz sekmesinden ders takibini ve seans düşümlerini gerçekleştirebilirsiniz.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 30px; background-color: #000000; border-top: 1px solid rgba(255,255,255,0.06); font-size: 11px; color: rgba(232, 228, 220, 0.4);">
              © Aslı Çelik Pilates Studio — Eğitmen Otomasyon Portalı
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Aslı Çelik Pilates" <${process.env.SMTP_USER}>`,
        to: params.instructorEmail,
        subject: `🏋️‍♂️ Yeni Pilates Öğrencisi Atandı: ${params.memberName}`,
        html: htmlContent,
      });
    } catch (err: any) {
      console.error("SMTP Instructor Assignment Email Error:", err);
    }
  }

  const [notif] = await db
    .insert(notifications)
    .values({
      channel: "email",
      recipient: params.instructorEmail,
      title: `Yeni Öğrenci Atandı: ${params.memberName}`,
      message: `Sayın ${params.instructorName}, ${params.memberName} adlı yeni üye kadronuza atanmıştır.`,
      eventType: "instructor_assigned",
      status: "sent",
    })
    .returning();

  return { notif, htmlContent };
}

