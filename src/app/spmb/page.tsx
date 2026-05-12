import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, Award, Users, FileText, CheckCircle, ArrowRight, GraduationCap, Heart, Search } from "lucide-react";
import CekStatus from "@/components/CekStatus";

export const metadata: Metadata = {
  title: "SPMB - SMP Muhammadiyah 1 Genteng",
  description: "Informasi Seleksi Penerimaan Murid Baru SMP Muhammadiyah 1 Genteng tahun ajaran 2026/2027 - jalur pendaftaran, persyaratan, timeline, dan biaya pendidikan",
};

export default function SpmbPage() {
  const jalur = [
    {
      title: "Jalur Reguler",
      kuota: 90,
      deskripsi: "Untuk lulusan SD/MI dengan seleksi berdasarkan nilai rapor dan tes",
    },
    {
      title: "Jalur Prestasi",
      kuota: 30,
      deskripsi: "Untuk calon siswa dengan prestasi akademik/non-akademik (min. juara 3 tingkat kecamatan)",
    },
    {
      title: "Jalur Afirmasi",
      kuota: 20,
      deskripsi: "Untuk keluarga kurang mampu (penerima KIP/PKH) dan anak guru",
    },
  ];

  const persyaratan = [
    "Fotocopy Akta Kelahiran (2 lembar)",
    "Fotocopy Kartu Keluarga (2 lembar)",
    "Fotocopy Ijazah/Surat Keterangan Lulus SD/MI",
    "Fotocopy Raport Semester 1-5 (2 lembar)",
    "Pas Photo 3x4 (2 lembar) background merah",
    "NISN (Nomor Induk Siswa Nasional)",
    "Fotocopy KIP/PKH (jika ada)",
    "Surat Rekomendasi dari Sekolah Asal",
  ];

  return (
    <>
      {/* Hero */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "var(--secondary)" }}>
            <GraduationCap className="w-10 h-10" style={{ color: "var(--foreground)" }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 hero-gradient-text">SPMB 2026</h1>
          <p className="text-xl hero-gradient-sub max-w-2xl mx-auto">
            Seleksi Penerimaan Murid Baru SMP Muhammadiyah 1 Genteng Tahun Ajaran 2026/2027
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/spmb/daftar"
              className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-lg transition-all hover:shadow-xl"
              style={{ background: "var(--secondary)", color: "var(--foreground)" }}
            >
              Daftar Sekarang <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-12 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-xl p-6 shadow-lg border-t-4" style={{ background: "var(--card)", borderTopColor: "var(--accent)" }}>
              <Users className="w-10 h-10 mb-4" style={{ color: "var(--accent)" }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Total Kuota</h3>
              <p className="text-3xl font-bold" style={{ color: "var(--accent)" }}>140</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Siswa baru</p>
            </div>
            <div className="rounded-xl p-6 shadow-lg border-t-4" style={{ background: "var(--card)", borderTopColor: "var(--secondary)" }}>
              <Calendar className="w-10 h-10 mb-4" style={{ color: "var(--secondary)" }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Pendaftaran</h3>
              <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>1 Juni - 15 Juli 2026</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Senin - Sabtu, 07.30 - 14.00 WIB</p>
            </div>
            <div className="rounded-xl p-6 shadow-lg border-t-4" style={{ background: "var(--card)", borderTopColor: "var(--success)" }}>
              <Heart className="w-10 h-10 mb-4" style={{ color: "var(--success)" }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Gratis</h3>
              <p className="text-3xl font-bold" style={{ color: "var(--success)" }}>Rp 0</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Biaya pendaftaran</p>
            </div>
          </div>
        </div>
      </section>

      {/* Jalur SPMB */}
      <section className="py-16" style={{ background: "var(--section-alt)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Jalur Pendaftaran</h2>
            <p className="max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Tersedia 3 jalur pendaftaran yang bisa dipilih sesuai dengan kondisi Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {jalur.map((item, index) => (
              <div key={index} className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: "color-mix(in srgb, var(--primary) 12%, transparent)" }}>
                  <span className="font-bold" style={{ color: "var(--primary)" }}>{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                <p className="text-2xl font-bold mb-3" style={{ color: "var(--primary)" }}>Kuota: {item.kuota}</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{item.deskripsi}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Persyaratan + Timeline */}
      <section className="py-16" style={{ background: "var(--card)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Persyaratan</h2>
              <div className="space-y-3">
                {persyaratan.map((syarat, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--success)" }} />
                    <span style={{ color: "var(--text-secondary)" }}>{syarat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Timeline</h2>
              <div className="space-y-4">
                {[
                  { title: "Pendaftaran Online", date: "1 Juni - 15 Juli 2026", icon: FileText },
                  { title: "Tes Seleksi & Wawancara", date: "16 - 18 Juli 2026", icon: Clock },
                  { title: "Pengumuman Hasil", date: "20 Juli 2026", icon: Award },
                  { title: "Daftar Ulang", date: "21 - 23 Juli 2026", icon: CheckCircle },
                  { title: "Masa Ta'aruf", date: "24 - 25 Juli 2026", icon: Users },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-lg" style={{ background: "var(--section-alt)" }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--primary) 12%, transparent)" }}>
                      <item.icon className="w-5 h-5" style={{ color: "var(--primary)" }} />
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{item.title}</p>
                      <p className="text-sm" style={{ color: "var(--text-muted)" }}>{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cek Status */}
      <section className="py-16" style={{ background: "var(--section-alt)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "var(--primary)" }}>
              <Search className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
              Cek Status Pendaftaran
            </h2>
            <p className="max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Sudah mendaftar? Masukkan nomor pendaftaran untuk mengetahui status kelulusan
            </p>
          </div>
          <CekStatus />
        </div>
      </section>

      {/* Alur Pendaftaran */}
      <section className="py-16" style={{ background: "var(--card)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Alur Pendaftaran</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: "Daftar Online", desc: "Isi formulir pendaftaran secara online" },
              { step: 2, title: "Verifikasi Berkas", desc: "Serahkan berkas persyaratan ke sekolah" },
              { step: 3, title: "Tes & Wawancara", desc: "Ikuti tes akademik dan wawancara" },
              { step: 4, title: "Daftar Ulang", desc: "Konfirmasi penerimaan dan daftar ulang" },
            ].map((item, index) => (
              <div key={index} className="rounded-xl p-6 relative" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white font-bold text-lg" style={{ background: "var(--primary)" }}>
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Biaya */}
      <section className="py-16" style={{ background: "var(--section-alt)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Biaya Pendidikan</h2>
            <p className="max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Informasi biaya pendidikan untuk orang tua/wali calon siswa
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
              <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Biaya Masuk (Sekali)</h3>
              <ul className="space-y-2" style={{ color: "var(--text-secondary)" }}>
                <li className="flex justify-between"><span>Pendaftaran</span><span className="font-medium" style={{ color: "var(--success)" }}>Gratis</span></li>
                <li className="flex justify-between"><span>Dana Pengembangan</span><span className="font-medium" style={{ color: "var(--text-primary)" }}>Rp 500.000</span></li>
                <li className="flex justify-between"><span>Seragam & Perlengkapan</span><span className="font-medium" style={{ color: "var(--text-primary)" }}>Rp 350.000</span></li>
              </ul>
            </div>
            <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
              <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Biaya Bulanan</h3>
              <ul className="space-y-2" style={{ color: "var(--text-secondary)" }}>
                <li className="flex justify-between"><span>SPP</span><span className="font-medium" style={{ color: "var(--text-primary)" }}>Rp 150.000</span></li>
                <li className="flex justify-between"><span>Buku & LKS</span><span className="font-medium" style={{ color: "var(--text-primary)" }}>Rp 75.000</span></li>
                <li className="flex justify-between"><span>Kegiatan</span><span className="font-medium" style={{ color: "var(--text-primary)" }}>Rp 50.000</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 hero-gradient-text">Siap Mendaftar?</h2>
          <p className="hero-gradient-sub mb-8 max-w-2xl mx-auto">
            Segera daftarkan putra-putri Anda. Kuota terbatas, ayo daftar sekarang!
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
