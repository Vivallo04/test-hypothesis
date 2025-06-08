# Hypothesis Testing API Documentation

## Overview
This API provides endpoints for uploading CSV files, running statistical tests, and managing analysis results. All endpoints return JSON responses and use Pydantic schemas for validation.

## Endpoints

### 1. GET /
Returns a welcome message for the Hypothesis Testing API.

**Response:**
```json
{
  "message": "Hypothesis Testing API"
}
```

### 2. POST /upload
Uploads a CSV file and runs a statistical test.

**Input:**
- `file`: CSV file (multipart/form-data)
  - Must contain columns: "group" and "value"
- `test_type`: String (form field)
  - Options: "t-test", "ANOVA", "chi-square", "Mann-Whitney U", "Wilcoxon", "Kruskal-Wallis"
- `confidence_level`: Float (form field)
  - Range: 0 to 1 (e.g., 0.95 for 95% confidence)

**Response:**
```json
{
  "id": 1,
  "filename": "sample_ttest.csv",
  "test_type": "t-test",
  "confidence_level": 0.95,
  "median": 5.1,
  "std_dev": 0.5,
  "p_value": 0.001,
  "result": "reject null",
  "created_at": "2023-10-01T12:00:00",
  "groups": {
    "A": [5.1, 4.9, 5.0, 5.2, 5.3],
    "B": [6.1, 6.0, 6.2, 5.9, 6.3]
  }
}
```

**Example Request:**
```bash
curl -X POST http://localhost:8000/upload \
  -F "file=@sample_ttest.csv" \
  -F "test_type=t-test" \
  -F "confidence_level=0.95"
```

### 3. GET /history
Returns a list of all previously run analyses, ordered by creation date (newest first).

**Response:**
```json
[
  {
    "id": 2,
    "filename": "another_test.csv",
    "test_type": "ANOVA",
    "confidence_level": 0.95,
    "median": 10.5,
    "std_dev": 1.2,
    "p_value": 0.05,
    "result": "fail to reject null",
    "created_at": "2023-10-02T12:00:00",
    "groups": {
      "Group1": [10.1, 10.2, 10.3],
      "Group2": [11.1, 11.2, 11.3]
    }
  },
  {
    "id": 1,
    "filename": "sample_ttest.csv",
    "test_type": "t-test",
    "confidence_level": 0.95,
    "median": 5.1,
    "std_dev": 0.5,
    "p_value": 0.001,
    "result": "reject null",
    "created_at": "2023-10-01T12:00:00",
    "groups": {
      "A": [5.1, 4.9, 5.0, 5.2, 5.3],
      "B": [6.1, 6.0, 6.2, 5.9, 6.3]
    }
  }
]
```

### 4. POST /rerun/{analysis_id}
Reruns a previously saved analysis using its ID.

**Input:**
- `analysis_id`: Integer (path parameter)
  - The ID of the analysis to rerun

**Response:**
```json
{
  "id": 1,
  "filename": "sample_ttest.csv",
  "test_type": "t-test",
  "confidence_level": 0.95,
  "median": 5.1,
  "std_dev": 0.5,
  "p_value": 0.001,
  "result": "reject null",
  "created_at": "2023-10-01T12:00:00",
  "groups": {
    "A": [5.1, 4.9, 5.0, 5.2, 5.3],
    "B": [6.1, 6.0, 6.2, 5.9, 6.3]
  }
}
```

**Example Request:**
```bash
curl -X POST http://localhost:8000/rerun/1
```

### 5. DELETE /delete/{analysis_id}
Deletes a previously saved analysis by its ID.

**Input:**
- `analysis_id`: Integer (path parameter)
  - The ID of the analysis to delete

**Response:**
```json
{
  "detail": "Deleted"
}
```

**Example Request:**
```bash
curl -X DELETE http://localhost:8000/delete/1
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "detail": "CSV must contain group and value columns"
}
```

### 404 Not Found
```json
{
  "detail": "Analysis not found"
}
```

## Data Models

### AnalysisResult
```typescript
{
  id: number;
  filename: string;
  test_type: string;
  confidence_level: number;
  median: number;
  std_dev: number;
  p_value: number;
  result: string;
  created_at: string;
  groups?: {
    [key: string]: number[];
  };
}
```

## Notes
- All timestamps are in ISO 8601 format
- The API uses SQLite for data storage
- CORS is enabled for development (allows requests from any origin)
- File uploads are temporarily stored on disk and deleted after processing 