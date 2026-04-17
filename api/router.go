package api
import (
	"github.com/gin-gonic/gin"
	"zigzag-barbershop/internal/auth"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()

	api := router.Group("/api")
	{
		api.POST("/auth/login", auth.LoginHandler)
		api.POST("/auth/register", auth.RegisterHandler)
		api.POST("/booking", func(c *gin.Context) {})
		api.POST("/payment", func(c *gin.Context) {})
		api.POST("/attendance", func(c *gin.Context) {})
		api.GET("/report", func(c *gin.Context) {})
	}

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "ping",
		})
	})
	return router
}