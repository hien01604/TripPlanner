import { useState } from "react"
import ProgressSection from "../components/ProgressSection"
import Filterbar from "../components/Filterbar"
import CategorySidebar from "../components/CategorySidebar"
import PackingTable from "../components/PackingTable"
import ItemModal from "../components/ItemModal"
import initialItems from "../data/items"
import "../style/Packing.css"

function Packing() {
  const [selectedCategory, setSelectedCategory] = useState("Clothes")
  const [items, setItems]                       = useState(initialItems)
  const [searchTerm, setSearchTerm]             = useState("")
  const [statusFilter, setStatusFilter]         = useState("All")
  const [typeFilter, setTypeFilter]             = useState("All")
  const [openModal, setOpenModal]               = useState(false)
  const [editingItem, setEditingItem]           = useState(null)

  const totalItems    = items.length
  const packedItems   = items.filter(item => item.packed).length
  const requiredItems = items.filter(item => item.required).length
  const progress      = totalItems === 0 ? 0 : Math.round((packedItems / totalItems) * 100)

  const togglePacked = (id) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, packed: !item.packed } : item))
  }

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const addItem = (newItem) => {
    setItems(prev => [...prev, { ...newItem, id: Date.now(), packed: false }])
  }

  const updateItem = (updatedItem) => {
    setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item))
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setOpenModal(true)
  }

  const closeModal = () => {
    setOpenModal(false)
    setEditingItem(null)
  }

  const filteredItems = items.filter(item => {
    const matchCategory = !selectedCategory || item.category === selectedCategory
    const matchSearch   = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus   = statusFilter === "All" ? true : statusFilter === "Packed" ? item.packed : !item.packed
    const matchType     = typeFilter === "All" ? true : typeFilter === "Required" ? item.required : !item.required
    return matchCategory && matchSearch && matchStatus && matchType
  })

  return (
    <>
      <h1 className="packing-title">Checklist</h1>
      <p className="packing-subtitle">Track your packing items before the trip</p>

      <ProgressSection
        totalItems={totalItems}
        packedItems={packedItems}
        requiredItems={requiredItems}
        progress={progress}
      />

      <div className="packing-filter-wrapper">
        <Filterbar
          searchTerm={searchTerm}     setSearchTerm={setSearchTerm}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}     setTypeFilter={setTypeFilter}
        />
      </div>

      <div className="packing-layout">
        <div className="packing-sidebar">
          <CategorySidebar
            items={items}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>
        <div className="packing-table-section">
          <PackingTable
            title={selectedCategory}
            items={filteredItems}
            togglePacked={togglePacked}
            deleteItem={deleteItem}
            openModal={() => { setEditingItem(null); setOpenModal(true) }}
            openEditModal={openEditModal}
          />
        </div>
      </div>

      {openModal && (
        <ItemModal
          closeModal={closeModal}
          addItem={addItem}
          editingItem={editingItem}
          updateItem={updateItem}
        />
      )}
    </>
  )
}

export default Packing