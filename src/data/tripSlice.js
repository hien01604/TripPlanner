import { createSlice } from "@reduxjs/toolkit";

// Load from localStorage if exists
const savedTrip = JSON.parse(localStorage.getItem("tripData"));

const initialState = savedTrip || {
  tripName: "Da Nang Family Trip",
  budget: 12000000,
  itinerary: [
    {
      id: 1,
      title: "Flight to Da Nang",
      location: "Tan Son Nhat Airport",
      date: "2026-06-10",
      time: "08:00",
      category: "Transport",
      priority: "High",
      status: "Planned"
    },
    {
      id: 2,
      title: "Check-in at Hotel",
      location: "Vinpearl Condotel",
      date: "2026-06-10",
      time: "12:00",
      category: "Accommodation",
      priority: "High",
      status: "Planned"
    },
    {
      id: 3,
      title: "Visit Marble Mountains",
      location: "Hòa Hải, Ngũ Hành Sơn",
      date: "2026-06-11",
      time: "09:00",
      category: "Sightseeing",
      priority: "Medium",
      status: "Planned"
    },
    {
      id: 4,
      title: "Beach Time at My Khe",
      location: "My Khe Beach",
      date: "2026-06-11",
      time: "14:00",
      category: "Leisure",
      priority: "Low",
      status: "Planned"
    },
    {
      id: 5,
      title: "Dinner at Local Restaurant",
      location: "Bún Chả Cá Bà Lữ",
      date: "2026-06-11",
      time: "19:00",
      category: "Food",
      priority: "Medium",
      status: "Planned"
    },
    {
      id: 6,
      title: "City Tour & Souvenir Shopping",
      location: "Han Market",
      date: "2026-06-12",
      time: "10:00",
      category: "Shopping",
      priority: "Medium",
      status: "Planned"
    },
    {
      id: 7,
      title: "Flight Back Home",
      location: "Da Nang Airport",
      date: "2026-06-15",
      time: "16:00",
      category: "Transport",
      priority: "High",
      status: "Planned"
    }
  ],
  packingList: [
    {
      id: 1,
      name: "Passport / ID card",
      category: "Documents",
      quantity: 1,
      requiredStatus: "Required",
      packedStatus: "Not Packed"
    },
    {
      id: 2,
      name: "Flight tickets",
      category: "Documents",
      quantity: 1,
      requiredStatus: "Required",
      packedStatus: "Not Packed"
    },
    {
      id: 3,
      name: "Wallet / Cash / Cards",
      category: "Personal",
      quantity: 1,
      requiredStatus: "Required",
      packedStatus: "Not Packed"
    },
    {
      id: 4,
      name: "Phone & Charger",
      category: "Electronics",
      quantity: 1,
      requiredStatus: "Required",
      packedStatus: "Not Packed"
    },
    {
      id: 5,
      name: "Sunglasses",
      category: "Personal",
      quantity: 1,
      requiredStatus: "Optional",
      packedStatus: "Not Packed"
    },
    {
      id: 6,
      name: "Clothes (3 days)",
      category: "Clothes",
      quantity: 3,
      requiredStatus: "Required",
      packedStatus: "Not Packed"
    },
    {
      id: 7,
      name: "Swimwear",
      category: "Clothes",
      quantity: 1,
      requiredStatus: "Optional",
      packedStatus: "Not Packed"
    },
    {
      id: 8,
      name: "Toiletries Kit",
      category: "Personal",
      quantity: 1,
      requiredStatus: "Required",
      packedStatus: "Not Packed"
    }
  ],
  budgetItems: [
    {
      id: 1,
      name: "Flight tickets",
      category: "Transport",
      estimatedCost: 4000000,
      actualCost: 4200000,
      paymentStatus: "Paid"
    },
    {
      id: 2,
      name: "Hotel Accommodation",
      category: "Accommodation",
      estimatedCost: 3500000,
      actualCost: 3600000,
      paymentStatus: "Paid"
    },
    {
      id: 3,
      name: "Food & Dining",
      category: "Food",
      estimatedCost: 2000000,
      actualCost: 1800000,
      paymentStatus: "Pending"
    },
    {
      id: 4,
      name: "Sightseeing & Tickets",
      category: "Entertainment",
      estimatedCost: 1500000,
      actualCost: 1600000,
      paymentStatus: "Paid"
    },
    {
      id: 5,
      name: "Souvenirs / Shopping",
      category: "Shopping",
      estimatedCost: 1000000,
      actualCost: 950000,
      paymentStatus: "Pending"
    }
  ]
};

const tripSlice = createSlice({
  name: "trip",
  initialState,
  reducers: {
    updateItinerary: (state, action) => {
      state.itinerary = action.payload;
      localStorage.setItem("tripData", JSON.stringify(state));
    },
    updatePackingList: (state, action) => {
      state.packingList = action.payload;
      localStorage.setItem("tripData", JSON.stringify(state));
    },
    updateBudgetItems: (state, action) => {
      state.budgetItems = action.payload;
      localStorage.setItem("tripData", JSON.stringify(state));
    },
    markPackingItemPacked: (state, action) => {
      const updatedList = state.packingList.map(item =>
        item.id === action.payload ? { ...item, packedStatus: "Packed" } : item
      );
      state.packingList = updatedList;
      localStorage.setItem("tripData", JSON.stringify(state));
    }
  }
});

export const { updateItinerary, updatePackingList, updateBudgetItems, markPackingItemPacked } = tripSlice.actions;
export default tripSlice.reducer;