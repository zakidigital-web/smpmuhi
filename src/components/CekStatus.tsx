"use client";

import { useState } from "react";
import { Search, User, School, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; bg: string; Icon: typeof Clock }> = {
  menunggu: { label: "Menunggu Verifikasi", color: "#B45309", bg: "color-mix(in srgb, #B45309 10%, transparent)", Icon: Clock },
  diterima: { label: "Selamat! Anda Diterima", color: "var(--success)", bg: "color-mix(in srgb, var(--success) 10%, transparent)", Icon: CheckCircle },
  ditolak: { label: "Maaf, Anda Belum Diterima", color: "var(--error)", bg: "color-mix(in srgb, var(--error) 10%, transparent)", Icon: XCircle },
};

export default function CekStatus({ onClose }: { onClose?: () => void }) {
  const [nomor, setNomor] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomor.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/spmb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check", nomor_pendaftaran: nomor.trim() }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Terjadi kesalahan");
      else setResult(data);
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const cfg = result ? (statusConfig[result.status] || statusConfig.ditolak) : null;

  return (
    <div className="max-w-lg mx-auto">
      <div className="rounded-2xl p-6 md:p-8" style={{ background: "var(--card)" }}>
        <form onSubmit={handleCheck} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
              Nomor Pendaftaran
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--text-muted)" }} />
              <input
                type="text"
                value={nomor}
                onChange={(e) => setNomor(e.target.value)}
                placeholder="Contoh: SPMB-12345678"
                className="w-full pl-12 pr-4 py-3.5 border-2 rounded-xl text-base font-medium transition-colors focus:outline-none"
                style={{
                  borderColor: error ? "var(--error)" : "var(--card-border)",
                  background: "var(--background)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !nomor.trim()}
            className="w-full font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: "var(--primary)", color: "white" }}
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Mengecek...</> : <>Cek Status</>}
          </button>
        </form>

        {error && (
          <div className="flex items-center gap-2 mt-4 p-3 rounded-xl" style={{ background: "color-mix(in srgb, var(--error) 10%, transparent)" }}>
            <AlertCircle className="w-5 h-5" style={{ color: "var(--error)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--error)" }}>{error}</p>
          </div>
        )}
      </div>

      {result && cfg && (
        <div className="rounded-2xl overflow-hidden mt-6" style={{ background: "var(--card)" }}>
          <div className="p-6 md:p-8 text-center" style={{ background: cfg.bg }}>
            <cfg.Icon className="w-16 h-16 mx-auto mb-3" style={{ color: cfg.color }} />
            <h2 className="text-xl font-bold" style={{ color: cfg.color }}>
              {cfg.label}
            </h2>
          </div>

          <div className="p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--section-alt)" }}>
              <User className="w-5 h-5" style={{ color: "var(--primary)" }} />
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Nama Lengkap</p>
                <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{result.nama_lengkap}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--section-alt)" }}>
              <School className="w-5 h-5" style={{ color: "var(--primary)" }} />
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Program</p>
                <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{result.program_pilihan}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--section-alt)" }}>
              <Calendar className="w-5 h-5" style={{ color: "var(--primary)" }} />
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Tanggal Daftar</p>
                <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  {new Date(result.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--section-alt)" }}>
              <Search className="w-5 h-5" style={{ color: "var(--primary)" }} />
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Nomor Pendaftaran</p>
                <p className="font-semibold font-mono text-sm" style={{ color: "var(--text-primary)" }}>{result.nomor_pendaftaran}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
