"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Stüdyo", href: "/#stüdyo" },
    { label: "Program", href: "/#program" },
    { label: "Paketler", href: "/#paketler" },
    { label: "Galeri", href: "/galeri" },
    { label: "İletişim", href: "/#iletisim" },
  ];

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-700 ${
        scrolled || mobileMenuOpen
          ? "border-b border-white/10 bg-[#050507]/95 backdrop-blur-[24px]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-6 lg:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Toned by ASLI ÇELİK PILATES Studio"
            width={200}
            height={70}
            priority
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 lg:flex">
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

        <div className="flex items-center gap-3">
          <Link
            href="/#iletisim"
            className="hidden rounded-full border border-[#c9a66b]/40 bg-[#c9a66b]/10 px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.15em] text-[#c9a66b] transition hover:bg-[#c9a66b]/20 sm:inline-flex"
          >
            Görüşme Al
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menü"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-[#050507] px-6 py-6 space-y-4 lg:hidden">
          <div className="flex flex-col space-y-3">
            {links.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-light tracking-wider text-[#e8e4dc]/90 hover:text-[#c9a66b] py-1 border-b border-white/5"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="pt-2">
            <Link
              href="/#iletisim"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex w-full justify-center rounded-full border border-[#c9a66b] bg-[#c9a66b] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black"
            >
              Ücretsiz Görüşme Al
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
