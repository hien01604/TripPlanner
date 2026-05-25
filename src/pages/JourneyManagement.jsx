import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import JourneyCard from "../components/journey/JourneyCard";
import AddJourneyModal from "../components/journey/AddJourneyModal";
import MessageBox from "../components/journey/MessageBox";
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
    const isEmpty = trips.length === 0;

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
            // keep user on Journey Management after creating a trip
        }

        closeModal();
    };

    return (
<div className="journey-management">
    {isEmpty ? (
      <div className="journey-empty-screen">
        <h1 className="journey-empty-title">Welcome to Journie!</h1>

        <div className="journey-empty-illustration" aria-hidden>
          <div className="journey-empty-globe">🌍</div>
          <div className="journey-empty-plane journey-empty-plane--left">✈️</div>
          <div className="journey-empty-plane journey-empty-plane--right">✈️</div>
        </div>

        <div className="journey-empty-content">
          <h2>Start your next adventure</h2>
          <p>
            Plan destinations, organize activities, track expenses, and pack
            smarter — all in one place.
          </p>

          <button
            type="button"
            className="journey-empty-create-btn"
            onClick={openCreateModal}
          >
            <span>＋</span>
            Create new journey
          </button>
        </div>
      </div>
    ) : (
      <>
        <div className="journey-management__header">
          <div>
            <h1 className="journey-management__title">Welcome to Journie!</h1>
            <p className="journey-management__subtitle">
              Create, edit, and jump into any journey from one place.
            </p>
          </div>
        </div>

        <div className="journey-grid">
          <button
            type="button"
            className="journey-create-card"
            onClick={openCreateModal}
          >
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
      </>
    )}

    {isModalOpen && (
      <AddJourneyModal
        key={editingIndex !== null ? `edit-${editingIndex}` : "create"}
        onClose={closeModal}
        onCreate={handleSaveJourney}
        mode={editingIndex !== null ? "edit" : "create"}
        initialJourney={
          editingTrip
            ? {
                title: editingTrip.title ?? editingTrip.tripName ?? "",
                budget: editingTrip.budget ?? "",
                startDate: editingTrip.startDate ?? "",
                endDate: editingTrip.endDate ?? "",
                note: editingTrip.note ?? "",
                thumbnail: editingTrip.thumbnail ?? null,
              }
            : null
        }
      />
    )}

    <MessageBox
      visible={deleteTargetIndex !== null}
      title="Delete journey"
      message={`Delete "${
        trips[deleteTargetIndex]?.tripName ??
        trips[deleteTargetIndex]?.title ??
        "this journey"
      }"?`}
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={confirmDeleteJourney}
      onCancel={cancelDeleteJourney}
    />
  </div>
    );
}

export default JourneyManagement;