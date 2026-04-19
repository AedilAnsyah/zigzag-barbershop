package booking

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

type CreateBookingRequest struct {
	UserID   uint   `json:"-"`
	BarberID uint   `json:"barber_id" binding:"required"`
	Date     string `json:"date" binding:"required"`
	Time     string `json:"time" binding:"required"`
}

type BookingResponse struct {
	UserID   uint   `json:"user_id"`
	BarberID uint   `json:"barber_id"`
	Date     string `json:"date"`
	Time     string `json:"time"`
}

func CreateBookingHandler(c *gin.Context) {
	var req CreateBookingRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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

	req.UserID = userID

	resp := BookingResponse{
		UserID:   req.UserID,
		BarberID: req.BarberID,
		Date:     req.Date,
		Time:     req.Time,
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "booking created successfully",
		"data":   resp,
	})
}