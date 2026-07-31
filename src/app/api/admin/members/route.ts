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
      instructorId,
      status: reqStatus,
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

    let pStatus = paymentStatus || "paid";
    if (Number(pAmount) >= Number(totPrice)) {
      pStatus = "paid";
    } else if (Number(pAmount) > 0) {
      pStatus = "partial";
    } else {
      pStatus = "pending";
    }

    const memberStatus = reqStatus || "active";
    const instId = instructorId ? parseInt(instructorId, 10) : null;

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
        paymentStatus: pStatus,
        paymentMethod: paymentMethod || "Kredi Kartı",
        instructorId: instId,
        status: memberStatus,
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
    const { id, action, paidAmount, remainingSessions, instructorId, status, notes } = body;

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
    // Action 2: Increment Session (+1)
    else if (action === "add_session") {
      updateData.remainingSessions = existing.remainingSessions + 1;
    }
    // Action 3: Manual Session Count Update
    else if (remainingSessions !== undefined) {
      updateData.remainingSessions = Math.max(0, parseInt(remainingSessions, 10));
    }

    // Action 4: Payment Amount Update
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

    if (instructorId !== undefined) {
      updateData.instructorId = instructorId ? parseInt(instructorId, 10) : null;
    }

    if (status !== undefined) {
      updateData.status = status;
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
