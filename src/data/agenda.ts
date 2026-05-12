export type AgendaItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: string;
};

export const agendaList: AgendaItem[] = [
  {
    id: "a1",
    title: "Pendaftaran SPMB 2026/2027",
    date: "1 Juni 2026",
    time: "08:00 - 14:00 WIB",
    location: "Kantor Tata Usaha",
    description: "Pembukaan pendaftaran murid baru tahun ajaran 2026/2027 secara online dan offline.",
    type: "Pendaftaran",
  },
  {
    id: "a2",
    title: "Tes Seleksi Masuk",
    date: "16 Juli 2026",
    time: "07:30 - 12:00 WIB",
    location: "Ruang Kelas",
    description: "Pelaksanaan tes seleksi bagi calon siswa baru meliputi tes akademik dan baca Al-Qur'an.",
    type: "Seleksi",
  },
  {
    id: "a3",
    title: "Pengumuman Hasil Seleksi",
    date: "20 Juli 2026",
    time: "09:00 WIB",
    location: "Papan Pengumuman & Website",
    description: "Pengumuman hasil seleksi penerimaan murid baru dapat dilihat di sekolah dan website resmi.",
    type: "Pengumuman",
  },
  {
    id: "a4",
    title: "Daftar Ulang",
    date: "21 Juli 2026",
    time: "08:00 - 14:00 WIB",
    location: "Kantor Tata Usaha",
    description: "Daftar ulang bagi calon siswa yang dinyatakan diterima dengan membawa dokumen lengkap.",
    type: "Pendaftaran",
  },
  {
    id: "a5",
    title: "Masa Ta'aruf Siswa Baru (Matsaba)",
    date: "24 Juli 2026",
    time: "07:00 - 13:00 WIB",
    location: "Lapangan Sekolah",
    description: "Kegiatan pengenalan lingkungan sekolah bagi siswa baru tahun ajaran 2026/2027.",
    type: "Kegiatan",
  },
  {
    id: "a6",
    title: "Hari Pertama Masuk Sekolah",
    date: "28 Juli 2026",
    time: "07:00 - 13:00 WIB",
    location: "SMP Muhammadiyah 1 Genteng",
    description: "Awal tahun ajaran baru 2026/2027. Seluruh siswa hadir mengikuti kegiatan belajar mengajar.",
    type: "Kegiatan",
  },
];
