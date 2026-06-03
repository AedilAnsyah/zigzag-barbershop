package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// RequireRole mengembalikan middleware yang memvalidasi role user dari JWT context.
// Harus dipasang setelah AuthMiddleware() karena bergantung pada c.Get("role").
//
// Contoh penggunaan:
//
//	adminGroup.Use(middleware.RequireRole("admin"))
//	multiRole.Use(middleware.RequireRole("admin", "barber"))
func RequireRole(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		roleValue, exists := c.Get("role")
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "authorization required",
			})
			return
		}

		userRole, ok := roleValue.(string)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "invalid role in token",
			})
			return
		}

		for _, allowed := range roles {
			if userRole == allowed {
				c.Next()
				return
			}
		}

		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
			"error": "you do not have permission to access this resource",
		})
	}
}
