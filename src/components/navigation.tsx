"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import Image from "next/image";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Stüdyo", href: "#stüdyo" },
    { label: "Program", href: "#program" },
    { label: "Paketler", href: "#paketler" },
    { label: "İletişim", href: "#iletisim" },
  ];

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-700 ${
        scrolled ? "border-b border-white/8 bg-[#0a0f14]/90 backdrop-blur-[24px]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Toned by ASLI ÇELİK PILATES Studio"
            width={200}
            height={70}
            priority
            className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative text-[13px] font-light tracking-wide text-[#e8e4dc]/80 transition-colors duration-300 hover:text-[#f5f3f0]"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-[1px] w-full origin-left scale-x-0 bg-[#c9a66b]/70 transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </a>
          ))}
        </div>

        <Link
          href="#iletisim"
          className="hidden rounded-full border border-[#c9a66b]/30 bg-[#c9a66b]/8 px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.2em] text-[#c9a66b] transition hover:border-[#c9a66b]/60 hover:bg-[#c9a66b]/15 md:inline-flex"
        >
          Görüşme Al
        </Link>
      </div>
    </nav>
  );
}
