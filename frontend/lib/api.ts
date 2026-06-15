const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Upload failed");
  }
  return await response.json();
}

export async function analyzeFile(fileId: string) {
  const response = await fetch(`${API_URL}/analyze/${fileId}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Analysis failed");
  }
  return await response.json();
}

export async function askQuestion(fileId: string, question: string) {
  const response = await fetch(`${API_URL}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_id: fileId, question: question }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Question failed");
  }
  return await response.json();
}