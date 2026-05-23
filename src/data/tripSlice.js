import { createSlice } from "@reduxjs/toolkit";

// Load from localStorage if exists
const savedTrip = JSON.parse(localStorage.getItem("tripData"));

const initialState = savedTrip || {
  trips: [
    {
      tripName: "Da Nang Family Trip",
      budget: 12000000,
      itinerary: [
        { id: 1, title: "Flight to Da Nang", location: "Tan Son Nhat Airport", date: "2026-06-10", time: "08:00", category: "Transport", priority: "High", status: "Planned" },
        { id: 2, title: "Check-in at Hotel", location: "Vinpearl Condotel", date: "2026-06-10", time: "12:00", category: "Accommodation", priority: "High", status: "Planned" },
        { id: 3, title: "Visit Marble Mountains", location: "Hòa Hải, Ngũ Hành Sơn", date: "2026-06-11", time: "09:00", category: "Sightseeing", priority: "Medium", status: "Planned" },
        { id: 4, title: "Beach Time at My Khe", location: "My Khe Beach", date: "2026-06-11", time: "14:00", category: "Leisure", priority: "Low", status: "Planned" },
        { id: 5, title: "Dinner at Local Restaurant", location: "Bún Chả Cá Bà Lữ", date: "2026-06-11", time: "19:00", category: "Food", priority: "Medium", status: "Planned" }
      ],
      packingList: [
        { id: 1, name: "Passport / ID card", category: "Documents", quantity: 1, requiredStatus: "Required", packedStatus: "Packed" },
        { id: 2, name: "Flight tickets", category: "Documents", quantity: 1, requiredStatus: "Required", packedStatus: "Not Packed" },
        { id: 3, name: "Wallet / Cash / Cards", category: "Personal", quantity: 1, requiredStatus: "Required", packedStatus: "Not Packed" }
      ],
      budgetItems: [
        { id: 1, name: "Flight tickets", category: "Transport", estimatedCost: 4000000, actualCost: 4200000, paymentStatus: "Paid" },
        { id: 2, name: "Hotel Accommodation", category: "Accommodation", estimatedCost: 3500000, actualCost: 3600000, paymentStatus: "Paid" }
      ]
    },
    {
      tripName: "Hue Cultural Tour",
      budget: 10000000,
      itinerary: [
        { id: 1, title: "Flight to Hue", location: "Tan Son Nhat Airport", date: "2026-07-01", time: "08:00", category: "Transport", priority: "High", status: "Planned" },
        { id: 2, title: "Check-in at Hotel", location: "Pilgrimage Hotel", date: "2026-07-01", time: "12:00", category: "Accommodation", priority: "High", status: "Planned" },
        { id: 3, title: "Imperial City Tour", location: "Hue Citadel", date: "2026-07-01", time: "14:00", category: "Sightseeing", priority: "Medium", status: "Planned" }
      ],
      packingList: [
        { id: 1, name: "Passport / ID card", category: "Documents", quantity: 1, requiredStatus: "Required", packedStatus: "Not Packed" },
        { id: 2, name: "Camera", category: "Electronics", quantity: 1, requiredStatus: "Optional", packedStatus: "Not Packed" }
      ],
      budgetItems: [
        { id: 1, name: "Flight tickets", category: "Transport", estimatedCost: 4000000, actualCost: 4200000, paymentStatus: "Paid" },
        { id: 2, name: "Hotel Accommodation", category: "Accommodation", estimatedCost: 3000000, actualCost: 3000000, paymentStatus: "Paid" }
      ]
    },
    {
      tripName: "Hoi An Beach Trip",
      budget: 8000000,
      itinerary: [
        { id: 1, title: "Travel to Hoi An", location: "Da Nang Airport", date: "2026-08-05", time: "09:00", category: "Transport", priority: "High", status: "Planned" },
        { id: 2, title: "Check-in at Hotel", location: "Hoi An Riverside Hotel", date: "2026-08-05", time: "12:00", category: "Accommodation", priority: "High", status: "Planned" },
        { id: 3, title: "Explore Ancient Town", location: "Hoi An Ancient Town", date: "2026-08-05", time: "14:00", category: "Sightseeing", priority: "Medium", status: "Planned" }
      ],
      packingList: [
        { id: 1, name: "Passport / ID card", category: "Documents", quantity: 1, requiredStatus: "Required", packedStatus: "Not Packed" },
        { id: 2, name: "Sunglasses", category: "Personal", quantity: 1, requiredStatus: "Optional", packedStatus: "Not Packed" },
        { id: 3, name: "Sunglasses", category: "Personal", quantity: 1, requiredStatus: "Optional", packedStatus: "Not Packed" },
        { id: 4, name: "Sunglasses", category: "Personal", quantity: 1, requiredStatus: "Optional", packedStatus: "Not Packed" }
      ],
      budgetItems: [
        { id: 1, name: "Travel", category: "Transport", estimatedCost: 2000000, actualCost: 2100000, paymentStatus: "Paid" },
        { id: 2, name: "Hotel", category: "Accommodation", estimatedCost: 3000000, actualCost: 3000000, paymentStatus: "Paid" },
      ]
    },
    {
      tripName: "Nha Trang Adventure",
      budget: 15000000,
      itinerary: [
        { id: 1, title: "Flight to Nha Trang", location: "Tan Son Nhat Airport", date: "2026-09-10", time: "07:00", category: "Transport", priority: "High", status: "Planned" },
        { id: 2, title: "Check-in at Resort", location: "Nha Trang Beach Resort", date: "2026-09-10", time: "11:00", category: "Accommodation", priority: "High", status: "Planned" }
      ],
      packingList: [
        { id: 1, name: "Passport / ID card", category: "Documents", quantity: 1, requiredStatus: "Required", packedStatus: "Not Packed" },
        { id: 2, name: "Swimwear", category: "Clothes", quantity: 1, requiredStatus: "Optional", packedStatus: "Not Packed" }
      ],
      budgetItems: [
        { id: 1, name: "Flight tickets", category: "Transport", estimatedCost: 5000000, actualCost: 5200000, paymentStatus: "Paid" },
        { id: 2, name: "Resort Accommodation", category: "Accommodation", estimatedCost: 7000000, actualCost: 7200000, paymentStatus: "Paid" }
      ]
    },
    {
      tripName: "Phu Quoc Relaxation",
      budget: 20000000,
      itinerary: [
        { id: 1, title: "Flight to Phu Quoc", location: "Tan Son Nhat Airport", date: "2026-10-01", time: "06:00", category: "Transport", priority: "High", status: "Planned" },
        { id: 2, title: "Check-in at Resort", location: "Phu Quoc Ocean Resort", date: "2026-10-01", time: "10:00", category: "Accommodation", priority: "High", status: "Planned" }
      ],
      packingList: [
        { id: 1, name: "Passport / ID card", category: "Documents", quantity: 1, requiredStatus: "Required", packedStatus: "Not Packed" },
        { id: 2, name: "Sunscreen", category: "Personal", quantity: 1, requiredStatus: "Optional", packedStatus: "Not Packed" }
      ],
      budgetItems: [
        { id: 1, name: "Flight tickets", category: "Transport", estimatedCost: 6000000, actualCost: 6200000, paymentStatus: "Paid" },
        { id: 2, name: "Resort Accommodation", category: "Accommodation", estimatedCost: 10000000, actualCost: 10200000, paymentStatus: "Paid" }
      ]
    }
  ]
};

