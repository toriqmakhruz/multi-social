# 🚀 Panduan Deploy Multi Social ke Hostinger Business Hosting

Panduan langkah demi langkah untuk menjalankan **Multi Social** di layanan **Hostinger Business Web Hosting / Cloud Hosting**.

---

## 📋 Persyaratan di Hostinger
1. Paket **Business Web Hosting** atau **Cloud Hosting** (yang mendukung menu **Node.js** di hPanel).
2. Database **MySQL** aktif di hPanel.
3. Akses Git atau SSH/FTP ke hosting.

---

## 🛠️ Langkah 1: Buat Database MySQL di Hostinger
1. Masuk ke **hPanel Hostinger** → buka menu **Databases** → **Manajemen Database MySQL**.
2. Masukkan nama database, misalnya: `u123456789_multisocial`.
3. Buat username, misalnya: `u123456789_user`.
4. Masukkan password database yang kuat (catat password ini).
5. Klik **Buat**.

---

## ⚙️ Langkah 2: Konfigurasi File Environment (.env)
Sesuaikan file `.env` di server dengan kredensial Hostinger Anda:

```env
# Format: mysql://USERNAME:PASSWORD@localhost:3306/NAMA_DATABASE
DATABASE_URL="mysql://u123456789_user:PasswordAnda@localhost:3306/u123456789_multisocial"

# NextAuth Secret (bisa di-generate via `openssl rand -base64 32`)
AUTH_SECRET="kunci-rahasia-acak-yang-sangat-panjang-dan-aman"
AUTH_URL="https://domainanda.com"

# Kunci rahasia untuk trigger cron scheduler via Hostinger Webhook
CRON_SECRET="kunci-cron-rahasia-123"

# Upload Directory
UPLOAD_DIR="./public/uploads"
```

---

## 📦 Langkah 3: Setup Node.js di hPanel Hostinger
1. Di hPanel Hostinger, cari dan buka menu **Node.js**.
2. Klik **Buat Aplikasi** (Create Application).
3. Isi konfigurasi berikut:
   - **Node.js Version**: Pilih `Node.js 20.x` atau `Node.js 22.x` (LTS).
   - **Application Mode**: `Production`.
   - **Application Root**: `public_html` atau path folder project Anda.
   - **Application Startup File**: `server.js` (dihasilkan oleh output standalone Next.js) atau jalankan `npm start`.
4. Upload file proyek ke folder tersebut (kecuali `node_modules`).

---

## 🗄️ Langkah 4: Migrasi Database & Seeding
Buka terminal SSH di Hostinger atau gunakan menu Git/Terminal:

```bash
# 1. Install dependencies
npm install --omit=dev

# 2. Push schema Prisma ke database MySQL Hostinger
npx prisma db push

# 3. (Opsional) Jalankan data demo awal (Admin + 4 Sosmed Dummy)
npm run seed
```

> **Akun Default Demo**:
> - Email: `admin@multisocial.com`
> - Password: `admin123`

---

## ⏰ Langkah 5: Setup Auto-Publish Cron Job di Hostinger
Agar postingan yang dijadwalkan otomatis terbit tepat waktu:

1. Di hPanel Hostinger, buka menu **Tingkat Lanjut** (Advanced) → **Tugas Cron** (Cron Jobs).
2. Pilih jenis: **Perintah Kustom** atau **URL**.
3. Jika menggunakan opsi URL / Curl:
   - **Frekuensi**: Setiap 1 menit (`* * * * *`) atau setiap 5 menit (`*/5 * * * *`).
   - **Perintah**:
   ```bash
   curl -s "https://domainanda.com/api/cron?secret=kunci-cron-rahasia-123" > /dev/null
   ```
4. Klik **Simpan**.

---

## 🔗 Langkah 6: Hubungkan API Kredensial Sosial Media (Live Production)
Saat ingin beralih dari mode demo ke publikasi akun sungguhan:
1. **YouTube**: Daftarkan project di [Google Cloud Console](https://console.cloud.google.com/), aktifkan **YouTube Data API v3**, buat OAuth 2.0 Client ID.
2. **Instagram & Facebook**: Daftarkan app di [Meta for Developers](https://developers.facebook.com/), tambahkan produk **Facebook Login for Business** & **Instagram Graph API**.
3. **TikTok**: Daftarkan app di [TikTok for Developers](https://developers.tiktok.com/), aktifkan **Content Posting API**.
4. Masukkan `CLIENT_ID` dan `CLIENT_SECRET` masing-masing ke `.env`.
