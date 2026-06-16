package auth

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"

	"zigzag-barbershop/database"
	"zigzag-barbershop/internal/user"
)

// GoogleUserInfo merepresentasikan data profil dari Google OAuth2 UserInfo endpoint.
type GoogleUserInfo struct {
	Sub      string `json:"sub"`            // Google unique ID
	Email    string `json:"email"`          // Email address
	Name     string `json:"name"`           // Full name
	Picture  string `json:"picture"`        // Profile picture URL
	Verified bool   `json:"email_verified"` // Email verification status
}

// getOAuthConfig membaca konfigurasi OAuth2 dari environment variables.
func getOAuthConfig() *oauth2.Config {
	return &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URI"),
		Scopes:       []string{"openid", "email", "profile"},
		Endpoint:     google.Endpoint,
	}
}

// GetGoogleLoginURL returns the Google OAuth consent screen URL.
// Frontend akan me-redirect user ke URL ini untuk memulai flow OAuth.
func GetGoogleLoginURL(c *gin.Context) {
	cfg := getOAuthConfig()
	// Menggunakan state statis untuk kebutuhan development/tugas kuliah
	url := cfg.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	c.JSON(http.StatusOK, gin.H{"url": url})
}

// GoogleCallbackHandler menangani pertukaran authorization code dari Google,
// melakukan sinkronisasi akun di database, dan mengembalikan JWT token aplikasi.
//
// Skenario yang ditangani:
//   - Skenario A: User sudah pernah login Google (GoogleID match) → langsung generate JWT
//   - Skenario B: Email sudah terdaftar lokal → link akun Google ke akun lokal
//   - Skenario C: User baru → registrasi otomatis dengan Provider: "google"
func GoogleCallbackHandler(c *gin.Context) {
	var input struct {
		Code string `json:"code" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Authorization code diperlukan"})
		return
	}

	cfg := getOAuthConfig()

	// 1. Exchange authorization code menjadi access token Google
	token, err := cfg.Exchange(c, input.Code)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Gagal menukarkan code: " + err.Error()})
		return
	}

	// 2. Ambil info user dari Google Resource Server (UserInfo endpoint)
	client := cfg.Client(c, token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v3/userinfo")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data user dari Google"})
		return
	}
	defer resp.Body.Close()

	var googleUser GoogleUserInfo
	if err := json.NewDecoder(resp.Body).Decode(&googleUser); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membaca profil user"})
		return
	}

	// Validasi: Pastikan email Google sudah terverifikasi
	if !googleUser.Verified {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email Google Anda belum diverifikasi"})
		return
	}

	// 3. Resolusi Skenario: Find or Create user di database
	var existingUser user.User
	db := database.DB

	// Skenario A: Cari berdasarkan GoogleID (user pernah login Google sebelumnya)
	result := db.Where("google_id = ?", googleUser.Sub).First(&existingUser)
	if result.Error != nil {
		// GoogleID tidak ditemukan — cari berdasarkan Email
		// Skenario B: Akun lokal dengan email yang sama sudah ada
		result = db.Where("email = ?", googleUser.Email).First(&existingUser)
		if result.Error != nil {
			// Skenario C: User benar-benar baru → Registrasi otomatis
			existingUser = user.User{
				Name:      googleUser.Name,
				Email:     googleUser.Email,
				GoogleID:  googleUser.Sub,
				AvatarURL: googleUser.Picture,
				Provider:  "google",
				Role:      "customer", // Default role untuk tugas kuliah
			}
			if err := db.Create(&existingUser).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mendaftarkan akun baru"})
				return
			}
		} else {
			// Skenario B lanjutan: Akun lokal ditemukan → Account Linking
			existingUser.GoogleID = googleUser.Sub
			existingUser.AvatarURL = googleUser.Picture
			existingUser.Provider = "google"
			db.Save(&existingUser)
		}
	}

	// 4. Generate JWT token menggunakan utility internal yang sudah ada (dari jwt.go)
	jwtToken, err := GenerateToken(existingUser.ID, existingUser.Email, existingUser.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menerbitkan session token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": jwtToken})
}
