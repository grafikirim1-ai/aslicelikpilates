import { db } from "@/db";
import { notifications } from "@/db/schema";

function studioEmail() {
  return process.env.STUDIO_NOTIFICATION_EMAIL ?? "info@aslicelikpilates.com";
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

  const rows = [
    {
      channel: "email",
      recipient: studioEmail(),
      title: "Yeni web sitesi talebi",
      message: `${input.fullName} yeni talep bıraktı. Hedef: ${input.goal}. Paket: ${input.preferredPackage ?? "Belirtilmedi"}.`,
      eventType: "lead-created",
      status: process.env.STUDIO_NOTIFICATION_EMAIL ? "queued" : "demo-logged",
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
