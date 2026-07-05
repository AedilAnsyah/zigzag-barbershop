package user

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name      string `gorm:"size:255;not null" json:"name"`
	Email     string `gorm:"size:255;not null;uniqueIndex" json:"email"`
	Phone     string `gorm:"size:20;default:''" json:"phone"`
	Password  string `gorm:"size:255" json:"-"`                          // [ARCH-UPDATE] Removed 'not null' for OAuth compatibility
	Role      string `gorm:"size:50;not null" json:"role"`               // admin / customer / barber
	GoogleID  string `gorm:"size:255;uniqueIndex;default:null" json:"-"` // [ARCH-NEW] Google OAuth Sub Claim
	AvatarURL string `gorm:"size:500" json:"avatar_url"`                 // [ARCH-NEW] Google Profile Picture
	Provider  string `gorm:"size:50;default:'local'" json:"provider"`    // [ARCH-NEW] Authentication Source: "local" | "google"
}