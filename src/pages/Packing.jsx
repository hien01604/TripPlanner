import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { togglePackingItem, addPackingItem, deletePackingItem, updatePackingItem } from "../data/tripSlice"
import ProgressSection from "../components/ProgressSection"
import Filterbar from "../components/Filterbar"
import CategorySidebar from "../components/CategorySidebar"
import PackingTable from "../components/PackingTable"
import ItemModal from "../components/ItemModal"
import "../style/Packing.css"

function Packing({ selectedTripIndex = 0 }) {
  const dispatch = useDispatch()
  const tripIndex = selectedTripIndex

  const items = useSelector(
    state => state.trip.trips[tripIndex]?.packingList ?? []
  )

  const [selectedCategory, setSelectedCategory] = useState("Clothes")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All")
  const [openModal, setOpenModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const totalItems    = items.length
  const packedItems   = items.filter(item => item.packedStatus === "Packed").length
  const requiredItems = items.filter(item => item.requiredStatus === "Required").length
  const progress      = totalItems === 0 ? 0 : Math.round((packedItems / totalItems) * 100)

  const togglePacked = (id) => dispatch(togglePackingItem({ tripIndex, itemId: id }))

  const deleteItem = (id) => dispatch(deletePackingItem({ tripIndex, itemId: id }))

  const addItem = (newItem) => dispatch(addPackingItem({
    tripIndex,
    item: { ...newItem, id: Date.now(), packedStatus: "Not Packed" }
  }))

  const updateItem = (updatedItem) => dispatch(updatePackingItem({ tripIndex, item: updatedItem }))

  const openEditModal = (item) => {
    setEditingItem(item)
    setOpenModal(true)
  }

  const closeModal = () => {
    setOpenModal(false)
    setEditingItem(null)
  }

const filteredItems = items.filter(item => {
    const matchCategory =
      selectedCategory === "All" || !selectedCategory
        ? true
        : item.category === selectedCategory

    const matchSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchStatus =
      statusFilter === "All"
        ? true
        : statusFilter === "Packed"
          ? item.packedStatus === "Packed"
          : item.packedStatus !== "Packed"

    const matchType =
      typeFilter === "All"
        ? true
        : typeFilter === "Required"
          ? item.requiredStatus === "Required"
          : item.requiredStatus !== "Required"

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