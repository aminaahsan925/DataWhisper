# ================================================================
# DataWhisper Backend — FastAPI
# By: Amina Ahsan | CS Student | University of the Punjab
# ================================================================

# ---- IMPORTS ----
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import json
import os
import uuid
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ---- CREATE FASTAPI APP ----
# FastAPI() creates your entire backend application
# Think of it like "switching on" your backend server
app = FastAPI(
    title="DataWhisper API",
    description="AI-powered data analysis backend",
    version="1.0.0"
)

# ---- CORS SETTINGS ----
# CORS = Cross Origin Resource Sharing
# This allows your frontend (running on port 3000)
# to talk to your backend (running on port 8000)
# Without this, the browser BLOCKS the connection for security
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.app.github.dev"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- FOLDER FOR UPLOADED FILES ----
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ---- IN-MEMORY STORAGE ----
# This dictionary stores uploaded file data temporarily
# Key = file_id, Value = pandas DataFrame info
uploaded_files = {}

# ================================================================
# ROUTE 1 — Health Check
# URL: GET /
# Purpose: Check if backend is running
# ================================================================
@app.get("/")
def home():
    return {
        "status": "running",
        "message": "DataWhisper API is live!",
        "version": "1.0.0"
    }

# ================================================================
# ROUTE 2 — Health Check Ping
# URL: GET /health
# Purpose: Simple ping to confirm server is alive
# ================================================================
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "message": "All systems operational"
    }

# ================================================================
# ROUTE 3 — Upload File
# URL: POST /upload
# Purpose: Accept CSV or Excel file from frontend
# Returns: file_id, column names, first 5 rows, basic stats
# ================================================================
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    # Check file type — only CSV and Excel allowed
    filename = file.filename
    if not filename:
        raise HTTPException(status_code=400, detail="No file provided")

    allowed = [".csv", ".xlsx", ".xls"]
    file_ext = os.path.splitext(filename)[1].lower()

    if file_ext not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file_ext} not allowed. Use CSV or Excel."
        )

    # Generate a unique ID for this file
    # uuid4() creates a random unique string like "a3f8b2c1-..."
    file_id = str(uuid.uuid4())

    # Save the file to uploads folder
    file_path = os.path.join(UPLOAD_FOLDER, f"{file_id}{file_ext}")

    # Read file content and save to disk
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    # Read file into pandas DataFrame
    try:
        if file_ext == ".csv":
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read file: {str(e)}")

    # Store DataFrame info in memory
    uploaded_files[file_id] = {
        "filename": filename,
        "path": file_path,
        "shape": df.shape,  # (rows, columns)
        "columns": list(df.columns),
        "dtypes": {col: str(df[col].dtype) for col in df.columns}
    }

    # Get basic statistics
    # describe() gives count, mean, min, max etc for number columns
    try:
        stats = df.describe().round(2).to_dict()
    except:
        stats = {}

    # Get first 5 rows as preview
    # fillna("") replaces NaN with empty string so JSON works
    preview = df.head(5).fillna("").to_dict(orient="records")

    # Count missing values per column
    missing = df.isnull().sum().to_dict()

    return {
        "success": True,
        "file_id": file_id,
        "filename": filename,
        "rows": int(df.shape[0]),
        "columns": int(df.shape[1]),
        "column_names": list(df.columns),
        "preview": preview,
        "stats": stats,
        "missing_values": missing
    }

# ================================================================
# ROUTE 4 — Get File Info
# URL: GET /file/{file_id}
# Purpose: Get info about an already uploaded file
# ================================================================
@app.get("/file/{file_id}")
def get_file_info(file_id: str):
    if file_id not in uploaded_files:
        raise HTTPException(status_code=404, detail="File not found")

    info = uploaded_files[file_id]
    return {
        "success": True,
        "file_id": file_id,
        "filename": info["filename"],
        "rows": info["shape"][0],
        "columns": info["shape"][1],
        "column_names": info["columns"]
    }

# ================================================================
# ROUTE 5 — Analyze Data
# URL: GET /analyze/{file_id}
# Purpose: Run full analysis on uploaded file
# Returns: summary stats, missing values, column types
# ================================================================
@app.get("/analyze/{file_id}")
def analyze_file(file_id: str):
    if file_id not in uploaded_files:
        raise HTTPException(status_code=404, detail="File not found")

    info = uploaded_files[file_id]
    file_path = info["path"]

    # Re-read the file
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".csv":
        df = pd.read_csv(file_path)
    else:
        df = pd.read_excel(file_path)

    # Separate numeric and text columns
    numeric_cols = df.select_dtypes(include=["number"]).columns.tolist()
    text_cols = df.select_dtypes(include=["object"]).columns.tolist()

    # Calculate stats for numeric columns
    numeric_stats = {}
    for col in numeric_cols:
        numeric_stats[col] = {
            "mean": round(float(df[col].mean()), 2),
            "min": round(float(df[col].min()), 2),
            "max": round(float(df[col].max()), 2),
            "std": round(float(df[col].std()), 2),
            "sum": round(float(df[col].sum()), 2)
        }

    # Calculate value counts for text columns (top 5 values)
    text_stats = {}
    for col in text_cols:
        top_values = df[col].value_counts().head(5).to_dict()
        text_stats[col] = {str(k): int(v) for k, v in top_values.items()}

    # Missing values count
    missing = {col: int(count) for col, count in df.isnull().sum().items() if count > 0}

    return {
        "success": True,
        "file_id": file_id,
        "filename": info["filename"],
        "total_rows": int(df.shape[0]),
        "total_columns": int(df.shape[1]),
        "numeric_columns": numeric_cols,
        "text_columns": text_cols,
        "numeric_stats": numeric_stats,
        "text_stats": text_stats,
        "missing_values": missing,
        "duplicate_rows": int(df.duplicated().sum())
    }

# ================================================================
# ROUTE 6 — Ask Question (AI placeholder for now)
# URL: POST /ask
# Purpose: Take a question about the data and return answer
# Note: Gemini AI gets added in Phase 7
# ================================================================
class QuestionRequest(BaseModel):
    file_id: str
    question: str

@app.post("/ask")
def ask_question(request: QuestionRequest):
    if request.file_id not in uploaded_files:
        raise HTTPException(status_code=404, detail="File not found")

    info = uploaded_files[request.file_id]

    # For now return a placeholder — Gemini AI comes in Phase 7
    return {
        "success": True,
        "question": request.question,
        "answer": f"You asked: '{request.question}' about file '{info['filename']}'. AI analysis coming in Phase 7!",
        "file_id": request.file_id
    }  