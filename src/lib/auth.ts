import { createHmac, randomBytes, scryptSync, timingSafeEqual, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";

export const SESSION_COOKIE = "acp_session";
export const SESSION_SECONDS = 60 * 60 * 8;
const passwordPattern = /^scrypt\$[a-f0-9]{32}\$[a-f0-9]{64}$/;
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `scrypt$${salt}$${scryptSync(password, salt, 32).toString("hex")}`;
}
export function verifyPassword(password: string, hash: string) {
  if (!passwordPattern.test(hash) || password.length > 256) return false;
  const [, salt, expected] = hash.split("$");
  return timingSafeEqual(scryptSync(password, salt, 32), Buffer.from(expected, "hex"));
}
export async function getAdmin() {
  const [admin] = await db.select().from(adminUsers).limit(1);
  if (admin && passwordPattern.test(admin.password)) return admin;
  // Legacy plaintext credentials are never accepted. Bootstrap requires a deployment secret.
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD_HASH;
  if (username && password && passwordPattern.test(password)) return { id: admin?.id ?? null, username, password };
  return null;
}
function signingSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) throw new Error("Authentication is not configured");
  return secret;
}
function fingerprint(password: string) { return createHash("sha256").update(password).digest("hex"); }
export function createSession(admin: { username: string; password: string }) {
  const payload = Buffer.from(JSON.stringify({ username: admin.username, version: fingerprint(admin.password), exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })).toString("base64url");
  return `${payload}.${createHmac("sha256", signingSecret()).update(payload).digest("base64url")}`;
}
export async function validSession(token?: string) {
  try {
    if (!token || token.length > 2048) return false;
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [payload, signature] = parts;
    const expected = createHmac("sha256", signingSecret()).update(payload).digest();
    const actual = Buffer.from(signature, "base64url");
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return false;
    const value = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!Number.isFinite(value.exp) || value.exp <= Date.now() / 1000) return false;
    const admin = await getAdmin();
    return Boolean(admin && value.username === admin.username && value.version === fingerprint(admin.password));
  } catch { return false; }
}
export async function isAuthenticated() {
  return validSession((await cookies()).get(SESSION_COOKIE)?.value);
}
export function trustedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expected = process.env.NODE_ENV === "production" ? "https://www.aslicelikpilates.com" : new URL(request.url).origin;
  return origin === expected;
}

export async function requireAdmin(request: Request) {
  if (!["GET", "HEAD"].includes(request.method) && !trustedOrigin(request)) return Response.json({ error: "İstek kaynağı doğrulanamadı." }, { status: 403 });
  if (!(await isAuthenticated())) return Response.json({ error: "Oturum açmanız gerekiyor." }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
  return null;
}
