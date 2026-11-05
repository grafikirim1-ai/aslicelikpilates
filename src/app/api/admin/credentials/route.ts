import { publicBody } from "@/lib/public-input";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAdmin, hashPassword, verifyPassword, SESSION_COOKIE } from "@/lib/auth";

export async function PUT(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const { currentPassword, newUsername, newPassword } = await publicBody(req);
    if (typeof currentPassword !== "string" || typeof newUsername !== "string" || typeof newPassword !== "string" || !/^[a-zA-Z0-9_.-]{3,80}$/.test(newUsername) || newPassword.length < 14 || newPassword.length > 256) return NextResponse.json({ error: "Kullanıcı adı 3–80 karakter, şifre en az 14 karakter olmalıdır." }, { status: 400 });
    const admin = await getAdmin();
    if (!admin || !verifyPassword(currentPassword, admin.password)) return NextResponse.json({ error: "Mevcut şifre hatalı." }, { status: 403 });
    const values = { username: newUsername, password: hashPassword(newPassword), updatedAt: new Date() };
    if (admin.id) await db.update(adminUsers).set(values).where(eq(adminUsers.id, admin.id));
    else await db.insert(adminUsers).values(values);
    const response = NextResponse.json({ success: true, message: "Giriş bilgileri güncellendi. Yeniden giriş yapın." });
    response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
    return response;
  } catch { return NextResponse.json({ error: "Giriş bilgileri güncellenemedi." }, { status: 500 }); }
}
