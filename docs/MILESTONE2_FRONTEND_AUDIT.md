# MILESTONE 2 — FRONTEND AUDIT REPORT

> Dibuat: 2026-06-04  
> Scope: Seluruh customer booking flow — dari login sampai riwayat

---

## Ringkasan Eksekutif

Frontend saat ini **belum terhubung ke API sama sekali**. Tidak ada satu pun file API service (`api.js`, `axios`, `fetch`). Seluruh halaman bekerja secara lokal dengan data statis (hardcoded). Tidak ada token management, tidak ada auth context, dan tidak ada state management global.

---

## 1. Peta Route & Komponen

```
App.js
├── /                   → Home + Services + OurBarber (landing page)
├── /layanan            → Layanan (daftar semua layanan)
├── /booking            → Reservasi (step 1: pilih layanan)
├── /barber             → Barber   (step 2: pilih barber)
├── /waktu              → Waktu    (step 3: pilih tanggal & jam)
├── /review             → Ulasan   (step 4: review & konfirmasi)
├── /payment            → Payment  (step 5: pembayaran QRIS)
├── /history            → Riwayat  (riwayat booking)
├── /masuk              → SignIn   (login)
└── /daftar             → SignUp   (register)
```

---

## 2. Status Per Halaman

### 2.1 Halaman Login — `pages/SignIn.jsx`

| Aspek | Status | Detail |
|-------|--------|--------|
| UI | ✅ Selesai | Form email + password, tombol Google (non-fungsional) |
| API Login | ❌ Belum | `handleSubmit` hanya `console.log` + `alert("Berhasil Masuk!")` |
| Simpan Token JWT | ❌ Belum | Tidak ada `localStorage.setItem` / cookie |
| Redirect setelah login | ⚠️ Parsial | Redirect ke `/` tapi tidak ada proteksi halaman |
| Error handling | ❌ Belum | Tidak ada penanganan error dari API |
| Loading state | ❌ Belum | Tidak ada indikator loading saat submit |

**Endpoint yang harus disambungkan:** `POST /api/auth/login`

**Yang perlu diubah:**
- Ganti `handleSubmit` dengan `fetch`/`axios` ke `POST /api/auth/login`
- Simpan JWT token ke `localStorage`
- Tampilkan pesan error jika login gagal (email/password salah)
- Tambah loading state pada tombol submit

---

### 2.2 Halaman Register — `pages/SignUp.jsx`

| Aspek | Status | Detail |
|-------|--------|--------|
| UI | ✅ Selesai | Form nama, email, password |
| API Register | ❌ Belum | `handleSubmit` hanya `console.log` + `alert("Akun berhasil dibuat!")` |
| Redirect setelah daftar | ✅ | Redirect ke `/masuk` sudah benar |
| Error handling | ❌ Belum | Tidak ada penanganan error (email duplikat, dll) |
| Loading state | ❌ Belum | Tidak ada indikator loading |

**Endpoint yang harus disambungkan:** `POST /api/auth/register`

**Yang perlu diubah:**
- Ganti `handleSubmit` dengan call ke `POST /api/auth/register`
- Field `fullname` harus dikirim sebagai `name` (sesuai skema backend)
- Tampilkan pesan error jika email sudah terdaftar

---

### 2.3 Halaman Reservasi (Step 1) — `pages/booking/Reservasi.jsx`

| Aspek | Status | Detail |
|-------|--------|--------|
| UI | ✅ Selesai | Tampilan card layanan, sidebar detail |
| Data Layanan | ❌ Hardcoded | Array `services` di-define langsung di file (hanya 1 item) |
| API Layanan | ❌ Belum | Tidak ada fetch ke `GET /api/services` |
| Auth Guard | ❌ Belum | Halaman bisa diakses tanpa login |
| State passing | ✅ | Meneruskan `service` object via `navigate state` |

**Endpoint yang harus disambungkan:** `GET /api/services`

**Yang perlu diubah:**
- Fetch data layanan dari `GET /api/services` saat komponen mount
- Tampilkan loading skeleton selama fetch
- Handle error jika API gagal
- Tambah auth guard: redirect ke `/masuk` jika belum login
- Harga dari API kemungkinan bertipe `int` (misal `50000`), perlu format ke `Rp 50.000,-`

