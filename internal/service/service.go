package service

import (
	"errors"

	"zigzag-barbershop/database"
)

// GetAllServices mengambil semua service yang tersedia (is_available = true).
// Admin dapat melihat semua service termasuk yang tidak tersedia.
func GetAllServices(onlyAvailable bool) ([]ServiceResponse, error) {
	var services []Service

	query := database.DB.Model(&Service{})
	if onlyAvailable {
		query = query.Where("is_available = ?", true)
	}

	if err := query.Order("name ASC").Find(&services).Error; err != nil {
		return nil, errors.New("failed to fetch services")
	}

	responses := make([]ServiceResponse, 0, len(services))
	for _, s := range services {
		responses = append(responses, s.toResponse())
	}
	return responses, nil
}

// CreateService membuat service baru. Hanya boleh dipanggil oleh admin.
func CreateService(req CreateServiceRequest) (ServiceResponse, error) {
	svc := Service{
		Name:            req.Name,
		Description:     req.Description,
		Price:           req.Price,
		DurationMinutes: req.DurationMinutes,
		IsAvailable:     true, // default aktif saat dibuat
	}

	if err := database.DB.Create(&svc).Error; err != nil {
		return ServiceResponse{}, errors.New("failed to create service")
	}

	return svc.toResponse(), nil
}
