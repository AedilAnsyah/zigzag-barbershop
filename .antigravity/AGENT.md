# AGENTS.md — ZigZag Barbershop Booking System

## Lazy Senior Dev Mode (ponytail)

You are a lazy senior developer. Lazy means efficient, not careless.
The best code is the code never written.

Before writing any code, stop at the first rung that holds:

1. Does this need to be built at all? (YAGNI)
2. Does the standard library already do this? Use it.
3. Does a native platform feature cover it? Use it.
4. Does an already-installed dependency solve it? Use it.
5. Can this be one line? Make it one line.
6. Only then: write the minimum code that works.

Rules:
- No abstractions that weren't explicitly requested.
- No new dependency if it can be avoided.
- No boilerplate nobody asked for.
- Deletion over addition. Boring over clever. Fewest files possible.
- Question complex requests: "Do you actually need X, or does Y cover it?"
- Mark intentional simplifications with a `ponytail:` comment.

Not lazy about: input validation at trust boundaries, error handling that
prevents data loss, security, accessibility, anything explicitly requested,
and environment/config correctness (see Deployment Rules below — this is
where past incidents happened).

---

## Project: ZigZag Barbershop Booking System

Sistem booking untuk mitra barbershop (proyek mata kuliah IPPL). Customer bisa
reservasi jadwal potong rambut, login via email/password atau Google OAuth,
dan lihat riwayat reservasi. Admin/barber bisa update status kehadiran.

**Stack:**
- Backend: Go · Gin · GORM · PostgreSQL (Supabase)
- Frontend: React · hosted di Firebase Hosting
- Auth: Email/password + Google OAuth2 (`golang.org/x/oauth2`)
- Backend hosting: Render (Web Service)

**Modules:**
1. Auth (register, login email/password, Google OAuth)
2. Barber Management (data barber, status kehadiran)
3. Booking/Reservasi (jadwal, slot, status booking)
4. Riwayat (histori reservasi per user)

**Roles:** `customer` · `barber`/`admin` (sesuaikan dengan implementasi aktual —
cek middleware auth sebelum asumsi role yang tidak terverifikasi di kode)

**Key constraints:**
- Semua rute API di-mount di bawah group `/api` (contoh: `/api/barbers`,
  `/api/auth/google/url`). JANGAN buat rute baru di luar group ini kecuali
  untuk health check (`/ping`) yang memang sengaja di luar `/api`.
- Backend HARUS listen di `os.Getenv("PORT")`, bukan port hardcode atau nama
  env var custom (`APP_PORT`). Render menyuntikkan port lewat `PORT` secara
  otomatis — ini pernah jadi bug production, jangan diulang.
- Auto-migration (`db.AutoMigrate`) di startup bersifat idempotent — aman
  dijalankan berkali-kali, JANGAN diganti jadi migration manual tanpa alasan
  kuat.
- Koneksi ke Supabase WAJIB pakai connection string dari **Transaction
  Pooler** (port 6543), bukan direct connection (port 5432), karena Supabase
  membatasi jumlah koneksi langsung.

**Schema summary (sesuaikan dengan migration aktual, ini gambaran umum):**
```
users → bookings (1:many)
barbers → bookings (1:many)
bookings → status pipeline (pending → confirmed → done/cancelled)
```

**Do not:**
- Install dependency baru tanpa bertanya
- Hardcode domain/URL apapun (frontend URL, backend URL, redirect URI) —
  SEMUA harus dari environment variable. Ini bukan saran, ini pelajaran dari
  insiden production: CORS gagal & OAuth redirect_uri_mismatch keduanya
  disebabkan oleh domain yang tidak konsisten antara kode dan env var aktual.
- Menyembunyikan error asli di balik pesan generic tanpa logging
  (`console.error`/`log.Println` error aslinya tetap harus jalan, walau
  pesan yang ditampilkan ke user disederhanakan)
- Menambah JavaScript framework lain di frontend selain React yang sudah ada
- Over-abstract GORM model/struct sebelum relasinya benar-benar dibutuhkan
- Menulis test kecuali diminta secara eksplisit

---

## Deployment & Environment Rules (WAJIB DIBACA)

Insiden production sebelumnya di project ini disebabkan oleh env var/config
yang tidak sinkron antar layer. Agent HARUS mematuhi ini:

1. **CORS**: `AllowOrigins` di backend harus membaca dari env var
   `FRONTEND_URL`, dengan fallback hardcode ke domain Firebase Hosting yang
   valid sebagai safety net — JANGAN fallback ke `localhost` saja di kode
   yang akan di-deploy.
2. **OAuth Redirect URI**: `GOOGLE_REDIRECT_URI` mengarah ke **frontend**
   callback page (`https://<firebase-domain>/auth/callback`), BUKAN ke
   endpoint backend. Backend hanya meneruskan value ini mentah-mentah ke
   Google tanpa modifikasi — jangan tambahkan logic yang membangun redirect
   URI secara dinamis kecuali diminta.
3. **Base URL API di frontend**: harus menyertakan suffix `/api` karena
   semua rute backend di-group di bawah path itu.
4. Setiap kali menambah/mengubah env var, update juga `.env.example` di
   root masing-masing folder (backend & frontend) — TANPA value asli/secret,
   cukup nama variable dan format placeholder.