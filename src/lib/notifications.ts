import { db } from "@/db";
import { notifications } from "@/db/schema";
import nodemailer from "nodemailer";

function studioEmail() {
  return process.env.STUDIO_NOTIFICATION_EMAIL ?? "asliclk80@hotmail.com";
}

function studioWhatsapp() {
  return process.env.STUDIO_NOTIFICATION_WHATSAPP ?? "+90 555 000 00 00";
}

export async function queueLeadNotifications(input: {
  inquiryId: number;
  fullName: string;
  phone: string;
  email: string;
  goal: string;
  preferredPackage?: string | null;
  wantsWhatsapp: boolean;
}) {
  const leadReply = `Merhaba ${input.fullName}, Aslı Çelik Pilates ailesine hoş geldiniz. ${input.preferredPackage ? `${input.preferredPackage} için` : "Size uygun paket için"} en kısa sürede dönüş yapacağız.`;

  const targetStudioEmail = studioEmail();

  // Try to send real email to studio if SMTP is configured
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  let emailSent = false;
  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"Aslı Çelik Pilates Web" <${smtpUser}>`,
        to: targetStudioEmail,
        subject: `Yeni Ücretsiz Ön Görüşme Talebi: ${input.fullName}`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #0a0f14; color: #f5f3f0; padding: 24px; border-radius: 12px;">
            <h2 style="color: #c9a66b; margin-top: 0;">Yeni Web Sitesi Başvurusu</h2>
            <p><strong>Ad Soyad:</strong> ${input.fullName}</p>
            <p><strong>E-posta:</strong> ${input.email}</p>
            <p><strong>Telefon:</strong> ${input.phone}</p>
            <p><strong>Hedef:</strong> ${input.goal}</p>
            <p><strong>Tercih Edilen Paket:</strong> ${input.preferredPackage || "Belirtilmedi"}</p>
            <p><strong>WhatsApp İletişim İzni:</strong> ${input.wantsWhatsapp ? "Evet" : "Hayır"}</p>
          </div>
        `,
      });
      emailSent = true;
    } catch (err) {
      console.error("Error sending lead notification email:", err);
    }
  }

  const rows = [
    {
      channel: "email",
      recipient: targetStudioEmail,
      title: "Yeni web sitesi talebi",
      message: `${input.fullName} yeni talep bıraktı. Telefon: ${input.phone}. E-posta: ${input.email}. Hedef: ${input.goal}. Paket: ${input.preferredPackage ?? "Belirtilmedi"}.`,
      eventType: "lead-created",
      status: emailSent ? "sent" : "demo-logged",
      relatedInquiryId: input.inquiryId,
    },
    {
      channel: "dashboard",
      recipient: "asli-celik-pilates-panel",
      title: "Yeni lead panelde hazır",
      message: `${input.fullName} adlı ziyaretçi yönetim panelinde işlenmeyi bekliyor.`,
      eventType: "internal-alert",
      status: "logged",
      relatedInquiryId: input.inquiryId,
    },
  ];

  if (input.wantsWhatsapp) {
    rows.push({
      channel: "whatsapp",
      recipient: input.phone || studioWhatsapp(),
      title: "Ziyaretçi karşılama mesajı",
      message: leadReply,
      eventType: "lead-auto-reply",
      status: process.env.STUDIO_NOTIFICATION_WHATSAPP ? "queued" : "demo-logged",
      relatedInquiryId: input.inquiryId,
    });
  }

  await db.insert(notifications).values(rows);

  return {
    success: true,
    channels: rows.map((row) => row.channel),
  };
}
