# 📸 Facegram

Facegram adalah aplikasi media sosial sederhana yang terinspirasi dari Instagram, dibangun menggunakan **Laravel** sebagai backend API dan **React** sebagai frontend. Aplikasi ini memungkinkan pengguna untuk melakukan autentikasi, membuat postingan, mengunggah gambar, serta berinteraksi dengan konten pengguna lain.

---

## 🚀 Teknologi yang Digunakan

### Backend

* **Laravel** (RESTful API)
* Laravel Sanctum (Authentication Token)
* MySQL (Database)
* Storage Laravel (Upload & manajemen file)

### Frontend

* **React JS**
* Axios (HTTP Request)
* React Router DOM
* CSS / Bootstrap (Styling)

---

## ✨ Fitur Utama

* 🔐 Autentikasi (Register, Login, Logout)
* 👤 Manajemen akun pengguna
* 🖼️ Upload dan tampilkan postingan (gambar)
* 📰 Feed postingan pengguna
* 🔍 Pencarian data (user / post)
* 🔒 Proteksi route menggunakan token

---

## 📂 Struktur Proyek

### Backend (Laravel)

```
facegram-backend/
├── app/
│   ├── Http/Controllers/
│   ├── Models/
├── routes/
│   ├── api.php
├── database/
│   ├── migrations/
├── storage/
├── public/
└── .env
```

### Frontend (React)

```
facegram-frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
├── public/
└── package.json
```

---

## ⚙️ Instalasi & Konfigurasi

### 1️⃣ Backend (Laravel)

```bash
git clone https://github.com/username/facegram-backend.git
cd facegram-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan serve
```

> Pastikan konfigurasi database sudah diatur di file `.env`

---

### 2️⃣ Frontend (React)

```bash
git clone https://github.com/username/facegram-frontend.git
cd facegram-frontend
npm install
npm run dev
```

---

## 🔑 Autentikasi

Facegram menggunakan **Laravel Sanctum** untuk autentikasi berbasis token.

* Token dikirim melalui header:

```
Authorization: Bearer {token}
```

* Token disimpan di **localStorage** pada sisi frontend

---

## 🖼️ Upload Gambar

* Gambar disimpan menggunakan Laravel Storage
* Akses publik melalui:

```
/storage/filename.jpg
```

---

## 🔒 Keamanan

* Validasi request di backend
* Proteksi route menggunakan middleware `auth:sanctum`
* Password di-hash menggunakan bcrypt

---

## 📌 Catatan Pengembangan

* Pastikan backend berjalan sebelum frontend
* Gunakan environment terpisah untuk production
* Optimasi gambar disarankan untuk performa

---

## 📄 Lisensi

Proyek ini bersifat **open-source** dan bebas digunakan untuk pembelajaran dan pengembangan lebih lanjut.
