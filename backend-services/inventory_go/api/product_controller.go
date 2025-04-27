package api

import (
	"errors"
	"github.com/gin-gonic/gin"
	"inventory_go/infrastructure/repositories"
	"inventory_go/product"
	"inventory_go/service"
	"net/http"
)

type ProductController struct {
	router  *gin.Engine
	service product.ProductService
}

func NewProductController(router *gin.Engine, service product.ProductService) *ProductController {
	return &ProductController{
		router:  router,
		service: service,
	}
}

func (controller *ProductController) ExposeEndpoints() {
	controller.Create()
	controller.UpdateName()
	controller.UpdatePrice()
	controller.UpdateImage()
	controller.UpdateDescription()
	controller.Delete()
	controller.FindOneById()
	controller.FindAll()
	controller.FindManyByName()
	controller.FindManyByCategory()
	controller.FindStock()
}

func (controller *ProductController) Create() {
	controller.router.POST("product", func(c *gin.Context) {
		var _product product.Product
		if err := c.ShouldBindJSON(&_product); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
			return
		}
		err := controller.service.Create(&_product)
		if err != nil {
			switch {
			case errors.Is(err, service.ErrIdShouldBeEmpty):
				c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
			case errors.Is(err, repositories.ErrCategoryNotFound):
				c.JSON(http.StatusNotFound, gin.H{"status": Error, "message": err.Error(), "data": nil})
			case errors.Is(err, service.ErrProductValidationFailed):
				c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
			default:
				c.JSON(http.StatusInternalServerError, gin.H{"status": Error, "message": err.Error(), "data": nil})
			}
		}
		c.JSON(http.StatusOK, gin.H{"status": Success, "message": nil, "data": nil})
	})
}

func (controller *ProductController) UpdateName() {
	controller.router.PUT("product/name/:id", func(c *gin.Context) {
		id := c.Param("id")
		var payload struct {
			Name string `json:"name" binding:"required"`
		}
		if err := c.ShouldBindJSON(&payload); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
		}
		err := controller.service.UpdateName(id, payload.Name)
		if err != nil {
			switch {
			case errors.Is(err, repositories.ErrInvalidId):
				c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
			case errors.Is(err, repositories.ErrProductNotFound):
				c.JSON(http.StatusNotFound, gin.H{"status": Error, "message": err.Error(), "data": nil})
			case errors.Is(err, service.ErrProductValidationFailed):
				c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
			default:
				c.JSON(http.StatusInternalServerError, gin.H{"status": Error, "message": err.Error(), "data": nil})
			}
		}
		c.JSON(http.StatusOK, gin.H{"status": Success, "message": nil, "data": nil})
	})
}

func (controller *ProductController) UpdatePrice() {
	controller.router.PUT("product/price/:id", func(c *gin.Context) {
		id := c.Param("id")
		var payload struct {
			Price float64 `json:"price" binding:"required"`
		}
		if err := c.ShouldBindJSON(&payload); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
		}
		err := controller.service.UpdatePrice(id, payload.Price)
		if err != nil {
			switch {
			case errors.Is(err, repositories.ErrInvalidId):
				c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
			case errors.Is(err, repositories.ErrProductNotFound):
				c.JSON(http.StatusNotFound, gin.H{"status": Error, "message": err.Error(), "data": nil})
			case errors.Is(err, service.ErrProductValidationFailed):
				c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
			default:
				c.JSON(http.StatusInternalServerError, gin.H{"status": Error, "message": err.Error(), "data": nil})
			}
		}
		c.JSON(http.StatusOK, gin.H{"status": Success, "message": nil, "data": nil})
	})
}

func (controller *ProductController) UpdateImage() {
	controller.router.PUT("product/image/:id", func(c *gin.Context) {
		id := c.Param("id")
		var payload struct {
			Image string `json:"image" binding:"required"`
		}
		if err := c.ShouldBindJSON(&payload); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
		}
		err := controller.service.UpdateImage(id, payload.Image)
		if err != nil {
			switch {
			case errors.Is(err, repositories.ErrInvalidId):
				c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
			case errors.Is(err, repositories.ErrProductNotFound):
				c.JSON(http.StatusNotFound, gin.H{"status": Error, "message": err.Error(), "data": nil})
			default:
				c.JSON(http.StatusInternalServerError, gin.H{"status": Error, "message": err.Error(), "data": nil})
			}
		}
		c.JSON(http.StatusOK, gin.H{"status": Success, "message": nil, "data": nil})
	})
}

