import './App.css'
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
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  const [selectedTripIndex, setSelectedTripIndex] = useState(0);

  const PageComponent = PAGES[selectedPage] ?? Dashboard;

  return (
    <TripPlanner
      selectedPage={selectedPage}
      setSelectedPage={setSelectedPage}
      selectedTripIndex={selectedTripIndex}
      setSelectedTripIndex={setSelectedTripIndex}
    >
      <PageComponent selectedTripIndex={selectedTripIndex} />
    </TripPlanner>
  );
}

export default App;