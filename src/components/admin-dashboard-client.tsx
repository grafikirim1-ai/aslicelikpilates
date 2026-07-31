"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  ClipboardList,
  CalendarDays,
  Diamond,
  Dumbbell,
  Image as ImageIcon,
  Settings,
  Menu,
  X,
  Search,
  Filter,
  LogOut,
} from "lucide-react";

type AdminClientProps = {
  initialData: any;
};

export function AdminDashboardClient({ initialData }: AdminClientProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Sidebar & Navigation Drawer State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Member Search & Filters State
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [memberStatusFilter, setMemberStatusFilter] = useState("all");
  const [memberInstructorFilter, setMemberInstructorFilter] = useState("all");

  // Role and Auth state
  const [loginRole, setLoginRole] = useState<"admin" | "instructor">("admin");
  const [selectedInstructorLoginId, setSelectedInstructorLoginId] = useState<number | null>(null);

  const [userRole, setUserRole] = useState<"admin" | "instructor">("admin");
  const [currentInstructorId, setCurrentInstructorId] = useState<number | null>(null);

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
    instructorId: "",
    status: "active",
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
        alert(`Bugünkü seanslar için ${data.totalRemindersSent} adet hatırlatma e-postası başarıyla gönderildi!`);
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
    level: "Tüm Seviyeler",
    location: "Bağlıca Stüdyo",
    description: "",
    isPrivate: false,
    memberId: "",
    memberName: "",
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

  // Edit states
  const [editingSession, setEditingSession] = useState<any>(null);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [editingInstructor, setEditingInstructor] = useState<any>(null);
  const [editingMember, setEditingMember] = useState<any>(null);

  useEffect(() => {
    const sessionToken = localStorage.getItem("acp_admin_auth");
    const storedRole = (localStorage.getItem("acp_user_role") as "admin" | "instructor") || "admin";
    const storedInstructorId = localStorage.getItem("acp_instructor_id");

    if (sessionToken === "true") {
      setIsLoggedIn(true);
      setUserRole(storedRole);
      if (storedInstructorId) {
        setCurrentInstructorId(Number(storedInstructorId));
      }
    }
    setIsCheckingAuth(false);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");

    if (loginRole === "instructor") {
      if (!selectedInstructorLoginId) {
        setLoginError("Lütfen giriş yapmak istediğiniz eğitmeni seçin.");
        return;
      }
      localStorage.setItem("acp_admin_auth", "true");
      localStorage.setItem("acp_user_role", "instructor");
      localStorage.setItem("acp_instructor_id", String(selectedInstructorLoginId));
      setUserRole("instructor");
      setCurrentInstructorId(selectedInstructorLoginId);
      setIsLoggedIn(true);
      return;
    }

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
        localStorage.setItem("acp_user_role", "admin");
        localStorage.removeItem("acp_instructor_id");
        setUserRole("admin");
        setCurrentInstructorId(null);
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
    localStorage.removeItem("acp_user_role");
    localStorage.removeItem("acp_instructor_id");
    setIsLoggedIn(false);
    setUserRole("admin");
    setCurrentInstructorId(null);
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

  // Member Handlers
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
          instructorId: "",
          status: "active",
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

  async function handleAddSession(id: number) {
    try {
      const res = await fetch("/api/admin/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "add_session" }),
      });
      const data = await res.json();
      if (data.ok) {
        setMembersList((prev: any[]) => prev.map((m) => (m.id === id ? data.member : m)));
      }
    } catch (e) {
      alert("Seans eklenemedi");
    }
  }

  async function handleAssignInstructor(memberId: number, instructorId: number | null, newStatus: string = "active") {
    try {
      const res = await fetch("/api/admin/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: memberId,
          instructorId,
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setMembersList((prev: any[]) => prev.map((m) => (m.id === memberId ? data.member : m)));
      } else {
        alert(data.error || "Eğitmen ataması yapılamadı.");
      }
    } catch (e) {
      alert("Hata oluştu.");
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

  // Other Handlers
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
      const payload = {
        ...newSession,
        instructorId: userRole === "instructor" && currentInstructorId ? currentInstructorId : newSession.instructorId,
      };
      const res = await fetch("/api/admin/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    if (!confirm("Bu fotoğrafı silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setGalleryList((prev: any[]) => prev.filter((item) => item.id !== id));
      }
    } catch (e) {
      alert("Silinemedi");
    }
  }

  async function handleUpdateSession(e: React.FormEvent) {
    e.preventDefault();
    if (!editingSession) return;
    try {
      const res = await fetch("/api/admin/sessions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSession),
      });
      const data = await res.json();
      if (data.ok) {
        setSessionsList((prev: any[]) => prev.map((s) => (s.id === editingSession.id ? data.session : s)));
        setEditingSession(null);
      } else {
        alert(data.error || "Güncellenemedi");
      }
    } catch (e) {
      alert("Hata oluştu");
    }
  }

  async function handleUpdatePackage(e: React.FormEvent) {
    e.preventDefault();
    if (!editingPackage) return;
    try {
      const res = await fetch("/api/admin/packages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPackage),
      });
      const data = await res.json();
      if (data.ok) {
        setPackagesList((prev: any[]) => prev.map((p) => (p.id === editingPackage.id ? data.package : p)));
        setEditingPackage(null);
      } else {
        alert(data.error || "Güncellenemedi");
      }
    } catch (e) {
      alert("Hata oluştu");
    }
  }

  async function handleUpdateInstructor(e: React.FormEvent) {
    e.preventDefault();
    if (!editingInstructor) return;
    try {
      const res = await fetch("/api/admin/instructors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingInstructor),
      });
      const data = await res.json();
      if (data.ok) {
        setInstructorsList((prev: any[]) => prev.map((i) => (i.id === editingInstructor.id ? data.instructor : i)));
        setEditingInstructor(null);
      } else {
        alert(data.error || "Güncellenemedi");
      }
    } catch (e) {
      alert("Hata oluştu");
    }
  }

  async function handleUpdateMember(e: React.FormEvent) {
    e.preventDefault();
    if (!editingMember) return;
    try {
      const res = await fetch("/api/admin/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingMember.id,
          fullName: editingMember.fullName,
          phone: editingMember.phone,
          email: editingMember.email,
          packageName: editingMember.packageName,
          totalSessions: Number(editingMember.totalSessions),
          remainingSessions: Number(editingMember.remainingSessions),
          totalPrice: editingMember.totalPrice,
          paidAmount: editingMember.paidAmount,
          paymentMethod: editingMember.paymentMethod,
          paymentStatus: editingMember.paymentStatus,
          notes: editingMember.notes,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setMembersList((prev: any[]) => prev.map((m) => (m.id === editingMember.id ? data.member : m)));
        setEditingMember(null);
      } else {
        alert(data.error || "Güncellenemedi");
      }
    } catch (e) {
      alert("Hata oluştu");
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-[#e8e4dc]/50 bg-[#07090e]">
        Yönetim paneli yükleniyor...
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-[#07090e]">
        <div className="w-full max-w-md rounded-[2.5rem] border border-white/[0.08] bg-[#0c0c0e] p-8 sm:p-10 shadow-2xl space-y-8">
          <div className="text-center space-y-3">
            <Image
              src="/logo.png"
              alt="Aslı Çelik Pilates Studio"
              width={220}
              height={70}
              className="mx-auto h-14 w-auto object-contain"
            />
            <h2 className="font-serif text-2xl font-light text-[#f5f3f0]">Stüdyo Yönetim Girişi</h2>
            <p className="text-xs text-[#e8e4dc]/50">
              Devam etmek için giriş türünüzü seçin.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/40 p-1">
            <button
              type="button"
              onClick={() => {
                setLoginRole("admin");
                setLoginError("");
              }}
              className={`rounded-xl py-2.5 text-xs font-semibold uppercase tracking-wider transition ${
                loginRole === "admin"
                  ? "bg-[#c9a66b] text-black shadow-md"
                  : "text-[#e8e4dc]/60 hover:text-white"
              }`}
            >
              Yönetici Girişi
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginRole("instructor");
                setLoginError("");
                if (!selectedInstructorLoginId && instructorsList.length > 0) {
                  setSelectedInstructorLoginId(instructorsList[0].id);
                }
              }}
              className={`rounded-xl py-2.5 text-xs font-semibold uppercase tracking-wider transition ${
                loginRole === "instructor"
                  ? "bg-[#c9a66b] text-black shadow-md"
                  : "text-[#e8e4dc]/60 hover:text-white"
              }`}
            >
              Eğitmen Girişi
            </button>
          </div>

          {loginError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-xs font-medium text-red-400">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {loginRole === "admin" ? (
              <>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#bfa38e]">
                    Yönetici Kullanıcı Adı
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
              </>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#bfa38e]">
                    Eğitmen Hesabınızı Seçin
                  </label>
                  <select
                    value={selectedInstructorLoginId || ""}
                    onChange={(e) => setSelectedInstructorLoginId(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/[0.1] bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-[#c9a66b]"
                  >
                    {instructorsList.map((inst: any) => (
                      <option key={inst.id} value={inst.id} className="bg-[#0a0f14]">
                        {inst.fullName} — {inst.role}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] leading-relaxed text-[#e8e4dc]/50 bg-white/5 p-3 rounded-xl border border-white/5">
                  🔒 Eğitmen girişinde sadece size atanan üyeleri görebilir, ders düşümü ve üye takibi yapabilirsiniz.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full rounded-full border border-[#c9a66b]/40 bg-[#c9a66b] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#d4af37] disabled:opacity-50"
            >
              {loginRole === "admin"
                ? isLoggingIn
                  ? "Giriş Yapılıyor..."
                  : "Yönetici Paneline Giriş"
                : "Eğitmen Paneline Giriş Yap"}
            </button>
          </form>

          {loginRole === "admin" && (
            <div className="text-center pt-2">
              <p className="text-[11px] text-[#e8e4dc]/40">
                Varsayılan Giriş: kullanıcı adı <code className="text-[#c9a66b]">admin</code> / şifre <code className="text-[#c9a66b]">admin</code>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD - FULL LAYOUT WITH LEFT SIDEBAR
  const currentInstructorObj = instructorsList.find((i: any) => i.id === currentInstructorId);

  const allTabs = [
    { id: "members", label: userRole === "admin" ? "Üye Yönetimi" : "Üyelerim", shortLabel: "Üyeler", icon: Users, count: membersList.length },
    { id: "inquiries", label: "Başvurular", shortLabel: "Başvuru", icon: ClipboardList, count: inquiriesList.length },
    { id: "sessions", label: "Seanslar", shortLabel: "Seans", icon: CalendarDays, count: sessionsList.length },
    { id: "packages", label: "Paketler", shortLabel: "Paket", icon: Diamond, count: packagesList.length },
    { id: "instructors", label: "Eğitmenler", shortLabel: "Eğitmen", icon: Dumbbell, count: instructorsList.length },
    { id: "gallery", label: "Albüm", shortLabel: "Albüm", icon: ImageIcon, count: galleryList.length },
    { id: "security", label: "Ayarlar", shortLabel: "Ayar", icon: Settings, count: null },
  ];

  const tabs = userRole === "instructor"
    ? allTabs.filter(t => t.id === "members" || t.id === "sessions")
    : allTabs;

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

  const visibleMembers = userRole === "admin"
    ? membersList
    : membersList.filter((m: any) => Number(m.instructorId) === Number(currentInstructorId));

  const pendingMembersList = membersList.filter((m: any) => m.status === "pending" || !m.instructorId);

  const totalCollectedTL = membersList.reduce((acc: number, m: any) => acc + Number(m.paidAmount || 0), 0);
  const totalReceivableTL = membersList.reduce(
    (acc: number, m: any) => acc + Math.max(0, Number(m.totalPrice || 0) - Number(m.paidAmount || 0)),
    0
  );

  const filteredMembers = visibleMembers.filter((m: any) => {
    const query = memberSearchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (m.fullName && m.fullName.toLowerCase().includes(query)) ||
      (m.phone && m.phone.toLowerCase().includes(query)) ||
      (m.packageName && m.packageName.toLowerCase().includes(query));

    const matchesStatus =
      memberStatusFilter === "all"
        ? true
        : memberStatusFilter === "pending"
        ? m.status === "pending" || !m.instructorId
        : m.status === "active" && m.instructorId;

    const matchesInstructor =
      memberInstructorFilter === "all"
        ? true
        : Number(m.instructorId) === Number(memberInstructorFilter);

    return matchesSearch && matchesStatus && matchesInstructor;
  });

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f5f3f0] lg:flex">

      {/* ===== MOBILE BACKDROP OVERLAY ===== */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden transition-opacity"
        />
      )}

      {/* ===== LEFT SIDEBAR (FIXED ON DESKTOP, SLIDE-OVER ON MOBILE) ===== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-white/10 bg-[#0a0d14] p-5 shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:w-72 lg:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Logo Header */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Aslı Çelik Pilates Studio"
                width={160}
                height={55}
                className="h-11 w-auto object-contain"
              />
            </Link>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 hover:text-white lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${userRole === "admin" ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#bfa38e]">
                {userRole === "admin" ? "Yönetici Modu" : "Eğitmen Modu"}
              </span>
            </div>
            <p className="text-xs font-semibold text-white truncate">
              {userRole === "admin" ? "👑 Yönetici Paneli" : `🏋️ ${currentInstructorObj?.fullName || "Eğitmen"}`}
            </p>
          </div>

          {/* Sidebar Menu Links */}
          <nav className="space-y-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const badgeCount = tab.id === "members" ? filteredMembers.length : tab.count;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-medium tracking-wide transition-all ${
                    isActive
                      ? "bg-[#c9a66b] text-black font-semibold shadow-lg shadow-[#c9a66b]/20"
                      : "text-[#e8e4dc]/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? "text-black" : "text-[#c9a66b]"}`} />
                    <span>{tab.label}</span>
                  </div>
                  {badgeCount !== null && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] ${
                      isActive ? "bg-black/20 text-black font-bold" : "bg-white/10 text-[#c9a66b]"
                    }`}>
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Logout */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-400 transition hover:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT CANVAS ===== */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">

        {/* ===== TOP BAR (MOBILE MENU TOGGLE & PAGE TITLE) ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-white hover:border-[#c9a66b] lg:hidden"
              title="Menüyü Aç"
            >
              <Menu className="h-6 w-6 text-[#c9a66b]" />
            </button>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl text-white font-light">{currentTab?.label}</h1>
              <p className="text-xs text-[#e8e4dc]/50">
                Aslı Çelik Pilates Studio — {userRole === "admin" ? "Yönetim Paneli" : `Eğitmen: ${currentInstructorObj?.fullName}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/80 hover:text-white transition"
            >
              🌐 Web Sitesini Gör
            </Link>
          </div>
        </div>

        {/* TAB 1: MEMBERS */}
        {activeTab === "members" && (
          <div className="space-y-8">
            {/* Financial Summary (Admin only) */}
            {userRole === "admin" && (
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
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#bfa38e]">Onay Bekleyen Kayıt</p>
                  <p className="font-serif text-3xl font-light text-amber-400">{pendingMembersList.length} Başvuru</p>
                  <p className="text-[11px] text-[#e8e4dc]/40">Hoca ataması bekleyen üyeler</p>
                </div>
              </div>
            )}

            {/* Pending Approvals */}
            {userRole === "admin" && pendingMembersList.length > 0 && (
              <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-black to-black p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-3 w-3 rounded-full bg-amber-400 animate-ping" />
                  <h3 className="font-serif text-xl font-light text-amber-300">
                    ⚡ Onay Bekleyen Üye Kayıtları ({pendingMembersList.length})
                  </h3>
                </div>
                <p className="text-xs text-[#e8e4dc]/70">
                  Aşağıdaki üyeler online başvuru yapmıştır. İlgili eğitmene atayıp üye kaydını onaylayabilirsiniz.
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  {pendingMembersList.map((m: any) => (
                    <div key={m.id} className="rounded-2xl border border-white/10 bg-[#0a0f14] p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-white text-base">{m.fullName}</p>
                          <p className="text-xs text-[#c9a66b]">{m.phone} — {m.email || "E-posta yok"}</p>
                          <p className="text-xs text-white/80 mt-1 font-semibold">Paket: {m.packageName}</p>
                        </div>
                        <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 text-[10px] uppercase font-bold">
                          Onay Bekliyor
                        </span>
                      </div>

                      {m.notes && (
                        <p className="text-xs italic text-[#e8e4dc]/60 bg-white/5 p-2.5 rounded-xl border border-white/5">
                          "{m.notes}"
                        </p>
                      )}

                      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <select
                          id={`assign-select-${m.id}`}
                          defaultValue=""
                          className="rounded-xl border border-white/20 bg-black px-3 py-2 text-xs text-white outline-none focus:border-[#c9a66b]"
                        >
                          <option value="" disabled>Eğitmen Seçiniz...</option>
                          {instructorsList.map((inst: any) => (
                            <option key={inst.id} value={inst.id}>
                              {inst.fullName} ({inst.role})
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const selectEl = document.getElementById(`assign-select-${m.id}`) as HTMLSelectElement;
                            const val = selectEl?.value;
                            if (!val) {
                              alert("Lütfen atanacak eğitmene karar verin.");
                              return;
                            }
                            handleAssignInstructor(m.id, Number(val), "active");
                          }}
                          className="rounded-xl bg-[#c9a66b] px-4 py-2 text-xs font-semibold text-black hover:bg-[#d4af37]"
                        >
                          Onayla ve Atamayı Yap
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Header Action Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-light text-[#f5f3f0]">
                  {userRole === "admin" ? "Tüm Üyeler & Eğitmen Atamaları" : `Üyelerim (${currentInstructorObj?.fullName})`}
                </h2>
                <p className="text-xs text-[#e8e4dc]/50">
                  {userRole === "admin"
                    ? "Üyelerin atandığı eğitmenleri görün, seans düşümü yapın veya ödeme takip edin."
                    : "Size atanan pilates üyelerinizin ders durumunu takip edin ve seans düşümü yapın."}
                </p>
              </div>
              {userRole === "admin" && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleSendReminders}
                    disabled={isSendingReminders}
                    className="rounded-full border border-[#c9a66b]/40 bg-[#c9a66b]/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#c9a66b] transition hover:bg-[#c9a66b]/20 disabled:opacity-50"
                  >
                    {isSendingReminders ? "Gönderiliyor..." : "📨 Seans Hatırlatma Maillerini Gönder"}
                  </button>
                  <button
                    onClick={() => setIsAddingMember(true)}
                    className="rounded-full bg-[#c9a66b] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-black transition hover:bg-[#d4af37]"
                  >
                    + Manuel Üye Ekle
                  </button>
                </div>
              )}
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
                  <select
                    value={newMember.instructorId}
                    onChange={(e) => setNewMember({ ...newMember, instructorId: e.target.value })}
                    className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                  >
                    <option value="">Eğitmen Atayın (İsteğe Bağlı)</option>
                    {instructorsList.map((inst: any) => (
                      <option key={inst.id} value={inst.id}>{inst.fullName} ({inst.role})</option>
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
            {userRole === "admin" && editingPaymentMember && (
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

            {/* Edit Member Modal */}
            {editingMember && (
              <form onSubmit={handleUpdateMember} className="rounded-2xl border border-[#c9a66b]/40 bg-[#121216] p-6 space-y-4">
                <h3 className="font-serif text-xl text-[#c9a66b]">Üye Düzenle — {editingMember.fullName}</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <input type="text" placeholder="Ad Soyad" required value={editingMember.fullName} onChange={(e) => setEditingMember({ ...editingMember, fullName: e.target.value })} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />
                  <input type="tel" placeholder="Telefon" value={editingMember.phone || ""} onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />
                  <input type="email" placeholder="E-posta" value={editingMember.email || ""} onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />
                  <input type="text" placeholder="Paket Adı" value={editingMember.packageName || ""} onChange={(e) => setEditingMember({ ...editingMember, packageName: e.target.value })} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />
                  <input type="number" placeholder="Toplam Seans" min={1} value={editingMember.totalSessions} onChange={(e) => setEditingMember({ ...editingMember, totalSessions: Number(e.target.value) })} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />
                  <input type="number" placeholder="Kalan Seans" min={0} value={editingMember.remainingSessions} onChange={(e) => setEditingMember({ ...editingMember, remainingSessions: Number(e.target.value) })} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />

                  {userRole === "admin" && (
                    <>
                      <input type="number" placeholder="Toplam Fiyat (TL)" value={editingMember.totalPrice} onChange={(e) => setEditingMember({ ...editingMember, totalPrice: e.target.value })} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />
                      <input type="number" placeholder="Ödenen Tutar (TL)" value={editingMember.paidAmount} onChange={(e) => setEditingMember({ ...editingMember, paidAmount: e.target.value })} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />
                      <select value={editingMember.instructorId || ""} onChange={(e) => setEditingMember({ ...editingMember, instructorId: e.target.value ? Number(e.target.value) : null })} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]">
                        <option value="">Eğitmen Seçiniz</option>
                        {instructorsList.map((inst: any) => (
                          <option key={inst.id} value={inst.id}>{inst.fullName}</option>
                        ))}
                      </select>
                    </>
                  )}

                  <textarea placeholder="Sağlık Notları & Seans Takibi" value={editingMember.notes || ""} onChange={(e) => setEditingMember({ ...editingMember, notes: e.target.value })} rows={2} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b] sm:col-span-2" />
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button type="button" onClick={() => setEditingMember(null)} className="rounded-full border border-white/20 px-5 py-2 text-xs text-white/70 hover:text-white">Vazgeç</button>
                  <button type="submit" className="rounded-full bg-[#c9a66b] px-6 py-2 text-xs font-semibold text-black hover:bg-[#d4af37]">Güncelle</button>
                </div>
              </form>
            )}

            {/* Search & Filter Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#0c0c0e] p-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Üye adı, telefon veya paket ara..."
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/50 pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 outline-none focus:border-[#c9a66b]"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs">
                  <Filter className="h-3.5 w-3.5 text-[#c9a66b]" />
                  <select
                    value={memberStatusFilter}
                    onChange={(e) => setMemberStatusFilter(e.target.value)}
                    className="bg-transparent text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="all" className="bg-[#0a0f14]">Tüm Durumlar</option>
                    <option value="active" className="bg-[#0a0f14]">Aktif & Atanmış</option>
                    <option value="pending" className="bg-[#0a0f14]">Atama Bekleyenler</option>
                  </select>
                </div>

                {userRole === "admin" && (
                  <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs">
                    <span className="text-[#c9a66b] font-medium">Eğitmen:</span>
                    <select
                      value={memberInstructorFilter}
                      onChange={(e) => setMemberInstructorFilter(e.target.value)}
                      className="bg-transparent text-xs text-white outline-none cursor-pointer"
                    >
                      <option value="all" className="bg-[#0a0f14]">Tüm Eğitmenler</option>
                      {instructorsList.map((inst: any) => (
                        <option key={inst.id} value={inst.id} className="bg-[#0a0f14]">
                          {inst.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Members List - Responsive Cards */}
            <div className="space-y-4">
              {filteredMembers.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-[#0c0c0e] p-8 text-center text-xs text-[#e8e4dc]/50 space-y-2">
                  <p className="text-base text-white/70">Üye Bulunamadı</p>
                  <p>
                    {memberSearchQuery
                      ? `"${memberSearchQuery}" aramasına uygun üye bulunamadı.`
                      : userRole === "instructor"
                      ? "Size henüz atanan aktif üye bulunmamaktadır."
                      : "Kayıtlı üye bulunmamaktadır."}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredMembers.map((m: any) => {
                    const paid = Number(m.paidAmount || 0);
                    const total = Number(m.totalPrice || 0);
                    const remainingTL = Math.max(0, total - paid);
                    const assignedInst = instructorsList.find((inst: any) => inst.id === m.instructorId);
                    const sessionPercent = Math.min(
                      100,
                      Math.round((m.remainingSessions / (m.totalSessions || 1)) * 100)
                    );

                    return (
                      <div
                        key={m.id}
                        className="group relative rounded-2xl border border-white/[0.08] bg-[#0c0c0e] p-5 transition-all duration-200 hover:border-[#c9a66b]/40 hover:bg-white/[0.02]"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          {/* Profile info */}
                          <div className="flex-1 space-y-2 min-w-[220px]">
                            <div className="flex items-center justify-between lg:justify-start gap-3">
                              <h3 className="font-serif text-lg font-normal text-white group-hover:text-[#c9a66b] transition">
                                {m.fullName}
                              </h3>
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                                  m.status === "active" && m.instructorId
                                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                    : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                                }`}
                              >
                                {m.status === "active" && m.instructorId ? "Aktif Üye" : "Atama Bekliyor"}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#e8e4dc]/60">
                              <span className="flex items-center gap-1">📞 {m.phone}</span>
                              {m.email && <span className="flex items-center gap-1">✉️ {m.email}</span>}
                              <span className="inline-block rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-medium text-[#c9a66b]">
                                {m.packageName}
                              </span>
                            </div>
                          </div>

                          {/* Sessions */}
                          <div className="flex-1 rounded-xl border border-white/5 bg-white/[0.02] p-3.5 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#e8e4dc]/50 font-medium">Kalan Seans Hakkı</span>
                              <span
                                className={`font-semibold text-sm ${
                                  m.remainingSessions > 2
                                    ? "text-emerald-400"
                                    : m.remainingSessions > 0
                                    ? "text-amber-400"
                                    : "text-red-400"
                                }`}
                              >
                                {m.remainingSessions} / {m.totalSessions} Seans
                              </span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  sessionPercent > 30 ? "bg-emerald-400" : sessionPercent > 0 ? "bg-amber-400" : "bg-red-500"
                                }`}
                                style={{ width: `${sessionPercent}%` }}
                              />
                            </div>
                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => handleUseSession(m.id)}
                                disabled={m.remainingSessions <= 0}
                                className="flex-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-30 transition"
                              >
                                -1 Seans Kullan
                              </button>
                              <button
                                onClick={() => handleAddSession(m.id)}
                                className="flex-1 rounded-lg border border-blue-500/30 bg-blue-500/10 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-500/20 transition"
                              >
                                +1 Seans Ekle
                              </button>
                            </div>
                          </div>

                          {/* Payment & Instructor */}
                          {userRole === "admin" && (
                            <div className="flex-1 rounded-xl border border-white/5 bg-white/[0.02] p-3.5 space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-[#e8e4dc]/50 font-medium">Ödeme & Eğitmen</span>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                                    m.paymentStatus === "paid"
                                      ? "bg-emerald-500/20 text-emerald-300"
                                      : m.paymentStatus === "partial"
                                      ? "bg-amber-500/20 text-amber-300"
                                      : "bg-red-500/20 text-red-400"
                                  }`}
                                >
                                  {m.paymentStatus === "paid"
                                    ? "Tam Ödendi"
                                    : m.paymentStatus === "partial"
                                    ? `Kalan ${remainingTL.toLocaleString("tr-TR")} TL`
                                    : "Ödeme Bekliyor"}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-xs">
                                <span className="text-[#e8e4dc]/70">
                                  {paid.toLocaleString("tr-TR")} TL / {total.toLocaleString("tr-TR")} TL
                                </span>
                                <button
                                  onClick={() => {
                                    setEditingPaymentMember(m);
                                    setNewPaidInput(String(m.paidAmount));
                                  }}
                                  className="text-[11px] font-medium text-[#c9a66b] hover:underline"
                                >
                                  Tahsilat Güncelle ↗
                                </button>
                              </div>

                              <div className="pt-1">
                                <select
                                  value={m.instructorId || ""}
                                  onChange={(e) => {
                                    const instVal = e.target.value ? Number(e.target.value) : null;
                                    handleAssignInstructor(m.id, instVal, m.status || "active");
                                  }}
                                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-[#c9a66b] outline-none focus:border-[#c9a66b]"
                                >
                                  <option value="">Eğitmen Atanmadı</option>
                                  {instructorsList.map((inst: any) => (
                                    <option key={inst.id} value={inst.id}>
                                      👤 {inst.fullName}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center justify-end gap-2 shrink-0 pt-2 lg:pt-0">
                            <button
                              onClick={() => setEditingMember({ ...m })}
                              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white hover:border-[#c9a66b] hover:text-[#c9a66b] transition"
                            >
                              ✏️ Düzenle
                            </button>
                            {userRole === "admin" && (
                              <button
                                onClick={() => handleDeleteMember(m.id)}
                                className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition"
                              >
                                🗑️ Sil
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Notes Footer */}
                        {m.notes && (
                          <div className="mt-3 border-t border-white/5 pt-2.5 text-xs">
                            <p className="text-[#e8e4dc]/70">
                              <strong className="text-[#c9a66b]">Not:</strong> {m.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: INQUIRIES */}
        {activeTab === "inquiries" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-light text-[#f5f3f0]">Web Sitesi İletişim Başvuruları</h2>
                <p className="text-xs text-[#e8e4dc]/50">Ziyaretçilerden gelen ücretsiz ön görüşme ve paket bilgi talepleri.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {inquiriesList.map((item: any) => (
                <div key={item.id} className="rounded-2xl border border-white/[0.08] bg-[#0c0c0e] p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-lg text-white">{item.fullName}</h3>
                      <p className="text-xs text-[#c9a66b]">{item.phone} • {item.email}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold ${
                        item.status === "new"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : item.status === "contacted"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {item.status === "new" ? "Yeni" : item.status === "contacted" ? "Ulaşıldı" : "Üye Yapıldı"}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#e8e4dc]/80 border-t border-b border-white/5 py-3">
                    <p><strong className="text-[#bfa38e]">Hedef:</strong> {item.goal}</p>
                    {item.preferredPackage && <p><strong className="text-[#bfa38e]">İlgilendiği Paket:</strong> {item.preferredPackage}</p>}
                    <p><strong className="text-[#bfa38e]">Mesaj:</strong> "{item.message}"</p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className="rounded-xl border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-white outline-none focus:border-[#c9a66b]"
                    >
                      <option value="new">Yeni</option>
                      <option value="contacted">Ulaşıldı / Görüşüldü</option>
                      <option value="converted">Kayıt Alındı / Üye Yapıldı</option>
                    </select>
                    {item.wantsWhatsapp && (
                      <a
                        href={`https://wa.me/${item.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-400 font-medium hover:bg-emerald-500/30 transition"
                      >
                        WhatsApp ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SESSIONS */}
        {activeTab === "sessions" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-light text-[#f5f3f0]">Haftalık Seans Takvimi</h2>
                <p className="text-xs text-[#e8e4dc]/50">Stüdyo seans programını ve eğitmen atamalarını düzenleyin.</p>
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
                <h3 className="font-serif text-xl text-[#c9a66b]">Yeni Seans Ekle</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <input
                    type="text"
                    placeholder="Seans Adı (Örn: Sabah Reformer Akışı)"
                    required
                    value={newSession.title}
                    onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                    className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                  />
                  <select
                    value={newSession.dayLabel}
                    onChange={(e) => {
                      const daysMap: Record<string, number> = {
                        Pazartesi: 1, Salı: 2, Çarşamba: 3, Perşembe: 4, Cuma: 5, Cumartesi: 6, Pazar: 7,
                      };
                      setNewSession({
                        ...newSession,
                        dayLabel: e.target.value,
                        weekday: daysMap[e.target.value] || 1,
                      });
                    }}
                    className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                  >
                    {["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Başlangıç (09:00)"
                      value={newSession.startTime}
                      onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                      className="w-1/2 rounded-xl border border-white/10 bg-black/60 px-3 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                    />
                    <input
                      type="text"
                      placeholder="Bitiş (09:50)"
                      value={newSession.endTime}
                      onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
                      className="w-1/2 rounded-xl border border-white/10 bg-black/60 px-3 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                    />
                  </div>
                  {userRole === "admin" && (
                    <select
                      value={newSession.instructorId}
                      onChange={(e) => setNewSession({ ...newSession, instructorId: Number(e.target.value) })}
                      className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                    >
                      {instructorsList.map((inst: any) => (
                        <option key={inst.id} value={inst.id}>{inst.fullName} ({inst.role})</option>
                      ))}
                    </select>
                  )}
                  <input
                    type="number"
                    placeholder="Kontenjan"
                    min={1}
                    value={newSession.capacity}
                    onChange={(e) => setNewSession({ ...newSession, capacity: Number(e.target.value) })}
                    className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                  />
                  <input
                    type="text"
                    placeholder="Konum (Bağlıca Stüdyo)"
                    value={newSession.location}
                    onChange={(e) => setNewSession({ ...newSession, location: e.target.value })}
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

            {/* Edit Session Modal */}
            {editingSession && (
              <form onSubmit={handleUpdateSession} className="rounded-2xl border border-[#c9a66b]/40 bg-[#121216] p-6 space-y-4">
                <h3 className="font-serif text-xl text-[#c9a66b]">Seans Düzenle — {editingSession.title}</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <input type="text" placeholder="Seans Adı" required value={editingSession.title} onChange={(e) => setEditingSession({ ...editingSession, title: e.target.value })} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />
                  <input type="text" placeholder="Gün (Pazartesi)" value={editingSession.dayLabel} onChange={(e) => setEditingSession({ ...editingSession, dayLabel: e.target.value })} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />
                  <div className="flex gap-2">
                    <input type="text" placeholder="Saat Başı (09:00)" value={editingSession.startTime} onChange={(e) => setEditingSession({ ...editingSession, startTime: e.target.value })} className="w-1/2 rounded-xl border border-white/10 bg-black/60 px-3 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />
                    <input type="text" placeholder="Saat Sonu (09:50)" value={editingSession.endTime} onChange={(e) => setEditingSession({ ...editingSession, endTime: e.target.value })} className="w-1/2 rounded-xl border border-white/10 bg-black/60 px-3 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />
                  </div>
                  <input type="number" placeholder="Kontenjan" min={1} value={editingSession.capacity} onChange={(e) => setEditingSession({ ...editingSession, capacity: Number(e.target.value) })} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />
                  <input type="text" placeholder="Konum" value={editingSession.location} onChange={(e) => setEditingSession({ ...editingSession, location: e.target.value })} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button type="button" onClick={() => setEditingSession(null)} className="rounded-full border border-white/20 px-5 py-2 text-xs text-white/70 hover:text-white">Vazgeç</button>
                  <button type="submit" className="rounded-full bg-[#c9a66b] px-6 py-2 text-xs font-semibold text-black hover:bg-[#d4af37]">Güncelle</button>
                </div>
              </form>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sessionsList.map((item: any) => {
                const coach = instructorsList.find((i: any) => i.id === item.instructorId);
                return (
                  <div key={item.id} className="relative rounded-2xl border border-white/[0.08] bg-[#0c0c0e] p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-[#c9a66b]">{item.dayLabel} • {item.startTime} - {item.endTime}</span>
                      <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] text-white/60">{item.location}</span>
                    </div>
                    <h3 className="font-serif text-xl text-white">{item.title}</h3>
                    <p className="text-xs text-[#e8e4dc]/60">Eğitmen: <strong className="text-[#c9a66b]">{coach ? coach.fullName : "Atanmadı"}</strong></p>
                    <p className="text-xs text-[#e8e4dc]/40">Kontenjan: {item.capacity} Kişilik</p>
                    <div className="pt-2 flex justify-end gap-3">
                      <button onClick={() => setEditingSession({ ...item })} className="text-xs text-[#c9a66b] hover:text-[#d4af37] font-medium">✏ Düzenle</button>
                      <button onClick={() => handleDeleteSession(item.id)} className="text-xs text-red-400 hover:text-red-300">Sil</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: PACKAGES */}
        {activeTab === "packages" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-light text-[#f5f3f0]">Üyelik Paketleri</h2>
                <p className="text-xs text-[#e8e4dc]/50">Stüdyo paket seçeneklerini ve fiyatlarını güncelleyin.</p>
              </div>
              <button
                onClick={() => setIsAddingPackage(true)}
                className="self-start sm:self-auto rounded-full bg-[#c9a66b] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black transition hover:bg-[#d4af37]"
              >
                + Paket Ekle
              </button>
            </div>

            {/* Modal / Form for Package */}
            {isAddingPackage && (
              <form onSubmit={handleCreatePackage} className="rounded-2xl border border-[#c9a66b]/30 bg-[#121216] p-6 space-y-4">
                <h3 className="font-serif text-xl text-[#c9a66b]">Yeni Paket Ekle</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <input
                    type="text"
                    placeholder="Paket Adı (Örn: Bireysel 8 Seans)"
                    required
                    value={newPackage.name}
                    onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                    className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                  />
                  <input
                    type="text"
                    placeholder="Odak / Etiket (Örn: Bireysel Özel Ders)"
                    value={newPackage.focus}
                    onChange={(e) => setNewPackage({ ...newPackage, focus: e.target.value })}
                    className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                  />
                  <input
                    type="number"
                    placeholder="Fiyat (TL)"
                    required
                    value={newPackage.price}
                    onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                    className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                  />
                  <input
                    type="number"
                    placeholder="Seans Sayısı"
                    required
                    value={newPackage.sessionsCount}
                    onChange={(e) => setNewPackage({ ...newPackage, sessionsCount: Number(e.target.value) })}
                    className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                  />
                  <input
                    type="number"
                    placeholder="Geçerlilik Süresi (Gün)"
                    required
                    value={newPackage.durationDays}
                    onChange={(e) => setNewPackage({ ...newPackage, durationDays: Number(e.target.value) })}
                    className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                  />
                  <input
                    type="text"
                    placeholder="Açıklama"
                    value={newPackage.description}
                    onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
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

            {/* Edit Package Modal */}
            {editingPackage && (
              <form onSubmit={handleUpdatePackage} className="rounded-2xl border border-[#c9a66b]/40 bg-[#121216] p-6 space-y-4">
                <h3 className="font-serif text-xl text-[#c9a66b]">Paket Düzenle — {editingPackage.name}</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <input type="text" placeholder="Paket Adı" required value={editingPackage.name} onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />
                  <input type="text" placeholder="Odak / Etiket" value={editingPackage.focus || ""} onChange={(e) => setEditingPackage({ ...editingPackage, focus: e.target.value })} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />
                  <input type="number" placeholder="Fiyat (TL)" value={editingPackage.price} onChange={(e) => setEditingPackage({ ...editingPackage, price: e.target.value })} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />
                  <input type="number" placeholder="Seans Sayısı" min={1} value={editingPackage.sessionsCount} onChange={(e) => setEditingPackage({ ...editingPackage, sessionsCount: Number(e.target.value) })} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />
                  <input type="number" placeholder="Geçerlilik (gün)" min={1} value={editingPackage.durationDays} onChange={(e) => setEditingPackage({ ...editingPackage, durationDays: Number(e.target.value) })} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button type="button" onClick={() => setEditingPackage(null)} className="rounded-full border border-white/20 px-5 py-2 text-xs text-white/70 hover:text-white">Vazgeç</button>
                  <button type="submit" className="rounded-full bg-[#c9a66b] px-6 py-2 text-xs font-semibold text-black hover:bg-[#d4af37]">Güncelle</button>
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
                  <div className="pt-2 flex justify-end gap-3">
                    <button onClick={() => setEditingPackage({ ...item })} className="text-xs text-[#c9a66b] hover:text-[#d4af37] font-medium">✏ Düzenle</button>
                    <button onClick={() => handleDeletePackage(item.id)} className="text-xs text-red-400 hover:text-red-300">Sil</button>
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

            {/* Edit Instructor Modal */}
            {editingInstructor && (
              <form onSubmit={handleUpdateInstructor} className="rounded-2xl border border-[#c9a66b]/40 bg-[#121216] p-6 space-y-4">
                <h3 className="font-serif text-xl text-[#c9a66b]">Eğitmen Düzenle — {editingInstructor.fullName}</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <input type="text" placeholder="Ad Soyad" required value={editingInstructor.fullName} onChange={(e) => setEditingInstructor({ ...editingInstructor, fullName: e.target.value })} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />
                  <input type="text" placeholder="Unvan" value={editingInstructor.role || ""} onChange={(e) => setEditingInstructor({ ...editingInstructor, role: e.target.value })} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />
                  <input type="number" placeholder="Deneyim (Yıl)" min={1} value={editingInstructor.experienceYears || 1} onChange={(e) => setEditingInstructor({ ...editingInstructor, experienceYears: Number(e.target.value) })} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />
                  <input type="tel" placeholder="Telefon" value={editingInstructor.phone || ""} onChange={(e) => setEditingInstructor({ ...editingInstructor, phone: e.target.value })} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />
                  <input type="email" placeholder="E-posta" value={editingInstructor.email || ""} onChange={(e) => setEditingInstructor({ ...editingInstructor, email: e.target.value })} className="rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]" />
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button type="button" onClick={() => setEditingInstructor(null)} className="rounded-full border border-white/20 px-5 py-2 text-xs text-white/70 hover:text-white">Vazgeç</button>
                  <button type="submit" className="rounded-full bg-[#c9a66b] px-6 py-2 text-xs font-semibold text-black hover:bg-[#d4af37]">Güncelle</button>
                </div>
              </form>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {instructorsList.map((item: any) => (
                <div key={item.id} className="relative rounded-2xl border border-white/[0.08] bg-[#0c0c0e] p-6 space-y-3">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#c9a66b]">{item.role}</span>
                  <h3 className="font-serif text-xl text-white">{item.fullName}</h3>
                  <p className="text-xs leading-relaxed text-[#e8e4dc]/70">{item.bio}</p>
                  <p className="text-xs text-[#e8e4dc]/50">{item.phone} • {item.email}</p>
                  <div className="pt-2 flex justify-end gap-3">
                    <button onClick={() => setEditingInstructor({ ...item })} className="text-xs text-[#c9a66b] hover:text-[#d4af37] font-medium">✏ Düzenle</button>
                    <button onClick={() => handleDeleteInstructor(item.id)} className="text-xs text-red-400 hover:text-red-300">Sil</button>
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

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryList.map((item: any) => (
                <div key={item.id} className="group relative rounded-2xl border border-white/[0.08] bg-[#0c0c0e] overflow-hidden p-4 space-y-3">
                  <div className="relative h-44 w-full rounded-xl overflow-hidden bg-black">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-base text-white truncate">{item.title}</h3>
                    <button onClick={() => handleDeleteGallery(item.id)} className="text-xs text-red-400 hover:text-red-300">Sil</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: SECURITY & SETTINGS */}
        {activeTab === "security" && (
          <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-[#0c0c0e] p-8 space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-light text-white">Yönetici Giriş Bilgileri</h2>
              <p className="text-xs text-[#e8e4dc]/50 mt-1">Yönetim paneline giriş yapmak için kullandığınız kullanıcı adı ve şifrenizi güncelleyin.</p>
            </div>

            {credMessage && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300">
                {credMessage}
              </div>
            )}
            {credError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-400">
                {credError}
              </div>
            )}

            <form onSubmit={handleUpdateCredentials} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#bfa38e]">
                  Mevcut Şifreniz
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-sm text-white outline-none focus:border-[#c9a66b]"
                  placeholder="Mevcut şifrenizi girin"
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
      </main>
    </div>
  );
}
