package database

import ("log"
		"os"
		"gorm.io/driver/postgres"
		"gorm.io/gorm"
		"zigzag-barbershop/internal/user"
		"zigzag-barbershop/internal/booking"
		"zigzag-barbershop/internal/payment"
		"zigzag-barbershop/internal/attendance"
)

var DB *gorm.DB

func ConnectDB() {
	log.Println("DSN:", os.Getenv("DATABASE_URL"))
	dsn := os.Getenv("DATABASE_URL")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	DB = db
	log.Println("Database connection established")
	err = DB.AutoMigrate(
		&user.User{},
		&booking.Booking{},
		&payment.Payment{},
		&attendance.Attendance{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}
	log.Println("Database migrated successfully")
	
}
