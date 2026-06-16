package booking

import (
	"log"
	"net/http"
	"time"

	"zigzag-barbershop/database"
	"zigzag-barbershop/internal/service"
	"zigzag-barbershop/internal/user"

	"github.com/gin-gonic/gin"
)

type CreateBookingRequest struct {
	ServiceID uint   `json:"service_id" binding:"required"`
	BarberID  uint   `json:"barber_id" binding:"required"`
	Date      string `json:"date" binding:"required"`
	Time      string `json:"time" binding:"required"`
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

	// STEP 2: Validasi service exists dan is_available
	var svc service.Service
	if err := database.DB.Where("id = ? AND is_available = ?", req.ServiceID, true).First(&svc).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "service not found or not available"})
		return
	}

	// STEP 3: Validasi barber exists dengan role='barber'
	var barberUser user.User
	if err := database.DB.Where("id = ? AND role = ?", req.BarberID, "barber").First(&barberUser).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "barber not found"})
		return
	}

	// STEP 4: Check Booking Conflict
	var count int64
	database.DB.Model(&Booking{}).Where("barber_id = ? AND date = ? AND time = ? AND status IN ?", req.BarberID, req.Date, req.Time, []string{BookingPending, BookingConfirmed}).Count(&count)
	if count > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "booking slot already taken"})
		return
	}

	// Buat objek booking baru
	serviceID := req.ServiceID
	booking := Booking{
		UserID:    userID,
		BarberID:  req.BarberID,
		ServiceID: &serviceID,
		Date:      req.Date,
		Time:      req.Time,
		Status:    BookingPending, // Set default status ke pending
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
	if booking.Status == BookingCancelled || booking.Status == BookingCompleted {
		c.JSON(http.StatusBadRequest, gin.H{"error": "booking cannot be cancelled"})
		return
	}

	// Update status menjadi cancelled
	if err := database.DB.Model(&booking).Update("status", BookingCancelled).Error; err != nil {
		log.Printf("[Booking DB Error] Update Status Cancel failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to cancel booking"})
		return
	}
	booking.Status = BookingCancelled

	c.JSON(http.StatusOK, gin.H{
		"message": "booking cancelled successfully",
		"data":    booking,
	})
}

func UpdateBookingStatusHandler(c *gin.Context) {
	// 1. Get role from JWT context
	roleValue, exists := c.Get("role")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "authorization header is required"})
		return
	}

	role, ok := roleValue.(string)
	if !ok || (role != "admin" && role != "barber") {
		c.JSON(http.StatusForbidden, gin.H{"error": "only barber or admin can update booking status"})
		return
	}

	// 2. Get booking ID from URL param
	bookingID := c.Param("id")

	// 3. Bind JSON request body
	var req UpdateBookingStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 4. Validate status value
	validStatuses := map[string]bool{
		BookingPending:   true,
		BookingConfirmed: true,
		BookingCompleted: true,
		BookingCancelled: true,
	}
	if !validStatuses[req.Status] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid booking status"})
		return
	}

	// 5. Find booking by ID
	var booking Booking
	if err := database.DB.Where("id = ?", bookingID).First(&booking).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "booking not found"})
		return
	}

	// 5b. Authorization Check
	userIDValue, _ := c.Get("user_id")
	var currentUserID uint
	switch v := userIDValue.(type) {
	case uint:
		currentUserID = v
	case float64:
		currentUserID = uint(v)
	}

	if role == "barber" {
		if booking.BarberID != currentUserID {
			c.JSON(http.StatusForbidden, gin.H{"error": "Hanya bisa mengubah status pelanggan Anda sendiri"})
			return
		}
	} else if role != "admin" && booking.UserID != currentUserID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Anda tidak memiliki akses"})
		return
	}

	// 6. Reject if booking already cancelled or completed
	if booking.Status == BookingCancelled || booking.Status == BookingCompleted {
		c.JSON(http.StatusBadRequest, gin.H{"error": "booking cannot be updated"})
		return
	}

	// 7. Reject if status same as current
	if booking.Status == req.Status {
		c.JSON(http.StatusBadRequest, gin.H{"error": "booking already has this status"})
		return
	}

	// 8. Reject if transition is invalid
	if booking.Status == BookingPending && req.Status != BookingConfirmed && req.Status != BookingCancelled {
		c.JSON(http.StatusBadRequest, gin.H{"error": "booking cannot be updated"})
		return
	}
	if booking.Status == BookingConfirmed && req.Status != BookingCompleted && req.Status != BookingCancelled {
		c.JSON(http.StatusBadRequest, gin.H{"error": "booking cannot be updated"})
		return
	}

	// 9. Update booking status
	if err := database.DB.Model(&booking).Update("status", req.Status).Error; err != nil {
		log.Printf("[Booking DB Error] Update Status failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update booking status"})
		return
	}
	booking.Status = req.Status

	// 10. Return success response
	c.JSON(http.StatusOK, gin.H{
		"message": "booking status updated successfully",
		"data":    booking,
	})
}
