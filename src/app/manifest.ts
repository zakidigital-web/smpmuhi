import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SMP Muhammadiyah 1 Genteng',
    short_name: 'SMP Mutiara',
    description: 'Website resmi SMP Muhammadiyah 1 Genteng Banyuwangi - SPMB Online, Informasi Sekolah',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#1B5E20',
    theme_color: '#1B5E20',
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
