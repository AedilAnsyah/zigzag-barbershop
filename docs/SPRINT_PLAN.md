# Sprint Plan — 14 Hari Menuju Final Presentation
**Project:** Zig-Zag Barbershop  
**Tanggal Mulai:** 3 Juni 2026  
**Tanggal Presentasi:** 17 Juni 2026  
**Stack:** Go 1.25 + Gin + GORM + PostgreSQL (Supabase) + React  
**Referensi:** `docs/ERD_ANALYSIS.md`, `docs/GAP_ANALYSIS.md`, source code aktual

---

## 1. Prioritas Berdasarkan ROI

> **Formula ROI Score:** Business Value (1–5) ÷ Effort (1–5) × (1 / Risk) × 10  
> Semakin tinggi skor, kerjakan lebih awal.

| # | Task | Business Value | Effort | Risk | ROI Score |
|---|------|:--------------:|:------:|:----:|:---------:|
| 1 | CORS middleware | 5 | 1 | 1 | **50.0** |
| 2 | JWT Secret dari ENV | 5 | 1 | 1 | **50.0** |
| 3 | Hapus DSN log | 5 | 1 | 1 | **50.0** |
| 4 | Seed data demo | 5 | 1 | 1 | **50.0** |
| 5 | Service entity + `GET /api/services` | 5 | 2 | 1 | **25.0** |
| 6 | `GET /api/barbers` | 5 | 1 | 1 | **50.0** |
| 7 | ServiceID pada Booking | 4 | 1 | 1 | **40.0** |
| 8 | Frontend: Auth integration | 5 | 2 | 2 | **12.5** |
| 9 | Frontend: Booking flow integration | 5 | 3 | 2 | **8.3** |
| 10 | Barber: lihat booking masuk | 5 | 1 | 1 | **50.0** |
| 11 | Attendance handler | 4 | 2 | 1 | **20.0** |
| 12 | RBAC middleware | 4 | 1 | 1 | **40.0** |
| 13 | Payment handler | 4 | 2 | 1 | **20.0** |
| 14 | Admin: lihat semua booking | 4 | 2 | 1 | **20.0** |
| 15 | Admin: statistik/dashboard | 4 | 2 | 1 | **20.0** |
| 16 | Frontend: History booking | 3 | 2 | 1 | **15.0** |
| 17 | Admin: kelola barber (CRUD) | 3 | 3 | 1 | **10.0** |
| 18 | `GET /api/users/me` | 2 | 1 | 1 | **20.0** |
| 19 | Frontend: Barber dashboard | 3 | 3 | 2 | **5.0** |
| 20 | Frontend: Admin dashboard | 3 | 3 | 2 | **5.0** |
| 21 | `.env.example` + README | 2 | 1 | 1 | **20.0** |
| 22 | Dockerfile | 2 | 2 | 1 | **10.0** |
| 23 | Fix bug: Attendance date type | 3 | 1 | 1 | **30.0** |

---

## 2. Critical Path

Urutan dependensi yang **harus** diselesaikan secara berurutan. Tidak bisa dikerjakan paralel.

```
[P0.1 Security + CORS]
    │
    ├──→ [Service Entity] ──→ [ServiceID di Booking] ──→ [Frontend Booking Integration]
    │
    ├──→ [Barber Endpoint] ──→ [Frontend Booking Integration]
    │
    ├──→ [Seed Data] ──→ [Dry Run Demo]
    │
    └──→ [Frontend Auth Integration] ──→ [Frontend Booking Integration]
                                              │
                                        [DEMO BERJALAN]
                                              │
                    ┌─────────────────────────┤
                    │                         │
              [Attendance]             [Payment Handler]
                    │                         │
              [RBAC Middleware]        [Admin: All Bookings]
                    │                         │
              [Barber: View Booking]   [Admin: Dashboard]
```

**Bottleneck Utama:** Frontend Auth Integration (T8) harus selesai sebelum Booking Integration (T9) bisa dimulai.

---

## 3. Jadwal 14 Hari

---

