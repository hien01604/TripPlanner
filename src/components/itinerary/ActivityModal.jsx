import {
  categoryOptions,
  priorityOptions,
  statusOptions,
} from "../../data/itineraryUtils";
import "../../style/itinerary/ActivityModal.css";

const ActivityModal = ({
  editingActivity,
  form,
  onClose,
  onFormChange,
  onSubmit,
}) => {
  const updateField = (field, value) => {
    onFormChange({
      ...form,
      [field]: value,
    });
  };

  return (
    <div className="activity-modal-backdrop">
      <form className="activity-modal" onSubmit={onSubmit}>
        <h3>{editingActivity ? "Edit Activity" : "Add Activity"}</h3>

        <input
          placeholder="Activity title"
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
          required
        />

        <input
          placeholder="Location"
          value={form.location}
          onChange={(event) => updateField("location", event.target.value)}
          required
        />

        <input
          type="date"
          value={form.date}
          onChange={(event) => updateField("date", event.target.value)}
          required
        />

        <input
          type="time"
          value={form.time}
          onChange={(event) => updateField("time", event.target.value)}
          required
        />

        <select
          value={form.category}
          onChange={(event) => updateField("category", event.target.value)}
        >
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={form.priority}
          onChange={(event) => updateField("priority", event.target.value)}
        >
          {priorityOptions.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>

        <select
          value={form.status}
          onChange={(event) => updateField("status", event.target.value)}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>

          <button type="submit">
            {editingActivity ? "Save Changes" : "Add Activity"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivityModal;
