import "../style/PackingTable.css"

function PackingTable({ items, title, togglePacked, deleteItem, openModal, openEditModal }) {
  const packedCount = items.filter(item => item.packedStatus === "Packed").length

  return (
    <div className="packing-table">
      <div className="packing-table-header">
        <div>
          <h2>{title}</h2>
          <p>{packedCount} of {items.length} items packed</p>
        </div>
        <button className="add-btn" onClick={openModal}>+ Add Items</button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Packed</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? items.map(item => (
              <tr key={item.id} className={item.packedStatus === "Packed" ? "packed-row" : ""}>
                <td>
                  <input type="checkbox" checked={item.packedStatus === "Packed"} onChange={() => togglePacked(item.id)} />
                </td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>
                  <span className={item.requiredStatus === "Required" ? "required" : "optional"}>
                    {item.requiredStatus === "Required" ? "Required" : "Optional"}
                  </span>
                </td>
                <td className="actions">
                  <button className="edit-btn" onClick={() => openEditModal(item)}>✏️</button>
                  <button className="delete-btn" onClick={() => deleteItem(item.id)}>🗑️</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="empty-message">No items found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PackingTable