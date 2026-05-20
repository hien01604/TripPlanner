import { useSelector } from "react-redux";
import {
  HiMenu,
  HiOutlineBell,
  HiOutlineDotsVertical,
} from "react-icons/hi";
import {
  FiSearch,
  FiFilter,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { IoMdUndo } from "react-icons/io";
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

import JourneySidebar from "../../components/JourneySidebar";
import PlanningSidebar from "../../components/PlanningSidebar";
import "./Dashboard.css";

const PACKING_CATEGORIES = ["Clothes", "Documents", "Electronics", "Personal"];

const CATEGORY_COLORS = {
  Clothes: "#3B82F6",
  Documents: "#4FD1C5",
  Electronics: "#8B5CF6",
  Personal: "#F59E0B",
};

const STAT_CARDS = [
  {
    label: "Itinerary Completed",
    value: "75%",
    icon: FaCalendarAlt,
    iconClass: "stat-icon--blue",
  },
  {
    label: "Packing Completed",
    value: "75%",
    icon: FaClipboardList,
    iconClass: "stat-icon--teal",
  },
  {
    label: "Budget Used",
    value: "75%",
    icon: FaDollarSign,
    iconClass: "stat-icon--green",
  },
  {
    label: "Unpaid Items",
    value: "16",
    icon: FaTag,
    iconClass: "stat-icon--yellow",
  },
  {
    label: "Overdue/Alert",
    value: "3",
    sublabel: "Items need attention",
    icon: FaBell,
    iconClass: "stat-icon--red",
    alert: true,
  },
];

const CHART_DATA = [
  { category: "Transport", amount: 4200 },
  { category: "Transport", amount: 6800 },
  { category: "Transport", amount: 3100 },
  { category: "Transport", amount: 5500 },
  { category: "Transport", amount: 7200 },
  { category: "Transport", amount: 4800 },
];

const CALENDAR_WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const CALENDAR_DATES = [
  27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
  18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7,
];

const TIMELINE_EVENTS = [
  { time: "10 Am", title: "Research", detail: "03 People" },
  { time: "12 Pm", title: "Back end IT Asset", detail: "03 People" },
];

function formatTripDates(itinerary) {
  if (!itinerary?.length) return "Jun 10 - Jun 15, 2026";
  const start = new Date(itinerary[0].date);
  const end = new Date(itinerary[itinerary.length - 1].date);
  const opts = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString("en-US", opts)} - ${end.toLocaleDateString("en-US", opts)}, ${start.getFullYear()}`;
}

export function DashboardMain() {
  const trip = useSelector((state) => state.trip);

  const totalBudget = 2400;
  const usedBudget = 1488;
  const remainingBudget = 912;
  const budgetPercent = Math.round((usedBudget / totalBudget) * 100);

  const totalItems = trip.packingList.length || 60;
  const totalPackedItems =
    trip.packingList.filter((i) => i.packedStatus === "Packed").length || 41;
  const displayPacked = totalPackedItems || 41;
  const displayTotal = totalItems || 60;

  const budgetByCategory = [
    "Transport",
    "Accommodation",
    "Food",
    "Shopping",
    "Activity",
    "Other",
  ].map((category) => {
    const items = trip.budgetItems.filter((item) => item.category === category);
    const total = items.reduce((sum, i) => sum + i.actualCost, 0);
    return { category, amount: total || 0 };
  });

  const chartData =
    budgetByCategory.some((d) => d.amount > 0) ? budgetByCategory : CHART_DATA;

  return (
    <div className="dashboard-main">
      <header className="dashboard-page-header">
        <div className="dashboard-page-header__left">
          <p className="breadcrumb">Japan &gt; Dash Board</p>
          <h1 className="dashboard-title">Dash Board</h1>
          <p className="dashboard-subtitle">
            Track your trip progress at a glance.
          </p>
        </div>
        <div className="trip-summary-card">
          <div className="trip-summary-card__content">
            <h2 className="trip-summary-card__name">Hachimi</h2>
            <p className="trip-summary-card__dates">
              <FiCalendar aria-hidden />
              {formatTripDates(trip.itinerary)}
            </p>
            <button type="button" className="btn-view-itinerary">
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
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`stat-card${card.alert ? " stat-card--alert" : ""}`}
            >
              <span className={`stat-icon ${card.iconClass}`}>
                <Icon />
              </span>
              <p className={`stat-value${card.alert ? " stat-value--alert" : ""}`}>
                {card.value}
              </p>
              <p className="stat-label">{card.label}</p>
              {card.sublabel && (
                <p className="stat-sublabel">{card.sublabel}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-grid__left">
          <div className="card packing-progress">
            <div className="card-header">
              <h2>Packing Progress</h2>
              <a href="#packing" className="link-teal">
                See all items →
              </a>
            </div>
            <p className="packed-summary">
              Packed{" "}
              <strong>
                {displayPacked} of {displayTotal} items ready
              </strong>
            </p>
            {PACKING_CATEGORIES.map((category) => {
              const itemsInCategory = trip.packingList.filter(
                (i) => i.category === category
              );
              const packedCount = itemsInCategory.filter(
                (i) => i.packedStatus === "Packed"
              ).length;
              const totalCount = itemsInCategory.length || 1;
              const percent =
                itemsInCategory.length === 0
                  ? { Clothes: 80, Documents: 60, Electronics: 50, Personal: 70 }[
                      category
                    ]
                  : Math.round((packedCount / totalCount) * 100);

              return (
                <div key={category} className="category-progress">
                  <div className="category-header">
                    <span className="category-name">{category}</span>
                    <span className="category-percent">{percent}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: CATEGORY_COLORS[category],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card budget-chart">
            <h2>Budget by Categories</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={chartData}
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
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend
                  verticalAlign="bottom"
                  iconType="square"
                  formatter={() => "revenue"}
                />
                <Bar dataKey="amount" fill="#76A1C9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card budget-overview">
            <div className="budget-overview-header">
              <span className="budget-overview-icon">
                <FaDollarSign />
              </span>
              <h2>Budget Overview</h2>
            </div>
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
            <button type="button" className="btn-view-budget">
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
              <h2>2024 December</h2>
              <button type="button" className="calendar-nav" aria-label="Next month">
                <FiChevronRight />
              </button>
            </div>
            <div className="calendar-weekdays">
              {CALENDAR_WEEKDAYS.map((day, i) => (
                <span key={`${day}-${i}`}>{day}</span>
              ))}
            </div>
            <div className="calendar-dates">
              {CALENDAR_DATES.map((date, i) => (
                <span
                  key={`${date}-${i}`}
                  className={date === 3 && i > 6 ? "calendar-date--active" : ""}
                >
                  {date}
                </span>
              ))}
            </div>
          </div>

          <div className="card day-timeline">
            {TIMELINE_EVENTS.map((event) => (
              <div key={event.time} className="timeline-event">
                <span className="timeline-time">{event.time}</span>
                <div className="timeline-block">
                  <p className="timeline-title">{event.title}</p>
                  <p className="timeline-detail">{event.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ selectedPage, setSelectedPage, children }) {
  return (
    <div className="dashboard-shell">
      <header className="top-navbar">
        <button type="button" className="top-navbar__menu" aria-label="Open menu">
          <HiMenu />
        </button>
        <div className="top-navbar__search">
          <FiSearch className="search-icon" aria-hidden />
          <input
            type="search"
            placeholder="Find in this website"
            aria-label="Find in this website"
          />
          <button type="button" className="filter-btn" aria-label="Filter search">
            <FiFilter />
          </button>
        </div>
        <div className="top-navbar__actions">
          <button type="button" className="top-navbar__undo">
            <IoMdUndo />
            Undo
          </button>
          <button type="button" className="top-navbar__bell" aria-label="Notifications">
            <HiOutlineBell />
          </button>
          <button type="button" className="top-navbar__avatar" aria-label="User menu">
            <img
              src="https://i.pravatar.cc/40?img=12"
              alt=""
              className="avatar-img"
            />
            <HiOutlineDotsVertical className="avatar-chevron" />
          </button>
        </div>
      </header>

      <div className="dashboard-body">
        <JourneySidebar />
        <PlanningSidebar
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
        <main className="dashboard-content">
          {children ?? <DashboardMain />}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
