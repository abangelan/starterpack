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
# Pastikan Anda berada di folder htdocs XAMPP
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
cp .env.example .env  # Pastikan file .env ada jika tersedia
```

---

## 📁 3. Struktur Proyek

Setelah Anda melakukan clone, folder utama proyek akan memiliki struktur sebagai berikut:

```
starterpack/
├── frontend/              ← React App (berjalan di port 3000)
├── backend/               ← Laravel REST API
├── prd.md                 ← Product Requirements Document
└── Tutorial.md            ← File Panduan Lengkap (File ini)
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

**Cara B – via Terminal:**
```bash
# Windows (XAMPP)
C:\xampp\mysql\bin\mysql.exe -u root -p

# macOS (XAMPP)
/Applications/XAMPP/xamppfiles/bin/mysql -u root -p

# Setelah masuk prompt MySQL:
CREATE DATABASE starterpack_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

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

SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost
FRONTEND_URL=http://localhost:3000
```

> ⚠️ **Penting untuk Windows**: Ganti separator path di `APP_URL` jika perlu. Jika XAMPP MySQL Anda menggunakan password, isi `DB_PASSWORD`.

### Langkah 4 – Generate App Key & Migrasi

```bash
# Generate application key (WAJIB dilakukan setiap clone/copy baru)
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

> ⚠️ **Jika migrate gagal**: Pastikan database `starterpack_db` sudah dibuat dan konfigurasi `.env` sudah benar.

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

> ⏳ Proses ini memerlukan koneksi internet dan membutuhkan beberapa menit.  
> Flag `--legacy-peer-deps` diperlukan karena beberapa paket WowDash template menggunakan versi peer dependency yang lama.

### Langkah 3 – Konfigurasi `.env` Frontend

Buka file `frontend/.env` dan pastikan URL backend sudah benar:

```env
NODE_PATH=./src
REACT_APP_API_URL=http://localhost/starterpack/backend/public/api
```

> **Jika backend pakai `php artisan serve` (port 8000):**
> ```env
> REACT_APP_API_URL=http://localhost:8000/api
> ```

---

## ▶️ 7. Menjalankan Aplikasi

### Jalankan Backend

**Pilihan A – Via XAMPP Apache (Direkomendasikan):**
- Pastikan **Apache** & **MySQL** di XAMPP sudah `Start`
- Backend otomatis tersedia di:
  ```
  http://localhost/starterpack/backend/public/api
  ```
- Tidak butuh command tambahan ✅

**Pilihan B – Via `php artisan serve`:**
```bash
cd /path/ke/starterpack/backend
php artisan serve --port=8000
```
*(Jika pakai pilihan ini, ubah `REACT_APP_API_URL` di `frontend/.env` ke `http://localhost:8000/api`)*

### Jalankan Frontend (React Dev Server)

Buka terminal **baru** (jangan tutup terminal backend):

```bash
cd /path/ke/starterpack/frontend
npm start
```

Browser akan otomatis terbuka di **`http://localhost:3000`**

Jika tidak otomatis, buka manual di browser.

---

## 🔑 8. Login Pertama Kali

1. Buka browser → **`http://localhost:3000`**
2. Akan otomatis redirect ke halaman **Sign In**
3. Masukkan kredensial default:

| Field | Nilai |
|-------|-------|
| **Email** | `admin@starterpack.com` |
| **Password** | `password` |

4. Klik tombol **Masuk**
5. Anda masuk ke **Dashboard** utama 🎉

### Akun Sample yang Tersedia

| Email | Password | Role | Status |
|-------|----------|------|--------|
| `admin@starterpack.com` | `password` | Super Admin | Aktif |
| `admin2@starterpack.com` | `password` | Admin | Aktif |
| `user@starterpack.com` | `password` | User | Aktif |
| `inactive@starterpack.com` | `password` | User | Nonaktif |

> ⚠️ **Segera ganti password** admin setelah login pertama untuk keamanan sistem.

---

## ✨ 9. Fitur yang Tersedia

### 🏠 Dashboard
- 11 variasi tampilan dashboard (tersedia di menu sidebar)
- Semua halaman dilindungi — harus login terlebih dahulu

### 👥 Manajemen Pengguna (`/user-management`)

