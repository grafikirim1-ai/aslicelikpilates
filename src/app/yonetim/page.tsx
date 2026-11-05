import { isAuthenticated } from "@/lib/auth";
import { getDashboardData } from "@/lib/queries";
import { AdminDashboardClient } from "@/components/admin-dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const authenticated = await isAuthenticated();
  const data = authenticated ? await getDashboardData() : {};

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f5f3f0]">
      <AdminDashboardClient initialData={data} authenticated={authenticated} />
    </div>
  );
}
