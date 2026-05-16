import React, { useEffect, useState } from "react"
import { FaTimes } from "react-icons/fa"
import { fileToBase64 } from "../utils/fileUtils"
import "../style/AddJourneyModal.css"

export default function AddJourneyModal({
    onClose,
    onCreate,
    mode = "create",
    initialJourney = null,
}) {
    const [title, setTitle] = useState("")
    const [budget, setBudget] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [note, setNote] = useState("")
    const [thumbnail, setThumbnail] = useState(null)
    const [thumbnailPreview, setThumbnailPreview] = useState(null)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!initialJourney) {
            setTitle("")
            setBudget("")
            setStartDate("")
            setEndDate("")
            setNote("")
            setThumbnail(null)
            setThumbnailPreview(null)
            setError("")
            return
        }

        setTitle(initialJourney.title || "")
        setBudget(
            initialJourney.budget
                ? Number(initialJourney.budget).toLocaleString("en-US")
                : "",
        )
        setStartDate(initialJourney.startDate || "")
        setEndDate(initialJourney.endDate || "")
        setNote(initialJourney.note || "")
        setThumbnail(initialJourney.thumbnail || null)
        setThumbnailPreview(initialJourney.thumbnail || null)
        setError("")
    }, [initialJourney])

    const formatBudget = (value) => {
        const numbersOnly = value.replace(/\D/g, "")

        if (!numbersOnly) return ""

        return Number(numbersOnly).toLocaleString("en-US")
    }
    const handleThumbnailChange = async (e) => {
        const file = e.target.files?.[0]

        if (!file) return

        const base64 = await fileToBase64(file)

        setThumbnail(base64)
        setThumbnailPreview(base64)
    }

    const handleCreate = () => {
        setError("")

        if (!title.trim()) {
            setError("Trip Title is required")
            return
        }

        onCreate({
            title: title.trim(),
            budget: budget
                ? parseFloat(
                    budget.replace(/,/g, "")
                )
                : 0, startDate,
            endDate,
            note: note.trim(),
            thumbnail: thumbnailPreview,
        })

        setTitle("")
        setBudget("")
        setStartDate("")
        setEndDate("")
        setNote("")
        setThumbnail(null)
        setThumbnailPreview(null)
    }

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <button className="modal-close" onClick={onClose}>
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
                            onChange={(e) => setTitle(e.target.value)}
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
                                onChange={(e) =>
                                    setBudget(
                                        formatBudget(e.target.value)
                                    )
                                }
                            />

                            <span className="budget-currency">
                                VNĐ
                            </span>
                        </div>
                    </div>

                    <div className="modal-row">
                        <div className="form-group">
                            <label>Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Note</label>
                        <textarea
                            rows="5"
                            placeholder="Enter note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Thumbnail</label>
                        <label className="upload-minimal">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                            />
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
                        <button className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>

                        <button className="create-btn" onClick={handleCreate}>
                            {mode === "edit" ? "Save Changes" : "Create"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}