| Fitur | Keterangan |
|-------|-----------|
| 📋 Lihat Daftar | Tabel pengguna: Nama, Email, Role, Status |
| 🔍 Pencarian | Real-time cari berdasarkan nama atau email |
| 🎭 Filter Role | Filter berdasarkan role yang dipilih |
| 🔘 Filter Status | Filter berdasarkan Aktif / Nonaktif |
| 📄 Per Halaman | Pilih 10 / 25 / 50 / 100 data per halaman |
| ➕ Tambah | Form modal: nama, email, password, role, status |
| ✏️ Edit | Form modal prefilled, password opsional saat edit |
| 🗑️ Hapus | Konfirmasi sebelum dihapus permanen |
| 📊 Export Excel | Download `.xlsx` sesuai filter aktif |
| 📄 Export PDF | Download `.pdf` sesuai filter aktif |

### 🛡️ Manajemen Role (`/role-management`)

| Fitur | Keterangan |
|-------|-----------|
| 📋 Lihat Daftar | Tabel role: Nama, Deskripsi, Jumlah User, Status |
| 🔍 Pencarian | Cari berdasarkan nama role |
| 🔘 Filter Status | Filter Aktif / Nonaktif |
| ➕ Tambah | Form modal: nama, deskripsi, status |
| ✏️ Edit | Update nama, deskripsi, status |
| 🗑️ Hapus | Tidak bisa hapus jika masih digunakan user |
| 📊 Export Excel | Download `.xlsx` |
| 📄 Export PDF | Download `.pdf` |

### 🔐 Autentikasi
- Login dengan email + password
- Token tersimpan di localStorage (Sanctum Token)
- Semua halaman protected (auto-redirect ke login jika belum masuk)
- Logout via tombol di navbar kanan atas
- Nama pengguna ditampilkan di navbar

---

## 🛠️ 10. Panduan Pengembangan Lanjutan

### Menambah Halaman Baru

**Langkah 1 – Buat komponen layer:**
```jsx
// src/components/ContohLayer.jsx
const ContohLayer = () => {
  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header">
        <h5 className="mb-0">Halaman Baru</h5>
      </div>
      <div className="card-body">
        Isi konten halaman baru di sini
      </div>
    </div>
  );
};
export default ContohLayer;
```

**Langkah 2 – Buat page wrapper:**
```jsx
// src/pages/ContohPage.jsx
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ContohLayer from "../components/ContohLayer";

const ContohPage = () => (
  <MasterLayout>
    <Breadcrumb title="Judul Halaman" />
    <ContohLayer />
  </MasterLayout>
);
export default ContohPage;
```

**Langkah 3 – Daftarkan route di `App.js`:**
```jsx
import ContohPage from "./pages/ContohPage";

// Di dalam <Routes>:
<Route exact path='/contoh'
  element={<PrivateRoute><ContohPage /></PrivateRoute>}
/>
```

**Langkah 4 – Tambah menu di sidebar (`MasterLayout.jsx`):**
```jsx
<li>
  <NavLink
    to='/contoh'
    className={(navData) => (navData.isActive ? "active-page" : "")}
  >
    <Icon icon="solar:document-bold-duotone" className='menu-icon' />
    <span>Contoh Menu</span>
  </NavLink>
</li>
```

### Menambah Endpoint API Baru (Backend)

**Langkah 1 – Buat Controller:**
```bash
php artisan make:controller Api/ContohController --api
```

**Langkah 2 – Tambah route di `backend/routes/api.php`:**
```php
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('/contoh', ContohController::class);
});
```

**Langkah 3 – Buat API call di frontend (`src/api/contoh.js`):**
```js
import axiosInstance from "./axios";

export const getContohApi = (params) =>
  axiosInstance.get("/contoh", { params });

export const createContohApi = (data) =>
  axiosInstance.post("/contoh", data);

export const updateContohApi = (id, data) =>
  axiosInstance.put(`/contoh/${id}`, data);

export const deleteContohApi = (id) =>
  axiosInstance.delete(`/contoh/${id}`);
```

### Mengubah Konfigurasi untuk Production / Domain Lain

Edit `frontend/.env`:
```env
REACT_APP_API_URL=https://domain-anda.com/backend/public/api
```

Edit `backend/.env`:
```env
APP_URL=https://domain-anda.com/backend/public
SANCTUM_STATEFUL_DOMAINS=domain-anda.com
FRONTEND_URL=https://domain-anda.com
```

Edit `backend/config/cors.php`:
```php
'allowed_origins' => ['https://domain-anda.com'],
```

