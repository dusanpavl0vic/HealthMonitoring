package main

import (
	mqtt "Analytics/app/mqtt"

	"github.com/gin-gonic/gin"
)
func main() {
	go mqtt.RunMqttServer()

	router := gin.Default()
	router.GET("/hello", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Hello World!"})
	})
	router.GET("/os", func(c *gin.Context) {
		c.String(200, "OS info")
	})

	router.Run(":8000")
}