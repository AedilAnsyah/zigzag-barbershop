package seed

import (
	"log"
	"os"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"zigzag-barbershop/internal/service"
	"zigzag-barbershop/internal/user"
)

// hashPassword mengenkripsi password menggunakan bcrypt.
func hashPassword(plain string) string {
	hashed, err := bcrypt.GenerateFromPassword([]byte(plain), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("[Seed] Failed to hash password: %v", err)
	}
	return string(hashed)
}

// seedUsers membuat akun user awal jika belum ada (cek via email).
func seedUsers(db *gorm.DB) {
	adminPass := os.Getenv("SEED_ADMIN_PASSWORD")
	if adminPass == "" {
		log.Fatalf("[Seed] SEED_ADMIN_PASSWORD is required")
	}
	barberPass := os.Getenv("SEED_BARBER_PASSWORD")
	if barberPass == "" {
		log.Fatalf("[Seed] SEED_BARBER_PASSWORD is required")
	}
	customerPass := os.Getenv("SEED_CUSTOMER_PASSWORD")
	if customerPass == "" {
		log.Fatalf("[Seed] SEED_CUSTOMER_PASSWORD is required")
	}

	users := []user.User{
		{
			Name:     "Admin Zig-Zag",
			Email:    "admin@zigzag.com",
			Password: hashPassword(adminPass),
			Role:     "admin",
		},
		{
			Name:     "Rizky Barber",
			Email:    "rizky@zigzag.com",
			Password: hashPassword(barberPass),
			Role:     "barber",
		},
		{
			Name:     "Andi Barber",
			Email:    "andi@zigzag.com",
			Password: hashPassword(barberPass),
			Role:     "barber",
		},
		{
			Name:     "Fajar Barber",
			Email:    "fajar@zigzag.com",
			Password: hashPassword(barberPass),
			Role:     "barber",
		},
		{
			Name:     "Wildan Barber",
			Email:    "wildan@zigzag.com",
			Password: hashPassword(barberPass),
			Role:     "barber",
		},
		{
			Name:     "Test Customer",
			Email:    "test@test.com",
			Password: hashPassword(customerPass),
			Role:     "customer",
		},
		{
			Name:     "Budi Pelanggan",
			Email:    "customer@zigzag.com",
			Password: hashPassword(customerPass),
			Role:     "customer",
		},
	}

	for _, u := range users {
		var existing user.User
		result := db.Where("email = ?", u.Email).First(&existing)
		if result.Error != nil {
			// Belum ada — buat baru
			if err := db.Create(&u).Error; err != nil {
				log.Printf("[Seed] Failed to create user %s: %v", u.Email, err)
			} else {
				log.Printf("[Seed] Created user: %s (%s)", u.Name, u.Role)
			}
		} else {
			log.Printf("[Seed] Skip user (already exists): %s", u.Email)
		}
	}
}

// seedServices membuat layanan awal jika belum ada (cek via name).
func seedServices(db *gorm.DB) {
	services := []service.Service{
		{
			Name:            "Premium Hair Cut",
			Description:     "Termasuk Potong Rambut, Cuci Rambut, Handuk Hangat, Styling, dan Pijat Kepala Ringan.",
			Price:           50000,
			DurationMinutes: 45,
			IsAvailable:     true,
		},
	}

	for _, svc := range services {
		var existing service.Service
		result := db.Where("name = ?", svc.Name).First(&existing)
		if result.Error != nil {
			// Belum ada — buat baru
			if err := db.Create(&svc).Error; err != nil {
				log.Printf("[Seed] Failed to create service '%s': %v", svc.Name, err)
			} else {
				log.Printf("[Seed] Created service: %s (Rp %d)", svc.Name, svc.Price)
			}
		} else {
			log.Printf("[Seed] Skip service (already exists): %s", svc.Name)
		}
	}
}

// Seed menjalankan seluruh proses seeding secara idempotent.
// Aman untuk dijalankan berkali-kali — data yang sudah ada tidak akan diduplikasi.
func Seed(db *gorm.DB) {
	log.Println("[Seed] Starting database seeding...")

	seedUsers(db)
	seedServices(db)

	log.Println("[Seed] Seeding completed.")
}
