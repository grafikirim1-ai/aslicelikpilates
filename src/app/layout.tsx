import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aslı Çelik Pilates | Etimesgut Bağlıca Butik Pilates Stüdyosu",
  description:
    "Aslı Çelik Pilates — zarif, kişisel ve sonuç odaklı reformer pilates deneyimi. Ankara Etimesgut Bağlıca'da butik stüdyo, profesyonel eğitmen kadrosu ve sürdürülebilir gelişim odaklı programlar.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-[#0a0f14] font-sans text-[#f5f3f0] antialiased selection:bg-[#c9a66b]/25 selection:text-[#f5f3f0]">
        {children}
      </body>
    </html>
  );
}
