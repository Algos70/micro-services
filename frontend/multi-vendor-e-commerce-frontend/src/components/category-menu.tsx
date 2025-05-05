import React from 'react';

// Define the structure of the category object
interface Category {
  Id: string;
  Name: string;
  ParentId: string;
}

interface CategoryMenuProps {
  categories: Category[];  // Update to take an array of Category objects
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({ categories }) => {
  return (
    <div className="w-52 h-screen pt-5 border:transparentshadow-md">
      {categories.map((category, index) => (
        <a
          key={category.Id}  // Use category Id as the key for better performance
          href=""
          className="block px-4 py-3 text-gray-800 hover:bg-gray-300 transition-colors duration-200"
        >
          <p className='font-semibold underline  dark:text-white'>{category.Name}</p>  {/* Render the category name */}
        </a>
      ))}
    </div>
  );
};

export default CategoryMenu;
