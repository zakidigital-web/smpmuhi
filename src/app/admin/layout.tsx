"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Newspaper, Image, SlidersHorizontal, Settings, LogOut, Menu, X, ChevronRight, GraduationCap, Database, HardDrive, Activity, CalendarDays, UserCheck, Sun, Moon, MessageSquare } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const sidebarItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/hero", label: "Hero Slider", icon: SlidersHorizontal },
  { href: "/admin/berita", label: "Berita", icon: Newspaper },
  { href: "/admin/komentar", label: "Komentar", icon: MessageSquare },
  { href: "/admin/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/admin/galeri", label: "Galeri", icon: Image },
  { href: "/admin/spmb", label: "SPMB", icon: UserCheck },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
  { href: "/admin/backup", label: "Backup & Restore", icon: HardDrive },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ status: string; dbSize: string; totalRows: number } | null>(null);
  const [siteName, setSiteName] = useState("SMP Muhammadiyah 1 Genteng");

  useEffect(() => {
    const loggedIn = localStorage.getItem("admin_logged_in") === "true";
    setIsLoggedIn(loggedIn);
    setMounted(true);
    fetch("/api/stats").then((r) => r.json()).then(setDbStatus).catch(() => {});
    fetch("/api/settings").then((r) => r.json()).then((data) => {
      if (data?.schoolName) setSiteName(data.schoolName);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (pathname !== "/admin/login" && !isLoggedIn) {
      router.replace("/admin/login");
    }
  }, [mounted, isLoggedIn, pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!mounted || !isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--section-alt)" }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Memeriksa akses...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    setIsLoggedIn(false);
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: "var(--section-alt)" }}>
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-16" style={{ background: "var(--card)", borderBottom: "1px solid var(--card-border)" }}>
        <Link href="/admin" className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6" style={{ color: "var(--primary)" }} />
          <span className="font-bold" style={{ color: "var(--text-primary)" }}>Admin Panel</span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2" style={{ color: "var(--text-secondary)" }}>
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed md:sticky top-0 left-0 z-50 md:z-auto
        w-72 h-full md:h-screen
        transform transition-transform duration-200
        flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `} style={{ background: "var(--card)", borderRight: "1px solid var(--card-border)" }}>
        <div className="p-6" style={{ borderBottom: "1px solid var(--card-border)" }}>
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--primary)" }}>
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold" style={{ color: "var(--text-primary)" }}>Admin Panel</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>{siteName}</div>
            </div>
          </Link>
        </div>

        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs" style={{ background: dbStatus ? "color-mix(in srgb, var(--success) 10%, transparent)" : "color-mix(in srgb, var(--error) 10%, transparent)" }}>
            {dbStatus ? (
              <><Database className="w-3.5 h-3.5" style={{ color: "var(--success)" }} /><span className="font-medium" style={{ color: "var(--success)" }}>Database Terkoneksi</span></>
            ) : (
              <><Activity className="w-3.5 h-3.5" style={{ color: "var(--error)" }} /><span className="font-medium" style={{ color: "var(--error)" }}>Mengecek koneksi...</span></>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                style={isActive ? { background: "var(--primary)", color: "white" } : { color: "var(--text-secondary)" }}
              >
                <Icon className="w-5 h-5" />
                {item.label}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4" style={{ borderTop: "1px solid var(--card-border)" }}>
          {dbStatus && (
            <div className="flex items-center justify-between px-4 py-2 text-xs" style={{ color: "var(--text-muted)" }}>
              <span>Ukuran DB: {dbStatus.dbSize}</span>
              <span>{dbStatus.totalRows} baris</span>
            </div>
          )}
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: "var(--section-alt)", color: "var(--text-secondary)" }}>A</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>Administrator</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>admin@sch.id</div>
            </div>
          </div>
          <button onClick={toggle}
            className="flex items-center gap-2 w-full px-4 py-3 text-sm rounded-xl transition-colors mt-1"
            style={{ color: "var(--text-secondary)" }}>
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            {theme === "light" ? "Mode Gelap" : "Mode Terang"}
          </button>
          <button onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-3 text-sm rounded-xl transition-colors mt-1"
            style={{ color: "var(--error)" }}>
            <LogOut className="w-4 h-4" /> Keluar
          </button>
          <Link href="/"
            className="flex items-center gap-2 w-full px-4 py-3 text-sm rounded-xl transition-colors mt-1"
            style={{ color: "var(--text-secondary)" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
            Kembali ke Website
          </Link>
        </div>
      </aside>

      <main className="flex-1 pt-16 md:pt-0 min-h-screen">
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
