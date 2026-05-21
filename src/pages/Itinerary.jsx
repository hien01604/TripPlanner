import React, { useEffect, useMemo, useState } from "react";
import {
  FaCalendarAlt,
  FaCheck,
  FaEdit,
  FaRegCircle,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../style/Itinerary.css";

const emptyForm = {
  title: "",
  location: "",
  date: "2026-05-13",
  time: "20:45",
  category: "Transport",
  priority: "Medium",
  status: "Planned",
};

const initialActivities = [
  {
    id: 1,
    title: "Flight to AHAHAH",
    location: "Tokyo, Japan",
    date: "2026-05-13",
    time: "20:45",
    category: "Transport",
    priority: "High",
    status: "Done",
  },
  {
    id: 2,
    title: "Hotel Check-in",
    location: "Tokyo, Japan",
    date: "2026-05-13",
    time: "21:30",
    category: "Hotel",
    priority: "Medium",
    status: "Planned",
  },
  {
    id: 3,
    title: "Dinner at Sushi Bar",
    location: "Tokyo, Japan",
    date: "2026-05-13",
    time: "19:00",
    category: "Food",
    priority: "Low",
    status: "In Progress",
  },
];

const STORAGE_KEY = "tripplanner-itinerary-activities";
const LAST_MODIFIED_KEY = "tripplanner-itinerary-last-modified";

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getMonthFromDate = (dateString) => {
  return dateString.slice(0, 7);
};

const getDaysInMonth = (monthString) => {
  const [year, month] = monthString.split("-").map(Number);
  const totalDays = new Date(year, month, 0).getDate();

  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(year, month - 1, index + 1);

    return {
      day: index + 1,
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: formatLocalDate(date),
    };
  });
};

const formatHeadingDate = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (time) => {
  if (!time) return "";

  const normalizedTime = time.trim();

  if (normalizedTime.includes("AM") || normalizedTime.includes("PM")) {
    return normalizedTime;
  }

  const [hourValue, minute] = normalizedTime.split(":");
  const hour = Number(hourValue);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${String(displayHour).padStart(2, "0")}:${minute} ${suffix}`;
};

const getTimeInMinutes = (time) => {
  if (!time) return 0;

  const normalizedTime = time.trim();

  if (normalizedTime.includes("AM") || normalizedTime.includes("PM")) {
    const [timePart, period] = normalizedTime.split(" ");
    const [hourValue, minuteValue] = timePart.split(":").map(Number);

    let hour = hourValue;

    if (period === "PM" && hour !== 12) {
      hour += 12;
    }

    if (period === "AM" && hour === 12) {
      hour = 0;
    }

    return hour * 60 + minuteValue;
  }

  const [hourValue, minuteValue] = normalizedTime.split(":").map(Number);
  return hourValue * 60 + minuteValue;
};

const formatLastModified = (dateString) => {
  if (!dateString) return "Never modified";

  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year}, ${hour}:${minute}`;
};

const isActivityOverdue = (activity) => {
  if (activity.status === "Done") return false;

  const activityDateTime = new Date(`${activity.date}T${activity.time}`);
  return activityDateTime < new Date();
};

