---
description: Show current project status, what's done, what's in progress, and what's next. Run /status to get a quick overview.
---

## Steps

### 1. Read the rules
- Baca Section 8 (MVP Scope) dari `.antigravity/rules.md`

### 2. Scan the codebase
- Cek file-file yang ada di `internal/` dan `api/routes.go`
- Identifikasi fitur mana yang sudah ada implementasinya

### 3. Produce the Status Report artifact

```
## Project Status — ZigZag Barbershop Backend

### Progress Overview
[X/Y fitur MVP selesai]

### ✅ Completed
- Fitur yang sudah implemented dan tested

### 🔄 In Progress
- Fitur yang sedang dikerjakan

### ⏳ Not Started (MVP)
- Fitur MVP yang belum disentuh

### 🚫 Non-MVP (Jangan dulu)
- Fitur yang sengaja di-defer

### 🔴 Blockers
- Issue atau dependency yang memblok progress

### Recommended Next Task
Satu task konkret yang paling valuable untuk dikerjakan berikutnya, beserta alasannya.
```
