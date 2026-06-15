package barber

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetBarbersHandler menangani GET /api/barbers
//
// Public endpoint — tidak butuh JWT.
// Mengembalikan daftar semua barber (hanya id dan name).
func GetBarbersHandler(c *gin.Context) {
	barbers, err := GetAllBarbers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": barbers,
	})
}
