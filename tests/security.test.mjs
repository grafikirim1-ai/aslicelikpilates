import assert from "node:assert/strict";
import test from "node:test";
import { build } from "esbuild";
import { createHmac, randomBytes } from "node:crypto";
const result = await build({ entryPoints: ["src/lib/auth.ts"], bundle: true, platform: "node", format: "esm", write: false, plugins: [{ name: "test-db", setup(builder) {
  builder.onResolve({ filter: /^@\/db$|^@\/db\/schema$|^next\/headers$/ }, (args) => ({ path: args.path, namespace: "test" }));
  builder.onLoad({ filter: /.*/, namespace: "test" }, ({ path }) => ({ contents: path === "@/db" ? "export const db = { select: () => ({ from: () => ({ limit: async () => globalThis.__admins ?? [] }) }) };" : path === "@/db/schema" ? "export const adminUsers = {};" : "export const cookies = async () => ({get: () => undefined});", loader: "js" }));
} }] });
const auth = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`);
process.env.AUTH_SECRET = randomBytes(48).toString("hex");
const admin = { id: 1, username: "owner", password: auth.hashPassword("unique test password long enough") };
globalThis.__admins = [admin];

test("password hash fits the database, uses random salt and rejects wrong or legacy passwords", () => {
  assert.ok(admin.password.length <= 160);
  assert.ok(auth.verifyPassword("unique test password long enough", admin.password));
  assert.equal(auth.verifyPassword("wrong", admin.password), false);
  assert.equal(auth.verifyPassword("admin", "admin"), false);
  assert.notEqual(auth.hashPassword("unique test password long enough"), admin.password);
});
test("valid session works, tampering and malformed tokens fail closed", async () => {
  const token = auth.createSession(admin);
  assert.equal(await auth.validSession(token), true);
  assert.equal(await auth.validSession(`${token}x`), false);
  assert.equal(await auth.validSession(), false);
  assert.equal(await auth.validSession("true"), false);
  assert.equal(await auth.validSession(`${token}.extra`), false);
});
test("expired sessions are rejected even with a valid signature", async () => {
  const token = auth.createSession(admin);
  const value = JSON.parse(Buffer.from(token.split(".")[0], "base64url").toString());
  value.exp = 1;
  const payload = Buffer.from(JSON.stringify(value)).toString("base64url");
  const signature = createHmac("sha256", process.env.AUTH_SECRET).update(payload).digest("base64url");
  assert.equal(await auth.validSession(`${payload}.${signature}`), false);
});
test("changing a password revokes existing sessions", async () => {
  const token = auth.createSession(admin);
  globalThis.__admins = [{ ...admin, password: auth.hashPassword("changed password long enough") }];
  assert.equal(await auth.validSession(token), false);
  globalThis.__admins = [admin];
});
test("missing or short signing secrets do not authenticate", async () => {
  const secret = process.env.AUTH_SECRET;
  const token = auth.createSession(admin);
  process.env.AUTH_SECRET = "short";
  assert.throws(() => auth.createSession(admin));
  assert.equal(await auth.validSession(token), false);
  process.env.AUTH_SECRET = secret;
});
test("production rejects foreign and missing origins", () => {
  const environment = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  const req = (origin) => new Request("https://www.aslicelikpilates.com/api/inquiries", { method: "POST", headers: origin ? { origin } : {} });
  assert.ok(auth.trustedOrigin(req("https://www.aslicelikpilates.com")));
  assert.equal(auth.trustedOrigin(req("https://attacker.example")), false);
  assert.equal(auth.trustedOrigin(req()), false);
  process.env.NODE_ENV = environment;
});

const inputBundle = await build({ stdin: { contents: 'export * from "./src/lib/public-input.ts"; export * from "./src/lib/html.ts";', resolveDir: process.cwd() }, bundle: true, platform: "node", format: "esm", write: false });
const input = await import(`data:text/javascript;base64,${Buffer.from(inputBundle.outputFiles[0].text).toString("base64")}`);
test("public input rejects invalid contact and oversized fields", () => {
  assert.deepEqual(input.contactFields({ fullName: " Test User ", phone: "+905432194220", email: "test@example.com" }), { fullName: "Test User", phone: "+905432194220", email: "test@example.com" });
  assert.throws(() => input.contactFields({ fullName: "Test", phone: "invalid", email: "x" }));
  assert.throws(() => input.field({ name: "x".repeat(121) }, "name", 120));
  assert.throws(() => input.field({ name: {} }, "name", 120));
});
test("public request parsing rejects arrays, oversized JSON and unsupported content types", async () => {
  const req = (body, contentType = "application/json") => new Request("http://localhost/", { method: "POST", headers: { "content-type": contentType }, body });
  await assert.rejects(input.publicBody(req("[]")));
  await assert.rejects(input.publicBody(req("{}", "text/plain")));
  await assert.rejects(input.publicBody(req(JSON.stringify({ value: "x".repeat(17000) }))));
});
test("HTML injection is escaped before insertion into email markup", () => {
  assert.equal(input.escapeHtml('<a href="x">Tom & Sue</a>'), "&lt;a href=&quot;x&quot;&gt;Tom &amp; Sue&lt;/a&gt;");
});
