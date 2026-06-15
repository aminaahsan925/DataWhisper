"""DataWhisper API - AI-Powered Data Analysis Backend

This module provides RESTful endpoints for uploading data files and analyzing them
using Google's Generative AI (Gemini) models.

Environment Variables:
    GEMINI_API_KEY: Google Generative AI API key (required)

Author: Amina Ahsan
Version: 2.0.0
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import google.generativeai as genai
import os
import io
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    logger.warning("⚠️  GEMINI_API_KEY not found in environment variables")
    raise ValueError("GEMINI_API_KEY environment variable is required. Please set it in your .env file.")

try:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")
    logger.info("✅ Gemini AI initialized successfully")
except Exception as e:
    logger.error(f"❌ Failed to initialize Gemini AI: {str(e)}")
    raise

# Initialize FastAPI app
app = FastAPI(
    title="DataWhisper API",
    description="AI-powered data analysis API using Gemini AI",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory data store (for production, use a proper database)
uploaded_data_store: dict = {}


class AnalyzeRequest(BaseModel):
    """Request model for data analysis.
    
    Attributes:
        filename (str): Name of the uploaded file
        question (str): Question to ask about the data
    """
    filename: str
    question: str


@app.get("/", tags=["Health"])
def root():
    """Health check endpoint.
    
    Returns:
        dict: API status information
    """
    logger.info("Health check requested")
    return {
        "status": "DataWhisper API is running",
        "version": "2.0.0",
        "ai_model": "Gemini 1.5 Flash"
    }


@app.post("/upload", tags=["File Operations"])
async def upload_file(file: UploadFile = File(...)):
    """Upload and parse a CSV or Excel file.
    
    Supported formats:
        - .csv (Comma-separated values)
        - .xlsx (Excel 2007+)
        - .xls (Excel 97-2003)
    
    Args:
        file (UploadFile): The file to upload
    
    Returns:
        dict: File metadata and data preview
        - success (bool): Whether upload was successful
        - filename (str): Original filename
        - rows (int): Number of rows in dataset
        - columns (list): Column names
        - preview (list): First 5 rows of data
    
    Raises:
        HTTPException: If file is invalid or unsupported
    """
    try:
        # Validate file
        if not file.filename:
            logger.warning("Upload attempt with no filename")
            raise HTTPException(status_code=400, detail="No file provided")
        
        filename_lower = file.filename.lower()
        supported_formats = (".csv", ".xlsx", ".xls")
        
        if not any(filename_lower.endswith(fmt) for fmt in supported_formats):
            logger.warning(f"Unsupported file format: {file.filename}")
            raise HTTPException(
                status_code=400,
                detail=f"Only {', '.join(supported_formats)} files are supported. Got: {file.filename}"
            )
        
        # Read file
        logger.info(f"Uploading file: {file.filename}")
        contents = await file.read()
        
        try:
            if filename_lower.endswith(".csv"):
                df = pd.read_csv(io.BytesIO(contents))
            else:
                df = pd.read_excel(io.BytesIO(contents))
        except Exception as e:
            logger.error(f"Failed to parse file {file.filename}: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail=f"Could not read file. Make sure it's a valid {filename_lower.split('.')[-1].upper()} file. Error: {str(e)}"
            )
        
        # Clean column names
        df.columns = df.columns.str.strip()
        
        # Store data
        uploaded_data_store[file.filename] = df.to_json()
        
        logger.info(f"✅ File uploaded successfully: {file.filename} ({len(df)} rows, {len(df.columns)} columns)")
        
        return {
            "success": True,
            "filename": file.filename,
            "rows": len(df),
            "columns": list(df.columns),
            "preview": df.head(5).fillna("").to_dict(orient="records"),
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during upload: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


@app.post("/analyze", tags=["Analysis"])
async def analyze(request: AnalyzeRequest):
    """Analyze data using Gemini AI based on a question.
    
    Args:
        request (AnalyzeRequest): Contains filename and question
    
    Returns:
        dict: Analysis results
        - success (bool): Whether analysis was successful
        - question (str): The asked question
        - answer (str): AI-generated answer
    
    Raises:
        HTTPException: If file not found or API error occurs
    """
    try:
        # Validate file exists
        if request.filename not in uploaded_data_store:
            logger.warning(f"Analysis requested for non-existent file: {request.filename}")
            raise HTTPException(
                status_code=404,
                detail=f"File '{request.filename}' not found. Please upload it first."
            )
        
        # Reconstruct dataframe
        df = pd.read_json(uploaded_data_store[request.filename])
        
        # Build data description
        data_description = f"""
== Dataset Overview ==
Filename: {request.filename}
Total Rows: {len(df)}
Total Columns: {len(df.columns)}
Column Names: {', '.join(df.columns)}

== First 10 Rows ==
{df.head(10).to_string()}

== Statistical Summary ==
{df.describe(include='all').to_string()}
"""
        
        # Create AI prompt
        prompt = f"""You are DataWhisper, an expert data analyst AI assistant. Your role is to provide clear, accurate, and actionable insights about datasets.

User's Dataset:
{data_description}

User's Question: {request.question}

Instructions:
- Answer based ONLY on the data provided above
- Use specific numbers and statistics from the data
- Be concise but thorough (2-4 sentences)
- If the data doesn't support the question, explain why
- Highlight any interesting patterns or outliers
"""
        
        # Generate response
        logger.info(f"Analyzing: {request.question}")
        response = model.generate_content(prompt)
        answer = response.text
        
        logger.info(f"✅ Analysis completed for: {request.filename}")
        
        return {
            "success": True,
            "question": request.question,
            "answer": answer
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed. Please try again. Error: {str(e)}"
        )


@app.delete("/clear", tags=["Data Management"])
def clear_data():
    """Clear all uploaded data from memory (for development/testing).
    
    Returns:
        dict: Confirmation message
    """
    global uploaded_data_store
    count = len(uploaded_data_store)
    uploaded_data_store.clear()
    logger.info(f"🧹 Cleared {count} uploaded files")
    return {"success": True, "message": f"Cleared {count} files from memory"}


# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler."""
    return {
        "success": False,
        "error": exc.detail,
        "status_code": exc.status_code
    }


if __name__ == "__main__":
    import uvicorn
    logger.info("🚀 Starting DataWhisper API...")
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )
