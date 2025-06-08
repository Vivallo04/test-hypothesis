const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export interface AnalysisResult {
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
    data: [],
    groups: backend.groups ? Object.keys(backend.groups) : [],
  };
}

export async function uploadAnalysis(file: File, testType: string, confidenceLevel: number): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('test_type', testType);
  formData.append('confidence_level', confidenceLevel.toString());
  const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error(await res.text());
  return mapBackendResult(await res.json());
}

export async function getHistory(): Promise<AnalysisResult[]> {
  const res = await fetch(`${API_BASE}/history`);
  if (!res.ok) throw new Error(await res.text());
  const arr = await res.json();
  return arr.map(mapBackendResult);
}

export async function rerunAnalysis(id: string): Promise<AnalysisResult> {
  const res = await fetch(`${API_BASE}/rerun/${id}`, { method: 'POST' });
  if (!res.ok) throw new Error(await res.text());
  return mapBackendResult(await res.json());
}

export async function deleteAnalysis(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/delete/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text());
}

export async function healthCheck(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
} 