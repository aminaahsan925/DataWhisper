/**
 * API Client for DataWhisper
 * 
 * This module provides TypeScript functions for communicating with the DataWhisper backend API.
 */

const BACKEND_URL = 
  process.env.NEXT_PUBLIC_BACKEND_URL || 
  (typeof window !== 'undefined' && window.location.hostname.includes('github.dev')
    ? `https://${window.location.hostname.split('-')[0]}-${window.location.hostname.split('-')[1]}.github.dev:8000`
    : "http://localhost:8000");

/**
 * Type definitions for API responses
 */
export interface UploadResponse {
  success: boolean;
  filename: string;
  rows: number;
  columns: string[];
  preview: Record<string, unknown>[];
}

export interface AnalyzeResponse {
  success: boolean;
  question: string;
  answer: string;
}

export interface ApiError {
  success: false;
  error: string;
  status_code?: number;
}

/**
 * Upload a file to the backend
 * 
 * @param file - The file to upload (CSV or Excel)
 * @returns Upload response with file metadata and preview
 * @throws Error if upload fails
 */
export async function uploadFile(file: File): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    
    console.log(`📤 Uploading file: ${file.name}`);
    const response = await fetch(`${BACKEND_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.detail || "Upload failed");
    }

    const data = await response.json();
    console.log(`✅ File uploaded successfully: ${data.filename}`);
    return data;
  } catch (error) {
    console.error("❌ Upload error:", error);
    throw error;
  }
}

/**
 * Analyze data by asking a question
 * 
 * @param filename - Name of the uploaded file
 * @param question - Question to ask about the data
 * @returns Analysis response with AI-generated answer
 * @throws Error if analysis fails
 */
export async function askQuestion(
  filename: string,
  question: string
): Promise<AnalyzeResponse> {
  try {
    console.log(`🤔 Analyzing: ${question}`);
    const response = await fetch(`${BACKEND_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, question }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.detail || "Analysis failed");
    }

    const data = await response.json();
    console.log(`✅ Analysis completed`);
    return data;
  } catch (error) {
    console.error("❌ Analysis error:", error);
    throw error;
  }
}

/**
 * Check if backend is accessible
 * 
 * @returns true if backend is reachable, false otherwise
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    console.log(`🏥 Checking backend health at: ${BACKEND_URL}`);
    const response = await fetch(`${BACKEND_URL}/`, {
      method: "GET",
      headers: { "Accept": "application/json" },
    });
    const isHealthy = response.ok;
    if (isHealthy) {
      console.log("✅ Backend is healthy");
    } else {
      console.warn(`⚠️ Backend returned status: ${response.status}`);
    }
    return isHealthy;
  } catch (error) {
    console.error("❌ Backend health check failed:", error);
    return false;
  }
}

export { BACKEND_URL };
