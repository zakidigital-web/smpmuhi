import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Form Pendaftaran SPMB - SMP Muhammadiyah 1 Genteng",
  description: "Formulir pendaftaran online SPMB SMP Muhammadiyah 1 Genteng tahun ajaran 2026/2027",
};

export default function DaftarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
