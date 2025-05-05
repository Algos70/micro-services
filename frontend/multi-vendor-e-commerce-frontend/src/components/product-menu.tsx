import React from 'react';

// Define the structure of the product object
interface Product {
  Id: string;
  Name: string;
  Price: number;
  Image: string;
}

interface ProductCardProps {
  product: Product;  // Product passed as a prop
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="flex flex-col border rounded-md shadow-md p-1 w-50 h-55 ">
      <img
        src={product.Image}
        alt={product.Name}
        className="w-full h-35 object-cover rounded-md mb-3"
      />
      <h3 className="text-lg font-semibold text-gray-800">{product.Name}</h3>
      <p className="text-gray-600">${product.Price}</p>
    </div>
  );
};

export default ProductCard;
