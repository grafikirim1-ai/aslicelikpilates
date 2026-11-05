import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const list = await db.select().from(settings).limit(1);
    if (list.length === 0) {
      const [newSetting] = await db
        .insert(settings)
        .values({
          senderEmail: "asliclk80@hotmail.com",
          isEmailConfigured: false,
        })
        .returning();
      return NextResponse.json({ ok: true, settings: newSetting });
    }
    return NextResponse.json({ ok: true, settings: list[0] });
  } catch (error: any) {
    return NextResponse.json({ error: "İşlem tamamlanamadı." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const body = await req.json();
    const { senderEmail } = body;

    if (!senderEmail || !senderEmail.includes("@")) {
      return NextResponse.json({ error: "Geçerli bir e-posta adresi giriniz." }, { status: 400 });
    }

    const list = await db.select().from(settings).limit(1);
    let updated;

    if (list.length === 0) {
      [updated] = await db
        .insert(settings)
        .values({
          senderEmail: senderEmail.trim(),
          isEmailConfigured: true,
        })
        .returning();
    } else {
      [updated] = await db
        .update(settings)
        .set({
          senderEmail: senderEmail.trim(),
          isEmailConfigured: true,
          updatedAt: new Date(),
        })
        .where(eq(settings.id, list[0].id))
        .returning();
    }

    return NextResponse.json({
      ok: true,
      settings: updated,
      message: `Yönetici bildirim e-posta adresi '${senderEmail}' olarak güncellendi.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "İşlem tamamlanamadı." }, { status: 500 });
  }
}
