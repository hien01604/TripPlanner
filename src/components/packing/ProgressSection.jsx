import "../../style/ProgressSection.css"

function ProgressSection({ totalItems, packedItems, requiredItems, progress }) {
  return (
    <div className="progress-section">
      <div className="progress-left">
        <div className="progress-icon">😊</div>
        <div className="progress-info">
          <h3>Packing Progress</h3>
          <p>{packedItems} of {totalItems} items packed</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="progress-percent">
        <h1>{progress}%</h1>
        <p>Completed</p>
      </div>

      <div className="progress-stats">
        <div className="stat-card">
          <p>Total Items</p>
          <h1>{totalItems}</h1>
        </div>
        <div className="stat-card">
          <p>Packed Items</p>
          <h1>{packedItems}</h1>
        </div>
        <div className="stat-card">
          <p>Required Items</p>
          <h1>{requiredItems}</h1>
        </div>
      </div>
    </div>
  )
}

export default ProgressSection
