package api

import (
	"errors"
	"github.com/gin-gonic/gin"
	"inventory_go/category"
	"inventory_go/infrastructure/repositories"
	"inventory_go/service"
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

func (controller *CategoryController) ExposeEndpoints() {
	controller.CreateCategory()
	controller.UpdateCategory()
	controller.DeleteCategory()
	controller.FindOneById()
	controller.FindAllCategories()
	controller.FindAllParentCategories()
	controller.FindSubcategoriesById()
	controller.FindCategoryTree()
}
func (controller *CategoryController) CreateCategory() {
	controller.router.POST("/category", func(c *gin.Context) {
		var _category category.Category
		if err := c.ShouldBindJSON(&_category); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
			return
		}
		err := controller.service.Create(&_category)
		if err != nil {
			switch {
			case errors.Is(err, service.ErrIdShouldBeEmpty):
				c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
			case errors.Is(err, repositories.ErrCategoryNotFound):
				c.JSON(http.StatusNotFound, gin.H{"status": Error, "message": err.Error(), "data": nil})
			case errors.Is(err, service.ErrDuplicateCategoryName):
				c.JSON(http.StatusConflict, gin.H{"status": Error, "message": err.Error(), "data": nil})
			case errors.Is(err, repositories.ErrInvalidId):
				c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
			case errors.Is(err, service.ErrInvalidParentCategory):
				c.JSON(http.StatusNotFound, gin.H{"status": Error, "message": err.Error(), "data": nil})
			default:
				c.JSON(http.StatusInternalServerError, gin.H{"status": Error, "message": err.Error(), "data": nil})
			}
		}
		c.JSON(http.StatusCreated, gin.H{"status": Success, "data": _category, "message": nil})
	})
}

func (controller *CategoryController) UpdateCategory() {
	controller.router.PUT("/category/:id", func(c *gin.Context) {
		id := c.Param("id")
		var payload struct {
			Name string `json:"name" binding:"required"`
		}
		if err := c.ShouldBindJSON(&payload); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
			return
		}
		err := controller.service.Update(id, payload.Name)
		if err != nil {
			switch {
			case errors.Is(err, repositories.ErrCategoryNotFound):
				c.JSON(http.StatusNotFound, gin.H{"status": Error, "message": err.Error(), "data": nil})
			case errors.Is(err, service.ErrDuplicateCategoryName):
				c.JSON(http.StatusConflict, gin.H{"status": Error, "message": err.Error(), "data": nil})
			case errors.Is(err, repositories.ErrInvalidId):
				c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
			case errors.Is(err, service.ErrInvalidCategoryName):
				c.JSON(http.StatusConflict, gin.H{"status": Error, "message": err.Error(), "data": nil})
			default:
				c.JSON(http.StatusInternalServerError, gin.H{"status": Error, "message": err.Error(), "data": nil})
			}
		}
		c.JSON(http.StatusOK, gin.H{"status": Success, "data": nil, "message": nil})
	})
}

func (controller *CategoryController) DeleteCategory() {
	controller.router.DELETE("/category/:id", func(c *gin.Context) {
		id := c.Param("id")
		err := controller.service.Delete(id)
		if err != nil {
			switch {
			case errors.Is(err, repositories.ErrInvalidId):
				c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
			case errors.Is(err, service.ErrCantDeleteCategoryWithSubcategories):
				c.JSON(http.StatusConflict, gin.H{"status": Error, "message": err.Error(), "data": nil})
			default:
				c.JSON(http.StatusInternalServerError, gin.H{"status": Error, "message": err.Error(), "data": nil})
			}
		}
		c.JSON(http.StatusOK, gin.H{"status": Success, "data": nil, "message": nil})
	})
}

func (controller *CategoryController) FindOneById() {
	controller.router.GET("/category/:id", func(c *gin.Context) {
		id := c.Param("id")
		result, err := controller.service.FindOneById(id)
		if err != nil {
			switch {
			case errors.Is(err, repositories.ErrInvalidId):
				c.JSON(http.StatusBadRequest, gin.H{"status": Error, "message": err.Error(), "data": nil})
			case errors.Is(err, repositories.ErrCategoryNotFound):
				c.JSON(http.StatusNotFound, gin.H{"status": Error, "message": err.Error(), "data": nil})
			default:
				c.JSON(http.StatusInternalServerError, gin.H{"status": Error, "message": err.Error(), "data": nil})
			}
		}
		c.JSON(http.StatusOK, gin.H{"status": Success, "data": result, "message": nil})
	})
}

func (controller *CategoryController) FindSubcategoriesById() {
	controller.router.GET("/category/:id/subcategories", func(c *gin.Context) {
		id := c.Param("id")
		result, err := controller.service.FindAllSubCategoriesById(id)
		if err != nil {
			switch {
			case errors.Is(err, repositories.ErrCategoryNotFound):
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

func (controller *CategoryController) FindAllParentCategories() {
	controller.router.GET("/category/parents", func(c *gin.Context) {
		result, err := controller.service.FindAllParentCategories()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": Error, "message": err.Error(), "data": nil})
		}
		c.JSON(http.StatusOK, gin.H{"status": Success, "data": result, "message": nil})
	})
}

func (controller *CategoryController) FindAllCategories() {
	controller.router.GET("/category", func(c *gin.Context) {
		result, err := controller.service.FindAll()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": Error, "message": err.Error(), "data": nil})
		}
		c.JSON(http.StatusOK, gin.H{"status": Success, "data": result, "message": nil})
	})
}

func (controller *CategoryController) FindCategoryTree() {
	controller.router.GET("/category/tree", func(c *gin.Context) {
		result, err := controller.service.FindCategoryTree()
		if err != nil {
			switch {
			case errors.Is(err, service.ErrCategoryTreeIsEmpty):
				c.JSON(http.StatusNotFound, gin.H{"status": Error, "message": err.Error(), "data": nil})
			default:
				c.JSON(http.StatusInternalServerError, gin.H{"status": Error, "message": err.Error(), "data": nil})
			}
		}
		c.JSON(http.StatusOK, gin.H{"status": Success, "data": result, "message": nil})
	})
}
