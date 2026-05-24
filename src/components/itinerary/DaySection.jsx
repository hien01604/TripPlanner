import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { formatHeadingDate } from "../../data/itineraryUtils";
import "../../style/itinerary/DaySection.css";

const DaySection = ({
  activityCount,
  isNextDisabled,
  isPrevDisabled,
  selectedDate,
  onNextDay,
  onPrevDay,
}) => {
  return (
    <div className="day-section">
      <div>
        <h2>{formatHeadingDate(selectedDate)}</h2>
        <p>{activityCount} items</p>
      </div>

      <div className="day-controls">
        <button onClick={onPrevDay} disabled={isPrevDisabled}>
          <FiChevronLeft />
        </button>

        <button onClick={onNextDay} disabled={isNextDisabled}>
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default DaySection;
