# 📱 Multi Social — Social Media Management Platform

Aplikasi web manajemen media sosial terpadu untuk mengelola postingan ke **YouTube**, **Instagram**, **Facebook**, dan **TikTok** secara bersamaan dari satu dashboard.

Dirancang khusus untuk kebutuhan personal/penggunaan mandiri dan dioptimalkan untuk hosting di **Hostinger Business Hosting**.

---

## ✨ Fitur Utama

- 🏠 **Dashboard Terpadu**: Pantau ringkasan akun terhubung, total postingan, postingan terjadwal, dan postingan terbit.
- ✏️ **Post Composer & Scheduler**:
  - Tulis konten dan unggah media (gambar/video).
  - Pilih platform tujuan (YouTube, Instagram, Facebook, TikTok).
  - Validasi batas karakter otomatis per platform.
  - Jadwalkan waktu dan tanggal posting otomatis.
  - Simpan sebagai draf.
- 🔗 **Manajemen Akun Sosmed**: Hubungkan dan kelola 4 platform sosial media.
- 📝 **Daftar Postingan**: Filter dan pantau status setiap postingan (Draf, Terjadwal, Memposting, Terbit, Gagal).
- 🖼️ **Media Library**: Galeri media terpusat untuk menyimpan aset gambar dan video.
- 📅 **Kalender Konten**: Visualisasi jadwal konten.
- 📊 **Analitik**: Pemantauan metrik interaksi (Likes, Komentar, Views, Shares).
- ⚙️ **Pengaturan & Keamanan**: Kelola profil pengguna dan ganti kata sandi.
- ⏰ **Otomatisasi Penjadwalan (Cron Scheduler)**: Terintegrasi dengan tugas cron (cocok untuk cPanel/hPanel Hostinger).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ / 16 (App Router, Standalone Output)
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS + Komponen gaya shadcn/ui
- **Database**: MySQL (Kompatibel penuh dengan Hostinger MySQL)
- **ORM**: Prisma v6
- **Autentikasi**: NextAuth.js v5 (JWT Strategy & Prisma Adapter)
- **Scheduler**: node-cron & Webhook Cron endpoint (`/api/cron`)
- **Bahasa Antarmuka**: Full Bahasa Indonesia

---

## 🚀 Menjalankan di Lokal (Localhost)

### 1. Salin Environment
```bash
cp .env.example .env
```
Sesuaikan `DATABASE_URL` ke database MySQL lokal Anda:
```env
DATABASE_URL="mysql://root:password@localhost:3306/multi_social"
AUTH_SECRET="kunci-rahasia-acak-minimal-32-karakter"
AUTH_URL="http://localhost:3000"
```

### 2. Push Schema ke Database
```bash
npx prisma db push
```

### 3. Jalankan Seeding (Akun Demo & Akun Sosmed Default)
```bash
npm run seed
```
> Akun Demo bawaan:
> - **Email**: `admin@multisocial.com`
> - **Password**: `admin123`

### 4. Jalankan Server Development
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

---

## 🌐 Panduan Deploy ke Hostinger
Lihat panduan lengkap di file [HOSTINGER_DEPLOYMENT.md](./HOSTINGER_DEPLOYMENT.md).

---

## 📁 Struktur Direktori
```
multi-social/
├── prisma/
│   ├── schema.prisma         # Schema database MySQL
│   └── seed.ts               # Skrip seeder data awal
├── public/
│   └── uploads/              # Penyimpanan media lokal
├── src/
│   ├── app/
│   │   ├── (auth)/           # Halaman Masuk & Daftar
│   │   ├── (dashboard)/      # Beranda, Buat Postingan, Akun Sosmed, dll.
│   │   └── api/              # API Auth, Posts, Connect, & Cron
│   ├── components/
│   │   ├── layout/           # Sidebar, Header, User Menu
│   │   └── ui/               # Button, Card, Input, Textarea, Avatar, Badge
│   └── lib/
│       ├── auth.ts           # Konfigurasi NextAuth
│       ├── db.ts             # Prisma Client instance
│       ├── scheduler.ts      # Cron job scheduler auto-publish
│       └── platforms/        # Integrasi YouTube, IG, FB, TikTok
└── HOSTINGER_DEPLOYMENT.md   # Panduan deploy Hostinger
```
