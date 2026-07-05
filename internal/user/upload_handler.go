package user

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
	"zigzag-barbershop/database"

	"github.com/gin-gonic/gin"
)

const maxUploadSize = 2 << 20 // 2 MB

func UploadPhotoHandler(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Retrieve user from DB
	var user User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Enforce memory limit for parsing form (also limits file size generally)
	err := c.Request.ParseMultipartForm(maxUploadSize)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File size exceeds 2MB limit"})
		return
	}

	file, header, err := c.Request.FormFile("photo")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file is received"})
		return
	}
	defer file.Close()

	// Check file size from header
	if header.Size > maxUploadSize {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File size exceeds 2MB limit"})
		return
	}

	// Read file into memory to check MIME type and prepare for Supabase upload
	fileBytes, err := io.ReadAll(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to read file"})
		return
	}

	// Validate file type
	mimeType := http.DetectContentType(fileBytes)
	if mimeType != "image/jpeg" && mimeType != "image/png" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file type. Only JPG, JPEG, and PNG are allowed"})
		return
	}

	supabaseURL := os.Getenv("SUPABASE_URL")
	serviceKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")
	bucket := os.Getenv("SUPABASE_BUCKET")
	if bucket == "" {
		bucket = "avatars"
	}

	if supabaseURL == "" || serviceKey == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Storage configuration is missing"})
		return
	}

	// Base URL for storage object
	storageURL := fmt.Sprintf("%s/storage/v1/object", supabaseURL)
	publicBaseURL := fmt.Sprintf("%s/public/%s/", storageURL, bucket)

	// Attempt to delete old photo if it exists in the same bucket
	if user.AvatarURL != "" && strings.HasPrefix(user.AvatarURL, publicBaseURL) {
		oldFilename := strings.TrimPrefix(user.AvatarURL, publicBaseURL)
		deleteURL := fmt.Sprintf("%s/%s/%s", storageURL, bucket, oldFilename)
		req, _ := http.NewRequest(http.MethodDelete, deleteURL, nil)
		req.Header.Set("Authorization", "Bearer "+serviceKey)
		
		client := &http.Client{Timeout: 5 * time.Second}
		client.Do(req) // We ignore the error; if it fails, it fails, but we continue uploading the new one.
	}

	// Generate new unique filename
	ext := filepath.Ext(header.Filename)
	if ext == "" {
		if mimeType == "image/png" {
			ext = ".png"
		} else {
			ext = ".jpg"
		}
	}
	newFilename := fmt.Sprintf("%v_%d%s", userID, time.Now().Unix(), ext)

	// Upload to Supabase Storage
	uploadURL := fmt.Sprintf("%s/%s/%s", storageURL, bucket, newFilename)
	req, err := http.NewRequest(http.MethodPost, uploadURL, bytes.NewReader(fileBytes))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to prepare storage request"})
		return
	}

	req.Header.Set("Authorization", "Bearer "+serviceKey)
	req.Header.Set("Content-Type", mimeType)

	client := &http.Client{Timeout: 15 * time.Second}
	res, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload to storage server"})
		return
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK && res.StatusCode != http.StatusCreated {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Storage server returned status: %d", res.StatusCode)})
		return
	}

	// Save new AvatarURL to database
	newAvatarURL := publicBaseURL + newFilename
	user.AvatarURL = newAvatarURL
	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save profile changes"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Photo uploaded successfully",
		"avatar_url": newAvatarURL,
	})
}
