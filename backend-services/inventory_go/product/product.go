package product

import "errors"

type Product struct {
	id          string
	name        string
	price       float64
	stock       int
	vendorId    string
	image       string
	categoryId  string
	description string
}

func NewProduct(id string, name string, price float64, stock int, vendorId string, image string, categoryId string, description string) *Product {
	return &Product{id: id, name: name, price: price, stock: stock, vendorId: vendorId, image: image, categoryId: categoryId, description: description}
}

func (p *Product) Rename(name string) error {
	if name == p.name {
		return errors.New("product name hasn't changed")
	}
	if name == "" {
		return errors.New("name cannot be empty")
	}
	p.name = name
	return nil
}

func (p *Product) Reprice(price float64) error {
	if price <= 0 {
		return errors.New("price must be greater than zero")
	}
	p.price = price
	return nil
}

func (p *Product) Redescribe(description string) error {
	if description == "" {
		return errors.New("description cannot be empty")
	}
	p.description = description
	return nil
}

func (p *Product) UpdateImage(image string) {
	p.image = image
}

func (p *Product) ValidateProduct() error {
	if p.Name() == "" {
		return errors.New("name is required")
	}
	if p.Price() <= 0 {
		return errors.New("price is required")
	}
	if p.Stock() <= 0 {
		return errors.New("stock is required")
	}
	if p.VendorId() == "" {
		return errors.New("vendorId is required")
	}
	if p.Description() == "" {
		return errors.New("description is required")
	}
	return nil
}
func (p *Product) Id() string         { return p.id }
func (p *Product) Name() string       { return p.name }
func (p *Product) Price() float64     { return p.price }
func (p *Product) Stock() int         { return p.stock }
func (p *Product) VendorId() string   { return p.vendorId }
func (p *Product) Image() string      { return p.image }
func (p *Product) CategoryId() string { return p.categoryId }

func (p *Product) Description() string { return p.description }
