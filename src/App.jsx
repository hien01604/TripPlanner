import { useState } from "react"

import Dashboard, { DashboardMain } from "./pages/Dashboard/Dashboard"
import Itinerary from "./pages/Itinerary"
import Packing from "./pages/Packing"
import Budget from "./pages/Budget"

const PAGES = {
  Dashboard: DashboardMain,
  Itinerary: Itinerary,
  Packing: Packing,
  Budget: Budget,
}

function App() {
  const [selectedPage, setSelectedPage] = useState("Dashboard")
  const PageComponent = PAGES[selectedPage] ?? DashboardMain

  return (
    <Dashboard selectedPage={selectedPage} setSelectedPage={setSelectedPage}>
      <PageComponent />
    </Dashboard>
  )
}

export default App
