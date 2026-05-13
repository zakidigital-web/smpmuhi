"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, School, BookOpen, Image, GraduationCap, Sun, Moon, Grid, User, Shield, Mail, Lock, CalendarDays } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import DraggableSheet from "./DraggableSheet";

const desktopLinks = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/program", label: "Program & Eskul" },
  { href: "/berita", label: "Berita" },
  { href: "/galeri", label: "Galeri" },
  { href: "/spmb", label: "SPMB" },
  { href: "/kontak", label: "Kontak" },
  { href: "/agenda", label: "Agenda" },
];

const bottomMain = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/berita", label: "Berita", icon: BookOpen },
  { href: "/galeri", label: "Galeri", icon: Image },
  { href: "/spmb", label: "SPMB", icon: School },
];

const bottomMoreLinks = [
  { href: "/profil", label: "Profil", icon: User },
  { href: "/program", label: "Program & Eskul", icon: Shield },
  { href: "/kontak", label: "Kontak", icon: Mail },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/admin/login", label: "Panel Admin", icon: Lock },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [schoolName, setSchoolName] = useState("SMP Muhammadiyah 1");
  const [schoolSub, setSchoolSub] = useState("Genteng");
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data?.shortName) {
          const parts = data.shortName.split(" ");
          setSchoolName(parts.slice(0, -1).join(" ") || data.shortName);
          setSchoolSub(parts[parts.length - 1] || "");
        } else if (data?.schoolName) {
          setSchoolName(data.schoolName);
          setSchoolSub("");
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Desktop & Tablet Navbar */}
      <nav className="fixed top-0 w-full z-50 hidden md:block noselect" style={{ background: "var(--nav-bg)", borderBottom: "1px solid var(--nav-border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 tap-opacity">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--primary)" }}>
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg leading-tight">
                <span className="font-bold text-xl block -mb-1" style={{ color: "var(--text-primary)" }}>{schoolName}</span>
                {schoolSub && <span className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>{schoolSub}</span>}
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-6">
              {desktopLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors tap-scale py-1 ${
                    pathname === link.href ? "" : ""
                  }`}
                  style={{
                    color: pathname === link.href ? "var(--primary)" : "var(--text-secondary)",
                    borderBottom: pathname === link.href ? "2px solid var(--primary)" : "2px solid transparent",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/login"
                className="hidden lg:flex items-center gap-1 text-xs font-medium transition-colors tap-opacity"
                style={{ color: "var(--text-muted)" }}
              >
                <Lock className="w-3 h-3" /> Admin
              </Link>

              <div className="lg:hidden flex items-center gap-4">
                {desktopLinks.slice(0, 4).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium transition-colors tap-scale"
                    style={{
                      color: pathname === link.href ? "var(--primary)" : "var(--text-secondary)",
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <button
                onClick={toggle}
                className="p-2 rounded-lg transition-colors tap-scale"
                style={{ color: "var(--text-secondary)" }}
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              <Link
                href="/spmb/daftar"
                className="font-semibold px-5 py-2.5 rounded-lg transition-all hover:shadow-lg text-sm tap-scale"
                style={{ background: "var(--secondary)", color: "#0F172A" }}
              >
                Daftar Sekarang
              </Link>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 tap-scale"
                style={{ color: "var(--text-secondary)" }}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden shadow-lg" style={{ borderColor: "var(--nav-border)", background: "var(--card)", borderTop: "1px solid var(--nav-border)" }}>
            <div className="px-4 py-3 space-y-1">
              {desktopLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-2.5 px-3 rounded-lg text-sm font-medium transition-colors tap-scale"
                  style={{
                    color: pathname === link.href ? "var(--primary)" : "var(--text-secondary)",
                    background: pathname === link.href ? "color-mix(in srgb, var(--primary) 10%, transparent)" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/spmb/daftar"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center font-semibold px-5 py-2.5 rounded-lg mt-3 tap-scale"
                style={{ background: "var(--secondary)", color: "#0F172A" }}
              >
                Daftar Sekarang
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Top Bar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 noselect" style={{ background: "var(--nav-bg)", borderBottom: "1px solid var(--nav-border)", paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <div className="flex items-center justify-between px-4" style={{ height: "var(--nav-height-mobile)" }}>
          <Link href="/" className="flex items-center gap-2 tap-opacity">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--primary)" }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              {schoolName}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors tap-scale"
              style={{ color: "var(--text-secondary)" }}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <Link
              href="/spmb/daftar"
              className="font-semibold text-xs px-3 py-1.5 rounded-lg transition-all tap-scale"
              style={{ background: "var(--secondary)", color: "#0F172A" }}
            >
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 noselect" style={{ background: "var(--nav-bg)", borderTop: "1px solid var(--nav-border)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="flex items-center justify-around" style={{ height: "var(--bottom-nav-height)" }}>
          {bottomMain.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center gap-0.5 px-3 py-1 min-w-0 tap-scale"
                style={{ color: isActive ? "var(--primary)" : "var(--text-muted)" }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => setShowMore(true)}
            className="flex flex-col items-center justify-center gap-0.5 px-3 py-1 min-w-0 tap-scale"
            style={{ color: "var(--text-muted)" }}
          >
            <Grid className="w-5 h-5" />
            <span className="text-[10px] font-medium">Lainnya</span>
          </button>
        </div>
      </nav>

      {/* Draggable "Lainnya" bottom sheet */}
      <DraggableSheet open={showMore} onClose={() => setShowMore(false)} title="Menu Lainnya">
        <div className="space-y-1">
          {bottomMoreLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setShowMore(false)}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-colors tap-scale"
                style={{
                  color: isActive ? "var(--primary)" : "var(--text-secondary)",
                  background: isActive ? "color-mix(in srgb, var(--primary) 10%, transparent)" : "transparent",
                }}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </DraggableSheet>

      {/* Spacers */}
      <div className="md:hidden" style={{ height: "var(--nav-height-mobile)" }} />
      <div className="md:hidden" style={{ height: "var(--bottom-nav-height)" }} />
    </>
  );
}
