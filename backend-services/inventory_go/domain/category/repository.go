package category

type CategoryRepository interface {
	GetById(id string) (*Category, error)
	Save(category *Category) error
	Delete(id string) error
	FindAll() ([]*Category, error)
	FindAllParents() ([]*Category, error)
	FindAllSubCategories() ([]*Category, error)
}
