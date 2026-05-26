# ZigZag Barbershop — Project Constitution

> Ini adalah sumber kebenaran tunggal untuk semua keputusan dalam proyek ini.
> Baca file ini sepenuhnya sebelum merencanakan, menghasilkan, atau memodifikasi kode apapun.
> Setiap aturan di sini tidak dapat dinegosiasikan kecuali secara eksplisit di-override oleh user di chat.

---

## 1. Project Overview

**Name:** ZigZag Barbershop Backend  
**Type:** REST API — server-side, deployed ke VPS  
**Stack:** Golang + Gin Framework + GORM + PostgreSQL (Supabase)  
**Purpose:** Sistem booking barbershop untuk mitra IPPL — menangani autentikasi user, manajemen booking, otorisasi berbasis role  
**Auth model:** JWT-based authentication. Token divalidasi di middleware sebelum mengakses protected routes.

---

## 2. Agent Behavior Rules

### 2.1 General Conduct

- Selalu baca dan terapkan file ini sepenuhnya sebelum memulai task apapun.
- Sebelum menulis kode apapun, jalankan `/plan` terlebih dahulu — outline file apa yang akan diubah, pendekatannya, dan implikasi keamanannya.
- Jangan pernah melanjutkan melewati tahap perencanaan tanpa konfirmasi user untuk task yang menyentuh: schema database, JWT logic, atau role authorization.
- Jika task ambigu, ajukan **satu** pertanyaan klarifikasi sebelum melanjutkan — jangan asumsikan lalu implementasi hal yang salah.
- Prefer perubahan kecil yang bisa di-review daripada rewrite besar. Satu perubahan logis per langkah implementasi.
- Jangan refactor response format yang sudah ada kecuali diminta secara eksplisit — MVP lebih penting dari over-standardization.

### 2.2 Code Generation Rules

- Jangan pernah generate placeholder atau mock logic (e.g., `// TODO: add real auth`). Implementasikan dengan benar atau stop dan tanya.
- Jangan pernah hardcode secrets — JWT secret key, DB connection string, dan credentials harus dari environment variables.
- Selalu gunakan naming convention yang ada: PascalCase untuk function dan struct, camelCase untuk variable.
- Ikuti struktur file yang didefinisikan di Section 4 dengan tepat. Jangan buat file di luar struktur tanpa bertanya terlebih dahulu.
- Setiap handler baru harus terdaftar di file routing yang sesuai di `api/`.
- Jangan tambah dependency baru tanpa konfirmasi user.

### 2.3 Security Mindset

Sebelum mengimplementasikan fitur apapun, tanyakan: **"Apakah ini bisa mengekspos data user lain atau membypass role authorization?"**

Critical operations yang harus selalu divalidasi:
- Ownership check: `WHERE id = ? AND user_id = ?` untuk semua operasi yang user-spesifik
- Role check: middleware harus memvalidasi role sebelum handler dieksekusi
- JWT claims: ekstrak `user_id` dan `role` dari token, jangan percaya request body untuk ini

### 2.4 When to Stop and Ask

Stop dan tanya user sebelum:
- Mengubah database schema
- Mengubah JWT signing method atau struktur claims
- Menambah dependency baru (Go module)
- Mengimplementasikan fitur yang tidak ada di MVP Scope (Section 8)
- Mengubah struktur folder utama

---

## 3. Tech Stack & Versions

| Layer | Tool | Notes |
|---|---|---|
| Language | Go (Golang) | Standard Go idioms, no over-engineering |
| Framework | Gin | Router, middleware, context handling |
| ORM | GORM | Model definition, query building |
| Database | PostgreSQL (Supabase) | Cloud-hosted, akses via connection string |
| Auth | JWT (`golang-jwt/jwt`) | HS256 signing, claims berisi user_id dan role |
| Testing | Thunder Client (VSCode) | Manual API testing |
| Deployment | VPS | Linux server, binary deployment |

**Jangan tambahkan framework atau library baru tanpa persetujuan user.**

---

## 4. File Structure

```
zigzag-barbershop/
├── api/                        # Route registration
│   └── routes.go               # Semua endpoint didaftarkan di sini
├── cmd/
│   └── main.go                 # Entry point aplikasi
├── config/
│   └── config.go               # Load environment variables
├── database/
│   └── database.go             # Koneksi DB dan auto-migrate
├── internal/
│   ├── auth/
│   │   ├── handler.go          # Register, Login handlers
│   │   ├── service.go          # Business logic auth
│   │   └── model.go            # User struct, request/response types
│   ├── booking/
│   │   ├── handler.go          # Booking CRUD handlers
│   │   ├── service.go          # Business logic booking + validasi
│   │   └── model.go            # Booking struct, request/response types
│   ├── user/
│   │   ├── handler.go
│   │   ├── service.go
│   │   └── model.go
│   ├── attendance/             # Non-MVP — jangan sentuh dulu
│   ├── payment/                # Non-MVP — jangan sentuh dulu
│   └── report/                 # Non-MVP — jangan sentuh dulu
├── pkg/
│   └── middleware/
│       └── auth.go             # AuthMiddleware, RoleMiddleware
├── frontend/                   # Bukan tanggung jawab backend agent
├── .env                        # TIDAK di-commit ke git
├── docker-compose.yml
├── go.mod
└── go.sum
```

**Aturan file:**
- Setiap modul internal harus punya `handler.go`, `service.go`, dan `model.go`
- Handler hanya boleh berisi HTTP logic (parse request, call service, return response)
- Business logic harus ada di `service.go`, bukan di handler
- Jangan taruh query database langsung di handler

---

