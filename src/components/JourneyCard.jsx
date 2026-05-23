import { useEffect, useRef, useState } from "react";
import { FaCalendarAlt, FaEdit, FaMapMarkerAlt, FaMoneyBillWave, FaTrash } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";

import "../style/JourneyCard.css";

function JourneyCard({ journey, onClick, onEditJourney, onDeleteJourney, active = false }) {
    const [openMenu, setOpenMenu] = useState(false);
    const openMenuRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!openMenu) return;

            if (openMenuRef.current && !openMenuRef.current.contains(event.target)) {
                setOpenMenu(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [openMenu]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "";

        const date = new Date(dateStr);

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const truncateText = (text, maxLength) => {
        if (!text) return "";

        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    const formatCurrency = (amount) => {
        if (!amount) return "0 VNĐ";

        return `${Number(amount).toLocaleString("en-US")} VNĐ`;
    };

    const dateDisplay = journey.startDate && journey.endDate
        ? `${formatDate(journey.startDate)} - ${formatDate(journey.endDate)}`
        : "";

    return (
        <div className={`journey-card${active ? " active" : ""}`} onClick={onClick} role="button" tabIndex={0}>
            <div className="journey-thumbnail-wrapper">
                {journey.thumbnail ? (
                    <img src={journey.thumbnail} alt={journey.title} className="journey-thumbnail" />
                ) : (
                    <div className="journey-thumbnail-default">
                        <span className="journey-thumbnail-default__icon">
                            <FaMapMarkerAlt />
                        </span>
                    </div>
                )}
                <div className="journey-thumbnail-shade" aria-hidden />

                <div className="journey-card-actions" ref={openMenu ? openMenuRef : null}>
                    <button
                        type="button"
                        className="journey-card-menu-btn"
                        aria-label={`Open actions for ${journey.title}`}
                        aria-expanded={openMenu}
                        onClick={(event) => {
                            event.stopPropagation();
                            setOpenMenu((currentOpen) => !currentOpen);
                        }}
                    >
                        <HiOutlineDotsVertical />
                    </button>

                    {openMenu && (
                        <div className="journey-card-menu" onClick={(event) => event.stopPropagation()}>
                            <button
                                type="button"
                                className="journey-card-menu__item"
                                onClick={() => {
                                    setOpenMenu(false);
                                    onEditJourney(journey);
                                }}
                            >
                                <FaEdit />
                                Modify
                            </button>

                            {onDeleteJourney && (
                                <button
                                    type="button"
                                    className="journey-card-menu__item journey-card-menu__item--danger"
                                    onClick={() => {
                                        setOpenMenu(false);
                                        onDeleteJourney(journey);
                                    }}
                                >
                                    <FaTrash />
                                    Delete
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="journey-card-content">
                <div className="journey-card-main">
                    <h3 className="journey-card-title">{journey.title}</h3>
                    {journey.note ? (
                        <p className="journey-card-note">{truncateText(journey.note, 110)}</p>
                    ) : (
                        <p className="journey-card-note journey-card-note--empty">No note added yet.</p>
                    )}
                </div>

                <div className="journey-card-meta">
                    <span className="journey-card-pill">
                        <FaCalendarAlt />
                        {dateDisplay || "No dates"}
                    </span>

                    <span className="journey-card-pill journey-card-pill--budget">
                        <FaMoneyBillWave />
                        {formatCurrency(journey.budget)}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default JourneyCard;
