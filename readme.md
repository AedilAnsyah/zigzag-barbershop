# Zigzag Barbershop - Tugas Besar IPPL

Repositori ini berisi kode sumber untuk aplikasi **Zigzag Barbershop**, sebuah sistem informasi dan manajemen pemesanan yang dikembangkan khusus untuk mitra kami, **Zigzag Barbershop**. Proyek ini dibuat sebagai bagian dari **Tugas Besar mata kuliah Implementasi Proyek Perangkat Lunak (IPPL)**.

---

## 👥 Anggota Tim Pengembang

Proyek ini dirancang dan dikembangkan oleh tim mahasiswa berikut:

| Nama | Peran | Kontribusi Utama |
| :--- | :--- | :--- |
| **Aedil Riski Ansyah** | Project Manager (PM) | Manajemen proyek, koordinasi tim, dan perencana backlog |
| **Dealova Agta Syahlevi** | UI/UX Designer | Desain antarmuka pengguna, user flow, dan wireframing |
| **Sinta Sintiani** | UI/UX Designer | Desain antarmuka pengguna, visual assets, dan prototyping |
| **Ridha Akifah** | Front End Developer | Implementasi antarmuka klien dan integrasi API frontend |
| **Ma'ruf Sarifudin** | Front End Developer | Implementasi antarmuka klien dan integrasi API frontend |
| **Marzhendo Galang Saputra** | Back End Developer | Arsitektur database, pembuatan REST API, dan logika bisnis backend |

---

## 🛠️ Arsitektur & Teknologi

Aplikasi ini menggunakan pemisahan yang jelas antara frontend dan backend (decoupled architecture) dengan teknologi berikut:

### Frontend
- **Framework**: React.js (React 19)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios (untuk integrasi REST API)
- **Icons**: Lucide React & React Icons

### Backend
- **Bahasa Pemrograman**: Go (Golang)
- **Web Framework**: Gin Gonic
- **Database ORM**: GORM (Object Relational Mapping)
- **Database**: SQLite (untuk development lokal: `zigzag.db`) / mendukung PostgreSQL

---

## 📂 Struktur Repositori

```bash
zigzag-barbershop/
├── api/             # Definisi API / endpoint backend
├── cmd/             # Entrypoint utama untuk menjalankan aplikasi backend Go
├── config/          # Konfigurasi aplikasi backend
├── database/        # Inisialisasi database dan migrasi
├── docs/            # Dokumentasi tambahan proyek
├── frontend/        # Kode sumber aplikasi Frontend (React.js)
│   ├── public/      # Aset statis public frontend
│   └── src/         # Komponen, halaman, dan logika React
├── internal/        # Logika bisnis inti backend (Handlers, Services, Repositories)
├── pkg/             # Package pembantu backend yang reusable
└── zigzag.db        # File database lokal SQLite
```

---

## 🚀 Cara Menjalankan Proyek

### 1. Menjalankan Backend (Go)
Pastikan Anda sudah menginstal **Go (versi 1.25.0 ke atas)** di komputer Anda.

1. Buka terminal pada root direktori proyek.
2. Salin berkas lingkungan contoh:
   ```bash
   cp .env.example .env
   ```
3. Sesuaikan konfigurasi di dalam `.env` jika diperlukan.
4. Jalankan server backend:
   ```bash
   go run cmd/main.go
   ```
   *Server backend akan berjalan di port default (biasanya port `8080` atau sesuai konfigurasi `.env`).*

### 2. Menjalankan Frontend (React)
Pastikan Anda sudah menginstal **Node.js** dan **npm** di komputer Anda.

1. Pindah ke direktori frontend:
   ```bash
   cd frontend
   ```
2. Instal semua dependensi:
   ```bash
   npm install
   ```
3. Jalankan aplikasi frontend dalam mode development:
   ```bash
   npm start
   ```
   *Aplikasi frontend akan terbuka di browser Anda secara otomatis di alamat `http://localhost:3000`.*

---

## 🤝 Mitra Kami
- **Zigzag Barbershop**