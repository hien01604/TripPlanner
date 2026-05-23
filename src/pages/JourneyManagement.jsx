import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import JourneyCard from "../components/JourneyCard";
import AddJourneyModal from "../components/AddJourneyModal";
import MessageBox from "../components/MessageBox";
import { addTrip, deleteTrip, updateTrip } from "../data/tripSlice";
import "../style/JourneyManagement.css";

function JourneyManagement({
    selectedTripIndex,
    setSelectedTripIndex,
    setSelectedPage,
    journeyManagementAction,
    setJourneyManagementAction,
}) {
    const dispatch = useDispatch();
    const trips = useSelector((state) => state.trip.trips ?? []);
    const [showModal, setShowModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [deleteTargetIndex, setDeleteTargetIndex] = useState(null);
    const editingTrip = editingIndex !== null ? trips[editingIndex] : null;

    const openCreateModal = () => {
        setEditingIndex(null);
        setShowModal(true);
    };

    const openEditModal = (index) => {
        const trip = trips[index];
        if (!trip) return;

        setEditingIndex(index);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingIndex(null);
        setJourneyManagementAction?.(null);
    };

    const handleDeleteJourney = (index) => {
        setDeleteTargetIndex(index);
    };

    const confirmDeleteJourney = () => {
        if (deleteTargetIndex === null) return;

        const index = deleteTargetIndex;
        const nextTripsLength = trips.length - 1;
        const nextSelectedIndex =
            nextTripsLength <= 0
                ? 0
                : Math.min(selectedTripIndex > index ? selectedTripIndex - 1 : selectedTripIndex, nextTripsLength - 1);

        dispatch(deleteTrip(index));
        setSelectedTripIndex(nextSelectedIndex);
        setSelectedPage("JourneyManagement");
        setDeleteTargetIndex(null);
    };

    const cancelDeleteJourney = () => {
        setDeleteTargetIndex(null);
    };

    const isCreateIntent = journeyManagementAction === "create";
    const isModalOpen = showModal || isCreateIntent;

    const handleSaveJourney = (journeyData) => {
        const nextTrip = {
            tripName: journeyData.title,
            title: journeyData.title,
            budget: journeyData.budget,
            startDate: journeyData.startDate,
            endDate: journeyData.endDate,
            note: journeyData.note,
            thumbnail: journeyData.thumbnail,
            itinerary: editingTrip?.itinerary ?? [],
            packingList: editingTrip?.packingList ?? [],
            budgetItems: editingTrip?.budgetItems ?? [],
        };

        if (editingIndex !== null) {
            dispatch(updateTrip({ index: editingIndex, trip: nextTrip }));
            setSelectedTripIndex(editingIndex);
        } else {
            dispatch(addTrip(nextTrip));
            setSelectedTripIndex(trips.length);
        }

        setSelectedPage("Dashboard");
        closeModal();
    };

    return (
        <div className="journey-management">
            <div className="journey-management__header">
                <div>
                    {/* <p className="journey-management__eyebrow">Journey Management</p> */}
                    <h1 className="journey-management__title">Welcome to Journie!</h1>
                    <p className="journey-management__subtitle">
                        Create, edit, and jump into any journey from one place.
                    </p>
                </div>
            </div>

            <div className="journey-grid">
                <button type="button" className="journey-create-card" onClick={openCreateModal}>
                    <p>+ Create New Journey</p>
                </button>

                {trips.map((trip, index) => {
                    const journey = {
                        ...trip,
                        title: trip.title ?? trip.tripName ?? "Untitled journey",
                    };

                    return (
                        <JourneyCard
                            key={`${journey.title}-${index}`}
                            journey={journey}
                            onClick={() => {
                                setSelectedTripIndex(index);
                                setSelectedPage("Dashboard");
                            }}
                            onEditJourney={() => openEditModal(index)}
                            onDeleteJourney={() => handleDeleteJourney(index)}
                        />
                    );
                })}
            </div>

            {isModalOpen && (
                <AddJourneyModal
                    key={editingIndex !== null ? `edit-${editingIndex}` : "create"}
                    onClose={closeModal}
                    onCreate={handleSaveJourney}
                    mode={editingIndex !== null ? "edit" : "create"}
                    initialJourney={editingTrip ? {
                        title: editingTrip.title ?? editingTrip.tripName ?? "",
                        budget: editingTrip.budget ?? "",
                        startDate: editingTrip.startDate ?? "",
                        endDate: editingTrip.endDate ?? "",
                        note: editingTrip.note ?? "",
                        thumbnail: editingTrip.thumbnail ?? null,
                    } : null}
                />
            )}

            <MessageBox
                visible={deleteTargetIndex !== null}
                title="Delete journey"
                message={`Delete "${trips[deleteTargetIndex]?.tripName ?? trips[deleteTargetIndex]?.title ?? "this journey"}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDeleteJourney}
                onCancel={cancelDeleteJourney}
            />
        </div>
    );
}

export default JourneyManagement;