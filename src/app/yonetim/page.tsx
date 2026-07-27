import Image from "next/image";
import Link from "next/link";
import { getDashboardData } from "@/lib/queries";

export const dynamic = "force-dynamic";

function currency(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

function dateTime(value: Date | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(value);
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <main className="min-h-screen bg-[#0a0f14] px-6 py-12 text-[#f5f3f0] lg:px-10">
      <div className="mx-auto max-w-7xl space-y-14">
        <div className="rounded-[2.5rem] border border-white/[0.06] bg-[#121822]/30 p-10 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.4)] backdrop-blur-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#bfa38e]">Operasyon Paneli</p>
              <Image
                src="/logo.png"
                alt="Toned by ASLI ÇELİK PILATES Studio"
                width={260}
                height={90}
                className="h-16 w-auto object-contain"
              />
              <p className="max-w-xl text-sm leading-[1.75] text-[#e8e4dc]/50">
                Web sitesi üzerinden gelen talepler, bildirim kuyruğu, haftalık ders akışı ve paket durumları tek ekranda.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/" className="rounded-full border border-white/[0.08] px-5 py-2.5 text-xs font-medium tracking-wide text-[#e8e4dc]/60 transition hover:border-[#c9a66b]/30 hover:text-[#f5f3f0]">
                Siteye Dön
              </Link>
              <Link href="/api/dashboard" className="rounded-full bg-[#c9a66b]/10 px-5 py-2.5 text-xs font-medium tracking-wide text-[#c9a66b] transition hover:bg-[#c9a66b]/20">
                JSON Çıktısı
              </Link>
            </div>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Toplam Talep", value: String(data.stats.totalInquiries), hint: `${data.stats.weeklyInquiries} son 7 gün` },
            { label: "Bekleyen Lead", value: String(data.stats.pendingInquiries), hint: "İlk temas bekliyor" },
            { label: "Aktif Paket", value: String(data.stats.activePackages), hint: "Web vitrininde aktif" },
            { label: "Bildirim Kaydı", value: String(data.stats.notificationQueue), hint: "WhatsApp + e-posta + panel" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-[1.75rem] border border-white/[0.06] bg-[#121822]/40 p-6 transition hover:border-[#c9a66b]/10 hover:bg-[#121822]/60">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#bfa38e]">{stat.label}</p>
              <p className="mt-3 font-serif text-4xl font-light text-[#f5f3f0]">{stat.value}</p>
              <p className="mt-2 text-xs text-[#e8e4dc]/30">{stat.hint}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[2rem] border border-white/[0.06] bg-[#121822]/30 p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-[#bfa38e]">Lead Havuzu</p>
                <h2 className="mt-2 font-serif text-2xl font-light text-[#f5f3f0]">Yeni Talepler</h2>
              </div>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-[#e8e4dc]/30">
                  <tr className="border-b border-white/[0.06]">
                    <th className="py-3 text-left font-medium">Ziyaretçi</th>
                    <th className="py-3 text-left font-medium">Durum</th>
                    <th className="py-3 text-left font-medium">Tarih</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {data.recentInquiries.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3">
                        <p className="font-medium text-[#f5f3f0]">{item.fullName}</p>
                        <p className="text-xs text-[#e8e4dc]/30">{item.phone}</p>
                      </td>
                      <td className="py-3 text-xs text-[#bfa38e]">{item.status}</td>
                      <td className="py-3 text-xs text-[#e8e4dc]/30">{dateTime(item.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/[0.06] bg-[#121822]/30 p-8">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#bfa38e]">Bildirim Akışı</p>
            <h2 className="mt-2 font-serif text-2xl font-light text-[#f5f3f0]">Son Bildirimler</h2>
            <div className="mt-6 space-y-4">
              {data.recentNotifications.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/[0.06] bg-[#0a0f14]/40 p-5 transition hover:border-[#c9a66b]/20">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#bfa38e]">{item.channel}</p>
                      <h3 className="mt-1 font-medium text-[#f5f3f0]">{item.title}</h3>
                    </div>
                    <span className="rounded-full bg-[#c9a66b]/10 px-2.5 py-0.5 text-[10px] font-medium text-[#c9a66b]">{item.status}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[#e8e4dc]/50">{item.message}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-[#e8e4dc]/20">
                    <span>{item.recipient}</span>
                    <span>{dateTime(item.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/[0.06] bg-[#121822]/30 p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#bfa38e]">Program</p>
              <h2 className="mt-2 font-serif text-2xl font-light text-[#f5f3f0]">Haftalık Ders Akışı</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {data.schedule.map((session) => (
              <article key={session.id} className="rounded-2xl border border-white/[0.06] bg-[#0a0f14]/30 p-6 transition hover:border-[#c9a66b]/10 hover:bg-[#0a0f14]/60">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#bfa38e]">{session.dayLabel}</p>
                    <h3 className="mt-2 font-serif text-xl font-light text-[#f5f3f0]">{session.title}</h3>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#c9a66b]/10 px-2.5 py-1 text-[11px] font-medium text-[#c9a66b]">{session.capacity} kişi</span>
                </div>
                <div className="mt-5 space-y-2 text-sm text-[#e8e4dc]/50">
                  <p><strong className="text-[#f5f3f0]">Saat:</strong> {session.startTime} — {session.endTime}</p>
                  <p><strong className="text-[#f5f3f0]">Eğitmen:</strong> {session.coachName}</p>
                  <p><strong className="text-[#f5f3f0]">Lokasyon:</strong> {session.location}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
