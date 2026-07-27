import { getWebsiteData } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getWebsiteData();
  return Response.json({ ok: true, ...data });
}
