import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/navigation";
import { getWebsiteData } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Fotoğraf Albümü & Stüdyomuz | Aslı Çelik Pilates",
  description: "Aslı Çelik Pilates Etimesgut Bağlıca stüdyosu, reformer ekipmanları ve seans fotoğrafları.",
};

export default async function GalleryPage() {
  const data = await getWebsiteData();
  const photos = data.gallery || [];

  return (
    <main className="min-h-screen bg-[#050507] text-[#f5f3f0]">
      <Navigation />

      {/* Header */}
      <section className="relative pt-36 pb-16 px-6 lg:px-10">
        <div className="mx-auto max-w-7xl text-center space-y-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#c9a66b]">Stüdyo & Yaşam</p>
          <h1 className="font-serif text-5xl font-light tracking-tight text-[#f5f3f0] lg:text-7xl">
            Fotoğraf <span className="italic text-[#c9a66b]">Albümü</span>
          </h1>
          <div className="mx-auto h-[1px] w-16 bg-gradient-to-r from-transparent via-[#c9a66b] to-transparent my-6" />
          <p className="max-w-xl mx-auto text-sm leading-[1.8] text-[#e8e4dc]/60">
            Etimesgut Bağlıca'daki butik reformer pilates stüdyomuz, modern ekipmanlarımız ve seans anlarımızdan özenle seçilmiş kareler.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-32 px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0c0c0e] shadow-2xl transition duration-500 hover:-translate-y-1.5 hover:border-[#c9a66b]/40 hover:shadow-black/80"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/90 via-[#000000]/30 to-transparent opacity-80 transition duration-300 group-hover:opacity-95" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-7 space-y-2">
                  <span className="inline-block rounded-full border border-[#c9a66b]/30 bg-[#c9a66b]/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9a66b]">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-2xl font-light leading-snug text-[#f5f3f0]">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs leading-relaxed text-[#e8e4dc]/70">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 rounded-[2.5rem] border border-white/[0.08] bg-gradient-to-r from-[#0c0c0e] via-[#121216] to-[#0c0c0e] p-10 text-center space-y-6">
            <h2 className="font-serif text-3xl font-light text-[#f5f3f0] lg:text-4xl">
              Stüdyomuzu <span className="italic text-[#c9a66b]">Yerinde Deneyimleyin</span>
            </h2>
            <p className="max-w-md mx-auto text-sm text-[#e8e4dc]/60">
              Ücretsiz duruş analizi ve stüdyo turu için hemen bir ön görüşme randevusu oluşturun.
            </p>
            <div className="pt-2">
              <Link
                href="/#iletisim"
                className="inline-flex rounded-full border border-[#c9a66b]/50 bg-[#c9a66b] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#d4af37]"
              >
                Ücretsiz Ön Görüşme Al
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#000000] py-12 px-6 lg:px-10">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-6 lg:flex-row">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Aslı Çelik Pilates" width={180} height={60} className="h-12 w-auto object-contain" />
          </div>
          <p className="text-xs text-[#e8e4dc]/40">
            © Aslı Çelik Pilates Studio — Etimesgut Bağlıca / Ankara
          </p>
        </div>
      </footer>
    </main>
  );
}
