export type GaleriItem = {
  id: string;
  title: string;
  category: string;
  desc: string;
  media_type: "photo" | "video";
  url: string;
};

export const galeriList: GaleriItem[] = [
  { id: "1", title: "Upacara Bendera", category: "Upacara", desc: "Kegiatan upacara bendera setiap Senin", media_type: "photo", url: "" },
  { id: "2", title: "Kegiatan Belajar", category: "Kegiatan", desc: "Suasana belajar di dalam kelas", media_type: "photo", url: "" },
  { id: "3", title: "Laboratorium Komputer", category: "Fasilitas", desc: "Praktik di lab komputer", media_type: "photo", url: "" },
  { id: "4", title: "Tim Tapak Suci", category: "Ekskul", desc: "Latihan Tapak Suci rutin", media_type: "video", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "5", title: "Perpustakaan", category: "Fasilitas", desc: "Koleksi buku di perpustakaan", media_type: "photo", url: "" },
  { id: "6", title: "Juara Marching Band", category: "Prestasi", desc: "Tim marching band meraih juara", media_type: "video", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "7", title: "Sholat Berjamaah", category: "Kegiatan", desc: "Sholat Dhuhur berjamaah di musholla", media_type: "photo", url: "" },
  { id: "8", title: "Musholla Sekolah", category: "Fasilitas", desc: "Musholla untuk ibadah", media_type: "photo", url: "" },
  { id: "9", title: "Kajian Islam", category: "Kegiatan", desc: "Kajian Islam rutin setiap Jumat", media_type: "photo", url: "" },
  { id: "10", title: "Lapangan Olahraga", category: "Fasilitas", desc: "Lapangan serbaguna sekolah", media_type: "photo", url: "" },
  { id: "11", title: "Peringatan Hari Besar", category: "Kegiatan", desc: "Peringatan Maulid Nabi", media_type: "video", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "12", title: "Tim Hizbul Wathan", category: "Ekskul", desc: "Kegiatan kepanduan HW", media_type: "photo", url: "" },
];
