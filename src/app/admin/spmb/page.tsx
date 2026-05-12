"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/adminApi";
import { Search, CheckCircle, XCircle, Clock, User, School, FileText } from "lucide-react";

export default function AdminSpmb() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await adminApi.spmb.list();
    setItems(data);
  }

  const handleStatus = async (id: string, status: string) => {
    await adminApi.spmb.updateStatus(id, status);
    setItems(items.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data pendaftaran ini?")) return;
    await adminApi.spmb.remove(id);
    setItems(items.filter((i) => i.id !== id));
  };

  const filtered = items.filter((item: any) => {
    const matchSearch = !search || item.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) || item.nomor_pendaftaran?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusColor: Record<string, React.CSSProperties> = {
    menunggu: { background: "rgba(234,179,8,0.12)", color: "#CA8A04" },
    diterima: { background: "rgba(22,163,74,0.12)", color: "var(--success)" },
    ditolak: { background: "rgba(220,38,38,0.12)", color: "var(--error)" },
  };

  const stats = {
    total: items.length,
    menunggu: items.filter((i: any) => i.status === "menunggu").length,
    diterima: items.filter((i: any) => i.status === "diterima").length,
    ditolak: items.filter((i: any) => i.status === "ditolak").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Kelola SPMB</h1>
          <p className="mt-1" style={{ color: "var(--text-secondary)" }}>Data pendaftaran murid baru</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
          <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{stats.total}</div>
          <div className="text-sm" style={{ color: "var(--text-muted)" }}>Total Pendaftar</div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)" }}>
          <div className="text-2xl font-bold text-yellow-600">{stats.menunggu}</div>
          <div className="text-sm text-yellow-700">Menunggu</div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)" }}>
          <div className="text-2xl font-bold text-green-600">{stats.diterima}</div>
          <div className="text-sm text-green-700">Diterima</div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)" }}>
          <div className="text-2xl font-bold text-red-600">{stats.ditolak}</div>
          <div className="text-sm text-red-700">Ditolak</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--text-muted)" }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau nomor pendaftaran..."
            className="w-full pl-11 pr-4 py-3 border rounded-xl text-sm"
            style={{ borderColor: "var(--card-border)", background: "var(--card)", color: "var(--text-primary)" }} />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 border rounded-xl text-sm"
          style={{ borderColor: "var(--card-border)", background: "var(--card)", color: "var(--text-primary)" }}>
          <option value="">Semua Status</option>
          <option value="menunggu">Menunggu</option>
          <option value="diterima">Diterima</option>
          <option value="ditolak">Ditolak</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--card-border)", background: "var(--card)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--card-border)", background: "var(--section-alt)" }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>No. Daftar</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Nama</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell" style={{ color: "var(--text-secondary)" }}>Program</th>
                <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell" style={{ color: "var(--text-secondary)" }}>Tanggal</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Status</th>
                <th className="text-right px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--card-border)" }}>
              {filtered.map((item: any) => (
                <tr key={item.id} className="transition-colors">
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-primary)" }}>{item.nomor_pendaftaran}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>{item.nama_lengkap}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.nisn}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell" style={{ color: "var(--text-secondary)" }}>{item.program_pilihan}</td>
                  <td className="px-4 py-3 hidden sm:table-cell text-xs" style={{ color: "var(--text-muted)" }}>
                    {new Date(item.created_at).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full"
                      style={statusColor[item.status] || { background: "var(--section-alt)", color: "var(--text-secondary)" }}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {item.status === "menunggu" && (
                        <>
                          <button onClick={() => handleStatus(item.id, "diterima")}
                            className="p-1.5 rounded-lg transition-colors" style={{ color: "var(--success)" }} title="Terima"><CheckCircle className="w-4 h-4" /></button>
                          <button onClick={() => handleStatus(item.id, "ditolak")}
                            className="p-1.5 rounded-lg transition-colors" style={{ color: "var(--error)" }} title="Tolak"><XCircle className="w-4 h-4" /></button>
                        </>
                      )}
                      <button onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg transition-colors" style={{ color: "var(--text-muted)" }} title="Hapus"><XCircle className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 text-sm" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--card-border)" }}>
          Total: {filtered.length} pendaftar
        </div>
      </div>
    </div>
  );
}
