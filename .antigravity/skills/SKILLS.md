# SKILLS.md — ZigZag Barbershop Skills

Kumpulan skill cards yang digunakan agent saat mengerjakan modul tertentu.
Invoke secara eksplisit dengan menyebut nama skill, atau agent akan memilih
otomatis berdasarkan konteks task.

---

## SKILL: go-env-config

**Invoke when:** menambah, membaca, atau mengubah environment variable di
backend (config, koneksi DB, CORS, OAuth, port, dsb)

**Rules:**
- Baca env var HANYA lewat satu titik sentral (contoh: `config/config.go`),
  jangan panggil `os.Getenv(...)` langsung tersebar di banyak file
- Setiap env var kritis (tidak punya default yang aman) harus di-cek saat
  startup — kalau kosong, panik/log fatal dengan pesan jelas, jangan
  biarkan aplikasi jalan dengan config yang salah/kosong secara diam-diam
- Port WAJIB baca dari `os.Getenv("PORT")` dengan fallback ke port lokal
  (misal `8080`) hanya untuk development
- CORS origin WAJIB baca dari `os.Getenv("FRONTEND_URL")` DAN punya
  hardcoded fallback ke domain Firebase Hosting yang valid sebagai
  redundansi (bukan pengganti)
- Update `.env.example` setiap kali ada env var baru

**Example:**
```go
// BENAR — terpusat, ada validasi, ada fallback yang aman
func LoadConfig() *Config {
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080" // dev fallback only
    }
    dbURL := os.Getenv("DATABASE_URL")
    if dbURL == "" {
        log.Fatal("DATABASE_URL is required but not set")
    }
    return &Config{Port: port, DatabaseURL: dbURL}
}

// SALAH — os.Getenv tersebar, tidak ada validasi
func StartServer() {
    router.Run(":" + os.Getenv("APP_PORT")) // env var salah, tidak divalidasi
}
```

---

## SKILL: go-cors-setup

**Invoke when:** mengatur atau mengedit middleware CORS

**Rules:**
- Gunakan `gin-contrib/cors`, jangan tulis middleware CORS manual kecuali
  ada kebutuhan sangat spesifik yang tidak bisa dicover library
- `AllowOrigins` adalah slice yang menggabungkan: domain dev (localhost),
  domain production hardcoded (safety net), dan env var `FRONTEND_URL`
- `AllowMethods` wajib mencakup `OPTIONS` secara eksplisit
- `AllowCredentials: true` jika aplikasi pakai cookie/session auth
- Middleware CORS dipasang di level router utama (sebelum route grouping),
  BUKAN per-route, supaya konsisten ke semua endpoint termasuk yang baru
  ditambahkan nanti

**Pattern:**
```go
allowedOrigins := []string{
    "http://localhost:3000",
    "https://<project-id>.web.app",
    "https://<project-id>.firebaseapp.com",
}
if prodOrigin := os.Getenv("FRONTEND_URL"); prodOrigin != "" {
    allowedOrigins = append(allowedOrigins, prodOrigin)
}

router.Use(cors.New(cors.Config{
    AllowOrigins:     allowedOrigins,
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    AllowHeaders:     []string{"Origin", "Authorization", "Content-Type", "Accept"},
    AllowCredentials: true,
    MaxAge:           12 * time.Hour,
}))
```

---

## SKILL: go-oauth-google

**Invoke when:** mengedit flow Google OAuth (login, callback, redirect)

**Rules:**
- `oauth2.Config` dibaca murni dari env var (`GOOGLE_CLIENT_ID`,
  `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`) — JANGAN membangun
  `RedirectURL` secara dinamis dari request kecuali diminta eksplisit,
  karena ini harus PERSIS sama dengan yang terdaftar di Google Cloud
  Console
- `GOOGLE_REDIRECT_URI` mengarah ke halaman **frontend** yang menangani
  callback (bukan endpoint backend) — frontend yang nanti memanggil
  backend untuk exchange code jadi token
- Jangan swallow error dari Google OAuth exchange tanpa log — kalau gagal,
  log error asli (`log.Println(err)`), baru kirim pesan generic ke client
- Scope minimal: `openid`, `email`, `profile` — jangan tambah scope lain
  tanpa alasan jelas

