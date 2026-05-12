"use client";

import { useState, useEffect } from "react";
import { Database, Download, Upload, RefreshCw, Check, AlertCircle, HardDrive } from "lucide-react";

export default function AdminBackup() {
  const [stats, setStats] = useState<any>(null);
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats).catch(() => {});
    loadBackups();
  }, []);

  async function loadBackups() {
    try {
      const res = await fetch("/api/backup", { method: "GET" });
      const data = await res.json();
      if (data.ok) setBackups(data.files);
    } catch {}
  }

  async function handleBackup() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/backup");
      const data = await res.json();
      if (data.ok) {
        setMessage({ type: "success", text: `Backup berhasil: ${data.file} (${data.size})` });
        loadBackups();
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch {
      setMessage({ type: "error", text: "Gagal melakukan backup" });
    }
    setLoading(false);
  }

  async function handleRestore(fileName: string) {
    if (!confirm(`Yakin akan merestore database dari ${fileName}? Data saat ini akan ditimpa.`)) return;
    setRestoring(true);
    setMessage(null);
    try {
      const downloadRes = await fetch(`/api/backup-restore?file=${encodeURIComponent(fileName)}`);
      if (!downloadRes.ok) throw new Error("File not found");
      const blob = await downloadRes.blob();
      const form = new FormData();
      form.append("file", blob, fileName);
      const restoreRes = await fetch("/api/backup", { method: "POST", body: form });
      const data = await restoreRes.json();
      if (data.ok) {
        setMessage({ type: "success", text: "Database berhasil direstore!" });
        const s = await fetch("/api/stats").then((r) => r.json());
        setStats(s);
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch {
      setMessage({ type: "error", text: "Gagal merestore database" });
    }
    setRestoring(false);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Backup & Restore Database</h1>
        <p className="mt-1" style={{ color: "var(--text-secondary)" }}>Kelola backup database SQLite sekolah</p>
      </div>

      <div className="rounded-xl p-6 mb-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--success) 10%, transparent)" }}>
            <Database className="w-6 h-6" style={{ color: "var(--success)" }} />
          </div>
          <div>
            <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>Status Database</h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>SQLite &mdash; {stats?.dbSize || "..."}</p>
          </div>
        </div>
        {stats && (
          <div className="flex flex-wrap gap-4 text-sm" style={{ color: "var(--text-secondary)" }}>
            <span>Hero: <strong style={{ color: "var(--text-primary)" }}>{stats.tables.hero}</strong></span>
            <span>Berita: <strong style={{ color: "var(--text-primary)" }}>{stats.tables.berita}</strong></span>
            <span>Agenda: <strong style={{ color: "var(--text-primary)" }}>{stats.tables.agenda}</strong></span>
            <span>Galeri: <strong style={{ color: "var(--text-primary)" }}>{stats.tables.galeri}</strong></span>
            <span>SPMB: <strong style={{ color: "var(--text-primary)" }}>{stats.tables.spmb}</strong></span>
            <span>Settings: <strong style={{ color: "var(--text-primary)" }}>{stats.tables.settings}</strong></span>
            <span>Total: <strong style={{ color: "var(--text-primary)" }}>{stats.totalRows}</strong></span>
          </div>
        )}
      </div>

      {message && (
        <div className="flex items-center gap-2 p-4 rounded-xl mb-6 text-sm"
          style={message.type === "success"
            ? { background: "color-mix(in srgb, var(--success) 10%, transparent)", color: "var(--success)" }
            : { background: "color-mix(in srgb, var(--error) 10%, transparent)", color: "var(--error)" }
          }>
          {message.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <div className="rounded-xl p-6 mb-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>Buat Backup Baru</h2>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Download salinan database saat ini</p>
          </div>
          <button onClick={handleBackup} disabled={loading}
            className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
            style={{ background: "var(--primary)" }}
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Backup Now
          </button>
        </div>
      </div>

      <div className="rounded-xl p-6 mb-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
        <h2 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Restore dari Backup</h2>
        <div className="flex items-center gap-4">
          <input type="file" accept=".db" id="restore-file" className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (!confirm(`Restore database dari ${file.name}? Data saat ini akan ditimpa!`)) return;
              setRestoring(true);
              setMessage(null);
              try {
                const form = new FormData();
                form.append("file", file);
                const res = await fetch("/api/backup", { method: "POST", body: form });
                const data = await res.json();
                if (data.ok) {
                  setMessage({ type: "success", text: "Database berhasil direstore!" });
                  const s = await fetch("/api/stats").then((r) => r.json());
                  setStats(s);
                } else {
                  setMessage({ type: "error", text: data.error });
                }
              } catch {
                setMessage({ type: "error", text: "Gagal merestore database" });
              }
              setRestoring(false);
            }}
          />
          <label htmlFor="restore-file"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors"
            style={{ background: "var(--warning)", color: "white" }}
          >
            {restoring ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Pilih File .db
          </label>
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>Upload file backup .db untuk restore</span>
        </div>
      </div>

      <div className="rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--card-border)" }}>
          <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>Riwayat Backup</h2>
        </div>
        {backups.length === 0 ? (
          <div className="p-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            Belum ada backup. Klik "Backup Now" untuk membuat backup pertama.
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--card-border)" }}>
            {backups.map((b, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HardDrive className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{b.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {b.size} &bull; {new Date(b.date).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                <button onClick={() => handleRestore(b.name)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{ background: "rgba(22, 163, 74, 0.1)", color: "var(--success)" }}>
                  <Upload className="w-3.5 h-3.5" /> Restore
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