**Catatan Kritis:** Data service di `Reservasi.jsx` berbeda dengan di `Layanan.jsx` dan `Services.jsx` — ada duplikasi data statis di 3 tempat berbeda.

---

### 2.4 Halaman Barber (Step 2) — `pages/booking/Barber.jsx`

| Aspek | Status | Detail |
|-------|--------|--------|
| UI | ✅ Selesai | Card grid barber, sidebar detail, navigasi antar step |
| Data Barber | ❌ Hardcoded | Array `barbers` berisi 4 item dengan `name: "Nama"` dan `description: "deskripsi"` |
| API Barber | ❌ Belum | Tidak ada fetch ke `GET /api/barbers` |
| Foto Barber | ❌ Belum | Foto hanya placeholder kotak abu-abu (`bg-[#D9D9D9]`) |
| Auth Guard | ❌ Belum | Halaman bisa diakses tanpa login |
| State passing | ✅ | Meneruskan `service` + `barber` via `navigate state` |

**Endpoint yang harus disambungkan:** `GET /api/barbers`

**Yang perlu diubah:**
- Fetch data barber dari `GET /api/barbers` saat mount
- Render foto barber dari URL yang dikembalikan API (jika ada field `photo`)
- Tambah auth guard
- Handle kasus barber tidak tersedia / API error

---

### 2.5 Halaman Waktu (Step 3) — `pages/booking/Waktu.jsx`

| Aspek | Status | Detail |
|-------|--------|--------|
| UI | ✅ Selesai | DatePicker + grid tombol waktu |
| Slot Waktu | ❌ Hardcoded | Array `availableTimes` berisi jam 11.00–20.00 statis |
| Cek Ketersediaan | ❌ Belum | Tidak ada pengecekan apakah slot sudah terisi |
| Auth Guard | ❌ Belum | Halaman bisa diakses tanpa login |
| State passing | ✅ | Meneruskan `service`, `barber`, `date`, `time` via `navigate state` |

**Endpoint:** Tidak ada endpoint khusus saat ini. Slot waktu bersifat statis per aturan bisnis.

**Yang perlu diubah:**
- Tambah auth guard
- Pertimbangkan mengambil slot yang sudah dibooking dari backend untuk di-disable (opsional, bergantung keputusan bisnis)
- Format tanggal ke ISO sebelum dikirim ke API

---

### 2.6 Halaman Ulasan/Review (Step 4) — `pages/booking/Ulasan.jsx`

| Aspek | Status | Detail |
|-------|--------|--------|
| UI | ✅ Selesai | Tampilan ringkasan reservasi + modal konfirmasi |
| Submit Booking | ❌ Belum | Tombol "Lanjut Pembayaran" hanya navigate ke `/payment`, tidak POST ke API |
| API Booking | ❌ Belum | Tidak ada call ke `POST /api/booking` |
| Auth Guard | ❌ Belum | Halaman bisa diakses tanpa login |
| Error handling | ❌ Belum | Tidak ada handling jika booking gagal |
| Loading state | ❌ Belum | Tidak ada indikator loading saat konfirmasi |

**Endpoint yang harus disambungkan:** `POST /api/booking`

**Payload yang harus dikirim:**
```json
{
  "service_id": 1,
  "barber_id": 2,
  "booking_date": "2026-06-10",
  "booking_time": "14:00"
}
```

**Yang perlu diubah:**
- Ubah tombol "Lanjut Pembayaran" menjadi: call `POST /api/booking` terlebih dahulu dengan JWT token
- Jika berhasil, navigate ke `/payment` dengan `booking_id` dari response
- Jika gagal, tampilkan pesan error di modal
- Tambah loading state

---

### 2.7 Halaman Payment — `pages/booking/Payment.jsx`

| Aspek | Status | Detail |
|-------|--------|--------|
| UI | ✅ Selesai | Tampilan ringkasan + gambar QRIS |
| Konfirmasi Bayar | ❌ Belum | Tombol "Konfirmasi" tidak memiliki handler `onClick` |
| API Payment | ❌ Belum | Tidak ada call ke `POST /api/payment` (endpoint ada tapi handler masih kosong di backend) |
| Status Update | ❌ Belum | Tidak ada update status booking setelah bayar |

**Endpoint yang tersedia:** `POST /api/payment` (handler kosong di backend — perlu implementasi backend dulu)

