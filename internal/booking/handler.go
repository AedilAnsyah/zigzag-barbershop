package booking

import (
	"log"
	"net/http"
	"time"

	"zigzag-barbershop/database"

	"github.com/gin-gonic/gin"
)

type CreateBookingRequest struct {
	BarberID uint   `json:"barber_id" binding:"required"`
	Date     string `json:"date" binding:"required"`
	Time     string `json:"time" binding:"required"`
}

func CreateBookingHandler(c *gin.Context) {
	var req CreateBookingRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// STEP 1: Validasi Booking
	// a. Validasi format tanggal
	bookingDate, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date format, use YYYY-MM-DD"})
		return
	}

	// b. Validasi tanggal lampau
	today := time.Now().Truncate(24 * time.Hour)
	if bookingDate.Before(today) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "booking date cannot be in the past"})
		return
	}

	// c. Validasi format jam
	_, err = time.Parse("15:04", req.Time)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid time format, use HH:MM"})
		return
	}

	// Ambil user_id dari JWT
	userIDValue, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user_id not found in token"})
		return
	}

	var userID uint

	switch v := userIDValue.(type) {
	case uint:
		userID = v
	case float64:
		userID = uint(v)
	default:
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user_id type in token"})
		return
	}

	// STEP 2: Check Booking Conflict
	var count int64
	database.DB.Model(&Booking{}).Where("barber_id = ? AND date = ? AND time = ? AND status IN ?", req.BarberID, req.Date, req.Time, []string{"pending", "confirmed"}).Count(&count)
	if count > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "booking slot already taken"})
		return
	}

	// Buat objek booking baru
	booking := Booking{
		UserID:   userID,
		BarberID: req.BarberID,
		Date:     req.Date,
		Time:     req.Time,
		Status:   "pending", // Set default status ke pending
	}

	// Simpan ke database
	if err := database.DB.Create(&booking).Error; err != nil {
		// Log detailed error ke terminal
		log.Printf("[Booking DB Error] Create failed: %v", err)

		// Return detailed error ke response JSON untuk keperluan debugging
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "failed to create booking",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "booking created successfully",
		"data":    booking,
	})
}

func GetBookingHistoryHandler(c *gin.Context) {
	// Ambil user_id dari JWT context
	userIDValue, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user_id not found in token"})
		return
	}

	var userID uint
	switch v := userIDValue.(type) {
	case uint:
		userID = v
	case float64:
		userID = uint(v)
	default:
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user_id type in token"})
		return
	}

	// Fetch bookings dari database
	var bookings []Booking
	if err := database.DB.Where("user_id = ?", userID).Order("created_at desc").Find(&bookings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch bookings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": bookings,
	})
}

func CancelBookingHandler(c *gin.Context) {
	bookingID := c.Param("id")

	// Ambil user_id dari JWT context
	userIDValue, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user_id not found in token"})
		return
	}

	var userID uint
	switch v := userIDValue.(type) {
	case uint:
		userID = v
	case float64:
		userID = uint(v)
	default:
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user_id type in token"})
		return
	}

	// Cari booking berdasarkan booking id dan user_id
	var booking Booking
	if err := database.DB.Where("id = ? AND user_id = ?", bookingID, userID).First(&booking).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "booking not found"})
		return
	}

	// Validasi status booking, tidak boleh dicancel jika sudah cancelled atau completed
	if booking.Status == "cancelled" || booking.Status == "completed" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "booking cannot be cancelled"})
		return
	}

	// Update status menjadi cancelled
	booking.Status = "cancelled"
	if err := database.DB.Save(&booking).Error; err != nil {
		log.Printf("[Booking DB Error] Update Status Cancel failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to cancel booking"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "booking cancelled successfully",
		"data":    booking,
	})
}
