import { publicBody } from "@/lib/public-input";
import { NextResponse } from "next/server";
import { createSession, getAdmin, SESSION_COOKIE, SESSION_SECONDS, verifyPassword } from "@/lib/auth";
import { allowAttempt } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    if (!(await allowAttempt(req, "login", 5, 15 * 60))) return NextResponse.json({ error: "Çok fazla deneme. Daha sonra tekrar deneyin." }, { status: 429 });
    const { username, password } = await publicBody(req);
    if (typeof username !== "string" || typeof password !== "string" || username.length > 120 || password.length > 256) return NextResponse.json({ error: "Geçersiz giriş bilgileri." }, { status: 400 });
    const admin = await getAdmin();
    if (!admin || admin.username !== username.trim() || !verifyPassword(password, admin.password)) return NextResponse.json({ error: "Kullanıcı adı veya şifre hatalı." }, { status: 401 });
    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, createSession(admin), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: SESSION_SECONDS });
    return response;
  } catch { return NextResponse.json({ error: "Giriş şu anda yapılamıyor." }, { status: 503 }); }
}
