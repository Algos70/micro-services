import React from 'react';
import ProductCard2 from './product-menu2';

interface Product {
  Id: string;
  Name: string;
  Price: number;
  Image: string;
}

interface ProductGrid2Props {
  products: Product[];
  maxProducts: number;  // New prop to limit number of products
}

const ProductGrid: React.FC<ProductGrid2Props> = ({ products, maxProducts }) => {
  const limitedProducts = products.slice(0, maxProducts);  // Limit the number of products

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7 p-4 mt-5">
      {limitedProducts.map((product) => (
        <ProductCard2 key={product.Id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
