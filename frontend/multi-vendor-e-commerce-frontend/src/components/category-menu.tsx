
import './CategoryMenu.css'; // We'll define styles here

const CategoryMenu = ({ categories }) => {
  return (
    <div className="sidebar">
      {categories.map((category, index) => (
        <a key={index} href="#" className="sidebar-link">
          {category}
        </a>
      ))}
    </div>
  );
};

export default CategoryMenu;
