import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Itinerary from "./pages/Itinerary";
import Packing from "./pages/Packing";
import Budget from "./pages/Budget";

import TripPlanner from "./components/TripPlanner";

const PAGES = {
  Dashboard: Dashboard,
  Itinerary: Itinerary,
  Packing: Packing,
  Budget: Budget,
};

function App() {
  const [selectedPage, setSelectedPage] = useState("JourneyManagement");
  const [preservedPage, setPreservedPage] = useState("Dashboard");

  const handleSetSelectedPage = (page) => {
    if (page !== "JourneyManagement") {
      setPreservedPage(page);
    }
    setSelectedPage(page);
  };
  const [selectedTripIndex, setSelectedTripIndex] = useState(0);
  const [journeyManagementAction, setJourneyManagementAction] = useState(null);

  const PageComponent = PAGES[selectedPage] ?? Dashboard;

  const selectedPageForPlanning = selectedPage === "JourneyManagement" ? preservedPage : selectedPage;

  return (
    <TripPlanner
      selectedPage={selectedPage}
      selectedPageForPlanning={selectedPageForPlanning}
      setSelectedPage={handleSetSelectedPage}
      selectedTripIndex={selectedTripIndex}
      setSelectedTripIndex={setSelectedTripIndex}
      journeyManagementAction={journeyManagementAction}
      setJourneyManagementAction={setJourneyManagementAction}
    >
      <PageComponent selectedTripIndex={selectedTripIndex} />
    </TripPlanner>
  );
}

export default App;