import React, { useState } from "react"
import { FaPlus } from "react-icons/fa"
import JourneyCard from "../components/JourneyCard"
import AddJourneyModal from "./AddJourneyModal"
import "../style/JourneyManagement.css"

export default function JourneyManagement({
    journeys,
    onCreateJourney,
    onEditJourney,
    onSelectJourney,
}) {
    const [showModal, setShowModal] = useState(false)
    const [editingJourney, setEditingJourney] = useState(null)
    

    const handleCreate = (journeyData) => {
        if (editingJourney) {
            onEditJourney({
                ...editingJourney,
                ...journeyData,
            })
        } else {
            onCreateJourney(journeyData)
        }

        setShowModal(false)
        setEditingJourney(null)
    }
    const handleEditJourney = (journey) => {
        setEditingJourney(journey)
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setEditingJourney(null)
    }

    return (
        <>
            <div className="journey-management">
                <h1 className="journey-title">Welcome to Journie!</h1>

                <div className="journey-grid">
                    {/* Create New Journey Card */}
                    <div
                        className="journey-create-card"
                        onClick={() => {
                            setEditingJourney(null)
                            setShowModal(true)
                        }}
                    >
                        <div className="create-icon">
                            <FaPlus />
                        </div>
                        <p>Create New Journey</p>
                    </div>

                    {/* Journey Cards */}
                    {journeys.map((journey) => (
                        <JourneyCard
                            key={journey.id}
                            journey={journey}
                            onClick={() => onSelectJourney(journey.id)}
                            onEditJourney={(selectedJourney) => {
                                setEditingJourney(selectedJourney)
                                setShowModal(true)
                            }}
                        />
                    ))}
                </div>
            </div>

            {showModal && (
                <AddJourneyModal
                    onClose={handleCloseModal}
                    onCreate={handleCreate}
                    onEditJourney={handleEditJourney}
                    mode={editingJourney ? "edit" : "create"}
                    initialJourney={editingJourney}
                />
            )}
        </>
    )
}
