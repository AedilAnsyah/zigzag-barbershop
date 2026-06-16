package auth

import (
	"net/http"

	"zigzag-barbershop/database"
	"zigzag-barbershop/internal/booking"
	"zigzag-barbershop/internal/user"

	"github.com/gin-gonic/gin"
)

// GetAdminBookingsHandler mengambil semua reservasi secara global untuk dashboard admin
func GetAdminBookingsHandler(c *gin.Context) {
	var bookings []booking.Booking
	db := database.DB

	// Preload relasi untuk memunculkan detail User, Barber, dan Service
	if err := db.Preload("User").Preload("Barber").Preload("Service").Order("created_at desc").Find(&bookings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data reservasi global"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": bookings})
}

// UpdateBarberStatusHandler mengubah field provider/is_active barber di database
func UpdateBarberStatusHandler(c *gin.Context) {
	barberID := c.Param("id")
	var input struct {
		IsActive bool `json:"is_active"` // Mengikuti switch toggle frontend
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Payload tidak valid"})
		return
	}

	db := database.DB
	var b user.User
	if err := db.First(&b, barberID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Barber tidak ditemukan"})
		return
	}

	// Gunakan db.Model().Update() agar hanya 1 kolom yang ter-update di database!
	newProviderStatus := "inactive"
	if input.IsActive {
		newProviderStatus = "local" // atau status default aktif Anda
	}

	if err := db.Model(&b).Update("provider", newProviderStatus).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengupdate database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Status barber berhasil diperbarui"})
}
