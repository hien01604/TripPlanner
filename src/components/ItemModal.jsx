import { useState } from "react"
import "../style/ItemModal.css"

function ItemModal({ closeModal, addItem, editingItem, updateItem }) {
  const isEditing = !!editingItem?.id

  const [name,     setName]     = useState(editingItem?.name     || "")
  const [category, setCategory] = useState(editingItem?.category || "")
  const [quantity, setQuantity] = useState(editingItem?.quantity || 1)
  const [required, setRequired] = useState(editingItem?.requiredStatus === "Required")

  const handleSubmit = () => {
    if (!name.trim()) return
    const itemData = {
      id:             editingItem?.id,
      name,
      category,
      quantity,
      requiredStatus: required ? "Required" : "Optional",
      packedStatus:   editingItem?.packedStatus || "Not Packed",
    }
    isEditing ? updateItem(itemData) : addItem(itemData)
    closeModal()
  }

  return (
    <div className="modal-overlay">
      <div className="item-modal">
        <div className="modal-top">
          <h2>{isEditing ? "Edit Item" : "New Item"}</h2>
          <button className="close-btn" onClick={closeModal}>✕</button>
        </div>

        <div className="modal-group">
          <label>Item name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="modal-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Clothes</option>
              <option>Documents</option>
              <option>Electronics</option>
              <option>Medicine</option>
              <option>Personal</option>
          </select>
        </div>

        <div className="modal-group">
          <label>Quantity</label>
          <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        </div>

        <div className="required-row">
          <label className="required-check">
            <input type="checkbox" checked={required} onChange={() => setRequired(!required)} />
            <span>Required</span>
          </label>
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          {isEditing ? "Save Changes" : "Add to bag"}
        </button>
      </div>
    </div>
  )
}

export default ItemModal