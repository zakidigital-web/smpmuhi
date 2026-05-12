"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Newspaper, Image, SlidersHorizontal, Settings, Users, FileText, Eye, ArrowRight, Database, HardDrive, Activity, BarChart3, CalendarDays, UserCheck } from "lucide-react";

export default function AdminDashboard() {
  const [greeting, setGreeting] = useState("");
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Selamat Pagi");
    else if (hour < 15) setGreeting("Selamat Siang");
    else if (hour < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");

    fetch("/api/stats").then((r) => r.json()).then(setStats).catch(() => {});
  }, []);

  const statCards = [
    { label: "Hero Slides", value: stats?.tables?.hero ?? "...", icon: SlidersHorizontal, href: "/admin/hero" },
    { label: "Berita", value: stats?.tables?.berita ?? "...", icon: Newspaper, href: "/admin/berita" },
    { label: "Agenda", value: stats?.tables?.agenda ?? "...", icon: CalendarDays, href: "/admin/agenda" },
    { label: "Galeri", value: stats?.tables?.galeri ?? "...", icon: Image, href: "/admin/galeri" },
    { label: "SPMB", value: stats?.tables?.spmb ?? "...", icon: UserCheck, href: "/admin/spmb" },
    { label: "Pengaturan", value: stats?.tables?.settings ?? "...", icon: Settings, href: "/admin/settings" },
  ];

  const recentNews = [];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>{greeting}, Admin</h1>
            <p className="mt-1" style={{ color: "var(--text-secondary)" }}>Selamat datang di panel administrasi website sekolah.</p>
          </div>

          {/* DB Status Badge */}
          {stats && (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ background: "color-mix(in srgb, var(--success) 10%, transparent)" }}>
              <Database className="w-4 h-4" style={{ color: "var(--success)" }} />
              <span className="font-medium" style={{ color: "var(--success)" }}>DB Online</span>
              <span className="text-xs ml-1" style={{ color: "color-mix(in srgb, var(--success) 60%, transparent)" }}>{stats.dbSize}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href}
              className="rounded-xl p-6 transition-all group" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--primary) 10%, transparent)" }}>
                  <Icon className="w-6 h-6" style={{ color: "var(--primary)" }} />
                </div>
                <ArrowRight className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
              </div>
              <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{card.value}</div>
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{card.label}</div>
            </Link>
          );
        })}
      </div>

      {/* Database Analytics */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5" style={{ color: "var(--primary)" }} />
            <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>Database Analytics</h2>
          </div>
          {stats ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm py-2" style={{ borderBottom: "1px solid var(--card-border)" }}>
                <span style={{ color: "var(--text-secondary)" }}>Total Baris Data</span>
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{stats.totalRows}</span>
              </div>
              <div className="flex justify-between text-sm py-2" style={{ borderBottom: "1px solid var(--card-border)" }}>
                <span style={{ color: "var(--text-secondary)" }}>Ukuran Database</span>
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{stats.dbSize}</span>
              </div>
              <div className="flex justify-between text-sm py-2" style={{ borderBottom: "1px solid var(--card-border)" }}>
                <span style={{ color: "var(--text-secondary)" }}>Mesin Database</span>
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{stats.engine}</span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span style={{ color: "var(--text-secondary)" }}>Status Koneksi</span>
                <span className="flex items-center gap-1 font-semibold" style={{ color: "var(--success)" }}>
                  <Activity className="w-3.5 h-3.5" /> {stats.status}
                </span>
              </div>
              {stats.categories && stats.categories.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>KATEGORI BERITA</p>
                  {stats.categories.map((c: any, i: number) => (
                    <div key={i} className="flex justify-between text-xs py-1">
                      <span style={{ color: "var(--text-secondary)" }}>{c.category}</span>
                      <span className="font-medium" style={{ color: "var(--text-primary)" }}>{c.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Memuat data...</p>
          )}
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <Link href="/admin/backup" className="rounded-xl p-6 flex items-center gap-4 transition-all" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--primary) 10%, transparent)" }}>
              <HardDrive className="w-6 h-6" style={{ color: "var(--primary)" }} />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Backup & Restore</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Backup atau restore database sekolah</p>
            </div>
          </Link>
          <Link href="/admin/hero" className="rounded-xl p-6 flex items-center gap-4 transition-all" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--primary) 10%, transparent)" }}>
              <Eye className="w-6 h-6" style={{ color: "var(--primary)" }} />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Kelola Hero Slider</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Atur slide banner halaman utama</p>
            </div>
          </Link>
          <Link href="/admin/agenda" className="rounded-xl p-6 flex items-center gap-4 transition-all" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--primary) 10%, transparent)" }}>
              <CalendarDays className="w-6 h-6" style={{ color: "var(--primary)" }} />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Kelola Agenda</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Atur jadwal kegiatan sekolah</p>
            </div>
          </Link>
          <Link href="/admin/settings" className="rounded-xl p-6 flex items-center gap-4 transition-all" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--primary) 10%, transparent)" }}>
              <Settings className="w-6 h-6" style={{ color: "var(--primary)" }} />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Pengaturan Website</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Ubah informasi dan profil sekolah</p>
            </div>
          </Link>
        </div>
      </div>

      {/* SEO Info */}
      <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
        <h2 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>SEO Website</h2>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="p-4 rounded-lg" style={{ background: "var(--section-alt)" }}>
            <p className="font-medium" style={{ color: "var(--text-primary)" }}>Sitemap</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>/sitemap.xml</p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: "var(--section-alt)" }}>
            <p className="font-medium" style={{ color: "var(--text-primary)" }}>Robots.txt</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>/robots.txt</p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: "var(--section-alt)" }}>
            <p className="font-medium" style={{ color: "var(--text-primary)" }}>Meta Tags</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Semua halaman</p>
          </div>
        </div>
      </div>
    </div>
  );
}
