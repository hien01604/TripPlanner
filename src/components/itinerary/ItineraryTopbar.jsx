import BreadCrumb from "../BreadCrumb"
import { formatLastModified } from "../../data/itineraryUtils";
import "../../style/itinerary/ItineraryTopbar.css";

const ItineraryTopbar = ({ tripName, lastModified }) => {
  return (
    <div className="itinerary-topbar">
      <BreadCrumb tripName= {tripName} pageName="Itinerary" />

      <div className="last-modified">
        <span className="status-dot"></span>
        Last modified at {formatLastModified(lastModified)}
      </div>
    </div>
  );
};

export default ItineraryTopbar;
