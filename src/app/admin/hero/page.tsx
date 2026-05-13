"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/adminApi";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, ArrowUp, ArrowDown, Check, X, Upload, Image as ImageIcon } from "lucide-react";

function normalize(s: Record<string, unknown>) {
  return { ...s, active: s.active === 1 || s.active === true } as any;
}

const emptySlide = {
  id: "", headline: "", tagline: "", description: "",
  ctaText: "", ctaHref: "", gradient: "linear-gradient(135deg, #1B5E20, #1565C0)", active: true,
};

const gradients = [
  { value: "linear-gradient(135deg, #1B5E20, #1565C0)", label: "Hijau ke Biru" },
  { value: "linear-gradient(135deg, #1565C0, #1B5E20)", label: "Biru ke Hijau" },
  { value: "linear-gradient(135deg, #065F46, #0D9488)", label: "Emerald ke Teal" },
  { value: "linear-gradient(135deg, #0F172A, #1B5E20)", label: "Slate ke Hijau" },
  { value: "linear-gradient(135deg, #064E3B, #164E63)", label: "Emerald ke Cyan" },
  { value: "linear-gradient(135deg, #4ADE80, #FBBF24)", label: "Terang (Hijau-Kuning)" },
  { value: "linear-gradient(135deg, #F59E0B, #DC2626)", label: "Orange ke Merah" },
];

