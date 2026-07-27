import { NextResponse } from "next/server";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { currentPassword, newUsername, newPassword } = body;

    if (!currentPassword || !newUsername || !newPassword) {
      return NextResponse.json(
        { error: "Mevcut şifre, yeni kullanıcı adı ve yeni şifre gereklidir." },
        { status: 400 }
      );
    }

    const users = await db.select().from(adminUsers);
    let admin = users[0];

    if (admin && admin.password !== currentPassword.trim()) {
      return NextResponse.json({ error: "Mevcut şifre hatalı!" }, { status: 400 });
    }

    if (admin) {
      await db
        .update(adminUsers)
        .set({
          username: newUsername.trim(),
          password: newPassword.trim(),
          updatedAt: new Date(),
        })
        .where(eq(adminUsers.id, admin.id));
    } else {
      await db.insert(adminUsers).values({
        username: newUsername.trim(),
        password: newPassword.trim(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Giriş bilgileri başarıyla güncellendi!",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Güncellenemedi" }, { status: 500 });
  }
}
