package service

import "gorm.io/gorm"

// Service merepresentasikan layanan yang ditawarkan oleh barbershop.
type Service struct {
	gorm.Model
	Name            string `gorm:"size:100;not null"          json:"name"`
	Description     string `gorm:"size:500"                   json:"description"`
	Price           int    `gorm:"not null"                   json:"price"`
	DurationMinutes int    `gorm:"not null;default:30"        json:"duration_minutes"`
	IsAvailable     bool   `gorm:"not null;default:true"      json:"is_available"`
}

// ── Request structs ────────────────────────────────────────────────────────────

// CreateServiceRequest adalah body yang diharapkan saat membuat service baru.
type CreateServiceRequest struct {
	Name            string `json:"name"             binding:"required,min=2,max=100"`
	Description     string `json:"description"      binding:"max=500"`
	Price           int    `json:"price"            binding:"required,min=0"`
	DurationMinutes int    `json:"duration_minutes" binding:"required,min=1"`
}

// ── Response structs ───────────────────────────────────────────────────────────

// ServiceResponse adalah bentuk output yang aman untuk dikirim ke client.
type ServiceResponse struct {
	ID              uint   `json:"id"`
	Name            string `json:"name"`
	Description     string `json:"description"`
	Price           int    `json:"price"`
	DurationMinutes int    `json:"duration_minutes"`
	IsAvailable     bool   `json:"is_available"`
}

// toResponse mengkonversi Service model ke ServiceResponse.
func (s *Service) toResponse() ServiceResponse {
	return ServiceResponse{
		ID:              s.ID,
		Name:            s.Name,
		Description:     s.Description,
		Price:           s.Price,
		DurationMinutes: s.DurationMinutes,
		IsAvailable:     s.IsAvailable,
	}
}
