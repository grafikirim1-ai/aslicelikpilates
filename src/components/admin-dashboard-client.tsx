"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type AdminClientProps = {
  initialData: any;
};

export function AdminDashboardClient({ initialData }: AdminClientProps) {
  const [activeTab, setActiveTab] = useState<"inquiries" | "sessions" | "packages" | "instructors" | "gallery">("inquiries");

  const [inquiriesList, setInquiriesList] = useState(initialData.recentInquiries || []);
  const [sessionsList, setSessionsList] = useState(initialData.allSessions || []);
  const [packagesList, setPackagesList] = useState(initialData.allPackages || []);
  const [instructorsList, setInstructorsList] = useState(initialData.allInstructors || []);
  const [galleryList, setGalleryList] = useState(initialData.allGallery || []);

  // Form Modals / Input states
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [newSession, setNewSession] = useState({
    title: "",
    dayLabel: "Pazartesi",
    weekday: 1,
    startTime: "09:00",
    endTime: "09:50",
    capacity: 6,
    instructorId: instructorsList[0]?.id || 1,
    level: "Başlangıç - Orta",
    location: "Bağlıca Stüdyo",
    description: "",
  });

  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [newPackage, setNewPackage] = useState({
    name: "",
    focus: "Düzenli Gelişim",
    price: "8500",
    sessionsCount: 8,
    durationDays: 30,
    description: "",
    includes: "Postür analizi, 8 seans, WhatsApp takibi",
    isPopular: false,
  });

  const [isAddingInstructor, setIsAddingInstructor] = useState(false);
  const [newInstructor, setNewInstructor] = useState({
    fullName: "",
    role: "Reformer Eğitmeni",
    specialties: "Reformer Pilates, Core Güçlendirme",
    experienceYears: 5,
    bio: "",
    phone: "+90 543 000 00 00",
    email: "egitmen@aslicelikpilates.com",
  });

  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [newGallery, setNewGallery] = useState({
    title: "",
    category: "Stüdyomuz",
    imageUrl: "",
    description: "",
  });

  // Action Handlers
  async function handleStatusChange(id: number, status: string) {
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setInquiriesList((prev: any[]) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
      }
    } catch (e) {
      alert("Hata oluştu");
    }
  }

  async function handleCreateSession(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSession),
      });
      const data = await res.json();
      if (data.ok) {
        setSessionsList((prev: any[]) => [...prev, data.session]);
        setIsAddingSession(false);
        setNewSession({
          title: "",
          dayLabel: "Pazartesi",
          weekday: 1,
          startTime: "09:00",
          endTime: "09:50",
          capacity: 6,
          instructorId: instructorsList[0]?.id || 1,
          level: "Başlangıç - Orta",
          location: "Bağlıca Stüdyo",
          description: "",
        });
      }
    } catch (e) {
      alert("Hata oluştu");
    }
  }

  async function handleDeleteSession(id: number) {
    if (!confirm("Bu seansı silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/sessions?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSessionsList((prev: any[]) => prev.filter((item) => item.id !== id));
      }
    } catch (e) {
      alert("Hata oluştu");
    }
  }

  async function handleCreatePackage(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPackage),
      });
      const data = await res.json();
      if (data.ok) {
        setPackagesList((prev: any[]) => [...prev, data.package]);
        setIsAddingPackage(false);
        setNewPackage({
          name: "",
          focus: "Düzenli Gelişim",
          price: "8500",
          sessionsCount: 8,
          durationDays: 30,
          description: "",
          includes: "Postür analizi, 8 seans, WhatsApp takibi",
          isPopular: false,
        });
      }
    } catch (e) {
      alert("Hata oluştu");
    }
  }

  async function handleDeletePackage(id: number) {
    if (!confirm("Bu paketi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/packages?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPackagesList((prev: any[]) => prev.filter((item) => item.id !== id));
      }
    } catch (e) {
      alert("Hata oluştu");
    }
  }

  async function handleCreateInstructor(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/instructors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInstructor),
      });
      const data = await res.json();
      if (data.ok) {
        setInstructorsList((prev: any[]) => [...prev, data.instructor]);
        setIsAddingInstructor(false);
        setNewInstructor({
          fullName: "",
          role: "Reformer Eğitmeni",
          specialties: "Reformer Pilates, Core Güçlendirme",
          experienceYears: 5,
          bio: "",
          phone: "+90 543 000 00 00",
          email: "egitmen@aslicelikpilates.com",
        });
      }
    } catch (e) {
      alert("Hata oluştu");
    }
  }

  async function handleDeleteInstructor(id: number) {
    if (!confirm("Bu eğitmeni silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/instructors?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setInstructorsList((prev: any[]) => prev.filter((item) => item.id !== id));
      }
    } catch (e) {
      alert("Hata oluştu");
    }
  }

  async function handleCreateGallery(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGallery),
      });
      const data = await res.json();
      if (data.ok) {
        setGalleryList((prev: any[]) => [data.gallery, ...prev]);
        setIsAddingGallery(false);
        setNewGallery({ title: "", category: "Stüdyomuz", imageUrl: "", description: "" });
      }
    } catch (e) {
      alert("Hata oluştu");
    }
  }

  async function handleDeleteGallery(id: number) {
    if (!confirm("Bu fotoğrafı silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setGalleryList((prev: any[]) => prev.filter((item) => item.id !== id));
      }
    } catch (e) {
      alert("Hata oluştu");
    }
  }

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "inquiries", label: `Gelen Talepler (${inquiriesList.length})` },
            { id: "sessions", label: `Seanslar & Program (${sessionsList.length})` },
            { id: "packages", label: `Paketler & Fiyatlar (${packagesList.length})` },
            { id: "instructors", label: `Eğitmen Kadrosu (${instructorsList.length})` },
            { id: "gallery", label: `Fotoğraf Albümü (${galleryList.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-full px-5 py-2.5 text-xs font-medium tracking-wide transition ${
                activeTab === tab.id
                  ? "border border-[#c9a66b]/40 bg-[#c9a66b] text-[#000000] shadow-md"
                  : "border border-white/[0.08] bg-[#0c0c0e] text-[#e8e4dc]/70 hover:border-[#c9a66b]/30 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <Link
            href="/galeri"
            className="rounded-full border border-[#c9a66b]/30 bg-[#c9a66b]/10 px-4 py-2 text-xs font-medium text-[#c9a66b] transition hover:bg-[#c9a66b]/20"
          >
            Galeri Sayfasına Git ↗
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/[0.08] px-4 py-2 text-xs font-medium text-[#e8e4dc]/60 transition hover:text-white"
          >
            Siteye Dön ↗
          </Link>
        </div>
      </div>

      {/* TAB 1: Gelen Talepler */}
      {activeTab === "inquiries" && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-light text-white">Müşteri Ön Görüşme Talepleri</h2>
          <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0c0c0e]">
            <table className="w-full text-left text-sm text-[#e8e4dc]/80">
              <thead className="border-b border-white/[0.08] bg-white/[0.02] text-xs uppercase tracking-wider text-[#bfa38e]">
                <tr>
                  <th className="p-4">Ad Soyad</th>
                  <th className="p-4">İletişim</th>
                  <th className="p-4">Tercih Edilen Paket</th>
                  <th className="p-4">Hedef & Mesaj</th>
                  <th className="p-4">Durum</th>
                  <th className="p-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {inquiriesList.map((item: any) => (
                  <tr key={item.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-medium text-white">{item.fullName}</td>
                    <td className="p-4 space-y-1">
                      <p className="text-xs text-[#c9a66b]">{item.phone}</p>
                      <p className="text-xs text-[#e8e4dc]/40">{item.email}</p>
                    </td>
                    <td className="p-4">{item.preferredPackage || "—"}</td>
                    <td className="p-4 max-w-xs">
                      <p className="font-medium text-xs text-white">{item.goal}</p>
                      <p className="text-xs text-[#e8e4dc]/50 line-clamp-2 mt-1">{item.message}</p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                          item.status === "new"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : item.status === "contacted"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {item.status === "new" ? "Yeni Lead" : item.status === "contacted" ? "İletişime Geçildi" : "Tamamlandı"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className="rounded-lg border border-white/10 bg-[#141418] px-2 py-1 text-xs text-white outline-none"
                      >
                        <option value="new">Yeni</option>
                        <option value="contacted">İletişime Geçildi</option>
                        <option value="completed">Tamamlandı</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Seanslar & Program */}
      {activeTab === "sessions" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-light text-white">Haftalık Ders Akışı & Seanslar</h2>
            <button
              onClick={() => setIsAddingSession(!isAddingSession)}
              className="rounded-full border border-[#c9a66b]/40 bg-[#c9a66b] px-5 py-2 text-xs font-semibold text-[#000000] hover:bg-[#d4af37]"
            >
              {isAddingSession ? "Kapat" : "+ Yeni Seans Ekle"}
            </button>
          </div>

          {isAddingSession && (
            <form onSubmit={handleCreateSession} className="grid gap-4 rounded-2xl border border-[#c9a66b]/30 bg-[#0e0e12] p-6 md:grid-cols-3">
              <div>
                <label className="text-xs text-[#bfa38e]">Seans Adı</label>
                <input
                  required
                  value={newSession.title}
                  onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                  placeholder="Örn. Sabah Reformer Flow"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-[#bfa38e]">Gün</label>
                <select
                  value={newSession.dayLabel}
                  onChange={(e) => {
                    const daysMap: Record<string, number> = { Pazartesi: 1, Salı: 2, Çarşamba: 3, Perşembe: 4, Cuma: 5, Cumartesi: 6, Pazar: 7 };
                    setNewSession({ ...newSession, dayLabel: e.target.value, weekday: daysMap[e.target.value] || 1 });
                  }}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#141418] p-2.5 text-sm text-white"
                >
                  {["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#bfa38e]">Saat Aralığı</label>
                <div className="flex gap-2 mt-1">
                  <input
                    value={newSession.startTime}
                    onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                    placeholder="09:00"
                    className="w-1/2 rounded-xl border border-white/10 bg-white/5 p-2.5 text-sm text-white"
                  />
                  <input
                    value={newSession.endTime}
                    onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
                    placeholder="09:50"
                    className="w-1/2 rounded-xl border border-white/10 bg-white/5 p-2.5 text-sm text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-[#bfa38e]">Kapasite</label>
                <input
                  type="number"
                  value={newSession.capacity}
                  onChange={(e) => setNewSession({ ...newSession, capacity: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-[#bfa38e]">Seviye</label>
                <input
                  value={newSession.level}
                  onChange={(e) => setNewSession({ ...newSession, level: e.target.value })}
                  placeholder="Başlangıç - Orta"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-[#bfa38e]">Açıklama</label>
                <input
                  value={newSession.description}
                  onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                  placeholder="Ders detay açıklaması"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-sm text-white"
                />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button type="submit" className="rounded-xl bg-[#c9a66b] px-6 py-2.5 text-xs font-semibold text-black">
                  Kaydet ve Canlıya Al
                </button>
              </div>
            </form>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sessionsList.map((session: any) => (
              <div key={session.id} className="rounded-2xl border border-white/[0.08] bg-[#0c0c0e] p-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#c9a66b]">{session.dayLabel}</span>
                    <h3 className="font-serif text-xl font-light text-white">{session.title}</h3>
                  </div>
                  <span className="text-xs text-[#e8e4dc]/50">{session.startTime} - {session.endTime}</span>
                </div>
                <p className="text-xs text-[#e8e4dc]/60">{session.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-xs text-[#e8e4dc]/50">
                  <span>Kapasite: {session.capacity} Kişi</span>
                  <button onClick={() => handleDeleteSession(session.id)} className="text-rose-400 hover:underline">
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Paketler & Fiyatlar */}
      {activeTab === "packages" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-light text-white">Yatırım Paketleri ve Fiyatlar</h2>
            <button
              onClick={() => setIsAddingPackage(!isAddingPackage)}
              className="rounded-full border border-[#c9a66b]/40 bg-[#c9a66b] px-5 py-2 text-xs font-semibold text-[#000000] hover:bg-[#d4af37]"
            >
              {isAddingPackage ? "Kapat" : "+ Yeni Paket Ekle"}
            </button>
          </div>

          {isAddingPackage && (
            <form onSubmit={handleCreatePackage} className="grid gap-4 rounded-2xl border border-[#c9a66b]/30 bg-[#0e0e12] p-6 md:grid-cols-3">
              <div>
                <label className="text-xs text-[#bfa38e]">Paket Adı</label>
                <input
                  required
                  value={newPackage.name}
                  onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                  placeholder="Örn. Denge 8'li Paket"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-[#bfa38e]">Fiyat (TL)</label>
                <input
                  required
                  value={newPackage.price}
                  onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                  placeholder="8500"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-[#bfa38e]">Ders Sayısı</label>
                <input
                  type="number"
                  value={newPackage.sessionsCount}
                  onChange={(e) => setNewPackage({ ...newPackage, sessionsCount: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-sm text-[#000000]"
                />
              </div>
              <div>
                <label className="text-xs text-[#bfa38e]">Geçerlilik (Gün)</label>
                <input
                  type="number"
                  value={newPackage.durationDays}
                  onChange={(e) => setNewPackage({ ...newPackage, durationDays: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-sm text-[#000000]"
                />
              </div>
              <div>
                <label className="text-xs text-[#bfa38e]">Odak Metni</label>
                <input
                  value={newPackage.focus}
                  onChange={(e) => setNewPackage({ ...newPackage, focus: e.target.value })}
                  placeholder="Düzenli gelişim"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-[#bfa38e]">İçerik Özellikleri (Virgülle ayırın)</label>
                <input
                  value={newPackage.includes}
                  onChange={(e) => setNewPackage({ ...newPackage, includes: e.target.value })}
                  placeholder="Postür analizi, 8 seans, WhatsApp takibi"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-sm text-white"
                />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button type="submit" className="rounded-xl bg-[#c9a66b] px-6 py-2.5 text-xs font-semibold text-black">
                  Paketi Yayınla
                </button>
              </div>
            </form>
          )}

          <div className="grid gap-6 md:grid-cols-3">
            {packagesList.map((item: any) => (
              <div key={item.id} className="rounded-2xl border border-white/[0.08] bg-[#0c0c0e] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase text-[#c9a66b]">{item.focus}</span>
                  <span className="font-serif text-2xl text-white">{new Intl.NumberFormat("tr-TR").format(Number(item.price))} TL</span>
                </div>
                <h3 className="font-serif text-xl font-light text-white">{item.name}</h3>
                <p className="text-xs text-[#e8e4dc]/60">{item.description}</p>
                <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs text-[#e8e4dc]/50">
                  <span>{item.sessionsCount} Ders / {item.durationDays} Gün</span>
                  <button onClick={() => handleDeletePackage(item.id)} className="text-rose-400 hover:underline">
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Eğitmen Kadrosu */}
      {activeTab === "instructors" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-light text-white">Eğitmen Kadrosu</h2>
            <button
              onClick={() => setIsAddingInstructor(!isAddingInstructor)}
              className="rounded-full border border-[#c9a66b]/40 bg-[#c9a66b] px-5 py-2 text-xs font-semibold text-[#000000] hover:bg-[#d4af37]"
            >
              {isAddingInstructor ? "Kapat" : "+ Yeni Eğitmen Ekle"}
            </button>
          </div>

          {isAddingInstructor && (
            <form onSubmit={handleCreateInstructor} className="grid gap-4 rounded-2xl border border-[#c9a66b]/30 bg-[#0e0e12] p-6 md:grid-cols-2">
              <div>
                <label className="text-xs text-[#bfa38e]">Ad Soyad</label>
                <input
                  required
                  value={newInstructor.fullName}
                  onChange={(e) => setNewInstructor({ ...newInstructor, fullName: e.target.value })}
                  placeholder="Örn. Aslı Çelik"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-[#bfa38e]">Unvan / Rol</label>
                <input
                  required
                  value={newInstructor.role}
                  onChange={(e) => setNewInstructor({ ...newInstructor, role: e.target.value })}
                  placeholder="Kurucu Eğitmen"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-[#bfa38e]">Uzmanlıklar (Virgülle ayırın)</label>
                <input
                  value={newInstructor.specialties}
                  onChange={(e) => setNewInstructor({ ...newInstructor, specialties: e.target.value })}
                  placeholder="Reformer Pilates, Postür Düzeltme"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-[#bfa38e]">Biyografi</label>
                <input
                  value={newInstructor.bio}
                  onChange={(e) => setNewInstructor({ ...newInstructor, bio: e.target.value })}
                  placeholder="Eğitmen öz geçmişi"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-sm text-white"
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button type="submit" className="rounded-xl bg-[#c9a66b] px-6 py-2.5 text-xs font-semibold text-black">
                  Eğitmeni Kaydet
                </button>
              </div>
            </form>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            {instructorsList.map((coach: any) => (
              <div key={coach.id} className="rounded-2xl border border-white/[0.08] bg-[#0c0c0e] p-6 space-y-3">
                <h3 className="font-serif text-xl font-light text-white">{coach.fullName}</h3>
                <p className="text-xs text-[#c9a66b]">{coach.role}</p>
                <p className="text-xs text-[#e8e4dc]/60">{coach.bio}</p>
                <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs text-[#e8e4dc]/50">
                  <span>Deneyim: {coach.experienceYears} Yıl</span>
                  <button onClick={() => handleDeleteInstructor(coach.id)} className="text-rose-400 hover:underline">
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Fotoğraf Albümü */}
      {activeTab === "gallery" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-light text-white">Fotoğraf Albümü Yönetimi</h2>
            <button
              onClick={() => setIsAddingGallery(!isAddingGallery)}
              className="rounded-full border border-[#c9a66b]/40 bg-[#c9a66b] px-5 py-2 text-xs font-semibold text-[#000000] hover:bg-[#d4af37]"
            >
              {isAddingGallery ? "Kapat" : "+ Yeni Fotoğraf Ekle"}
            </button>
          </div>

          {isAddingGallery && (
            <form onSubmit={handleCreateGallery} className="grid gap-4 rounded-2xl border border-[#c9a66b]/30 bg-[#0e0e12] p-6 md:grid-cols-2">
              <div>
                <label className="text-xs text-[#bfa38e]">Fotoğraf Başlığı</label>
                <input
                  required
                  value={newGallery.title}
                  onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                  placeholder="Örn. Özel Reformer Seansı"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-[#bfa38e]">Görsel URL / Yol (Örn: /asli-celik-reformer.jpg)</label>
                <input
                  required
                  value={newGallery.imageUrl}
                  onChange={(e) => setNewGallery({ ...newGallery, imageUrl: e.target.value })}
                  placeholder="/asli-celik-reformer.jpg"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-[#bfa38e]">Kategori</label>
                <select
                  value={newGallery.category}
                  onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#141418] p-2.5 text-sm text-white"
                >
                  <option value="Stüdyomuz">Stüdyomuz</option>
                  <option value="Eğitmen & Seans">Eğitmen & Seans</option>
                  <option value="Ekipmanlar">Ekipmanlar</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#bfa38e]">Açıklama</label>
                <input
                  value={newGallery.description}
                  onChange={(e) => setNewGallery({ ...newGallery, description: e.target.value })}
                  placeholder="Fotoğraf kısa açıklaması"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-sm text-white"
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button type="submit" className="rounded-xl bg-[#c9a66b] px-6 py-2.5 text-xs font-semibold text-black">
                  Fotoğrafı Albüme Ekle
                </button>
              </div>
            </form>
          )}

          <div className="grid gap-6 md:grid-cols-3">
            {galleryList.map((item: any) => (
              <div key={item.id} className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c0e] p-3 space-y-3">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-[#c9a66b]">{item.category}</span>
                    <h3 className="text-sm font-medium text-white">{item.title}</h3>
                  </div>
                  <button onClick={() => handleDeleteGallery(item.id)} className="text-xs text-rose-400 hover:underline">
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
