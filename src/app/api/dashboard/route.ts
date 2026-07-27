import { getDashboardApiPayload } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getDashboardApiPayload();
  return Response.json({ ok: true, ...data });
}
