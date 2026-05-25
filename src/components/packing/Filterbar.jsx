import "../../style/Filterbar.css"

function Filterbar({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, typeFilter, setTypeFilter }) {
  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search items..."
        className="search-input2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        className="filter-select"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="All">All Status</option>
        <option value="Packed">Packed</option>
        <option value="Unpacked">Unpacked</option>
      </select>
      <select
        className="filter-select"
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
      >
        <option value="All">All Types</option>
        <option value="Required">Required</option>
        <option value="Optional">Optional</option>
      </select>
    </div>
  )
}

export default Filterbar