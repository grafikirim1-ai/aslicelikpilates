import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:5432/app_db";

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

// pg parses sslmode from the URL after other options. Remove it so it cannot
// override certificate verification for required TLS connections.
const connectionUrl = new URL(databaseUrl);
const requiresTls = ["require", "verify-ca", "verify-full"].includes(connectionUrl.searchParams.get("sslmode") ?? "") || connectionUrl.hostname.endsWith(".neon.tech");
if (requiresTls) connectionUrl.searchParams.delete("sslmode");

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: connectionUrl.toString(),
    ssl: requiresTls ? { rejectUnauthorized: true } : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
