type Config struct {
	AppName string
	AppPort string
}

func loadConfig() *Config {
	returnn &Config{
		AppName: os.Getenv("APP_NAME"),
		AppPort: os.Getenv("APP_PORT"),
	}
}