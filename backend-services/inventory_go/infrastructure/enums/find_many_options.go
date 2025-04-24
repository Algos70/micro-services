package find_many_options

type FindManyOptions int

const (
	FindAll FindManyOptions = iota
	FindAllParents
	FindAllSubCategoriesById
)
