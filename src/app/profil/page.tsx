import type { Metadata } from "next";
import { GraduationCap, Target, Eye, Award, Users } from "lucide-react";
import DataIdentitasSekolah from "@/components/DataIdentitasSekolah";

export const metadata: Metadata = {
  title: "Profil - SMP Muhammadiyah 1 Genteng",
  description: "Profil lengkap SMP Muhammadiyah 1 Genteng Banyuwangi - identitas sekolah, sejarah, visi misi, data siswa & guru, dan prestasi terkini",
};

export default function ProfilPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 hero-gradient-text">Profil Sekolah</h1>
          <p className="text-xl hero-gradient-sub max-w-2xl mx-auto">
            Mengenal lebih dekat SMP Muhammadiyah 1 Genteng
          </p>
        </div>
      </section>

      <section className="py-16 bg-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DataIdentitasSekolah />
        </div>
      </section>

      {/* Sejarah */}
      <section className="py-16" style={{ background: "var(--section-alt)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: "var(--text-primary)" }}>Sejarah Singkat</h2>
            <div className="rounded-xl p-8 shadow-sm" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
              <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
                SMP Muhammadiyah 1 Genteng didirikan pada tanggal 6 Mei 1978 berdasarkan SK Pendirian No. 1310/II-01/Jtm-53/1978. Sekolah ini berdiri di bawah naungan Yayasan Pimpinan Daerah Muhammadiyah (PDM) Kabupaten Banyuwangi.
              </p>
              <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
                Sejak awal berdirinya, SMP Muhammadiyah 1 Genteng telah berkomitmen untuk memberikan pendidikan berkualitas yang memadukan ilmu pengetahuan umum dengan nilai-nilai keislaman. Berbekal pengalaman lebih dari 4 dekade, sekolah ini telah melahirkan ribuan alumni yang sukses di berbagai bidang.
              </p>
              <p style={{ color: "var(--text-secondary)" }}>
                Dengan akreditasi A dan luas tanah 2.550 m&sup2;, sekolah ini terus berkembang dan berbenah untuk memberikan fasilitas dan layanan pendidikan terbaik bagi masyarakat Banyuwangi dan sekitarnya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="py-16 bg-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="rounded-xl p-8" style={{ background: "color-mix(in srgb, var(--success) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--success) 20%, transparent)" }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ background: "var(--primary)" }}>
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Visi</h3>
              <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                &quot;Terwujudnya peserta didik yang berakhlak mulia, berilmu, dan berkemajuan berdasarkan nilai-nilai Islam yang rahmatan lil &apos;alamin.&quot;
              </p>
            </div>

            <div className="rounded-xl p-8" style={{ background: "color-mix(in srgb, var(--accent) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ background: "var(--accent)" }}>
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Misi</h3>
              <ul className="space-y-3" style={{ color: "var(--text-secondary)" }}>
                <li className="flex items-start gap-3">
                  <Award className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: "var(--success)" }} />
                  <span>Menyelenggarakan pendidikan yang berorientasi pada pembentukan akhlak mulia</span>
                </li>
                <li className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: "var(--success)" }} />
                  <span>Mengembangkan potensi akademik dan non-akademik peserta didik secara optimal</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: "var(--success)" }} />
                  <span>Menciptakan lingkungan belajar yang Islami, kondusif, dan inovatif</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Prestasi */}
      <section className="py-16" style={{ background: "var(--section-alt)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: "var(--text-primary)" }}>Prestasi Terkini</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Juara 1 Pidato", tahun: "2018", tingkat: "Kecamatan" },
              { title: "Juara 1 Catur", tahun: "2018", tingkat: "Kabupaten" },
              { title: "Juara 1 Marching Band", tahun: "2017", tingkat: "Kabupaten" },
              { title: "Juara 1 Tapak Suci", tahun: "2017", tingkat: "Kabupaten" },
              { title: "Juara 1 Majorette", tahun: "2017", tingkat: "Kabupaten" },
              { title: "Juara 3 Kaligrafi", tahun: "2018", tingkat: "Sekolah" },
            ].map((prestasi, index) => (
              <div key={index} className="rounded-xl p-6 text-center shadow-sm card-hover" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "var(--secondary)" }}>
                  <Award className="w-8 h-8" style={{ color: "var(--foreground)" }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{prestasi.title}</h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{prestasi.tingkat} &bull; {prestasi.tahun}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}