### ✅ Hari 1 (3 Juni) — Security Foundation & Quick Wins

> **Target:** Semua security issue terselesaikan. Backend siap dihubungkan ke frontend.

#### Task 1: Fix JWT Secret (ROI: 50)

**File dimodifikasi:**
- `internal/auth/jwt.go` — Ubah `var SECRET_KEY = []byte("zigzag-secret")` → `var SECRET_KEY = []byte(os.Getenv("JWT_SECRET"))`
- `pkg/middleware/auth.go` — Hapus `var SECRET_KEY = []byte("zigzag-secret")`, import dan gunakan dari package `auth`
- `.env` — Tambah `JWT_SECRET=zigzag-barbershop-secret-key-2026`
- `.env.example` — **File baru**, template environment variable

**Perubahan DB:** Tidak ada

**Endpoint berubah:** Tidak ada (behavior sama, hanya secret dari ENV)

---

#### Task 2: Hapus DSN Log + Fix Error Ignored (ROI: 50)

**File dimodifikasi:**
- `database/connection.go` — Hapus `log.Println("DSN:", os.Getenv("DATABASE_URL"))`
- `internal/auth/service.go` — Fix `hashed, _ :=` menjadi `hashed, err :=` dengan proper error handling
- `cmd/main.go` — Handle error dari `godotenv.Load()`

**Perubahan DB:** Tidak ada

---

#### Task 3: CORS Middleware (ROI: 50)

**File dimodifikasi:**
- `go.mod` — Tambah `github.com/gin-contrib/cors`
- `api/router.go` — Tambah `router.Use(cors.New(cors.Config{...}))` sebelum route group

**File baru:** Tidak perlu (inline di router)

**Perubahan DB:** Tidak ada

**Config CORS (untuk development):**
```go
cors.Config{
    AllowOrigins:     []string{"http://localhost:3000"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    AllowHeaders:     []string{"Origin", "Authorization", "Content-Type"},
    AllowCredentials: true,
}
```

---

#### Task 4: `.env.example`

**File baru:**
- `.env.example` — Template semua environment variable yang diperlukan (tanpa nilai secret asli)

**Isi:**
```env
APP_NAME=Zig-Zag Barbershop
APP_ENV=development
APP_PORT=8080
DB_HOST=
DB_PORT=5432
DB_USER=
DB_PASSWORD=
DB_NAME=postgres
DB_SSLMODE=require
DATABASE_URL=
JWT_SECRET=
```

---

**✔ Definisi Selesai Hari 1:**
- [ ] Backend bisa dijalankan tanpa warning secret hardcoded
- [ ] CORS tidak error saat frontend fetch dari localhost:3000
- [ ] `go run ./cmd` berhasil tanpa error

---

### ✅ Hari 2 (4 Juni) — Service Entity

> **Target:** Tabel `services` ada di DB dan bisa di-query via API.

#### Task 5: Service Entity + CRUD Endpoint (ROI: 25)

**File baru:**
- `internal/service/model.go`
- `internal/service/handler.go`

**File dimodifikasi:**
- `cmd/main.go` — Tambah `&service.Service{}` ke `AutoMigrate`
- `api/router.go` — Tambah routes service

**Model baru:**
```go
// internal/service/model.go
type Service struct {
    gorm.Model
    Name        string `gorm:"size:100;not null" json:"name"`
    Description string `gorm:"size:500" json:"description"`
    Price       int    `gorm:"not null" json:"price"`
    Duration    int    `gorm:"not null;default:30" json:"duration_minutes"`
    IsAvailable bool   `gorm:"default:true" json:"is_available"`
}
```

**Endpoint baru:**
| Method | Endpoint | Auth | Keterangan |
|--------|----------|------|-----------|
| `GET` | `/api/services` | Public | List semua service yang `is_available=true` |
| `POST` | `/api/services` | Admin only | Buat service baru (butuh P1.4 RBAC dulu untuk auth, sementara skip auth) |

**Perubahan DB:**
```sql
-- AutoMigrate akan generate:
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    price INT NOT NULL,
    duration_minutes INT DEFAULT 30,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);
```