export default function AdminHero() {
  const [slides, setSlides] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>(emptySlide);

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await adminApi.hero.list();
    setSlides(data.map(normalize));
  }

  async function persist(data: any[]) {
    setSlides(data);
    for (const s of data) {
      await adminApi.hero.save(s);
    }
  }

  const openEdit = (slide: any) => {
    setForm({ ...slide });
    setEditingId(slide.id);
    setShowForm(true);
  };

  const openAdd = () => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    setForm({ ...emptySlide, id });
    setEditingId(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.headline || !form.ctaText) return;
    if (editingId) {
      await adminApi.hero.save(form);
      setSlides(slides.map((s) => (s.id === editingId ? form : s)));
    } else {
      await adminApi.hero.save(form);
      setSlides([...slides, form]);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus slide ini?")) return;
    await adminApi.hero.remove(id);
    setSlides(slides.filter((s) => s.id !== id));
  };

  const toggleActive = async (id: string) => {
    const updated = slides.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
    setSlides(updated);
    const target = updated.find((s) => s.id === id);
    if (target) await adminApi.hero.save(target);
  };

  const moveSlide = async (index: number, direction: "up" | "down") => {
    const newSlides = [...slides];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= newSlides.length) return;
    [newSlides[index], newSlides[target]] = [newSlides[target], newSlides[index]];
    setSlides(newSlides);
    for (let i = 0; i < newSlides.length; i++) {
      await adminApi.hero.save({ ...newSlides[i], sort_order: i });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Hero Slider</h1>
          <p className="mt-1" style={{ color: "var(--text-secondary)" }}>Kelola slide banner pada halaman utama</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          style={{ background: "var(--primary)" }}>
          <Plus className="w-4 h-4" /> Tambah Slide
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="rounded-2xl max-w-2xl w-full p-6 shadow-2xl" style={{ background: "var(--card)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{editingId ? "Edit Slide" : "Tambah Slide"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1"><X className="w-5 h-5" style={{ color: "var(--text-muted)" }} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Headline</label>
                <textarea value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} rows={2} placeholder="Gunakan \n untuk baris baru" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Gradient Latar</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {gradients.map((g) => (
                    <button key={g.value} type="button" onClick={() => setForm({ ...form, gradient: g.value })}
                      className="relative rounded-xl overflow-hidden h-16 transition-all tap-scale"
                      style={{ background: g.value, outline: form.gradient === g.value ? "2px solid var(--primary)" : "2px solid transparent", outlineOffset: "1px" }}>
                      <span className="absolute inset-0 flex items-end p-2">
                        <span className="text-[10px] font-medium text-white/90 drop-shadow-md bg-black/30 px-1.5 py-0.5 rounded">{g.label}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Deskripsi</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Gambar Latar</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                    style={{ background: "var(--section-alt)", color: "var(--text-secondary)", border: "1px solid var(--card-border)" }}>
                    <Upload className="w-4 h-4" />
                    Pilih Gambar
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = async () => {
                        const res = await fetch("/api/upload", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ data: reader.result }),
                        });
                        const json = await res.json();
                        if (json.url) setForm({ ...form, image: json.url });
                      };
                      reader.readAsDataURL(file);
                    }} />
                  </label>
                  {form.image && (
                    <button onClick={() => setForm({ ...form, image: "" })} className="text-xs" style={{ color: "var(--error)" }}>Hapus</button>
                  )}
                </div>
                {form.image ? (
                  <div className="mt-2 relative w-32 h-20 rounded-lg overflow-hidden" style={{ border: "1px solid var(--card-border)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="mt-2 flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                    <ImageIcon className="w-4 h-4" /> Belum ada gambar
                  </div>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Teks Tombol 1</label>
                  <input value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Link Tombol 1</label>
                  <input value={form.ctaHref} onChange={(e) => setForm({ ...form, ctaHref: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Teks Tombol 2</label>
                  <input value={form.ctaSecondaryText || ""} onChange={(e) => setForm({ ...form, ctaSecondaryText: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Link Tombol 2</label>
                  <input value={form.ctaSecondaryHref || ""} onChange={(e) => setForm({ ...form, ctaSecondaryHref: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4" style={{ borderTop: "1px solid var(--card-border)" }}>
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded-lg text-sm transition-colors"
                style={{ borderColor: "var(--card-border)", color: "var(--text-secondary)" }}>Batal</button>
              <button onClick={handleSave} className="flex items-center gap-1 text-white px-5 py-2 rounded-lg text-sm font-semibold"
                style={{ background: "var(--primary)" }}>
                <Check className="w-4 h-4" /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {slides.map((slide, index) => (
          <div key={slide.id} className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: slide.gradient }}>
                  <Star className="w-8 h-8 text-white/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold whitespace-pre-line" style={{ color: "var(--text-primary)" }}>{slide.headline || <span className="italic" style={{ color: "var(--text-muted)" }}>(kosong)</span>}</h3>
                      <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{slide.tagline}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => moveSlide(index, "up")} disabled={index === 0} className="p-1.5 disabled:opacity-30" style={{ color: "var(--text-muted)" }}><ArrowUp className="w-4 h-4" /></button>
                      <button onClick={() => moveSlide(index, "down")} disabled={index === slides.length - 1} className="p-1.5 disabled:opacity-30" style={{ color: "var(--text-muted)" }}><ArrowDown className="w-4 h-4" /></button>
                      <button onClick={() => toggleActive(slide.id)} className="p-1.5" style={{ color: slide.active ? "var(--success)" : "var(--text-muted)" }}>{slide.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
                      <button onClick={() => openEdit(slide)} className="p-1.5" style={{ color: "var(--accent)" }}><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(slide.id)} className="p-1.5" style={{ color: "var(--error)" }}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <p className="text-xs mt-2 line-clamp-1" style={{ color: "var(--text-muted)" }}>{slide.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--section-alt)", color: "var(--text-secondary)" }}>{slide.ctaText}</span>
                    {slide.ctaSecondaryText && <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--section-alt)", color: "var(--text-secondary)" }}>{slide.ctaSecondaryText}</span>}
                    <span className={`text-xs px-2 py-0.5 rounded`}
                      style={{ background: slide.active ? "color-mix(in srgb, var(--success) 15%, transparent)" : "color-mix(in srgb, var(--error) 15%, transparent)", color: slide.active ? "var(--success)" : "var(--error)" }}>
                      {slide.active ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {slides.length === 0 && <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>Belum ada slide.</div>}
      </div>
    </div>
  );
}
