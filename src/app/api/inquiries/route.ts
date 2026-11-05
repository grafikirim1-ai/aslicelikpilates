import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { queueLeadNotifications } from "@/lib/notifications";
import { trustedOrigin } from "@/lib/auth";
import { allowAttempt } from "@/lib/rate-limit";
import { contactFields, field, publicBody } from "@/lib/public-input";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  if (!trustedOrigin(request)) return Response.json({ error: "İstek kaynağı doğrulanamadı." }, { status: 403 });
  try {
    if (!(await allowAttempt(request, "inquiry", 5, 3600))) return Response.json({ error: "Çok fazla talep. Daha sonra tekrar deneyin." }, { status: 429 });
    const body = await publicBody(request);
    const payload = { ...contactFields(body), goal: field(body, "goal", 160), preferredPackage: field(body, "preferredPackage", 120, false) || null, message: field(body, "message", 2000), wantsWhatsapp: body.wantsWhatsapp === true, source: "website", status: "new" };
    const [created] = await db.insert(inquiries).values(payload).returning({ id: inquiries.id, createdAt: inquiries.createdAt });
    try { await queueLeadNotifications({ inquiryId: created.id, createdAt: created.createdAt.toISOString(), ...payload }); } catch { console.error("Lead notification failed"); }
    return Response.json({ ok: true, message: "Talebiniz başarıyla alındı. En kısa sürede size dönüş yapacağız." });
  } catch { return Response.json({ error: "Talep alınamadı. Bilgilerinizi kontrol edip tekrar deneyin." }, { status: 400 }); }
}
