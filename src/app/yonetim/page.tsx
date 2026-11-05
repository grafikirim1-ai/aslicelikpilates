import { isAuthenticated } from "@/lib/auth";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getDashboardData } from "@/lib/queries";
import { AdminDashboardClient } from "@/components/admin-dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ tab?: string; inquiry?: string }> }) {
  const params = await searchParams;
  const inquiryId = /^\d+$/.test(params.inquiry ?? "") && Number.isSafeInteger(Number(params.inquiry)) ? Number(params.inquiry) : null;
  const authenticated = await isAuthenticated();
  const dashboard = authenticated ? await getDashboardData() : null;
  if (dashboard && inquiryId && !dashboard.recentInquiries.some((item) => item.id === inquiryId)) {
    const [selected] = await db.select().from(inquiries).where(eq(inquiries.id, inquiryId)).limit(1);
    if (selected) dashboard.recentInquiries.unshift(selected);
  }
  const data = dashboard ?? {};

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f5f3f0]">
      <AdminDashboardClient initialData={data} authenticated={authenticated} initialInquiryId={inquiryId} initialTab={params.tab === "inquiries" ? "inquiries" : "members"} />
    </div>
  );
}
