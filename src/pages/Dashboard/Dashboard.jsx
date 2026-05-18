import { useSelector } from "react-redux";
import "./Dashboard.css";

const Dashboard = () => {
  const trip = useSelector((state) => state.trip);

  // Budget bars from Redux data
  const budgetBars = trip.budgetItems.map(item => ({
    label: item.category,
    value: item.actualCost
  }));
  const maxValue = Math.max(...budgetBars.map(b => b.value));


  const totalUsedBudget = trip.budgetItems.reduce((sum, item) => sum + item.actualCost, 0);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <p className="breadcrumb">Japan &gt; Dash Board</p>
          <h1 className="dashboard-title">Dash Board</h1>
          <p className="dashboard-subtitle">Track your trip progress at a glance.</p>
        </div>
        <div className="header-right">
          <p className="user-name">Hachimi</p>
          <p className="user-date">Jun 10 - Jun 15, 2026</p>
          <button className="btn-view-itinerary">View Itinerary</button>
        </div>
      </div>

      {/* Stats Cards (keep original 5 cards) */}
      <div className="stats-cards">
        {[
          { title: "Itinerary", value: "75%", status: "Completed" },
          { title: "Packing", value: "75%", status: "Completed" },
          { title: "Budget", value: "75%", status: "Used" },
          { title: "Unpaid", value: "16", status: "Items" },
          { title: "Overdue/Alert", value: "3", status: "Attention", overdue: true },
        ].map((item, idx) => (
          <div key={idx} className={`stat-card ${item.overdue ? "overdue" : ""}`}>
            <p className="stat-value">{item.value}</p>
            <p className="stat-title">{item.title}</p>
            <p className="stat-status">{item.status}</p>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        <div className="card packing-progress">
            <h2>Packing Progress</h2>

          {["Clothes", "Documents", "Electronics", "Medicine", "Personal", "Other"].map(category => {
            const itemsInCategory = trip.packingList.filter(item => item.category === category);
            const packedCount = itemsInCategory.filter(i => i.packedStatus === "Packed").length;
            const totalCount = itemsInCategory.length || 1; // Avoid divide by zero
            const percent = itemsInCategory.length === 0 ? 0 : Math.round((packedCount / totalCount) * 100);

            return (
              <div key={category} className="category-progress">
                <h3>{category} ({packedCount}/{itemsInCategory.length || 0})</h3>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Budget by Categories (Redux + LocalStorage) */}
        <div className="card budget-chart">
          <h2>Budget by Categories</h2>
          <div className="budget-bars">
            {budgetBars.map((bar, idx) => (
              <div key={idx} className="budget-bar-item">
                <p className="bar-label">{bar.label}</p>
                <div className="bar-container">
                  <div
                    className="bar"
                    style={{ width: `${(bar.value / maxValue) * 100}%` }}
                  ></div>
                </div>
                <p className="bar-value">${bar.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar & Timeline (keep original) */}
        <div className="card calendar-timeline">
          <h2>2024 December</h2>
          <div className="calendar">
            <div className="days">
              {["M","T","W","T","F","S","S"].map((d,i)=><div key={i}>{d}</div>)}
            </div>
            <div className="dates">
              {[27,28,29,30,1,2,3,4].map((d,i)=><div key={i}>{d}</div>)}
            </div>
          </div>
          <div className="timeline">
            <div>
              <p>10 AM - Research (03 People)</p>
              <p>12 PM - Back end IT Asset (03 People)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Overview (Redux + LocalStorage) */}
      <div className="card budget-overview">
        <h2>Budget Overview</h2>
        <div className="budget-summary">
          <div>Total Budget: ${trip.budget}</div>
          <div>Used: ${totalUsedBudget}</div>
          <div>Remaining: ${trip.budget - totalUsedBudget}</div>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(totalUsedBudget / trip.budget) * 100}%` }}
          ></div>
        </div>
        <button className="btn-view-budget">View Budget Details</button>
      </div>
    </div>
  );
};

export default Dashboard;