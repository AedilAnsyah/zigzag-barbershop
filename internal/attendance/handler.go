package attendance

import (
	"net/http"
	"time"

	"zigzag-barbershop/database"

	"github.com/gin-gonic/gin"
)

func CreateAttendanceHandler(c *gin.Context) {
	// Ambil user_id
	userIDValue, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	var barberID uint
	switch v := userIDValue.(type) {
	case uint:
		barberID = v
	case float64:
		barberID = uint(v)
	}

	today := time.Now().Format("2006-01-02")
	var att Attendance
	
	// Cek apakah sudah absen hari ini
	if err := database.DB.Where("barber_id = ? AND date = ?", barberID, today).First(&att).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Sudah absen hari ini"})
		return
	}

	att = Attendance{
		BarberID: barberID,
		Date:     today,
		Status:   "present",
	}

	if err := database.DB.Create(&att).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mencatat absensi"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Absen berhasil dicatat", "data": att})
}

func CheckAttendanceHandler(c *gin.Context) {
	userIDValue, _ := c.Get("user_id")
	var barberID uint
	switch v := userIDValue.(type) {
	case uint:
		barberID = v
	case float64:
		barberID = uint(v)
	}

	today := time.Now().Format("2006-01-02")
	var att Attendance
	if err := database.DB.Where("barber_id = ? AND date = ?", barberID, today).First(&att).Error; err == nil {
		c.JSON(http.StatusOK, gin.H{"is_present_today": true})
		return
	}
	c.JSON(http.StatusOK, gin.H{"is_present_today": false})
}
