---
description: Execute a previously approved implementation plan. Always run /plan first and get user approval before running /implement.
---

## Steps

### 1. Verify plan was approved
- Konfirmasi user sudah mereview dan menyetujui implementation plan
- Jika tidak ada plan untuk task ini, stop dan jalankan /plan terlebih dahulu

### 2. Re-read relevant rules
- Baca ulang section rules.md yang relevan dengan task ini:
  - Section 4 (File Structure)
  - Section 5 (Naming Conventions)
  - Section 6 (Response Format)
  - Section 7 (Authorization Model)

### 3. Implement in order — Middleware first, then Handler

#### Jika task melibatkan middleware baru (pkg/middleware/):
1. Definisikan middleware function dengan signature `func(c *gin.Context)`
2. Ekstrak dan validasi JWT claims
3. Set values ke context: `c.Set("user_id", userID)` dan `c.Set("role", role)`
4. Panggil `c.Next()` jika valid, atau `c.AbortWithStatusJSON()` jika tidak

#### Jika task melibatkan handler baru (internal/[module]/handler.go):
1. Parse dan validasi request body atau params
2. Ambil `user_id` dan `role` dari context (dari middleware), BUKAN dari request body
3. Panggil service layer — handler tidak boleh berisi business logic
4. Return response dengan format yang konsisten (lihat Section 6)

#### Jika task melibatkan service baru (internal/[module]/service.go):
1. Definisikan function signature dengan parameter yang jelas
2. Implementasikan business logic dan validasi
3. Gunakan ownership check pada semua query user-spesifik
4. Return error yang deskriptif (akan di-wrap oleh handler menjadi response)

#### Jika task melibatkan model baru (internal/[module]/model.go):
1. Definisikan GORM struct dengan tags yang benar
2. Definisikan Request struct (untuk binding request body)
3. Definisikan Response struct (untuk shaping output — jangan expose field sensitif)

#### Jika task melibatkan route baru (api/routes.go):
1. Tambahkan route ke group yang sesuai (public, protected, atau role-specific)
2. Pastikan middleware chain sudah benar sebelum handler

### 4. Follow code standards on every file
- Naming: PascalCase untuk function dan struct, camelCase untuk variable
- Error response: `gin.H{"error": "pesan"}` dengan status code yang tepat
- Success response: `gin.H{"message": "...", "data": ...}` atau `gin.H{"data": ...}`
- Jangan hardcode JWT secret atau DB credentials
- Jangan taruh business logic di handler
- Jangan taruh query DB langsung di handler

### 5. Self-review checklist before finishing
Sebelum menandai task selesai, verifikasi:
- [ ] Semua endpoint baru sudah terdaftar di `api/routes.go`
- [ ] Protected endpoints sudah pakai `AuthMiddleware()`
- [ ] Role-restricted endpoints sudah pakai `RoleMiddleware()`
- [ ] Query user-spesifik sudah include `user_id` dari JWT claims
- [ ] Tidak ada hardcoded secret atau credential
- [ ] Response format konsisten dengan Section 6
- [ ] Naming convention sesuai Section 5
- [ ] Tidak ada business logic di handler layer

### 6. Produce a Walkthrough artifact
Setelah implementasi selesai, output:

```
## Walkthrough — [Task Name]

### What was built
Deskripsi singkat fitur yang selesai dibangun.

### Files created
- path/to/file.go

### Files modified
- path/to/file.go — apa yang berubah

### How to test
Instruksi step-by-step untuk verifikasi fitur bekerja (Thunder Client / curl).

### Authorization notes
Keputusan authorization yang dibuat selama implementasi.
```
