import { useState } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

import JourneySidebar from "./components/JourneySidebar"
import PlanningSidebar from "./components/PlanningSidebar"
import Dashboard from "./pages/Dashboard/Dashboard"
import Itinerary from "./pages/Itinerary"
import Packing from "./pages/Packing"
import Budget from "./pages/Budget"

const PAGES = {
  Dashboard: <Dashboard />,
  Itinerary: <Itinerary />,
  Packing:   <Packing />,
  Budget:    <Budget />,
}

function App() {
  const [selectedPage, setSelectedPage] = useState("Dashboard")
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="app-layout">
      <div className={`sidebars${collapsed ? " collapsed" : ""}`}>
        <JourneySidebar />
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

      <main className="main-content">
        {PAGES[selectedPage]}
      </main>
    </div>
  )
}

export default App