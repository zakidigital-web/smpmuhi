"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/adminApi";
import { Save, Check } from "lucide-react";

const defaultSettings: Record<string, string> = {
  schoolName: "SMP Muhammadiyah 1 Genteng",
  shortName: "SMP Mutiara Genteng",
  tagline: "Unggul, Islami, Berkemajuan",
  address: "Jl. Temuguruh No.58, Genteng Wetan, Kec. Genteng, Kab. Banyuwangi, Jawa Timur 68465",
  phone: "(0333) 845554",
  email: "smpmuhammadiyah1genteng@gmail.com",
  instagram: "smpmuhammadiyah1genteng",
  facebook: "smpmutiaragenteng",
  youtube: "@smpmuhammadiyah1genteng",
  primaryColor: "#1B5E20",
  secondaryColor: "#F59E0B",
  accentColor: "#1565C0",
  sppmYear: "2026",
  footerDescription: "Sekolah menengah pertama unggulan di bawah naungan Muhammadiyah, berkomitmen mencetak generasi berakhlak mulia, berilmu, dan berkemajuan.",
  copyright: "All rights reserved.",
};

export default function AdminSettings() {
  const [form, setForm] = useState<Record<string, string>>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi.settings.get().then((data) => {
      if (data && Object.keys(data).length > 0) {
        setForm({ ...defaultSettings, ...data });
        applyColors(data);
      }
    });
  }, []);

  const update = (key: string, value: string) => {
    const next = { ...form, [key]: value };
    setForm(next);
    if (["primaryColor", "secondaryColor", "accentColor"].includes(key)) {
      applyColors(next);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminApi.settings.save(form);
    applyColors(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sectionStyle = {
    background: "var(--card)",
    border: "1px solid var(--card-border)",
    borderRadius: "0.75rem",
    padding: "1.5rem",
  } as React.CSSProperties;

  const labelStyle = {
    color: "var(--text-secondary)",
    marginBottom: "0.25rem",
  } as React.CSSProperties;

  const inputClass = "w-full px-3 py-2 border rounded-lg text-sm outline-none transition-all focus:ring-2";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Pengaturan Website</h1>
        <p className="mt-1" style={{ color: "var(--text-secondary)" }}>Kelola informasi dan konfigurasi website sekolah</p>
      </div>

      {/* Live Color Preview */}
      <div className="flex items-center gap-4 p-4 mb-6" style={sectionStyle}>
        <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Preview Warna:</span>
        {["primaryColor", "secondaryColor", "accentColor"].map((key) => (
          <div key={key} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg" style={{ background: form[key], border: "1px solid var(--card-border)" }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{key.replace("Color", "")}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div style={sectionStyle}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Informasi Sekolah</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium" style={labelStyle}>Nama Sekolah</label>
              <input value={form.schoolName} onChange={(e) => update("schoolName", e.target.value)}
                className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-medium" style={labelStyle}>Nama Singkat</label>
              <input value={form.shortName} onChange={(e) => update("shortName", e.target.value)}
                className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium" style={labelStyle}>Tagline</label>
              <input value={form.tagline} onChange={(e) => update("tagline", e.target.value)}
                className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium" style={labelStyle}>Alamat</label>
              <textarea value={form.address} onChange={(e) => update("address", e.target.value)}
                className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} rows={2} />
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Kontak</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium" style={labelStyle}>No. Telepon</label>
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)}
                className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-medium" style={labelStyle}>Email</label>
              <input value={form.email} onChange={(e) => update("email", e.target.value)}
                className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Media Sosial</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium" style={labelStyle}>Instagram</label>
              <input value={form.instagram} onChange={(e) => update("instagram", e.target.value)}
                className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-medium" style={labelStyle}>Facebook</label>
              <input value={form.facebook} onChange={(e) => update("facebook", e.target.value)}
                className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-medium" style={labelStyle}>YouTube</label>
              <input value={form.youtube} onChange={(e) => update("youtube", e.target.value)}
                className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Footer</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium" style={labelStyle}>Deskripsi Footer</label>
              <textarea value={form.footerDescription} onChange={(e) => update("footerDescription", e.target.value)}
                className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium" style={labelStyle}>Teks Hak Cipta</label>
              <input value={form.copyright} onChange={(e) => update("copyright", e.target.value)}
                className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Tema</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={labelStyle}>Warna Utama (Primary)</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.primaryColor} onChange={(e) => update("primaryColor", e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer p-0.5" style={{ border: "1px solid var(--card-border)" }} />
                <input value={form.primaryColor} onChange={(e) => update("primaryColor", e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm font-mono outline-none"
                  style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={labelStyle}>Warna Sekunder (Secondary)</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.secondaryColor} onChange={(e) => update("secondaryColor", e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer p-0.5" style={{ border: "1px solid var(--card-border)" }} />
                <input value={form.secondaryColor} onChange={(e) => update("secondaryColor", e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm font-mono outline-none"
                  style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={labelStyle}>Warna Aksen (Accent)</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.accentColor} onChange={(e) => update("accentColor", e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer p-0.5" style={{ border: "1px solid var(--card-border)" }} />
                <input value={form.accentColor} onChange={(e) => update("accentColor", e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm font-mono outline-none"
                  style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          {saved && (
            <span className="flex items-center gap-1 text-sm font-medium" style={{ color: "var(--success)" }}>
              <Check className="w-4 h-4" /> Berhasil disimpan
            </span>
          )}
          <button type="submit"
            className="flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg"
            style={{ background: "var(--primary)" }}>
            <Save className="w-5 h-5" /> Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
}

function applyColors(settings: Record<string, string>) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (settings.primaryColor) root.style.setProperty("--primary", settings.primaryColor);
  if (settings.secondaryColor) root.style.setProperty("--secondary", settings.secondaryColor);
  if (settings.accentColor) root.style.setProperty("--accent", settings.accentColor);
}
