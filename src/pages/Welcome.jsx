import React, { useState } from "react"
import { FaPlus, FaMapMarkedAlt, FaSuitcaseRolling, FaRoute } from "react-icons/fa"
import AddJourneyModal from "./AddJourneyModal"
import "../style/Welcome.css"

export default function Welcome({ onCreateJourney }) {
    const [showModal, setShowModal] = useState(false)

    const handleCreate = (journeyData) => {
        onCreateJourney(journeyData)
        setShowModal(false)
    }

    return (
        <>
            <div className={`welcome-page ${showModal ? "blurred" : ""}`}>
                <div className="welcome-overlay" />

                <div className="welcome-inner">
                    <div className="welcome-badge">
                        ✈️ Your smart travel planner
                    </div>

                    <h1>
                        Plan unforgettable journeys with
                        <span> Journie</span>
                    </h1>

                    <p className="welcome-sub">
                        Organize destinations, build itineraries, track expenses,
                        and pack everything you need — all in one place.
                    </p>

                    <div className="welcome-actions">
                        <button
                            className="welcome-cta primary"
                            onClick={() => setShowModal(true)}
                        >
                            <FaPlus />
                            Create New Journey
                        </button>
                    </div>

                    <div className="welcome-features">
                        <div className="feature-card">
                            <FaMapMarkedAlt />
                            <span>Destination Planning</span>
                        </div>

                        <div className="feature-card">
                            <FaRoute />
                            <span>Smart Itineraries</span>
                        </div>

                        <div className="feature-card">
                            <FaSuitcaseRolling />
                            <span>Packing Checklist</span>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <AddJourneyModal
                    onClose={() => setShowModal(false)}
                    onCreate={handleCreate}
                />
            )}
        </>
    )
}