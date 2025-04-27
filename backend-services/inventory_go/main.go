package main

import (
	"github.com/gin-gonic/gin"
	"inventory_go/infrastructure"
	"inventory_go/infrastructure/repositories"
	"inventory_go/service"
	"log"
	"net/http"
	"os"
)

func main() {

	// Connect to mongodb
	client, err := infrastructure.Connect()
	if err != nil {
		os.Exit(1)
	}

	// Get the database
	db := client.Database("inventory")

	// Get repositories
	categoryCollectionName := os.Getenv("CATEGORY_COLLECTION")
	if categoryCollectionName == "" {
		categoryCollectionName = "categories"
	}
	productCollectionName := os.Getenv("PRODUCT_COLLECTION")
	if productCollectionName == "" {
		productCollectionName = "products"
	}

	categoryRepository := repositories.NewCategoryRepository(db, categoryCollectionName)
	productRepository := repositories.NewProductRepository(db, productCollectionName)

	// Get services
	categoryService := service.NewCategoryService(categoryRepository)
	productService := service.NewProductService(productRepository, categoryRepository)

	// Set up router
	router := gin.Default()

	router.Use(gin.Recovery())
	router.Use(gin.Logger())

	// Run the router on port 9292
	err = router.Run(":9292")
	if err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
