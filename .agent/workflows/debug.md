---
description: Diagnose and fix bugs or unexpected behavior. Run /debug [describe the problem] to investigate any issue.
---

## Steps

### 1. Understand the problem
- Minta user untuk mendeskripsikan:
  - Apa yang diexpect terjadi
  - Apa yang actually terjadi
  - Error message atau HTTP response yang diterima
  - Endpoint dan request yang dipakai (method, path, headers, body)

### 2. Identify the layer
Tentukan di layer mana bug kemungkinan berada:
- **Routing** — endpoint tidak terdaftar atau path salah
- **Middleware** — token tidak terbaca, role tidak ter-set di context
- **Handler** — parsing request salah, response salah
- **Service** — business logic error, validasi salah
- **Database** — query salah, constraint violation

### 3. Read the relevant files
Baca file-file yang relevan dengan bug yang dilaporkan.

### 4. Identify root cause
- Jelaskan root cause dengan jelas
- Tunjukkan baris kode yang bermasalah

### 5. Propose fix
- Jelaskan fix yang diusulkan
- Verifikasi fix tidak melanggar rules di `.antigravity/rules.md`
- Verifikasi fix tidak mengekspos security issue baru

### 6. Wait for approval, then implement
- Tunjukkan diff/perubahan yang akan dilakukan
- Tunggu konfirmasi user sebelum mengubah kode
- Setelah disetujui, implementasikan fix

### 7. Produce a Debug Report artifact

```
## Debug Report — [Problem Description]

### Root Cause
Penjelasan singkat apa yang salah dan mengapa.

### Problematic code
File dan baris yang bermasalah.

### Fix applied
Apa yang diubah dan mengapa itu fix problemnya.

### How to verify
Cara test bahwa bug sudah fixed.
```
