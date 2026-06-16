package barber

import (
	"errors"

	"time"

	"zigzag-barbershop/database"
	"zigzag-barbershop/internal/attendance"
	"zigzag-barbershop/internal/user"
)

// BarberResponse adalah bentuk output yang aman untuk dikirim ke client.
// Hanya expose id dan name — email dan password tidak dikembalikan.
type BarberResponse struct {
	ID             uint   `json:"id"`
	Name           string `json:"name"`
	Provider       string `json:"provider"`
	IsPresentToday bool   `json:"is_present_today"`
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

	today := time.Now().Format("2006-01-02")
	var attendances []attendance.Attendance
	database.DB.Where("date = ? AND status = ?", today, "present").Find(&attendances)

	presentMap := make(map[uint]bool)
	for _, a := range attendances {
		presentMap[a.BarberID] = true
	}

	responses := make([]BarberResponse, 0, len(users))
	for _, u := range users {
		responses = append(responses, BarberResponse{
			ID:             u.ID,
			Name:           u.Name,
			Provider:       u.Provider,
			IsPresentToday: presentMap[u.ID],
		})
	}
	return responses, nil
}
