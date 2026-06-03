# Gap Analysis — Zig-Zag Barbershop
**Berdasarkan:** Source code aktual + `docs/ERD_ANALYSIS.md`  
**Tanggal:** 3 Juni 2026  
**Konteks:** 2 minggu sebelum final presentation akademik

---

## Tabel Gap Analysis

### CUSTOMER

| Requirement | Backend Ready | Partial | Missing | Catatan |
|-------------|:---:|:---:|:---:|--------|
| Register (buat akun) | ✅ | | | `POST /api/auth/register` — implementasi lengkap, validasi ada |
| Login (masuk) | ✅ | | | `POST /api/auth/login` — JWT returned, bcrypt verified |
| Lihat daftar barber | | | ❌ | Tidak ada endpoint `GET /api/barbers`. Data barber di frontend adalah **hardcode lokal** |
| Lihat layanan (services) | | | ❌ | Tidak ada tabel `services`, tidak ada endpoint. Frontend hardcode 7 layanan lokal |
| Booking layanan | | ⚠️ | | `POST /api/booking` ada & berjalan, tapi tidak ada `service_id` — booking tidak tahu layanan apa yang dipesan |
| Lihat history booking | ✅ | | | `GET /api/booking` — berjalan, return booking milik user |
| Cancel booking | ✅ | | | `PUT /api/booking/:id/cancel` — berjalan dengan validasi status |
| **Frontend connect ke backend** | | | ❌ | **SignIn/SignUp hanya alert(). Booking flow = local state. Tidak ada satu pun API call ke backend** |

---

### BARBER

| Requirement | Backend Ready | Partial | Missing | Catatan |
|-------------|:---:|:---:|:---:|--------|
| Login | ✅ | | | Sama seperti customer — JWT berisi `role: "barber"` |
| Absensi masuk (check-in) | | | ❌ | Model `Attendance` ada, tapi endpoint `POST /api/attendance` adalah **handler kosong** — tidak return apapun |
| Absensi pulang (check-out) | | | ❌ | Tidak ada field `check_in` / `check_out` di model. Model hanya punya `status` (hadir/izin/sakit/alfa) — tidak support check-in/out |
| Lihat booking masuk | | | ❌ | Tidak ada endpoint `GET /api/bookings?barber_id=X`. Endpoint `GET /api/booking` hanya return booking milik user (customer), bukan milik barber |
| Konfirmasi booking | ✅ | | | `PUT /api/booking/:id/status` — role check sudah ada (barber/admin), state machine valid |
| Update status booking | ✅ | | | `PUT /api/booking/:id/status` — sama di atas, pending→confirmed→completed |

---

### OWNER / ADMIN

| Requirement | Backend Ready | Partial | Missing | Catatan |
|-------------|:---:|:---:|:---:|--------|
| Login | ✅ | | | Sama — JWT berisi `role: "admin"` |
| Kelola akun barber (lihat list) | | | ❌ | Tidak ada endpoint `GET /api/barbers` atau `GET /api/admin/users` |
| Kelola akun barber (buat/nonaktifkan) | | | ❌ | Tidak ada endpoint apapun untuk manajemen user oleh admin |
| Lihat semua booking | | | ❌ | `GET /api/booking` hanya return booking milik user yang login. Tidak ada endpoint "admin view all bookings" |
| Lihat statistik sederhana | | | ❌ | `GET /api/report` adalah **handler kosong**. Tidak ada logika kalkulasi apapun |

---

## Ringkasan Status Keseluruhan

| Kategori | Total Req | Ready | Partial | Missing |
|----------|:---------:|:-----:|:-------:|:-------:|
| Customer | 8 | 4 | 1 | 3 |
| Barber | 6 | 2 | 0 | 4 |
| Admin | 5 | 1 | 0 | 4 |
| **Total** | **19** | **7 (37%)** | **1 (5%)** | **11 (58%)** |

---

## MVP Scope — 2 Minggu

> **Prinsip Utama:** Demo harus bisa berjalan end-to-end. Lebih baik 5 fitur berjalan sempurna daripada 15 fitur setengah jadi.

