import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/navigation";
import { ContactForm } from "@/components/contact-form";
import { getWebsiteData } from "@/lib/queries";

export const dynamic = "force-dynamic";

function GoldLine() {
  return <div className="mx-auto h-[1px] w-16 bg-gradient-to-r from-transparent via-[#c9a66b] to-transparent" />;
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#bfa38e]">
      {label}
    </p>
  );
}

export default async function HomePage() {
  const data = await getWebsiteData();

  return (
    <main className="min-h-screen bg-[#000000] text-[#f5f3f0]">
      <Navigation />

      {/* Hero */}
      <section className="relative min-h-[100dvh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/studio-hero.jpg"
            alt="Aslı Çelik Pilates Stüdyo"
            fill
            priority
            className="object-cover opacity-40"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f14]/70 via-[#0a0f14]/40 to-[#0a0f14]" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-end px-6 pb-24 pt-48 lg:px-10 lg:pt-60">
          <div
            className="max-w-4xl space-y-8 animate-fade-up"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-[#c9a66b]">
              Etimesgut / Bağlıca — Butik Pilates Stüdyosu
            </p>
            <h1 className="font-serif text-[clamp(3.2rem,10vw,8rem)] font-light leading-[0.92] tracking-[-0.04em] text-[#f5f3f0]">
              Zarif hareketin,
              <br />
              <span className="italic text-[#c9a66b]">derin gücün</span>
              <br />
              yolu.
            </h1>
            <div className="max-w-lg space-y-6">
              <p className="text-[17px] font-light leading-[1.75] text-[#e8e4dc]/80">
                Aslı Çelik Pilates, kişiye özel reformer programları, profesyonel eğitmen kadrosu
                ve sürdürülebilir gelişim odaklı bir deneyim sunar. Her hareket bilinçlidir; her sonuç kalıcıdır.
              </p>
              <div className="flex items-center gap-6 pt-2">
                <a
                  href="#iletisim"
                  className="inline-flex items-center gap-3 rounded-full border border-[#c9a66b]/40 bg-[#c9a66b]/10 px-7 py-3.5 text-sm font-medium text-[#f5f3f0] transition hover:border-[#c9a66b] hover:bg-[#c9a66b]/20"
                >
                  Ücretsiz Ön Görüşme
                </a>
                <a
                  href="#program"
                  className="text-sm font-light text-[#e8e4dc]/60 underline underline-offset-4 decoration-[#c9a66b]/30 transition hover:text-[#f5f3f0]"
                >
                  Programı İnceleyin
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy / Dark Statement */}
      <section id="stüdyo" className="relative overflow-hidden bg-[#121822]">
        <div className="mx-auto max-w-7xl px-6 py-32 lg:px-10 lg:py-40">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
            <div
              className="space-y-6"
            >
              <SectionLabel label="Stüdyo Felsefesi" />
              <h2 className="font-serif text-4xl font-light leading-[1.1] tracking-tight text-[#f5f3f0] lg:text-5xl">
                Her beden farklıdır.
                <br />
                <span className="italic text-[#bfa38e]">Her program kişiseldir.</span>
              </h2>
              <GoldLine />
            </div>

            <div
              className="space-y-8"
            >
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4 rounded-2xl border border-white/[0.06] bg-[#0a0f14]/50 p-6">
                  <p className="font-serif text-3xl font-light text-[#c9a66b]">01</p>
                  <h3 className="text-lg font-medium text-[#f5f3f0]">Postür Analizi</h3>
                  <p className="text-sm leading-relaxed text-[#e8e4dc]/60">
                    İlk değerlendirme ile bedeninizin ihtiyaçlarını belirliyor, size özel bir başlangıç noktası oluşturuyoruz.
                  </p>
                </div>
                <div className="space-y-4 rounded-2xl border border-white/[0.06] bg-[#0a0f14]/50 p-6">
                  <p className="font-serif text-3xl font-light text-[#c9a66b]">02</p>
                  <h3 className="text-lg font-medium text-[#f5f3f0]">Kişisel Akış</h3>
                  <p className="text-sm leading-relaxed text-[#e8e4dc]/60">
                    Haftalık seanslarınız, günlük yaşam ritminize göre esnek ama düzenli bir yapıya oturtulur.
                  </p>
                </div>
                <div className="space-y-4 rounded-2xl border border-white/[0.06] bg-[#0a0f14]/50 p-6">
                  <p className="font-serif text-3xl font-light text-[#c9a66b]">03</p>
                  <h3 className="text-lg font-medium text-[#f5f3f0]">Sürekli Gelişim</h3>
                  <p className="text-sm leading-relaxed text-[#e8e4dc]/60">
                    Düzenli takip ve değerlendirme ile programınızı sürekli güncelliyor, ilerlemenizi ölçülebilir kılıyoruz.
                  </p>
                </div>
                <div className="space-y-4 rounded-2xl border border-white/[0.06] bg-[#0a0f14]/50 p-6">
                  <p className="font-serif text-3xl font-light text-[#c9a66b]">04</p>
                  <h3 className="text-lg font-medium text-[#f5f3f0]">Yaşam Rutini</h3>
                  <p className="text-sm leading-relaxed text-[#e8e4dc]/60">
                    Sadece stüdyo saatlerinde değil, günlük yaşamda da beden farkındalığınızı artıran küçük alışkanlıklar kazandırıyoruz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image + Statement */}
      <section className="relative overflow-hidden bg-[#000000] text-[#f5f3f0]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-36">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] shadow-2xl shadow-black/60">
              <Image
                src="/instructor-portrait.jpg"
                alt="Profesyonel Pilates Eğitmeni"
                width={640}
                height={800}
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#000000]/80 via-[#000000]/40 to-transparent p-8 pt-24">
                <p className="font-serif text-xl font-light text-[#f5f3f0]">
                  “Her seans bir farkındalık anıdır.”
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-8">
              <SectionLabel label="Eğitmen Kadrosu" />
              <h2 className="font-serif text-4xl font-light leading-[1.1] tracking-tight text-[#f5f3f0] lg:text-5xl">
                Deneyim, <br />
                <span className="italic text-[#c9a66b]">bilinçli dokunuş.</span>
              </h2>
              <GoldLine />
              <p className="text-base leading-[1.85] text-[#e8e4dc]/70">
                Kadromuz, uluslararası sertifikalı reformer eğitmenlerinden oluşur. Her biri kendi uzmanlık alanında — postür analizi, hamile pilatesi, güçlenme ve mobilite — derinleşmiş, yıllarını bu alana adamış profesyonellerdir.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                {data.coaches.map((coach) => (
                  <a key={coach.id} href="#stüdyo" className="group rounded-2xl border border-white/[0.08] bg-[#0c0c0e] p-5 transition hover:-translate-y-0.5 hover:border-[#c9a66b]/40 hover:bg-[#121216] hover:shadow-lg">
                    <p className="text-sm font-medium text-[#f5f3f0]">{coach.fullName}</p>
                    <p className="mt-1 text-xs text-[#c9a66b]">{coach.role}</p>
                    <p className="mt-3 text-xs leading-relaxed text-[#e8e4dc]/50">{coach.specialties.slice(0, 2).join(", ")}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Section */}
      <section id="program" className="relative overflow-hidden bg-[#050507]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(201,166,107,0.08),_transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel label="Haftalık Akış" />
            <h2 className="font-serif text-4xl font-light tracking-tight text-[#f5f3f0] lg:text-6xl">
              Seanslarınız <br />
              <span className="italic text-[#c9a66b]">rutin değil, ritim.</span>
            </h2>
            <GoldLine />
            <p className="text-[#e8e4dc]/60">Haftanın her gününe özel akışlar; sabah, öğlen ve akşam saatlerine göre şekillenir.</p>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.sessions.map((session, i) => (
              <article
                key={session.id}
                className="group rounded-[2rem] border border-white/[0.06] bg-[#0c0c0e]/80 p-7 transition hover:border-[#c9a66b]/30 hover:bg-[#121216] hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.7)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#bfa38e]">{session.dayLabel}</p>
                    <h3 className="mt-3 font-serif text-2xl font-light leading-snug text-[#f5f3f0]">{session.title}</h3>
                  </div>
                  <span className="shrink-0 rounded-full border border-[#c9a66b]/20 bg-[#c9a66b]/8 px-3 py-1.5 text-[11px] font-medium text-[#c9a66b]">{session.level}</span>
                </div>
                <p className="mt-5 text-sm leading-[1.75] text-[#e8e4dc]/60">{session.description}</p>
                <div className="mt-6 space-y-2 text-sm text-[#e8e4dc]/70">
                  <div className="flex items-center justify-between border-b border-white/[0.05] pb-2">
                    <span className="text-xs uppercase tracking-wider text-[#bfa38e]">Saat</span>
                    <span className="font-medium">{session.startTime} — {session.endTime}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/[0.05] pb-2 pt-2">
                    <span className="text-xs uppercase tracking-wider text-[#bfa38e]">Eğitmen</span>
                    <span className="font-medium">{session.coachName}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs uppercase tracking-wider text-[#bfa38e]">Kapasite</span>
                    <span className="font-medium">{session.capacity} kişi</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="paketler" className="bg-[#000000] text-[#f5f3f0]">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel label="Yatırım Programları" />
            <h2 className="font-serif text-4xl font-light tracking-tight text-[#f5f3f0] lg:text-6xl">
              Size uygun <br />
              <span className="italic text-[#c9a66b]">gelişim yolu.</span>
            </h2>
            <GoldLine />
            <p className="text-[#e8e4dc]/60">Her paket, kişisel değerlendirme ile başlar; hedeflerinize göre şekillenir.</p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {data.packages.map((item, i) => (
              <article
                key={item.id}
                className={`relative overflow-hidden rounded-[2.5rem] border p-8 shadow-2xl transition hover:-translate-y-1 ${
                  item.isPopular
                    ? "border-[#c9a66b]/40 bg-gradient-to-b from-[#141419] to-[#0c0c0e] text-[#f5f3f0] shadow-black/70"
                    : "border-white/[0.08] bg-[#0c0c0e] text-[#f5f3f0] hover:border-[#c9a66b]/30"
                }`}
              >
                {item.isPopular && (
                  <span className="absolute right-5 top-5 rounded-full border border-[#c9a66b]/30 bg-[#c9a66b]/15 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9a66b]">
                    En Popüler
                  </span>
                )}
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#bfa38e]">
                  {item.focus}
                </p>
                <h3 className="mt-4 font-serif text-3xl font-light leading-tight text-[#f5f3f0]">
                  {item.name}
                </h3>
                <p className="mt-5 text-sm leading-[1.8] text-[#e8e4dc]/60">
                  {item.description}
                </p>

                <div className="mt-8 flex items-baseline gap-2 text-[#f5f3f0]">
                  <span className="font-serif text-5xl font-light text-[#c9a66b]">{new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(Number(item.price))}</span>
                  <span className="text-sm font-light opacity-60">TL</span>
                </div>
                <p className="text-xs font-light text-[#e8e4dc]/40">
                  {item.durationDays} gün geçerli — {item.sessionsCount} ders
                </p>

                <ul className="mt-7 space-y-3 text-[#e8e4dc]/80">
                  {item.includes.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a66b]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#iletisim"
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-medium tracking-wide transition ${
                    item.isPopular
                      ? "border border-[#c9a66b]/50 bg-[#c9a66b] text-[#000000] hover:bg-[#d4af37]"
                      : "border border-white/10 bg-white/5 text-[#f5f3f0] hover:border-[#c9a66b]/40 hover:bg-white/10"
                  }`}
                >
                  Bu Programı Seç
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / Atmosphere */}
      <section className="relative overflow-hidden bg-[#0a0f14]">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl shadow-black/30">
              <Image
                src="/reformer-action.jpg"
                alt="Reformer Pilates"
                width={720}
                height={900}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="space-y-8">
              <SectionLabel label="Üye Deneyimi" />
              <blockquote className="font-serif text-3xl font-light leading-[1.25] text-[#f5f3f0] lg:text-4xl">
                “Stüdyoya ilk geldiğimde sadece ağrılarım vardı. Şimdi sadece
                <span className="italic text-[#c9a66b]">güçlü hissediyorum.</span> Bu değişimi kendime borçlu değilim; buradaki yaklaşıma borçluyum.”
              </blockquote>
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#f5f3f0]">Derya Yılmaz</p>
                <p className="text-xs text-[#bfa38e]">12 aylık Denge Paketi üyesi</p>
              </div>
              <GoldLine />
              <div className="grid grid-cols-3 gap-6 pt-2">
                <div>
                  <p className="font-serif text-3xl font-light text-[#c9a66b]">3+</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#e8e4dc]/50">Yıllık deneyim</p>
                </div>
                <div>
                  <p className="font-serif text-3xl font-light text-[#c9a66b]">150+</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#e8e4dc]/50">Aktif üye</p>
                </div>
                <div>
                  <p className="font-serif text-3xl font-light text-[#c9a66b]">12</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#e8e4dc]/50">Haftalık seans</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section id="galeri" className="relative overflow-hidden bg-[#050507] border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36 space-y-16">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <div className="space-y-4">
              <SectionLabel label="Stüdyomuz & Yaşam" />
              <h2 className="font-serif text-4xl font-light tracking-tight text-[#f5f3f0] lg:text-6xl">
                Fotoğraf <span className="italic text-[#c9a66b]">Albümü</span>
              </h2>
              <GoldLine />
            </div>
            <Link
              href="/galeri"
              className="rounded-full border border-[#c9a66b]/40 bg-[#c9a66b]/10 px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a66b] transition hover:bg-[#c9a66b]/20"
            >
              Tüm Albümü İnceleyin (5) →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(data.gallery || []).slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href="/galeri"
                className="group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0c0c0e] shadow-2xl transition duration-500 hover:-translate-y-1.5 hover:border-[#c9a66b]/40"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/90 via-[#000000]/30 to-transparent opacity-80 transition duration-300 group-hover:opacity-95" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1.5">
                  <span className="inline-block rounded-full border border-[#c9a66b]/30 bg-[#c9a66b]/15 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9a66b]">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-xl font-light text-[#f5f3f0]">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Studio Privileges / Standards Overview */}
      <section className="border-t border-white/[0.06] bg-[#121822]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="mx-auto max-w-4xl text-center">
            <SectionLabel label="Stüdyo Standartları" />
            <h2 className="font-serif text-4xl font-light tracking-tight text-[#f5f3f0] lg:text-5xl">
              Sağlığınız & Konforunuz İçin <br />
              <span className="italic text-[#c9a66b]">Özel Ayrıcalıklar</span>
            </h2>
            <GoldLine />
            <p className="text-sm leading-relaxed text-[#e8e4dc]/60">
              Etimesgut Bağlıca'daki butik stüdyomuzda hedeflerinize en kısa ve güvenli yoldan ulaşmanız için tasarlandı.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Butik & Kişiye Özel",
                desc: "Maksimum 4-5 kişilik sınıflar veya tam mahremiyet sunan birebir özel ders salonlarımızda, tüm dikkatimiz sadece sizin üzerinizde.",
              },
              {
                title: "Kapsamlı Ekipman Parkuru",
                desc: "Reformer, Cadillac, Chair, Barrel, Barre ve Spine Corrector cihazlarıyla omurga sağlığı, duruş düzeltme ve sıkılaşmada tam donanım.",
              },
              {
                title: "Uzman & Sertifikalı Rehberlik",
                desc: "Kurucu Eğitmen Aslı Çelik ve uzman ekibimiz eşliğinde, ilk seans öncesi ücretsiz postür ve esneklik analizi ile kişiselleştirilmiş gelişim.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-[2rem] border border-white/[0.08] bg-[#0a0f14]/60 p-8 transition duration-300 hover:border-[#c9a66b]/30 hover:bg-[#0a0f14]/90"
              >
                <h3 className="font-serif text-2xl font-light text-[#f5f3f0]">{card.title}</h3>
                <div className="mt-3 h-[1px] w-10 bg-[#c9a66b]/40" />
                <p className="mt-5 text-sm leading-[1.8] text-[#e8e4dc]/60">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="iletisim" className="relative overflow-hidden bg-[#0a0f14]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(201,166,107,0.08),_transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
          <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-8">
              <SectionLabel label="Başlangıç" />
              <h2 className="font-serif text-4xl font-light leading-[1.1] tracking-tight text-[#f5f3f0] lg:text-6xl">
                İlk adım <br />
                <span className="italic text-[#c9a66b]">her zaman en zorudur.</span>
              </h2>
              <GoldLine />
              <p className="text-base leading-[1.85] text-[#e8e4dc]/60">
                Size özel bir değerlendirme ile başlıyoruz. Formu doldurun; ekibimiz size en uygun gün, saat ve programı önermek için sizinle iletişime geçecektir.
              </p>

              <div className="space-y-4 pt-4">
                <div className="rounded-2xl border border-white/[0.06] bg-[#121822]/40 px-6 py-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#bfa38e]">Stüdyo Adresi</p>
                  <p className="mt-2 text-base font-light text-[#f5f3f0]">Bağlıca Mah. Bağlıca Bulvarı No:75/36 Yalınkılıç İş Merkezi, Etimesgut / Ankara</p>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-[#121822]/40 px-6 py-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#bfa38e]">Çalışma Saatleri</p>
                  <div className="mt-2 space-y-1 text-sm font-light text-[#f5f3f0]">
                    <p>Pazartesi — Cuma: 09:00 — 21:00</p>
                    <p>Cumartesi: 09:00 — 13:00</p>
                    <p className="text-xs font-medium text-[#c9a66b]">Pazar: Kapalıyız</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-[#121822]/40 px-6 py-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#bfa38e]">İletişim & Telefon</p>
                  <p className="mt-2 text-base font-light text-[#f5f3f0]">info@aslicelikpilates.com</p>
                  <p className="text-sm font-medium text-[#c9a66b]">0543 219 42 20</p>
                </div>
              </div>
            </div>

            <ContactForm packageOptions={data.packages.map((item) => ({ id: item.id, name: item.name }))} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#0a0f14]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-12 lg:flex-row lg:items-end lg:px-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Toned by ASLI ÇELİK PILATES Studio"
                width={220}
                height={75}
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="max-w-md text-sm leading-relaxed text-[#e8e4dc]/40">
              Zarif, bilinçli ve sürdürülebilir bir pilates deneyimi için Etimesgut Bağlıca'da butik bir stüdyo.
            </p>
          </div>
          <div className="flex items-center gap-8 text-xs font-light tracking-wide text-[#e8e4dc]/30">
            <a href="#" className="transition hover:text-[#f5f3f0]">Site API</a>
            <a href="#" className="transition hover:text-[#f5f3f0]">Dashboard API</a>
            <a href="#" className="transition hover:text-[#f5f3f0]">Yönetim Paneli</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
