import { useSelector } from "react-redux";
import { FaPlus, FaSuitcaseRolling } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import "../style/JourneySidebar.css";

function JourneySidebar({
  selectedPage,
  setSelectedPage,
  setJourneyManagementAction,
  selectedTripIndex = 0,
  setSelectedTripIndex,
}) {
  const trips = useSelector((state) => state.trip.trips ?? []);

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">JOURNEY</h3>
      <input className="search-input" placeholder="Find journey" />
      <div className="journey-list">
        <div
          className={`journey-item${selectedPage === "JourneyManagement" ? " active" : ""}`}
          onClick={() => {
            setJourneyManagementAction?.(null)
            setSelectedPage("JourneyManagement")
          }}
        >
          <span className="journey-item-left">
            <FaSuitcaseRolling />
            Trip Management
          </span>
        </div>

        {trips.map((trip, index) => (
          <div
            key={index}
            className={`journey-item${index === selectedTripIndex && selectedPage !== "JourneyManagement" ? " active" : ""}`}
            onClick={() => {
              setSelectedTripIndex(index);
              setSelectedPage("Dashboard");
            }}
          >
            <span>{trip.tripName}</span>
            <HiOutlineDotsVertical />
          </div>
        ))}
      </div>
      <button
        className="create-btn"
        onClick={() => {
          setJourneyManagementAction?.("create")
          setSelectedPage("JourneyManagement")
        }}
      >
        <FaPlus />
        Create new journey
      </button>
    </div>
  );
}

export default JourneySidebar;