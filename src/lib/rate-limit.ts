import { createHash } from "node:crypto";
import { sql } from "drizzle-orm";
import { db } from "@/db";

// Shared PostgreSQL counters also cover separate serverless instances; fail closed on errors.
export async function allowAttempt(request: Request, scope: string, limit: number, seconds: number) {
  const ip = process.env.VERCEL ? request.headers.get("x-vercel-forwarded-for") ?? "unknown" : "local";
  const bucket = Math.floor(Date.now() / (seconds * 1000));
  const key = createHash("sha256").update(`${scope}:${ip}:${bucket}`).digest("hex");
  await db.execute(sql`CREATE TABLE IF NOT EXISTS acp_rate_limits (key text PRIMARY KEY, count integer NOT NULL, expires_at timestamptz NOT NULL)`);
  await db.execute(sql`DELETE FROM acp_rate_limits WHERE expires_at < now()`);
  const result = await db.execute(sql`INSERT INTO acp_rate_limits (key, count, expires_at) VALUES (${key}, 1, now() + ${seconds} * interval '1 second') ON CONFLICT (key) DO UPDATE SET count = acp_rate_limits.count + 1 RETURNING count`);
  return Number(result.rows[0]?.count) <= limit;
}
