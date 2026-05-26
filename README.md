<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?logo=redux&logoColor=white" alt="Redux Toolkit" />


# ✈️ TripPlanner — OutOfOffice_WeCamp Batch 10 

> **Plan destinations, organize activities, track expenses, and pack smarter — all in one place.**

TripPlanner is a application for managing travel planning. It provides a unified dashboard to create journeys, build day-by-day itineraries, manage packing checklists, and track trip budgets.


## Features

| Module | Capabilities |
|---|---|
| **Journey Management** | Create / edit / delete trips with thumbnail, budget, dates, and notes. Search & filter from a resizable sidebar. |
| **Dashboard** | Progress rings (itinerary, packing, budget, unpaid, overdue), mini calendar, day timeline, packing progress bars, budget bar chart & overview. |
| **Itinerary** | Day-by-day activity timeline. Add / edit / delete activities. Filter by month, category, status, priority. Status cycling (Planned → In Progress → Done).|
| **Packing** | Category sidebar, add / edit / delete items, toggle packed status, search + filter by status/type, progress stats. Duplicate prevention. |
| **Budget** | Expense table with inline editing. Summary with used/remaining percentage. 80% budget warning. Category spending doughnut chart. |
| **Global** | Undo, breadcrumb navigation, collapsible sidebars, smooth scroll on page change. |]

---


## Tech Stack

| Layer | Technology | 
|---|---|
| UI Library | React 
| Build Tool | Vite 
| State Management | Redux Toolkit + React-Redux 
| Charts | Recharts 
| Charts (Budget) | Chart.js + react-chartjs-2 
| Styling | Vanilla CSS 
| Linting | ESLint 


## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd TripPlanner
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### 4. Build for production (optional)

```bash
npm run build
```

The optimized output will be generated in the `dist/` directory.

### 5. Preview the production build

```bash
npm run preview
```

---

##  Project Structure

```
TripPlanner/
├── index.html                    # HTML entry point
├── vite.config.js                # Vite configuration
├── package.json                  # Dependencies & scripts
│
├── src/
│   ├── main.jsx                  # App bootstrap (Redux Provider + React root)
│   ├── App.jsx                   # Root component (page routing via state)
│   ├── App.css                   # Global styles
│   │
│   ├── data/                     # State management layer
│   │   ├── index.js              # Redux store configuration
│   │   ├── tripSlice.js          # Redux slice (all actions & reducers)
│   │   └── itineraryUtils.js     # Date, time, and itinerary helper functions
│   │
│   ├── services/
│   │   └── budgetService.js      # Budget calculation logic
│   │
│   ├── utils/
│   │   └── fileUtils.js          # File-to-Base64 conversion utility
│   │
│   ├── pages/                    # Top-level page components
│   │   ├── Dashboard.jsx         # Dashboard with stats, charts, calendar, timeline
│   │   ├── Itinerary.jsx         # Day-by-day itinerary planner
│   │   ├── Packing.jsx           # Packing checklist manager
│   │   ├── Budget.jsx            # Budget & expense tracker
│   │   └── JourneyManagement.jsx # Journey CRUD hub (landing page)
│   │
│   ├── components/               # Reusable UI components
│   │   ├── TripPlanner.jsx       # Shell layout (navbar + sidebars + content)
│   │   ├── JourneySidebar.jsx    # Left sidebar (journey list + search + resize)
│   │   ├── PlanningSidebar.jsx   # Secondary sidebar (page navigation)
│   │   ├── BreadCrumb.jsx        # Breadcrumb navigation
│   │   │
│   │   ├── journey/              # Journey-specific components
│   │   │   ├── AddJourneyModal.jsx
│   │   │   ├── JourneyCard.jsx
│   │   │   └── MessageBox.jsx
│   │   │
│   │   ├── itinerary/            # Itinerary-specific components
│   │   │   ├── ActivityModal.jsx
│   │   │   ├── ActivityTimeline.jsx
│   │   │   ├── DaySection.jsx
│   │   │   ├── DaysStrip.jsx
│   │   │   ├── ItineraryHeader.jsx
│   │   │   ├── ItineraryToolbar.jsx
│   │   │   └── ItineraryTopbar.jsx
│   │   │
│   │   ├── packing/              # Packing-specific components
│   │   │   ├── CategorySidebar.jsx
│   │   │   ├── Filterbar.jsx
│   │   │   ├── ItemModal.jsx
│   │   │   ├── LastModifiedLine.jsx
│   │   │   ├── PackingTable.jsx
│   │   │   └── ProgressSection.jsx
│   │   │
│   │   └── budget/               # Budget-specific components
│   │       ├── AddDialog.jsx
│   │       ├── BudgetCategoryChartData.jsx
│   │       └── BudgetTable.jsx
│   │
│   ├── style/                    # CSS modules (one per component)
│   │   ├── Dashboard.css
│   │   ├── JourneySidebar.css
│   │   ├── JourneyManagement.css
│   │   ├── JourneyCard.css
│   │   ├── AddJourneyModal.css
│   │   ├── MessageBox.css
│   │   ├── Itinerary.css
│   │   ├── Budget.css
│   │   ├── Packing.css
│   │   ├── PackingTable.css
│   │   ├── CategorySidebar.css
│   │   ├── Filterbar.css
│   │   ├── ItemModal.css
│   │   ├── ProgressSection.css
│   │   ├── PlanningSidebar.css
│   │   ├── BreadCrumb.css
│   │   └── itinerary/            # Itinerary sub-component styles
│   │
│   └── assets/                   # Static assets (images, etc.)
│
└── dist/                         # Production build output
```

