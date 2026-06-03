package auth

import (
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// GetSecretKey membaca JWT secret dari environment variable JWT_SECRET.
// Jika tidak di-set, gunakan nilai default dan cetak peringatan.
func GetSecretKey() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Println("[WARNING] JWT_SECRET tidak di-set. Menggunakan nilai default — JANGAN digunakan di production!")
		secret = "zigzag-secret-dev-only"
	}
	return []byte(secret)
}

type Claims struct {
	UserID uint   `json:"user_id"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

func GenerateToken(userID uint, email string, role string) (string, error) {
	claims := &Claims{
		UserID: userID,
		Email:  email,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(GetSecretKey())
}