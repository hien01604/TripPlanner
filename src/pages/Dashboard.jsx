import { useSelector } from "react-redux";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import {
  FaCalendarAlt,
  FaClipboardList,
  FaDollarSign,
  FaTag,
  FaBell,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "../style/Dashboard.css";
import BreadCrumb from "../components/BreadCrumb"
import { isActivityOverdue } from "../data/itineraryUtils";


const STAT_ICON_COMPONENTS = {
  calendar: FaCalendarAlt,
  clipboard: FaClipboardList,
  dollar: FaDollarSign,
  tag: FaTag,
  bell: FaBell,
};

/**
 * progress circle color + icon color
 * @type {Record<string, { iconClass: string, ring: string }>}
 */
const STAT_VISUAL_BY_ICON = {
  calendar: { iconClass: "stat-icon--blue", ring: "#3b82f6" },
  clipboard: { iconClass: "stat-icon--teal", ring: "#4fd1c5" },
  dollar: { iconClass: "stat-icon--green", ring: "#10b981" },
  tag: { iconClass: "stat-icon--yellow", ring: "#f59e0b" },
  bell: { iconClass: "stat-icon--red", ring: "#ef4444" },
};

const DEFAULT_STAT_VISUAL = {
  iconClass: "stat-icon--blue",
  ring: "#3b82f6",
};

const RING_SIZE = 92;
const RING_STROKE = 6;


function StatProgressRing({ percent, ringColor, alert, children }) {
  const size = RING_SIZE;
  const stroke = RING_STROKE;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.min(100, Math.max(0, percent));
  const offset = c * (1 - p / 100);
  const cx = size / 2;
  const strokeColor = alert ? "#ef4444" : ringColor;

  return (
    <div className="stat-ring">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="stat-ring__svg"
        aria-hidden
      >
        <circle
          className="stat-ring__track"
          cx={cx}
          cy={cx}
          r={r}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          className="stat-ring__progress"
          cx={cx}
          cy={cx}
          r={r}
          strokeWidth={stroke}
          fill="none"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cx})`}
        />
      </svg>
      <div className="stat-ring__center">{children}</div>
    </div>
  );
}

const CATEGORY_COLORS = {
  Clothes: "#3B82F6",
  Documents: "#4FD1C5",
  Electronics: "#8B5CF6",
  Personal: "#F59E0B",
  Other: "#10B981",
};

const CALENDAR_WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

function formatTripDates(itinerary) {
  if (!itinerary?.length) return "—";
  const sorted = [...itinerary].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const start = new Date(sorted[0].date);
  const end = new Date(sorted[sorted.length - 1].date);
  const opts = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString("en-US", opts)} - ${end.toLocaleDateString("en-US", opts)}, ${start.getFullYear()}`;
}

function formatTime24to12(timeText) {
  if (!timeText) return "—";
  const [h, m] = String(timeText).split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return String(timeText);
  const period = h >= 12 ? "Pm" : "Am";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function buildCalendarCells(itinerary) {
  const sorted = [...itinerary].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const baseDate = sorted.length ? new Date(sorted[0].date) : new Date();
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  const firstDay = new Date(year, month, 1);
  // const daysInMonth = new Date(year, month + 1, 0).getDate();
  const mondayStartOffset = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(year, month, 1 - mondayStartOffset);

  const itineraryDays = new Set(itinerary.map((i) => i.date));
  const cells = Array.from({ length: 42 }, (_, index) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + index);
    const dateStr = d.toISOString().slice(0, 10);
    return {
      key: `${dateStr}-${index}`,
      dayDisplay: String(d.getDate()),
      isActive: itineraryDays.has(dateStr),
      muted: d.getMonth() !== month,
    };
  });

  return {
    monthLabel: baseDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    weekdayLabels: CALENDAR_WEEKDAYS,
    cells,
  };
}

