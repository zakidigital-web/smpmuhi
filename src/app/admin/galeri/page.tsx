"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/adminApi";
import { Plus, Pencil, Trash2, Image, Film, X, Check } from "lucide-react";

const emptyGaleri = { id: "", title: "", category: "Kegiatan", desc: "", media_type: "photo", url: "" };
const categories = ["Kegiatan", "Prestasi", "Fasilitas", "Upacara", "Ekskul"];

export default function AdminGaleri() {
  const [items, setItems] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState("Semua");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(emptyGaleri);

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await adminApi.galeri.list();
    setItems(data);
  }

  const openAdd = () => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    setForm({ ...emptyGaleri, id });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setForm({ ...item });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title) return;
    await adminApi.galeri.save(form);
    if (editingId) {
      setItems(items.map((i) => (i.id === editingId ? form : i)));
    } else {
      setItems([...items, form]);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus item ini?")) return;
    await adminApi.galeri.remove(id);
    setPreviewId(null);
    setItems(items.filter((i) => i.id !== id));
  };

  const filtered = activeCat === "Semua" ? items : items.filter((g: any) => g.category === activeCat);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Kelola Galeri</h1>
          <p className="mt-1" style={{ color: "var(--text-secondary)" }}>Atur foto dan video kegiatan sekolah</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          style={{ background: "var(--primary)" }}>
          <Plus className="w-4 h-4" /> Tambah Item
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="rounded-2xl max-w-md w-full p-6 shadow-2xl" style={{ background: "var(--card)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{editingId ? "Edit Item" : "Tambah Item"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1"><X className="w-5 h-5" style={{ color: "var(--text-muted)" }} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Judul</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                  style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Kategori</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                    style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }}>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Tipe Media</label>
                  <select value={form.media_type} onChange={(e) => setForm({ ...form, media_type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                    style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }}>
                    <option value="photo">Foto</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>
              {form.media_type === "photo" ? (
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>URL Gambar</label>
                  <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                    style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} placeholder="https://drive.google.com/... atau link gambar" />
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Gunakan Google Drive atau URL gambar</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>URL YouTube (Embed)</label>
                  <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                    style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} placeholder="https://www.youtube.com/embed/..." />
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Gunakan link embed YouTube</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Deskripsi</label>
                <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} rows={2} />
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

      <div className="flex flex-wrap gap-2 mb-6">
        {["Semua", ...categories].map((cat) => (
          <button key={cat} onClick={() => setActiveCat(cat)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: activeCat === cat ? "var(--primary)" : "var(--card)",
              color: activeCat === cat ? "white" : "var(--text-secondary)",
              border: activeCat === cat ? "1px solid transparent" : "1px solid var(--card-border)",
            }}>{cat}</button>
        ))}
      </div>

      {previewId && !showForm && (
        <div className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center p-4" onClick={() => setPreviewId(null)}>
          <div className="rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl" style={{ background: "var(--card)" }} onClick={(e) => e.stopPropagation()}>
            {(() => {
              const item = items.find((g: any) => g.id === previewId);
              return item ? (
                <>
                  {item.media_type === "video" && item.url ? (
                    <div className="aspect-video relative">
                      <iframe src={item.url} className="w-full h-full" allowFullScreen title={item.title} />
                    </div>
                  ) : item.url ? (
                    <div className="aspect-video flex items-center justify-center relative" style={{ background: "var(--section-alt)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-video flex items-center justify-center relative" style={{ background: "var(--section-alt)" }}>
                      <Image className="w-24 h-24" style={{ color: "var(--text-muted)" }} />
                    </div>
                  )}
                  <button onClick={() => setPreviewId(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow" style={{ background: "var(--card)" }}><X className="w-5 h-5" style={{ color: "var(--text-secondary)" }} /></button>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-1">
                      {item.media_type === "video" ? <Film className="w-4 h-4" style={{ color: "var(--accent)" }} /> : <Image className="w-4 h-4" style={{ color: "var(--success)" }} />}
                      <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                    </div>
                    <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
                    <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid var(--card-border)" }}>
                      <span className="text-xs px-2 py-1 rounded-full" style={{ background: "color-mix(in srgb, var(--primary) 12%, transparent)", color: "var(--primary)" }}>{item.category}</span>
                      <div className="flex gap-1">
                        <button onClick={() => { setPreviewId(null); openEdit(item); }}
                          className="p-1.5 rounded-lg" style={{ color: "var(--accent)" }}><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(previewId)} className="p-1.5 rounded-lg" style={{ color: "var(--error)" }}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                </>
              ) : null;
            })()}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item: any) => (
          <div key={item.id} onClick={() => setPreviewId(item.id)}
            className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer tap-scale"
            style={{ background: "var(--section-alt)" }}>
            {item.media_type === "video" ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
                  <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <span className="text-xs font-medium mt-2 text-white/80">Video</span>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                {item.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <Image className="w-12 h-12" style={{ color: "var(--text-muted)" }} />
                )}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4">
              <h3 className="text-white font-semibold text-sm">{item.title}</h3>
              <p className="text-white/80 text-xs">{item.category}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>Menampilkan {filtered.length} dari {items.length} item</div>
    </div>
  );
}
