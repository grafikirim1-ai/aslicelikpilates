import { NextResponse } from "next/server";
import { db } from "@/db";
import { members } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const list = await db.select().from(members).orderBy(desc(members.createdAt));
    return NextResponse.json({ ok: true, members: list });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Hata oluştu" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      phone,
      email,
      packageName,
      totalSessions,
      remainingSessions,
      totalPrice,
      paidAmount,
      paymentStatus,
      paymentMethod,
      notes,
    } = body;

    if (!fullName || !phone || !packageName) {
      return NextResponse.json(
        { error: "Ad Soyad, Telefon ve Paket Adı zorunludur." },
        { status: 400 }
      );
    }

    const totalSess = parseInt(totalSessions, 10) || 8;
    const remSess = remainingSessions !== undefined ? parseInt(remainingSessions, 10) : totalSess;
    const totPrice = String(totalPrice || "8000");
    const pAmount = String(paidAmount || "8000");

    let status = paymentStatus || "paid";
    if (Number(pAmount) >= Number(totPrice)) {
      status = "paid";
    } else if (Number(pAmount) > 0) {
      status = "partial";
    } else {
      status = "pending";
    }

    const [inserted] = await db
      .insert(members)
      .values({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        packageName: packageName.trim(),
        totalSessions: totalSess,
        remainingSessions: remSess,
        totalPrice: totPrice,
        paidAmount: pAmount,
        paymentStatus: status,
        paymentMethod: paymentMethod || "Kredi Kartı",
        notes: notes ? notes.trim() : null,
      })
      .returning();

    return NextResponse.json({ ok: true, member: inserted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Eklenemedi" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, action, paidAmount, remainingSessions, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Member ID gereklidir." }, { status: 400 });
    }

    const [existing] = await db.select().from(members).where(eq(members.id, id));
    if (!existing) {
      return NextResponse.json({ error: "Üye bulunamadı." }, { status: 404 });
    }

    let updateData: any = {};

    // Action 1: Decrement Session (-1)
    if (action === "use_session") {
      const newRem = Math.max(0, existing.remainingSessions - 1);
      updateData.remainingSessions = newRem;
    }
    // Action 2: Manual Session Count Update
    else if (remainingSessions !== undefined) {
      updateData.remainingSessions = Math.max(0, parseInt(remainingSessions, 10));
    }

    // Action 3: Payment Amount Update
    if (paidAmount !== undefined) {
      const newPaid = String(paidAmount);
      updateData.paidAmount = newPaid;

      if (Number(newPaid) >= Number(existing.totalPrice)) {
        updateData.paymentStatus = "paid";
      } else if (Number(newPaid) > 0) {
        updateData.paymentStatus = "partial";
      } else {
        updateData.paymentStatus = "pending";
      }
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const [updated] = await db
      .update(members)
      .set(updateData)
      .where(eq(members.id, id))
      .returning();

    return NextResponse.json({ ok: true, member: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID zorunludur." }, { status: 400 });
    }

    await db.delete(members).where(eq(members.id, parseInt(id, 10)));
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Silinemedi" }, { status: 500 });
  }
}
