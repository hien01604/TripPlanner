import { useState } from "react";
import { FaTimes } from "react-icons/fa";

import { fileToBase64 } from "../../utils/fileUtils";
import "../../style/AddJourneyModal.css";

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
    const [errors, setErrors] = useState({});

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

    const clearError = (fieldName) => {
        setErrors((currentErrors) => {
            const { [fieldName]: _, ...remainingErrors } = currentErrors;
            return remainingErrors;
        });
    };

    const handleCreate = () => {
        const nextErrors = {};
        const trimmedTitle = title.trim();
        const numericBudgetText = budget.replace(/,/g, "").trim();
        const parsedBudget = numericBudgetText ? Number(numericBudgetText) : NaN;
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (!trimmedTitle) {
            nextErrors.title = "Trip title is required.";
        }

        if (!numericBudgetText) {
            nextErrors.budget = "Total budget is required.";
        } else if (!Number.isFinite(parsedBudget)) {
            nextErrors.budget = "Total budget must be a valid number.";
        } else if (parsedBudget < 0) {
            nextErrors.budget = "Total budget cannot be negative.";
        }

        if (!startDate) {
            nextErrors.startDate = "Start date is required.";
        } else if (Number.isNaN(start?.getTime())) {
            nextErrors.startDate = "Start date is invalid.";
        }

        if (!endDate) {
            nextErrors.endDate = "End date is required.";
        } else if (Number.isNaN(end?.getTime())) {
            nextErrors.endDate = "End date is invalid.";
        }

        if (start && end && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end < start) {
            nextErrors.endDate = "End date must be on or after the start date.";
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        setErrors({});

        onCreate({
            title: trimmedTitle,
            budget: Number(parsedBudget),
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

                {Object.keys(errors).length > 0 && (
                    <div className="modal-error" role="alert" aria-live="polite">
                        <strong>Please fix the highlighted fields.</strong>
                    </div>
                )}

                <div className="modal-form">
                    <div className={`form-group${errors.title ? " form-group--error" : ""}`}>
                        <label>Trip Title <span className="required-mark">*</span></label>
                        <input
                            type="text"
                            placeholder="Enter trip title"
                            value={title}
                            onChange={(event) => {
                                setTitle(event.target.value);
                                clearError("title");
                            }}
                        />
                        {errors.title && <p className="field-error">{errors.title}</p>}
                    </div>

                    <div className={`form-group${errors.budget ? " form-group--error" : ""}`}>
                        <label>Total Budget <span className="required-mark">*</span></label>

                        <div className="budget-input-wrapper">
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="1,000,000"
                                value={budget}
                                onChange={(event) => {
                                    setBudget(formatBudget(event.target.value));
                                    clearError("budget");
                                }}
                            />

                            <span className="budget-currency">VNĐ</span>
                        </div>
                        {errors.budget && <p className="field-error">{errors.budget}</p>}
                    </div>

                    <div className="modal-row">
                        <div className={`form-group${errors.startDate ? " form-group--error" : ""}`}>
                            <label>Start Date <span className="required-mark">*</span></label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(event) => {
                                    setStartDate(event.target.value);
                                    clearError("startDate");
                                }}
                            />
                            {errors.startDate && <p className="field-error">{errors.startDate}</p>}
                        </div>

                        <div className={`form-group${errors.endDate ? " form-group--error" : ""}`}>
                            <label>End Date <span className="required-mark">*</span></label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(event) => {
                                    setEndDate(event.target.value);
                                    clearError("endDate");
                                }}
                            />
                            {errors.endDate && <p className="field-error">{errors.endDate}</p>}
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