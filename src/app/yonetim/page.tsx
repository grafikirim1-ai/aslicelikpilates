import Image from "next/image";
import Link from "next/link";
import { getDashboardData } from "@/lib/queries";
import { AdminDashboardClient } from "@/components/admin-dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <main className="min-h-screen bg-[#050507] px-6 py-10 text-[#f5f3f0] lg:px-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="rounded-[2.5rem] border border-white/[0.08] bg-[#0c0c0e] p-8 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#bfa38e]">Operasyon & İçerik Yönetimi</p>
              <Image
                src="/logo.png"
                alt="Toned by ASLI ÇELİK PILATES Studio"
                width={260}
                height={90}
                className="h-14 w-auto object-contain"
              />
              <p className="max-w-xl text-xs leading-[1.75] text-[#e8e4dc]/50">
                Seans saatleri, paket fiyatları, eğitmen kadrosu, fotoğraf albümü ve müşteri taleplerini tek ekrandan anında güncelleyin.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/galeri" className="rounded-full border border-[#c9a66b]/40 bg-[#c9a66b]/10 px-5 py-2.5 text-xs font-medium tracking-wide text-[#c9a66b] transition hover:bg-[#c9a66b]/20">
                Galeri Sayfası ↗
              </Link>
              <Link href="/" className="rounded-full border border-white/[0.08] px-5 py-2.5 text-xs font-medium tracking-wide text-[#e8e4dc]/70 transition hover:border-[#c9a66b]/30 hover:text-white">
                Ana Sayfaya Dön ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Dynamic Admin Interactive Client */}
        <div className="rounded-[2.5rem] border border-white/[0.08] bg-[#0c0c0e] p-8 shadow-2xl">
          <AdminDashboardClient initialData={data} />
        </div>
      </div>
    </main>
  );
}
