import { FaCalendarAlt } from "react-icons/fa";
import {
  categoryOptions,
  priorityOptions,
  statusOptions,
} from "../../data/itineraryUtils";
import "../../style/itinerary/ItineraryToolbar.css";

const ItineraryToolbar = ({ filters, onFilterChange, onMonthChange }) => {
  const handleFilterChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className="itinerary-toolbar">
      <label className="date-filter">
        <span>Month</span>
        <input type="month" value={filters.month} onChange={onMonthChange} />
        <FaCalendarAlt />
      </label>

      <select
        value={filters.category}
        onChange={(event) => handleFilterChange("category", event.target.value)}
      >
        <option value="">Category</option>
        {categoryOptions.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(event) => handleFilterChange("status", event.target.value)}
      >
        <option value="">Status</option>
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <select
        value={filters.priority}
        onChange={(event) => handleFilterChange("priority", event.target.value)}
      >
        <option value="">Priority</option>
        {priorityOptions.map((priority) => (
          <option key={priority} value={priority}>
            {priority}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ItineraryToolbar;
