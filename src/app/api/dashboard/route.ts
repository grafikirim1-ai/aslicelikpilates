import { requireAdmin } from "@/lib/auth";
import { getDashboardApiPayload } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const data = await getDashboardApiPayload();
  return Response.json({ ok: true, ...data });
}
