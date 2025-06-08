from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import sqlite3

SQLALCHEMY_DATABASE_URL = "sqlite:///./hypothesis.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def init_sqlite_schema():
    conn = sqlite3.connect("hypothesis.db")
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analyses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT,
            test_type TEXT,
            confidence_level REAL,
            median REAL,
            std_dev REAL,
            p_value REAL,
            result TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def test_sqlite_connection():
    try:
        conn = sqlite3.connect("hypothesis.db")
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        conn.close()
        print("SQLite connection successful. Tables:", tables)
        return True
    except Exception as e:
        print("SQLite connection failed:", e)
        return False 