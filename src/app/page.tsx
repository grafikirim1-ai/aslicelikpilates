import StudioMap from "@/components/studio-map";
import { services } from "@/lib/services";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/navigation";
import { ContactForm } from "@/components/contact-form";
import { getWebsiteData } from "@/lib/queries";

export const metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "https://www.aslicelikpilates.com/", title: "Aslı Çelik Pilates | Bağlıca Reformer Pilates", images: ["/studio-hero.jpg"] },
};

const studioSchema = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  "@id": "https://www.aslicelikpilates.com/#studio",
  name: "Aslı Çelik Pilates",
  url: "https://www.aslicelikpilates.com/",
  image: "https://www.aslicelikpilates.com/studio-hero.jpg",
  telephone: "+905432194220",
  areaServed: { "@type": "Place", name: "Bağlıca, Etimesgut, Ankara" },
  hasMap: "https://maps.app.goo.gl/xR6Jhn4L9X2uZpxZ6",
  sameAs: ["https://maps.app.goo.gl/xR6Jhn4L9X2uZpxZ6"],
  geo: { "@type": "GeoCoordinates", latitude: 39.8984137, longitude: 32.647539 },
  email: "asliclk80@hotmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Bağlıca Mah. Bağlıca Bulvarı No:75/36 Yalınkılıç İş Merkezi",
    addressLocality: "Etimesgut",
    addressRegion: "Ankara",
    addressCountry: "TR",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "21:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "13:00" },
  ],
};

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(studioSchema).replace(/</g, "\\u003c") }} />
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
                  href="#hakkimizda"
                  className="text-sm font-light text-[#e8e4dc]/60 underline underline-offset-4 decoration-[#c9a66b]/30 transition hover:text-[#f5f3f0]"
                >
                  Hakkımızda
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

      {/* Neden Pilates Section */}
      <section id="neden-pilates" className="relative overflow-hidden bg-[#050507]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(201,166,107,0.08),_transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <SectionLabel label="Bilimsel Yaklaşım" />
            <h2 className="font-serif text-4xl font-light tracking-tight text-[#f5f3f0] lg:text-6xl">
              Ankara’da Fizyoterapist Destekli <br />
              <span className="italic text-[#c9a66b]">Kişiye Özel Pilates</span>
            </h2>
            <GoldLine />
            <p className="text-lg font-light text-[#c9a66b]/90">
              Bilimsel Yaklaşımla Güvenli ve Kişiye Özel Egzersiz
            </p>
            <p className="text-base leading-[1.85] text-[#e8e4dc]/70 pt-2">
              Stüdyomuzda Pilates dersleri, fizyoterapistlerimiz ve uzman antrenörlerimizin iş birliğiyle planlanır. Her bireyin sağlık geçmişi, hareket kapasitesi ve hedefleri farklı olduğu için tüm programlarımız kişiye özel olarak hazırlanır.
            </p>
            <p className="text-sm leading-[1.8] text-[#e8e4dc]/60">
              İlk değerlendirme sırasında duruş analizi, omurga hizalanması, eklem hareket açıklığı, kas kuvveti, esneklik, denge ve hareket kalitesi detaylı olarak incelenir. Bu değerlendirme sonucunda size en uygun egzersiz programı oluşturulur ve gelişiminiz düzenli olarak takip edilir.
            </p>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1: Hangi Durumlarda Pilates Desteği Sunuyoruz? */}
            <div className="rounded-[2.5rem] border border-white/[0.08] bg-[#0c0c0e] p-8 shadow-2xl transition hover:border-[#c9a66b]/40">
              <div className="space-y-4">
                <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a66b]">Uzmanlık Alanları</span>
                <h3 className="font-serif text-2xl font-light text-[#f5f3f0]">Hangi Durumlarda Pilates Desteği Sunuyoruz?</h3>
                <div className="h-[1px] w-12 bg-[#c9a66b]/40" />
                <p className="text-xs leading-relaxed text-[#e8e4dc]/60">
                  Pilates, doğru planlandığında birçok kas ve iskelet sistemi probleminde güvenli bir egzersiz yöntemi olabilir. Stüdyomuzda, doktorunun egzersiz yapmasına onay verdiği bireyler için kişiye özel programlar hazırlıyoruz.
                </p>
                <ul className="space-y-2.5 pt-2 text-xs text-[#e8e4dc]/80">
                  {[
                    "Skolyoz",
                    "Bel fıtığı",
                    "Boyun fıtığı",
                    "Fibromiyalji",
                    "Duruş bozuklukları",
                    "Masa başı çalışmaya bağlı kas ve eklem problemleri",
                    "Hamilelik dönemi Pilatesi",
                    "Doğum sonrası Pilates",
                    "Esneklik ve hareket kabiliyetinin geliştirilmesi",
                    "Core (merkez bölge) kuvvetlendirme",
                    "Sağlıklı yaş alma (Longevity) odaklı egzersiz programları",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a66b]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Card 2: Neden Biz? */}
            <div className="rounded-[2.5rem] border border-[#c9a66b]/30 bg-gradient-to-b from-[#141419] to-[#0c0c0e] p-8 shadow-2xl transition hover:border-[#c9a66b]">
              <div className="space-y-4">
                <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a66b]">Ayrıcalıklarımız</span>
                <h3 className="font-serif text-2xl font-light text-[#f5f3f0]">Neden Biz?</h3>
                <div className="h-[1px] w-12 bg-[#c9a66b]/40" />
                <p className="text-xs leading-relaxed text-[#e8e4dc]/70">
                  Stüdyomuzda amacımız yalnızca egzersiz yaptırmak değildir. Hareketi doğru öğretmek, ağrısız ve kaliteli bir yaşamı desteklemek en önemli önceliğimizdir.
                </p>
                <p className="text-xs font-medium text-[#c9a66b]">
                  Fizyoterapistlerimiz ve uzman antrenörlerimiz birlikte çalışarak:
                </p>
                <ul className="space-y-3 pt-1 text-xs text-[#e8e4dc]/85">
                  {[
                    "Güvenli egzersiz planlaması yapar.",
                    "Hareket kalitesini artırmayı hedefler.",
                    "Omurga sağlığını destekleyen çalışmalar uygular.",
                    "Kuvvet, denge ve esnekliği birlikte geliştirir.",
                    "Düzenli takip ve program güncellemeleriyle gelişiminizi destekler.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a66b]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Card 3: Pilatesin Kazandırdıkları */}
            <div className="rounded-[2.5rem] border border-white/[0.08] bg-[#0c0c0e] p-8 shadow-2xl transition hover:border-[#c9a66b]/40 md:col-span-2 lg:col-span-1">
              <div className="space-y-4">
                <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a66b]">Kazanımlar</span>
                <h3 className="font-serif text-2xl font-light text-[#f5f3f0]">Pilatesin Kazandırdıkları</h3>
                <div className="h-[1px] w-12 bg-[#c9a66b]/40" />
                <p className="text-xs leading-relaxed text-[#e8e4dc]/60">
                  Düzenli ve doğru uygulanan Pilates bedeninizde kalıcı dönüşümler sağlar:
                </p>
                <ul className="space-y-3 pt-2 text-xs text-[#e8e4dc]/80">
                  {[
                    "Daha güçlü bir duruş,",
                    "Daha dengeli ve esnek bir vücut,",
                    "Artan kas dayanıklılığı,",
                    "Günlük yaşamda daha rahat hareket etme,",
                    "Vücut farkındalığının gelişmesi,",
                    "Sağlıklı yaş alma sürecinin desteklenmesine katkı sağlar.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a66b]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-16 rounded-3xl border border-white/[0.06] bg-[#0c0c0e]/80 p-8 text-center max-w-4xl mx-auto space-y-4">
            <h4 className="font-serif text-2xl font-light text-[#f5f3f0]">Sizi Stüdyomuza Bekliyoruz</h4>
            <p className="text-sm leading-relaxed text-[#e8e4dc]/70">
              İster ilk kez Pilatese başlayacak olun, ister omurga sağlığınızı desteklemek ya da yaşam kalitenizi artırmak isteyin; fizyoterapist destekli ve bilimsel temellere dayanan yaklaşımımızla size en uygun programı birlikte planlayabiliriz.
            </p>
            <p className="text-base font-medium italic text-[#c9a66b]">
              Sağlıklı hareket, güçlü bir beden ve sürdürülebilir bir yaşam için sizi stüdyomuza bekliyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Haftalık Akış / Seans Programı Section */}
      <section id="seanslar" className="relative overflow-hidden bg-[#050507] border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <SectionLabel label="Haftalık Akış" />
            <h2 className="font-serif text-4xl font-light tracking-tight text-[#f5f3f0] lg:text-6xl">
              Seanslarınız <br />
              <span className="italic text-[#c9a66b]">rutin değil, ritim.</span>
            </h2>
            <GoldLine />
            <p className="text-base leading-[1.85] text-[#e8e4dc]/70">
              Haftanın her gününe özel akışlar; sabah, öğlen ve akşam saatlerine göre şekillenir.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(data.sessions || []).map((session) => (
              <div
                key={session.id}
                className="rounded-[2rem] border border-white/[0.08] bg-[#0c0c0e] p-8 shadow-2xl transition duration-300 hover:border-[#c9a66b]/40 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#bfa38e]">
                    {session.dayLabel}
                  </span>
                  <span className="rounded-full border border-[#c9a66b]/30 bg-[#c9a66b]/10 px-3 py-1 text-[10px] font-medium text-[#c9a66b]">
                    {session.level}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-light text-[#f5f3f0]">
                    {session.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[#e8e4dc]/60">
                    {session.description}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/[0.06] text-xs">
                  <div className="flex items-center justify-between text-[#e8e4dc]/70">
                    <span className="uppercase tracking-widest text-[10px] text-[#bfa38e]">Saat</span>
                    <span className="font-medium text-[#f5f3f0]">{session.startTime} — {session.endTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#e8e4dc]/70">
                    <span className="uppercase tracking-widest text-[10px] text-[#bfa38e]">Eğitmen</span>
                    <span className="font-medium text-[#f5f3f0]">{session.coachName || "Aslı Çelik"}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#e8e4dc]/70">
                    <span className="uppercase tracking-widest text-[10px] text-[#bfa38e]">Kapasite</span>
                    <span className="font-medium text-[#c9a66b]">{session.capacity} kişi</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hakkımızda Section */}
      <section id="hakkimizda" className="relative overflow-hidden bg-[#121822]">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <SectionLabel label="Hakkımızda" />
            <h2 className="font-serif text-4xl font-light tracking-tight text-[#f5f3f0] lg:text-5xl">
              Fizyoterapist ve Uzman Antrenör Eşliğinde <br />
              <span className="italic text-[#c9a66b]">Kişiye Özel Pilates</span>
            </h2>
            <GoldLine />
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <div className="space-y-6 rounded-[2rem] border border-white/[0.08] bg-[#0a0f14]/80 p-8 shadow-xl">
              <h3 className="font-serif text-2xl font-light text-[#c9a66b]">Bütüncül ve Kişiye Özel Yaklaşım</h3>
              <p className="text-sm leading-[1.85] text-[#e8e4dc]/75">
                Stüdyomuzda her bireyin ihtiyaçlarının farklı olduğuna inanıyor, bu nedenle tüm derslerimizi kişiye özel değerlendirme ve planlama ile yürütüyoruz. Fizyoterapist ekibimiz ve uzman antrenörlerimiz birlikte çalışarak üyelerimizin hedeflerine güvenli ve bilinçli bir şekilde ulaşmalarını destekliyor.
              </p>
              <p className="text-sm leading-[1.85] text-[#e8e4dc]/75">
                İlk değerlendirme sürecinde duruş analizi, omurga hizalanması, eklem hareket açıklığı, kas kuvveti, esneklik, denge ve hareket kalitesi detaylı olarak incelenir. Elde edilen veriler doğrultusunda tamamen size özel bir egzersiz programı oluşturulur.
              </p>
              <p className="text-sm leading-[1.85] text-[#e8e4dc]/75">
                Pilates yaklaşımımız; doğru nefes, doğru hizalanma ve kontrollü hareket prensipleri üzerine kuruludur. Amacımız yalnızca daha güçlü bir vücut oluşturmak değil, aynı zamanda günlük yaşam kalitesini artırmak, hareket konforunu geliştirmek ve sürdürülebilir bir yaşam alışkanlığı kazandırmaktır.
              </p>
            </div>

            <div className="space-y-6 rounded-[2rem] border border-white/[0.08] bg-[#0a0f14]/80 p-8 shadow-xl">
              <h3 className="font-serif text-2xl font-light text-[#c9a66b]">Klinik & Dönüşüm Programlarımız</h3>
              <p className="text-sm leading-[1.85] text-[#e8e4dc]/75">
                Programlarımız; duruş bozuklukları, masa başı çalışma kaynaklı kas-iskelet sistemi problemleri ve doktor onayıyla egzersiz yapmasında sakınca bulunmayan skolyoz, bel ve boyun fıtığı, fibromiyalji gibi durumlarda kişinin ihtiyaçlarına uygun şekilde planlanır. Egzersizler, mevcut duruma göre uyarlanır ve süreç boyunca düzenli olarak takip edilir.
              </p>
              <p className="text-sm leading-[1.85] text-[#e8e4dc]/75">
                Bunun yanı sıra hamilelik ve doğum sonrası dönem, sporcu performansının geliştirilmesi, hareket kabiliyetinin artırılması, denge ve koordinasyon çalışmaları ile sağlıklı yaş alma (healthy aging/longevity) hedefleyen bireyler için de özel programlar sunuyoruz.
              </p>
              <p className="text-sm leading-[1.85] text-[#e8e4dc]/75">
                Bizim için Pilates, yalnızca bir egzersiz sistemi değil; bilimsel temellere dayanan, güvenli hareketi öğreten ve yaşam boyu sağlığı destekleyen bütüncül bir yaklaşımdır.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="font-serif text-2xl font-light text-[#f5f3f0]">
              Sağlıklı hareket, güçlü bir beden ve daha kaliteli bir yaşam için sizi stüdyomuza bekliyoruz.
            </p>
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
              Etimesgut Bağlıca’daki butik stüdyomuzda hedeflerinize en kısa ve güvenli yoldan ulaşmanız için tasarlandı.
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
                  <p className="mt-2 text-base font-light text-[#f5f3f0]">asliclk80@hotmail.com</p>
                  <p className="text-sm font-medium text-[#c9a66b]">0543 219 42 20</p>
                </div>
              </div>
            </div>

            <div className="min-w-0 space-y-8">
              <StudioMap />
              <ContactForm packageOptions={data.packages.map((item) => ({ id: item.id, name: item.name }))} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="border-t border-white/10 bg-[#050507] px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-3xl text-[#c9a66b]">Bağlıca’da Pilates Programları</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {Object.entries(services).map(([slug, service]) => <Link key={slug} href={`/${slug}`} className="rounded-2xl border border-white/10 p-6 transition hover:border-[#c9a66b]/60"><h3 className="font-serif text-2xl">{service.title}</h3><p className="mt-3 text-sm leading-7 text-[#e8e4dc]/70">{service.description}</p><span className="mt-4 inline-block text-sm text-[#c9a66b]">Programı inceleyin →</span></Link>)}
          </div>
          <Link href="/iletisim-ve-konum" className="mt-7 inline-block text-sm text-[#c9a66b] underline">Stüdyo adresi, iletişim ve çalışma saatleri</Link>
        </div>
      </section>

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
              Zarif, bilinçli ve sürdürülebilir bir pilates deneyimi için Etimesgut Bağlıca’da butik bir stüdyo.
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
