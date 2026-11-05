import { escapeHtml } from "@/lib/html";

export type LeadEmailInput = {
  inquiryId: number; fullName: string; phone: string; email: string; goal: string;
  preferredPackage?: string | null; wantsWhatsapp: boolean; message: string;
  createdAt: string; source?: string;
};
export const LEAD_RECIPIENT = "asliclk80@hotmail.com";
export function buildLeadEmail(input: LeadEmailInput) {
  const panelUrl = `https://www.aslicelikpilates.com/yonetim?tab=inquiries&inquiry=${input.inquiryId}`;
  const digits = input.phone.replace(/\D/g, "");
  const phone = digits.startsWith("0") && digits.length === 11 ? `90${digits.slice(1)}` : digits.length === 10 ? `90${digits}` : digits;
  const tel = `tel:+${phone}`;
  const whatsapp = `https://wa.me/${phone}`;
  const reply = `mailto:${encodeURIComponent(input.email)}`;
  const submitted = new Date(input.createdAt).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" });
  const rows = [
    ["Talep numarası", String(input.inquiryId)], ["Kayıt tarihi (Türkiye)", submitted],
    ["Ad Soyad", input.fullName], ["Telefon", input.phone], ["E-posta", input.email],
    ["İlgilendiği paket", input.preferredPackage || "Size en uygun paketi önerelim"],
    ["Hedef", input.goal], ["Mesaj", input.message],
    ["WhatsApp iletişim izni", input.wantsWhatsapp ? "Evet" : "Hayır"],
    ["Başvuru kaynağı", input.source === "membership-application" ? "Üyelik ön başvurusu" : "Web sitesi ön görüşme formu"],
  ];
  const text = ["Yeni ön görüşme talebi", ...rows.map(([label, value]) => `${label}: ${value}`), "", `Talebi panelde aç: ${panelUrl}`, `Telefonla ara: ${tel}`, `E-postayla yanıtla: ${reply}`, ...(input.wantsWhatsapp ? [`WhatsApp: ${whatsapp}`] : [])].join("\n");
  const html = `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#202124;line-height:1.6"><h1 style="font-size:24px">Yeni ön görüşme talebi</h1><p>İletişim bilgileri ve başvuru ayrıntıları aşağıdadır. Görüşme yapmak için panele giriş yapmanız gerekmez.</p><table role="presentation" style="width:100%;border-collapse:collapse">${rows.map(([label, value]) => `<tr><th style="text-align:left;vertical-align:top;padding:12px;border-bottom:1px solid #ddd;width:35%">${escapeHtml(label)}</th><td style="padding:12px;border-bottom:1px solid #ddd;white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(value)}</td></tr>`).join("")}</table><p><a href="${tel}">Telefonla ara</a> · <a href="${reply}">E-postayla yanıtla</a>${input.wantsWhatsapp ? ` · <a href="${whatsapp}">WhatsApp’tan görüş</a>` : ""}</p><p><a href="${escapeHtml(panelUrl)}" style="display:inline-block;padding:14px 20px;background:#c9a66b;color:#111;text-decoration:none;border-radius:8px">Talebi yönetim panelinde aç</a></p><p style="font-size:12px;color:#666">Panel bağlantısı güvenli giriş gerektirir. Bu e-posta kişisel başvuru bilgileri içerir.</p></div>`;
  return { to: LEAD_RECIPIENT, replyTo: { name: input.fullName, address: input.email }, subject: `Yeni Ön Görüşme Talebi #${input.inquiryId} — ${input.fullName.replace(/[\r\n]/g, " ")}`, text, html };
}