---

**✔ Definisi Selesai Hari 2:**
- [ ] `GET /api/services` return JSON list services
- [ ] Tabel `services` ada di Supabase

---

### ✅ Hari 3 (5 Juni) — Barber Endpoint + ServiceID Booking

> **Target:** Data barber dan service bisa dipakai oleh frontend booking flow.

#### Task 6: `GET /api/barbers` (ROI: 50)

**File baru:**
- `internal/barber/handler.go`

**File dimodifikasi:**
- `api/router.go` — Tambah `GET /api/barbers`

**Implementasi (query dari tabel users):**
```go
// Cukup query users WHERE role = 'barber' AND deleted_at IS NULL
// Return: id, name, (tanpa email, password)
```

**Endpoint baru:**
| Method | Endpoint | Auth | Keterangan |
|--------|----------|------|-----------|
| `GET` | `/api/barbers` | Public | List semua user dengan role='barber' |

**Perubahan DB:** Tidak ada (query tabel `users` yang sudah ada)

---

#### Task 7: ServiceID pada Booking (ROI: 40)

**File dimodifikasi:**
- `internal/booking/model.go` — Tambah field `ServiceID`
- `internal/booking/handler.go` — Tambah `service_id` ke `CreateBookingRequest`

**Perubahan model:**
```go
type Booking struct {
    gorm.Model
    UserID    uint   `gorm:"not null" json:"user_id"`
    BarberID  uint   `gorm:"not null" json:"barber_id"`
    ServiceID uint   `gorm:"default:null" json:"service_id"`  // FIELD BARU
    Date      string `gorm:"type:date;not null" json:"date"`
    Time      string `gorm:"type:time;not null" json:"time"`
    Status    string `gorm:"type:varchar(50);default:'pending'" json:"status"`
}
```

**Perubahan DB:**
```sql
-- AutoMigrate akan generate:
ALTER TABLE bookings ADD COLUMN service_id INTEGER DEFAULT NULL;
```

**Endpoint diupdate:**
- `POST /api/booking` — Request body sekarang bisa terima `service_id` (optional, tidak breaking)

---

**✔ Definisi Selesai Hari 3:**
- [ ] `GET /api/barbers` return list barber dari DB
- [ ] `POST /api/booking` bisa terima `service_id`
- [ ] Tabel `bookings` punya kolom `service_id`

---

### ✅ Hari 4 (6 Juni) — Seed Data

> **Target:** Database punya data lengkap untuk demo. Tidak perlu input manual saat demo.

#### Task 4: Seed Data Demo (ROI: 50)

**File baru:**
- `database/seed/seed.go` — Seeder dengan fungsi `RunSeed(db *gorm.DB)`
- Atau: Tambah flag `--seed` di `cmd/main.go`

**Data yang di-seed:**
```
Users:
  - admin@zigzag.com / password: admin123 (role: admin)
  - rizky@zigzag.com / password: barber123 (role: barber, name: Rizky Barber)
  - andi@zigzag.com / password: barber123 (role: barber, name: Andi Barber)
  - fajar@zigzag.com / password: barber123 (role: barber, name: Fajar Barber)
  - wildan@zigzag.com / password: barber123 (role: barber, name: Wildan Barber)
  - customer@test.com / password: customer123 (role: customer)

Services:
  - Premium Hair Cut — Rp 50.000 — 45 menit
  - Massage — Rp 25.000 — 30 menit
  - Down Perm — Rp 50.000 — 60 menit
  - Curly / Cold Perm — Rp 200.000 — 90 menit
  - Basic Colouring — Rp 75.000 — 60 menit
  - Highlight — Rp 100.000 — 75 menit
  - Fashion Colouring — Rp 250.000 — 120 menit

Sample Bookings (untuk demo admin view):
  - 3 booking dengan status berbeda (pending, confirmed, completed)
```

**Perubahan DB:** INSERT data, tidak ada schema change.

---

