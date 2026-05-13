import Link from "next/link";
import { Users, Award, GraduationCap, BookOpen, ArrowRight, Calendar, Clock, CheckCircle, Star, Newspaper, Camera } from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import UpcomingAgenda from "@/components/UpcomingAgenda";
import FasilitasSection from "@/components/FasilitasSection";
import { heroSlides } from "@/data/hero";
import { beritaList } from "@/data/berita";
import { galeriList } from "@/data/galeri";

export default function Home() {
  const latestNews = beritaList.slice(0, 5);
  const latestGallery = galeriList.slice(0, 4);

  return (
    <>
      <HeroSlider slides={heroSlides} />

      {/* Sambutan Kepala Sekolah */}
      <section className="py-16 md:py-24 bg-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Foto / Placeholder - proportional */}
            <div className="relative mx-auto w-full max-w-sm">
              <div className="aspect-[4/5] rounded-2xl flex flex-col items-center justify-center" style={{ background: "color-mix(in srgb, var(--primary) 8%, var(--card))" }}>
                <GraduationCap className="w-24 h-24" style={{ color: "color-mix(in srgb, var(--primary) 50%, transparent)" }} />
                <span className="mt-3 text-sm font-medium" style={{ color: "color-mix(in srgb, var(--primary) 35%, transparent)" }}>Kepala Sekolah</span>
              </div>
              {/* Akreditasi badge */}
              <div className="absolute -bottom-3 -right-3 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2" style={{ background: "var(--secondary)", color: "var(--foreground)" }}>
                <Award className="w-6 h-6" />
                <div>
                  <div className="text-xl font-bold leading-none">A</div>
                  <div className="text-[11px] font-medium leading-tight">Akreditasi</div>
                </div>
              </div>
            </div>

            {/* Sambutan text */}
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
                Sambutan Kepala Sekolah
              </h2>
              <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
                Assalamu&apos;alaikum Wr. Wb.
              </p>
              <p className="mb-3 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Puji syukur ke hadirat Allah SWT yang telah memberikan rahmat dan karunia-Nya sehingga kita dapat bersilaturahmi melalui website ini.
              </p>
              <p className="mb-3 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                SMP Muhammadiyah 1 Genteng berkomitmen untuk memberikan pendidikan terbaik yang berlandaskan nilai-nilai Islam, dengan program unggulan keagamaan, kurikulum Merdeka, dan tenaga pengajar yang kompeten.
              </p>
              <div className="border-l-4 pl-4 mt-6" style={{ borderColor: "var(--primary)" }}>
                <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Abdul Latif, S.Pd.</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>Kepala SMP Muhammadiyah 1 Genteng</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Unggulan - app-like cards */}
      <section className="py-16 md:py-24" style={{ background: "var(--section-alt)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
              Program Unggulan
            </h2>
            <p className="max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
              Tiga program unggulan yang membedakan kami dari sekolah lain
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: BookOpen, title: "Program Keagamaan", desc: "Pendalaman Al-Qur'an, tahfidz, sholat berjamaah, dan kajian Islam intensif setiap pekan" },
              { icon: GraduationCap, title: "Kurikulum Merdeka", desc: "Pembelajaran berbasis proyek yang mengembangkan kreativitas dan kemandirian siswa" },
              { icon: Users, title: "Pengembangan Karakter", desc: "Pembentukan akhlak mulia melalui budaya 5S (Senyum, Salam, Sapa, Sopan, Santun)" },
            ].map((program, index) => (
              <div key={index}
                className="relative overflow-hidden rounded-2xl p-6 md:p-7 tap-scale"
                style={{ background: "var(--card)" }}
              >
                {/* Icon background */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg" style={{ background: "color-mix(in srgb, var(--primary) 15%, transparent)" }}>
                  <program.icon className="w-7 h-7" style={{ color: "var(--primary)" }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>{program.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{program.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agenda Terdekat */}
      <section className="py-16 md:py-24 bg-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Agenda Terdekat</h2>
              <p style={{ color: "var(--text-secondary)" }}>Jadwal kegiatan dan acara mendatang</p>
            </div>
            <Link href="/agenda" className="hidden sm:inline-flex items-center gap-1 font-semibold text-sm" style={{ color: "var(--primary)" }}>
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <UpcomingAgenda />

          <div className="text-center mt-6 sm:hidden">
            <Link href="/agenda" className="inline-flex items-center gap-1 font-semibold text-sm" style={{ color: "var(--primary)" }}>
              Lihat Semua Agenda <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Berita Terkini - horizontal scroll on mobile */}
      <section className="py-16 md:py-24" style={{ background: "var(--section-alt)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Berita Terkini</h2>
              <p style={{ color: "var(--text-secondary)" }}>Informasi dan kegiatan terbaru dari sekolah</p>
            </div>
            <Link href="/berita" className="hidden sm:inline-flex items-center gap-1 font-semibold text-sm" style={{ color: "var(--primary)" }}>
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile: horizontal scroll, Desktop: grid */}
          <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible pb-2 snap-x md:snap-none noselect">
            {latestNews.map((item) => (
              <Link
                key={item.id}
                href="/berita"
                className="group flex-shrink-0 w-[75vw] sm:w-[45vw] md:w-auto rounded-xl overflow-hidden tap-scale"
                style={{ background: "var(--card)" }}
              >
                <div className="h-36 flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--primary) 8%, var(--card))" }}>
                  <Newspaper className="w-10 h-10" style={{ color: "var(--primary)" }} />
                </div>
                <div className="p-4">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--badge-bg)", color: "var(--badge-text)" }}>
                    {item.category}
                  </span>
                  <h3 className="font-semibold text-sm mt-2 mb-1 line-clamp-2" style={{ color: "var(--text-primary)" }}>
                    {item.title}
                  </h3>
                  <p className="text-xs line-clamp-2 mb-2" style={{ color: "var(--text-muted)" }}>
                    {item.excerpt}
                  </p>
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{item.date}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-6 sm:hidden">
            <Link href="/berita" className="inline-flex items-center gap-1 font-semibold text-sm" style={{ color: "var(--primary)" }}>
              Lihat Semua Berita <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Galeri Terkini */}
      <section className="py-16 md:py-24 bg-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Galeri Foto</h2>
              <p style={{ color: "var(--text-secondary)" }}>Dokumentasi kegiatan sekolah</p>
            </div>
            <Link href="/galeri" className="hidden sm:inline-flex items-center gap-1 font-semibold text-sm" style={{ color: "var(--primary)" }}>
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {latestGallery.map((item) => (
              <Link key={item.id} href="/galeri"
                className="group relative aspect-square rounded-xl overflow-hidden tap-scale"
                style={{ background: "var(--section-alt)" }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-10 h-10" style={{ color: "var(--text-muted)" }} />
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end" style={{ background: "linear-gradient(to top, var(--hero-overlay), transparent)" }}>
                  <p className="text-xs font-medium p-3" style={{ color: "white" }}>{item.title}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-6 sm:hidden">
            <Link href="/galeri" className="inline-flex items-center gap-1 font-semibold text-sm" style={{ color: "var(--primary)" }}>
              Lihat Semua Galeri <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SPMB Timeline */}
      <section className="py-16 md:py-24" style={{ background: "var(--section-alt)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
              Jadwal SPMB 2026
            </h2>
            <p className="max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
              Seleksi Penerimaan Murid Baru SMP Muhammadiyah 1 Genteng Tahun Ajaran 2026/2027
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-3">
            {[
              { title: "Pendaftaran", date: "1 Juni - 15 Juli 2026", icon: Calendar },
              { title: "Tes Seleksi", date: "16 - 18 Juli 2026", icon: Clock },
              { title: "Pengumuman", date: "20 Juli 2026", icon: Award },
              { title: "Daftar Ulang", date: "21 - 23 Juli 2026", icon: CheckCircle },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="rounded-xl p-5 text-center" style={{ background: "var(--card)" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: "var(--primary)" }}>
                    <Icon className="w-6 h-6" style={{ color: "white" }} />
                  </div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.date}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/spmb/daftar"
              className="inline-flex items-center gap-2 font-semibold px-8 py-3.5 rounded-xl transition-all tap-scale"
              style={{ background: "var(--secondary)", color: "var(--foreground)" }}
            >
              Daftar Sekarang <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <FasilitasSection />

      {/* CTA */}
      <section className="py-16 md:py-24" style={{ background: "var(--secondary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--foreground)" }}>
            Siap Bergabung?
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: "color-mix(in srgb, var(--foreground) 80%, transparent)" }}>
            Berikan pendidikan terbaik untuk putra-putri Anda di SMP Muhammadiyah 1 Genteng. Kuota terbatas!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/spmb/daftar"
              className="inline-flex items-center justify-center font-semibold px-8 py-3.5 rounded-xl transition-all tap-scale"
              style={{ background: "var(--foreground)", color: "var(--background)" }}>
              Daftar Sekarang
            </Link>
            <Link href="/kontak"
              className="inline-flex items-center justify-center font-semibold px-8 py-3.5 rounded-xl transition-all tap-scale"
              style={{ background: "var(--background)", color: "var(--foreground)" }}>
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
