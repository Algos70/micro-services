import React from 'react';

interface CategoryMenuProps {
  categories: string[];
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({ categories }) => {
  return (
    <div className="w-52 h-screen pt-5 border:transparentshadow-md">
      {categories.map((category, index) => (
        <a
          key={index}
          href="#"
          className="block px-4 py-3 text-gray-800 hover:bg-gray-300 transition-colors duration-200"
        >
          {category}
        </a>
      ))}
    </div>
  );
};

export default CategoryMenu;
