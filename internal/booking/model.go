package booking

import "gorm.io/gorm"

type Booking struct {
	gorm.Model
	UserID    uint   `gorm:"not null" json:"user_id"`
	BarberID  uint   `gorm:"not null" json:"barber_id"`
	Date      string `gorm:"type:jsonb;not null" json:"date"`
	Time      string `gorm:"size:255;not null" json:"time"`
	Status    string `gorm:"size:50;not null" json:"status"` // pending / confirmed / completed / cancelled
}