package api

import (
	"github.com/gin-gonic/gin"
	"inventory_go/category"
	"net/http"
)

type CategoryController struct {
	router  *gin.Engine
	service category.CategoryService
}

func NewCategoryController(router *gin.Engine, service category.CategoryService) *CategoryController {
	return &CategoryController{
		router:  router,
		service: service,
	}
}
func (controller *CategoryController) CreateCategory() {
	controller.router.POST("/category", func(c *gin.Context) {
		var _category category.Category
		if err := c.ShouldBindJSON(&_category); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		err := controller.service.Create(&_category)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		c.JSON(http.StatusCreated, gin.H{"category": _category})
	})
}
