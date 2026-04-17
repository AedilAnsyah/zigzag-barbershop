package main

import ("log"
        "zigzag-barbershop/api"
		"zigzag-barbershop/config"
		"zigzag-barbershop/database"
		"github.com/joho/godotenv"
	)

func main() {
	godotenv.Load()
	
	cfg := config.LoadConfig()

	database.ConnectDB()
	router := api.SetupRouter()

	log.Printf("Starting server on port %s...", cfg.AppPort)
	if err := router.Run(":" + cfg.AppPort); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}