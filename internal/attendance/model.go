package attendance

import "gorm.io/gorm"

type Attendance struct {
	gorm.Model
	BarberID uint `gorm:"not null" json:"barber_id"`
	Date     string `gorm:"size:255;not null" json:"date"`
	Status   string `gorm:"size:50;not null" json:"status"` // hadir / izin / sakit / alfa
}