**✔ Definisi Selesai Hari 4:**
- [ ] Jalankan seed, semua data masuk tanpa error
- [ ] Login dengan `admin@zigzag.com` / `admin123` berhasil
- [ ] `GET /api/services` return 7 services
- [ ] `GET /api/barbers` return 4 barbers

---

### ✅ Hari 5 (7 Juni) — Barber: Lihat Booking + RBAC

> **Target:** Barber bisa login dan lihat booking yang ditujukan kepadanya.

#### Task 10: Barber View Booking (ROI: 50)

**File dimodifikasi:**
- `internal/booking/handler.go` — Tambah fungsi `GetBarberBookingsHandler`
- `api/router.go` — Tambah route di protected group

**Endpoint baru:**
| Method | Endpoint | Auth | Keterangan |
|--------|----------|------|-----------|
| `GET` | `/api/booking/barber` | Barber/Admin | List booking WHERE barber_id = user yang login |

**Query:**
```go
// SELECT * FROM bookings WHERE barber_id = [jwt.user_id] ORDER BY date ASC, time ASC
```

---

#### Task 12: RBAC Middleware (ROI: 40)

**File baru:**
- `pkg/middleware/role.go`

**Implementasi:**
```go
func RequireRole(roles ...string) gin.HandlerFunc {
    return func(c *gin.Context) {
        role, exists := c.Get("role")
        if !exists { c.AbortWithStatusJSON(401, ...); return }
        for _, r := range roles {
            if role == r { c.Next(); return }
        }
        c.AbortWithStatusJSON(403, gin.H{"error": "forbidden"})
    }
}
```

**File dimodifikasi:**
- `api/router.go` — Tambah admin route group: `protected.Use(middleware.RequireRole("admin"))`
- `internal/booking/handler.go` — Hapus manual role check di `UpdateBookingStatusHandler` (ganti dengan middleware)

---

**✔ Definisi Selesai Hari 5:**
- [ ] `GET /api/booking/barber` dengan token barber return booking milik barber tersebut
- [ ] Endpoint admin return 403 jika diakses dengan token customer

---

### ✅ Hari 6 (8 Juni) — Frontend: Auth Integration

> **Target:** Login dan Register frontend terhubung ke backend.

#### Task 8: Frontend Auth Integration (ROI: 12.5 — effort tinggi tapi wajib)

**File dimodifikasi:**
- `frontend/src/pages/SignIn.jsx` — Ganti `alert()` dengan `fetch POST /api/auth/login`, simpan token ke `localStorage`
- `frontend/src/pages/SignUp.jsx` — Ganti `alert()` dengan `fetch POST /api/auth/register`

**File baru:**
- `frontend/src/utils/api.js` — Helper `getToken()`, `authHeader()`, base URL config

```js
// frontend/src/utils/api.js
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const getToken = () => localStorage.getItem("token");
export const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });
export const api = { BASE_URL };
```

**Perubahan DB:** Tidak ada

**Endpoint dipakai:**
- `POST /api/auth/login`
- `POST /api/auth/register`

---

**✔ Definisi Selesai Hari 6:**
- [ ] Login dengan `customer@test.com / customer123` → token tersimpan di localStorage
- [ ] Register akun baru → berhasil masuk ke DB
- [ ] Jika login gagal → muncul pesan error di UI (bukan alert)

---

### ✅ Hari 7–8 (9–10 Juni) — Frontend: Booking Flow Integration

> **Target:** Alur booking customer end-to-end terhubung ke backend.

#### Task 9: Frontend Booking Integration (ROI: 8.3 — effort besar tapi jantung demo)

**File dimodifikasi:**
- `frontend/src/pages/booking/Reservasi.jsx`
  - Hapus hardcoded `services` array
  - Tambah `useEffect` → `fetch GET /api/services`
  - Handle loading state
- `frontend/src/pages/booking/Barber.jsx`
  - Hapus hardcoded `barbers` array
  - Tambah `useEffect` → `fetch GET /api/barbers`
  - Handle loading state
