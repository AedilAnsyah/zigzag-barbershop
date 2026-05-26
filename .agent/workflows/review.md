---
description: Review existing code against project rules. Run /review [file or feature] to audit any part of the codebase.
---

## Steps

### 1. Read the target
- Baca file atau fitur yang dispesifikasikan user
- Jika tidak ada target yang dispesifikasikan, review file yang paling baru dimodifikasi

### 2. Run the security audit

Cek setiap hal berikut — flag pelanggaran apapun sebagai [CRITICAL]:

- [ ] Apakah JWT secret di-hardcode di kode? → Harus dari environment variable
- [ ] Apakah user_id diambil dari request body bukan JWT claims? → Critical violation
- [ ] Apakah ada query user-spesifik tanpa ownership check (WHERE user_id = ?)? → Critical violation
- [ ] Apakah ada password atau token yang di-log? → Critical violation
- [ ] Apakah endpoint sensitif tidak punya AuthMiddleware? → Critical violation
- [ ] Apakah ada endpoint yang role check-nya bisa dibypass? → Critical violation

### 3. Run the code quality audit

Cek setiap hal berikut — flag sebagai [WARNING]:

- [ ] Apakah ada business logic di handler layer? → Harus dipindah ke service
- [ ] Apakah ada query DB langsung di handler? → Harus dipindah ke service
- [ ] Apakah response format tidak konsisten dengan Section 6? → Flag
- [ ] Apakah naming convention tidak sesuai Section 5? → Flag
- [ ] Apakah ada file yang ditempatkan di luar struktur Section 4? → Flag
- [ ] Apakah ada endpoint baru yang belum terdaftar di routes.go? → Flag

### 4. Run the scope audit

- [ ] Apakah ada kode yang mengimplementasikan fitur di luar MVP scope (Section 8)? → Flag sebagai [OUT OF SCOPE]

### 5. Run the authorization audit

- [ ] Apakah semua endpoint di access matrix (Section 7) sudah punya middleware yang benar?
- [ ] Apakah customer tidak bisa akses endpoint barber/admin?
- [ ] Apakah barber tidak bisa cancel booking customer?

### 6. Produce the Review Report artifact

```
## Review Report — [Target]

### Summary
Overall assessment: PASS / PASS WITH WARNINGS / FAIL

### Critical issues (harus fix sebelum ship)
- [CRITICAL] deskripsi — file:baris

### Warnings (sebaiknya fix)
- [WARNING] deskripsi — file:baris

### Out of scope
- [OUT OF SCOPE] deskripsi — file:baris

### Authorization gaps
- Endpoint yang authorization-nya kurang atau salah

### Passed checks
- Daftar checks yang passed bersih

### Recommended next steps
1. ...
```

### 7. Offer to fix
Setelah report, tanya: "Mau aku fix critical issues sekarang?"
- Jika ya: jalankan /plan untuk setiap fix, lalu /implement setelah disetujui
- Jika tidak: tinggalkan report sebagai referensi
