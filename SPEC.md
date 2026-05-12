# Spesifikasi Website Sekolah - SMP Muhammadiyah 1 Genteng

## 1. Project Overview

**Nama Proyek:** Website SMP Muhammadiyah 1 Genteng - SPMB Online
**Tipe:** Website responsif untuk sekolah dengan fitur SPMB (Seleksi Penerimaan Murid Baru)
**Framework:** Next.js 16 (App Router) + TypeScript + Tailwind CSS
**Target:** Pengguna (Calon siswa, Orang tua, Masyarakat umum)
**Platform Hosting:** Vercel

## 2. UI/UX Specification

### Layout Structure

**Header (Fixed)**
- Logo sekolah (kiri)
- Navigasi menu: Beranda, Profil, Program & Eskul, SPMB, Kontak
- Tombol "Daftar Sekarang" (kanan)
- Mobile: Hamburger menu

**Hero Section**
- Background gradient overlay
- Judul sekolah besar
- Tagline: "Unggul, Islami, Berkemajuan"
- Tombol CTA utama
- Stats counter (siswa, guru, tahun berdiri)

**Content Sections**
- Sambutan Kepala Sekolah
- Program Unggulan
- Timeline SPMB
- Fasilitas sekolah

**Footer**
- Logo & deskripsi singkat
- Quick links
- Kontak info
- Social media icons

### Visual Design

**Color Palette**
- Primary: `#1B5E20` (hijau tua - Islami)
- Secondary: `#F59E0B` (kuning - energi)
- Accent: `#1565C0` (biru - profesional)
- Background: `#F8FAFC`

**Typography**
- Headings: "Poppins", sans-serif
- Body: "Inter", sans-serif

## 3. Halaman

| Route | Halaman |
|-------|---------|
| `/` | Beranda |
| `/profil` | Profil Sekolah |
| `/program` | Program Unggulan & Eskul |
| `/ppdb` | Info SPMB |
| `/ppdb/daftar` | Form Pendaftaran |
| `/kontak` | Kontak |

## 4. Data Sekolah (Riil)

| Item | Data |
|------|------|
| NPSN | 20525536 |
| Akreditasi | A (164/BAP-S/M/SK/XI/2017) |
| Berdiri | 6 Mei 1978 |
| Alamat | Jl. Temuguruh No.58, Genteng, Banyuwangi |
| Telp | (0333) 845554 |
| Kepala Sekolah | Abdul Latif |
| Siswa | 269 |
| Guru | 17 |
| Luas Tanah | 2.550 m² |
| Kurikulum | Merdeka |

## 5. Technical Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Fonts:** Google Fonts (Poppins, Inter)
- **Forms:** React Hook Form + Zod validation

## 6. Deployment

- Vercel (auto-detect Next.js)
- Build command: `next build`
- Static pages pre-rendered for optimal performance