- `frontend/src/pages/booking/Waktu.jsx`
  - Pada submit: `fetch POST /api/booking` dengan token dari localStorage
  - Kirim: `{ barber_id, service_id, date, time }`
  - Handle success → navigasi ke halaman konfirmasi
  - Handle error → tampilkan pesan error

**File baru:**
- `frontend/src/pages/booking/Konfirmasi.jsx` — Halaman "Booking Berhasil!" sederhana
- Route baru di `App.js`: `/konfirmasi`

**Perubahan DB:** Tidak ada (hanya frontend)

**Endpoint dipakai:**
- `GET /api/services`
- `GET /api/barbers`
- `POST /api/booking` (dengan Authorization header)

---

**✔ Definisi Selesai Hari 8:**
- [ ] Pilih layanan dari data real → Pilih barber dari data real → Pilih waktu → Submit → Booking masuk ke DB
- [ ] Verifikasi di Supabase: record baru ada di tabel `bookings`
- [ ] Jika tidak login, redirect ke `/masuk`

---

### ✅ Hari 9 (11 Juni) — Attendance Handler

> **Target:** Barber bisa absen melalui API.

#### Task 11: Attendance Handler (ROI: 20)

**File baru:**
- `internal/attendance/handler.go`

**File dimodifikasi:**
- `internal/attendance/model.go` — Fix `date` field: `gorm:"type:date;not null"`
- `api/router.go` — Ganti dummy handler dengan real handler

**Endpoint diimplementasikan:**
| Method | Endpoint | Auth | Keterangan |
|--------|----------|------|-----------|
| `POST` | `/api/attendance` | Barber | Submit absensi hari ini. Auto-set barber_id dari JWT, date = today |
| `GET` | `/api/attendance` | Barber/Admin | List absensi (admin: semua, barber: milik sendiri) |

**Logic `POST /api/attendance`:**
```go
// 1. Ambil barber_id dari JWT
// 2. Set date = time.Now().Format("2006-01-02")
// 3. Cek apakah sudah ada attendance hari ini untuk barber ini
// 4. Jika sudah ada → return 409 Conflict
// 5. Jika belum → Create attendance record
```

**Perubahan DB:**
```sql
-- AutoMigrate akan fix kolom date dari varchar(255) ke date
-- Aman karena tabel masih kosong
ALTER TABLE attendances ALTER COLUMN date TYPE date USING date::date;
```

---

**✔ Definisi Selesai Hari 9:**
- [ ] Barber login → `POST /api/attendance` body `{"status": "hadir"}` → berhasil
- [ ] Barber yang sama tidak bisa absen dua kali sehari (409 Conflict)

---

### ✅ Hari 10 (12 Juni) — Payment Handler

> **Target:** Alur pembayaran setelah booking terhubung.

#### Task 13: Payment Handler (ROI: 20)

**File baru:**
- `internal/payment/handler.go`

**File dimodifikasi:**
- `api/router.go` — Ganti dummy handler dengan real handler

**Endpoint diimplementasikan:**
| Method | Endpoint | Auth | Keterangan |
|--------|----------|------|-----------|
| `POST` | `/api/payment` | Customer | Buat payment untuk booking yang sudah confirmed |
| `GET` | `/api/payment/:booking_id` | Customer | Lihat status payment untuk booking tertentu |

**Logic `POST /api/payment`:**
```go
// Input: { booking_id, method }
// 1. Cari booking, pastikan milik user yang login
// 2. Cek booking.status == "confirmed"
// 3. Ambil harga dari service (via service_id)
// 4. Create payment record dengan status "completed" (simulasi — tidak ada payment gateway)
// 5. Update booking.status → "completed"
```

**Perubahan DB:** Tidak ada schema change (tabel `payments` sudah ada)

---

**✔ Definisi Selesai Hari 10:**
- [ ] `POST /api/payment` dengan `booking_id` yang sudah confirmed → payment record created
- [ ] Booking status otomatis update ke `completed`

---

### ✅ Hari 11 (13 Juni) — Admin: Semua Booking + Dashboard

