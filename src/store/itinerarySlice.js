import { createSlice } from "@reduxjs/toolkit";
import { LAST_MODIFIED_KEY, STORAGE_KEY } from "../data/itineraryUtils";

const loadActivities = () => {
  const savedActivities = localStorage.getItem(STORAGE_KEY);

  if (!savedActivities) {
    return [];
  }

  try {
    return JSON.parse(savedActivities);
  } catch {
    return [];
  }
};

const initialState = {
  activities: loadActivities(),
  lastModified: localStorage.getItem(LAST_MODIFIED_KEY) || new Date().toISOString(),
};

const itinerarySlice = createSlice({
  name: "itinerary",
  initialState,
  reducers: {
    saveActivity: {
      reducer: (state, action) => {
        const { activity, lastModified } = action.payload;
        const existingIndex = state.activities.findIndex(
          (item) => item.id === activity.id
        );

        if (existingIndex >= 0) {
          state.activities[existingIndex] = activity;
        } else {
          state.activities.push(activity);
        }

        state.lastModified = lastModified;
      },
      prepare: (activity) => ({
        payload: {
          activity: {
            ...activity,
            id: activity.id || Date.now(),
          },
          lastModified: new Date().toISOString(),
        },
      }),
    },
    deleteActivity: {
      reducer: (state, action) => {
        state.activities = state.activities.filter(
          (activity) => activity.id !== action.payload.activityId
        );
        state.lastModified = action.payload.lastModified;
      },
      prepare: (activityId) => ({
        payload: {
          activityId,
          lastModified: new Date().toISOString(),
        },
      }),
    },
    changeActivityStatus: {
      reducer: (state, action) => {
        const statusFlow = ["Planned", "In Progress", "Done"];
        const activity = state.activities.find(
          (item) => item.id === action.payload.activityId
        );

        if (!activity) return;

        const currentIndex = statusFlow.indexOf(activity.status);
        activity.status = statusFlow[(currentIndex + 1) % statusFlow.length];
        state.lastModified = action.payload.lastModified;
      },
      prepare: (activityId) => ({
        payload: {
          activityId,
          lastModified: new Date().toISOString(),
        },
      }),
    },
  },
});

export const { changeActivityStatus, deleteActivity, saveActivity } =
  itinerarySlice.actions;

export const selectActivities = (state) => state.itinerary.activities;
export const selectLastModified = (state) => state.itinerary.lastModified;

export default itinerarySlice.reducer;
