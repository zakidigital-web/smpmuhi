-- ============================================================
-- SCHEMA & SEED DATA — SMP Muhammadiyah 1 Genteng
-- ============================================================
-- Cara import:
--   turso db shell <nama-database> < schema.sql
-- ============================================================

-- Hapus tabel lama (urutan aman untuk foreign key)
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS spmb_registrations;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS agenda;
DROP TABLE IF EXISTS galeri;
DROP TABLE IF EXISTS berita;
DROP TABLE IF EXISTS hero;

-- ==================== TABEL ====================

CREATE TABLE IF NOT EXISTS hero (
  id TEXT PRIMARY KEY,
  headline TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  ctaText TEXT NOT NULL DEFAULT '',
  ctaHref TEXT NOT NULL DEFAULT '',
  ctaSecondaryText TEXT DEFAULT '',
  ctaSecondaryHref TEXT DEFAULT '',
  gradient TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS berita (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS galeri (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  "desc" TEXT NOT NULL DEFAULT '',
  media_type TEXT NOT NULL DEFAULT 'photo',
  url TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS agenda (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  time TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS spmb_registrations (
  id TEXT PRIMARY KEY,
  nomor_pendaftaran TEXT UNIQUE NOT NULL,
  nama_lengkap TEXT NOT NULL,
  nisn TEXT NOT NULL,
  tempat_lahir TEXT NOT NULL,
  tanggal_lahir TEXT NOT NULL,
  jenis_kelamin TEXT NOT NULL,
  agama TEXT NOT NULL,
  alamat TEXT NOT NULL,
  nama_ayah TEXT NOT NULL,
  pekerjaan_ayah TEXT NOT NULL,
  no_hp_ortu TEXT NOT NULL,
  nama_ibu TEXT NOT NULL,
  pekerjaan_ibu TEXT NOT NULL,
  nama_sekolah TEXT NOT NULL,
  alamat_sekolah TEXT NOT NULL,
  program_pilihan TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'menunggu',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  berita_id TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Anonim',
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (berita_id) REFERENCES berita(id)
);

-- ==================== MIGRASI (opsional, aman dijalankan ulang) ====================

ALTER TABLE galeri ADD COLUMN media_type TEXT NOT NULL DEFAULT 'photo';
ALTER TABLE galeri ADD COLUMN url TEXT NOT NULL DEFAULT '';
ALTER TABLE berita ADD COLUMN image TEXT NOT NULL DEFAULT '';
ALTER TABLE hero ADD COLUMN image TEXT NOT NULL DEFAULT '';
ALTER TABLE berita ADD COLUMN allow_comments INTEGER NOT NULL DEFAULT 1;

-- ==================== SEED DATA ====================

-- Hero Slides
INSERT INTO hero (id,headline,tagline,description,ctaText,ctaHref,ctaSecondaryText,ctaSecondaryHref,gradient,active,sort_order) VALUES
('1','SMP Muhammadiyah 1'||CHAR(10)||'Genteng','Unggul, Islami, Berkemajuan','Sekolah unggulan di Banyuwangi dengan program keagamaan intensif, kurikulum merdeka, dan lingkungan belajar yang kondusif untuk mencetak generasi berakhlak mulia.','Daftar Sekarang','/spmb/daftar','Lihat Program Unggulan','/program','linear-gradient(135deg, #1B5E20, #1565C0)',1,0),
('2','SPMB 2026/2027'||CHAR(10)||'Telah Dibuka','Kuota Terbatas! Daftar Segera','Seleksi Penerimaan Murid Baru SMP Muhammadiyah 1 Genteng tahun ajaran 2026/2027 telah dibuka. Tersedia 3 jalur pendaftaran dengan total kuota 140 siswa.','Info SPMB','/spmb','Daftar Online','/spmb/daftar','linear-gradient(135deg, #1565C0, #1B5E20)',1,1),
('3','Prestasi Membanggakan'||CHAR(10)||'di Berbagai Ajang','Akreditasi A - Unggul','Siswa SMP Muhammadiyah 1 Genteng terus meraih prestasi di tingkat kecamatan, kabupaten, dan provinsi. Bukti nyata kualitas pendidikan yang unggul dan berdaya saing.','Lihat Prestasi','/profil','Profil Sekolah','/profil','linear-gradient(135deg, #065F46, #0D9488)',1,2);

-- Berita
INSERT INTO berita (id,title,excerpt,content,date,author,category,slug) VALUES
('1','Pendaftaran SPMB 2026/2027 Telah Dibuka','SMP Muhammadiyah 1 Genteng membuka pendaftaran murid baru tahun ajaran 2026/2027. Tersedia 3 jalur pendaftaran dengan kuota total 140 siswa.','SMP Muhammadiyah 1 Genteng secara resmi membuka pendaftaran SPMB (Seleksi Penerimaan Murid Baru) untuk tahun ajaran 2026/2027. Pendaftaran dibuka mulai 1 Juni hingga 15 Juli 2026. Tersedia 3 jalur pendaftaran yaitu Jalur Reguler (kuota 90 siswa), Jalur Prestasi (kuota 30 siswa), dan Jalur Afirmasi (kuota 20 siswa). Biaya pendaftaran gratis. Calon siswa dapat mendaftar secara online melalui website resmi sekolah.','1 Juni 2026','Admin','Pendaftaran','pendaftaran-spmb-2026'),
('2','Siswa SMP Muhammadiyah 1 Genteng Raih Juara Tapak Suci Tingkat Kabupaten','Tim Tapak Suci SMP Muhammadiyah 1 Genteng berhasil meraih juara 1 pada kompetisi pencak silat tingkat Kabupaten Banyuwangi.','Prestasi membanggakan kembali diraih oleh siswa-siswi SMP Muhammadiyah 1 Genteng. Tim Tapak Suci berhasil meraih juara 1 dalam kompetisi pencak silat Tapak Suci tingkat Kabupaten Banyuwangi yang digelar di GOR Tawang Alun. Dalam kompetisi tersebut, siswa SMP Muhammadiyah 1 Genteng berhasil mengalahkan lawan-lawannya dengan teknik dan semangat juang yang tinggi. Prestasi ini merupakan hasil dari latihan rutin yang dilakukan setiap pekan di bawah bimbingan pelatih profesional.','15 Mei 2026','Admin','Prestasi','juara-tapak-suci'),
('3','Kegiatan Pondok Ramadhan 1447 H','Rangkaian kegiatan Pondok Ramadhan di SMP Muhammadiyah 1 Genteng berjalan dengan khidmat.','Pondok Ramadhan 1447 H di SMP Muhammadiyah 1 Genteng berlangsung selama 10 hari penuh dengan berbagai kegiatan keagamaan. Seluruh siswa mengikuti pesantren kilat yang meliputi tadarus Al-Quran, kajian fiqih ibadah, dan praktik sholat sunnah. Kegiatan ditutup dengan buka bersama dan sholat Maghrib berjamaah. Kegiatan ini bertujuan untuk meningkatkan keimanan dan ketaqwaan siswa selama bulan suci Ramadhan.','20 Maret 2026','Admin','Kegiatan','pondok-ramadhan-1447'),
('4','Workshop Implementasi Kurikulum Merdeka bagi Guru','Para guru mengikuti workshop implementasi Kurikulum Merdeka untuk meningkatkan kualitas pembelajaran berbasis proyek.','Seluruh guru SMP Muhammadiyah 1 Genteng mengikuti workshop implementasi Kurikulum Merdeka yang diselenggarakan di Aula Sekolah. Workshop ini menghadirkan narasumber dari Dinas Pendidikan Kabupaten Banyuwangi. Materi yang disampaikan meliputi penyusunan modul ajar, asesmen formatif, dan pembelajaran berdiferensiasi. Dengan workshop ini, diharapkan para guru semakin siap mengimplementasikan Kurikulum Merdeka secara optimal.','10 Februari 2026','Admin','Akademik','workshop-kurikulum-merdeka'),
('5','Kegiatan Class Meeting Semester Genap 2025/2026','Setelah Penilaian Akhir Semester, siswa mengikuti class meeting dengan berbagai lomba dan pertandingan antar kelas.','Class Meeting semester genap tahun ajaran 2025/2026 digelar meriah di SMP Muhammadiyah 1 Genteng. Berbagai lomba dan pertandingan diadakan, mulai dari futsal, voli, catur, hingga lomba kebersihan kelas. Kegiatan ini bertujuan untuk mempererat tali silaturahmi antar siswa setelah menjalani ujian semester. Class meeting berlangsung selama 3 hari dengan antusiasme yang tinggi dari seluruh siswa.','25 Januari 2026','Admin','Kegiatan','class-meeting-2026'),
('6','Sosialisasi Anti Bullying oleh Guru BK','Guru Bimbingan Konseling mengadakan sosialisasi anti bullying untuk menciptakan lingkungan sekolah yang aman dan nyaman.','Dalam upaya menciptakan lingkungan sekolah yang aman dan nyaman, Guru Bimbingan Konseling (BK) SMP Muhammadiyah 1 Genteng mengadakan sosialisasi anti bullying untuk seluruh siswa. Materi sosialisasi meliputi pengertian bullying, jenis-jenis bullying, dampak bullying, dan cara mencegahnya. Siswa diajak untuk berperan aktif dalam menciptakan budaya sekolah yang saling menghormati dan menghargai.','15 Januari 2026','Admin','Kegiatan','sosialisasi-anti-bullying'),
('7','Peringatan Maulid Nabi Muhammad SAW 1447 H','SMP Muhammadiyah 1 Genteng menggelar peringatan Maulid Nabi dengan ceramah dan pembacaan shalawat.','Peringatan Maulid Nabi Muhammad SAW 1447 H digelar dengan khidmat di lapangan sekolah. Acara dihadiri oleh seluruh siswa, guru, dan karyawan SMP Muhammadiyah 1 Genteng. Rangkaian acara meliputi pembacaan ayat suci Al-Quran, shalawat bersama, dan ceramah agama oleh ustadz undangan. Dalam ceramahnya, disampaikan tentang pentingnya meneladani akhlak Rasulullah SAW dalam kehidupan sehari-hari.','5 Januari 2026','Admin','Keagamaan','maulid-nabi-1447'),
('8','Prestasi Marching Band Tingkat Kecamatan Genteng','Tim Marching Band SMP Muhammadiyah 1 Genteng meraih juara 2 dalam lomba tingkat Kecamatan Genteng.','Tim Marching Band SMP Muhammadiyah 1 Genteng kembali menorehkan prestasi dengan meraih juara 2 dalam lomba Marching Band tingkat Kecamatan Genteng. Penampilan yang enerjik dan kompak berhasil memukau dewan juri. Prestasi ini merupakan hasil dari latihan disiplin yang dilakukan setiap sore hari selepas jam pelajaran sekolah.','20 Desember 2025','Admin','Prestasi','marching-band-juara');

-- Galeri
INSERT INTO galeri (id,title,category,"desc",media_type,url) VALUES
('1','Upacara Bendera','Upacara','Kegiatan upacara bendera setiap Senin','photo',''),
('2','Kegiatan Belajar','Kegiatan','Suasana belajar di dalam kelas','photo',''),
('3','Laboratorium Komputer','Fasilitas','Praktik di lab komputer','photo',''),
('4','Tim Tapak Suci','Ekskul','Latihan Tapak Suci rutin','video','https://www.youtube.com/embed/dQw4w9WgXcQ'),
('5','Perpustakaan','Fasilitas','Koleksi buku di perpustakaan','photo',''),
('6','Juara Marching Band','Prestasi','Tim marching band meraih juara','video','https://www.youtube.com/embed/dQw4w9WgXcQ'),
('7','Sholat Berjamaah','Kegiatan','Sholat Dhuhur berjamaah di musholla','photo',''),
('8','Musholla Sekolah','Fasilitas','Musholla untuk ibadah','photo',''),
('9','Kajian Islam','Kegiatan','Kajian Islam rutin setiap Jumat','photo',''),
('10','Lapangan Olahraga','Fasilitas','Lapangan serbaguna sekolah','photo',''),
('11','Peringatan Hari Besar','Kegiatan','Peringatan Maulid Nabi','video','https://www.youtube.com/embed/dQw4w9WgXcQ'),
('12','Tim Hizbul Wathan','Ekskul','Kegiatan kepanduan HW','photo','');

-- Agenda
INSERT INTO agenda (id,title,date,time,location,description,type) VALUES
('a1','Pendaftaran SPMB 2026/2027','2026-06-01','08:00','Kantor Tata Usaha','Pembukaan pendaftaran murid baru tahun ajaran 2026/2027 secara online dan offline.','Pendaftaran'),
('a2','Tes Seleksi Masuk','2026-07-16','07:30','Ruang Kelas','Pelaksanaan tes seleksi bagi calon siswa baru meliputi tes akademik dan baca Al-Quran.','Seleksi'),
('a3','Pengumuman Hasil Seleksi','2026-07-20','09:00','Papan Pengumuman & Website','Pengumuman hasil seleksi penerimaan murid baru dapat dilihat di sekolah dan website resmi.','Pengumuman'),
('a4','Daftar Ulang','2026-07-21','08:00','Kantor Tata Usaha','Daftar ulang bagi calon siswa yang dinyatakan diterima dengan membawa dokumen lengkap.','Pendaftaran'),
('a5','Masa Taaruf Siswa Baru (Matsaba)','2026-07-24','07:00','Lapangan Sekolah','Kegiatan pengenalan lingkungan sekolah bagi siswa baru tahun ajaran 2026/2027.','Kegiatan'),
('a6','Hari Pertama Masuk Sekolah','2026-07-28','07:00','SMP Muhammadiyah 1 Genteng','Awal tahun ajaran baru 2026/2027. Seluruh siswa hadir mengikuti kegiatan belajar mengajar.','Kegiatan');

-- Settings (31 key-value pairs)
INSERT INTO settings (key,value) VALUES
('schoolName','SMP Muhammadiyah 1 Genteng'),
('shortName','SMP Mutiara Genteng'),
('tagline','Unggul, Islami, Berkemajuan'),
('address','Jl. Temuguruh No.58, Genteng Wetan, Kec. Genteng, Kab. Banyuwangi, Jawa Timur 68465'),
('phone','(0333) 845554'),
('email','smpmuhammadiyah1genteng@gmail.com'),
('instagram','smpmuhammadiyah1genteng'),
('facebook','smpmutiaragenteng'),
('youtube','@smpmuhammadiyah1genteng'),
('primaryColor','#1B5E20'),
('secondaryColor','#F59E0B'),
('accentColor','#1565C0'),
('sppmYear','2026'),
('footerDescription','Sekolah menengah pertama unggulan di bawah naungan Muhammadiyah, berkomitmen mencetak generasi berakhlak mulia, berilmu, dan berkemajuan.'),
('copyright','All rights reserved.'),
('gmapsLat','-8.360388'),
('gmapsLng','114.159599'),
('showFees','1'),
('feeRegistration','Gratis'),
('feeDevelopment','Rp 500.000'),
('feeUniform','Rp 350.000'),
('feeSpp','Rp 150.000'),
('feeBooks','Rp 75.000'),
('feeActivities','Rp 50.000'),
('showFacilities','1'),
('facilities','Ruang Kelas Nyaman, Lab Komputer, Perpustakaan, Musholla, Lapangan Olahraga, Kantin Sehat, Ruang UKS, WiFi Internet, Pondok Pesantren'),
('kepalaSekolah','Abdul Latif, S.Pd.'),
('fotoKepalaSekolah',''),
('logo',''),
('favicon',''),
('adminPassword','240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9');

-- SPMB Registrations (dummy)
INSERT INTO spmb_registrations (id,nomor_pendaftaran,nama_lengkap,nisn,tempat_lahir,tanggal_lahir,jenis_kelamin,agama,alamat,nama_ayah,pekerjaan_ayah,no_hp_ortu,nama_ibu,pekerjaan_ibu,nama_sekolah,alamat_sekolah,program_pilihan,status,created_at) VALUES
('DUM-SPMB-240101001','SPMB-240101001','Ahmad Fauzi','1234567890','Banyuwangi','2011-08-15','L','Islam','Jl. Merdeka No.10, Genteng','Suparman','Petani','081234567890','Siti Aminah','Ibu Rumah Tangga','SD Negeri 1 Genteng','Jl. Raya Genteng No.1','Reguler','diterima','2026-01-15T08:30:00.000Z'),
('DUM-SPMB-240201002','SPMB-240201002','Nurul Hidayah','2234567891','Banyuwangi','2011-12-20','P','Islam','Ds. Krajan, Kec. Genteng','Hasanudin','Guru','082345678901','Fatimah','Guru','SD Muhammadiyah 1 Genteng','Jl. Pesantren No.5','Reguler','menunggu','2026-02-20T10:15:00.000Z'),
('DUM-SPMB-240301003','SPMB-240301003','Dimas Prasetyo','3234567892','Jember','2012-03-10','L','Islam','Perum Griya Asri Blok A5, Genteng','Agus Prasetyo','Wiraswasta','083456789012','Dewi Sartika','Perawat','SD Negeri 2 Genteng','Jl. Pendidikan No.10','Prestasi','diterima','2026-03-05T14:00:00.000Z');

-- Comments (dummy, attached to berita #1)
INSERT INTO comments (id,berita_id,name,content,created_at) VALUES
('c1','1','Ani','Informasi pendaftarannya sangat jelas. Terima kasih.','2026-01-16T09:00:00.000Z'),
('c2','1','Budi Santoso','Apakah ada jalur beasiswa untuk siswa kurang mampu?','2026-01-18T14:30:00.000Z'),
('c3','1','Citra Dewi','Anak saya sudah daftar, semoga diterima! Aamiin.','2026-02-01T07:15:00.000Z');
