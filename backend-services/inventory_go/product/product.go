package product

type Product struct {
	id         string
	name       string
	price      float64
	stock      int
	vendorId   string
	image      string
	categoryId string
}

func NewProduct(id string, name string, price float64, stock int, vendorId string, image string, categoryId string) *Product {
	return &Product{id: id, name: name, price: price, stock: stock, vendorId: vendorId, image: image, categoryId: categoryId}
}

func (p *Product) Id() string         { return p.id }
func (p *Product) Name() string       { return p.name }
func (p *Product) Price() float64     { return p.price }
func (p *Product) Stock() int         { return p.stock }
func (p *Product) VendorId() string   { return p.vendorId }
func (p *Product) Image() string      { return p.image }
func (p *Product) CategoryId() string { return p.categoryId }
