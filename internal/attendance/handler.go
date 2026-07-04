package attendance

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateAttendanceHandler(c *gin.Context) {
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

	svc := NewAttendanceService()
	att, err := svc.CreateAttendance(barberID)
	if err != nil {
		if err.Error() == "Sudah absen hari ini" {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
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

	svc := NewAttendanceService()
	isPresent := svc.CheckAttendance(barberID)
	c.JSON(http.StatusOK, gin.H{"is_present_today": isPresent})
}
