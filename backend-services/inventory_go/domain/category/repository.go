package category

type CategoryRepository interface {
	GetById(id string) (*Category, error)
	Save(category *Category) error
	Delete(id string) error
}
