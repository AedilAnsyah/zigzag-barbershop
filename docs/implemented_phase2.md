# 📋 Phase 2 Implementation Report: Architecture & Database Schema Update

**Date:** 15 Juni 2026, 16:20 WIB  
**Reporter:** AI Agent (Antigravity — Claude Opus 4.6)  
**Requested by:** Marzhendo (User)  
**Target File:** `internal/user/model.go`  
**Target Layer:** Backend (Go 1.25 + Gin 1.12 + GORM → Supabase PostgreSQL)

---

## ✅ Status Kerja: SUKSES

Migrasi model `User` dari *single-provider authentication* (email+password only) ke *multi-provider authentication* (local + Google OAuth) **telah berhasil dilakukan** secara non-destructive.

GORM `AutoMigrate` berhasil mengevolusi skema tabel `users` di Supabase PostgreSQL **tanpa menghapus atau merusak data existing** (termasuk akun seed Admin, Barber, dan Customer).

---

## 📝 Code Snippet — Final `internal/user/model.go`

```go
package user

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name      string `gorm:"size:255;not null" json:"name"`
	Email     string `gorm:"size:255;not null;uniqueIndex" json:"email"`
	Password  string `gorm:"size:255" json:"-"`                          // [ARCH-UPDATE] Removed 'not null' for OAuth compatibility
	Role      string `gorm:"size:50;not null" json:"role"`               // admin / customer / barber
	GoogleID  string `gorm:"size:255;uniqueIndex;default:null" json:"-"` // [ARCH-NEW] Google OAuth Sub Claim
	AvatarURL string `gorm:"size:500" json:"avatar_url"`                 // [ARCH-NEW] Google Profile Picture
	Provider  string `gorm:"size:50;default:'local'" json:"provider"`    // [ARCH-NEW] Authentication Source: "local" | "google"
}
```

### Perubahan yang dilakukan:

| Field | Perubahan | Alasan |
|-------|-----------|--------|
| `Password` | Dihapus constraint `not null` | User Google OAuth tidak memiliki password lokal |
| `Email` | Diubah dari `unique` ke `uniqueIndex` | Alignment dengan best practice GORM indexing |
| `GoogleID` | **BARU** — `uniqueIndex;default:null` | Menyimpan Google `sub` claim, unik per akun Google |
| `AvatarURL` | **BARU** — `size:500` | Menyimpan URL foto profil dari Google |
| `Provider` | **BARU** — `default:'local'` | Melacak sumber autentikasi: `"local"` atau `"google"` |

---

## 🗄️ Database Migration Log

### AutoMigrate Execution Output:
```
2026/06/15 16:18:43 Database connection established
2026/06/15 16:18:44  SLOW SQL >= 200ms
[251.580ms] [rows:0] ALTER TABLE "users" DROP CONSTRAINT "uni_users_email"
2026/06/15 16:18:46 Database migrated successfully
```

### Kolom yang ter-migrasi di Supabase PostgreSQL:

| Kolom Baru | Tipe | Constraint | Status |
|------------|------|-----------|--------|
| `google_id` | `varchar(255)` | `UNIQUE INDEX`, `DEFAULT NULL` | ✅ Migrated |
| `avatar_url` | `varchar(500)` | — | ✅ Migrated |
| `provider` | `varchar(50)` | `DEFAULT 'local'` | ✅ Migrated |
| `password` (modified) | `varchar(255)` | `NOT NULL` dihapus → nullable | ✅ Migrated |

### Verifikasi Non-Destructive:
- **Login test** dengan akun existing (`test@test.com / 123456`): ✅ **200 OK** — JWT token berhasil di-generate
- **Ping test** (`GET /ping`): ✅ **200 OK** — Server berjalan normal
- **Semua route** terdaftar tanpa error di Gin router

---

## 🔒 Security Safeguards — Perubahan pada `internal/auth/service.go`

### 1. `Register()` — Password Enforcement untuk Local Registration

```go
func Register(name, email, password, role string) error {
	// [SECURITY] Enforce password requirement for local registration
	if password == "" {
		return fmt.Errorf("password is required for local registration")
	}
	// ... hash + create with Provider: "local"
}
```

**Efek:** Registrasi lokal tetap mewajibkan password, meskipun kolom `password` di database sekarang nullable.

### 2. `Login()` — Block Manual Login untuk Google-Only Accounts

```go
func Login(email, password string) (string, error) {
	// ...
	// [SECURITY] Block manual login for Google-only accounts
	if u.Provider == "google" && u.Password == "" {
		return "", errors.New("akun ini terdaftar via Google. Silakan gunakan Login dengan Google")
	}
	// ...
}
```

**Efek:** User yang terdaftar via Google (tanpa password lokal) tidak bisa login via form email+password. Sistem mengarahkan mereka ke Google OAuth.

---

## 🔮 Security Reminders untuk Phase 3

> ⚠️ **PENTING — Bawa ke Phase 3 (OAuth Handler Implementation):**
>
> 1. **`GoogleCallbackHandler`** harus menangani 3 skenario:
>    - User baru (create dengan `Provider: "google"`, password kosong)
>    - User existing by `google_id` (langsung login)
>    - User existing by `email` (link Google account ke akun lokal)
>
> 2. **Token generation** harus menggunakan `auth.GenerateToken()` yang sudah ada, bukan membuat JWT baru secara manual.
>
> 3. **Environment variables** yang harus disiapkan sebelum Phase 3:
>    - `GOOGLE_CLIENT_ID`
>    - `GOOGLE_CLIENT_SECRET`
>    - `GOOGLE_REDIRECT_URI`
>
> 4. **Go dependency** yang harus di-install:
>    ```bash
>    go get golang.org/x/oauth2
>    go get golang.org/x/oauth2/google
>    ```
>
> 5. **Route registration** di `api/router.go`:
>    - `GET /api/auth/google/url` — Return Google consent URL
>    - `POST /api/auth/google/callback` — Exchange code → JWT

---

**📌 Laporan ini dihasilkan secara otomatis oleh AI Agent setelah berhasil mengeksekusi Phase 2.**  
**Next:** Phase 3 — Backend Google OAuth Handler Implementation
