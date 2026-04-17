package config

import "os"

type Config struct {
	AppName string
	AppPort string
}

func LoadConfig() *Config {
	return &Config{
		AppName: os.Getenv("APP_NAME"),
		AppPort: os.Getenv("APP_PORT"),
	}
}