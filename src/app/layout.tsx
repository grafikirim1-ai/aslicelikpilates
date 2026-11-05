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
  metadataBase: new URL("https://www.aslicelikpilates.com"),
  title: "Bağlıca Reformer Pilates | Aslı Çelik Pilates — Etimesgut Ankara",
  description: "Ankara Etimesgut Bağlıca’da Aslı Çelik Pilates: fizyoterapist ve uzman eğitmen eşliğinde kişiye özel reformer pilates. Stüdyomuzla iletişime geçin.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Aslı Çelik Pilates",
    title: "Aslı Çelik Pilates | Bağlıca Reformer Pilates",
    description: "Etimesgut Bağlıca’da fizyoterapist ve uzman eğitmen eşliğinde kişiye özel pilates.",
    images: [{ url: "/studio-hero.jpg", alt: "Aslı Çelik Pilates Bağlıca stüdyosu" }],
  },
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
