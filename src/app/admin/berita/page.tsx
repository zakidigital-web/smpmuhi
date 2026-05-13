"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/adminApi";
import { Plus, Pencil, Trash2, Search, X, Check, Image as ImageIcon, Upload, Loader2, MessageSquare, MessageSquareOff } from "lucide-react";

const emptyBerita = { id: "", title: "", excerpt: "", content: "", date: "", author: "Admin", category: "", slug: "", image: "", allow_comments: 1 };
const categories = ["Pendaftaran", "Prestasi", "Kegiatan", "Akademik", "Keagamaan"];

export default function AdminBerita() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(emptyBerita);

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await adminApi.berita.list();
    setItems(data);
  }

  const openAdd = () => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const today = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    setForm({ ...emptyBerita, id, date: today });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setForm({ ...item });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.category) return;
    await adminApi.berita.save(form);
    if (editingId) {
      setItems(items.map((i) => (i.id === editingId ? form : i)));
    } else {
      setItems([form, ...items]);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus berita ini?")) return;
    await adminApi.berita.remove(id);
    setItems(items.filter((i) => i.id !== id));
  };

  const filtered = items.filter(
    (item) =>
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Kelola Berita</h1>
          <p className="mt-1" style={{ color: "var(--text-secondary)" }}>Tambah, edit, atau hapus berita sekolah</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          style={{ background: "var(--primary)" }}>
          <Plus className="w-4 h-4" /> Tambah Berita
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="rounded-2xl max-w-2xl w-full my-8 p-6 shadow-2xl" style={{ background: "var(--card)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{editingId ? "Edit Berita" : "Tambah Berita"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1"><X className="w-5 h-5" style={{ color: "var(--text-muted)" }} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Judul</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                  style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Kategori</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                    style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }}>
                    <option value="">Pilih kategori</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Tanggal</label>
                  <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                    style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Ringkasan</label>
                <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Konten Lengkap</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} rows={6} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Slug</label>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                    style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Penulis</label>
                  <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                    style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Gambar Sampul</label>
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
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Komentar</label>
                <button onClick={() => setForm({ ...form, allow_comments: form.allow_comments ? 0 : 1 })}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  style={{ background: form.allow_comments ? "color-mix(in srgb, var(--success) 12%, transparent)" : "color-mix(in srgb, var(--error) 12%, transparent)", color: form.allow_comments ? "var(--success)" : "var(--error)", border: "1px solid var(--card-border)" }}>
                  {form.allow_comments ? <><MessageSquare className="w-4 h-4" /> Komentar Diaktifkan</> : <><MessageSquareOff className="w-4 h-4" /> Komentar Dinonaktifkan</>}
                </button>
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

      <div className="relative mb-6">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--text-muted)" }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari berita..."
          className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2"
          style={{ border: "1px solid var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--section-alt)", borderBottom: "1px solid var(--card-border)" }}>
                <th className="text-left px-6 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Judul</th>
                <th className="text-left px-6 py-3 font-semibold hidden md:table-cell" style={{ color: "var(--text-secondary)" }}>Kategori</th>
                <th className="text-left px-6 py-3 font-semibold hidden sm:table-cell" style={{ color: "var(--text-secondary)" }}>Tanggal</th>
                <th className="text-right px-6 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--card-border)" }}>
              {filtered.map((item: any) => (
                <tr key={item.id} className="transition-colors" style={{ background: "transparent" }}>
                  <td className="px-6 py-4">
                    <p className="font-medium truncate max-w-xs" style={{ color: "var(--text-primary)" }}>{item.title}</p>
                    <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "var(--text-muted)" }}>{item.excerpt}</p>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: "color-mix(in srgb, var(--primary) 12%, transparent)", color: "var(--primary)" }}>{item.category}</span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell" style={{ color: "var(--text-muted)" }}>{item.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg transition-colors" style={{ color: "var(--accent)" }}><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg transition-colors" style={{ color: "var(--error)" }}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 text-sm" style={{ background: "var(--section-alt)", borderTop: "1px solid var(--card-border)", color: "var(--text-muted)" }}>Total: {filtered.length} berita</div>
      </div>
    </div>
  );
}
