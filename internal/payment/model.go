package payment

import "gorm.io/gorm"

type Payment struct {
	gorm.Model
	BookingID uint   `gorm:"not null" json:"booking_id"`
	Amount    int    `gorm:"not null" json:"amount"`
	Method    string `gorm:"size:50;not null" json:"method"` // cash / credit_card / e_wallet / qris
	Status    string `gorm:"size:50;not null" json:"status"` // pending / completed / failed
}