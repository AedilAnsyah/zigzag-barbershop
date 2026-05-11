package main

import (
	"log"
	"zigzag-barbershop/api"
	"zigzag-barbershop/config"
	"zigzag-barbershop/database"
	"zigzag-barbershop/internal/attendance"
	"zigzag-barbershop/internal/booking"
	"zigzag-barbershop/internal/payment"
	"zigzag-barbershop/internal/user"

	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	cfg := config.LoadConfig()

	database.ConnectDB()

	// Migrate database
	err := database.DB.AutoMigrate(
		&user.User{},
		&booking.Booking{},
		&payment.Payment{},
		&attendance.Attendance{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}
	log.Println("Database migrated successfully")

	router := api.SetupRouter()

	log.Printf("Starting server on port %s...", cfg.AppPort)
	if err := router.Run(":" + cfg.AppPort); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