const Itinerary = () => {
  const [activities, setActivities] = useState(() => {
    const savedActivities = localStorage.getItem(STORAGE_KEY);

    if (!savedActivities) {
      return initialActivities;
    }

    try {
      return JSON.parse(savedActivities);
    } catch {
      return initialActivities;
    }
  });

  const [lastModified, setLastModified] = useState(() => {
    return localStorage.getItem(LAST_MODIFIED_KEY) || new Date().toISOString();
  });

  const [selectedDate, setSelectedDate] = useState("2026-05-13");

  const [filters, setFilters] = useState({
    month: "2026-05",
    category: "",
    status: "",
    priority: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  }, [activities]);

  const days = useMemo(() => getDaysInMonth(filters.month), [filters.month]);

  const selectedDayIndex = days.findIndex((item) => item.date === selectedDate);

  const filteredActivities = useMemo(() => {
    return activities
      .filter((activity) => {
        return (
          activity.date === selectedDate &&
          getMonthFromDate(activity.date) === filters.month &&
          (!filters.category || activity.category === filters.category) &&
          (!filters.status || activity.status === filters.status) &&
          (!filters.priority || activity.priority === filters.priority)
        );
      })
      .sort((a, b) => getTimeInMinutes(a.time) - getTimeInMinutes(b.time));
  }, [activities, selectedDate, filters]);

  const updateLastModified = () => {
    const now = new Date().toISOString();

    setLastModified(now);
    localStorage.setItem(LAST_MODIFIED_KEY, now);
  };

  const handleMonthChange = (event) => {
    const newMonth = event.target.value;
    if (!newMonth) return;

    const newDays = getDaysInMonth(newMonth);

    setFilters((prev) => ({
      ...prev,
      month: newMonth,
    }));

    setSelectedDate(newDays[0].date);
  };

  const openAddModal = () => {
    setEditingActivity(null);
    setForm({ ...emptyForm, date: selectedDate });
    setIsModalOpen(true);
  };

  const openEditModal = (activity) => {
    setEditingActivity(activity);
    setForm(activity);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingActivity(null);
    setForm(emptyForm);
  };

  const handleSaveActivity = (event) => {
    event.preventDefault();

    if (editingActivity) {
      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === editingActivity.id
            ? { ...form, id: editingActivity.id }
            : activity
        )
      );
    } else {
      setActivities((prev) => [
        ...prev,
        {
          ...form,
          id: Date.now(),
        },
      ]);
    }

    setFilters((prev) => ({
      ...prev,
      month: getMonthFromDate(form.date),
    }));

    setSelectedDate(form.date);
    updateLastModified();
    closeModal();
  };

  const handleDeleteActivity = (activityId) => {
    const confirmed = window.confirm("Delete this itinerary item?");
    if (!confirmed) return;

    setActivities((prev) =>
      prev.filter((activity) => activity.id !== activityId)
    );

    updateLastModified();
  };

  const handleChangeStatus = (activityId) => {
    const statusFlow = ["Planned", "In Progress", "Done"];

    setActivities((prev) =>
      prev.map((activity) => {
        if (activity.id !== activityId) return activity;

        const currentIndex = statusFlow.indexOf(activity.status);
        const nextStatus = statusFlow[(currentIndex + 1) % statusFlow.length];

        return {
          ...activity,
          status: nextStatus,
        };
      })
    );

    updateLastModified();
  };

  const handleExportJson = () => {
    const tripPlan = {
      trip: "Japan",
      exportedAt: new Date().toISOString(),
      lastModified,
      activities,
    };

    const blob = new Blob([JSON.stringify(tripPlan, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "japan-itinerary.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  const handlePrevDay = () => {
    if (selectedDayIndex > 0) {
      setSelectedDate(days[selectedDayIndex - 1].date);
    }
  };

  const handleNextDay = () => {
    if (selectedDayIndex < days.length - 1) {
      setSelectedDate(days[selectedDayIndex + 1].date);
    }
  };

  return (
    <div className="itinerary-page">
      <div className="itinerary-topbar">
        <div className="breadcrumb">
          <span>Japan</span>
          <FiChevronRight />
          <strong>Itinerary</strong>
        </div>

        <div className="last-modified">
          <span className="status-dot"></span>
          Last modified at {formatLastModified(lastModified)}
        </div>
      </div>

      <div className="itinerary-header">
        <div>
          <h1>Itinerary</h1>
          <p>{filteredActivities.length} activities planned</p>
        </div>

        <div className="header-actions">
          <button className="export-btn" onClick={handleExportJson}>
            <FaUpload />
            Export
          </button>

          <button className="add-btn" onClick={openAddModal}>
            + Add Activity
          </button>
        </div>
      </div>

      <div className="itinerary-toolbar">
        <label className="date-filter">
          <span>Month</span>
          <input
            type="month"
            value={filters.month}
            onChange={handleMonthChange}
          />
          <FaCalendarAlt />
        </label>

        <select
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
        >
          <option value="">Category</option>
          <option value="Transport">Transport</option>
          <option value="Food">Food</option>
          <option value="Sightseeing">Sightseeing</option>
          <option value="Shopping">Shopping</option>
          <option value="Hotel">Hotel</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="">Status</option>
          <option value="Planned">Planned</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) =>
            setFilters({ ...filters, priority: e.target.value })
          }
        >
          <option value="">Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

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
              onClick={() => setSelectedDate(item.date)}
            >
              <span>{item.day}</span>
              <small>{item.weekday}</small>
            </button>
          );
        })}
      </div>

      <div className="day-section">
        <div>
          <h2>{formatHeadingDate(selectedDate)}</h2>
          <p>{filteredActivities.length} items</p>
        </div>

        <div className="day-controls">
          <button onClick={handlePrevDay} disabled={selectedDayIndex <= 0}>
            <FiChevronLeft />
          </button>

          <button
            onClick={handleNextDay}
            disabled={selectedDayIndex === days.length - 1}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      <div className="activity-timeline">
        {filteredActivities.length === 0 ? (
          <div className="empty-state">No activities for this day</div>
        ) : (
          filteredActivities.map((activity) => {
            const statusClass = activity.status
              .toLowerCase()
              .replace(/\s+/g, "-");

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
                    onClick={() => handleChangeStatus(activity.id)}
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
                    <button title="Edit" onClick={() => openEditModal(activity)}>
                      <FaEdit />
                    </button>

                    <button
                      title="Delete"
                      onClick={() => handleDeleteActivity(activity.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <div className="activity-modal-backdrop">
          <form className="activity-modal" onSubmit={handleSaveActivity}>
            <h3>{editingActivity ? "Edit Activity" : "Add Activity"}</h3>

            <input
              placeholder="Activity title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />

            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />

            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />

            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              required
            />

            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="Transport">Transport</option>
              <option value="Food">Food</option>
              <option value="Sightseeing">Sightseeing</option>
              <option value="Shopping">Shopping</option>
              <option value="Hotel">Hotel</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            <div className="modal-actions">
              <button type="button" onClick={closeModal}>
                Cancel
              </button>

              <button type="submit">
                {editingActivity ? "Save Changes" : "Add Activity"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Itinerary;