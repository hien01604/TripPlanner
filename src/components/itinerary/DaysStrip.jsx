import "../../style/itinerary/DaysStrip.css";

const DaysStrip = ({ activities, days, selectedDate, onSelectDate }) => {
  return (
    <div className="days-strip">
      {days.map((item) => {
        const hasActivities = activities.some(
          (activity) => activity.date === item.date
        );

        return (
          <button
            key={item.date}
            className={`day-item ${
              selectedDate === item.date ? "selected" : ""
            } ${hasActivities ? "has-activities" : ""}`}
            onClick={() => onSelectDate(item.date)}
          >
            <span>{item.day}</span>
            <small>{item.weekday}</small>
          </button>
        );
      })}
    </div>
  );
};

export default DaysStrip;
