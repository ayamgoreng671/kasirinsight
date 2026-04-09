package main

import (
	"gin-app/config"
	"gin-app/routes"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found")
	}

	r := gin.Default()

	config.ConnectDB()

	routes.SetupRoutes(r)

	// Auto create table
	// config.DB.AutoMigrate(&models.User{})
	// config.DB.AutoMigrate(&models.Product{})

	r.Run(":8080")
}
