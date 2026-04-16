r := gin.Default()

api := r.Group("/api/v1")

{
	api.POST("/auth/login", nil)
	api.POST("/booking", nil)
	api.POST("/payment", nil)
	api.POST("/attendance", nil)
	api.GET("/report", nil)
}