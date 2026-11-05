import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { inquiries } from "@/db/schema";

export async function PATCH(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const body = await req.json();
    const { id, status } = body;

    const [updated] = await db
      .update(inquiries)
      .set({ status })
      .where(eq(inquiries.id, Number(id)))
      .returning();

    return NextResponse.json({ ok: true, inquiry: updated });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
