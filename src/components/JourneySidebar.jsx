import { FaPlus, FaSuitcaseRolling } from "react-icons/fa"
import { HiOutlineDotsVertical } from "react-icons/hi"

import "../style/JourneySidebar.css"

function JourneySidebar({
  journeys = [],
  selectedPage,
  setSelectedPage,
  selectedJourneyId,
  setSelectedJourneyId,
  onSelectJourney,
  onOpenJourneyManagement,
}) {
  return (
    <div className="sidebar">
      <h3 className="sidebar-title">JOURNEY</h3>

      <input
        className="search-input"
        placeholder="Find journey"
      />

      <div className="journey-list">
        <div
          className={`journey-item ${selectedPage === "JourneyManagement"
            ? "active"
            : ""
            }`}
          onClick={() => {
            if (onOpenJourneyManagement) {
              onOpenJourneyManagement()
              return
            }
            setSelectedJourneyId(null)
            setSelectedPage("JourneyManagement")
          }}
        >
          <span className="journey-item-left">
            <FaSuitcaseRolling />
            Trip Management
          </span>
        </div>

        {journeys.length > 0 ? (
          <div className="journey-children">
            {journeys.map((journey) => (
              <div
                key={journey.id}
                className={`journey-item child ${selectedPage === "Dashboard" && selectedJourneyId === journey.id
                  ? "active"
                  : ""
                  }`}
                onClick={() => {
                  if (onSelectJourney) {
                    onSelectJourney(journey.id)
                    return
                  }
                  setSelectedJourneyId(journey.id)
                  setSelectedPage("Dashboard")
                }}
              >
                <span>{journey.title}</span>

                <HiOutlineDotsVertical />
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-journey">
            No journeys yet
          </p>
        )}
      </div>

      <button className="create-btn">
        <FaPlus />
        Create new journey
      </button>
    </div>
  )
}

export default JourneySidebar