---

### 🔴 P0 — Harus Selesai (Week 1, Hari 1–5)

*Tanpa ini, demo tidak bisa berjalan sama sekali.*

---

#### P0.1 — Fix Security & Infrastructure

**Task:**
- Pindahkan `JWT_SECRET` dari hardcode ke `os.Getenv("JWT_SECRET")` di `jwt.go` dan `middleware/auth.go`
- Tambahkan `JWT_SECRET` ke `.env`
- Hapus `log.Println("DSN:", os.Getenv(...))` di `database/connection.go`
- Tambah CORS middleware (`gin-contrib/cors`)
- Buat `.env.example`

**Business Impact:**  
Tanpa CORS, frontend tidak bisa connect ke backend — seluruh demo gagal di hari pertama.

**Technical Complexity:** ⭐ Sangat Rendah (2–3 jam total)

**Risiko:** Hampir nol. Pure additive, tidak mengubah logika apapun.

---

#### P0.2 — Buat Service Entity + Endpoint

**Task:**
- Buat `internal/service/model.go`:
  ```go
  type Service struct {
    gorm.Model
    Name        string `gorm:"size:100;not null"`
    Description string `gorm:"size:255"`
    Price       int    `gorm:"not null"`
    IsAvailable bool   `gorm:"default:true"`
  }
  ```
- Buat `internal/service/handler.go`: `GET /api/services` (list), `POST /api/services` (admin create)
- Tambah ke `AutoMigrate` di `cmd/main.go`
- Tambah routes di `api/router.go`

**Business Impact:**  
Customer tidak bisa booking dengan benar tanpa tahu layanan apa yang tersedia. Barber tidak tahu layanan apa yang di-request. Ini fondasi bisnis utama.

**Technical Complexity:** ⭐⭐ Rendah (3–4 jam)

**Risiko:** Nol terhadap existing code. Tabel baru, endpoint baru, tidak ada perubahan pada kode yang sudah berjalan.

---

#### P0.3 — Tambah `ServiceID` ke Booking

**Task:**
- Tambah field ke `internal/booking/model.go`:
  ```go
  ServiceID uint `gorm:"default:null" json:"service_id"`
  ```
- Update `CreateBookingRequest` di `handler.go`: tambah field `ServiceID uint`
- AutoMigrate akan auto-ALTER TABLE (aman, nullable)

**Business Impact:**  
Tanpa ini, booking tidak punya informasi layanan. Data yang tersimpan di DB tidak bermakna untuk bisnis ("booking jam 10 ke barber 1" — potong apa? tidak ada yang tahu).

**Technical Complexity:** ⭐ Sangat Rendah (1–2 jam)

**Risiko:** Sangat rendah. Kolom nullable, data lama aman. Frontend belum integrated, tidak ada yang break.

---

#### P0.4 — Endpoint `GET /api/barbers`

**Task:**
- Buat handler baru (bisa inline di `api/router.go` atau file terpisah):
  ```go
  // Query users WHERE role = 'barber'
  GET /api/barbers → return list user dengan role barber
  ```
- Tidak perlu model baru — cukup query tabel `users` yang sudah ada

**Business Impact:**  
Frontend booking flow (`Barber.jsx`) saat ini hardcode 4 barber dummy. Demo tidak akan bisa pakai data real tanpa endpoint ini.

**Technical Complexity:** ⭐ Sangat Rendah (1–2 jam)

**Risiko:** Nol. Read-only endpoint, tidak mengubah apapun.

---

#### P0.5 — Seed Data untuk Demo

**Task:**
- Buat script seed (bisa di `database/seed/seed.go` atau hardcode di `main.go` dengan flag):
  - 1 user admin
  - 4 user barber (sesuai yang ada di frontend: Rizky, Andi, Fajar, Wildan)
  - 7 layanan (sesuai yang ada di frontend: Premium Haircut, Massage, Down Perm, dll.)
  - Beberapa booking sample

