import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { members, instructors } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import {
  queueWelcomeNotification,
  queueInstructorAssignmentNotification,
  queueMemberApprovalNotification,
} from "@/lib/email-service";

export async function GET(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const list = await db.select().from(members).orderBy(desc(members.createdAt));
    return NextResponse.json({ ok: true, members: list });
  } catch (error: any) {
    return NextResponse.json({ error: "İşlem tamamlanamadı." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
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

    if (inserted && inserted.email) {
      queueWelcomeNotification({
        memberId: inserted.id,
        memberName: inserted.fullName,
        memberEmail: inserted.email,
        packageName: inserted.packageName,
        totalSessions: inserted.totalSessions,
      }).catch((err) => console.error("Welcome email queue error:", err));
    }

    return NextResponse.json({ ok: true, member: inserted });
  } catch (error: any) {
    return NextResponse.json({ error: "İşlem tamamlanamadı." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
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
      updateData.remainingSessions = sql`greatest(0, ${members.remainingSessions} - 1)`;
    }
    // Action 2: Increment Session (+1)
    else if (action === "add_session") {
      updateData.remainingSessions = sql`${members.remainingSessions} + 1`;
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

    // Instant Notification Trigger upon Instructor Assignment / Member Approval
    if (instructorId !== undefined && updateData.instructorId) {
      const [assignedInst] = await db
        .select()
        .from(instructors)
        .where(eq(instructors.id, updateData.instructorId));

      if (assignedInst) {
        // 1. Send Instant Email to Member
        if (updated.email) {
          queueMemberApprovalNotification({
            memberEmail: updated.email,
            memberName: updated.fullName,
            packageName: updated.packageName,
            instructorName: assignedInst.fullName,
          }).catch((err) => console.error("Instant Member Approval Email Error:", err));
        }

        // 2. Send Instant Email to Instructor
        if (assignedInst.email) {
          queueInstructorAssignmentNotification({
            instructorEmail: assignedInst.email,
            instructorName: assignedInst.fullName,
            memberName: updated.fullName,
            memberPhone: updated.phone,
            packageName: updated.packageName,
            notes: updated.notes,
          }).catch((err) => console.error("Instant Instructor Assignment Email Error:", err));
        }
      }
    }

    return NextResponse.json({ ok: true, member: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "İşlem tamamlanamadı." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID zorunludur." }, { status: 400 });
    }

    await db.delete(members).where(eq(members.id, parseInt(id, 10)));
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: "İşlem tamamlanamadı." }, { status: 500 });
  }
}
