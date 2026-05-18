import { useSelector } from "react-redux";
import "./Dashboard.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";


const Dashboard = () => {
  const trip = useSelector((state) => state.trip);
  const categories = ["Transport", "Accommodation", "Food", "Shopping", "Activity", "Other"];


  const totalUsedBudget = trip.budgetItems.reduce((sum, item) => sum + item.actualCost, 0);

  const data = categories.map(category => {
    const items = trip.budgetItems.filter(item => item.category === category);
    const total = items.reduce((sum, i) => sum + i.actualCost, 0);
    return { category, amount: total };
  });


  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
      <div className="header-left">
        <p className="breadcrumb">{trip.tripName} &gt; Dashboard</p>
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Track your trip progress at a glance.</p>
      </div>
      <div className="header-right">
        <p className="user-name">{trip.tripName}</p>
        <p className="user-date">
          {trip.itinerary[0]?.date || "Start"} - {trip.itinerary[trip.itinerary.length - 1]?.date || "End"}
        </p>
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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                interval={0}
                angle={-30}
                textAnchor="end"
              />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Bar dataKey="amount" fill="#76A1C9" />
            </BarChart>
        </ResponsiveContainer>
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

      {/* Budget Overview  */}
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