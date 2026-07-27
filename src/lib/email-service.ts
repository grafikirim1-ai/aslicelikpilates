import { db } from "@/db";
import { notifications } from "@/db/schema";

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
          
          <!-- Header Logo -->
          <tr>
            <td align="center" style="padding: 40px 30px 20px 30px; background-color: #000000; border-bottom: 1px solid rgba(255,255,255,0.06);">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 26px; color: #c9a66b; font-weight: 300; letter-spacing: 2px;">ASLI ÇELİK PILATES</h1>
              <p style="margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #bfa38e;">Studio & Reformer Academy</p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 40px 35px;">
              <p style="margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #c9a66b; font-weight: 600;">Seans Hatırlatması</p>
              
              <h2 style="margin: 0 0 20px 0; font-family: Georgia, serif; font-size: 28px; color: #ffffff; font-weight: 300;">
                Günaydın Sayın <span style="color: #c9a66b;">${memberName}</span>,
              </h2>

              <p style="margin: 0 0 25px 0; font-size: 15px; line-height: 1.7; color: rgba(232, 228, 220, 0.7);">
                Bugün stüdyomuzda planlanmış reformer pilates seansınız bulunmaktadır. Ders saatinizden 10 dakika önce stüdyomuzda olmanızı rica ederiz.
              </p>

              <!-- Session Details Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(201, 166, 107, 0.08); border: 1px solid rgba(201, 166, 107, 0.3); border-radius: 16px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <span style="font-size: 11px; uppercase; letter-spacing: 2px; color: #bfa38e;">Ders / Seans:</span>
                          <p style="margin: 4px 0 0 0; font-family: Georgia, serif; font-size: 20px; color: #ffffff;">${sessionTitle}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <span style="font-size: 11px; uppercase; letter-spacing: 2px; color: #bfa38e;">Tarih & Gün:</span>
                          <p style="margin: 4px 0 0 0; font-size: 16px; color: #f5f3f0; font-weight: 500;">Bugün (${dayLabel})</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <span style="font-size: 11px; uppercase; letter-spacing: 2px; color: #bfa38e;">Seans Saati:</span>
                          <p style="margin: 4px 0 0 0; font-size: 22px; color: #c9a66b; font-weight: 600;">${startTime} — ${endTime}</p>
                        </td>
                      </tr>
                      ${
                        coachName
                          ? `
                      <tr>
                        <td>
                          <span style="font-size: 11px; uppercase; letter-spacing: 2px; color: #bfa38e;">Eğitmen:</span>
                          <p style="margin: 4px 0 0 0; font-size: 15px; color: #ffffff;">${coachName}</p>
                        </td>
                      </tr>`
                          : ""
                      }
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Location & Address Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 16px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 5px 0; font-size: 11px; uppercase; letter-spacing: 2px; color: #bfa38e;">Stüdyo Adresi & İletişim</p>
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #ffffff; line-height: 1.5;">
                      ${location || "Bağlıca Mah. Bağlıca Bulvarı No:75/36 Yalınkılıç İş Merkezi, Etimesgut / Ankara"}
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #c9a66b; font-weight: 500;">
                      Telefon: 0543 219 42 20
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; color: rgba(232, 228, 220, 0.5); text-align: center; line-height: 1.6;">
                Seans saatinde değişiklik veya mazeret bildirmek için lütfen en az 4 saat öncesinden bizimle iletişime geçiniz.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 25px 30px; background-color: #000000; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: rgba(232, 228, 220, 0.4);">
              © Aslı Çelik Pilates Studio — Otomatik Seans Bilgilendirme Sistemi
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

  const [notif] = await db
    .insert(notifications)
    .values({
      channel: "email",
      recipient: params.memberEmail || params.memberName,
      title: `Bugün Seansınız Var: ${params.sessionTitle} (${params.startTime})`,
      message: `Sayın ${params.memberName}, bugün saat ${params.startTime} - ${params.endTime} arasında ${params.sessionTitle} seansınız bulunmaktadır.`,
      eventType: "morning_reminder",
      status: "sent",
    })
    .returning();

  return { notif, htmlContent };
}
