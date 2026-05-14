package api

import (
	"zigzag-barbershop/internal/auth"
	"zigzag-barbershop/internal/booking"
	"zigzag-barbershop/pkg/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()
	
	api := router.Group("/api")
	{
		//Public routes
		api.POST("/auth/login", auth.LoginHandler)
		api.POST("/auth/register", auth.RegisterHandler)
		// protected routes
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
		protected.POST("/booking", booking.CreateBookingHandler)
		protected.GET("/booking", booking.GetBookingHistoryHandler)
		protected.PUT("/booking/:id/cancel", booking.CancelBookingHandler)
		protected.POST("/payment", func(c *gin.Context) {})
		protected.POST("/attendance", func(c *gin.Context) {})
		protected.GET("/report", func(c *gin.Context) {})
		}
	}

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "ping",
		})
	})
	return router
}