> **Target:** Admin bisa melihat data bisnis secara keseluruhan.

#### Task 14: Admin View All Bookings (ROI: 20)

**File baru:**
- `internal/admin/handler.go`

**File dimodifikasi:**
- `api/router.go` — Tambah admin route group

**Endpoint baru:**
| Method | Endpoint | Auth | Keterangan |
|--------|----------|------|-----------|
| `GET` | `/api/admin/bookings` | Admin | Semua booking, support filter `?status=` dan `?date=` |
| `GET` | `/api/admin/barbers` | Admin | List semua barber |
| `POST` | `/api/admin/barbers` | Admin | Buat akun barber baru |

---

#### Task 15: Admin Dashboard/Statistik (ROI: 20)

**File dimodifikasi:**
- `internal/admin/handler.go` — Tambah `GetDashboardHandler`

**Endpoint baru:**
| Method | Endpoint | Auth | Keterangan |
|--------|----------|------|-----------|
| `GET` | `/api/admin/dashboard` | Admin | Statistik: total booking, per-status, estimasi revenue |

**Query yang diperlukan:**
```go
// Total bookings per status
// SELECT status, COUNT(*) FROM bookings GROUP BY status

// Estimasi revenue (booking completed × harga service)
// SELECT SUM(s.price) FROM bookings b JOIN services s ON b.service_id = s.id
// WHERE b.status = 'completed'

// Booking hari ini
// SELECT COUNT(*) FROM bookings WHERE date = CURRENT_DATE
```

**Perubahan DB:** Tidak ada

---

**✔ Definisi Selesai Hari 11:**
- [ ] `GET /api/admin/bookings` return semua booking
- [ ] `GET /api/admin/dashboard` return JSON statistik
- [ ] Endpoint 403 jika diakses non-admin

---

### ✅ Hari 12 (14 Juni) — Frontend: History + Polish

> **Target:** Semua halaman frontend terhubung. Halaman tidak ada yang blank.

#### Task 16: Frontend History Booking (ROI: 15)

**File dimodifikasi:**
- `frontend/src/pages/History.jsx` — Implementasi penuh:
  - Fetch `GET /api/booking`
  - Tampilkan list booking dengan status badge (pending/confirmed/completed/cancelled)
  - Tombol "Cancel" untuk booking yang masih pending

**Perubahan DB:** Tidak ada

---

#### Task 18: `GET /api/users/me` (ROI: 20)

**File dimodifikasi:**
- `internal/user/handler.go` — **File baru** dengan handler `GetMeHandler`
- `api/router.go` — `GET /api/users/me`

**Endpoint baru:**
| Method | Endpoint | Auth | Keterangan |
|--------|----------|------|-----------|
| `GET` | `/api/users/me` | Any logged in | Return data user yang sedang login |

---

**✔ Definisi Selesai Hari 12:**
- [ ] `/history` tidak lagi blank, tampilkan booking real
- [ ] Navbar bisa tampilkan nama user dari `GET /api/users/me`

---

### ✅ Hari 13 (15 Juni) — Dry Run Demo

> **Target:** Simulasi demo penuh dari awal sampai akhir. Catat semua bug.

**Checklist Dry Run:**

```
SKENARIO CUSTOMER:
[ ] Buka http://localhost:3000
[ ] Klik "Daftar" → isi form → submit → redirect ke login
[ ] Login dengan akun baru → berhasil masuk
[ ] Klik "Reservasi" → lihat daftar layanan dari backend
[ ] Pilih layanan → pilih barber (dari backend) → pilih waktu → submit
[ ] Muncul halaman konfirmasi booking berhasil
[ ] Buka /history → tampil booking dengan status "pending"

SKENARIO BARBER:
[ ] Login sebagai barber (rizky@zigzag.com / barber123)
[ ] Hit GET /api/booking/barber → lihat booking yang masuk
[ ] Hit PUT /api/booking/:id/status body {"status":"confirmed"}
[ ] Hit POST /api/attendance body {"status":"hadir"}

SKENARIO ADMIN:
[ ] Login sebagai admin (admin@zigzag.com / admin123)
[ ] Hit GET /api/admin/bookings → lihat semua booking
[ ] Hit GET /api/admin/dashboard → lihat statistik
```

