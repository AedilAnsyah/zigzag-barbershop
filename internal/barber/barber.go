package barber

import (
	"errors"

	"zigzag-barbershop/database"
	"zigzag-barbershop/internal/user"
)

// BarberResponse adalah bentuk output yang aman untuk dikirim ke client.
// Hanya expose id dan name — email dan password tidak dikembalikan.
type BarberResponse struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

// GetAllBarbers mengambil semua user dengan role='barber' dari tabel users.
func GetAllBarbers() ([]BarberResponse, error) {
	var users []user.User

	if err := database.DB.
		Where("role = ?", "barber").
		Order("name ASC").
		Find(&users).Error; err != nil {
		return nil, errors.New("failed to fetch barbers")
	}

	responses := make([]BarberResponse, 0, len(users))
	for _, u := range users {
		responses = append(responses, BarberResponse{
			ID:   u.ID,
			Name: u.Name,
		})
	}
	return responses, nil
}
