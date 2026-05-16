import { useState } from "react"
import { FaChevronLeft, FaChevronRight, FaBars } from "react-icons/fa"

import JourneySidebar from "./components/JourneySidebar"
import PlanningSidebar from "./components/PlanningSidebar"
import Welcome from "./pages/Welcome"
import JourneyManagement from "./pages/JourneyManagement"
import Dashboard from "./pages/Dashboard"
import Itinerary from "./pages/Itinerary"
import Packing from "./pages/Packing"
import Budget from "./pages/Budget"

import {
  getJourneys,
  createJourney,
  updateJourney,
} from "./services/journeyService"

function App() {
  const [selectedPage, setSelectedPage] = useState("JourneyManagement")
  const [selectedJourneyId, setSelectedJourneyId] = useState(null)
  const [collapsed, setCollapsed] = useState(false)
  const [journeys, setJourneys] = useState(() => getJourneys())

  const addJourney = (journey) => {
    const updatedJourneys = createJourney(journeys, journey)
    setJourneys(updatedJourneys)
    setSelectedPage("JourneyManagement")
  }

  const editJourney = (journey) => {
    const updatedJourneys = updateJourney(journeys, journey)
    setJourneys(updatedJourneys)
  }

  const handleSelectJourney = (journeyId) => {
    setSelectedJourneyId(journeyId)
    setSelectedPage("Dashboard")
  }

  const handleOpenJourneyManagement = () => {
    setSelectedJourneyId(null)
    setSelectedPage("JourneyManagement")
  }

  const selectedJourney = journeys.find(
    (journey) => journey.id === selectedJourneyId,
  )

  const PAGES = {
    Welcome: <Welcome onCreateJourney={addJourney} />,
    JourneyManagement: (
      <JourneyManagement
        journeys={journeys}
        onCreateJourney={addJourney}
        onEditJourney={editJourney}
        onSelectJourney={handleSelectJourney}
      />
    ),
    Dashboard: <Dashboard journey={selectedJourney} />,
    Itinerary: <Itinerary />,
    Packing: <Packing />,
    Budget: <Budget />,
  }

  const currentPage = journeys.length === 0 ? "Welcome" : selectedPage

  return (
    <div className="app-layout">
      <div className={`sidebars${collapsed ? " collapsed" : ""}`}>
        <JourneySidebar
          journeys={journeys}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          selectedJourneyId={selectedJourneyId}
          setSelectedJourneyId={setSelectedJourneyId}
          onSelectJourney={handleSelectJourney}
          onOpenJourneyManagement={handleOpenJourneyManagement}
        />

        <PlanningSidebar
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />

        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {collapsed && (
        <button
          className="menu-btn"
          onClick={() => setCollapsed(false)}
          aria-label="Open sidebars"
        >
          <FaBars />
        </button>
      )}

      <main className="main-content">
        {PAGES[currentPage]}
      </main>
    </div>
  )
}

export default App