**Yang perlu diubah:**
- Tambah `onClick` pada tombol "Konfirmasi"
- Setelah konfirmasi, navigate ke `/history` atau tampilkan halaman sukses
- Sinkronkan dengan backend jika endpoint payment sudah siap

---

### 2.8 Halaman Riwayat — `pages/Riwayat.jsx`

| Aspek | Status | Detail |
|-------|--------|--------|
| UI | ✅ Selesai | List kartu riwayat dengan badge status |
| Data Riwayat | ❌ Hardcoded | Array `dataRiwayat` berisi 3 item statis |
| API Riwayat | ❌ Belum | Tidak ada fetch ke `GET /api/booking` |
| Auth Guard | ❌ Belum | Halaman bisa diakses tanpa login |
| Batalkan Booking | ❌ Belum | Tidak ada tombol batal / call ke `PUT /api/booking/:id/cancel` |
| Nama barber | ❌ Kosong | Field `barber` di hardcoded data berisi string `"dengan"` (tidak lengkap) |

**Endpoint yang harus disambungkan:**
- `GET /api/booking` — ambil semua riwayat
- `PUT /api/booking/:id/cancel` — batalkan booking

**Yang perlu diubah:**
- Fetch riwayat dari `GET /api/booking` menggunakan JWT token
- Mapping status dari backend (`pending`, `confirmed`, `completed`, `cancelled`) ke label Indonesia
- Tampilkan nama barber dan layanan dari response API
- Tambah tombol "Batalkan" untuk booking yang masih `pending` atau `confirmed`
- Tambah auth guard: redirect ke `/masuk` jika belum login

---

## 3. Status Komponen Shared

### 3.1 Navbar — `components/Navbar.jsx`

| Aspek | Status | Detail |
|-------|--------|--------|
| UI | ✅ Selesai | Link navigasi + tombol Masuk/Daftar |
| Auth State | ❌ Belum | Selalu tampil "Masuk" dan "Daftar", tidak cek apakah user sudah login |
| Logout | ❌ Belum | Tidak ada tombol logout |
| User Info | ❌ Belum | Tidak ada tampilan nama user setelah login |

**Yang perlu diubah:**
- Cek token di localStorage
- Jika sudah login: tampilkan nama user + tombol "Keluar"
- Jika belum login: tampilkan tombol "Masuk" dan "Daftar"
- Handle logout: hapus token dari localStorage, redirect ke `/`

---

### 3.2 Services (Landing Page) — `components/Services.jsx`

| Aspek | Status | Detail |
|-------|--------|--------|
| Data | ❌ Hardcoded | Array `services` berisi 3 item statis (hanya preview, bukan full daftar) |
| API | ❌ Belum | Tidak ada fetch ke `GET /api/services` |

**Catatan:** Komponen ini hanya menampilkan preview 3 layanan di landing page. Tidak kritis untuk flow booking, bisa tetap statis atau di-fetch.

---

### 3.3 OurBarber (Landing Page) — `components/OurBarber.jsx`

| Aspek | Status | Detail |
|-------|--------|--------|
| Data | ❌ Hardcoded | Array `barbers` berisi 4 item dengan `nama: "Nama"` dan `deskripsi: "deskripsi"` |
| API | ❌ Belum | Tidak ada fetch ke `GET /api/barbers` |
| Foto | ⚠️ Parsial | Semua barber pakai 1 foto yang sama (`barber.jpeg`) |

**Yang perlu diubah:** Fetch dari `GET /api/barbers` agar nama dan deskripsi asli tampil.

---

### 3.4 Layanan (Halaman Penuh) — `components/Layanan.jsx`

| Aspek | Status | Detail |
|-------|--------|--------|
| Data | ❌ Hardcoded | Array `services` berisi 7 item statis |
| API | ❌ Belum | Tidak ada fetch ke `GET /api/services` |

**Yang perlu diubah:** Opsional — fetch dari `GET /api/services`. Halaman ini informatif (bukan untuk booking langsung), tapi sebaiknya sinkron dengan data DB.

---

## 4. Masalah Global yang Harus Diselesaikan

### 4.1 ❌ Tidak Ada Token / Auth Management

Tidak ada:
- File `src/services/api.js` (axios instance / fetch wrapper)
- Context API untuk menyimpan auth state
- `localStorage` digunakan di manapun
- Proteksi route (semua halaman bisa diakses tanpa login)