**Output Hari 13:**
- List bug yang ditemukan selama dry run
- Prioritas bugfix untuk Hari 14

---

### ✅ Hari 14 (16 Juni) — Bugfix + Final Polish

> **Target:** Semua bug dari dry run terselesaikan. Sistem siap demo.

**Task:**
- Bugfix dari hasil dry run Hari 13
- Pastikan seed data bersih dan siap
- Validasi semua endpoint dengan token yang benar
- Opsional: `Dockerfile` jika ada waktu

---

## 4. Fitur yang Boleh Dipotong (Jika Waktu Tidak Cukup)

Potong dalam urutan ini — dari yang paling aman dipotong:

| Urutan Potong | Fitur | Alasan Boleh Dipotong |
|:---:|-------|----------------------|
| 1 | **Dockerfile** (P2.5) | Tidak mempengaruhi demo. Hanya infrastruktur |
| 2 | **Admin: Kelola Barber** (P2.2) | Barber bisa dibuat via seed/langsung DB. Admin view-only cukup untuk demo |
| 3 | **`GET /api/users/me`** (P2.3) | Nice-to-have. UI masih bisa berjalan tanpa nama user di navbar |
| 4 | **Frontend: Admin Dashboard UI** | Statistik bisa ditunjukkan via Postman/curl jika UI belum jadi |
| 5 | **Frontend: Barber Dashboard UI** | Konfirmasi booking bisa dilakukan via Postman saat demo barber |
| 6 | **Payment Flow** | Bisa diskip dengan catatan "payment sedang dikembangkan" — demo tidak akan terlalu terpengaruh |

> **JANGAN DIPOTONG (Bahaya jika tidak ada):**
> - CORS ← tanpa ini tidak ada yang bisa didemonstrasikan
> - Frontend Auth Integration ← login hanya alert = tidak kredibel
> - Service + Barber endpoints ← booking flow tidak bisa berjalan
> - Seed data ← demo dengan DB kosong = gagal

---

## 5. Ringkasan Per Minggu

### Minggu 1 (3–8 Juni) — Backend Complete + Frontend Auth
| Hari | Deliverable Utama |
|:----:|-------------------|
| 1 | Security fixed, CORS aktif, `.env.example` ada |
| 2 | Tabel `services` ada, `GET /api/services` berjalan |
| 3 | `GET /api/barbers` berjalan, `service_id` ada di booking |
| 4 | DB penuh seed data, siap demo data |
| 5 | Barber bisa lihat booking, RBAC aktif |
| 6 | Login/Register frontend → backend |
| 7 | Buffer / booking flow mulai |

### Minggu 2 (9–16 Juni) — Integrasi + Fitur Tambahan
| Hari | Deliverable Utama |
|:----:|-------------------|
| 7–8 | Booking flow frontend terhubung backend |
| 9 | Attendance berjalan |
| 10 | Payment berjalan |
| 11 | Admin: all bookings + dashboard statistik |
| 12 | History frontend, users/me endpoint |
| 13 | Dry run penuh, bug list dibuat |
| 14 | Semua bug terselesaikan, sistem siap |

---

## 6. Definisi "Presentasi Berhasil"

Sistem dinyatakan siap presentasi jika dapat menjalankan skenario ini **tanpa error, tanpa perlu reload manual, tanpa intervensi developer:**

```
1. Customer mendaftar → login → booking layanan → lihat history → cancel booking
2. Barber login → konfirmasi booking customer → input absensi
3. Admin login → lihat semua booking → lihat statistik
```

Semua skenario di atas harus bisa dijalankan dengan data dari database Supabase (bukan mock/hardcode).

---

*Dokumen ini dibuat berdasarkan analisis source code aktual, ERD_ANALYSIS.md, dan GAP_ANALYSIS.md per 3 Juni 2026.*
