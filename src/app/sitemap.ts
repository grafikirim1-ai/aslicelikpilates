import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/galeri", "/baglica-reformer-pilates", "/fizyoterapist-destekli-pilates", "/hamile-pilatesi-ankara", "/iletisim-ve-konum"].map((path) => ({
    url: `https://www.aslicelikpilates.com${path === "/" ? "/" : path}`,
  }));
}
