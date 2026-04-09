package controllers

import (
	"errors"
	"gin-app/config"
	"gin-app/models"

	"github.com/gin-gonic/gin"
	"github.com/go-sql-driver/mysql"
	"golang.org/x/crypto/bcrypt"
)

// func GetUsers(c *gin.Context) {
// 	users := []string{"Alice", "Bob"}

//		c.JSON(200, gin.H{
//			"data": users,
//		})
//	}
func isDuplicateError(err error) bool {
	var mysqlErr *mysql.MySQLError
	return errors.As(err, &mysqlErr) && mysqlErr.Number == 1062
}

func CreateUser(c *gin.Context) {
	var user models.User

	if err := c.BindJSON(&user); err != nil {
		c.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to hash password"})
		return
	}

	user.Password = string(hashedPassword)

	if err := config.DB.Create(&user).Error; err != nil {
		if isDuplicateError(err) {
			c.JSON(400, gin.H{"error": "Email already exists"})
			return
		}

		c.JSON(500, gin.H{"error": "Internal server error"})
		return
	}

	c.JSON(201, gin.H{
		"data": user,
	})
}

func GetUsers(c *gin.Context) {
	var users []models.User
	config.DB.Find(&users)

	c.JSON(200, gin.H{
		"data": users,
	})
}