func (controller *ProductController) UpdateDescription() {
	controller.router.PUT("product/description/:id", func(c *gin.Context) {
		id := c.Param("id")
		var payload struct {
			Description string `json:"description" binding:"required"`
		}
		if err := c.ShouldBindJSON(&payload); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
		}
		err := controller.service.UpdateDescription(id, payload.Description)
		if err != nil {
			switch {
			case errors.Is(err, repositories.ErrInvalidId):
				c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
			case errors.Is(err, repositories.ErrProductNotFound):
				c.JSON(http.StatusNotFound, gin.H{"status": Error, "message": err.Error(), "data": nil})
			case errors.Is(err, service.ErrProductValidationFailed):
				c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
			default:
				c.JSON(http.StatusInternalServerError, gin.H{"status": Error, "message": err.Error(), "data": nil})
			}
		}
		c.JSON(http.StatusOK, gin.H{"status": Success, "message": nil, "data": nil})
	})
}

func (controller *ProductController) Delete() {
	controller.router.DELETE("product/:id", func(c *gin.Context) {
		id := c.Param("id")
		err := controller.service.Delete(id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": Error, "message": err.Error(), "data": nil})
		}
		c.JSON(http.StatusOK, gin.H{"status": Success, "message": nil, "data": nil})
	})
}

func (controller *ProductController) FindOneById() {
	controller.router.GET("product/:id", func(c *gin.Context) {
		id := c.Param("id")
		result, err := controller.service.FindById(id)
		if err != nil {
			switch {
			case errors.Is(err, repositories.ErrProductNotFound):
				c.JSON(http.StatusNotFound, gin.H{"status": Error, "message": err.Error(), "data": nil})
			case errors.Is(err, repositories.ErrInvalidId):
				c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
			default:
				c.JSON(http.StatusInternalServerError, gin.H{"status": Error, "message": err.Error(), "data": nil})
			}
		}
		c.JSON(http.StatusOK, gin.H{"status": Success, "data": result, "message": nil})
	})
}

func (controller *ProductController) FindAll() {
	controller.router.GET("product", func(c *gin.Context) {
		result, err := controller.service.FindAll()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": Error, "message": err.Error(), "data": nil})
		}
		c.JSON(http.StatusOK, gin.H{"status": Success, "data": result, "message": nil})
	})
}

func (controller *ProductController) FindManyByName() {
	controller.router.GET("product/many/:name", func(c *gin.Context) {
		name := c.Param("name")
		result, err := controller.service.FindManyByName(name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": Error, "message": err.Error(), "data": nil})
		}
		c.JSON(http.StatusOK, gin.H{"status": Success, "data": result, "message": nil})
	})
}

func (controller *ProductController) FindManyByCategory() {
	controller.router.GET("product/category/:category", func(c *gin.Context) {
		category := c.Param("category")
		result, err := controller.service.FindManyByCategory(category)
		if err != nil {
			switch {
			case errors.Is(err, repositories.ErrInvalidId):
				c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
			default:
				c.JSON(http.StatusInternalServerError, gin.H{"status": Error, "message": err.Error(), "data": nil})
			}
		}
		c.JSON(http.StatusOK, gin.H{"status": Success, "data": result, "message": nil})
	})
}

func (controller *ProductController) FindStock() {
	controller.router.GET("product/stock/:id", func(c *gin.Context) {
		id := c.Param("id")
		result, err := controller.service.FindStock(id)
		if err != nil {
			switch {
			case errors.Is(err, repositories.ErrProductNotFound):
				c.JSON(http.StatusNotFound, gin.H{"status": Error, "message": err.Error(), "data": nil})
			case errors.Is(err, repositories.ErrInvalidId):
				c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
			default:
				c.JSON(http.StatusInternalServerError, gin.H{"status": Error, "message": err.Error(), "data": nil})
			}
		}
		c.JSON(http.StatusOK, gin.H{"status": Success, "data": result, "message": nil})
	})
}
