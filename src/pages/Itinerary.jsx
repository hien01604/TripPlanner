import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActivityModal from "../components/itinerary/ActivityModal";
import ActivityTimeline from "../components/itinerary/ActivityTimeline";
import DaySection from "../components/itinerary/DaySection";
import DaysStrip from "../components/itinerary/DaysStrip";
import ItineraryHeader from "../components/itinerary/ItineraryHeader";
import ItineraryToolbar from "../components/itinerary/ItineraryToolbar";
import ItineraryTopbar from "../components/itinerary/ItineraryTopbar";
import {
  emptyForm,
  formatLocalDate,
  getDaysInMonth,
  getMonthFromDate,
  getTimeInMinutes,
  LAST_MODIFIED_KEY,
} from "../data/itineraryUtils";
import "../style/Itinerary.css";
import {
  changeActivityStatus,
  deleteActivity,
  saveActivity,
} from "../data/tripSlice";

const Itinerary = () => {
  const todayDate = formatLocalDate(new Date());
  const dispatch = useDispatch();
  const selectedTripIndex = 0;
  const activities = useSelector(
    (state) => state.trip.trips[selectedTripIndex]?.itinerary || []
  );

  const [lastModified, setLastModified] = useState(() => {
    return localStorage.getItem(LAST_MODIFIED_KEY) || new Date().toISOString();
  });

  const [selectedDate, setSelectedDate] = useState(todayDate);

  const [filters, setFilters] = useState({
    month: getMonthFromDate(todayDate),
    category: "",
    status: "",
    priority: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [form, setForm] = useState(emptyForm);

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
      dispatch(
        saveActivity({
          tripIndex: selectedTripIndex,
          activity: { ...form, id: editingActivity.id },
        })
      );
    } else {
      dispatch(
        saveActivity({
          tripIndex: selectedTripIndex,
          activity: form,
        })
      );
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

    dispatch(
      deleteActivity({
        tripIndex: selectedTripIndex,
        activityId,
      })
    );
    updateLastModified();
  };

  const handleChangeStatus = (activityId) => {
    dispatch(
      changeActivityStatus({
        tripIndex: selectedTripIndex,
        activityId,
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
      <ItineraryTopbar lastModified={lastModified} />
      <ItineraryHeader
        activityCount={filteredActivities.length}
        onAddActivity={openAddModal}
        onExport={handleExportJson}
      />
      <ItineraryToolbar
        filters={filters}
        onFilterChange={setFilters}
        onMonthChange={handleMonthChange}
      />
      <DaysStrip
        activities={activities}
        days={days}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      <DaySection
        activityCount={filteredActivities.length}
        isNextDisabled={selectedDayIndex === days.length - 1}
        isPrevDisabled={selectedDayIndex <= 0}
        selectedDate={selectedDate}
        onNextDay={handleNextDay}
        onPrevDay={handlePrevDay}
      />
      <ActivityTimeline
        activities={filteredActivities}
        onChangeStatus={handleChangeStatus}
        onDeleteActivity={handleDeleteActivity}
        onEditActivity={openEditModal}
      />

      {isModalOpen && (
        <ActivityModal
          editingActivity={editingActivity}
          form={form}
          onClose={closeModal}
          onFormChange={setForm}
          onSubmit={handleSaveActivity}
        />
      )}
    </div>
  );
};

export default Itinerary;
