"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, MapPin, Phone, Mail, Lock } from "lucide-react";

const defaults = {
  schoolName: "SMP Muhammadiyah 1 Genteng",
  shortName: "SMP Mutiara Genteng",
  tagline: "Unggul, Islami, Berkemajuan",
  address: "Jl. Temuguruh No.58, Genteng Wetan, Kec. Genteng, Kab. Banyuwangi, Jawa Timur 68465",
  phone: "(0333) 845554",
  email: "smpmuhammadiyah1genteng@gmail.com",
  instagram: "smpmuhammadiyah1genteng",
  facebook: "smpmutiaragenteng",
  youtube: "@smpmuhammadiyah1genteng",
};

export default function Footer() {
  const [s, setS] = useState(defaults);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === "object") {
          setS((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer style={{ background: "var(--foreground)", color: "var(--text-secondary)", paddingBottom: "max(2rem, env(safe-area-inset-bottom, 0px))" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "var(--secondary)" }}>
                <GraduationCap className="w-6 h-6" style={{ color: "var(--foreground)" }} />
              </div>
              <div>
                <span className="font-bold text-xl" style={{ color: "var(--background)" }}>{s.schoolName}</span>
                <br />
                <span className="text-sm font-semibold" style={{ color: "var(--secondary)" }}>{s.shortName} - {s.tagline}</span>
              </div>
            </div>
            <p className="mb-4 max-w-md" style={{ color: "var(--text-muted)" }}>
              Sekolah menengah pertama unggulan di bawah naungan Muhammadiyah, berkomitmen mencetak generasi berakhlak mulia, berilmu, dan berkemajuan.
            </p>
            <div className="flex gap-4">
              <a href={`https://facebook.com/${s.facebook}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ background: "var(--card)", color: "var(--text-secondary)" }} aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href={`https://instagram.com/${s.instagram}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ background: "var(--card)", color: "var(--text-secondary)" }} aria-label="Instagram">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <a href={`https://youtube.com/${s.youtube}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ background: "var(--card)", color: "var(--text-secondary)" }} aria-label="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: "var(--background)" }}>Link Cepat</h4>
            <ul className="space-y-2" style={{ color: "var(--text-muted)" }}>
              <li><Link href="/" className="transition-colors" style={{ color: "var(--text-muted)" }}>Beranda</Link></li>
              <li><Link href="/profil" className="transition-colors" style={{ color: "var(--text-muted)" }}>Profil Sekolah</Link></li>
              <li><Link href="/program" className="transition-colors" style={{ color: "var(--text-muted)" }}>Program & Eskul</Link></li>
              <li><Link href="/berita" className="transition-colors" style={{ color: "var(--text-muted)" }}>Berita</Link></li>
              <li><Link href="/agenda" className="transition-colors" style={{ color: "var(--text-muted)" }}>Agenda</Link></li>
              <li><Link href="/galeri" className="transition-colors" style={{ color: "var(--text-muted)" }}>Galeri</Link></li>
              <li><Link href="/spmb" className="transition-colors" style={{ color: "var(--text-muted)" }}>SPMB Online</Link></li>
              <li className="pt-1"><Link href="/admin/login" className="inline-flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}><Lock className="w-3 h-3" /> Panel Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: "var(--background)" }}>Kontak Kami</h4>
            <ul className="space-y-3" style={{ color: "var(--text-muted)" }}>
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--secondary)" }} />
                <span>{s.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 flex-shrink-0" style={{ color: "var(--secondary)" }} />
                <span>{s.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 flex-shrink-0" style={{ color: "var(--secondary)" }} />
                <span>{s.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 text-center" style={{ borderTop: "1px solid var(--card-border)", color: "var(--text-muted)" }}>
          <p>&copy; {new Date().getFullYear()} {s.schoolName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
