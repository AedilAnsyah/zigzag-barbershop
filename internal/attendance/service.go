package attendance

import (
	"errors"
	"time"

	"zigzag-barbershop/database"
)

type AttendanceService struct{}

func NewAttendanceService() *AttendanceService {
	return &AttendanceService{}
}

func (s *AttendanceService) CreateAttendance(barberID uint) (*Attendance, error) {
	today := time.Now().Format("2006-01-02")
	var att Attendance

	// Cek apakah sudah absen hari ini
	if err := database.DB.Where("barber_id = ? AND date = ?", barberID, today).First(&att).Error; err == nil {
		return nil, errors.New("Sudah absen hari ini")
	}

	att = Attendance{
		BarberID: barberID,
		Date:     today,
		Status:   "present",
	}

	if err := database.DB.Create(&att).Error; err != nil {
		return nil, errors.New("Gagal mencatat absensi")
	}

	return &att, nil
}

func (s *AttendanceService) CheckAttendance(barberID uint) bool {
	today := time.Now().Format("2006-01-02")
	var att Attendance
	if err := database.DB.Where("barber_id = ? AND date = ?", barberID, today).First(&att).Error; err == nil {
		return true
	}
	return false
}