## 5. Naming Conventions

### Functions
```go
// PascalCase untuk exported functions
func CreateBookingHandler(c *gin.Context) {}
func GetBookingsHandler(c *gin.Context) {}
func ValidateBookingDate(date string) error {}
```

### Structs
```go
// PascalCase untuk struct dan field yang di-export
type Booking struct {
    ID       uint   `json:"id"`
    UserID   uint   `json:"user_id"`
    BarberID uint   `json:"barber_id"`
}

type CreateBookingRequest struct {
    BarberID uint   `json:"barber_id"`
    Date     string `json:"date"`
    Time     string `json:"time"`
}
```

### Variables
```go
// camelCase untuk local variables
userID := claims["user_id"]
bookingDate := req.Date
authHeader := c.GetHeader("Authorization")
```

---

## 6. Response Format Convention

**Gunakan format yang sudah ada — jangan ubah kecuali diminta.**

Error response:
```json
{
  "error": "pesan error yang jelas"
}
```

Success response:
```json
{
  "message": "deskripsi singkat",
  "data": {}
}
```

Atau untuk list:
```json
{
  "data": []
}
```

**HTTP Status codes yang digunakan:**
| Situasi | Code |
|---|---|
| Success | 200 |
| Created | 201 |
| Bad request / validation error | 400 |
| Unauthorized (no/invalid token) | 401 |
| Forbidden (wrong role) | 403 |
| Not found | 404 |
| Conflict (double booking) | 409 |
| Internal server error | 500 |

---

## 7. Authorization Model

### Role Hierarchy
```
admin > barber > customer
```

### Endpoint Access Matrix

| Endpoint | Customer | Barber | Admin |
|---|---|---|---|
| POST /api/auth/register | ✅ | ✅ | ✅ |
| POST /api/auth/login | ✅ | ✅ | ✅ |
| POST /api/booking | ✅ | ❌ | ❌ |
| GET /api/booking | ✅ (own only) | ✅ (assigned) | ✅ (all) |
| PUT /api/booking/:id/cancel | ✅ (own only) | ❌ | ❌ |
| PUT /api/booking/:id/status | ❌ | ✅ | ✅ |
| GET /api/report | ❌ | ❌ | ✅ |

### JWT Claims Structure
```go
claims := jwt.MapClaims{
    "user_id": user.ID,
    "role":    user.Role,   // "customer" | "barber" | "admin"
    "exp":     expireTime,
}
```

### Middleware Pattern
```go
// Di routes.go:
protected := r.Group("/api")
protected.Use(middleware.AuthMiddleware())

// Route yang butuh role spesifik:
barberRoutes := protected.Group("/")
barberRoutes.Use(middleware.RoleMiddleware("barber", "admin"))
```

### Ownership Validation
Semua query yang user-spesifik HARUS include user_id dari JWT claims, bukan dari request:
```go
// BENAR:
db.Where("id = ? AND user_id = ?", bookingID, userID).First(&booking)

// SALAH:
db.Where("id = ?", bookingID).First(&booking)
```

---

## 8. MVP Scope (3 Minggu — Jangan Exceed)

Build hanya yang ada di sini. Tidak ada scope creep.

### Customer Features
- [x] Register (POST /api/auth/register)
- [x] Login JWT (POST /api/auth/login)
- [x] Create booking (POST /api/booking)
- [x] View booking history (GET /api/booking)
- [x] Cancel booking (PUT /api/booking/:id/cancel)

### Barber Features
- [x] Login
- [ ] View assigned bookings (GET /api/booking — filter by barber_id)
- [ ] Update booking status → confirmed / completed (PUT /api/booking/:id/status)

### Admin Features
- [x] Login
- [ ] View all bookings (GET /api/booking — no filter)
- [ ] Manage booking status (PUT /api/booking/:id/status)

### System Features
- [x] JWT authentication
- [x] Booking validation (date, time, past date)
- [x] Double booking prevention
- [x] Ownership security
- [ ] Role-based authorization middleware (RoleMiddleware)

### Explicitly Non-MVP — Jangan Disentuh Dulu
- Payment gateway (Midtrans)
- QR attendance
- Real-time notification
- Analytics dashboard
- Full reporting
- Upload image/media
- Swagger documentation (opsional, setelah fitur selesai)

---

## 9. Environment & Deployment

### Environment Variables (.env)
```
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
APP_PORT=8080
```

**Jangan pernah commit .env ke git. Sudah ada di .gitignore.**

### Deployment Target
- **VPS** — Linux server
- Binary Go dikompilasi dan dijalankan langsung
- PostgreSQL di-host di Supabase (cloud)

### Local Development
```bash
go run cmd/main.go
```

---

## 10. Database Schema

### Table: users
```sql
id          SERIAL PRIMARY KEY
name        VARCHAR NOT NULL
email       VARCHAR UNIQUE NOT NULL
password    VARCHAR NOT NULL  -- bcrypt hashed
role        VARCHAR NOT NULL  -- 'customer' | 'barber' | 'admin'
created_at  TIMESTAMP
updated_at  TIMESTAMP
deleted_at  TIMESTAMP        -- soft delete
```

### Table: bookings
```sql
id          SERIAL PRIMARY KEY
user_id     INTEGER REFERENCES users(id)
barber_id   INTEGER REFERENCES users(id)
date        DATE NOT NULL
time        TIME NOT NULL
status      VARCHAR NOT NULL  -- 'pending' | 'confirmed' | 'completed' | 'cancelled'
created_at  TIMESTAMP
updated_at  TIMESTAMP
deleted_at  TIMESTAMP        -- soft delete
```
