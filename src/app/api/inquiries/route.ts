import { NextRequest } from "next/server";

import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { queueLeadNotifications } from "@/lib/notifications";
import { ensureSeedData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  await ensureSeedData();

  const body = await request.json();

  const payload = {
    fullName: String(body.fullName ?? "").trim(),
    phone: String(body.phone ?? "").trim(),
    email: String(body.email ?? "").trim(),
    goal: String(body.goal ?? "").trim(),
    preferredPackage: body.preferredPackage ? String(body.preferredPackage).trim() : null,
    wantsWhatsapp: body.wantsWhatsapp !== false,
    message: String(body.message ?? "").trim(),
    source: "website",
    status: "new",
  };

  if (!payload.fullName || !payload.phone || !payload.email || !payload.goal || !payload.message) {
    return Response.json(
      {
        ok: false,
        error: "Lütfen ad soyad, telefon, e-posta, hedef ve mesaj alanlarını doldurun.",
      },
      { status: 400 },
    );
  }

  const [created] = await db.insert(inquiries).values(payload).returning({ id: inquiries.id });

  await queueLeadNotifications({
    inquiryId: created.id,
    fullName: payload.fullName,
    phone: payload.phone,
    email: payload.email,
    goal: payload.goal,
    preferredPackage: payload.preferredPackage,
    wantsWhatsapp: payload.wantsWhatsapp,
  });

  return Response.json({
    ok: true,
    message: "Talebiniz başarıyla alındı. En kısa sürede size dönüş yapacağız.",
  });
}
