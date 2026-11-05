export function field(body: Record<string, unknown>, key: string, max: number, required = true) {
  const value = body[key];
  if (value === undefined && !required) return "";
  if (typeof value !== "string" || value.trim().length > max || (required && !value.trim()) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) throw new Error("Invalid input");
  return value.trim();
}
export function contactFields(body: Record<string, unknown>) {
  const fullName = field(body, "fullName", 120);
  const phone = field(body, "phone", 30);
  const email = field(body, "email", 160);
  if (!/^[+\d\s()-]{10,30}$/.test(phone) || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) throw new Error("Invalid contact");
  return { fullName, phone, email };
}
export async function publicBody(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) throw new Error("Invalid content type");
  if (Number(request.headers.get("content-length")) > 16384 || !request.body) throw new Error("Request too large or empty");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 16384) { await reader.cancel(); throw new Error("Request too large"); }
    chunks.push(value);
  }
  const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid object");
  return body as Record<string, unknown>;
}
