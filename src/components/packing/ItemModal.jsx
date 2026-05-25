import { useState } from "react"
import "../../style/ItemModal.css"

function ItemModal({ closeModal, addItem, editingItem, updateItem }) {
  const isEditing = !!editingItem?.id

  const [name, setName] = useState(editingItem?.name || "")
  const [category, setCategory] = useState(editingItem?.category || "Clothes")
  const [quantity, setQuantity] = useState(editingItem?.quantity || 1)
  const [required, setRequired] = useState(
    editingItem?.requiredStatus === "Required"
  )

  const [error, setError] = useState("")

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Please enter item name")
      return
    }

    const itemData = {
      id: editingItem?.id,
      name: name.trim(),
      category,
      quantity,
      requiredStatus: required ? "Required" : "Optional",
      packedStatus: editingItem?.packedStatus || "Not Packed",
    }

    if (isEditing) {
      updateItem(itemData)
      closeModal()
      return
    }

    const result = addItem(itemData)

    if (result === false) {
      setError("This item already exists in the packing list!")
      return
    }

    setError("")
    closeModal()
  }

  return (
    <div className="modal-overlay">
      <div className="item-modal">
        <div className="modal-top">
          <h3>{isEditing ? "Edit Item" : "New Item"}</h3>
        </div>
        {error && (
          <p className="packing-error">{error}</p>
        )}
        <div className="modal-group">
          <label>Item name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError("")
            }}
          />
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
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <div className="required-row">
          <label className="required-check">
            <input
              type="checkbox"
              checked={required}
              onChange={() => setRequired(!required)}
            />
            <span>Required</span>
          </label>
        </div>
        <div className="form-actions">
        <button className="submit-btn" onClick={handleSubmit}>
            {isEditing ? "Save Changes" : "Add to bag"}
          </button>
          <button className="close-btn" onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default ItemModal