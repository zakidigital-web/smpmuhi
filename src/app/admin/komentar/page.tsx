"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/adminApi";
import { Trash2, Search, MessageSquare, User, Calendar, Loader2 } from "lucide-react";

type Comment = {
  id: string;
  berita_id: string;
  name: string;
  content: string;
  created_at: string;
};

type Berita = {
  id: string;
  title: string;
};

export default function AdminKomentar() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [beritas, setBeritas] = useState<Berita[]>([]);
  const [search, setSearch] = useState("");
  const [selectedBerita, setSelectedBerita] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.berita.list().then(async (b) => {
      setBeritas(b as Berita[]);
      const all: Comment[] = [];
      for (const ber of b as Berita[]) {
        const c = await adminApi.komentar.list(ber.id);
        all.push(...(c as Comment[]));
      }
      setComments(all);
      setLoading(false);
    });
  }, []);

  async function loadComments(berita_id: string) {
    setSelectedBerita(berita_id);
    if (!berita_id) {
      const all: Comment[] = [];
      for (const b of beritas) {
        const c = await adminApi.komentar.list(b.id);
        all.push(...(c as Comment[]));
      }
      setComments(all);
    } else {
      const c = await adminApi.komentar.list(berita_id);
      setComments(c as Comment[]);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus komentar ini?")) return;
    await adminApi.komentar.remove(id);
    setComments(comments.filter((c) => c.id !== id));
  };

  const filtered = comments.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.content?.toLowerCase().includes(search.toLowerCase())
  );

  const getBeritaTitle = (id: string) => beritas.find((b) => b.id === id)?.title || id;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--primary)" }} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Kelola Komentar</h1>
        <p className="mt-1" style={{ color: "var(--text-secondary)" }}>Hapus komentar yang tidak relevan</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--text-muted)" }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari komentar..."
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none"
            style={{ border: "1px solid var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }} />
        </div>
        <select value={selectedBerita} onChange={(e) => loadComments(e.target.value)}
          className="px-4 py-3 rounded-xl text-sm outline-none"
          style={{ border: "1px solid var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }}>
          <option value="">Semua Berita</option>
          {beritas.map((b) => (
            <option key={b.id} value={b.id}>{b.title}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center py-12 text-sm" style={{ color: "var(--text-muted)" }}>Belum ada komentar</p>
        ) : (
          filtered.map((c) => (
            <div key={c.id} className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4" style={{ color: "var(--primary)" }} />
                    <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{c.name}</span>
                  </div>
                  <p className="text-sm leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>{c.content}</p>
                  <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(c.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{getBeritaTitle(c.berita_id)}</span>
                  </div>
                </div>
                <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg transition-colors flex-shrink-0" style={{ color: "var(--error)" }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>Total: {filtered.length} komentar</div>
    </div>
  );
}
