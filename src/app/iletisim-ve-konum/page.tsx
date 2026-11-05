import Navigation from "@/components/navigation";
import StudioMap from "@/components/studio-map";
import Link from "next/link";

export const metadata = {
  title: "İletişim ve Konum | Aslı Çelik Pilates Bağlıca",
  description: "Aslı Çelik Pilates Bağlıca stüdyo adresi, telefon ve çalışma saatleri. Etimesgut Ankara’da ön görüşme için iletişime geçin.",
  alternates: { canonical: "/iletisim-ve-konum" },
  openGraph: { title: "Aslı Çelik Pilates — İletişim ve Konum", url: "https://www.aslicelikpilates.com/iletisim-ve-konum", images: ["/studio-hero.jpg"] },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#050507] text-[#f5f3f0]">
      <Navigation />
      <article className="mx-auto max-w-7xl px-6 pb-24 pt-40 lg:px-10">
        <Link href="/" className="text-sm text-[#c9a66b]">Ana Sayfa</Link>
        <h1 className="mt-8 max-w-4xl font-serif text-5xl lg:text-7xl">Bağlıca stüdyomuzla iletişime geçin</h1>
        <p className="mt-8 max-w-3xl text-lg leading-8 text-[#e8e4dc]/80">Aslı Çelik Pilates, Etimesgut Bağlıca’da kişiye özel reformer pilates programları sunar. Güncel seans seçenekleri ve ön görüşme için bizi arayabilirsiniz.</p>
        <div className="mt-12 grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <section className="border-t border-white/10 pt-8">
              <h2 className="font-serif text-3xl text-[#c9a66b]">Adres ve ulaşım</h2>
              <address className="mt-4 not-italic leading-8">Bağlıca Mah. Bağlıca Bulvarı No:75/36<br />Yalınkılıç İş Merkezi, Etimesgut / Ankara</address>
            </section>
            <section className="mt-10">
              <h2 className="font-serif text-3xl text-[#c9a66b]">Telefon ve e-posta</h2>
              <p className="mt-4 leading-8"><a href="tel:+905432194220">0543 219 42 20</a><br /><a href="mailto:asliclk80@hotmail.com">asliclk80@hotmail.com</a></p>
            </section>
            <section className="mt-10">
              <h2 className="font-serif text-3xl text-[#c9a66b]">Çalışma saatleri</h2>
              <p className="mt-4 leading-8">Pazartesi–Cuma: 09:00–21:00<br />Cumartesi: 09:00–13:00<br />Pazar: Kapalı</p>
              <p className="mt-4 text-sm text-[#e8e4dc]/70">Ziyaretinizden önce randevu ve seans saatini telefonla teyit edin.</p>
            </section>
            <Link href="/#iletisim" className="mt-10 inline-block rounded-full bg-[#c9a66b] px-7 py-4 text-sm font-medium text-black">Ücretsiz ön görüşme formu</Link>
          </div>
          <div className="min-w-0 lg:sticky lg:top-28"><StudioMap /></div>
        </div>
      </article>
    </main>
  );
}
