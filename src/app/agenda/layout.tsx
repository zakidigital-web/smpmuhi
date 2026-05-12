import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agenda - SMP Muhammadiyah 1 Genteng",
  description: "Jadwal kegiatan, acara, dan agenda penting SMP Muhammadiyah 1 Genteng Banyuwangi",
};

export default function AgendaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
