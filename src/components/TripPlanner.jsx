import { useState } from "react";
import JourneyManagement from "../pages/JourneyManagement";
import { useDispatch } from "react-redux";
import {
  HiMenu,
  HiOutlineBell,
  HiOutlineDotsVertical,
} from "react-icons/hi";
import { IoMdUndo } from "react-icons/io";


import JourneySidebar from "./JourneySidebar";
import PlanningSidebar from "./PlanningSidebar";
import "../style/Dashboard.css";
import Itinerary from "../pages/Itinerary";
import Packing from "../pages/Packing";
import Budget from "../pages/Budget";
import Dashboard from "../pages/Dashboard";
import { undoTripData } from "../data/tripSlice";

function TripPlanner({
  selectedPage,
  selectedPageForPlanning,
  setSelectedPage,
  selectedTripIndex,
  setSelectedTripIndex,
  journeyManagementAction,
  setJourneyManagementAction,
}) {
  const dispatch = useDispatch();
  const showPlanningShell = selectedPage !== "JourneyManagement";
  const [sidebarsOpen, setSidebarsOpen] = useState(false);
  const showJourneySidebar = sidebarsOpen;
  const showPlanningSidebar = sidebarsOpen && showPlanningShell;
  const handleSetSelectedPage = (page) => {
    if (page !== "JourneyManagement") {
      setSidebarsOpen(true);
    }

    setSelectedPage(page);
  };

  const handleUndoLastAction = () => {
    dispatch(undoTripData());
  };

  return (
    <div className="dashboard-shell">
      <header className="top-navbar">
        <button
          type="button"
          className={`top-navbar__menu${sidebarsOpen ? " active" : ""}`}
          aria-label={sidebarsOpen ? "Close menu" : "Open menu"}
          aria-pressed={sidebarsOpen}
          onClick={() => setSidebarsOpen((currentOpen) => !currentOpen)}
        >
          <HiMenu />
        </button>
          <div className="top-navbar__actions">
            <button
              type="button"
              className="top-navbar__undo"
              onClick={handleUndoLastAction}
            >
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
        {showJourneySidebar && (
          <JourneySidebar
            selectedPage={selectedPage}
            setSelectedPage={handleSetSelectedPage}
            setJourneyManagementAction={setJourneyManagementAction}
            selectedTripIndex={selectedTripIndex}
            setSelectedTripIndex={setSelectedTripIndex}
          />
        )}

        {showPlanningSidebar && (
          <PlanningSidebar
            selectedPage={selectedPageForPlanning}
            setSelectedPage={handleSetSelectedPage}
            selectedTripIndex={selectedTripIndex}
          />
        )}

        <main className="dashboard-content">
  {selectedPage === "Dashboard" && (
    <Dashboard
      selectedTripIndex={selectedTripIndex}
      setSelectedPage={handleSetSelectedPage}
    />
  )}

  {selectedPage === "JourneyManagement" && (
    <JourneyManagement
      selectedTripIndex={selectedTripIndex}
      setSelectedTripIndex={setSelectedTripIndex}
      setSelectedPage={handleSetSelectedPage}
      journeyManagementAction={journeyManagementAction}
      setJourneyManagementAction={setJourneyManagementAction}
    />
  )}

  {selectedPage === "Itinerary" && (
    <Itinerary selectedTripIndex={selectedTripIndex} />
  )}

  {selectedPage === "Packing" && (
    <Packing selectedTripIndex={selectedTripIndex} />
  )}

  {selectedPage === "Budget" && (
    <Budget selectedTripIndex={selectedTripIndex} />
  )}
</main>
      </div>
    </div>
  );
}
export default TripPlanner
