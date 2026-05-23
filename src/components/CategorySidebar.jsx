import { FaTshirt, FaFileAlt, FaLaptop, FaMedkit, FaUser, FaBox } from "react-icons/fa"
import "../style/CategorySidebar.css"

const CATEGORIES = [
  { name: "Clothes",     icon: <FaTshirt /> },
  { name: "Documents",   icon: <FaFileAlt /> },
  { name: "Electronics", icon: <FaLaptop /> },
  { name: "Medicine",    icon: <FaMedkit /> },
  { name: "Personal",    icon: <FaUser /> },
  { name: "Other",       icon: <FaBox /> },
]

function CategorySidebar({ items, selectedCategory, setSelectedCategory }) {
  return (
    <div className="category-sidebar">
      <h2>Categories</h2>
      <div className="category-list">
        {CATEGORIES.map((category) => {
          const categoryItems = items.filter(item => item.category === category.name)
          const packedItems   = categoryItems.filter(item => item.packedStatus === "Packed").length
          const totalItems    = categoryItems.length
          const progress      = totalItems === 0 ? 0 : Math.round((packedItems / totalItems) * 100)

          return (
            <div
              key={category.name}
              className={`category-card${selectedCategory === category.name ? " active-category" : ""}`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <div className="category-left">
                <div className="category-icon">{category.icon}</div>
                <div>
                  <h4>{category.name}</h4>
                  <p>{packedItems} / {totalItems} items packed</p>
                </div>
              </div>
              <div className="category-right">
                <span>{progress}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CategorySidebar