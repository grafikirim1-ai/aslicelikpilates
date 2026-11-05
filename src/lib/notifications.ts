import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq } from "drizzle-orm";
import nodemailer from "nodemailer";
import { buildLeadEmail, LEAD_RECIPIENT, type LeadEmailInput } from "@/lib/lead-email";

export async function queueLeadNotifications(input: LeadEmailInput) {
  const mail = buildLeadEmail(input);
  const [queued] = await db.insert(notifications).values({ channel: "email", recipient: LEAD_RECIPIENT, title: mail.subject.slice(0, 160), message: mail.text, eventType: "lead-created", status: "pending", relatedInquiryId: input.inquiryId }).returning({ id: notifications.id });
  await db.insert(notifications).values({ channel: "dashboard", recipient: "asli-celik-pilates-panel", title: "Yeni ön görüşme talebi", message: `${input.fullName} adlı ziyaretçinin başvurusu alındı.`, eventType: "internal-alert", status: "logged", relatedInquiryId: input.inquiryId });
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, RESEND_API_KEY, STUDIO_FROM_EMAIL } = process.env;
  if ((!RESEND_API_KEY || !STUDIO_FROM_EMAIL) && (!SMTP_HOST || !SMTP_USER || !SMTP_PASS)) {
    await db.update(notifications).set({ status: "unconfigured" }).where(eq(notifications.id, queued.id));
    return { success: false, emailStatus: "unconfigured" };
  }
  try {
    if (RESEND_API_KEY && STUDIO_FROM_EMAIL) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `inquiry-${input.inquiryId}` },
        body: JSON.stringify({ from: `Aslı Çelik Pilates <${STUDIO_FROM_EMAIL}>`, to: [LEAD_RECIPIENT], reply_to: input.email, subject: mail.subject, html: mail.html, text: mail.text }),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error(`Email provider rejected delivery (${response.status})`);
    } else {
      const transporter = nodemailer.createTransport({ host: SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: Number(process.env.SMTP_PORT) === 465, auth: { user: SMTP_USER, pass: SMTP_PASS }, connectionTimeout: 10000, socketTimeout: 20000 });
      await transporter.sendMail({ from: { name: "Aslı Çelik Pilates Web", address: process.env.SMTP_FROM || SMTP_USER! }, ...mail });
    }
    await db.update(notifications).set({ status: "sent" }).where(eq(notifications.id, queued.id));
    return { success: true, emailStatus: "sent" };
  } catch {
    await db.update(notifications).set({ status: "failed" }).where(eq(notifications.id, queued.id));
    console.error("Lead email delivery failed; inquiry retained", { inquiryId: input.inquiryId });
    return { success: false, emailStatus: "failed" };
  }
}
