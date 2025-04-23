package rename_outcomes

type RenameOutcomes int

const (
	Success RenameOutcomes = iota
	NameAlreadyExists
	EmptyName
)
