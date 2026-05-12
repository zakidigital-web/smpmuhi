import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak - SMP Muhammadiyah 1 Genteng",
  description: "Hubungi SMP Muhammadiyah 1 Genteng Banyuwangi - alamat, telepon, email, dan form kontak",
};

export default function KontakLayout({ children }: { children: React.ReactNode }) {
  return children;
}
