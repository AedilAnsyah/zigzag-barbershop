---
description: Generate a structured implementation plan before writing any code. Always run /plan before /implement.
---

## Steps

### 1. Read project constitution
- Read `.antigravity/rules.md` fully
- Identifikasi section mana yang relevan dengan task ini (auth, booking, middleware, schema, scope)

### 2. Understand the task
- Nyatakan ulang request user dengan kata-katamu sendiri
- Identifikasi file mana yang akan dibuat atau dimodifikasi
- Identifikasi middleware apa yang terlibat (AuthMiddleware, RoleMiddleware)
- Flag operasi yang menyentuh authorization atau database schema

### 3. Check scope
- Verifikasi task ada dalam MVP scope (Section 8 of rules.md)
- Jika out of scope, stop dan beritahu user sebelum melanjutkan

### 4. Security check
Sebelum melanjutkan, jawab:
- Apakah endpoint ini butuh AuthMiddleware?
- Apakah endpoint ini butuh RoleMiddleware? Role apa saja?
- Apakah ada query yang butuh ownership validation (WHERE user_id = ?)?
- Apakah ada data sensitif yang bisa terekspos ke role yang salah?

### 5. Produce the Implementation Plan artifact

```
## Implementation Plan — [Task Name]

### Summary
Satu paragraf mendeskripsikan apa yang akan dibangun dan mengapa.

### Files to create
- path/to/file.go — alasan

### Files to modify
- path/to/file.go — apa yang berubah dan mengapa

### Endpoint(s) involved
- METHOD /path — role yang diizinkan

### Authorization flow
- Middleware chain yang akan dipakai
- Ownership check yang dibutuhkan

### Implementation steps
1. Step satu (estimasi: kecil/sedang/besar)
2. Step dua
...

### Open questions
- Ambiguitas apapun yang butuh konfirmasi user sebelum melanjutkan
```

### 6. Wait for user approval
- JANGAN tulis kode apapun sampai user konfirmasi plan
- Jika ada open questions, tanya sekarang
