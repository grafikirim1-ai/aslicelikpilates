"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type AdminClientProps = {
  initialData: any;
};

export function AdminDashboardClient({ initialData }: AdminClientProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Login form state
  const [loginUsername, setLoginUsername] = useState("admin");
  const [loginPassword, setLoginPassword] = useState("admin");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("admin");
  const [newPassword, setNewPassword] = useState("");
  const [credMessage, setCredMessage] = useState("");
  const [credError, setCredError] = useState("");
  const [isUpdatingCreds, setIsUpdatingCreds] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "members" | "inquiries" | "sessions" | "packages" | "instructors" | "gallery" | "security"
  >("members");

  const [membersList, setMembersList] = useState(initialData.allMembers || []);
  const [inquiriesList, setInquiriesList] = useState(initialData.recentInquiries || []);
  const [sessionsList, setSessionsList] = useState(initialData.allSessions || []);
  const [packagesList, setPackagesList] = useState(initialData.allPackages || []);
  const [instructorsList, setInstructorsList] = useState(initialData.allInstructors || []);
  const [galleryList, setGalleryList] = useState(initialData.allGallery || []);

  // New Member Modal State
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState({
    fullName: "",
    phone: "",
    email: "",
    packageName: "Bireysel 8 Seans",
    totalSessions: 8,
    remainingSessions: 8,
    totalPrice: "8000",
    paidAmount: "8000",
    paymentMethod: "Kredi Kartı",
    notes: "",
  });

  // Edit Payment Modal State
  const [editingPaymentMember, setEditingPaymentMember] = useState<any>(null);
  const [newPaidInput, setNewPaidInput] = useState("");

  const [isSendingReminders, setIsSendingReminders] = useState(false);

  async function handleSendReminders() {
    setIsSendingReminders(true);
    try {
      const res = await fetch("/api/cron/reminders", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`Bugünkü seanslar için ${data.totalRemindersSent} adet profesyonel hatırlatma e-postası başarıyla gönderildi ve kuyruğa işlendi!`);
      } else {
        alert(data.error || "Hatırlatma mailleri gönderilemedi");
      }
    } catch (e) {
      alert("Hata oluştu");
    } finally {
      setIsSendingReminders(false);
    }
  }

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
    price: "8000",
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

  useEffect(() => {
    const sessionToken = localStorage.getItem("acp_admin_auth");
    if (sessionToken === "true") {
      setIsLoggedIn(true);
    }
    setIsCheckingAuth(false);
  }, []);

  // Compute Financial Metrics
  const totalCollectedTL = membersList.reduce((acc: number, m: any) => acc + Number(m.paidAmount || 0), 0);
  const totalReceivableTL = membersList.reduce(
    (acc: number, m: any) => acc + Math.max(0, Number(m.totalPrice || 0) - Number(m.paidAmount || 0)),
    0
  );
  const totalRemainingSessionsCount = membersList.reduce(
    (acc: number, m: any) => acc + Number(m.remainingSessions || 0),
    0
  );

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("acp_admin_auth", "true");
        setIsLoggedIn(true);
      } else {
        setLoginError(data.error || "Hatalı kullanıcı adı veya şifre!");
      }
    } catch (err: any) {
      setLoginError("Giriş yapılamadı. Lütfen tekrar deneyin.");
    } finally {
      setIsLoggingIn(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("acp_admin_auth");
    setIsLoggedIn(false);
  }

  async function handleUpdateCredentials(e: React.FormEvent) {
    e.preventDefault();
    setCredMessage("");
    setCredError("");
    setIsUpdatingCreds(true);
    try {
      const res = await fetch("/api/admin/credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newUsername,
          newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCredMessage("Kullanıcı adı ve şifre başarıyla güncellendi!");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setCredError(data.error || "Güncellenemedi.");
      }
    } catch (err: any) {
      setCredError("Bir hata oluştu.");
    } finally {
      setIsUpdatingCreds(false);
    }
  }

  // Member Action Handlers
  async function handleCreateMember(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      });
      const data = await res.json();
      if (data.ok) {
        setMembersList((prev: any[]) => [data.member, ...prev]);
        setIsAddingMember(false);
        setNewMember({
          fullName: "",
          phone: "",
          email: "",
          packageName: "Bireysel 8 Seans",
          totalSessions: 8,
          remainingSessions: 8,
          totalPrice: "8000",
          paidAmount: "8000",
          paymentMethod: "Kredi Kartı",
          notes: "",
        });
      } else {
        alert(data.error || "Eklenemedi");
      }
    } catch (e) {
      alert("Hata oluştu");
    }
  }

  async function handleUseSession(id: number) {
    try {
      const res = await fetch("/api/admin/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "use_session" }),
      });
      const data = await res.json();
      if (data.ok) {
        setMembersList((prev: any[]) => prev.map((m) => (m.id === id ? data.member : m)));
      }
    } catch (e) {
      alert("Seans düşülemedi");
    }
  }

  async function handleUpdatePaymentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingPaymentMember) return;
    try {
      const res = await fetch("/api/admin/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingPaymentMember.id, paidAmount: newPaidInput }),
      });
      const data = await res.json();
      if (data.ok) {
        setMembersList((prev: any[]) => prev.map((m) => (m.id === editingPaymentMember.id ? data.member : m)));
        setEditingPaymentMember(null);
      } else {
        alert(data.error || "Ödeme güncellenemedi");
      }
    } catch (e) {
      alert("Hata oluştu");
    }
  }

  async function handleDeleteMember(id: number) {
    if (!confirm("Bu üye kaydını silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/members?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMembersList((prev: any[]) => prev.filter((m) => m.id !== id));
      }
    } catch (e) {
      alert("Silinemedi");
    }
  }

  // Other Action Handlers
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
      } else {
        alert(data.error || "Eklenemedi");
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
      alert("Silinemedi");
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
        setPackagesList((prev: any[]) => [...prev, data.pkg]);
        setIsAddingPackage(false);
      } else {
        alert(data.error || "Eklenemedi");
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
      alert("Silinemedi");
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
      } else {
        alert(data.error || "Eklenemedi");
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
      alert("Silinemedi");
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
        setGalleryList((prev: any[]) => [...prev, data.item]);
        setIsAddingGallery(false);
      } else {
        alert(data.error || "Eklenemedi");
      }
    } catch (e) {
      alert("Hata oluştu");
    }
  }

  async function handleDeleteGallery(id: number) {
    if (!confirm("Bu fotoğrafı albümden silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setGalleryList((prev: any[]) => prev.filter((item) => item.id !== id));
      }
    } catch (e) {
      alert("Silinemedi");
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-sm text-[#e8e4dc]/50">
        Yönetim paneli yükleniyor...
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-md rounded-[2.5rem] border border-white/[0.08] bg-[#0c0c0e] p-8 sm:p-10 shadow-2xl space-y-8">
        <div className="text-center space-y-3">
          <Image
            src="/logo.png"
            alt="Aslı Çelik Pilates Studio"
            width={220}
            height={70}
            className="mx-auto h-14 w-auto object-contain"
          />
          <h2 className="font-serif text-2xl font-light text-[#f5f3f0]">Yönetim Girişi</h2>
          <p className="text-xs text-[#e8e4dc]/50">
            Devam etmek için yönetim panelinizin kullanıcı adı ve şifresini girin.
          </p>
        </div>

        {loginError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-xs font-medium text-red-400">
            {loginError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#bfa38e]">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              required
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              className="w-full rounded-xl border border-white/[0.1] bg-black/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#c9a66b]"
              placeholder="admin"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#bfa38e]">
              Şifre
            </label>
            <input
              type="password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full rounded-xl border border-white/[0.1] bg-black/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#c9a66b]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full rounded-full border border-[#c9a66b]/40 bg-[#c9a66b] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#d4af37] disabled:opacity-50"
          >
            {isLoggingIn ? "Giriş Yapılıyor..." : "Yönetim Paneline Giriş Yap"}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[11px] text-[#e8e4dc]/40">
            Varsayılan Giriş: kullanıcı adı <code className="text-[#c9a66b]">admin</code> / şifre <code className="text-[#c9a66b]">admin</code>
          </p>
        </div>
      </div>
    );
  }

  // LOGGED IN ADMIN DASHBOARD
  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="flex overflow-x-auto scrollbar-none gap-2 sm:gap-3 py-1">
          {[
            { id: "members", label: "👥 Üyeler & Tahsilat", count: membersList.length },
            { id: "inquiries", label: "Başvurular", count: inquiriesList.length },
            { id: "sessions", label: "Seanslar", count: sessionsList.length },
            { id: "packages", label: "Paketler", count: packagesList.length },
            { id: "instructors", label: "Eğitmenler", count: instructorsList.length },
            { id: "gallery", label: "Fotoğraf Albümü", count: galleryList.length },
            { id: "security", label: "🔑 Şifre & Ayarlar", count: null },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`shrink-0 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-medium tracking-wide transition ${
                activeTab === tab.id
                  ? "bg-[#c9a66b] text-black shadow-lg shadow-[#c9a66b]/20"
                  : "border border-white/[0.08] bg-white/5 text-[#e8e4dc]/70 hover:border-[#c9a66b]/30 hover:text-white"
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-[10px] ${
                    activeTab === tab.id ? "bg-black/20 text-black" : "bg-white/10 text-[#c9a66b]"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="shrink-0 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/20"
        >
          Çıkış
        </button>
      </div>

      {/* TAB 1: MEMBERS & FINANCIAL TRACKING */}
      {activeTab === "members" && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/[0.08] bg-white/5 p-5 space-y-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#bfa38e]">Toplam Tahsilat</p>
              <p className="font-serif text-3xl font-light text-[#c9a66b]">
                {totalCollectedTL.toLocaleString("tr-TR")} TL
              </p>
              <p className="text-[11px] text-[#e8e4dc]/40">Alınan ödemeler toplamı</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/5 p-5 space-y-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#bfa38e]">Bekleyen Alacak</p>
              <p className="font-serif text-3xl font-light text-amber-400">
                {totalReceivableTL.toLocaleString("tr-TR")} TL
              </p>
              <p className="text-[11px] text-[#e8e4dc]/40">Kısmi / kalan ödemeler</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/5 p-5 space-y-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#bfa38e]">Aktif Üye Kaydı</p>
              <p className="font-serif text-3xl font-light text-white">{membersList.length} Üye</p>
              <p className="text-[11px] text-[#e8e4dc]/40">Kayıtlı pilates öğrencileri</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/5 p-5 space-y-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#bfa38e]">Kalan Toplam Seans</p>
              <p className="font-serif text-3xl font-light text-emerald-400">{totalRemainingSessionsCount} Seans</p>
              <p className="text-[11px] text-[#e8e4dc]/40">Üyelerin hakkı kalan seanslar</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-light text-[#f5f3f0]">Üye & Seans & Ödeme Takibi</h2>
              <p className="text-xs text-[#e8e4dc]/50">Üyelerin seans düşümlerini yapın, ödemelerini kaydedin ve takibini yapın.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleSendReminders}
                disabled={isSendingReminders}
                className="rounded-full border border-[#c9a66b]/40 bg-[#c9a66b]/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#c9a66b] transition hover:bg-[#c9a66b]/20 disabled:opacity-50"
              >
                {isSendingReminders ? "Gönderiliyor..." : "📨 Sabah Hatırlatma Maillerini Gönder"}
              </button>
              <button
                onClick={() => setIsAddingMember(true)}
                className="rounded-full bg-[#c9a66b] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-black transition hover:bg-[#d4af37]"
              >
                + Yeni Üye Kaydı Al
              </button>
            </div>
          </div>

          {/* New Member Registration Modal */}
          {isAddingMember && (
            <form onSubmit={handleCreateMember} className="rounded-2xl border border-[#c9a66b]/30 bg-[#121216] p-6 space-y-4">
              <h3 className="font-serif text-xl text-[#c9a66b]">Yeni Üye Kaydı & Paket Satışı</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <input
                  type="text"
                  placeholder="Ad Soyad"
                  required
                  value={newMember.fullName}
                  onChange={(e) => setNewMember({ ...newMember, fullName: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
                <input
                  type="text"
                  placeholder="Telefon (Örn: 0543 219 42 20)"
                  required
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
                <input
                  type="email"
                  placeholder="E-posta (İsteğe bağlı)"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
                <select
                  value={newMember.packageName}
                  onChange={(e) => {
                    const selPkg = packagesList.find((p: any) => p.name === e.target.value);
                    setNewMember({
                      ...newMember,
                      packageName: e.target.value,
                      totalSessions: selPkg?.sessionsCount || 8,
                      remainingSessions: selPkg?.sessionsCount || 8,
                      totalPrice: String(selPkg?.price || "8000"),
                      paidAmount: String(selPkg?.price || "8000"),
                    });
                  }}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                >
                  {packagesList.map((pkg: any) => (
                    <option key={pkg.id} value={pkg.name}>{pkg.name} ({Number(pkg.price).toLocaleString("tr-TR")} TL)</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Toplam Seans Hakkı (Örn: 8)"
                  value={newMember.totalSessions}
                  onChange={(e) => setNewMember({ ...newMember, totalSessions: parseInt(e.target.value, 10) || 8, remainingSessions: parseInt(e.target.value, 10) || 8 })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
                <input
                  type="text"
                  placeholder="Paket Ücreti (TL - Örn: 8000)"
                  value={newMember.totalPrice}
                  onChange={(e) => setNewMember({ ...newMember, totalPrice: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
                <input
                  type="text"
                  placeholder="Tahsil Edilen Tutar (TL - Örn: 8000)"
                  value={newMember.paidAmount}
                  onChange={(e) => setNewMember({ ...newMember, paidAmount: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
                <select
                  value={newMember.paymentMethod}
                  onChange={(e) => setNewMember({ ...newMember, paymentMethod: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                >
                  <option value="Kredi Kartı">Kredi Kartı</option>
                  <option value="Havale/EFT">Havale/EFT</option>
                  <option value="Nakit">Nakit</option>
                </select>
                <input
                  type="text"
                  placeholder="Sağlık Notu / Özel İhtiyaç"
                  value={newMember.notes}
                  onChange={(e) => setNewMember({ ...newMember, notes: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingMember(false)}
                  className="rounded-full border border-white/20 px-5 py-2 text-xs text-white/70 hover:text-white"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#c9a66b] px-6 py-2 text-xs font-semibold text-black hover:bg-[#d4af37]"
                >
                  Üyeyi Kaydet
                </button>
              </div>
            </form>
          )}

          {/* Edit Payment Modal */}
          {editingPaymentMember && (
            <form onSubmit={handleUpdatePaymentSubmit} className="rounded-2xl border border-[#c9a66b]/30 bg-[#121216] p-6 space-y-4 max-w-md mx-auto">
              <h3 className="font-serif text-xl text-[#c9a66b]">Tahsilat / Ödeme Güncelle</h3>
              <p className="text-xs text-[#e8e4dc]/60">
                {editingPaymentMember.fullName} — {editingPaymentMember.packageName} (Toplam: {Number(editingPaymentMember.totalPrice).toLocaleString("tr-TR")} TL)
              </p>
              <div className="space-y-1.5">
                <label className="text-xs text-[#bfa38e]">Tahsil Edilen Toplam Tutar (TL)</label>
                <input
                  type="text"
                  required
                  value={newPaidInput}
                  onChange={(e) => setNewPaidInput(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPaymentMember(null)}
                  className="rounded-full border border-white/20 px-4 py-2 text-xs text-white/70"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#c9a66b] px-6 py-2 text-xs font-semibold text-black hover:bg-[#d4af37]"
                >
                  Tahsilatı Kaydet
                </button>
              </div>
            </form>
          )}

          {/* Members List Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0c0c0e]">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-white/[0.08] bg-white/5 text-[11px] uppercase tracking-wider text-[#bfa38e]">
                <tr>
                  <th className="px-4 py-3.5">Üye Bilgileri</th>
                  <th className="px-4 py-3.5">Paket & Kalan Seans</th>
                  <th className="px-4 py-3.5">Ödeme & Tahsilat</th>
                  <th className="px-4 py-3.5">Yöntem / Not</th>
                  <th className="px-4 py-3.5 text-right">Aksiyonlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-[#e8e4dc]/80">
                {membersList.map((m: any) => {
                  const paid = Number(m.paidAmount || 0);
                  const total = Number(m.totalPrice || 0);
                  const remainingTL = Math.max(0, total - paid);

                  return (
                    <tr key={m.id} className="transition hover:bg-white/[0.02]">
                      <td className="px-4 py-4 space-y-0.5">
                        <p className="font-medium text-white">{m.fullName}</p>
                        <p className="text-xs text-[#e8e4dc]/50">{m.phone}</p>
                      </td>
                      <td className="px-4 py-4 space-y-1">
                        <span className="inline-block rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-[#c9a66b]">
                          {m.packageName}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold ${
                              m.remainingSessions > 2
                                ? "text-emerald-400"
                                : m.remainingSessions > 0
                                ? "text-amber-400"
                                : "text-red-400"
                            }`}
                          >
                            {m.remainingSessions} / {m.totalSessions} Seans Kalan
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 space-y-1">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            m.paymentStatus === "paid"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : m.paymentStatus === "partial"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {m.paymentStatus === "paid"
                            ? "Tam Ödendi"
                            : m.paymentStatus === "partial"
                            ? `Kısmi (Kalan ${remainingTL.toLocaleString("tr-TR")} TL)`
                            : "Ödeme Bekliyor"}
                        </span>
                        <p className="text-xs text-white">
                          {paid.toLocaleString("tr-TR")} TL / {total.toLocaleString("tr-TR")} TL
                        </p>
                      </td>
                      <td className="px-4 py-4 space-y-0.5 text-xs">
                        <p className="text-[#e8e4dc]/60">{m.paymentMethod}</p>
                        {m.notes && <p className="text-[11px] text-[#c9a66b]/80 italic">{m.notes}</p>}
                      </td>
                      <td className="px-4 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleUseSession(m.id)}
                          disabled={m.remainingSessions <= 0}
                          title="Seansı düşer (-1 Seans)"
                          className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300 transition hover:bg-emerald-500/20 disabled:opacity-30"
                        >
                          -1 Seans
                        </button>
                        <button
                          onClick={() => {
                            setEditingPaymentMember(m);
                            setNewPaidInput(String(m.paidAmount));
                          }}
                          className="rounded-full border border-[#c9a66b]/30 bg-[#c9a66b]/10 px-3 py-1 text-xs text-[#c9a66b] transition hover:bg-[#c9a66b]/20"
                        >
                          Tahsilat
                        </button>
                        <button
                          onClick={() => handleDeleteMember(m.id)}
                          className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs text-red-400 transition hover:bg-red-500/20"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: INQUIRIES */}
      {activeTab === "inquiries" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-light text-[#f5f3f0]">Müşteri Başvuru Talepleri</h2>
              <p className="text-xs text-[#e8e4dc]/50">Web sitesinden form dolduran ziyaretçilerin bilgileri ve iletişim durumları.</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0c0c0e]">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-white/[0.08] bg-white/5 text-[11px] uppercase tracking-wider text-[#bfa38e]">
                <tr>
                  <th className="px-4 py-3.5">Ad Soyad</th>
                  <th className="px-4 py-3.5">Telefon & E-posta</th>
                  <th className="px-4 py-3.5">Hedef / İlgi</th>
                  <th className="px-4 py-3.5">Durum</th>
                  <th className="px-4 py-3.5 text-right">Aksiyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-[#e8e4dc]/80">
                {inquiriesList.map((item: any) => (
                  <tr key={item.id} className="transition hover:bg-white/[0.02]">
                    <td className="px-4 py-4 font-medium text-white">{item.fullName}</td>
                    <td className="px-4 py-4 space-y-0.5">
                      <p className="text-white">{item.phone}</p>
                      <p className="text-xs text-[#e8e4dc]/40">{item.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-[#c9a66b]">
                        {item.goal || item.preferredPackage || "Genel Bilgi"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
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
                    <td className="px-4 py-4 text-right">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className="rounded-lg border border-white/[0.1] bg-black px-2.5 py-1 text-xs text-white outline-none focus:border-[#c9a66b]"
                      >
                        <option value="new">Yeni Lead</option>
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

      {/* TAB 3: SESSIONS */}
      {activeTab === "sessions" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-light text-[#f5f3f0]">Haftalık Ders Akışı & Seanslar</h2>
              <p className="text-xs text-[#e8e4dc]/50">Ana sayfadaki ders programı akışını ve saatlerini düzenleyin.</p>
            </div>
            <button
              onClick={() => setIsAddingSession(true)}
              className="self-start sm:self-auto rounded-full bg-[#c9a66b] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black transition hover:bg-[#d4af37]"
            >
              + Yeni Seans Ekle
            </button>
          </div>

          {/* Modal / Form for Session */}
          {isAddingSession && (
            <form onSubmit={handleCreateSession} className="rounded-2xl border border-[#c9a66b]/30 bg-[#121216] p-6 space-y-4">
              <h3 className="font-serif text-xl text-[#c9a66b]">Yeni Seans Tanımla</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <input
                  type="text"
                  placeholder="Ders Adı (Örn: Reformer Flow)"
                  required
                  value={newSession.title}
                  onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
                <select
                  value={newSession.dayLabel}
                  onChange={(e) => setNewSession({ ...newSession, dayLabel: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                >
                  {["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"].map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="09:00"
                    value={newSession.startTime}
                    onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                    className="w-1/2 rounded-xl border border-white/10 bg-black/60 px-3 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                  />
                  <span className="text-white">-</span>
                  <input
                    type="text"
                    placeholder="09:50"
                    value={newSession.endTime}
                    onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
                    className="w-1/2 rounded-xl border border-white/10 bg-black/60 px-3 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                  />
                </div>
                <input
                  type="number"
                  placeholder="Kapasite (Örn: 5)"
                  value={newSession.capacity}
                  onChange={(e) => setNewSession({ ...newSession, capacity: parseInt(e.target.value, 10) || 4 })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
                <input
                  type="text"
                  placeholder="Seviye (Örn: Başlangıç - Orta)"
                  value={newSession.level}
                  onChange={(e) => setNewSession({ ...newSession, level: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
                <input
                  type="text"
                  placeholder="Açıklama"
                  value={newSession.description}
                  onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingSession(false)}
                  className="rounded-full border border-white/20 px-5 py-2 text-xs text-white/70 hover:text-white"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#c9a66b] px-6 py-2 text-xs font-semibold text-black hover:bg-[#d4af37]"
                >
                  Kaydet
                </button>
              </div>
            </form>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sessionsList.map((item: any) => (
              <div key={item.id} className="relative rounded-2xl border border-white/[0.08] bg-[#0c0c0e] p-6 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[#c9a66b]">{item.dayLabel}</span>
                    <h3 className="font-serif text-xl text-white">{item.title}</h3>
                  </div>
                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-[#c9a66b]">{item.capacity} kişilik</span>
                </div>
                <p className="text-xs text-[#e8e4dc]/60">Saat: {item.startTime} — {item.endTime}</p>
                <p className="text-xs text-[#e8e4dc]/50">{item.description}</p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleDeleteSession(item.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Seansı Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PACKAGES */}
      {activeTab === "packages" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-light text-[#f5f3f0]">Üyelik Paketleri & Fiyat Listesi</h2>
              <p className="text-xs text-[#e8e4dc]/50">Web sitesindeki resmi paket adlarını, fiyatlarını ve ders sayılarını yönetin.</p>
            </div>
            <button
              onClick={() => setIsAddingPackage(true)}
              className="self-start sm:self-auto rounded-full bg-[#c9a66b] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black transition hover:bg-[#d4af37]"
            >
              + Yeni Paket Ekle
            </button>
          </div>

          {/* Modal / Form for Package */}
          {isAddingPackage && (
            <form onSubmit={handleCreatePackage} className="rounded-2xl border border-[#c9a66b]/30 bg-[#121216] p-6 space-y-4">
              <h3 className="font-serif text-xl text-[#c9a66b]">Yeni Üyelik Paketi Oluştur</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <input
                  type="text"
                  placeholder="Paket Adı (Örn: 2 Kişilik 8 Seans)"
                  required
                  value={newPackage.name}
                  onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
                <input
                  type="text"
                  placeholder="Fiyat (TL - Örn: 5500)"
                  required
                  value={newPackage.price}
                  onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
                <input
                  type="number"
                  placeholder="Seans Sayısı (Örn: 8)"
                  value={newPackage.sessionsCount}
                  onChange={(e) => setNewPackage({ ...newPackage, sessionsCount: parseInt(e.target.value, 10) || 8 })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
                <input
                  type="text"
                  placeholder="Odak Metni (Örn: 2 Kişilik Düet)"
                  value={newPackage.focus}
                  onChange={(e) => setNewPackage({ ...newPackage, focus: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
                <input
                  type="text"
                  placeholder="Açıklama"
                  value={newPackage.description}
                  onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
                <input
                  type="text"
                  placeholder="İçerikler (virgülle ayırın)"
                  value={newPackage.includes}
                  onChange={(e) => setNewPackage({ ...newPackage, includes: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingPackage(false)}
                  className="rounded-full border border-white/20 px-5 py-2 text-xs text-white/70 hover:text-white"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#c9a66b] px-6 py-2 text-xs font-semibold text-black hover:bg-[#d4af37]"
                >
                  Kaydet
                </button>
              </div>
            </form>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {packagesList.map((item: any) => (
              <div key={item.id} className="relative rounded-2xl border border-white/[0.08] bg-[#0c0c0e] p-6 space-y-3">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#c9a66b]">{item.focus}</span>
                <h3 className="font-serif text-xl text-white">{item.name}</h3>
                <p className="font-serif text-3xl font-light text-[#c9a66b]">{Number(item.price).toLocaleString("tr-TR")} TL</p>
                <p className="text-xs text-[#e8e4dc]/50">{item.sessionsCount} Seans — {item.durationDays} gün geçerli</p>
                <p className="text-xs leading-relaxed text-[#e8e4dc]/70">{item.description}</p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleDeletePackage(item.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Paketi Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: INSTRUCTORS */}
      {activeTab === "instructors" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-light text-[#f5f3f0]">Eğitmen Kadrosu</h2>
              <p className="text-xs text-[#e8e4dc]/50">Stüdyo eğitmen kadrosunu ve uzmanlık alanlarını güncelleyin.</p>
            </div>
            <button
              onClick={() => setIsAddingInstructor(true)}
              className="self-start sm:self-auto rounded-full bg-[#c9a66b] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black transition hover:bg-[#d4af37]"
            >
              + Eğitmen Ekle
            </button>
          </div>

          {/* Modal / Form for Instructor */}
          {isAddingInstructor && (
            <form onSubmit={handleCreateInstructor} className="rounded-2xl border border-[#c9a66b]/30 bg-[#121216] p-6 space-y-4">
              <h3 className="font-serif text-xl text-[#c9a66b]">Yeni Eğitmen Ekle</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <input
                  type="text"
                  placeholder="Ad Soyad"
                  required
                  value={newInstructor.fullName}
                  onChange={(e) => setNewInstructor({ ...newInstructor, fullName: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
                <input
                  type="text"
                  placeholder="Unvan (Örn: Kurucu Eğitmen)"
                  value={newInstructor.role}
                  onChange={(e) => setNewInstructor({ ...newInstructor, role: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
                <input
                  type="text"
                  placeholder="Uzmanlıklar (virgülle ayırın)"
                  value={newInstructor.specialties}
                  onChange={(e) => setNewInstructor({ ...newInstructor, specialties: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
                <input
                  type="text"
                  placeholder="Biyografi / Açıklama"
                  value={newInstructor.bio}
                  onChange={(e) => setNewInstructor({ ...newInstructor, bio: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingInstructor(false)}
                  className="rounded-full border border-white/20 px-5 py-2 text-xs text-white/70 hover:text-white"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#c9a66b] px-6 py-2 text-xs font-semibold text-black hover:bg-[#d4af37]"
                >
                  Kaydet
                </button>
              </div>
            </form>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {instructorsList.map((item: any) => (
              <div key={item.id} className="relative rounded-2xl border border-white/[0.08] bg-[#0c0c0e] p-6 space-y-3">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#c9a66b]">{item.role}</span>
                <h3 className="font-serif text-xl text-white">{item.fullName}</h3>
                <p className="text-xs leading-relaxed text-[#e8e4dc]/70">{item.bio}</p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleDeleteInstructor(item.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Eğitmeni Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: GALLERY */}
      {activeTab === "gallery" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-light text-[#f5f3f0]">Fotoğraf Albümü Yönetimi</h2>
              <p className="text-xs text-[#e8e4dc]/50">Web sitesi ve /galeri sayfasındaki fotoğrafları ekleyin veya düzenleyin.</p>
            </div>
            <button
              onClick={() => setIsAddingGallery(true)}
              className="self-start sm:self-auto rounded-full bg-[#c9a66b] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black transition hover:bg-[#d4af37]"
            >
              + Fotoğraf Ekle
            </button>
          </div>

          {/* Modal / Form for Gallery */}
          {isAddingGallery && (
            <form onSubmit={handleCreateGallery} className="rounded-2xl border border-[#c9a66b]/30 bg-[#121216] p-6 space-y-4">
              <h3 className="font-serif text-xl text-[#c9a66b]">Yeni Fotoğraf Ekle</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Başlık (Örn: Reformer Seans Alanı)"
                  required
                  value={newGallery.title}
                  onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
                <input
                  type="text"
                  placeholder="Görsel URL veya /asli-celik-reformer.jpg"
                  required
                  value={newGallery.imageUrl}
                  onChange={(e) => setNewGallery({ ...newGallery, imageUrl: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
                <select
                  value={newGallery.category}
                  onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                >
                  <option value="Stüdyomuz">Stüdyomuz</option>
                  <option value="Eğitmen & Seans">Eğitmen & Seans</option>
                  <option value="Ekipmanlar">Ekipmanlar</option>
                </select>
                <input
                  type="text"
                  placeholder="Açıklama (İsteğe bağlı)"
                  value={newGallery.description}
                  onChange={(e) => setNewGallery({ ...newGallery, description: e.target.value })}
                  className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingGallery(false)}
                  className="rounded-full border border-white/20 px-5 py-2 text-xs text-white/70 hover:text-white"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#c9a66b] px-6 py-2 text-xs font-semibold text-black hover:bg-[#d4af37]"
                >
                  Kaydet
                </button>
              </div>
            </form>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryList.map((item: any) => (
              <div key={item.id} className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c0e] p-4 space-y-3">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-black">
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-[#c9a66b] font-medium">{item.category}</span>
                  <h4 className="font-serif text-lg text-white">{item.title}</h4>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleDeleteGallery(item.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Fotoğrafı Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: SECURITY / CREDENTIALS */}
      {activeTab === "security" && (
        <div className="mx-auto max-w-xl space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-light text-[#f5f3f0]">Yönetim Şifresi ve Kullanıcı Adı Değiştirme</h2>
            <p className="text-xs text-[#e8e4dc]/50">Yönetim paneline giriş bilgilerinizi istediğiniz zaman güncelleyebilirsiniz.</p>
          </div>

          {credMessage && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300 font-medium">
              {credMessage}
            </div>
          )}

          {credError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-400 font-medium">
              {credError}
            </div>
          )}

          <form onSubmit={handleUpdateCredentials} className="rounded-2xl border border-white/[0.08] bg-[#0c0c0e] p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#bfa38e]">
                Mevcut Şifre
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                placeholder="Mevcut şifreniz"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#bfa38e]">
                Yeni Kullanıcı Adı
              </label>
              <input
                type="text"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                placeholder="admin"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#bfa38e]">
                Yeni Şifre
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                placeholder="Yeni şifreniz"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingCreds}
              className="w-full rounded-full bg-[#c9a66b] py-3 text-xs font-semibold uppercase tracking-wider text-black transition hover:bg-[#d4af37] disabled:opacity-50"
            >
              {isUpdatingCreds ? "Güncelleniyor..." : "Giriş Bilgilerini Güncelle"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