## State Structure (Redux)

Single Redux slice (`trip`) with all data in one store:

```
store.trip.trips[]  →  Array of Trip objects
```

### Trip Object

```
Trip
├── tripName        string        Display name
├── budget          number        Total budget
├── startDate       string?       "YYYY-MM-DD"
├── endDate         string?       "YYYY-MM-DD"
├── note            string?       Free-text notes
├── thumbnail       string?       Base64 image
│
├── itinerary[]     Activity
│   ├── id          number        Unique ID (Date.now)
│   ├── title       string
│   ├── location    string
│   ├── date        string        "YYYY-MM-DD"
│   ├── time        string        "HH:MM"
│   ├── category    string        Transport | Food | Sightseeing | Shopping | Hotel | Other
│   ├── priority    string        Low | Medium | High
│   └── status      string        Planned | In Progress | Done
│
├── packingList[]   PackingItem
│   ├── id          number
│   ├── name        string
│   ├── category    string        Clothes | Documents | Electronics | Medicine | Personal | Other
│   ├── quantity    number
│   ├── requiredStatus  string    Required | Optional
│   └── packedStatus    string    Packed | Not Packed
│
└── budgetItems[]   BudgetItem
    ├── id              number
    ├── name            string
    ├── category        string    Transport | Accommodation | Food | Shopping | Activity | Other
    ├── estimatedCost   number
    ├── actualCost      number
    └── paymentStatus   string    Paid | Unpaid
```
## Known Limitations

### Data & Persistence
- **No backend / API** — all data is stored in `localStorage` only. 
- **No cross-device sync** — data is isolated per browser instance.
- **localStorage size limit** — browsers typically cap at ~5-10 MB. 


### Routing & Navigation
- **No URL-based routing** — the app uses in-memory `useState` for page navigation instead of React Router. 
- **Browser back/forward buttons** do not navigate between app pages.

### Authentication & Security
- **No authentication** — the app is fully client-side.
- **No data encryption** — `localStorage` data is stored in plain text.

### UI / UX
- **Limited responsive design** — the layout is optimized for desktop/laptop viewports. Mobile and tablet experiences may be suboptimal.

---

