package booking

import (
	"gorm.io/gorm"
	"zigzag-barbershop/internal/user"
	"zigzag-barbershop/internal/service"
)

const (
	BookingPending   = "pending"
	BookingConfirmed = "confirmed"
	BookingCompleted = "completed"
	BookingCancelled = "cancelled"
)

type Booking struct {
	gorm.Model
	UserID    uint            `gorm:"not null" json:"user_id"`
	User      user.User       `gorm:"foreignKey:UserID" json:"User"`
	BarberID  uint            `gorm:"not null" json:"barber_id"`
	Barber    user.User       `gorm:"foreignKey:BarberID" json:"Barber"`
	ServiceID *uint           `gorm:"default:null" json:"service_id"`
	Service   service.Service `gorm:"foreignKey:ServiceID" json:"Service"`
	Date      string          `gorm:"type:date;not null" json:"date"`
	Time      string          `gorm:"type:time;not null" json:"time"`
	Status    string          `gorm:"type:varchar(50);default:'pending';not null" json:"status"`
}

type UpdateBookingStatusRequest struct {
	Status string `json:"status" binding:"required"`
}
