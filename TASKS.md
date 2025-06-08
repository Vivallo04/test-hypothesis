# Hypothesis Testing App Implementation
A web application for uploading CSV data, running various hypothesis tests, and visualizing results. Supports multiple CSV uploads, user-selectable confidence levels, and maintains a history of analyses. No authentication; all users share the same history.

## Completed Tasks
- [x] Requirements gathering and project planning
- [x] Scaffold backend (FastAPI, SQLite, endpoints for upload, run, fetch, re-run, delete)
- [x] Scaffold frontend (Create React App, TailwindCSS, shadcdn, basic UI layout)
- [x] Implement CSV upload and parsing (backend)
- [x] Implement hypothesis test logic (t-test, ANOVA, chi-square, Mann-Whitney U, Wilcoxon, Kruskal-Wallis)
- [x] Store and retrieve analysis history in SQLite
- [x] Implement endpoints for fetching, re-running, and deleting analyses
- [x] Implement frontend CSV upload and test selection UI
- [x] Add confidence level selection in UI and backend
- [x] Display results: median, standard deviation, confidence interval
- [x] Show analysis history with CSV filename, test type, parameters, results, and graphs
- [x] Allow re-running and deleting analyses from history (frontend/backend)
- [x] Integrate Chart.js with React for graph rendering
- [x] Render bar chart of group means/medians
- [x] Render histogram of values
- [x] Render fitted normal distribution curve
- [x] Render p-value visualization (shaded region under curve)
- [x] Connect graph data to backend results

## In Progress Tasks
- [ ] Polish UI for desktop use (Tailwind, layout, error handling)
- [ ] Finalize frontend-backend integration (loading states, error messages, edge cases)

## Future Tasks
- [ ] Support optional extra columns for future multi-factor tests
- [ ] Add README with setup instructions
- [ ] Write requirements.txt and package.json (final check)

## Notes
- SQLite is used as the database for the project (see backend/database.py and backend/models.py).
- Frontend and backend are fully integrated for all core features; polish and error handling are in progress.

## Relevant Files
- `/backend/main.py` - FastAPI app entry point
- `/backend/database.py` - SQLite models and logic
- `/backend/schemas.py` - Pydantic models for API
- `/backend/models.py` - SQLAlchemy models for analysis
- `/backend/tests.py` - Hypothesis test implementations
- `/frontend/src/App.js` - Main React app
- `/frontend/src/components/Upload.js` - CSV upload UI
- `/frontend/src/components/TestSelector.js` - Test/confidence selection UI
- `/frontend/src/components/Results.js` - Results and graphs display
- `/frontend/src/components/History.js` - Analysis history UI
- `/frontend/tailwind.config.js` - TailwindCSS config
- `/frontend/package.json` - Frontend dependencies
- `/backend/requirements.txt` - Backend dependencies

## Implementation Details
- **Architecture**: Separate backend (FastAPI) and frontend (React), communicate via REST API
- **Data Flow**: User uploads CSV → selects test/confidence → backend runs test, stores result → frontend fetches and displays results/graphs/history
- **Technical Components**:
  - FastAPI for API
  - SQLite for persistent storage
  - Pydantic for data validation
  - React (Create React App) for frontend
  - TailwindCSS for styling
  - shadcdn/Chart.js for graphs
- **Environment Configuration**:
  - Local dev setup, no Docker
  - requirements.txt and package.json for dependencies
  - No authentication, desktop only

# Backend-Frontend Integration for Hypothesis Testing App
Integrate the FastAPI backend endpoints and database functionality with the Next.js frontend. This will enable users to upload CSVs, run statistical tests, view analysis history, and manage analyses through a modern UI.

## Completed Tasks
- [x] Project structure reviewed and requirements gathered
- [x] Set up API utility functions in the frontend to connect to backend endpoints
- [x] Scaffold TDD test files for API utilities and UI flows
- [x] Build UI components for CSV upload, test selection, and result display (UploadForm, AnalysisHistory)