**Pattern:**
```go
func getOAuthConfig() *oauth2.Config {
    return &oauth2.Config{
        ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
        ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
        RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URI"),
        Scopes:       []string{"openid", "email", "profile"},
        Endpoint:     google.Endpoint,
    }
}

// Saat handle callback — JANGAN swallow error
func HandleGoogleCallback(c *gin.Context) {
    token, err := getOAuthConfig().Exchange(c, c.Query("code"))
    if err != nil {
        log.Printf("google oauth exchange failed: %v", err) // log asli
        c.JSON(500, gin.H{"error": "Gagal login dengan Google"}) // pesan generic
        return
    }
    // ...
}
```

---

## SKILL: go-gin-routing

**Invoke when:** menambah endpoint API baru

**Rules:**
- SEMUA rute baru wajib di-mount di bawah group `/api` yang sudah ada,
  kecuali health check
- Gunakan resource-style grouping: `/api/barbers`, `/api/bookings`, dst —
  bukan flat routing tanpa prefix
- Health check endpoint (`/ping`) tetap di luar `/api`, return JSON
  sederhana `{"message": "ping"}` dengan status 200
- Business logic HARUS di service layer, handler cuma parsing
  request/response + panggil service — jangan taruh query DB langsung di
  handler

**Pattern:**
```go
api := router.Group("/api")
{
    api.GET("/barbers", barberHandler.List)
    api.GET("/bookings", bookingHandler.List)
    api.POST("/bookings", bookingHandler.Create)

    auth := api.Group("/auth")
    {
        auth.GET("/google/url", authHandler.GoogleURL)
        auth.POST("/google/callback", authHandler.GoogleCallback)
    }
}
router.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "ping"})
})
```

---

## SKILL: go-gorm-model

**Invoke when:** membuat atau mengedit GORM model/struct

**Rules:**
- Definisikan relasi hanya yang dibutuhkan task saat ini (YAGNI)
- Gunakan tag GORM eksplisit (`gorm:"column:...;not null"`) untuk kolom
  yang constraint-nya penting, jangan andalkan konvensi default secara diam
- Soft delete (`gorm.DeletedAt`) hanya untuk model yang butuh riwayat
  (contoh: `Booking`), bukan semua model
- `AutoMigrate` dipanggil sekali di startup untuk semua model yang aktif —
  jangan hapus baris AutoMigrate model lama tanpa memastikan tabel tsb
  benar-benar tidak dipakai lagi

**Pattern:**
```go
type Booking struct {
    ID        uint           `gorm:"primaryKey"`
    UserID    uint           `gorm:"not null"`
    BarberID  uint           `gorm:"not null"`
    Status    string         `gorm:"not null;default:pending"`
    CreatedAt time.Time
    DeletedAt gorm.DeletedAt `gorm:"index"`
}
```

---

## SKILL: react-api-client

**Invoke when:** membuat atau mengedit HTTP client di frontend untuk
memanggil backend

**Rules:**
- Base URL API HARUS dari env var (`REACT_APP_API_URL` atau sejenisnya),
  JANGAN hardcode domain di file manapun
- Base URL WAJIB menyertakan suffix `/api` karena semua rute backend
  di-group di bawah path itu
- Semua HTTP call lewat satu instance axios/fetch terpusat — jangan ada
  `fetch()` liar yang hardcode full URL manual di komponen
- Setelah mengubah `.env.production`, WAJIB rebuild sebelum redeploy —
  env var React ter-embed saat build time, bukan runtime

**Pattern:**
```js
// src/lib/api.js — satu-satunya tempat base URL didefinisikan
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // contoh: https://xxx.onrender.com/api
});

export default api;
```

```
# .env.production
REACT_APP_API_URL=https://<backend-domain>.onrender.com/api
```

---

## SKILL: react-auth-flow

**Invoke when:** mengedit halaman login/register atau flow Google OAuth di
frontend

**Rules:**
- Halaman callback OAuth (`/auth/callback`) menerima `code` dari query
  string, lalu kirim ke backend untuk ditukar jadi token — jangan proses
  token di sisi frontend tanpa lewat backend
- Simpan token di tempat yang sesuai kebijakan aplikasi (cek implementasi
  existing sebelum asumsi localStorage vs httpOnly cookie)
- Tampilkan pesan error yang membantu user, tapi log error asli ke console
  untuk debugging — jangan cuma tampilkan "Gagal, coba lagi" tanpa detail
  di console
- Redirect URI yang dipakai di frontend harus konsisten dengan yang
  terdaftar di Google Cloud Console (`Authorized redirect URIs`) DAN
  dengan env var `GOOGLE_REDIRECT_URI` di backend — ketiganya harus sama
  persis