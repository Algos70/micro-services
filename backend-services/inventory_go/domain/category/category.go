package category

import (
	"inventory_go/domain"
	"inventory_go/domain/category/enums"
	category "inventory_go/domain/category/events"
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

func (c *Category) Rename(newName string, isNameUnique bool) (domain.DomainEvent, rename_outcomes.RenameOutcomes) {
	if !isNameUnique {
		return nil, rename_outcomes.NameAlreadyExists
	}
	if newName == "" {
		return nil, rename_outcomes.EmptyName
	}
	oldName := c.name
	c.name = newName
	return category.CategoryRenamed{Id: c.id, OldName: oldName, NewName: c.name, OccurredAt: time.Now()}, rename_outcomes.Success
}

func (c *Category) Id() string       { return c.id }
func (c *Category) Name() string     { return c.name }
func (c *Category) ParentId() string { return c.parentId }