## In Progress Tasks
- [ ] Implement analysis history view and management (rerun/delete)
  - UploadForm and AnalysisHistory components created and integrated with API utilities

## Future Tasks
- [ ] Add error handling and user feedback for API interactions
- [ ] Polish UI with @ui.mdc design guidelines
- [ ] Write end-to-end tests for integration flows

## Relevant Files
- `/backend/main.py` - FastAPI endpoints for analysis, history, rerun, and delete
- `/backend/models.py` - SQLAlchemy models for analysis records
- `/backend/schemas.py` - Pydantic schemas for API responses
- `/frontend/lib/api.ts` - API utility functions for frontend-backend communication
- `/frontend/lib/api.test.ts` - TDD test scaffold for API utilities
- `/frontend/components/UploadForm.tsx` - UI for uploading CSVs and selecting tests
- `/frontend/components/AnalysisHistory.tsx` - UI for displaying and managing analysis history

## Implementation Details
- **Architecture:** RESTful API (FastAPI) with a Next.js frontend. Data exchanged as JSON.
- **Data Flow:**
  - User uploads CSV and selects test → Frontend sends to `/upload` → Backend processes and stores result → Frontend displays result and updates history.
  - History, rerun, and delete managed via `/history`, `/rerun/{id}`, `/delete/{id}` endpoints.
- **Technical Components:**
  - Axios or fetch for API calls
  - React state/hooks for UI state management
  - Tailwind CSS for styling (per frontend config)
- **Environment:**
  - Python 3.10+, FastAPI, SQLAlchemy, pandas (backend)
  - Node.js, Next.js, React, Tailwind CSS (frontend)
  - Local SQLite DB for development

# Hypothesis Testing App Integration Tasks

Integrate the FastAPI backend (per hypotest-api-docs.md) with the updated Next.js frontend. Implement and connect analysis, file upload, history, and result graphics.

## Completed Tasks
- [x] Project structure reviewed and requirements gathered

## In Progress Tasks
- [ ] Ensure backend endpoints match hypotest-api-docs.md (analysis, upload, history, rerun, delete)
- [ ] Integrate frontend file upload with backend `/upload` endpoint
- [ ] Integrate frontend analysis result display with backend response
- [ ] Integrate frontend history panel with backend `/history`, `/rerun/{id}`, `/delete/{id}` endpoints
- [ ] Integrate result graphics/charts with backend analysis data

## Future Tasks
- [ ] Add error handling and user feedback for all API interactions
- [ ] Add tests for backend endpoints and frontend API utilities
- [ ] Polish UI and UX for analysis and history flows
- [ ] Add documentation for deployment and Dockerization

## Relevant Files
- `/backend/main.py` - FastAPI endpoints for analysis, upload, history, rerun, delete
- `/backend/models.py` - SQLAlchemy models for analysis records
- `/backend/schemas.py` - Pydantic schemas for API responses
- `/backend/requirements.txt` - Backend dependencies
- `/frontend/lib/api.ts` - API utility functions for frontend-backend communication
- `/frontend/components/csv-upload.tsx` - File upload UI
- `/frontend/components/test-selection.tsx` - Test selection and analysis UI
- `/frontend/components/results-display.tsx` - Analysis result and graphics UI
- `/frontend/components/history-panel.tsx` - Analysis history UI

## Implementation Details
- **Architecture:** RESTful API (FastAPI) with a Next.js frontend. Data exchanged as JSON.
- **Data Flow:**
  - User uploads CSV and selects test → Frontend sends to `/upload` → Backend processes and stores result → Frontend displays result and updates history.
  - History, rerun, and delete managed via `/history`, `/rerun/{id}`, `/delete/{id}` endpoints.
- **Technical Components:**
  - Fetch API for backend calls
  - React state/hooks for UI state management
  - Tailwind CSS for styling
- **Environment:**
  - Python 3.10+, FastAPI, SQLAlchemy, pandas (backend)
  - Node.js, Next.js, React, Tailwind CSS (frontend)
  - Local SQLite DB for development 