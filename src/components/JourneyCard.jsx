import { FaEdit, FaMapMarkerAlt } from "react-icons/fa";

import "../style/JourneyCard.css";

function JourneyCard({ journey, onClick, onEditJourney, active = false }) {
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

    return (
        <div className={`journey-card${active ? " active" : ""}`} onClick={onClick} role="button" tabIndex={0}>
            <button
                type="button"
                className="journey-edit-btn"
                onClick={(event) => {
                    event.stopPropagation();
                    onEditJourney(journey);
                }}
            >
                <FaEdit />
            </button>

            <div className="journey-thumbnail-wrapper">
                {journey.thumbnail ? (
                    <img src={journey.thumbnail} alt={journey.title} className="journey-thumbnail" />
                ) : (
                    <div className="journey-thumbnail-default">
                        <FaMapMarkerAlt />
                    </div>
                )}
            </div>

            <div className="journey-card-content">
                <h3 className="journey-card-title">{journey.title}</h3>

                {journey.startDate && journey.endDate && (
                    <p className="journey-card-date">
                        {formatDate(journey.startDate)} - {formatDate(journey.endDate)}
                    </p>
                )}

                {journey.note && <p className="journey-card-note">{truncateText(journey.note, 80)}</p>}

                {journey.budget > 0 && <p className="journey-card-budget">Budget: {formatCurrency(journey.budget)}</p>}
            </div>
        </div>
    );
}

export default JourneyCard;