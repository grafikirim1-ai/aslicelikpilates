"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type ContactFormProps = {
  packageOptions: Array<{ id: number; name: string }>;
};

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  goal: string;
  preferredPackage: string;
  message: string;
  wantsWhatsapp: boolean;
};

const initialState: FormState = {
  fullName: "",
  phone: "",
  email: "",
  goal: "",
  preferredPackage: "",
  message: "",
  wantsWhatsapp: true,
};

export function ContactForm({ packageOptions }: ContactFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = (await response.json()) as { ok: boolean; message?: string; error?: string };

      if (!response.ok || !result.ok) {
        setFeedback({ type: "error", message: result.error ?? "Gönderim sırasında bir sorun oluştu." });
        return;
      }

      setFeedback({ type: "success", message: result.message ?? "Talebiniz alındı." });
      setForm(initialState);
    } catch {
      setFeedback({ type: "error", message: "Sunucuya ulaşılamadı. Lütfen tekrar deneyin." });
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[2rem] border border-white/[0.08] bg-[#0c0c0e] p-7 shadow-2xl shadow-black/50 backdrop-blur">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-[#e8e4dc]/80">
          <span>Ad Soyad</span>
          <input
            required
            value={form.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-[#e8e4dc]/30 focus:border-[#c9a66b]"
            placeholder="Örn. Derya Yılmaz"
          />
        </label>

        <label className="space-y-2 text-sm text-[#e8e4dc]/80">
          <span>Telefon</span>
          <input
            required
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-[#e8e4dc]/30 focus:border-[#c9a66b]"
            placeholder="+90 5xx xxx xx xx"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-[#e8e4dc]/80">
          <span>E-posta</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-[#e8e4dc]/30 focus:border-[#c9a66b]"
            placeholder="ornek@mail.com"
          />
        </label>

        <label className="space-y-2 text-sm text-[#e8e4dc]/80">
          <span>İlgi duyduğunuz paket</span>
          <select
            value={form.preferredPackage}
            onChange={(event) => updateField("preferredPackage", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#121215] px-4 py-3 text-white outline-none transition focus:border-[#c9a66b]"
          >
            <option value="">Size en uygun paketi önerelim</option>
            {packageOptions.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="space-y-2 text-sm text-[#e8e4dc]/80">
        <span>Hedefiniz</span>
        <input
          required
          value={form.goal}
          onChange={(event) => updateField("goal", event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-[#e8e4dc]/30 focus:border-[#c9a66b]"
          placeholder="Postür, ağrı yönetimi, güçlenme, hamile pilatesi..."
        />
      </label>

      <label className="space-y-2 text-sm text-[#e8e4dc]/80">
        <span>Mesaj</span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-[#e8e4dc]/30 focus:border-[#c9a66b]"
          placeholder="Sizin için en uygun gün ve saatleri de yazabilirsiniz."
        />
      </label>

      <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#e8e4dc]/80">
        <input
          type="checkbox"
          checked={form.wantsWhatsapp}
          onChange={(event) => updateField("wantsWhatsapp", event.target.checked)}
          className="mt-1 h-4 w-4 accent-[#c9a66b]"
        />
        <span>WhatsApp üzerinden bilgilendirme ve hızlı geri dönüş almak istiyorum.</span>
      </label>

      {feedback && (
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              : "border border-rose-500/30 bg-rose-500/10 text-rose-200"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-2xl border border-[#c9a66b]/40 bg-gradient-to-r from-[#c9a66b] via-[#d4af37] to-[#bfa38e] px-6 py-4 text-sm font-medium tracking-wide text-[#000000] shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Talebiniz kaydediliyor..." : "Ücretsiz ön görüşme talebi oluştur"}
      </button>
    </form>
  );
}
