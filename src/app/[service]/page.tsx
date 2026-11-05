import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "@/components/navigation";
import { services, type ServiceSlug } from "@/lib/services";
export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(services).map((service) => ({ service })); }
export async function generateMetadata({ params }: { params: Promise<{ service: string }> }): Promise<Metadata> {
  const { service } = await params;
  const page = services[service as ServiceSlug];
  if (!page) return {};
  return { title: `${page.title} | Aslı Çelik Pilates`, description: page.description, alternates: { canonical: `/${service}` }, openGraph: { title: `${page.title} | Aslı Çelik Pilates`, description: page.description, url: `https://www.aslicelikpilates.com/${service}`, images: ["/studio-hero.jpg"] } };
}
export default async function ServicePage({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params;
  const page = services[service as ServiceSlug];
  if (!page) notFound();
  const schema = { "@context": "https://schema.org", "@type": "Service", name: page.title, description: page.description, url: `https://www.aslicelikpilates.com/${service}`, provider: { "@type": "SportsActivityLocation", "@id": "https://www.aslicelikpilates.com/#studio", name: "Aslı Çelik Pilates" }, areaServed: { "@type": "Place", name: "Bağlıca, Etimesgut, Ankara" } };
  return <main className="min-h-screen bg-[#050507] text-[#f5f3f0]">
    <Navigation />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <article className="mx-auto max-w-4xl px-6 pb-24 pt-36 lg:pt-44">
      <nav aria-label="Sayfa yolu" className="mb-10 text-sm text-[#bfa38e]"><Link href="/">Ana Sayfa</Link> / {page.title}</nav>
      <p className="mb-5 text-xs uppercase tracking-[0.25em] text-[#c9a66b]">Aslı Çelik Pilates · Etimesgut / Ankara</p>
      <h1 className="font-serif text-5xl leading-tight lg:text-7xl">{page.title}</h1>
      <p className="mt-8 text-lg leading-relaxed text-[#e8e4dc]/80">{page.intro}</p>
      <div className="mt-10 flex flex-wrap gap-4"><a href="tel:+905432194220" className="rounded-full bg-[#c9a66b] px-6 py-3 text-sm font-medium text-black">0543 219 42 20</a><Link href="/#iletisim" className="rounded-full border border-[#c9a66b]/50 px-6 py-3 text-sm">Ücretsiz ön görüşme</Link></div>
      {page.sections.map(([heading, text]) => <section key={heading} className="mt-14 border-t border-white/10 pt-10"><h2 className="font-serif text-3xl text-[#c9a66b]">{heading}</h2><p className="mt-4 leading-8 text-[#e8e4dc]/80">{text}</p></section>)}
      <section className="mt-14"><h2 className="font-serif text-3xl">Sık sorulan sorular</h2>{page.questions.map(([question, answer]) => <div key={question} className="mt-7"><h3 className="text-lg font-medium">{question}</h3><p className="mt-2 leading-8 text-[#e8e4dc]/75">{answer}</p></div>)}</section>
      <section className="mt-14 rounded-3xl border border-[#c9a66b]/30 p-8"><h2 className="font-serif text-3xl">Bağlıca stüdyomuzu ziyaret edin</h2><address className="mt-4 not-italic leading-8">Bağlıca Mah. Bağlıca Bulvarı No:75/36<br />Yalınkılıç İş Merkezi, Etimesgut / Ankara</address><p className="mt-4 text-sm leading-7">Pazartesi–Cuma 09:00–21:00 · Cumartesi 09:00–13:00 · Pazar kapalı</p><Link href="/iletisim-ve-konum" className="mt-5 inline-block text-[#c9a66b] underline">İletişim ve konum bilgileri</Link></section>
      <nav aria-label="Diğer programlar" className="mt-12 flex flex-wrap gap-5 text-sm text-[#c9a66b]">{Object.entries(services).filter(([slug]) => slug !== service).map(([slug, item]) => <Link key={slug} href={`/${slug}`} className="underline">{item.title}</Link>)}</nav>
    </article>
  </main>;
}
