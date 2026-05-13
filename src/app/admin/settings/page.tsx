"use client";

import { useState, useEffect, useRef } from "react";
import { adminApi } from "@/lib/adminApi";
import { Save, Check, Lock, AlertCircle, Loader2, School, Phone, Globe, MapPin, Image, PiggyBank, Palette, KeyRound, Menu, X } from "lucide-react";

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
  gmapsLat: "-8.360388",
  gmapsLng: "114.159599",
  showFees: "1",
  feeRegistration: "Gratis",
  feeDevelopment: "Rp 500.000",
  feeUniform: "Rp 350.000",
  feeSpp: "Rp 150.000",
  feeBooks: "Rp 75.000",
  feeActivities: "Rp 50.000",
  showFacilities: "1",
  facilities: "Ruang Kelas Nyaman, Lab Komputer, Perpustakaan, Musholla, Lapangan Olahraga, Kantin Sehat, Ruang UKS, WiFi Internet, Pondok Pesantren",
  kepalaSekolah: "Abdul Latif, S.Pd.",
};

const sections = [
  { id: "sekolah", label: "Informasi Sekolah", icon: School },
  { id: "kontak", label: "Kontak", icon: Phone },
  { id: "sosmed", label: "Media Sosial", icon: Globe },
  { id: "maps", label: "Google Maps", icon: MapPin },
  { id: "footer", label: "Footer", icon: Image },
  { id: "biaya", label: "Biaya Pendidikan", icon: PiggyBank },
  { id: "fasilitas", label: "Fasilitas", icon: Image },
  { id: "tema", label: "Tema", icon: Palette },
  { id: "password", label: "Password", icon: KeyRound },
];

