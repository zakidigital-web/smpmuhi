# Setup Database Turso

Panduan untuk mengimport skema database + data awal ke Turso.

## Prasyarat

- [Turso CLI](https://docs.turso.tech/reference/turso-cli) sudah terinstall
- Sudah login: `turso auth login`

## Cara Import

### 1. Download file schema

File `schema.sql` sudah tersedia di project ini. Berisi:
- 7 tabel (hero, berita, galeri, agenda, spmb_registrations, settings, comments)
- Migrasi kolom (image, media_type, allow_comments)
- Data awal: 3 hero slide, 8 berita, 12 galeri, 6 agenda, 31 pengaturan, 3 registrasi SPMB dummy, 3 komentar

### 2. Import ke database Turso

```bash
turso db shell <NAMA_DATABASE> < schema.sql
```

Contoh:
```bash
turso db shell smpmuhi < schema.sql
```

### 3. Verifikasi

Cek jumlah data:
```bash
turso db shell smpmuhi "SELECT 'hero:'||COUNT(*) FROM hero UNION ALL SELECT 'berita:'||COUNT(*) FROM berita UNION ALL SELECT 'galeri:'||COUNT(*) FROM galeri UNION ALL SELECT 'agenda:'||COUNT(*) FROM agenda UNION ALL SELECT 'settings:'||COUNT(*) FROM settings UNION ALL SELECT 'spmb:'||COUNT(*) FROM spmb_registrations UNION ALL SELECT 'comments:'||COUNT(*) FROM comments"
```

Output yang diharapkan:
```
hero:3
berita:8
galeri:12
agenda:6
settings:31
spmb:3
comments:3
```

### 4. Hubungkan ke Aplikasi

Di Vercel, set environment variable:
- `TURSO_DB_URL` = URL database dari Turso dashboard (contoh: `libsql://smpmuhi.turso.io`)
- `TURSO_DB_AUTH_TOKEN` = Token autentikasi dari Turso dashboard

Atau paste kredensial di halaman login admin (`/admin/login`) → form "Setup Database".

## Catatan

- `schema.sql` aman dijalankan berulang kali (menggunakan `DROP TABLE IF EXISTS` + `CREATE TABLE IF NOT EXISTS`)
- Data dummy SPMB dan komentar bisa dihapus melalui panel admin nantinya
- Password admin default: `admin123` (hash: `240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9`)
