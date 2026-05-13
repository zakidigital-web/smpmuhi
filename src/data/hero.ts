export type HeroSlide = {
  id: string;
  headline: string;
  tagline: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  ctaSecondaryText?: string;
  ctaSecondaryHref?: string;
  gradient: string;
  active: boolean;
  image?: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "1",
    headline: "SMP Muhammadiyah 1\nGenteng",
    tagline: "Unggul, Islami, Berkemajuan",
    description:
      "Sekolah unggulan di Banyuwangi dengan program keagamaan intensif, kurikulum merdeka, dan lingkungan belajar yang kondusif untuk mencetak generasi berakhlak mulia.",
    ctaText: "Daftar Sekarang",
    ctaHref: "/spmb/daftar",
    ctaSecondaryText: "Lihat Program Unggulan",
    ctaSecondaryHref: "/program",
    gradient: "linear-gradient(135deg, #1B5E20, #1565C0)",
    active: true,
  },
  {
    id: "2",
    headline: "SPMB 2026/2027\nTelah Dibuka",
    tagline: "Kuota Terbatas! Daftar Segera",
    description:
      "Seleksi Penerimaan Murid Baru SMP Muhammadiyah 1 Genteng tahun ajaran 2026/2027 telah dibuka. Tersedia 3 jalur pendaftaran dengan total kuota 140 siswa.",
    ctaText: "Info SPMB",
    ctaHref: "/spmb",
    ctaSecondaryText: "Daftar Online",
    ctaSecondaryHref: "/spmb/daftar",
    gradient: "linear-gradient(135deg, #1565C0, #1B5E20)",
    active: true,
  },
  {
    id: "3",
    headline: "Prestasi Membanggakan\ndi Berbagai Ajang",
    tagline: "Akreditasi A - Unggul",
    description:
      "Siswa SMP Muhammadiyah 1 Genteng terus meraih prestasi di tingkat kecamatan, kabupaten, dan provinsi. Bukti nyata kualitas pendidikan yang unggul dan berdaya saing.",
    ctaText: "Lihat Prestasi",
    ctaHref: "/profil",
    ctaSecondaryText: "Profil Sekolah",
    ctaSecondaryHref: "/profil",
    gradient: "linear-gradient(135deg, #065F46, #0D9488)",
    active: true,
  },
];
