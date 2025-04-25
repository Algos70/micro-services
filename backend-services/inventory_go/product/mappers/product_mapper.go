package mappers

import (
	"go.mongodb.org/mongo-driver/v2/bson"
	"inventory_go/infrastructure/models"
	"inventory_go/product"
)

func ProductDomainToDocument(product *product.Product) (*models.ProductDocument, error) {
	id, err := bson.ObjectIDFromHex(product.Id())
	if err != nil {
		return nil, err
	}

	var categoryId bson.ObjectID
	if product.CategoryId() != "" {
		categoryId, err = bson.ObjectIDFromHex(product.CategoryId())
		if err != nil {
			return nil, err
		}
	}

	return &models.ProductDocument{
		Id:         id,
		CategoryId: categoryId,
		Name:       product.Name(),
		Price:      product.Price(),
		Stock:      product.Stock(),
		VendorId:   product.VendorId(),
		Image:      product.Image(),
	}, nil
}

func ProductDocumentToDomain(document *models.ProductDocument) *product.Product {
	id := document.Id.Hex()
	var categoryId string
	if !bson.ObjectID.IsZero(document.CategoryId) {
		categoryId = document.CategoryId.Hex()
	}
	return product.NewProduct(id, document.Name, document.Price, document.Stock, document.VendorId, document.Image, categoryId)

}