**Business Impact:**  
Demo tanpa data = database kosong = tampilan kosong = kesan buruk. Seed data wajib ada agar demo bisa langsung dijalankan tanpa manual input data dulu.

**Technical Complexity:** ⭐ Sangat Rendah (2–3 jam)

**Risiko:** Nol. Script terpisah, tidak mempengaruhi logika aplikasi.

---

#### P0.6 — Integrasi Frontend: Auth Flow

**Task:**
- `SignIn.jsx`: Ganti `alert()` dengan `fetch("POST /api/auth/login")`, simpan JWT ke `localStorage`
- `SignUp.jsx`: Ganti `alert()` dengan `fetch("POST /api/auth/register")`
- Tambah utility function `getToken()` untuk dipakai di semua fetch berikutnya

**Business Impact:**  
Login adalah gerbang utama seluruh sistem. Jika login masih hanya `alert()`, demo tidak akan kredibel di depan mitra dan penguji.

**Technical Complexity:** ⭐⭐ Rendah (3–4 jam)

**Risiko:** Rendah. Perubahan isolated di dua file. Tidak mengubah komponen lain.

---

#### P0.7 — Integrasi Frontend: Booking Flow

**Task:**
- `Reservasi.jsx`: Fetch dari `GET /api/services` (ganti hardcode)
- `Barber.jsx`: Fetch dari `GET /api/barbers` (ganti hardcode)
- `Waktu.jsx` / step terakhir: POST ke `POST /api/booking` dengan JWT dari localStorage
- Buat halaman konfirmasi setelah booking sukses

**Business Impact:**  
Ini adalah inti fitur customer. Alur booking yang connect ke backend adalah satu-satunya hal yang akan dilihat mitra saat demo.

**Technical Complexity:** ⭐⭐⭐ Sedang (6–8 jam)

**Risiko:** Sedang. Perlu handle error state, loading state. Tapi tidak ada perubahan backend yang diperlukan — hanya frontend yang perlu diupdate.

---

### 🟠 P1 — Sangat Disarankan (Week 1–2, Hari 5–10)

*Tanpa ini, demo terasa tidak lengkap. Mitra akan punya pertanyaan.*

---

#### P1.1 — Implementasi Payment Handler

**Task:**
- Buat `internal/payment/handler.go`
- Implementasi `POST /api/payment`:
  - Input: `booking_id`, `method`
  - Logic: Cek booking exists → Cek booking status `confirmed` → Ambil harga dari service → Create payment record → Update booking status ke `completed`
- Ganti dummy handler di `api/router.go`

**Business Impact:**  
Alur bisnis tidak lengkap jika tidak ada pembayaran. Mitra hampir pasti akan tanya "setelah booking, bayarnya gimana?"

**Technical Complexity:** ⭐⭐ Rendah-Sedang (4–5 jam)

**Risiko:** Rendah. Model sudah ada, tinggal implementasi handler. Tidak ada perubahan schema.

---

#### P1.2 — Endpoint Barber: Lihat Booking Masuk

**Task:**
- Tambah endpoint `GET /api/booking/barber`:
  - Protected + cek role `barber`
  - Query: `SELECT * FROM bookings WHERE barber_id = [barber yang login] ORDER BY date ASC`
- Tambah route di `api/router.go`

**Business Impact:**  
Barber tidak bisa kerja tanpa tahu booking apa yang masuk untuknya. Ini kritis untuk demo alur barber.

**Technical Complexity:** ⭐ Sangat Rendah (1–2 jam)

**Risiko:** Nol. Query sederhana dari tabel yang sudah ada.

---

#### P1.3 — Implementasi Attendance Handler

**Task:**
- Implementasi `POST /api/attendance`:
  - Input: `status` (hadir/izin/sakit/alfa), otomatis ambil `barber_id` dari JWT
  - `date` otomatis diisi `time.Now().Format("2006-01-02")`
  - Cek: satu barber hanya boleh satu attendance record per hari
- Fix bug: ubah `date` field di model dari `varchar(255)` ke `string` dengan gorm tag `type:date`
- Ganti dummy handler di router

