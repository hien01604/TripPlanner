import "./Dashboard.css";

const Dashboard = () => {
  // Dữ liệu bar chart bằng CSS
  const budgetBars = [
    { label: "Transport", value: 4000 },
    { label: "Transport", value: 3500 },
    { label: "Transport", value: 5000 },
    { label: "Transport", value: 4500 },
    { label: "Transport", value: 6000 },
    { label: "Transport", value: 5800 },
  ];
  const maxValue = Math.max(...budgetBars.map(b => b.value));

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

      {/* Stats Cards */}
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
        {/* Packing Progress */}
        <div className="card packing-progress">
          <h2>Packing Progress</h2>
          <p>Packed 41 of 60 items ready</p>
          {[
            { name: "Clothes", percent: 80 },
            { name: "Documents", percent: 60 },
            { name: "Electronics", percent: 50 },
            { name: "Personal", percent: 70 },
          ].map((item, idx) => (
            <div key={idx} className="progress-item">
              <p>{item.name}</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${item.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Budget by Categories (CSS bar chart) */}
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

        {/* Calendar & Timeline */}
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

      {/* Budget Overview */}
      <div className="card budget-overview">
        <h2>Budget Overview</h2>
        <div className="budget-summary">
          <div>Total Budget: $2,400</div>
          <div>Used: $1,488</div>
          <div>Remaining: $912</div>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(1488/2400)*100}%` }}
          ></div>
        </div>
        <button className="btn-view-budget">View Budget Details</button>
      </div>
    </div>
  );
};

export default Dashboard;