const tripSlice = createSlice({
  name: "trip",
  initialState,
  reducers: {
    addTrip: (state, action) => {
      state.trips.push(action.payload);
      localStorage.setItem("tripData", JSON.stringify(state));
    },

    updateTrip: (state, action) => {
      const { index, trip } = action.payload;

      if (index < 0 || index >= state.trips.length) {
        return;
      }

      state.trips[index] = trip;
      localStorage.setItem("tripData", JSON.stringify(state));
    },

    updateItinerary: (state, action) => {
      state.trips = action.payload;
      localStorage.setItem("tripData", JSON.stringify(state));
    },
    togglePackingItem: (state, action) => {
      const { tripIndex, itemId } = action.payload
      const list = state.trips[tripIndex].packingList
      const item = list.find(i => i.id === itemId)
      if (item) item.packedStatus = item.packedStatus === "Packed" ? "Not Packed" : "Packed"
      localStorage.setItem("tripData", JSON.stringify(state))
    },
    addPackingItem: (state, action) => {
      const { tripIndex, item } = action.payload
      state.trips[tripIndex].packingList.push(item)
      localStorage.setItem("tripData", JSON.stringify(state))
    },
    deletePackingItem: (state, action) => {
      const { tripIndex, itemId } = action.payload
      const list = state.trips[tripIndex].packingList
      state.trips[tripIndex].packingList = list.filter(i => i.id !== itemId)
      localStorage.setItem("tripData", JSON.stringify(state))
    },
    updatePackingItem: (state, action) => {
      const { tripIndex, item } = action.payload
      const list = state.trips[tripIndex].packingList
      const idx = list.findIndex(i => i.id === item.id)
      if (idx !== -1) list[idx] = item
      localStorage.setItem("tripData", JSON.stringify(state))
    },
  }
});

export const { addTrip, updateTrip, updateItinerary, markPackingItemPacked } = tripSlice.actions;
export const { 
  updateItinerary, 
  togglePackingItem,
  addPackingItem,
  deletePackingItem,
  updatePackingItem, } = tripSlice.actions;
export default tripSlice.reducer;