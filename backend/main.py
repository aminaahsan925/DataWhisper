from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import google.generativeai as genai
import os
import io
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

app = FastAPI(title="DataWhisper API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

uploaded_data_store: dict = {}

@app.get("/")
def root():
    return {"status": "DataWhisper API is running"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    filename = file.filename.lower()
    if not (filename.endswith(".csv") or filename.endswith(".xlsx") or filename.endswith(".xls")):
        raise HTTPException(status_code=400, detail="Only CSV and Excel files are supported")
    contents = await file.read()
    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read file: {str(e)}")
    df.columns = df.columns.str.strip()
    uploaded_data_store[file.filename] = df.to_json()
    return {
        "success": True,
        "filename": file.filename,
        "rows": len(df),
        "columns": list(df.columns),
        "preview": df.head(5).fillna("").to_dict(orient="records"),
    }

class AnalyzeRequest(BaseModel):
    filename: str
    question: str

@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    if request.filename not in uploaded_data_store:
        raise HTTPException(status_code=404, detail="File not found. Please upload your file first.")
    df = pd.read_json(uploaded_data_store[request.filename])
    data_description = f"""
Dataset: {request.filename}
Rows: {len(df)}
Columns: {list(df.columns)}
First 10 rows:
{df.head(10).to_string()}
Statistics:
{df.describe(include='all').to_string()}
"""
    prompt = f"""You are DataWhisper, an expert data analyst AI.
The user uploaded this dataset:
{data_description}
User question: {request.question}
Answer clearly using specific numbers from the data. Keep it to 2-4 sentences.
"""
    try:
        response = model.generate_content(prompt)
        answer = response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error: {str(e)}")
    return {"success": True, "question": request.question, "answer": answer}
