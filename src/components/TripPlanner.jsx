import { useState } from "react"; 
import {
  HiMenu,
  HiOutlineBell,
  HiOutlineDotsVertical,
} from "react-icons/hi";
import {
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import { IoMdUndo } from "react-icons/io";


import JourneySidebar from "./JourneySidebar";
import PlanningSidebar from "./PlanningSidebar";
import "../style/Dashboard.css";
import Itinerary from "../pages/Itinerary";
import Packing from "../pages/Packing";
import Budget from "../pages/Budget";
import Dashboard from "../pages/Dashboard";


function TripPlanner({ selectedPage, setSelectedPage}) {
  // Thêm state để lưu trip đang chọn
  const [selectedTripIndex, setSelectedTripIndex] = useState(0);

  return (
    <div className="dashboard-shell">
      <header className="top-navbar">
        <button type="button" className="top-navbar__menu" aria-label="Open menu">
          <HiMenu />
        </button>
        <div className="top-navbar__search">
          <FiSearch className="search-icon" aria-hidden />
          <input
            type="search"
            placeholder="Find in this website"
            aria-label="Find in this website"
          />
          <button type="button" className="filter-btn" aria-label="Filter search">
            <FiFilter />
          </button>
        </div>
        <div className="top-navbar__actions">
          <button type="button" className="top-navbar__undo">
            <IoMdUndo />
            Undo
          </button>
          <button type="button" className="top-navbar__bell" aria-label="Notifications">
            <HiOutlineBell />
          </button>
          <button type="button" className="top-navbar__avatar" aria-label="User menu">
            <img
              src="https://i.pravatar.cc/40?img=12"
              alt=""
              className="avatar-img"
            />
            <HiOutlineDotsVertical className="avatar-chevron" />
          </button>
        </div>
      </header>

      <div className="dashboard-body">
        {/* Truyền state xuống JourneySidebar */}
      <JourneySidebar
        selectedTripIndex={selectedTripIndex}
        setSelectedTripIndex={(index) => {
          setSelectedTripIndex(index); // cập nhật trip
          setSelectedPage("Dashboard"); // tự động nhảy về tab Dashboard
        }}
      />

        <PlanningSidebar
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
            selectedTripIndex={selectedTripIndex}
        />

    <main className="dashboard-content">
      {selectedPage === "Dashboard" && <Dashboard selectedTripIndex={selectedTripIndex} setSelectedPage={setSelectedPage}/>}
      {selectedPage === "Itinerary" && <Itinerary selectedTripIndex={selectedTripIndex} />}
      {selectedPage === "Packing" && <Packing selectedTripIndex={selectedTripIndex} />}
      {selectedPage === "Budget" && <Budget selectedTripIndex={selectedTripIndex} />}
    </main>
      </div>
    </div>
  );
}
export default TripPlanner