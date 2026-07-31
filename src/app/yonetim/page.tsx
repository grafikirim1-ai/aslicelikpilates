import { getDashboardData } from "@/lib/queries";
import { AdminDashboardClient } from "@/components/admin-dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f5f3f0]">
      <AdminDashboardClient initialData={data} />
    </div>
  );
}
