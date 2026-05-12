"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/adminApi";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

const emptyAgenda = { id: "", title: "", date: "", time: "", location: "", description: "", type: "" };
const types = ["Pendaftaran", "Seleksi", "Pengumuman", "Kegiatan", "Libur"];

export default function AdminAgenda() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(emptyAgenda);

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await adminApi.agenda.list();
    setItems(data);
  }

  const openAdd = () => {
    const id = "ag-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    setForm({ ...emptyAgenda, id });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setForm({ ...item });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.date) return;
    await adminApi.agenda.save(form);
    if (editingId) {
      setItems(items.map((i) => (i.id === editingId ? form : i)));
    } else {
      setItems([...items, form]);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus agenda ini?")) return;
    await adminApi.agenda.remove(id);
    setItems(items.filter((i) => i.id !== id));
  };

  const filtered = items.filter(
    (item) =>
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Kelola Agenda</h1>
          <p className="mt-1" style={{ color: "var(--text-secondary)" }}>Tambah, edit, atau hapus agenda sekolah</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          style={{ background: "var(--primary)" }}>
          <Plus className="w-4 h-4" /> Tambah Agenda
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="rounded-2xl max-w-2xl w-full my-8 p-6 shadow-2xl" style={{ background: "var(--card)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{editingId ? "Edit Agenda" : "Tambah Agenda"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1"><X className="w-5 h-5" style={{ color: "var(--text-muted)" }} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Judul Agenda</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                  style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Tanggal</label>
                  <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                    style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Waktu</label>
                  <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                    style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Lokasi</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                    style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Tipe</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
                    style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }}>
                    <option value="">Pilih tipe</option>
                    {types.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Deskripsi</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none" style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} rows={3} />
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
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari agenda..."
          className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2"
          style={{ border: "1px solid var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--section-alt)", borderBottom: "1px solid var(--card-border)" }}>
                <th className="text-left px-6 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Judul</th>
                <th className="text-left px-6 py-3 font-semibold hidden md:table-cell" style={{ color: "var(--text-secondary)" }}>Tanggal</th>
                <th className="text-left px-6 py-3 font-semibold hidden sm:table-cell" style={{ color: "var(--text-secondary)" }}>Tipe</th>
                <th className="text-right px-6 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--card-border)" }}>
              {filtered.map((item: any) => (
                <tr key={item.id}>
                  <td className="px-6 py-4">
                    <p className="font-medium truncate max-w-xs" style={{ color: "var(--text-primary)" }}>{item.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{item.time} &middot; {item.location}</p>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell" style={{ color: "var(--text-muted)" }}>{item.date}</td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: "color-mix(in srgb, var(--primary) 12%, transparent)", color: "var(--primary)" }}>{item.type}</span>
                  </td>
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
        <div className="px-6 py-3 text-sm" style={{ background: "var(--section-alt)", borderTop: "1px solid var(--card-border)", color: "var(--text-muted)" }}>Total: {filtered.length} agenda</div>
      </div>
    </div>
  );
}
