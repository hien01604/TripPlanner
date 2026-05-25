import { FaChartBar, FaRoute, FaSuitcase, FaMoneyBill } from "react-icons/fa";
import "../style/PlanningSidebar.css";

const menuItem = [
  { title: "Dashboard", icon: <FaChartBar /> },
  { title: "Itinerary", icon: <FaRoute /> },
  { title: "Packing", icon: <FaSuitcase /> },
  { title: "Budget", icon: <FaMoneyBill /> },
];

function PlanningSidebar({ selectedPage, setSelectedPage}) {

  return (
    <div className="planning-sidebar">
      <h3 className="sidebar-title">
        PLANNING 
      </h3>
      <div className="planning-list">
        {menuItem.map((item) => {
          const isActive = selectedPage === item.title;
          return (
            <div
              key={item.title}
              className={`planning-item${isActive ? " active" : ""}`}
              onClick={() => setSelectedPage(item.title)}
            >
              <div className="planning-left">
                {item.icon}
                <span>{item.title}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PlanningSidebar;