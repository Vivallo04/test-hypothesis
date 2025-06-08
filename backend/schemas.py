from pydantic import BaseModel
from typing import List, Optional, Dict

class AnalysisRequest(BaseModel):
    filename: str
    test_type: str
    confidence_level: float
    columns: List[str]
    # Add more fields as needed

class AnalysisResult(BaseModel):
    id: int
    filename: str
    test_type: str
    confidence_level: float
    median: float
    std_dev: float
    p_value: float
    result: str
    created_at: str
    groups: Optional[Dict[str, List[float]]] = None
    # Add more fields as needed 