# Panduan Deploy ke Vercel + Database

Panduan ini mencakup deployment website SMP Muhammadiyah 1 Genteng ke Vercel beserta database-nya.

## Prasyarat

1. Akun Vercel ([vercel.com](https://vercel.com)) - daftar gratis
2. Akun GitHub (untuk menyimpan kode)
3. Git sudah terinstall di komputer

---

## Langkah 1: Push Kode ke GitHub

1. Buat repository baru di GitHub (bisa Public atau Private):
   - Buka https://github.com/new
   - Isi nama repository (contoh: `smp-mutiara-website`)
   - Jangan centang apapun, klik "Create repository"

2. Jalankan perintah berikut di terminal proyek:

```bash
# Inisialisasi git (jika belum)
git init

# Tambah semua file
git add .

# Commit
git commit -m "Initial commit"

# Hubungkan dengan remote GitHub
git remote add origin https://github.com/[username]/[nama-repo].git

# Push ke GitHub
git push -u origin main
```

---

## Langkah 2: Deploy ke Vercel

### Opsi A: Via Vercel CLI (Rekomendasi)

```bash
# Install Vercel CLI
npm install -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel --prod
```

### Opsi B: Via Vercel Dashboard (Web)

1. Buka https://vercel.com/new
2. Pilih "Import Git Repository"
3. Hubungkan GitHub dan pilih repository yang sudah di-push
4. **Pengaturan penting:**
   - **Framework Preset:** Next.js (otomatis terdeteksi)
   - **Build Command:** `next build` (biarkan default)
   - **Output Directory:** `next export` tidak perlu, biarkan default
   - **Root Directory:** biarkan default (`./`)
5. Klik **"Deploy"**

### Opsi C: Via Vercel CLI tanpa Git

Jika tidak ingin menggunakan Git:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy langsung dari folder proyek
vercel --prod
```

Pilih: `Y` untuk "Set up and deploy", lalu ikuti petunjuk.

---

## Langkah 3: Konfigurasi Database

Proyek ini menggunakan **SQLite** via `better-sqlite3`. Karena Vercel menggunakan filesystem **read-only** (serverless), SQLite biasa tidak akan berfungsi di production.

### Solusi: Migrasi ke PostgreSQL (via Neon - Gratis)

1. Daftar akun Neon di https://neon.tech
2. Buat project baru, dapatkan **Connection String** seperti:
   ```
   postgresql://user:pass@ep-something.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Update Kode untuk Support PostgreSQL

1. Install driver PostgreSQL:

```bash
npm install @neondatabase/serverless pg
npm install -D @types/pg
```

2. Buat file `src/lib/database.ts` baru yang mendeteksi environment:

```typescript
import { Pool, neonConfig } from "@neondatabase/serverless";
import Database from "better-sqlite3";
import type { Database as SqliteDb } from "better-sqlite3";

let db: Pool | SqliteDb;

if (process.env.DATABASE_URL) {
  neonConfig.fetchConnectionCache = true;
  db = new Pool({ connectionString: process.env.DATABASE_URL });
} else {
  db = new Database("./data.db");
}

export default db;
```

3. Atur Environment Variable di Vercel:
   - Buka **Vercel Dashboard → Project → Settings → Environment Variables**
   - Tambah variable: `DATABASE_URL` = connection string dari Neon
   - Tambah variable: `NEXT_PUBLIC_SITE_URL` = URL website Vercel (contoh: `https://smp-mutiara.vercel.app`)

### Alternatif: Gunakan Turso (SQLite Edge)

Jika ingin tetap pakai SQLite, gunakan Turso (SQLite untuk edge):

1. Install Turso CLI: https://docs.turso.tech/installation
2. Buat database:
```bash
turso db create smp-mutiara
turso db show smp-mutiara --url  # dapatkan URL
turso db create-token smp-mutiara  # dapatkan token
```

3. Install driver:
```bash
npm install @libsql/client
```

4. Update `src/lib/database.ts` untuk menggunakan Turso di production.

---

## Langkah 4: Post-Deployment

1. Buka URL Vercel yang diberikan (contoh: `https://smp-mutiara.vercel.app`)
2. Login ke panel admin: `/admin/login`
3. **Default login:** `admin` / `admin123`
4. Segera **ubah password default** setelah login pertama
5. Setel pengaturan website melalui menu **Pengaturan**

### Verifikasi

- [ ] Halaman beranda tampil dengan benar
- [ ] Hero slider berfungsi
- [ ] Navigasi mobile & desktop berfungsi
- [ ] Form SPMB bisa diakses
- [ ] Admin panel bisa login
- [ ] Backup database bisa dilakukan
- [ ] Sitemap & robots.txt bisa diakses

---

## Troubleshooting

### Error: "Cannot find module better-sqlite3"
SQLite tidak kompatibel dengan Vercel serverless. Solusi: migrasi ke PostgreSQL atau Turso.

### Error: 404 Not Found
Pastikan semua route ada di folder `src/app/`. Cek dengan `next build` lokal.

### Error: Database connection refused
- Pastikan environment variable `DATABASE_URL` sudah di-set
- Untuk Neon: pastikan IP allowlist di-set ke `Allow all`
- Restart deployment setelah ubah env variable

### Ingin Rollback?
Buka Vercel Dashboard → Deployments → Pilih versi sebelumnya → Klik "..."

---

## Referensi

- [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Neon PostgreSQL](https://neon.tech/docs)
- [Turso SQLite Edge](https://docs.turso.tech)
