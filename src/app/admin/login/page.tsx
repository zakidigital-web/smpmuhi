"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Lock, User, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("admin_logged_in") === "true") {
      window.location.href = "/admin";
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--section-alt)" }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--primary)" }} />
      </div>
    );
  }

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

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--section-alt)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "var(--primary)" }}>
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Admin Panel</h1>
          <p className="mt-2" style={{ color: "var(--text-secondary)" }}>SMP Muhammadiyah 1 Genteng</p>
        </div>

        <div className="rounded-2xl p-8 shadow-2xl" style={{ background: "var(--card)" }}>
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Masuk ke Dashboard</h2>

          {error && (
            <div className="flex items-center gap-2 text-sm p-3 rounded-lg mb-6" style={{ background: "color-mix(in srgb, var(--error) 10%, transparent)", color: "var(--error)" }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                  style={{ border: "1px solid var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }}
                  placeholder="Masukkan username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--text-muted)" }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                  style={{ border: "1px solid var(--card-border)", background: "var(--background)", color: "var(--text-primary)" }}
                  placeholder="Masukkan password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: "var(--primary)" }}
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</> : "Masuk"}
            </button>
          </form>

          <div className="mt-6 pt-6" style={{ borderTop: "1px solid var(--card-border)" }}>
            <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
              Default: admin / admin123
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm transition-colors" style={{ color: "var(--text-muted)" }}>
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
