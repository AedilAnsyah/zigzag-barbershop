package api

import (
	"os"
	"time"

	"zigzag-barbershop/internal/attendance"
	"zigzag-barbershop/internal/auth"
	"zigzag-barbershop/internal/barber"
	"zigzag-barbershop/internal/booking"
	"zigzag-barbershop/internal/service"
	"zigzag-barbershop/internal/user"
	"zigzag-barbershop/pkg/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()

	// ─── CORS Middleware ───────────────────────────────────────────────────────
	// Izinkan frontend React (localhost:3000) mengakses API ini.
	allowedOrigins := []string{
		"http://localhost:3000",
		"https://zigzag-barbershop-fd544.web.app",
		"https://zigzag-barbershop-fd544.firebaseapp.com",
	}
	if prodOrigin := os.Getenv("FRONTEND_URL"); prodOrigin != "" {
		allowedOrigins = append(allowedOrigins, prodOrigin)
	}

	router.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
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
		api.POST("/auth/login", middleware.RateLimitMiddleware(5, time.Minute), auth.LoginHandler)
		api.POST("/auth/register", middleware.RateLimitMiddleware(5, time.Minute), auth.RegisterHandler)
		api.GET("/auth/google/url", auth.GetGoogleLoginURL)           // [Phase 3] Google OAuth consent URL
		api.POST("/auth/google/callback", auth.GoogleCallbackHandler) // [Phase 3] Google OAuth code exchange
		api.GET("/services", service.GetServicesHandler)
		api.GET("/barbers", barber.GetBarbersHandler)

		// Protected routes — butuh JWT token
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.POST("/booking", middleware.RateLimitMiddleware(10, time.Minute), booking.CreateBookingHandler)
			protected.GET("/booking", booking.GetBookingHistoryHandler)
			protected.PUT("/booking/:id/cancel", booking.CancelBookingHandler)
			protected.PUT("/booking/:id/status", booking.UpdateBookingStatusHandler)
			protected.POST("/payment", func(c *gin.Context) {})
			protected.POST("/attendance", attendance.CreateAttendanceHandler)
			protected.GET("/attendance/status", attendance.CheckAttendanceHandler)
			protected.GET("/report", func(c *gin.Context) {})
			
			// Profile endpoints
			protected.GET("/profile", user.GetProfileHandler)
			protected.PUT("/profile", user.UpdateProfileHandler)
			protected.POST("/profile/photo", user.UploadPhotoHandler)
		}

		// Admin-only routes — butuh JWT + role admin
		admin := api.Group("/admin")
		admin.Use(middleware.AuthMiddleware())
		admin.Use(middleware.RequireRole("admin"))
		{
			admin.POST("/services", service.CreateServiceHandler)
			admin.GET("/bookings", auth.GetAdminBookingsHandler)
			admin.PUT("/barbers/:id/status", auth.UpdateBarberStatusHandler)
		}

		// Barber-only routes
		barberRoute := api.Group("/barber")
		barberRoute.Use(middleware.AuthMiddleware())
		barberRoute.Use(middleware.RequireRole("barber"))
		{
			barberRoute.GET("/bookings", auth.GetAdminBookingsHandler)
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