function Dashboard({ selectedTripIndex = 0, setSelectedPage }) {
  const trips = useSelector(state => state.trip.trips ?? []);
  const trip = trips[selectedTripIndex] || {};
  
  const itinerary = trip?.itinerary ?? [];
  const packingList = trip?.packingList ?? [];
  const budgetItems = trip?.budgetItems ?? [];

  const tripNameDisplay = trip.tripName ?? "—";
  const tripDatesDisplay = formatTripDates(itinerary);

  const totalBudget = Number(trip?.budget) || 0;
  const usedBudget = budgetItems.reduce(
    (sum, item) => sum + (Number(item.actualCost) || 0),
    0
  );
  const remainingBudget = Math.max(0, totalBudget - usedBudget);
  const budgetPercent =
    totalBudget > 0 ? Math.min(100, Math.round((usedBudget / totalBudget) * 100)) : 0;
  const defaultCategoryPacking = [
    "Clothes",
    "Documents",
    "Electronics",
    "Medicine",
    "Personal",
    "Other",
  ];
// Tính packingPacked và packingTotal
const packingPacked = packingList.filter(
  (item) => item.packedStatus === "Packed"
).length;
const packingTotal = packingList.length;

// Tạo rawCategories từ packingList
const rawCategories = Object.values(
  packingList.reduce((acc, item) => {
    const key = item.category || "Other";
    if (!acc[key]) {
      acc[key] = { label: key, packed: 0, total: 0 };
    }
    acc[key].total += 1;
    if (item.packedStatus === "Packed") {
      acc[key].packed += 1;
    }
    return acc;
  }, {})
);
// Merge với category mặc định để luôn hiển thị
const packingCategories = defaultCategoryPacking.map((label) => {
  const found = rawCategories.find((c) => c.label === label);
  return found
    ? {
        label,
        percent: Math.round((found.packed / found.total) * 100),
        packed: found.packed,
        total: found.total,
        color: CATEGORY_COLORS[label] || "#d1d5db",
      }
    : {
        label,
        percent: 0,
        packed: 0,
        total: 0,
        color: "#3498db",
      };
});

  const defaultBudgetCategories = [
    "Transport",
    "Accommodation",
    "Food",
    "Shopping",
    "Activity",
    "Other",
  ];

  const budgetChart = defaultBudgetCategories.map(label => {
    const found = budgetItems.filter(item => item.category === label);
    const amount = found.reduce((sum, item) => sum + (Number(item.actualCost) || 0), 0);
    return { category: label, amount };
  });

  const itineraryDoneCount = itinerary.filter((item) => {
  const status = String(item.status || "").toLowerCase();

  return (
    status === "done" ||
    status === "completed" ||
    item.completed === true
  );
}).length;

const itineraryPercent =
  itinerary.length > 0
    ? Math.round((itineraryDoneCount / itinerary.length) * 100)
    : 0;

  const packingPercent =
    packingTotal > 0 ? Math.round((packingPacked / packingTotal) * 100) : 0;

  const unpaidCount = budgetItems.filter(
    (item) => item.paymentStatus !== "Paid"
  ).length;

  const overdueCount = itinerary.filter(isActivityOverdue).length;

  const stats = [
    {
      id: "itinerary",
      label: "Itinerary",
      sublabel: "Completed",
      valueDisplay: `${itineraryPercent}%`,
      progressPercent: itineraryPercent,
      icon: "calendar",
      alert: false,
    },
    {
      id: "packing",
      label: "Packing",
      sublabel: "Completed",
      valueDisplay: `${packingPercent}%`,
      progressPercent: packingPercent,
      icon: "clipboard",
      alert: false,
    },
    {
      id: "budget",
      label: "Budget",
      sublabel: "Used",
      valueDisplay: `${budgetPercent}%`,
      progressPercent: budgetPercent,
      icon: "dollar",
      alert: false,
    },
    {
      id: "unpaid",
      label: "Unpaid",
      sublabel: "Items",
      valueDisplay: String(unpaidCount),
      progressPercent: Math.min(100, unpaidCount * 10),
      icon: "tag",
      alert: unpaidCount > 0,
    },
    {
      id: "alert",
      label: "Overdue/Alert",
      valueDisplay: String(overdueCount),
      progressPercent: Math.min(100, overdueCount * 20),
      icon: "bell",
      sublabel: overdueCount > 0 ? "Items need attention" : "All on track",
      alert: overdueCount > 0,
    },
  ];

  const calendar = buildCalendarCells(itinerary);
  const timeline = [...itinerary]
    .sort((a, b) => {
      const left = `${a.date || ""} ${a.time || ""}`.trim();
      const right = `${b.date || ""} ${b.time || ""}`.trim();
      return new Date(left).getTime() - new Date(right).getTime();
    })
    .slice(0, 4)
    .map((event) => ({
      id: String(event.id),
      time: formatTime24to12(event.time),
      title: event.title || "Untitled",
      detail: event.location || event.category || "",
    }));

  const showChart = budgetChart.length > 0;

  return (
    <div className="dashboard-main">
      <header className="dashboard-page-header">
        <div className="dashboard-page-header__left">
          <BreadCrumb tripName={trip.tripName} pageName="Dash Board" />
          <h1 className="dashboard-title">Dash Board</h1>
          <p className="dashboard-subtitle">
            Track your trip progress at a glance.
          </p>
        </div>
        <div className="trip-summary-card">
          <div className="trip-summary-card__content">
            {/* Dữ liệu lấy từ Redux state (được hydrate từ localStorage key `tripData`). */}
            <h2 className="trip-summary-card__name">{tripNameDisplay}</h2>
            <p className="trip-summary-card__dates">
              <FiCalendar aria-hidden />
              {tripDatesDisplay}
            </p>
            <button type="button" className="btn-view-itinerary" onClick={() => setSelectedPage("Itinerary")}>
              View Itinerary
              <span className="btn-arrow" aria-hidden>
                →
              </span>
            </button>
          </div>
          <div className="trip-summary-card__art" aria-hidden>
            <div className="trip-art-sky" />
            <div className="trip-art-hills">
              <div className="hill hill--back" />
              <div className="hill hill--front" />
            </div>
          </div>
        </div>
      </header>

      <div className="stats-cards">
        {stats.length === 0 ? (
          <p className="dashboard-empty-inline">
            No statistics card yet <code>localStorage.tripData</code>.
          </p>
        ) : (
          stats.map((card) => {
            const Icon =
              STAT_ICON_COMPONENTS[card.icon] ?? STAT_ICON_COMPONENTS.calendar;
            const visual = STAT_VISUAL_BY_ICON[card.icon] ?? DEFAULT_STAT_VISUAL;
            return (
              <div
                key={card.id}
                className={`stat-card${card.alert ? " stat-card--alert" : ""}`}
              >
                <span className={`stat-icon ${visual.iconClass}`}>
                  <Icon aria-hidden />
                </span>
                <StatProgressRing
                  percent={card.progressPercent}
                  ringColor={visual.ring}
                  alert={card.alert}
                >
                  <p
                    className={`stat-value${card.alert ? " stat-value--alert" : ""}`}
                  >
                    {card.valueDisplay}
                  </p>
                </StatProgressRing>
                <p className={`stat-label${card.alert ? " stat-label--alert" : ""}`}>
                  {card.label}
                </p>
                {card.sublabel ? (
                  <p
                    className={`stat-sublabel${card.alert ? " stat-sublabel--alert" : ""}`}
                  >
                    {card.sublabel}
                  </p>
                ) : null}
              </div>
            );
          })
        )}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-grid__left">
          <div className="card packing-progress">
            <div className="card-header">
                <div className="header-left">
              <span className="stat-icon stat-icon--teal">
                <FaClipboardList />
              </span>
              <h2>Packing Progress</h2>
              </div>
              <a href="#packing" className="link-teal" onClick={() => setSelectedPage("Packing")}>
                See all items →
              </a>
            </div>
            {/* note : Packing hiển thị theo `tripData.packingList` trong localStorage. */}
            <p className="packed-summary">
              <strong>
                Packed{" "}
              </strong>
              <div>
                {packingPacked} of {packingTotal} items ready
              </div>
            </p>
            {packingCategories.map((cat) => (
              <div key={cat.label} className="category-progress">
                <div className="category-header">
                  <span className="category-name">{cat.label}</span>
                  <span className="category-percent">{cat.percent}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${cat.percent}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="card budget-chart">
                <h2>Budget by Categories</h2>
                {showChart ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                      data={budgetChart}
                      margin={{ top: 12, right: 12, left: 0, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis
                        dataKey="category"
                        tick={{ fontSize: 11, fill: "#6B7280" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#6B7280" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={v => `$${v}`}
                      />
                      <Tooltip formatter={value => `$${value}`} />
                      <Legend
                        verticalAlign="bottom"
                        iconType="square"
                        formatter={() => "amount"}
                      />
                      <Bar dataKey="amount" fill="#76A1C9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="dashboard-empty-block">
                    Chưa có dữ liệu biểu đồ — bổ sung <code>tripData.budgetItems</code>.
                  </p>
                )}
          </div>
          <div className="card budget-overview">
            <div className="budget-overview-header">
              <span className="budget-overview-icon">
                <FaDollarSign />
              </span>
              <h2>Budget Overview</h2>
            </div>
            {/* NOTE: overview lấy từ `tripData.budget` và tổng actualCost của budgetItems. */}
            <div className="budget-summary">
              <div className="budget-summary-item">
                <span className="budget-summary-label">Total Budget</span>
                <span className="budget-summary-value">
                  ${totalBudget.toLocaleString()}
                </span>
              </div>
              <div className="budget-summary-item budget-summary-item--used">
                <span className="budget-summary-label">Used</span>
                <span className="budget-summary-value budget-summary-value--green">
                  ${usedBudget.toLocaleString()}
                </span>
              </div>
              <div className="budget-summary-item">
                <span className="budget-summary-label">Remaining</span>
                <span className="budget-summary-value budget-summary-value--blue">
                  ${remainingBudget.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="progress-bar budget-progress-bar">
              <div
                className="progress-fill progress-fill--green"
                style={{ width: `${budgetPercent}%` }}
              />
            </div>
            <button type="button" className="btn-view-budget" onClick={() => setSelectedPage("Budget")}>
              View Budget Details
              <span className="btn-arrow" aria-hidden>
                →
              </span>
            </button>
          </div>
        </div>

        <div className="dashboard-grid__right">
          <div className="card mini-calendar">
            <div className="mini-calendar-header">
              <button type="button" className="calendar-nav" aria-label="Previous month">
                <FiChevronLeft />
              </button>
              {/* NOTE: calendar dựng tự động theo tháng của itinerary sớm nhất trong localStorage. */}
              <h2>{calendar.monthLabel.trim() || "—"}</h2>
              <button type="button" className="calendar-nav" aria-label="Next month">
                <FiChevronRight />
              </button>
            </div>
            {calendar.weekdayLabels.length === 0 ? (
              <p className="dashboard-empty-block">
                Không có dữ liệu lịch. Hãy thêm <code>tripData.itinerary</code>.
              </p>
            ) : (
              <>
                <div className="calendar-weekdays">
                  {calendar.weekdayLabels.map((day, i) => (
                    <span key={`${day}-${i}`}>{day}</span>
                  ))}
                </div>
                <div className="calendar-dates">
                  {calendar.cells.map((cell) => (
                    <span
                      key={cell.key}
                      className={[
                        cell.isActive ? "calendar-date--active" : "",
                        cell.muted ? "calendar-date--muted" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {cell.dayDisplay}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="card day-timeline">
            {/* NOTE: timeline lấy 4 itinerary event đầu theo date/time. */}
            {timeline.length === 0 ? (
              <p className="dashboard-empty-block">
                Chưa có sự kiện — bổ sung <code>tripData.itinerary</code>.
              </p>
            ) : (
              timeline.map((event) => (
                <div key={event.id} className="timeline-event">
                  <span className="timeline-time">{event.time}</span>
                  <div className="timeline-block">
                    <p className="timeline-title">{event.title}</p>
                    <p className="timeline-detail">{event.detail}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
