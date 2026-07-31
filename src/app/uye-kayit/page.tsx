"use client";

import { useState } from "react";
import Link from "next/link";
import Navigation from "@/components/navigation";

export default function MemberRegistrationPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [packageName, setPackageName] = useState("Bireysel 8 Seans");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          packageName,
          status: "pending",
          totalSessions: packageName.includes("16") ? 16 : 8,
          remainingSessions: packageName.includes("16") ? 16 : 8,
          totalPrice: packageName.includes("16") ? "15000" : "8000",
          paidAmount: "0",
          paymentStatus: "pending",
          paymentMethod: "Henüz Ödenmedi",
          notes: notes ? `Ziyaretçi Ön Kaydı: ${notes}` : "Online üye başvuru kaydı",
        }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setSuccess(true);
        setFullName("");
        setPhone("");
        setEmail("");
        setNotes("");
      } else {
        setError(data.error || "Başvuru oluşturulurken bir hata oluştu.");
      }
    } catch (err) {
      setError("Bağlantı hatası oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#000000] text-[#f5f3f0]">
      <Navigation />

      <section className="relative overflow-hidden pt-36 pb-24 px-6 lg:px-10 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#c9a66b]">Online Katılım</p>
          <h1 className="font-serif text-4xl font-light text-[#f5f3f0] lg:text-6xl">
            Aslı Çelik Pilates <br />
            <span className="italic text-[#c9a66b]">Üye Kayıt Başvurusu</span>
          </h1>
          <div className="mx-auto h-[1px] w-16 bg-gradient-to-r from-transparent via-[#c9a66b] to-transparent" />
          <p className="text-sm leading-relaxed text-[#e8e4dc]/70 max-w-xl mx-auto">
            Stüdyomuza katılmak için aşağıdaki başvuru formunu doldurabilirsiniz. Kaydınız yönetim ekibimize iletilecek, onaylandıktan sonra fizyoterapist/eğitmen atamanız yapılıp sizinle iletişime geçilecektir.
          </p>
        </div>

        <div className="rounded-[2.5rem] border border-white/[0.08] bg-[#0c0c0e] p-8 md:p-12 shadow-2xl backdrop-blur-sm">
          {success ? (
            <div className="text-center py-12 space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#c9a66b]/20 border border-[#c9a66b]">
                <svg className="h-8 w-8 text-[#c9a66b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif text-3xl text-[#f5f3f0]">Üye Kayıt Başvurunuz Alındı!</h3>
              <p className="text-sm leading-relaxed text-[#e8e4dc]/70 max-w-md mx-auto">
                Talebiniz yönetici onayına iletilmiştir. Yönetici onayının ardından fizyoterapist/eğitmeniniz atanarak tarafınızla iletişime geçilecektir.
              </p>
              <div className="pt-4 flex justify-center gap-4">
                <button
                  onClick={() => setSuccess(false)}
                  className="rounded-full border border-[#c9a66b]/40 bg-[#c9a66b]/10 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#c9a66b] hover:bg-[#c9a66b]/20"
                >
                  Yeni Kayıt Oluştur
                </button>
                <Link
                  href="/"
                  className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#f5f3f0] hover:bg-white/10"
                >
                  Ana Sayfaya Dön
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-center text-xs text-red-300">
                  {error}
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-[#bfa38e]">Ad Soyad *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Adınız ve Soyadınız"
                    className="w-full rounded-2xl border border-white/10 bg-[#121822]/60 px-5 py-3.5 text-sm text-white placeholder-white/30 focus:border-[#c9a66b] focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-[#bfa38e]">Telefon Numarası *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XX XXX XX XX"
                    className="w-full rounded-2xl border border-white/10 bg-[#121822]/60 px-5 py-3.5 text-sm text-white placeholder-white/30 focus:border-[#c9a66b] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-[#bfa38e]">E-posta Adresi</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    className="w-full rounded-2xl border border-white/10 bg-[#121822]/60 px-5 py-3.5 text-sm text-white placeholder-white/30 focus:border-[#c9a66b] focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-[#bfa38e]">Tercih Edilen Paket *</label>
                  <select
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#121822]/60 px-5 py-3.5 text-sm text-white focus:border-[#c9a66b] focus:outline-none"
                  >
                    <option value="Bireysel 8 Seans" className="bg-[#0a0f14]">Bireysel 8 Seans (Özel Ders)</option>
                    <option value="Bireysel 16 Seans" className="bg-[#0a0f14]">Bireysel 16 Seans (Dönüşüm Paketi)</option>
                    <option value="2 Kişilik 8 Seans (Düet)" className="bg-[#0a0f14]">2 Kişilik 8 Seans (Düet)</option>
                    <option value="2 Kişilik 16 Seans (Düet)" className="bg-[#0a0f14]">2 Kişilik 16 Seans (Düet)</option>
                    <option value="3 Kişilik 8 Seans (Trio)" className="bg-[#0a0f14]">3 Kişilik 8 Seans (Trio)</option>
                    <option value="4 Kişilik 8 Seans" className="bg-[#0a0f14]">4 Kişilik 8 Seans (Butik Grup)</option>
                    <option value="5 Kişilik 8 Seans" className="bg-[#0a0f14]">5 Kişilik 8 Seans (Grup Dersi)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#bfa38e]">Sağlık Durumu / Postür Hedefleriniz / Notlar</label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Skolyoz, bel/boyun fıtığı, masa başı ağrılar, hamilelik dönemi veya özel beklentilerinizi belirtebilirsiniz..."
                  className="w-full rounded-2xl border border-white/10 bg-[#121822]/60 px-5 py-3.5 text-sm text-white placeholder-white/30 focus:border-[#c9a66b] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full border border-[#c9a66b] bg-[#c9a66b] py-4 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#d4af37] disabled:opacity-50"
              >
                {loading ? "Kaydediliyor..." : "Üye Kayıt Başvurusunu Tamamla"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