**Harus dibuat:**
```
src/
├── services/
│   └── api.js          ← axios instance dengan baseURL & interceptor JWT
└── context/
    └── AuthContext.js  ← simpan user info & token, provide ke semua halaman
```

### 4.2 ❌ Tidak Ada Route Protection

Semua route (`/booking`, `/barber`, `/waktu`, `/review`, `/payment`, `/history`) bisa diakses tanpa login. Harus dibuat `PrivateRoute` component.

### 4.3 ❌ Data Duplikat di 3 Tempat

Data layanan hardcoded ada di:
1. `pages/booking/Reservasi.jsx` — 1 item
2. `components/Layanan.jsx` — 7 item
3. `components/Services.jsx` — 3 item

Setelah integrasi API, semua harus fetch dari `GET /api/services`.

### 4.4 ❌ Field Name Mismatch (SignUp)

Form SignUp menggunakan field `fullname`, sementara backend mungkin menerima `name`. Perlu dicek response schema backend.

### 4.5 ❌ Tidak Ada Dependency HTTP Client

`package.json` tidak memiliki `axios`. Harus install:
```bash
npm install axios
```

---

## 5. Prioritas Perbaikan

| # | Komponen | Prioritas | Alasan |
|---|----------|-----------|--------|
| 1 | `src/services/api.js` (BARU) | 🔴 Kritis | Foundation semua integrasi |
| 2 | `src/context/AuthContext.js` (BARU) | 🔴 Kritis | Diperlukan oleh semua halaman |
| 3 | `SignIn.jsx` | 🔴 Kritis | Pintu masuk seluruh flow |
| 4 | `SignUp.jsx` | 🔴 Kritis | Registrasi user baru |
| 5 | `Navbar.jsx` | 🔴 Kritis | Auth state harus tampil global |
| 6 | `Reservasi.jsx` | 🔴 Kritis | Step 1 booking — ambil layanan dari API |
| 7 | `Barber.jsx` | 🔴 Kritis | Step 2 booking — ambil barber dari API |
| 8 | `Ulasan.jsx` | 🔴 Kritis | Submit booking ke API |
| 9 | `Riwayat.jsx` | 🟠 Tinggi | Tampilkan data booking nyata |
| 10 | `Waktu.jsx` | 🟡 Sedang | Auth guard, format tanggal |
| 11 | `Payment.jsx` | 🟡 Sedang | Tombol konfirmasi (tunggu backend) |
| 12 | `OurBarber.jsx` | 🟢 Rendah | Informatif, bukan critical flow |
| 13 | `Services.jsx` | 🟢 Rendah | Preview saja di landing page |
| 14 | `Layanan.jsx` | 🟢 Rendah | Halaman informatif |

---

## 6. Endpoint Backend yang Tersedia

| Endpoint | Method | Auth | Status Backend | Dipakai Oleh |
|----------|--------|------|----------------|--------------|
| `/api/auth/login` | POST | Public | ✅ Siap | SignIn.jsx |
| `/api/auth/register` | POST | Public | ✅ Siap | SignUp.jsx |
| `/api/services` | GET | Public | ✅ Siap | Reservasi.jsx, Layanan.jsx, Services.jsx |
| `/api/barbers` | GET | Public | ✅ Siap | Barber.jsx, OurBarber.jsx |
| `/api/booking` | POST | JWT | ✅ Siap | Ulasan.jsx |
| `/api/booking` | GET | JWT | ✅ Siap | Riwayat.jsx |
| `/api/booking/:id/cancel` | PUT | JWT | ✅ Siap | Riwayat.jsx |
| `/api/payment` | POST | JWT | ⚠️ Handler kosong | Payment.jsx |

---

## 7. File yang Harus Dibuat (Baru)

| File | Tujuan |
|------|--------|
| `src/services/api.js` | Axios instance dengan `baseURL = http://localhost:8080` dan interceptor untuk attach JWT token |
| `src/context/AuthContext.js` | React Context untuk menyimpan `user`, `token`, fungsi `login()`, `logout()` |
| `src/components/PrivateRoute.jsx` | Wrapper route yang redirect ke `/masuk` jika token tidak ada |

---

*Audit selesai. Laporan ini mencakup seluruh komponen dalam customer booking flow.*
