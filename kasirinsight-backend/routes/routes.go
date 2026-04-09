package routes

import (
	"gin-app/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	// r.GET("/users", controllers.GetUsers)

	// r.GET("/", func(c *gin.Context) {
	//     c.JSON(200, gin.H{
	//         "message": "Hello World",
	//     })
	// })

	// r.POST("/login", func(c *gin.Context) {
	// 	var body struct {
	// 		Username string `json:"username"`
	// 		Password string `json:"password"`
	// 	}

	// 	if err := c.BindJSON(&body); err != nil {
	// 		c.JSON(400, gin.H{"error": "Invalid input"})
	// 		return
	// 	}

	// 	c.JSON(200, gin.H{
	// 		"message": "Login success",
	// 		"user":    body.Username,
	// 	})
	// })

	// r.GET("/protected", AuthMiddleware, func(c *gin.Context) {
	// 	c.JSON(200, gin.H{"message": "Authorized"})
	// })

	r.GET("/", func(c *gin.Context) { c.JSON(200, gin.H{"name": "Bebek Terbang"}) })

	r.GET("/users", controllers.GetUsers)

	r.POST("/register", controllers.CreateUser)
	r.POST("/login", controllers.Login)

	r.GET("/protected", AuthMiddleware, controllers.Protected)

	// protected
	auth := r.Group("/")
	auth.Use(AuthMiddleware)

	r.POST("/products", controllers.CreateProduct)
	r.GET("/products", controllers.GetAllProducts)
	r.GET("/products/:id", controllers.GetProduct)
	r.PUT("/products/:id", controllers.UpdateProduct)
	r.DELETE("/products/:id", controllers.DeleteProduct)
}
