package service

import (
	"errors"
	"inventory_go/category"
	findmanyoptions "inventory_go/category/enums"
	"inventory_go/category/mappers"
	"log"
)

type CategoryServiceImpl struct {
	repository category.CategoryRepository
}

func NewCategoryService(repository category.CategoryRepository) *CategoryServiceImpl {
	return &CategoryServiceImpl{repository: repository}
}

func (service *CategoryServiceImpl) Create(category *category.Category) error {
	if category.Id() != "" {
		return errors.New("id should be empty when creating a category")
	}

	// Rule 0: Each category should have a unique name
	_category, err := service.repository.FindByName(category.Name())
	if err != nil {
		return err
	}
	if _category != nil {
		return errors.New("category already exists")
	}

	// Check if the parent category exists
	parentCategory, err := service.repository.GetById(category.ParentId())
	if err != nil {
		return err
	}
	if parentCategory == nil {
		return errors.New("parent category not found")
	}

	err = service.repository.Save(category)
	return err
}

func (service *CategoryServiceImpl) Update(id string, name string) error {
	// Rule 0: Each category should have a unique name
	_category, err := service.repository.FindByName(name)
	if err != nil {
		return err
	}
	if _category != nil {
		return errors.New("name already exists")
	}

	// Check if category exists
	_category, err = service.repository.GetById(id)
	if err != nil {
		return err
	}
	if _category == nil {
		return errors.New("category not found")
	}

	domain := mappers.ToDomain(_category)
	event, err := domain.Rename(name, true)

	// For now, log the event as nobody is listening
	log.Print(event)

	err = service.repository.Save(domain)
	return err
}

func (service *CategoryServiceImpl) Delete(id string) error {
	// Rule 1: A category cannot be deleted if it has subcategories
	subcategories, err := service.repository.FindManyByFilter(findmanyoptions.FindAllSubCategoriesById, id)
	if err != nil {
		return err
	}
	if len(subcategories) > 0 {
		return errors.New("subcategories still exists")
	}
	err = service.repository.Delete(id)
	return err
}

func (service *CategoryServiceImpl) FindOneById(id string) (*category.Category, error) {
	_category, err := service.repository.GetById(id)
	if err != nil {
		return nil, err
	}
	if _category == nil {
		return nil, errors.New("category not found")
	}
	domain := mappers.ToDomain(_category)
	return domain, err
}

func (service *CategoryServiceImpl) FindAllSubCategoriesById(id string) ([]*category.Category, error) {
	// Check if category exists
	_category, err := service.repository.GetById(id)
	if err != nil {
		return nil, err
	}
	if _category == nil {
		return nil, errors.New("category not found")
	}
	subcategories, err := service.repository.FindManyByFilter(findmanyoptions.FindAllSubCategoriesById, id)
	if err != nil {
		return nil, err
	}
	var result []*category.Category
	for _, subcategory := range subcategories {
		result = append(result, mappers.ToDomain(subcategory))
	}
	return result, err
}

func (service *CategoryServiceImpl) FindAllParentCategories() ([]*category.Category, error) {
	categories, err := service.repository.FindManyByFilter(findmanyoptions.FindAllParents, "")
	if err != nil {
		return nil, err
	}
	var result []*category.Category
	for _, _category := range categories {
		result = append(result, mappers.ToDomain(_category))
	}
	return result, err
}
func (service *CategoryServiceImpl) FindAll() ([]*category.Category, error) {
	categories, err := service.repository.FindManyByFilter(findmanyoptions.FindAll, "")
	if err != nil {
		return nil, err
	}
	var result []*category.Category
	for _, _category := range categories {
		result = append(result, mappers.ToDomain(_category))
	}
	return result, err
}

func (service *CategoryServiceImpl) FindCategoryTree() ([]*category.CategoryTreeNode, error) {
	categories, err := service.FindAll()
	if err != nil {
		return nil, err
	}
	if len(categories) == 0 || categories[0] == nil {
		return nil, errors.New("no category found")
	}

	var childrenMap map[string][]*category.Category
	for _, _category := range categories {
		if _category.ParentId() != "" {
			_, ok := childrenMap[_category.ParentId()]
			if !ok {
				childrenMap[_category.ParentId()] = []*category.Category{}
			}
			childrenMap[_category.ParentId()] = append(childrenMap[_category.ParentId()], _category)
		}
	}

	var result []*category.CategoryTreeNode
	for _, _category := range categories {
		if _category.ParentId() != "" {
			continue
		}
		children, ok := childrenMap[_category.ParentId()]
		if !ok {
			continue
		}
		result = append(result, &category.CategoryTreeNode{Id: _category.Id(), Name: _category.Name(), Children: children})
	}
	return result, err
}
