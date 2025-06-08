# Hypothesis Testing Frontend Documentation

## Overview

The frontend is a Next.js/React application that provides a user interface for uploading CSV files, configuring and running statistical tests, and viewing analysis results and history. It is designed to integrate with the backend API described in `hypotest-api-docs.md`.

---

## Main Components & Their Roles

### 1. `CSVUpload`
- **Purpose:**  
  Allows users to upload a CSV file, validates its structure, and previews the data.
- **Props:**  
  - `onDataUpload(data: any[], filename: string)`: Called with parsed CSV data and filename.
  - `onError(error: string)`: Called with error messages.
- **Integration Point:**  
  Should POST the file to `/upload` on the backend, not just parse locally.

---

### 2. `TestSelection`
- **Purpose:**  
  Lets users select a statistical test and confidence level, then runs the analysis.
- **Props:**  
  - `data: any[]`: Parsed CSV data.
  - `filename: string`: Name of the uploaded file.
  - `onAnalysisComplete(result: AnalysisResult)`: Called with the analysis result.
  - `onError(error: string)`: Called with error messages.
  - `isLoading: boolean`: Loading state.
  - `setIsLoading(loading: boolean)`: Setter for loading state.
- **Integration Point:**  
  Should POST the file, test type, and confidence level to `/upload` on the backend and use the response.

---

### 3. `ResultsDisplay`
- **Purpose:**  
  Shows the results of the most recent analysis.
- **Props:**  
  - `result: AnalysisResult`: The result object to display.
- **Integration Point:**  
  Should display the backend's `/upload` or `/rerun/{id}` response.

---

### 4. `HistoryPanel`
- **Purpose:**  
  Displays a list of previous analyses, allows rerunning or deleting them.
- **Props:**  
  - `onAnalysisSelect(result: AnalysisResult)`: Called when a history item is selected.
- **Integration Point:**  
  - Fetches from `/history` (GET).
  - Reruns via `/rerun/{id}` (POST).
  - Deletes via `/delete/{id}` (DELETE).

---

### 5. `app/page.tsx`
- **Purpose:**  
  Main page, manages tab state and composes the above components.
- **Integration Point:**  
  Orchestrates the flow between upload, test selection, results, and history.

---

## Data Model

### `AnalysisResult` (Frontend)
```typescript
{
  id: string;
  testType: string;
  confidenceLevel: number;
  median: number;
  standardDeviation: number;
  pValue: number;
  result: string;
  timestamp: string;
  filename: string;
  data: any[];
  groups?: string[];
}
```
**Note:**  
- The backend uses slightly different field names and types (e.g., `id: number`, `created_at`, `std_dev`, `test_type`, etc.).  
- A mapping layer may be needed to align frontend and backend models.

---

## Integration Plan

### 1. API Utility Layer
- Create a utility (e.g., `lib/api.ts`) to handle all backend requests:
  - `uploadAnalysis(file, testType, confidenceLevel): Promise<AnalysisResult>`
  - `getHistory(): Promise<AnalysisResult[]>`
  - `rerunAnalysis(id: number): Promise<AnalysisResult>`
  - `deleteAnalysis(id: number): Promise<void>`

### 2. Update Components to Use Backend
- **CSVUpload:**  
  - Remove local parsing for analysis; only validate and preview.
  - Pass the file to the API utility for upload.
- **TestSelection:**  
  - On submit, call the API utility to upload the file and run the test.
  - Map backend response to frontend `AnalysisResult`.
- **ResultsDisplay:**  
  - Display the mapped backend response.
- **HistoryPanel:**  
  - Fetch history from the backend.
  - Use backend IDs for rerun/delete actions.
  - Map backend response to frontend `AnalysisResult`.

### 3. Error Handling
- Display backend error messages in the UI.

### 4. Data Model Mapping
- Implement a mapping function to convert backend `AnalysisResult` to the frontend format.

### 5. Environment Configuration
- Use an environment variable for the backend API base URL.

---

## Example API Utility (TypeScript)

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export async function uploadAnalysis(file: File, testType: string, confidenceLevel: number) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('test_type', testType);
  formData.append('confidence_level', confidenceLevel.toString());
  const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error(await res.text());
  return mapBackendResult(await res.json());
}

// ...similarly for getHistory, rerunAnalysis, deleteAnalysis

function mapBackendResult(backend: any): AnalysisResult {
  return {
    id: backend.id.toString(),
    testType: backend.test_type,
    confidenceLevel: backend.confidence_level,
    median: backend.median,
    standardDeviation: backend.std_dev,
    pValue: backend.p_value,
    result: backend.result,
    timestamp: backend.created_at,
    filename: backend.filename,
    data: [], // Optionally fill if needed
    groups: backend.groups ? Object.keys(backend.groups) : [],
  };
}
```

---

## Next Steps

1. **Implement the API utility layer.**
2. **Update all relevant components to use the backend via the utility.**
3. **Test the full upload → analysis → history → rerun/delete flow.**
4. **Document any frontend-specific endpoints or flows in this file.**
5. **Update `hypotest-api-docs.md` to reference frontend integration points.** 