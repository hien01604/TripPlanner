import { formatLastModified } from "../../data/itineraryUtils";
import "../../style/itinerary/ItineraryTopbar.css";

const ItineraryTopbar = ({ lastModified }) => {
  return (
    <div className="itinerary-topbar">
      <div className="breadcrumb">
        <strong>Itinerary</strong>
      </div>

      <div className="last-modified">
        <span className="status-dot"></span>
        Last modified at {formatLastModified(lastModified)}
      </div>
    </div>
  );
};

export default ItineraryTopbar;
