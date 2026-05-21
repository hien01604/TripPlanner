import "../style/PackingTable.css"

function PackingTable({ items, title, togglePacked, deleteItem, openModal, openEditModal }) {
  const packedCount = items.filter(item => item.packed).length

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
              <tr key={item.id} className={item.packed ? "packed-row" : ""}>
                <td>
                  <input type="checkbox" checked={item.packed} onChange={() => togglePacked(item.id)} />
                </td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>
                  <span className={item.required ? "required" : "optional"}>
                    {item.required ? "Required" : "Optional"}
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