export const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const emptyForm = {
  title: "",
  location: "",
  date: formatLocalDate(new Date()),
  time: "20:45",
  category: "Transport",
  priority: "Medium",
  status: "Planned",
};

export const STORAGE_KEY = "tripplanner-itinerary-activities";
export const LAST_MODIFIED_KEY = "tripplanner-itinerary-last-modified";

export const categoryOptions = [
  "Transport",
  "Food",
  "Sightseeing",
  "Shopping",
  "Hotel",
  "Other",
];

export const statusOptions = ["Planned", "In Progress", "Done"];

export const priorityOptions = ["Low", "Medium", "High"];

export const getMonthFromDate = (dateString) => {
  return dateString.slice(0, 7);
};

export const getDaysInMonth = (monthString) => {
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

export const formatHeadingDate = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (time) => {
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

export const getTimeInMinutes = (time) => {
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

export const formatLastModified = (dateString) => {
  if (!dateString) return "Never modified";

  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year}, ${hour}:${minute}`;
};

export const isActivityOverdue = (activity) => {
  if (activity.status === "Done") return false;

  const activityDateTime = new Date(`${activity.date}T${activity.time}`);
  return activityDateTime < new Date();
};
