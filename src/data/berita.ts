export type BeritaItem = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  slug: string;
};

export const beritaList: BeritaItem[] = [
  {
    id: "1",
    title: "Pendaftaran SPMB 2026/2027 Telah Dibuka",
    excerpt:
      "SMP Muhammadiyah 1 Genteng membuka pendaftaran murid baru tahun ajaran 2026/2027. Tersedia 3 jalur pendaftaran dengan kuota total 140 siswa.",
    content:
      "SMP Muhammadiyah 1 Genteng secara resmi membuka pendaftaran SPMB (Seleksi Penerimaan Murid Baru) untuk tahun ajaran 2026/2027. Pendaftaran dibuka mulai 1 Juni hingga 15 Juli 2026. Tersedia 3 jalur pendaftaran yaitu Jalur Reguler (kuota 90 siswa), Jalur Prestasi (kuota 30 siswa), dan Jalur Afirmasi (kuota 20 siswa). Biaya pendaftaran gratis. Calon siswa dapat mendaftar secara online melalui website resmi sekolah.",
    date: "1 Juni 2026",
    author: "Admin",
    category: "Pendaftaran",
    slug: "pendaftaran-spmb-2026",
  },
  {
    id: "2",
    title: "Siswa SMP Muhammadiyah 1 Genteng Raih Juara Tapak Suci Tingkat Kabupaten",
    excerpt:
      "Tim Tapak Suci SMP Muhammadiyah 1 Genteng berhasil meraih juara 1 pada kompetisi pencak silat tingkat Kabupaten Banyuwangi.",
    content:
      "Prestasi membanggakan kembali diraih oleh siswa-siswi SMP Muhammadiyah 1 Genteng. Tim Tapak Suci berhasil meraih juara 1 dalam kompetisi pencak silat Tapak Suci tingkat Kabupaten Banyuwangi yang digelar di GOR Tawang Alun. Dalam kompetisi tersebut, siswa SMP Muhammadiyah 1 Genteng berhasil mengalahkan lawan-lawannya dengan teknik dan semangat juang yang tinggi. Prestasi ini merupakan hasil dari latihan rutin yang dilakukan setiap pekan di bawah bimbingan pelatih profesional.",
    date: "15 Mei 2026",
    author: "Admin",
    category: "Prestasi",
    slug: "juara-tapak-suci",
  },
  {
    id: "3",
    title: "Kegiatan Pondok Ramadhan 1447 H",
    excerpt:
      "Rangkaian kegiatan Pondok Ramadhan di SMP Muhammadiyah 1 Genteng berjalan dengan khidmat.",
    content:
      "Pondok Ramadhan 1447 H di SMP Muhammadiyah 1 Genteng berlangsung selama 10 hari penuh dengan berbagai kegiatan keagamaan. Seluruh siswa mengikuti pesantren kilat yang meliputi tadarus Al-Qur'an, kajian fiqih ibadah, dan praktik sholat sunnah. Kegiatan ditutup dengan buka bersama dan sholat Maghrib berjamaah. Kegiatan ini bertujuan untuk meningkatkan keimanan dan ketaqwaan siswa selama bulan suci Ramadhan.",
    date: "20 Maret 2026",
    author: "Admin",
    category: "Kegiatan",
    slug: "pondok-ramadhan-1447",
  },
  {
    id: "4",
    title: "Workshop Implementasi Kurikulum Merdeka bagi Guru",
    excerpt:
      "Para guru mengikuti workshop implementasi Kurikulum Merdeka untuk meningkatkan kualitas pembelajaran berbasis proyek.",
    content:
      "Seluruh guru SMP Muhammadiyah 1 Genteng mengikuti workshop implementasi Kurikulum Merdeka yang diselenggarakan di Aula Sekolah. Workshop ini menghadirkan narasumber dari Dinas Pendidikan Kabupaten Banyuwangi. Materi yang disampaikan meliputi penyusunan modul ajar, asesmen formatif, dan pembelajaran berdiferensiasi. Dengan workshop ini, diharapkan para guru semakin siap mengimplementasikan Kurikulum Merdeka secara optimal.",
    date: "10 Februari 2026",
    author: "Admin",
    category: "Akademik",
    slug: "workshop-kurikulum-merdeka",
  },
  {
    id: "5",
    title: "Kegiatan Class Meeting Semester Genap 2025/2026",
    excerpt:
      "Setelah Penilaian Akhir Semester, siswa mengikuti class meeting dengan berbagai lomba dan pertandingan antar kelas.",
    content:
      "Class Meeting semester genap tahun ajaran 2025/2026 digelar meriah di SMP Muhammadiyah 1 Genteng. Berbagai lomba dan pertandingan diadakan, mulai dari futsal, voli, catur, hingga lomba kebersihan kelas. Kegiatan ini bertujuan untuk mempererat tali silaturahmi antar siswa setelah menjalani ujian semester. Class meeting berlangsung selama 3 hari dengan antusiasme yang tinggi dari seluruh siswa.",
    date: "25 Januari 2026",
    author: "Admin",
    category: "Kegiatan",
    slug: "class-meeting-2026",
  },
  {
    id: "6",
    title: "Sosialisasi Anti Bullying oleh Guru BK",
    excerpt:
      "Guru Bimbingan Konseling mengadakan sosialisasi anti bullying untuk menciptakan lingkungan sekolah yang aman dan nyaman.",
    content:
      "Dalam upaya menciptakan lingkungan sekolah yang aman dan nyaman, Guru Bimbingan Konseling (BK) SMP Muhammadiyah 1 Genteng mengadakan sosialisasi anti bullying untuk seluruh siswa. Materi sosialisasi meliputi pengertian bullying, jenis-jenis bullying, dampak bullying, dan cara mencegahnya. Siswa diajak untuk berperan aktif dalam menciptakan budaya sekolah yang saling menghormati dan menghargai.",
    date: "15 Januari 2026",
    author: "Admin",
    category: "Kegiatan",
    slug: "sosialisasi-anti-bullying",
  },
  {
    id: "7",
    title: "Peringatan Maulid Nabi Muhammad SAW 1447 H",
    excerpt:
      "SMP Muhammadiyah 1 Genteng menggelar peringatan Maulid Nabi dengan ceramah dan pembacaan shalawat.",
    content:
      "Peringatan Maulid Nabi Muhammad SAW 1447 H digelar dengan khidmat di lapangan sekolah. Acara dihadiri oleh seluruh siswa, guru, dan karyawan SMP Muhammadiyah 1 Genteng. Rangkaian acara meliputi pembacaan ayat suci Al-Qur'an, shalawat bersama, dan ceramah agama oleh ustadz undangan. Dalam ceramahnya, disampaikan tentang pentingnya meneladani akhlak Rasulullah SAW dalam kehidupan sehari-hari.",
    date: "5 Januari 2026",
    author: "Admin",
    category: "Keagamaan",
    slug: "maulid-nabi-1447",
  },
  {
    id: "8",
    title: "Prestasi Marching Band Tingkat Kecamatan Genteng",
    excerpt:
      "Tim Marching Band SMP Muhammadiyah 1 Genteng meraih juara 2 dalam lomba tingkat Kecamatan Genteng.",
    content:
      "Tim Marching Band SMP Muhammadiyah 1 Genteng kembali menorehkan prestasi dengan meraih juara 2 dalam lomba Marching Band tingkat Kecamatan Genteng. Penampilan yang enerjik dan kompak berhasil memukau dewan juri. Prestasi ini merupakan hasil dari latihan disiplin yang dilakukan setiap sore hari selepas jam pelajaran sekolah.",
    date: "20 Desember 2025",
    author: "Admin",
    category: "Prestasi",
    slug: "marching-band-juara",
  },
];
