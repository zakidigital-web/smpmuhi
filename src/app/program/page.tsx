import type { Metadata } from "next";
import { BookOpen, GraduationCap, Book, Pen, Shield, Palette, Mic, Users, Globe, Medal, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Program & Eskul - SMP Muhammadiyah 1 Genteng",
  description: "Program unggulan dan ekstrakurikuler SMP Muhammadiyah 1 Genteng - keagamaan, kurikulum merdeka, pengembangan karakter, dan 8 ekskul menarik",
};

const programs = [
  {
    title: "Program Keagamaan",
    icon: Book,
    desc: "Fokus pada pendalaman Al-Qur&apos;an, tahfidz, sholat berjamaah, kajian Islam, dan pembiasaan akhlak mulia setiap hari.",
    items: [
      "Tahfidz Al-Qur&apos;an (target 2 juz)",
      "Sholat Dhuha & Dhuhur berjamaah",
      "Kajian Islam setiap Jumat",
      "Peringatan hari besar Islam",
      "Pesantren kilat Ramadhan",
    ],
  },
  {
    title: "Kurikulum Merdeka",
    icon: BookOpen,
    desc: "Pembelajaran berbasis proyek yang mengembangkan kreativitas, berpikir kritis, dan kemandirian siswa.",
    items: [
      "Projek Penguatan Profil Pelajar Pancasila",
      "Pembelajaran berdiferensiasi",
      "Asesmen formatif & sumatif",
      "Pengembangan literasi & numerasi",
      "Kokurikuler terintegrasi",
    ],
  },
  {
    title: "Pengembangan Karakter",
    icon: Users,
    desc: "Pembentukan akhlak mulia dan disiplin positif melalui budaya sekolah yang Islami.",
    items: [
      "Budaya 5S (Senyum, Salam, Sapa, Sopan, Santun)",
      "Tata tertib dan disiplin positif",
      "Jumat bersih dan sehat",
      "Bakti sosial masyarakat",
      "Program anti bullying",
    ],
  },
];

const ekskuls = [
  { title: "Tapak Suci", icon: Shield, desc: "Bela diri seni dan olahraga" },
  { title: "Hizbul Wathan", icon: Users, desc: "Kepanduan Muhammadiyah" },
  { title: "Marching Band", icon: Mic, desc: "Seni musik baris-berbaris" },
  { title: "Pidato (Muhadhoroh)", icon: Mic, desc: "Public speaking Islami" },
  { title: "Kaligrafi", icon: Pen, desc: "Seni menulis Arab" },
  { title: "Mural & Melukis", icon: Palette, desc: "Seni rupa dan kreativitas" },
  { title: "Olahraga", icon: Medal, desc: "Catur, voli, atletik" },
  { title: "IPM", icon: Globe, desc: "Organisasi siswa Muhammadiyah" },
];

export default function ProgramPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 hero-gradient-text">Program & Ekstrakurikuler</h1>
          <p className="text-xl hero-gradient-sub max-w-2xl mx-auto">
            Pengembangan akademik dan non-akademik untuk membentuk generasi unggul
          </p>
        </div>
      </section>

      {/* Program Unggulan */}
      <section className="py-16 bg-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Program Unggulan</h2>
            <p className="max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Tiga program utama yang menjadi ciri khas SMP Muhammadiyah 1 Genteng
            </p>
          </div>

          <div className="space-y-8">
            {programs.map((program, index) => (
              <div key={index} className="rounded-2xl overflow-hidden shadow-sm" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
                <div className="grid md:grid-cols-3">
                  <div className="p-8 text-white flex flex-col justify-center" style={{ background: "linear-gradient(135deg, var(--primary), #0D3B0E)" }}>
                    <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                      <program.icon className="w-10 h-10" />
                    </div>
                    <div className="text-2xl font-bold">{program.title}</div>
                  </div>

                  <div className="p-8 md:col-span-2">
                    <p className="mb-6" style={{ color: "var(--text-secondary)" }}>{program.desc}</p>
                    <ul className="space-y-2">
                      {program.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                          <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "var(--primary)" }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ekstrakurikuler */}
      <section className="py-16 bg-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Ekstrakurikuler</h2>
            <p className="max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Kegiatan ekstrakurikuler untuk mengembangkan bakat dan minat siswa
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ekskuls.map((ekskul, index) => (
              <div key={index} className="rounded-xl p-6 shadow-sm card-hover text-center" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: "color-mix(in srgb, var(--primary) 10%, transparent)" }}>
                  <ekskul.icon className="w-7 h-7" style={{ color: "var(--primary)" }} />
                </div>
                <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{ekskul.title}</h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{ekskul.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Tertarik Bergabung?</h2>
          <p className="mb-8 max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Daftarkan putra-putri Anda di SMP Muhammadiyah 1 Genteng dan dapatkan pendidikan terbaik
          </p>
          <Link
            href="/spmb/daftar"
            className="inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-lg transition-all hover:shadow-xl"
            style={{ background: "var(--secondary)", color: "var(--foreground)" }}
          >
            Daftar Sekarang <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}