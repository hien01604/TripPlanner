import { FaUpload } from "react-icons/fa";
import "../../style/itinerary/ItineraryHeader.css";

const ItineraryHeader = ({ activityCount, onAddActivity, onExport }) => {
  return (
    <div className="itinerary-header">
      
      <div>
        <h1>Itinerary</h1>
        <p>{activityCount} activities planned</p>
      </div>

      <div className="header-actions">
        <button className="export-btn" onClick={onExport}>
          <FaUpload />
          Export
        </button>

        <button className="add-btn1" onClick={onAddActivity}>
          + Add Activity
        </button>
      </div>
    </div>
  );
};

export default ItineraryHeader;
