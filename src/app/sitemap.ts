import type { MetadataRoute } from "next";
import { services } from "@/lib/services";

const origin = "https://www.aslicelikpilates.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${origin}/`,
      images: ["/studio-hero.jpg", "/instructor-portrait.jpg", "/reformer-action.jpg"].map((path) => `${origin}${path}`),
      // Home and gallery also contain editable database content without updatedAt.
      // Do not manufacture lastmod dates for these dynamic pages.
    },
    { url: `${origin}/galeri` },
    ...Object.entries(services).map(([slug, page]) => ({
      url: `${origin}/${slug}`,
      // Editorial content dates: change only when this content is actually revised.
      lastModified: page.updatedAt,
      images: [`${origin}${page.image}`],
    })),
    { url: `${origin}/iletisim-ve-konum`, lastModified: "2026-11-05" },
  ];
}
