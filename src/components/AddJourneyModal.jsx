import { useState } from "react";
import { FaTimes } from "react-icons/fa";

import { fileToBase64 } from "../utils/fileUtils";
import "../style/AddJourneyModal.css";

export default function AddJourneyModal({
    onClose,
    onCreate,
    mode = "create",
    initialJourney = null,
}) {
    const [title, setTitle] = useState(initialJourney?.title || "");
    const [budget, setBudget] = useState(
        initialJourney?.budget ? Number(initialJourney.budget).toLocaleString("en-US") : ""
    );
    const [startDate, setStartDate] = useState(initialJourney?.startDate || "");
    const [endDate, setEndDate] = useState(initialJourney?.endDate || "");
    const [note, setNote] = useState(initialJourney?.note || "");
    const [thumbnailPreview, setThumbnailPreview] = useState(initialJourney?.thumbnail || null);
    const [error, setError] = useState("");

    const formatBudget = (value) => {
        const numbersOnly = value.replace(/\D/g, "");

        if (!numbersOnly) return "";

        return Number(numbersOnly).toLocaleString("en-US");
    };

    const handleThumbnailChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const base64 = await fileToBase64(file);

        setThumbnailPreview(base64);
    };

    const handleCreate = () => {
        setError("");

        if (!title.trim()) {
            setError("Trip Title is required");
            return;
        }

        onCreate({
            title: title.trim(),
            budget: budget ? parseFloat(budget.replace(/,/g, "")) : 0,
            startDate,
            endDate,
            note: note.trim(),
            thumbnail: thumbnailPreview,
        });

        setTitle("");
        setBudget("");
        setStartDate("");
        setEndDate("");
        setNote("");
        setThumbnailPreview(null);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <button type="button" className="modal-close" onClick={onClose}>
                    <FaTimes />
                </button>

                <h2>{mode === "edit" ? "Edit Journey" : "Add New Journey"}</h2>

                {error && <div className="modal-error">{error}</div>}

                <div className="modal-form">
                    <div className="form-group">
                        <label>Trip Title</label>
                        <input
                            type="text"
                            placeholder="Enter trip title"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Total Budget</label>

                        <div className="budget-input-wrapper">
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="1,000,000"
                                value={budget}
                                onChange={(event) => setBudget(formatBudget(event.target.value))}
                            />

                            <span className="budget-currency">VNĐ</span>
                        </div>
                    </div>

                    <div className="modal-row">
                        <div className="form-group">
                            <label>Start Date</label>
                            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
                        </div>

                        <div className="form-group">
                            <label>End Date</label>
                            <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Note</label>
                        <textarea rows="5" placeholder="Enter note" value={note} onChange={(event) => setNote(event.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Thumbnail</label>
                        <label className="upload-minimal">
                            <input type="file" accept="image/*" onChange={handleThumbnailChange} />
                            {thumbnailPreview ? (
                                <img src={thumbnailPreview} alt="preview" className="thumbnail-preview" />
                            ) : (
                                <>
                                    <div className="upload-minimal-icon">＋</div>
                                    <div className="upload-minimal-text">Upload thumbnail</div>
                                </>
                            )}
                        </label>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>

                        <button type="button" className="create-btn" onClick={handleCreate}>
                            {mode === "edit" ? "Save Changes" : "Create"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}