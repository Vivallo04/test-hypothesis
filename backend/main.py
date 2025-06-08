from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, init_sqlite_schema, test_sqlite_connection
import models, schemas, tests
import shutil
import os
import pandas as pd
from typing import List
from fastapi.encoders import jsonable_encoder

# Initialize SQLite schema and test connection at startup
init_sqlite_schema()
test_sqlite_connection()

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Add your frontend URL here
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Hypothesis Testing API"}

@app.post("/upload", response_model=schemas.AnalysisResult)
def upload_csv(
    file: UploadFile = File(...),
    test_type: str = Form(...),
    confidence_level: float = Form(...),
    db: Session = Depends(get_db)
):
    print(f"[API] /upload called with file: {file.filename}, test_type: {test_type}, confidence_level: {confidence_level}")
    print(f"[API] Available test types: ['t-test', 'ANOVA', 'chi-square', 'Mann-Whitney U', 'Wilcoxon', 'Kruskal-Wallis']")
    file_location = f"uploaded_{file.filename}"
    try:
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        print(f"[API] File saved to {file_location}")
        df = pd.read_csv(file_location)
        print(f"[API] CSV loaded, columns: {df.columns.tolist()}")
        if 'group' not in df.columns or 'value' not in df.columns:
            print(f"[API] CSV missing required columns")
            raise ValueError('CSV must contain group and value columns')
        print(f"[API] Running test: {test_type}")
        if test_type == 't-test':
            median, std_dev, p_value, result = tests.t_test(df, confidence_level)
        elif test_type == 'ANOVA':
            median, std_dev, p_value, result = tests.anova(df, confidence_level)
        elif test_type == 'chi-square':
            median, std_dev, p_value, result = tests.chi_square(df, confidence_level)
        elif test_type == 'Mann-Whitney U':
            median, std_dev, p_value, result = tests.mann_whitney_u(df, confidence_level)
        elif test_type == 'Wilcoxon':
            median, std_dev, p_value, result = tests.wilcoxon(df, confidence_level)
        elif test_type == 'Kruskal-Wallis':
            median, std_dev, p_value, result = tests.kruskal_wallis(df, confidence_level)
        else:
            print(f"[API] Unknown test type received: {test_type}")
            print(f"[API] Valid test types: ['t-test', 'ANOVA', 'chi-square', 'Mann-Whitney U', 'Wilcoxon', 'Kruskal-Wallis']")
            raise ValueError(f'Unknown test type: {test_type}')
        print(f"[API] Test result: median={median}, std_dev={std_dev}, p_value={p_value}, result={result}")
        group_data = df.groupby('group')['value'].apply(list).to_dict()
        flat_data = []
        for group, values in group_data.items():
            for value in values:
                flat_data.append({"group": group, "value": value})
        print(f"[API] Group data: {group_data}")
    except Exception as e:
        if os.path.exists(file_location):
            os.remove(file_location)
        print(f"[API] /upload error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    os.remove(file_location)
    print(f"[API] File {file_location} removed after processing")
    analysis = models.Analysis(
        filename=file.filename,
        test_type=test_type,
        confidence_level=confidence_level,
        median=median if median is not None else 0.0,
        std_dev=std_dev if std_dev is not None else 0.0,
        p_value=p_value if p_value is not None else 0.0,
        result=result or 'error'
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    print(f"[API] Analysis saved to DB with id: {analysis.id}")
    response = jsonable_encoder(analysis)
    response['groups'] = group_data
    response['data'] = flat_data
    print(f"[API] /upload completed for file: {file.filename}")
    return response

@app.get("/history", response_model=List[schemas.AnalysisResult])
def get_history(db: Session = Depends(get_db)):
    print("[API] /history called")
    results = db.query(models.Analysis).order_by(models.Analysis.created_at.desc()).all()
    print(f"[API] /history returning {len(results)} records")
    response = []
    for analysis in results:
        item = jsonable_encoder(analysis)
        group_data = item.get('groups', {})
        flat_data = []
        for group, values in group_data.items():
            for value in values:
                flat_data.append({"group": group, "value": value})
        item['data'] = flat_data
        response.append(item)
    return response

@app.post("/rerun/{analysis_id}", response_model=schemas.AnalysisResult)
def rerun_analysis(analysis_id: int, db: Session = Depends(get_db)):
    print(f"[API] /rerun/{analysis_id} called")
    analysis = db.query(models.Analysis).filter(models.Analysis.id == analysis_id).first()
    if not analysis:
        print(f"[API] Analysis id {analysis_id} not found")
        raise HTTPException(status_code=404, detail="Analysis not found")
    file_location = f"uploaded_{analysis.filename}"
    if not os.path.exists(file_location):
        print(f"[API] Original file {file_location} not found for rerun")
        raise HTTPException(status_code=404, detail="Original CSV not found for re-run")
    try:
        df = pd.read_csv(file_location)
        print(f"[API] CSV loaded for rerun, columns: {df.columns.tolist()}")
        if analysis.test_type == 't-test':
            median, std_dev, p_value, result = tests.t_test(df, analysis.confidence_level)
        elif analysis.test_type == 'ANOVA':
            median, std_dev, p_value, result = tests.anova(df, analysis.confidence_level)
        elif analysis.test_type == 'chi-square':
            median, std_dev, p_value, result = tests.chi_square(df, analysis.confidence_level)
        elif analysis.test_type == 'Mann-Whitney U':
            median, std_dev, p_value, result = tests.mann_whitney_u(df, analysis.confidence_level)
        elif analysis.test_type == 'Wilcoxon':
            median, std_dev, p_value, result = tests.wilcoxon(df, analysis.confidence_level)
        elif analysis.test_type == 'Kruskal-Wallis':
            median, std_dev, p_value, result = tests.kruskal_wallis(df, analysis.confidence_level)
        else:
            print(f"[API] Unknown test type: {analysis.test_type}")
            raise ValueError('Unknown test type')
        print(f"[API] Rerun result: median={median}, std_dev={std_dev}, p_value={p_value}, result={result}")
        group_data = df.groupby('group')['value'].apply(list).to_dict()
        flat_data = []
        for group, values in group_data.items():
            for value in values:
                flat_data.append({"group": group, "value": value})
        response = jsonable_encoder(analysis)
        response['groups'] = group_data
        response['data'] = flat_data
        return response
    except Exception as e:
        print(f"[API] /rerun/{analysis_id} error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/delete/{analysis_id}")
def delete_analysis(analysis_id: int, db: Session = Depends(get_db)):
    print(f"[API] /delete/{analysis_id} called")
    analysis = db.query(models.Analysis).filter(models.Analysis.id == analysis_id).first()
    if not analysis:
        print(f"[API] Analysis id {analysis_id} not found for delete")
        raise HTTPException(status_code=404, detail="Analysis not found")
    db.delete(analysis)
    db.commit()
    print(f"[API] Analysis id {analysis_id} deleted from DB")
    return JSONResponse(content={"detail": "Deleted"})

@app.get("/health")
def health_check():
     print("[API] /health called")
     return {"status": "ok"}