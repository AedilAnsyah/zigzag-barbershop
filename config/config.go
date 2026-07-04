package config

import "os"

type Config struct {
	AppName string
	AppPort string
}

func LoadConfig() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	return &Config{
		AppName: os.Getenv("APP_NAME"),
		AppPort: port,
	}
}