**Business Impact:**  
Absensi adalah fitur utama untuk barber dan kebutuhan eksplisit mitra. Tanpa ini, separuh alur barber tidak bisa didemonstrasikan.

**Technical Complexity:** ⭐⭐ Rendah (3–4 jam)

**Risiko:** Rendah. Tabel `attendances` saat ini kosong, ALTER TABLE kolom `date` aman dilakukan.

---

#### P1.4 — RBAC Middleware

**Task:**
- Buat `pkg/middleware/role.go`:
  ```go
  func RequireRole(roles ...string) gin.HandlerFunc
  ```
- Terapkan pada group route admin dan barber di `api/router.go`
- Hapus manual role-check di `booking/handler.go` (cleanup)

**Business Impact:**  
Tanpa ini, endpoint admin bisa diakses oleh customer biasa. Ini akan terlihat jelas jika penguji mencoba akses endpoint admin dengan token customer.

**Technical Complexity:** ⭐ Sangat Rendah (1–2 jam)

**Risiko:** Nol terhadap fungsionalitas. Hanya restructuring middleware.

---

#### P1.5 — Admin: Lihat Semua Booking

**Task:**
- Tambah endpoint `GET /api/admin/bookings`:
  - Protected + RequireRole("admin")
  - Query semua booking dengan JOIN ke users (nama customer) dan services (nama layanan)
  - Support filter: `?status=pending`, `?date=2026-06-01`
- Tambah admin route group di `api/router.go`

**Business Impact:**  
Admin tidak bisa mengelola bisnis jika tidak bisa melihat semua booking. Ini adalah halaman utama yang akan dibuka pertama kali oleh mitra (owner) saat demo.

**Technical Complexity:** ⭐⭐ Rendah-Sedang (3–4 jam)

**Risiko:** Rendah. Read-only query, tidak mengubah data apapun.

---

### 🔵 P2 — Nice to Have (Week 2, Hari 11–14)

*Akan meningkatkan kesan presentasi. Kerjakan jika P0 dan P1 sudah selesai semua.*

---

#### P2.1 — Admin: Statistik Sederhana (Dashboard)

**Task:**
- Implementasi `GET /api/admin/report`:
  - Total booking (all time)
  - Booking per status (pending/confirmed/completed/cancelled)
  - Estimasi pendapatan (jumlah booking `completed` × harga service)
  - Barber paling banyak booking
- Query aggregasi SQL sederhana via GORM

**Business Impact:**  
Sangat impresif untuk demo. Satu screen yang menunjukkan "sistem berjalan dan menghasilkan data" akan membuat kesan profesional.

**Technical Complexity:** ⭐⭐ Rendah-Sedang (4–6 jam)

**Risiko:** Rendah. Read-only. Tidak mengubah apapun.

---

#### P2.2 — Admin: Kelola Akun Barber

**Task:**
- `GET /api/admin/barbers` — list semua barber
- `POST /api/admin/barbers` — buat akun barber baru (admin only)
- `PUT /api/admin/barbers/:id` — update data barber
- Role: hanya admin

**Business Impact:**  
Mitra (owner) perlu bisa menambahkan barber baru tanpa perlu developer. Menunjukkan system is self-sufficient.

**Technical Complexity:** ⭐⭐ Rendah-Sedang (4–5 jam)

**Risiko:** Rendah. CRUD sederhana di tabel `users`.

---

#### P2.3 — `GET /api/users/me` & `PUT /api/users/me`

**Task:**
- Endpoint profile: return data user yang sedang login berdasarkan JWT
- Update: nama, (tanpa ubah password/role)

**Business Impact:**  
UX yang baik — user bisa lihat nama mereka di halaman profil/header.

**Technical Complexity:** ⭐ Sangat Rendah (1–2 jam)

**Risiko:** Nol.

---

#### P2.4 — History Booking Frontend

**Task:**
- `History.jsx` saat ini hanya render `<h1>Halaman History</h1>`
- Implementasi: fetch `GET /api/booking`, tampilkan daftar booking dengan status

