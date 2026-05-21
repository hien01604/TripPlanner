import { useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import "../style/JourneySidebar.css";

function JourneySidebar({ selectedTripIndex = 0, setSelectedTripIndex }) {
  const trips = useSelector((state) => state.trip.trips ?? []);

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">JOURNEY</h3>
      <input className="search-input" placeholder="Find journey" />
      <div className="journey-list">
        {trips.map((trip, index) => (
          <div
            key={index}
            className={`journey-item${index === selectedTripIndex ? " active" : ""}`}
            onClick={() => setSelectedTripIndex(index)}
          >
            <span>{trip.tripName}</span>
            <HiOutlineDotsVertical />
          </div>
        ))}
      </div>
      <button className="create-btn">
        <FaPlus />
        Create new journey
      </button>
    </div>
  );
}

export default JourneySidebar;