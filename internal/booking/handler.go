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

func CreateBookingHandler(c *gin.Context) {
	var req CreateBookingRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Ambil user_id dari context (setelah middleware AuthMiddleware)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error" : "unauthorized"})
		return
	}

	// cast float64 ke uint
	req.UserID = uint(userID.(float64))

	c.JSON(http.StatusOK, gin.H{
		"message": "booking created successfully",
		"data":   req,
	})
}