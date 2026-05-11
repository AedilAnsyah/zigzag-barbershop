package booking

import (
	"gorm.io/gorm"
)

type Booking struct {
	gorm.Model
	UserID   uint   `gorm:"not null" json:"user_id"`
	BarberID uint   `gorm:"not null" json:"barber_id"`
	Date     string `gorm:"type:date;not null" json:"date"`
	Time     string `gorm:"type:time;not null" json:"time"`
	Status   string `gorm:"type:varchar(50);default:'pending';not null" json:"status"`
}
