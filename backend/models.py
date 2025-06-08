from sqlalchemy import Column, Integer, String, Float, DateTime
from .database import Base
from datetime import datetime

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    test_type = Column(String)
    confidence_level = Column(Float)
    median = Column(Float)
    std_dev = Column(Float)
    p_value = Column(Float)
    result = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)