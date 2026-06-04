package api

import (
	"time"

	"zigzag-barbershop/internal/auth"
	"zigzag-barbershop/internal/barber"
	"zigzag-barbershop/internal/booking"
	"zigzag-barbershop/internal/service"
	"zigzag-barbershop/pkg/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()

	// ─── CORS Middleware ───────────────────────────────────────────────────────
	// Izinkan frontend React (localhost:3000) mengakses API ini.
	// Untuk production, ganti AllowOrigins dengan domain yang sebenarnya.
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// ─── Routes ───────────────────────────────────────────────────────────────
	api := router.Group("/api")
	{
		// Public routes — tidak butuh JWT
		api.POST("/auth/login", auth.LoginHandler)
		api.POST("/auth/register", auth.RegisterHandler)
		api.GET("/services", service.GetServicesHandler)
		api.GET("/barbers", barber.GetBarbersHandler)

		// Protected routes — butuh JWT token
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.POST("/booking", booking.CreateBookingHandler)
			protected.GET("/booking", booking.GetBookingHistoryHandler)
			protected.PUT("/booking/:id/cancel", booking.CancelBookingHandler)
			protected.PUT("/booking/:id/status", booking.UpdateBookingStatusHandler)
			protected.POST("/payment", func(c *gin.Context) {})
			protected.POST("/attendance", func(c *gin.Context) {})
			protected.GET("/report", func(c *gin.Context) {})
		}

		// Admin-only routes — butuh JWT + role admin
		admin := api.Group("/admin")
		admin.Use(middleware.AuthMiddleware())
		admin.Use(middleware.RequireRole("admin"))
		{
			admin.POST("/services", service.CreateServiceHandler)
		}
	}

	// Health check
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "ping",
		})
	})

	return router
}