"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Lock, User, AlertCircle, Loader2, Database, Activity, Globe, Check, X } from "lucide-react";
import Link from "next/link";

const TURSO_STORAGE_KEY = "turso_credentials";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [dbStatus, setDbStatus] = useState<boolean | null>(null);

  const [tursoUrl, setTursoUrl] = useState("");
  const [tursoToken, setTursoToken] = useState("");
  const [tursoLoading, setTursoLoading] = useState(false);
  const [tursoError, setTursoError] = useState("");
  const [tursoSuccess, setTursoSuccess] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("admin_logged_in") === "true") {
      window.location.href = "/admin";
      return;
    }
    checkDb();
    setChecking(false);
  }, []);

  async function checkDb() {
    try {
      const saved = localStorage.getItem(TURSO_STORAGE_KEY);
      if (saved) {
        const creds = JSON.parse(saved);
        setTursoUrl(creds.url);
        setTursoToken(creds.authToken);
        await setupTurso(creds.url, creds.authToken, true);
        return;
      }
      const res = await fetch("/api/settings");
      setDbStatus(res.ok);
    } catch {
      setDbStatus(false);
    }
  }

  async function setupTurso(url: string, token: string, silent = false) {
    if (!silent) setTursoLoading(true);
    setTursoError("");
    setTursoSuccess(false);
    try {
      const res = await fetch("/api/database-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, authToken: token }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (!silent) setTursoError(data.error || "Gagal setup database");
        return false;
      }
      localStorage.setItem(TURSO_STORAGE_KEY, JSON.stringify({ url, authToken: token }));
      if (!silent) setTursoSuccess(true);
      setDbStatus(true);
      return true;
    } catch {
      if (!silent) setTursoError("Terjadi kesalahan. Periksa URL dan Token.");
      return false;
    } finally {
      if (!silent) setTursoLoading(false);
    }
  }

  const handleTursoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await setupTurso(tursoUrl, tursoToken, false);
  };

  const clearTurso = () => {
    localStorage.removeItem(TURSO_STORAGE_KEY);
    setTursoUrl("");
    setTursoToken("");
    setTursoSuccess(false);
    setDbStatus(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Username atau password salah");
      } else {
        localStorage.setItem("admin_logged_in", "true");
        window.location.href = "/admin";
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--section-alt)" }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--primary)" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: "var(--section-alt)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "var(--primary)" }}>
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Admin Panel</h1>
          <p className="mt-2" style={{ color: "var(--text-secondary)" }}>SMP Muhammadiyah 1 Genteng</p>
        </div>

        {/* Setup Database */}
        {dbStatus === false && (
          <div className="rounded-2xl p-6 mb-6" style={{ background: "color-mix(in srgb, var(--error) 8%, var(--card))", border: "1px solid color-mix(in srgb, var(--error) 30%, transparent)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5" style={{ color: "var(--error)" }} />
              <h2 className="font-bold" style={{ color: "var(--error)" }}>Setup Database</h2>
            </div>
            <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
              Database tidak terdeteksi. Jika menggunakan Turso (database cloud), masukkan kredensial di bawah.
            </p>
            <form onSubmit={handleTursoSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Database URL</label>
                <input value={tursoUrl} onChange={(e) => setTursoUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2"
                  style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }}
                  placeholder="libsql://my-db.turso.io" required />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Auth Token</label>
                <input value={tursoToken} onChange={(e) => setTursoToken(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2"
                  style={{ borderColor: "var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }}
                  placeholder="eyJhbGciOiJIUzI1NiIs..." required />
              </div>
              {tursoError && (
                <div className="flex items-center gap-1 text-xs p-2 rounded-lg" style={{ background: "color-mix(in srgb, var(--error) 10%, transparent)", color: "var(--error)" }}>
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{tursoError}
                </div>
              )}
              {tursoSuccess && (
                <div className="flex items-center gap-1 text-xs p-2 rounded-lg" style={{ background: "color-mix(in srgb, var(--success) 10%, transparent)", color: "var(--success)" }}>
                  <Check className="w-3.5 h-3.5 flex-shrink-0" />Database berhasil dikonfigurasi!
                </div>
              )}
              <button type="submit" disabled={tursoLoading}
                className="w-full font-semibold py-2.5 rounded-xl text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: "var(--primary)", color: "white" }}>
                {tursoLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Menghubungkan...</> : <><Globe className="w-4 h-4" /> Setup Turso Database</>}
              </button>
            </form>
          </div>
        )}

        {/* Login Card */}
        <div className="rounded-2xl p-8 shadow-2xl" style={{ background: "var(--card)" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Masuk ke Dashboard</h2>
            {dbStatus === true && !localStorage.getItem(TURSO_STORAGE_KEY) && (
              <div className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg" style={{ background: "color-mix(in srgb, var(--success) 10%, transparent)" }}>
                <Database className="w-3.5 h-3.5" style={{ color: "var(--success)" }} />
                <span style={{ color: "var(--success)" }}>Lokal</span>
              </div>
            )}
            {dbStatus === true && localStorage.getItem(TURSO_STORAGE_KEY) && (
              <button onClick={clearTurso} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors" style={{ background: "color-mix(in srgb, var(--primary) 10%, transparent)", color: "var(--primary)" }}>
                <Globe className="w-3.5 h-3.5" />
                Turso
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm p-3 rounded-lg mb-6" style={{ background: "color-mix(in srgb, var(--error) 10%, transparent)", color: "var(--error)" }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {dbStatus === false ? (
            <div className="text-center py-6">
              <AlertCircle className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--error)" }} />
              <p className="text-sm font-medium" style={{ color: "var(--error)" }}>Database Tidak Terkoneksi</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Setup database Turso di atas untuk melanjutkan</p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--text-muted)" }} />
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                    style={{ border: "1px solid var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }}
                    placeholder="Masukkan username" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--text-muted)" }} />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                    style={{ border: "1px solid var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }}
                    placeholder="Masukkan password" required />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: "var(--primary)" }}>
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</> : "Masuk"}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6" style={{ borderTop: "1px solid var(--card-border)" }}>
            <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
              Default: admin / admin123
            </p>
          </div>
        </div>

        {/* DB Status */}
        <div className="mt-4">
          <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm" style={{
            background: dbStatus === true
              ? "color-mix(in srgb, var(--success) 10%, transparent)"
              : dbStatus === false
                ? "color-mix(in srgb, var(--error) 10%, transparent)"
                : "var(--card)",
          }}>
            {dbStatus === true ? (
              <><Database className="w-4 h-4" style={{ color: "var(--success)" }} /><span className="font-medium" style={{ color: "var(--success)" }}>Database Terkoneksi</span></>
            ) : dbStatus === false ? (
              <><Activity className="w-4 h-4" style={{ color: "var(--error)" }} /><span className="font-medium" style={{ color: "var(--error)" }}>Database Tidak Terkoneksi</span></>
            ) : (
              <><Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--text-muted)" }} /><span style={{ color: "var(--text-muted)" }}>Memeriksa koneksi database...</span></>
            )}
          </div>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-sm transition-colors" style={{ color: "var(--text-muted)" }}>
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
