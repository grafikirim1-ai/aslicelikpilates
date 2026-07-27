import { NextResponse } from "next/server";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Kullanıcı adı ve şifre zorunludur." }, { status: 400 });
    }

    const users = await db.select().from(adminUsers);
    let admin = users[0];

    // If table was empty, fallback
    if (!admin) {
      if (username === "admin" && password === "admin") {
        return NextResponse.json({ success: true, message: "Giriş başarılı" });
      }
      return NextResponse.json({ error: "Hatalı kullanıcı adı veya şifre!" }, { status: 401 });
    }

    if (admin.username === username.trim() && admin.password === password.trim()) {
      return NextResponse.json({ success: true, message: "Giriş başarılı" });
    }

    return NextResponse.json({ error: "Hatalı kullanıcı adı veya şifre!" }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Giriş yapılamadı" }, { status: 500 });
  }
}
