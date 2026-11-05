import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { SESSION_COOKIE, trustedOrigin, validSession } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const responseHeaders = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method) && !trustedOrigin(request)) {
    // Scheduled jobs authenticate with a separate bearer secret, rather than browser cookies.
    if (path !== "/api/cron/reminders") return NextResponse.json({ error: "İstek kaynağı doğrulanamadı." }, { status: 403, headers: responseHeaders });
  }
  if (path === "/api/admin/login") return NextResponse.next({ headers: responseHeaders });
  if (path === "/api/cron/reminders") {
    const secret = process.env.CRON_SECRET;
    const actual = Buffer.from(request.headers.get("authorization") ?? "");
    const expected = Buffer.from(`Bearer ${secret ?? ""}`);
    if (secret && actual.length === expected.length && timingSafeEqual(actual, expected)) return NextResponse.next({ headers: responseHeaders });
    if (request.method !== "POST" || !trustedOrigin(request)) return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401, headers: responseHeaders });
  }
  if (!(await validSession(request.cookies.get(SESSION_COOKIE)?.value))) {
    return NextResponse.json({ error: "Oturum açmanız gerekiyor." }, { status: 401, headers: responseHeaders });
  }
  return NextResponse.next({ headers: responseHeaders });
}

export const config = { matcher: ["/api/admin/:path*", "/api/dashboard", "/api/cron/:path*"] };