---

## 🐛 11. Troubleshooting

### ❌ `Failed to compile` — Module not found: axios
```bash
cd frontend
npm install axios --legacy-peer-deps
```

### ❌ `CORS error` di browser console
Pastikan di `backend/config/cors.php`:
```php
'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,
```
Dan di `backend/.env`:
```env
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost
```

### ❌ `404 Not Found` pada Endpoint API
Jika login mengembalikan error 404, pastikan API routes sudah diaktifkan di **`backend/bootstrap/app.php`**:
```php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    api: __DIR__.'/../routes/api.php', // Pastikan baris ini ada
    commands: __DIR__.'/../routes/console.php',
    health: '/up',
)
```

### ❌ `Fatal error: Composer detected issues... PHP version >= 8.4.0`
Ini terjadi karena XAMPP Apache Anda menggunakan PHP versi lama (misalnya 7.4). 
**Solusinya**: Gunakan `php artisan serve` dengan PHP versi terbaru:
1. Jalankan: `php artisan serve --port=8000`.
2. Update `REACT_APP_API_URL` di `frontend/.env` ke `http://localhost:8000/api`.

### ❌ `401 Unauthorized` saat login
- Pastikan database `starterpack_db` sudah dibuat
- Jalankan: `php artisan migrate && php artisan db:seed`
- Cek konfigurasi `DB_*` di `backend/.env`

### ❌ API tidak bisa diakses / `502 Bad Gateway`
- Pastikan XAMPP **Apache** sudah aktif
- Cek URL di `frontend/.env` sudah benar
- Pastikan folder `backend/` ada di dalam `htdocs/starterpack/`

### ❌ Export Excel / PDF gagal
```bash
cd backend
composer require maatwebsite/excel barryvdh/laravel-dompdf
php artisan vendor:publish --provider="Maatwebsite\Excel\ExcelServiceProvider" --tag=config
php artisan vendor:publish --provider="Barryvdh\DomPDF\ServiceProvider"
```

### ❌ `npm install` error peer dependency
```bash
npm install --legacy-peer-deps
```

### ❌ Blank page / halaman kosong
Buka DevTools browser (F12) → tab **Console**:
- `Network Error` → Cek backend running & URL `.env` benar
- `Cannot read property of undefined` → Format response API mungkin berbeda
- `Unexpected token` → Biasanya response bukan JSON (cek URL backend)

### ❌ `php artisan` tidak ditemukan di PATH (macOS)
```bash
# Gunakan PHP dari XAMPP langsung
/Applications/XAMPP/xamppfiles/bin/php artisan migrate

# Atau tambahkan ke PATH (di ~/.zshrc atau ~/.bash_profile):
export PATH="/Applications/XAMPP/xamppfiles/bin:$PATH"
```

### ❌ `php artisan` tidak ditemukan di PATH (Windows)
Tambahkan path PHP XAMPP ke Environment Variables:
```
C:\xampp\php
```
Atau gunakan langsung:
```cmd
C:\xampp\php\php.exe artisan migrate
```

---

## 📌 Quick Reference – Perintah Penting

```bash
# ============ BACKEND ============

# Install dependency (setelah clone/copy)
composer install

# Generate app key (WAJIB di komputer baru)
php artisan key:generate

# Buat semua tabel
php artisan migrate

# Reset semua tabel + isi data awal
php artisan migrate:fresh --seed

# Hanya isi data awal (tanpa reset)
php artisan db:seed

# Jalankan server development (port 8000)
php artisan serve --port=8000

# Clear semua cache
php artisan config:clear && php artisan cache:clear && php artisan route:clear

# ============ FRONTEND ============

# Install dependency (setelah clone/copy)
npm install --legacy-peer-deps

# Jalankan development server (port 3000)
npm start

# Build untuk production
npm run build
```

---

## 📞 Informasi Proyek

| Item | Detail |
|------|--------|
| **Frontend** | React 18 + WowDash Admin Template |
| **Backend** | Laravel 13 + Sanctum |
| **Database** | MySQL (via XAMPP) |
| **Export Excel** | maatwebsite/excel v3.1 |
| **Export PDF** | barryvdh/laravel-dompdf v3.1 |
| **Auth** | Sanctum Personal Access Token |
| **PHP Minimum** | 8.3+ |
| **Node Minimum** | 18.x LTS |

---
Terima kasih salam, Abang Elan
