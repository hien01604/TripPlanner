import mockTrips from "../data/journeys"

const STORAGE_KEY = "journeys"

export const getJourneys = () => {
    const saved = localStorage.getItem(STORAGE_KEY)

    const localJourneys = saved
        ? JSON.parse(saved)
        : []

    return [...mockTrips, ...localJourneys]
}

export const saveJourneys = (journeys) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(journeys))
}

export const createJourney = (journeys, journey) => {
    const newJourney = {
        ...journey,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        itinerary: [],
        packingList: [],
        budgetItems: [],
    }

    const updatedJourneys = [...journeys, newJourney]
    saveJourneys(updatedJourneys)

    return updatedJourneys
}

export const updateJourney = (journeys, updatedJourney) => {
    const updatedJourneys = journeys.map((journey) =>
        journey.id === updatedJourney.id
            ? { ...journey, ...updatedJourney }
            : journey,
    )

    saveJourneys(updatedJourneys)

    return updatedJourneys
}

export const deleteJourney = (journeys, journeyId) => {
    const updatedJourneys = journeys.filter((journey) => journey.id !== journeyId)
    saveJourneys(updatedJourneys)
    return updatedJourneys
}