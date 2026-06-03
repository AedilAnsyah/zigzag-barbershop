package service

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetServicesHandler menangani GET /api/services
//
// Public endpoint — semua user (termasuk yang belum login) bisa mengakses.
// Hanya mengembalikan service yang is_available = true.
func GetServicesHandler(c *gin.Context) {
	services, err := GetAllServices(true)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": services,
	})
}

// CreateServiceHandler menangani POST /api/services
//
// Protected + Admin only. Role check dilakukan di middleware RequireRole.
func CreateServiceHandler(c *gin.Context) {
	var req CreateServiceRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	created, err := CreateService(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "service created successfully",
		"data":    created,
	})
}
