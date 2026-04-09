package routes

import (
	"errors"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")

	if authHeader == "" {
		c.JSON(401, gin.H{"error": "Missing token"})
		c.Abort()
		return
	}

	// Bearer parsing
	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		c.JSON(401, gin.H{"error": "Invalid token format"})
		c.Abort()
		return
	}

	tokenString := parts[1]

	secret := os.Getenv("JWT_SECRET")

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {

		// Algorithm check
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}

		return []byte(secret), nil
	})

	if err != nil || !token.Valid {
		c.JSON(401, gin.H{"error": "Invalid token"})
		c.Abort()
		return
	}

	// Extract claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		c.JSON(401, gin.H{"error": "Invalid claims"})
		c.Abort()
		return
	}

	// Extract user_id
	userID, ok := claims["user_id"]
	if !ok {
		c.JSON(401, gin.H{"error": "Invalid token data"})
		c.Abort()
		return
	}

	// Attach to context
	c.Set("user_id", userID)

	c.Next()
}
