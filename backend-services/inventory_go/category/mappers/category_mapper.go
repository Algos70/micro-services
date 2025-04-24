package mappers

import (
	"go.mongodb.org/mongo-driver/v2/bson"
	"inventory_go/category"
	"inventory_go/infrastructure/models"
)

func ToDocument(category *category.Category) (*models.CategoryDocument, error) {
	id, err := bson.ObjectIDFromHex(category.Id())
	if err != nil {
		return nil, err
	}

	var parentId bson.ObjectID
	if category.ParentId() != "" {
		parentId, err = bson.ObjectIDFromHex(category.ParentId())
		if err != nil {
			return nil, err
		}
	}
	return &models.CategoryDocument{
		Id:       id,
		Name:     category.Name(),
		ParentId: parentId,
	}, nil
}

func ToDomain(document *models.CategoryDocument) *category.Category {
	id := document.Id.Hex()

	var parentId string
	if !bson.ObjectID.IsZero(document.ParentId) {
		parentId = document.ParentId.Hex()
	}
	return category.NewCategory(id, document.Name, parentId)
}
