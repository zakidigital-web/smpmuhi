import type { MetadataRoute } from 'next'
import { query } from "@/lib/database";

export default function manifest(): MetadataRoute.Manifest {
  let schoolName = "SMP Muhammadiyah 1 Genteng";
  let shortName = "SMP Muhammadiyah 1";
  let primaryColor = "#1B5E20";
  try {
    const rows = query<{ key: string; value: string }>(
      "SELECT key, value FROM settings WHERE key IN ('schoolName', 'shortName', 'primaryColor')"
    );
    const map: Record<string, string> = {};
    rows.forEach((r) => { map[r.key] = r.value; });
    if (map.schoolName) schoolName = map.schoolName;
    if (map.shortName) shortName = map.shortName;
    if (map.primaryColor) primaryColor = map.primaryColor;
  } catch {}

  return {
    name: schoolName,
    short_name: shortName,
    description: `Website resmi ${schoolName} Banyuwangi - SPMB Online, Informasi Sekolah`,
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: primaryColor,
    theme_color: primaryColor,
    categories: ['education'],
    lang: 'id',
    dir: 'ltr',
    prefer_related_applications: false,
    icons: [
      { src: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { src: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
      { src: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
    ],
  }
}
