package category

import (
	"errors"
	"inventory_go/category/events"
	"time"
)

type Category struct {
	id       string
	name     string
	parentId string
}

func NewCategory(id string, name string, parentId string) *Category {
	return &Category{id: id, name: name, parentId: parentId}
}

func (c *Category) Rename(newName string, isNameUnique bool) (DomainEvent, error) {
	if !isNameUnique {
		return nil, errors.New("name is not unique")
	}
	if newName == "" {
		return nil, errors.New("name is empty")
	}
	oldName := c.name
	c.name = newName
	return category.CategoryRenamed{Id: c.id, OldName: oldName, NewName: c.name, OccurredAt: time.Now()}, nil
}

func (c *Category) Id() string       { return c.id }
func (c *Category) Name() string     { return c.name }
func (c *Category) ParentId() string { return c.parentId }
