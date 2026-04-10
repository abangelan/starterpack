# 📦 StarterPack Tutorial – React + Laravel

> **StarterPack WebApp** adalah boilerplate siap pakai untuk membangun aplikasi web modern berbasis SPA (Single Page Application) menggunakan React JS + Laravel REST API, dilengkapi fitur autentikasi, manajemen pengguna, manajemen role, dan export data.

---

## 📋 Daftar Isi

1. [Requirement / Kebutuhan Sistem](#-1-requirement--kebutuhan-sistem)
2. [Cara Cepat Menggunakan (Clone Repo)](#-2-cara-cepat-menggunakan-clone-repo)
3. [Struktur Proyek](#-3-struktur-proyek)
4. [Konfigurasi Database](#-4-konfigurasi-database)
5. [Instalasi Backend (Laravel)](#-5-instalasi-backend-laravel)
6. [Instalasi Frontend (React)](#-6-instalasi-frontend-react)
7. [Menjalankan Aplikasi](#-7-menjalankan-aplikasi)
8. [Login Pertama Kali](#-8-login-pertama-kali)
9. [Fitur yang Tersedia](#-9-fitur-yang-tersedia)
10. [Panduan Pengembangan Lanjutan](#-10-panduan-pengembangan-lanjutan)
11. [Troubleshooting](#-11-troubleshooting)

---

## ⚙️ 1. Requirement / Kebutuhan Sistem

Pastikan komputer Anda sudah memiliki software berikut sebelum memulai:

| Software | Versi Minimum | Keterangan |
|----------|---------------|------------|
| **XAMPP** | 8.x (PHP 8.1+) | Apache + MySQL + PHP |
| **Node.js** | 18.x atau lebih | Runtime JavaScript |
| **npm** | 9.x atau lebih | Package manager Node |
| **Composer** | 2.x | Package manager PHP |
| **Git** *(opsional)* | 2.x | Version control |

### 📥 Link Download

- **XAMPP**: https://www.apachefriends.org/download.html
- **Node.js**: https://nodejs.org/ *(pilih LTS)*
- **Composer**: https://getcomposer.org/download/

### Cek Versi (via Terminal / CMD)
```bash
php -v          # PHP 8.1+
composer -V     # Composer 2.x
node -v         # v18.x atau lebih
npm -v          # 9.x atau lebih
```

---

## 🚀 2. Cara Cepat Menggunakan (Clone Repo)

Jika Anda ingin langsung menggunakan StarterPack ini di komputer Anda, ikuti langkah-langkah berikut:

### Langkah 1 – Clone Repository
Buka Terminal/CMD Anda, lalu jalankan:
```bash
# Masuk ke folder htdocs XAMPP (atau folder project Anda)
cd /path/ke/htdocs

# Clone repository
git clone https://github.com/abangelan/starterpack.git

# Masuk ke folder proyek
cd starterpack
```

### Langkah 2 – Persiapan Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```
*Catatan: Sesuaikan detail database di `.env` sebelum lanjut ke migrasi.*

### Langkah 3 – Persiapan Frontend
```bash
cd ../frontend
npm install --legacy-peer-deps
```

---

## 📁 3. Struktur Proyek

Setelah Anda melakukan clone, folder utama proyek akan memiliki struktur sebagai berikut:

```
starterpack/
├── frontend/              ← React App (berjalan di port 3000)
├── backend/               ← Laravel REST API
├── prd.md                 ← Product Requirements Document
└── Tutorial.md            ← File Panduan Lengkap
```

---

## 🗄️ 4. Konfigurasi Database

### Langkah 1 – Aktifkan XAMPP

Buka **XAMPP Control Panel** dan aktifkan:
- ✅ **Apache**
- ✅ **MySQL**

### Langkah 2 – Buat Database

**Cara A – via phpMyAdmin (Rekomendasi untuk pemula):**
1. Buka browser → `http://localhost/phpmyadmin`
2. Klik **"New"** di panel kiri
3. Masukkan nama database: `starterpack_db`
4. Pilih collation: `utf8mb4_unicode_ci`
5. Klik **Create**

---

## 🔧 5. Instalasi Backend (Laravel)

### Langkah 1 – Salin folder ke htdocs

Pastikan folder `starterpack/` berada di dalam direktori `htdocs` XAMPP:

| OS | Path |
|----|------|
| **Windows** | `C:\xampp\htdocs\starterpack\` |
| **macOS** | `/Applications/XAMPP/xamppfiles/htdocs/starterpack/` |
| **Linux** | `/opt/lampp/htdocs/starterpack/` |

### Langkah 2 – Install dependency PHP

Buka Terminal/CMD → masuk ke folder `backend/`:

```bash
cd /path/ke/starterpack/backend

# Install semua paket PHP
composer install
```

> ⏳ Proses ini membutuhkan koneksi internet dan memakan waktu beberapa menit.

### Langkah 3 – Konfigurasi `.env` Backend

```bash
# Salin file contoh konfigurasi
cp .env.example .env
```

Buka file `.env` dengan editor teks, sesuaikan bagian berikut:

```env
APP_NAME=StarterPack
APP_URL=http://localhost/starterpack/backend/public

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=starterpack_db
DB_USERNAME=root
DB_PASSWORD=           ← Kosongkan jika XAMPP default (tanpa password)
```

### Langkah 4 – Generate App Key & Migrasi

```bash
# Generate application key
php artisan key:generate

# Jalankan migrasi — membuat semua tabel di database
php artisan migrate

# Isi data awal: roles + user admin
php artisan db:seed
```

Output yang diharapkan:
```
✅ Seed berhasil!
🔑 Login: admin@starterpack.com / password
```

---

## ⚛️ 6. Instalasi Frontend (React)

### Langkah 1 – Masuk ke folder `frontend/`

```bash
cd /path/ke/starterpack/frontend
```

### Langkah 2 – Install dependency Node.js

```bash
npm install --legacy-peer-deps
```

---

## ▶️ 7. Menjalankan Aplikasi

### Jalankan Backend

**Pilihan A – Via XAMPP Apache (Direkomendasikan):**
- Pastikan **Apache** & **MySQL** di XAMPP sudah `Start`
- Backend otomatis tersedia di: `http://localhost/starterpack/backend/public/api`

**Pilihan B – Via `php artisan serve`:**
```bash
cd /path/ke/starterpack/backend
php artisan serve --port=8000
```

### Jalankan Frontend (React Dev Server)

Buka terminal **baru**:

```bash
cd /path/ke/starterpack/frontend
npm start
```

Browser akan otomatis terbuka di **`http://localhost:3000`**

---

## 🔑 8. Login Pertama Kali

Masukkan kredensial default:

| Field | Nilai |
|-------|-------|
| **Email** | `admin@starterpack.com` |
| **Password** | `password` |

---

## ✨ 9. Fitur yang Tersedia

### 🏠 Dashboard
- 11 variasi tampilan dashboard
- Proteksi halaman (harus login)

### 👥 Manajemen Pengguna (`/user-management`)
CRUD lengkap, Search, Filter Role/Status, Pagination, dan Export Excel/PDF.

### 🛡️ Manajemen Role (`/role-management`)
CRUD lengkap, Search, Filter Status, dan Export Excel/PDF.

---

## 🛠️ 10. Panduan Pengembangan Lanjutan

Tersedia di file `Tutorial.md` lengkap untuk cara menambah halaman, endpoint API, dan konfigurasi produksi.

---

## 🐛 11. Troubleshooting

Jika mengalami kendala, silakan cek bagian **Troubleshooting** di file `Tutorial.md` atau pastikan versi PHP dan Node.js Anda sudah sesuai.

---

Terima kasih salam, Abang Elan
