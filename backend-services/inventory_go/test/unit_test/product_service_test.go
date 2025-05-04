package unit_test

import (
	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/v2/bson"
	"inventory_go/infrastructure/models"
	"inventory_go/infrastructure/repositories"
	"inventory_go/product"
	"inventory_go/service"
	"inventory_go/test/mock_repository"
	"inventory_go/transaction"
	"testing"
)

func CreateMockRepositories() (*mock_repository.MockProductRepository, *mock_repository.MockCategoryRepository, *mock_repository.MockTransactionRepository) {
	return new(mock_repository.MockProductRepository), new(mock_repository.MockCategoryRepository), new(mock_repository.MockTransactionRepository)

}

func TestCreateProduct_WithValidData_ShouldSucceed(t *testing.T) {
	productRepo, categoryRepo, transactionRepo := CreateMockRepositories()

	categoryId := bson.NewObjectID()
	categoryIdString := categoryId.Hex()
	_product := &product.Product{Id: "", CategoryId: categoryIdString, Name: "P1", Price: 15.5, Stock: 100, VendorId: "V1", Description: "Some Description"}
	_category := &models.CategoryDocument{Id: categoryId}

	categoryRepo.On("GetById", categoryIdString).Return(_category, nil)
	productRepo.On("Save", _product).Return(nil)

	productService := service.NewProductService(productRepo, categoryRepo, transactionRepo)
	err := productService.Create(_product)

	assert.NoError(t, err)
	categoryRepo.AssertExpectations(t)
	productRepo.AssertExpectations(t)
}

func TestCreateProduct_WithInvalidCategoryId_ShouldReturnError(t *testing.T) {
	productRepo, categoryRepo, transactionRepo := CreateMockRepositories()

	_product := &product.Product{Id: "", CategoryId: "C1", Name: "P1", Price: 15.5, Stock: 100, VendorId: "V1", Description: "Some Description"}
	_category := &models.CategoryDocument{}

	categoryRepo.On("GetById", "C1").Return(_category, repositories.ErrCategoryNotFound)

	productService := service.NewProductService(productRepo, categoryRepo, transactionRepo)
	err := productService.Create(_product)

	assert.Error(t, err)
	categoryRepo.AssertExpectations(t)
}

func TestUpdateName_WithValidData_ShouldSucceed(t *testing.T) {
	productRepo, categoryRepo, transactionRepo := CreateMockRepositories()

	productId := bson.NewObjectID()
	productIdString := productId.Hex()
	_product := &models.ProductDocument{Id: productId, Name: "P1"}
	_productDomain := &product.Product{Id: productIdString, Name: "P2"}

	productRepo.On("GetById", productIdString).Return(_product, nil)
	productRepo.On("Save", _productDomain).Return(nil)

	productService := service.NewProductService(productRepo, categoryRepo, transactionRepo)
	err := productService.UpdateName(productIdString, "P2")

	assert.NoError(t, err)
	productRepo.AssertExpectations(t)
}

func TestUpdateName_WithInvalidName_ShouldReturnError(t *testing.T) {
	productRepo, categoryRepo, transactionRepo := CreateMockRepositories()

	productId := bson.NewObjectID()
	productIdString := productId.Hex()
	_product := &models.ProductDocument{Id: productId, Name: "P1"}

	productRepo.On("GetById", productIdString).Return(_product, nil)

	productService := service.NewProductService(productRepo, categoryRepo, transactionRepo)
	err := productService.UpdateName(productIdString, "P1")

	assert.Error(t, err)
	productRepo.AssertExpectations(t)
}

func TestReduceStock_WithValidData_ShouldSucceed(t *testing.T) {
	productRepo, categoryRepo, transactionRepo := CreateMockRepositories()

	originalStock := 100
	reduceAmount := 50
	transactionId := "T1"

	productId := bson.NewObjectID()
	productIdString := productId.Hex()
	_product := &models.ProductDocument{Id: productId, Name: "P1", Stock: originalStock}

	productRepo.On("GetById", productIdString).Return(_product, nil)
	productRepo.On("Save", &product.Product{Id: productIdString, Name: "P1", Stock: originalStock - reduceAmount}).Return(nil)
	transactionRepo.On("InsertTransaction", transaction.Transaction{TransactionId: transactionId, Stock: reduceAmount, ProductId: productIdString}).Return(nil)

	productService := service.NewProductService(productRepo, categoryRepo, transactionRepo)
	err := productService.ReduceStock(productIdString, reduceAmount, transactionId)

	assert.NoError(t, err)
	productRepo.AssertExpectations(t)
	transactionRepo.AssertExpectations(t)
}

func TestReduceStock_WithInvalidStock_ShouldReturnError(t *testing.T) {
	productRepo, categoryRepo, transactionRepo := CreateMockRepositories()

	originalStock := 100
	reduceAmount := 150
	transactionId := "T1"

	productId := bson.NewObjectID()
	productIdString := productId.Hex()
	_product := &models.ProductDocument{Id: productId, Name: "P1", Stock: originalStock}

	productRepo.On("GetById", productIdString).Return(_product, nil)

	productService := service.NewProductService(productRepo, categoryRepo, transactionRepo)
	err := productService.ReduceStock(productIdString, reduceAmount, transactionId)

	assert.Error(t, err)
	productRepo.AssertExpectations(t)
}
