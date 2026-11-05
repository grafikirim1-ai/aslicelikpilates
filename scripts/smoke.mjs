import assert from "node:assert/strict";
import { request as httpRequest } from "node:http";
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3107";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(base).hostname), "Smoke tests must only run against a local server");
let passed = 0;
async function check(path, options, expected) {
  const res = await fetch(`${base}${path}`, options);
  assert.equal(res.status, expected, `${options?.method ?? "GET"} ${path}`);
  passed++;
  return res;
}
const protectedPaths = ["/api/admin/members", "/api/admin/settings", "/api/admin/credentials", "/api/admin/inquiries", "/api/admin/events", "/api/admin/instructors", "/api/admin/packages", "/api/admin/sessions", "/api/admin/gallery", "/api/admin/send-test-email", "/api/dashboard", "/api/cron/reminders"];
for (const path of protectedPaths) await check(path, undefined, 401);
for (const method of ["POST", "PUT", "PATCH", "DELETE"]) await check("/api/admin/members", { method, headers: { origin: "https://www.aslicelikpilates.com", "content-type": "application/json" }, body: "{}" }, 401);
await check("/api/admin/login", { method: "POST", headers: { origin: "https://attacker.example", "content-type": "application/json" }, body: "{}" }, 403);
for (const path of ["/api/inquiries", "/api/members/apply"]) await check(path, { method: "POST", headers: { origin: "https://attacker.example", "content-type": "application/json" }, body: "{}" }, 403);
await check("/api/dashboard", { headers: { cookie: "acp_session=true" } }, 401);
const login = await check("/yonetim", undefined, 200);
assert.ok(login.headers.get("cache-control")?.includes("no-store") || login.headers.get("cache-control")?.includes("no-cache"));
const loginHtml = await login.text();
assert.ok(loginHtml.includes("Stüdyo Yönetim Girişi"));
assert.ok(loginHtml.includes('initialData":{}') || loginHtml.includes('initialData\\":{}'));
assert.ok(!loginHtml.includes("Varsayılan Giriş"));
const robots = await check("/robots.txt", undefined, 200);
assert.ok((await robots.text()).includes("Sitemap: https://www.aslicelikpilates.com/sitemap.xml"));
const sitemap = await check("/sitemap.xml", undefined, 200);
const xml = await sitemap.text();
assert.ok(!xml.includes("/yonetim") && !xml.includes("/uye-kayit"));
const routes = ["/baglica-reformer-pilates", "/fizyoterapist-destekli-pilates", "/hamile-pilatesi-ankara", "/iletisim-ve-konum"];
for (const path of routes) {
  assert.ok(xml.includes(`https://www.aslicelikpilates.com${path}`));
  const res = await check(path, undefined, 200);
  assert.equal(res.headers.get("x-frame-options"), "DENY");
  assert.equal(res.headers.get("x-content-type-options"), "nosniff");
  const html = await res.text();
  assert.ok(html.includes(`rel="canonical" href="https://www.aslicelikpilates.com${path}"`));
  assert.ok(!html.includes('name="robots" content="noindex'));
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
}
await check("/not-a-real-service", undefined, 404);
const redirect = await new Promise((resolve, reject) => {
  const req = httpRequest(`${base}/iletisim-ve-konum`, { method: "HEAD", headers: { host: "aslicelikpilates.com" } }, (res) => { res.resume(); resolve(res); });
  req.on("error", reject); req.end();
});
assert.equal(redirect.statusCode, 308);
assert.equal(redirect.headers.location, "https://www.aslicelikpilates.com/iletisim-ve-konum");
passed++;
console.log(`${passed} local HTTP checks passed; unauthorized requests never reach member data or notification handlers.`);