**Business Impact:**  
Customer akan tanya "booking saya mana?" saat demo. Halaman ini menjawab itu.

**Technical Complexity:** ⭐⭐ Rendah (2–3 jam)

**Risiko:** Nol.

---

#### P2.5 — Dockerfile & Docker Compose

**Task:**
- Buat `Dockerfile` untuk backend Go
- Isi `docker-compose.yml` (saat ini kosong): backend + database local (opsional, karena sudah pakai Supabase)

**Business Impact:**  
Menunjukkan kematangan engineering. Penguji akademik biasanya menghargai ini. Bisa juga berguna untuk deployment demo yang stabil.

**Technical Complexity:** ⭐⭐ Rendah-Sedang (2–3 jam)

**Risiko:** Nol terhadap aplikasi. Hanya file konfigurasi tambahan.

---

## Timeline Eksekusi Rekomendasi

```
MINGGU 1
├── Hari 1 (Selasa):  P0.1 — Security & CORS fix (paling kritis, lakukan pertama)
├── Hari 2 (Rabu):   P0.2 — Service entity + endpoint
│                    P0.3 — Tambah ServiceID ke Booking
├── Hari 3 (Kamis):  P0.4 — GET /api/barbers
│                    P0.5 — Seed data
├── Hari 4 (Jumat):  P0.6 — Integrasi frontend: Auth flow
├── Hari 5 (Sabtu):  P0.7 — Integrasi frontend: Booking flow
└── Hari 6 (Minggu): Buffer / review / bugfix P0

MINGGU 2
├── Hari 7 (Senin):  P1.1 — Payment handler
│                    P1.2 — Endpoint barber lihat booking
├── Hari 8 (Selasa): P1.3 — Attendance handler
│                    P1.4 — RBAC middleware
├── Hari 9 (Rabu):   P1.5 — Admin: lihat semua booking
│                    P2.4 — History booking frontend
├── Hari 10 (Kamis): P2.1 — Dashboard/statistik admin
│                    P2.3 — GET /api/users/me
├── Hari 11 (Jumat): P2.2 — Admin: kelola barber
│                    P2.5 — Dockerfile (jika sempat)
├── Hari 12 (Sabtu): DRY RUN demo penuh — catat semua bug
└── Hari 13 (Minggu): Bugfix dari dry run + polish UI
```

---

## Definisi "Demo Berhasil"

Berikut adalah urutan aksi minimal yang harus bisa dijalankan tanpa error saat demo di depan mitra/penguji:

```
1. Customer:
   Daftar akun → Login → Lihat layanan → Pilih layanan →
   Pilih barber → Pilih waktu → Submit booking → Lihat history booking

2. Barber:
   Login → Lihat booking masuk → Konfirmasi booking →
   Input absensi hadir

3. Admin:
   Login → Lihat semua booking → Lihat statistik dasar
```

Jika 3 alur ini berjalan mulus, presentasi akan dinilai sangat baik.

---

## Quick Wins (Bisa Selesai < 2 Jam, Impact Tinggi)

Lakukan ini HARI INI sebelum mulai P0 lainnya:

| Task | Waktu | Impact |
|------|-------|--------|
| Hapus `log.Println("DSN:", ...)` di `connection.go` | 2 menit | Keamanan |
| Fix `hashed, _ :=` → handle error bcrypt | 5 menit | Keandalan |
| Fix `godotenv.Load()` → handle error | 5 menit | Keandalan |
| Tambah `JWT_SECRET=...` ke `.env` dan baca via `os.Getenv` | 30 menit | Keamanan |
| Tambah `cors` middleware ke router | 30 menit | **CORS — wajib untuk frontend** |
| Buat `.env.example` | 10 menit | Kolaborasi tim |

**Total: ~1.5 jam — lakukan hari ini.**

---

*Dokumen ini dibuat berdasarkan analisis source code aktual per 3 Juni 2026.*  
*Gap Analysis merujuk pada: `internal/*/model.go`, `internal/*/handler.go`, `api/router.go`, `frontend/src/**/*.jsx`, `docs/ERD_ANALYSIS.md`*
