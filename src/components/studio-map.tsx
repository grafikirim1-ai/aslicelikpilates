export default function StudioMap() {
  return (
    <section aria-label="Stüdyomuzun Google Haritalar konumu" className="overflow-hidden rounded-3xl border border-[#c9a66b]/25 bg-[#0c1016]">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
        <div>
          <h2 className="font-serif text-2xl text-[#f5f3f0]">Haritada stüdyomuz</h2>
          <p className="mt-1 text-xs text-[#e8e4dc]/60">Bağlıca · Etimesgut / Ankara</p>
        </div>
        <a href="https://maps.app.goo.gl/xR6Jhn4L9X2uZpxZ6" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#c9a66b]/40 px-4 py-2 text-xs font-medium text-[#c9a66b] transition hover:bg-[#c9a66b]/10">Yol tarifi al ↗</a>
      </div>
      <iframe
        title="Aslı Çelik Pilates — Bağlıca stüdyosunun tam konumu"
        src="https://maps.google.com/maps?q=39.8984137,32.647539&z=17&output=embed"
        className="block h-[360px] w-full border-0 lg:h-[480px]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <p className="px-6 py-4 text-xs leading-6 text-[#e8e4dc]/65">Bağlıca Bulvarı No:75/36, Yalınkılıç İş Merkezi<br />Etimesgut / Ankara</p>
    </section>
  );
}
