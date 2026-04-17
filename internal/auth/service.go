package auth

import (
	"errors"
	"golang.org/x/crypto/bcrypt"
	"zigzag-barbershop/database"
	"zigzag-barbershop/internal/user"
)

func Register(name, email, password, role string) error {
	// hash password
	hashed, _ := bcrypt.GenerateFromPassword([]byte(password), 14)

	// create user
	u := user.User{
		Name: name,
		Email: email,
		Password: string(hashed),
		Role: role,
}
return database.DB.Create(&u).Error
}

func Login(email, password string) (string, error) {
	var u user.User

	err := database.DB.Where("email = ?", email).First(&u).Error
	if err != nil {
		return "", errors.New("user not found")
	}

	err = bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	if err != nil {
		return "", errors.New("invalid password")
	}

	// generate token
	token, err := GenerateToken(u.ID, u.Email, u.Role)
	if err != nil {
		return "", err
	}
	return token, nil
}