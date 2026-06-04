package main

import (
	"flag"
	"log"
	"os"

	"zigzag-barbershop/api"
	"zigzag-barbershop/config"
	"zigzag-barbershop/database"
	"zigzag-barbershop/database/seed"
	"zigzag-barbershop/internal/attendance"
	"zigzag-barbershop/internal/booking"
	"zigzag-barbershop/internal/payment"
	"zigzag-barbershop/internal/service"
	"zigzag-barbershop/internal/user"

	"github.com/joho/godotenv"
)

func main() {
	// ─── Parse flags ───────────────────────────────────────────────────────────
	shouldSeed := flag.Bool("seed", false, "Run database seeder and exit")
	flag.Parse()

	if err := godotenv.Load(); err != nil {
		log.Println("[INFO] File .env tidak ditemukan, menggunakan environment variable yang sudah ada")
	}

	cfg := config.LoadConfig()

	database.ConnectDB()

	// Migrate database
	err := database.DB.AutoMigrate(
		&user.User{},
		&booking.Booking{},
		&payment.Payment{},
		&attendance.Attendance{},
		&service.Service{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}
	log.Println("Database migrated successfully")

	// ─── Seed mode ─────────────────────────────────────────────────────────────
	if *shouldSeed {
		seed.Seed(database.DB)
		os.Exit(0)
	}

	router := api.SetupRouter()

	log.Printf("Starting server on port %s...", cfg.AppPort)
	if err := router.Run(":" + cfg.AppPort); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

