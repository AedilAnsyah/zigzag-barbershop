package main

import (
	"log"
	"zigzag-barbershop/database"
	"zigzag-barbershop/internal/booking"

	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	database.ConnectDB()

	var bookings []booking.Booking
	database.DB.Order("created_at desc").Limit(5).Find(&bookings)

	if len(bookings) == 0 {
		log.Println("Belum ada booking di database.")
		return
	}

	for _, b := range bookings {
		var svcID uint
		if b.ServiceID != nil {
			svcID = *b.ServiceID
		}
		log.Printf("Booking ID: %d | UserID: %d | BarberID: %d | ServiceID: %d | Date: %s | Time: %s | Status: %s\n",
			b.ID, b.UserID, b.BarberID, svcID, b.Date, b.Time, b.Status)
	}
}