export default function AdminSettings() {
  const [form, setForm] = useState<Record<string, string>>(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("sekolah");
  const [navOpen, setNavOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    adminApi.settings.get().then((data) => {
      if (data && Object.keys(data).length > 0) {
        setForm({ ...defaultSettings, ...data });
        applyColors(data);
      }
    });
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Pengaturan Website</h1>
          <p className="mt-1" style={{ color: "var(--text-secondary)" }}>Kelola informasi dan konfigurasi website sekolah</p>
        </div>
        <button onClick={() => setNavOpen(!navOpen)}
          className="lg:hidden p-2.5 rounded-xl transition-colors"
          style={{ background: "var(--card)", border: "1px solid var(--card-border)", color: "var(--text-secondary)" }}>
          {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Section Nav */}
      {navOpen && (
        <div className="lg:hidden mb-6 rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
          {sections.map((s) => {
            const Icon = s.icon;
            const isActive = activeSection === s.id;
            return (
              <button key={s.id} onClick={() => scrollTo(s.id)}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-left transition-colors"
                style={isActive ? { background: "color-mix(in srgb, var(--primary) 12%, transparent)", color: "var(--primary)", fontWeight: 600 } : { color: "var(--text-secondary)" }}>
                <Icon className="w-4 h-4" />
                {s.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex gap-6">
        {/* Desktop Sidebar Nav */}
        <nav className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-8 space-y-1 rounded-xl p-3" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            {sections.map((s) => {
              const Icon = s.icon;
              const isActive = activeSection === s.id;
              return (
                <button key={s.id} onClick={() => scrollTo(s.id)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-left transition-all"
                  style={isActive ? { background: "var(--primary)", color: "white" } : { color: "var(--text-secondary)" }}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{s.label}</span>
                </button>
              );
            })}
            {/* Color Preview */}
            <div className="pt-3 mt-3 flex items-center gap-2 px-3" style={{ borderTop: "1px solid var(--card-border)" }}>
              {["primaryColor", "secondaryColor", "accentColor"].map((key) => (
                <div key={key} className="w-5 h-5 rounded-md" style={{ background: form[key] || "#ccc", border: "1px solid var(--card-border)" }} title={key.replace("Color", "")} />
              ))}
            </div>
          </div>
        </nav>

        {/* Form Content */}
        <form onSubmit={handleSave} className="flex-1 space-y-6 min-w-0">
          <div id="sekolah" style={sectionStyle}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <School className="w-5 h-5" style={{ color: "var(--primary)" }} />
              Informasi Sekolah
            </h2>
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
              <div>
                <label className="block text-sm font-medium" style={labelStyle}>Kepala Sekolah</label>
                <input value={form.kepalaSekolah} onChange={(e) => update("kepalaSekolah", e.target.value)}
                  className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium" style={labelStyle}>Alamat</label>
                <textarea value={form.address} onChange={(e) => update("address", e.target.value)}
                  className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} rows={2} />
              </div>
            </div>
          </div>

          <div id="kontak" style={sectionStyle}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Phone className="w-5 h-5" style={{ color: "var(--primary)" }} />
              Kontak
            </h2>
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

          <div id="sosmed" style={sectionStyle}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Globe className="w-5 h-5" style={{ color: "var(--primary)" }} />
              Media Sosial
            </h2>
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

          <div id="maps" style={sectionStyle}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <MapPin className="w-5 h-5" style={{ color: "var(--primary)" }} />
              Google Maps
            </h2>
            <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Koordinat lokasi sekolah untuk tampilan peta di halaman Kontak.</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium" style={labelStyle}>Latitude</label>
                <input value={form.gmapsLat} onChange={(e) => update("gmapsLat", e.target.value)}
                  className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} placeholder="-8.360388" />
              </div>
              <div>
                <label className="block text-sm font-medium" style={labelStyle}>Longitude</label>
                <input value={form.gmapsLng} onChange={(e) => update("gmapsLng", e.target.value)}
                  className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} placeholder="114.159599" />
              </div>
            </div>
            <div className="mt-3 rounded-xl overflow-hidden h-40" style={{ border: "1px solid var(--card-border)" }}>
              <iframe
                src={`https://maps.google.com/maps?q=${form.gmapsLat || "-8.360388"},${form.gmapsLng || "114.159599"}&z=14&output=embed`}
                className="w-full h-full"
                loading="lazy"
                style={{ border: 0 }}
                title="Pratinjau Google Maps"
              />
            </div>
          </div>

          <div id="footer" style={sectionStyle}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Image className="w-5 h-5" style={{ color: "var(--primary)" }} />
              Footer
            </h2>
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

          <div id="biaya" style={sectionStyle}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <PiggyBank className="w-5 h-5" style={{ color: "var(--primary)" }} />
              Biaya Pendidikan
            </h2>
            <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Biaya yang ditampilkan di halaman SPMB.</p>
            <div className="flex items-center gap-3 mb-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={form.showFees === "1"} onChange={(e) => update("showFees", e.target.checked ? "1" : "0")} className="sr-only peer" />
                <div className="w-10 h-5 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[3px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" style={{ background: form.showFees === "1" ? "var(--primary)" : "var(--card-border)" }} />
                <span className="ms-3 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{form.showFees === "1" ? "Ditampilkan" : "Disembunyikan"}</span>
              </label>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium" style={labelStyle}>Pendaftaran</label>
                <input value={form.feeRegistration} onChange={(e) => update("feeRegistration", e.target.value)}
                  className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium" style={labelStyle}>Dana Pengembangan</label>
                <input value={form.feeDevelopment} onChange={(e) => update("feeDevelopment", e.target.value)}
                  className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium" style={labelStyle}>Seragam & Perlengkapan</label>
                <input value={form.feeUniform} onChange={(e) => update("feeUniform", e.target.value)}
                  className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium" style={labelStyle}>SPP (Bulanan)</label>
                <input value={form.feeSpp} onChange={(e) => update("feeSpp", e.target.value)}
                  className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium" style={labelStyle}>Buku & LKS (Bulanan)</label>
                <input value={form.feeBooks} onChange={(e) => update("feeBooks", e.target.value)}
                  className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium" style={labelStyle}>Kegiatan (Bulanan)</label>
                <input value={form.feeActivities} onChange={(e) => update("feeActivities", e.target.value)}
                  className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
              </div>
            </div>
          </div>

          <div id="fasilitas" style={sectionStyle}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Image className="w-5 h-5" style={{ color: "var(--primary)" }} />
              Fasilitas Sekolah
            </h2>
            <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Fasilitas yang ditampilkan di halaman Beranda.</p>
            <div className="flex items-center gap-3 mb-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={form.showFacilities === "1"} onChange={(e) => update("showFacilities", e.target.checked ? "1" : "0")} className="sr-only peer" />
                <div className="w-10 h-5 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[3px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" style={{ background: form.showFacilities === "1" ? "var(--primary)" : "var(--card-border)" }} />
                <span className="ms-3 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{form.showFacilities === "1" ? "Ditampilkan" : "Disembunyikan"}</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium" style={labelStyle}>Daftar Fasilitas</label>
              <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Pisahkan dengan koma (contoh: Ruang Kelas, Lab, Perpustakaan)</p>
              <textarea value={form.facilities} onChange={(e) => update("facilities", e.target.value)}
                className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} rows={4} />
            </div>
            {form.showFacilities === "1" && form.facilities && (
              <div className="mt-3">
                <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Pratinjau:</p>
                <div className="flex flex-wrap gap-2">
                  {form.facilities.split(",").map((f, i) => f.trim() && (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full" style={{ background: "color-mix(in srgb, var(--success) 12%, transparent)", color: "var(--success)" }}>{f.trim()}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div id="tema" style={sectionStyle}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Palette className="w-5 h-5" style={{ color: "var(--primary)" }} />
              Tema
            </h2>
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

          <div id="password" style={sectionStyle}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <KeyRound className="w-5 h-5" style={{ color: "var(--primary)" }} />
              Ubah Password Admin
            </h2>
            <PasswordChangeForm />
          </div>

          <div className="flex items-center justify-end gap-4 sticky bottom-4" style={{ background: "var(--section-alt)" }}>
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
    </div>
  );
}

function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (newPassword.length < 6) { setError("Password baru minimal 6 karakter"); return; }
    if (newPassword !== confirmPassword) { setError("Konfirmasi password tidak cocok"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change-password", password: currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Gagal mengubah password"); }
      else {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch { setError("Terjadi kesalahan"); }
    finally { setLoading(false); }
  };

  const inputClass = "w-full px-3 py-2 border rounded-lg text-sm outline-none transition-all focus:ring-2";

  return (
    <form onSubmit={handleChange} className="space-y-4 max-w-md">
      {error && (
        <div className="flex items-center gap-2 text-sm p-3 rounded-lg" style={{ background: "color-mix(in srgb, var(--error) 10%, transparent)", color: "var(--error)" }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 text-sm p-3 rounded-lg" style={{ background: "color-mix(in srgb, var(--success) 10%, transparent)", color: "var(--success)" }}>
          <Check className="w-4 h-4 flex-shrink-0" /> Password berhasil diubah
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Password Saat Ini</label>
        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required
          className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Password Baru</label>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
          className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Konfirmasi Password Baru</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
          className={inputClass} style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
      </div>
      <button type="submit" disabled={loading}
        className="flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-all disabled:opacity-50"
        style={{ background: "var(--primary)" }}>
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : <><Lock className="w-4 h-4" /> Ubah Password</>}
      </button>
    </form>
  );
}

function applyColors(settings: Record<string, string>) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (settings.primaryColor) root.style.setProperty("--primary", settings.primaryColor);
  if (settings.secondaryColor) root.style.setProperty("--secondary", settings.secondaryColor);
  if (settings.accentColor) root.style.setProperty("--accent", settings.accentColor);
}
