import { createSlice } from "@reduxjs/toolkit";

// Load from localStorage if exists (safe parse)
let savedTrip = null;
try {
  const raw = localStorage.getItem("tripData");
  if (raw) savedTrip = JSON.parse(raw);
} catch {
  savedTrip = null;
}

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
        { id: 2, name: "Hotel", category: "Accommodation", estimatedCost: 3000000, actualCost: 3000000, paymentStatus: "Paid" }
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
    // record a snapshot of current trips into localStorage history for undo
    _recordHistory: (state) => { },



    addTrip: (state, action) => {
      try {
        const raw = localStorage.getItem("tripData_history");
        const history = raw ? JSON.parse(raw) : [];
        history.push({ trips: JSON.parse(JSON.stringify(state.trips)) });
        if (history.length > 50) history.shift();
        localStorage.setItem("tripData_history", JSON.stringify(history));
      } catch { }
      state.trips.push(action.payload);
      localStorage.setItem("tripData", JSON.stringify(state));
    },

    updateTrip: (state, action) => {
      try {
        const raw = localStorage.getItem("tripData_history");
        const history = raw ? JSON.parse(raw) : [];
        history.push({ trips: JSON.parse(JSON.stringify(state.trips)) });
        if (history.length > 50) history.shift();
        localStorage.setItem("tripData_history", JSON.stringify(history));
      } catch { }
      const { index, trip } = action.payload;

      if (index < 0 || index >= state.trips.length) return;

      state.trips[index] = trip;
      localStorage.setItem("tripData", JSON.stringify(state));
    },

    updateItinerary: (state, action) => {
      try {
        const raw = localStorage.getItem("tripData_history");
        const history = raw ? JSON.parse(raw) : [];
        history.push({ trips: JSON.parse(JSON.stringify(state.trips)) });
        if (history.length > 50) history.shift();
        localStorage.setItem("tripData_history", JSON.stringify(history));
      } catch { }
      state.trips = action.payload;
      localStorage.setItem("tripData", JSON.stringify(state));
    },

    saveActivity: (state, action) => {
      try {
        const raw = localStorage.getItem("tripData_history");
        const history = raw ? JSON.parse(raw) : [];
        history.push({ trips: JSON.parse(JSON.stringify(state.trips)) });
        if (history.length > 50) history.shift();
        localStorage.setItem("tripData_history", JSON.stringify(history));
      } catch { }
      const { tripIndex, activity } = action.payload;
      const trip = state.trips[tripIndex];

      if (!trip) return;

      if (!trip.itinerary) {
        trip.itinerary = [];
      }

      const activityToSave = {
        ...activity,
        id: activity.id || Date.now(),
      };

      const activityIndex = trip.itinerary.findIndex(
        item => item.id === activityToSave.id
      );

      if (activityIndex >= 0) {
        trip.itinerary[activityIndex] = activityToSave;
      } else {
        trip.itinerary.push(activityToSave);
      }

      localStorage.setItem("tripData", JSON.stringify(state));
    },

    deleteActivity: (state, action) => {
      try {
        const raw = localStorage.getItem("tripData_history");
        const history = raw ? JSON.parse(raw) : [];
        history.push({ trips: JSON.parse(JSON.stringify(state.trips)) });
        if (history.length > 50) history.shift();
        localStorage.setItem("tripData_history", JSON.stringify(history));
      } catch { }
      const { tripIndex, activityId } = action.payload;
      const trip = state.trips[tripIndex];

      if (!trip?.itinerary) return;

      trip.itinerary = trip.itinerary.filter(
        activity => activity.id !== activityId
      );

      localStorage.setItem("tripData", JSON.stringify(state));
    },

    changeActivityStatus: (state, action) => {
      try {
        const raw = localStorage.getItem("tripData_history");
        const history = raw ? JSON.parse(raw) : [];
        history.push({ trips: JSON.parse(JSON.stringify(state.trips)) });
        if (history.length > 50) history.shift();
        localStorage.setItem("tripData_history", JSON.stringify(history));
      } catch { }
      const { tripIndex, activityId } = action.payload;
      const statusFlow = ["Planned", "In Progress", "Done"];
      const activity = state.trips[tripIndex]?.itinerary?.find(
        item => item.id === activityId
      );

      if (!activity) return;

      const currentIndex = statusFlow.indexOf(activity.status);
      activity.status = statusFlow[(currentIndex + 1) % statusFlow.length];

      localStorage.setItem("tripData", JSON.stringify(state));
    },

    togglePackingItem: (state, action) => {
      try {
        const raw = localStorage.getItem("tripData_history");
        const history = raw ? JSON.parse(raw) : [];
        history.push({ trips: JSON.parse(JSON.stringify(state.trips)) });
        if (history.length > 50) history.shift();
        localStorage.setItem("tripData_history", JSON.stringify(history));
      } catch { }
      const { tripIndex, itemId } = action.payload;
      const item = state.trips[tripIndex]?.packingList?.find(
        item => item.id === itemId
      );

      if (!item) return;

      item.packedStatus =
        item.packedStatus === "Packed" ? "Not Packed" : "Packed";

      localStorage.setItem("tripData", JSON.stringify(state));
    },

    addPackingItem: (state, action) => {
      try {
        const raw = localStorage.getItem("tripData_history");
        const history = raw ? JSON.parse(raw) : [];
        history.push({ trips: JSON.parse(JSON.stringify(state.trips)) });
        if (history.length > 50) history.shift();
        localStorage.setItem("tripData_history", JSON.stringify(history));
      } catch { }
      const { tripIndex, item } = action.payload;

      if (!state.trips[tripIndex].packingList) {
        state.trips[tripIndex].packingList = [];
      }

      state.trips[tripIndex].packingList.push(item);
      localStorage.setItem("tripData", JSON.stringify(state));
    },

    deletePackingItem: (state, action) => {
      try {
        const raw = localStorage.getItem("tripData_history");
        const history = raw ? JSON.parse(raw) : [];
        history.push({ trips: JSON.parse(JSON.stringify(state.trips)) });
        if (history.length > 50) history.shift();
        localStorage.setItem("tripData_history", JSON.stringify(history));
      } catch { }
      const { tripIndex, itemId } = action.payload;
      const trip = state.trips[tripIndex];

      if (!trip) return;

      trip.packingList = trip.packingList.filter(
        item => item.id !== itemId
      );

      localStorage.setItem("tripData", JSON.stringify(state));
    },

    updatePackingItem: (state, action) => {
      try {
        const raw = localStorage.getItem("tripData_history");
        const history = raw ? JSON.parse(raw) : [];
        history.push({ trips: JSON.parse(JSON.stringify(state.trips)) });
        if (history.length > 50) history.shift();
        localStorage.setItem("tripData_history", JSON.stringify(history));
      } catch { }
      const { tripIndex, item } = action.payload;
      const list = state.trips[tripIndex]?.packingList;

      if (!list) return;

      const index = list.findIndex(i => i.id === item.id);

      if (index !== -1) {
        list[index] = item;
      }

      localStorage.setItem("tripData", JSON.stringify(state));
    },

    updateTripBudget: (state, action) => {
      try {
        const raw = localStorage.getItem("tripData_history");
        const history = raw ? JSON.parse(raw) : [];
        history.push({ trips: JSON.parse(JSON.stringify(state.trips)) });
        if (history.length > 50) history.shift();
        localStorage.setItem("tripData_history", JSON.stringify(history));
      } catch { }
      const { tripIndex, newBudget } = action.payload;

      if (!state.trips[tripIndex]) return;

      state.trips[tripIndex].budget = newBudget;
      localStorage.setItem("tripData", JSON.stringify(state));
    },

    addBudgetItem: (state, action) => {
      try {
        const raw = localStorage.getItem("tripData_history");
        const history = raw ? JSON.parse(raw) : [];
        history.push({ trips: JSON.parse(JSON.stringify(state.trips)) });
        if (history.length > 50) history.shift();
        localStorage.setItem("tripData_history", JSON.stringify(history));
      } catch { }
      const { tripIndex, newItem } = action.payload;

      if (!state.trips[tripIndex]) return;

      if (!state.trips[tripIndex].budgetItems) {
        state.trips[tripIndex].budgetItems = [];
      }

      state.trips[tripIndex].budgetItems.push(newItem);
      localStorage.setItem("tripData", JSON.stringify(state));
    },

    updateBudgetItem: (state, action) => {
      try {
        const raw = localStorage.getItem("tripData_history");
        const history = raw ? JSON.parse(raw) : [];
        history.push({ trips: JSON.parse(JSON.stringify(state.trips)) });
        if (history.length > 50) history.shift();
        localStorage.setItem("tripData_history", JSON.stringify(history));
      } catch { }
      const { tripIndex, itemId, changes } = action.payload;
      const trip = state.trips[tripIndex];

      if (!trip) return;

      const item = trip.budgetItems.find(item => item.id === itemId);

      if (!item) return;

      Object.assign(item, changes);
      localStorage.setItem("tripData", JSON.stringify(state));
    },

    deleteBudgetItem: (state, action) => {
      try {
        const raw = localStorage.getItem("tripData_history");
        const history = raw ? JSON.parse(raw) : [];
        history.push({ trips: JSON.parse(JSON.stringify(state.trips)) });
        if (history.length > 50) history.shift();
        localStorage.setItem("tripData_history", JSON.stringify(history));
      } catch { }
      const { tripIndex, itemId } = action.payload;
      const trip = state.trips[tripIndex];

      if (!trip) return;

      trip.budgetItems = trip.budgetItems.filter(
        item => item.id !== itemId
      );

      localStorage.setItem("tripData", JSON.stringify(state));
    }
    ,
    deleteTrip: (state, action) => {
      const index = action.payload;
      try {
        const raw = localStorage.getItem("tripData_history");
        const history = raw ? JSON.parse(raw) : [];
        history.push({ trips: JSON.parse(JSON.stringify(state.trips)) });
        if (history.length > 50) history.shift();
        localStorage.setItem("tripData_history", JSON.stringify(history));
      } catch { }
      if (typeof index !== 'number') return;
      if (index < 0 || index >= state.trips.length) return;

      state.trips.splice(index, 1);
      localStorage.setItem("tripData", JSON.stringify(state));
    }
    ,
    undoTripData: (state) => {
      try {
        const raw = localStorage.getItem("tripData_history");
        if (!raw) return;
        const history = JSON.parse(raw);
        if (!Array.isArray(history) || history.length === 0) return;
        const last = history[history.length - 1];
        if (last && Array.isArray(last.trips)) {
          state.trips = JSON.parse(JSON.stringify(last.trips));
          const nextHistory = history.slice(0, -1);
          localStorage.setItem("tripData_history", JSON.stringify(nextHistory));
          localStorage.setItem("tripData", JSON.stringify({ trips: state.trips }));
        }
      } catch {
        // ignore parse errors
      }
    }
  }
});

export const {
  addTrip,
  updateTrip,
  updateItinerary,
  saveActivity,
  deleteActivity,
  changeActivityStatus,
  togglePackingItem,
  addPackingItem,
  deletePackingItem,
  updatePackingItem,
  updateTripBudget,
  addBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
  deleteTrip,
  undoTripData,
} = tripSlice.actions;

export default tripSlice.reducer;
