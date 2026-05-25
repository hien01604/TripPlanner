import { FaCheck, FaEdit, FaRegCircle, FaTrash } from "react-icons/fa";
import { formatTime, isActivityOverdue } from "../../data/itineraryUtils";
import "../../style/itinerary/ActivityTimeline.css";

const ActivityTimeline = ({
  activities,
  onChangeStatus,
  onDeleteActivity,
  onEditActivity,
}) => {
  if (activities.length === 0) {
    return (
      <div className="activity-timeline">
        <div className="empty-state">No activities for this day</div>
      </div>
    );
  }

  return (
    <div className="activity-timeline">
      {activities.map((activity) => {
        const statusClass = activity.status.toLowerCase().replace(/\s+/g, "-");
        const overdue = isActivityOverdue(activity);

        return (
          <div className="timeline-row" key={activity.id}>
            <div className="time-column">
              <div className="time-pill">{formatTime(activity.time)}</div>
              <div className="timeline-line"></div>
            </div>

            <div
              className={`activity-card ${statusClass} ${
                overdue ? "overdue" : ""
              }`}
            >
              <button
                className="check-btn"
                title="Change status"
                onClick={() => onChangeStatus(activity.id)}
              >
                {activity.status === "Done" ? <FaCheck /> : <FaRegCircle />}
              </button>

              <div className="activity-content">
                <div className="activity-title-row">
                  <h3>{activity.title}</h3>

                  <span className={`status-pill ${statusClass}`}>
                    {activity.status}
                  </span>

                  {overdue && <span className="overdue-pill">Overdue</span>}
                </div>

                <p>{activity.location}</p>

                <div className="tag-list">
                  <span className="category-tag">{activity.category}</span>

                  <span
                    className={`priority-tag ${activity.priority.toLowerCase()}`}
                  >
                    P {activity.priority}
                  </span>
                </div>
              </div>

              <div className="card-actions">
                <button title="Edit" onClick={() => onEditActivity(activity)}>
                  <FaEdit />
                </button>

                <button
                  title="Delete"
                  onClick={() => onDeleteActivity(activity.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityTimeline;
