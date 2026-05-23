import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaPlus, FaSuitcaseRolling, FaTrash } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import AddJourneyModal from "./AddJourneyModal";
import MessageBox from "./MessageBox";
import { deleteTrip, updateTrip } from "../data/tripSlice";
import "../style/JourneySidebar.css";

function JourneySidebar({
  selectedPage,
  setSelectedPage,
  setJourneyManagementAction,
  selectedTripIndex = 0,
  setSelectedTripIndex,
}) {
  const dispatch = useDispatch();
  const trips = useSelector((state) => state.trip.trips ?? []);
  const [editingIndex, setEditingIndex] = useState(null);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTargetIndex, setDeleteTargetIndex] = useState(null);
  const openMenuRef = useRef(null);
  const editingTrip = editingIndex !== null ? trips[editingIndex] : null;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (openMenuIndex === null) return;

      if (openMenuRef.current && !openMenuRef.current.contains(event.target)) {
        setOpenMenuIndex(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [openMenuIndex]);

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredTrips = trips.filter((trip) => {
    if (!normalizedSearchTerm) return true;

    const tripName = (trip.tripName ?? trip.title ?? "").toLowerCase();
    return tripName.includes(normalizedSearchTerm);
  });

  const clearSearch = () => {
    setSearchTerm("");
    setOpenMenuIndex(null);
  };

  const closeEditModal = () => {
    setEditingIndex(null);
  };

  const handleSaveJourney = (journeyData) => {
    if (editingIndex === null || !editingTrip) return;

    dispatch(updateTrip({
      index: editingIndex,
      trip: {
        ...editingTrip,
        tripName: journeyData.title,
        title: journeyData.title,
        budget: journeyData.budget,
        startDate: journeyData.startDate,
        endDate: journeyData.endDate,
        note: journeyData.note,
        thumbnail: journeyData.thumbnail,
      },
    }));

    setSelectedTripIndex(editingIndex);
    closeEditModal();
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
        : Math.min(
          selectedTripIndex > index ? selectedTripIndex - 1 : selectedTripIndex,
          nextTripsLength - 1
        );

    dispatch(deleteTrip(index));
    setSelectedTripIndex(nextSelectedIndex);

    if (nextTripsLength <= 0) {
      setJourneyManagementAction?.(null);
      setSelectedPage("JourneyManagement");
    } else {
      setSelectedPage("Dashboard");
    }

    setDeleteTargetIndex(null);
  };

  const cancelDeleteJourney = () => {
    setDeleteTargetIndex(null);
  };

  const openModifyJourney = (index) => {
    setOpenMenuIndex(null);
    setEditingIndex(index);
  };

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">JOURNEY</h3>
      <input
        className="search-input"
        type="search"
        placeholder="Find journey"
        value={searchTerm}
        onChange={(event) => {
          setOpenMenuIndex(null);
          setSearchTerm(event.target.value);
        }}
        aria-label="Find journey"
      />
      <div className="journey-list">
        {filteredTrips.map((trip) => {
          const tripIndex = trips.findIndex((item) => item === trip);

          return (
            <div
              key={`${trip.tripName ?? trip.title ?? "journey"}-${tripIndex}`}
              className={`journey-item${tripIndex === selectedTripIndex && selectedPage !== "JourneyManagement" ? " active" : ""}`}
              onClick={() => {
                clearSearch();
                setSelectedTripIndex(tripIndex);
                setSelectedPage("Dashboard");
              }}
            >
              <span className="journey-name">{trip.tripName ?? trip.title ?? "Untitled journey"}</span>
              <div className="journey-actions" ref={openMenuIndex === tripIndex ? openMenuRef : null}>
                <button
                  type="button"
                  className="journey-action-menu-btn"
                  aria-label={`Open actions for ${trip.tripName ?? trip.title ?? "journey"}`}
                  aria-expanded={openMenuIndex === tripIndex}
                  onClick={(event) => {
                    event.stopPropagation();
                    setOpenMenuIndex((currentIndex) => (currentIndex === tripIndex ? null : tripIndex));
                  }}
                >
                  <HiOutlineDotsVertical />
                </button>

                {openMenuIndex === tripIndex && (
                  <div className="journey-actions-menu" onClick={(event) => event.stopPropagation()}>
                    <button
                      type="button"
                      className="journey-actions-menu__item"
                      onClick={() => openModifyJourney(tripIndex)}
                    >
                      <FaEdit />
                      Modify
                    </button>
                    <button
                      type="button"
                      className="journey-actions-menu__item journey-actions-menu__item--danger"
                      onClick={() => {
                        setOpenMenuIndex(null);
                        handleDeleteJourney(tripIndex);
                      }}
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredTrips.length === 0 && (
          <div className="journey-empty-state">No journeys found.</div>
        )}

        <div
          className={`journey-item journey-item--management${selectedPage === "JourneyManagement" ? " active" : ""}`}
          onClick={() => {
            clearSearch();
            setJourneyManagementAction?.(null)
            setSelectedPage("JourneyManagement")
          }}
        >
          <span className="journey-item-left">
            <FaSuitcaseRolling />
            Trip Management
          </span>
        </div>
      </div>
      <button
        className="create-btn"
        onClick={() => {
          setJourneyManagementAction?.("create")
          setSelectedPage("JourneyManagement")
        }}
      >
        <FaPlus />
        Create new journey
      </button>

      {editingTrip && (
        <AddJourneyModal
          onClose={closeEditModal}
          onCreate={handleSaveJourney}
          mode="edit"
          initialJourney={{
            title: editingTrip.title ?? editingTrip.tripName ?? "",
            budget: editingTrip.budget ?? "",
            startDate: editingTrip.startDate ?? "",
            endDate: editingTrip.endDate ?? "",
            note: editingTrip.note ?? "",
            thumbnail: editingTrip.thumbnail ?? null,
          }}
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

export default JourneySidebar;
