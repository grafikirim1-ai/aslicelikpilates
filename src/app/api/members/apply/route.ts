import { queueLeadNotifications } from "@/lib/notifications";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { trustedOrigin } from "@/lib/auth";
import { allowAttempt } from "@/lib/rate-limit";
import { contactFields, field, publicBody } from "@/lib/public-input";

// Applications are leads, never paid memberships or session entitlements.
export async function POST(request: Request) {
  if (!trustedOrigin(request)) return Response.json({ error: "İstek kaynağı doğrulanamadı." }, { status: 403 });
  try {
    if (!(await allowAttempt(request, "application", 5, 3600))) return Response.json({ error: "Çok fazla başvuru. Daha sonra tekrar deneyin." }, { status: 429 });
    const body = await publicBody(request);
    const contact = contactFields(body);
    const preferredPackage = field(body, "packageName", 120);
    const notes = field(body, "notes", 2000, false);
    const payload = { ...contact, preferredPackage, goal: "Üyelik ön başvurusu", message: notes || "Online üyelik ön başvurusu", source: "membership-application", status: "new", wantsWhatsapp: false };
    const [created] = await db.insert(inquiries).values(payload).returning({ id: inquiries.id, createdAt: inquiries.createdAt });
    try { await queueLeadNotifications({ inquiryId: created.id, createdAt: created.createdAt.toISOString(), ...payload }); } catch { console.error("Membership lead notification failed"); }
    return Response.json({ ok: true });
  } catch { return Response.json({ error: "Başvuru alınamadı. Bilgilerinizi kontrol edip tekrar deneyin." }, { status: 400 }); }
}
