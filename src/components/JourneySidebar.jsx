import { FaPlus } from "react-icons/fa"
import { HiOutlineDotsVertical } from "react-icons/hi"

import journeys from "../data/journeys"
import "../style/JourneySidebar.css"

function JourneySidebar() {
  return (
    <div className="sidebar">
      <h3 className="sidebar-title">JOURNEY</h3>

      <input
        className="search-input"
        placeholder="Find journey"
      />

      <div className="journey-list">
        {journeys.map((journey) => (
          <div
            key={journey.id}
            className={`journey-item${journey.id === 1 ? " active" : ""}`}
          >
            <span>{journey.name}</span>
            <HiOutlineDotsVertical />
          </div>
        ))}
      </div>

      <button className="create-btn">
        <FaPlus />
        Create new journey
      </button>
    </div>
  )
}

export default JourneySidebar