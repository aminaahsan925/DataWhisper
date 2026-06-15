"use client";
import { useState, useRef } from "react";
import { uploadFile, analyzeFile, askQuestion } from "@/lib/api";

type UploadResult = {
  file_id: string;
  filename: string;
  rows: number;
  columns: number;
  column_names: string[];
  preview: Record<string, unknown>[];
};

type AnalysisResult = {
  numeric_columns: string[];
  text_columns: string[];
  numeric_stats: Record<string, { mean: number; min: number; max: number; sum: number }>;
  duplicate_rows: number;
  missing_values: Record<string, number>;
};

export default function AnalyzePage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) await processFile(file);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
  };

  const processFile = async (file: File) => {
    setError("");
    setUploadResult(null);
    setAnalysisResult(null);
    setAnswer("");
    setIsUploading(true);
    try {
      const uploaded = await uploadFile(file);
      setUploadResult(uploaded);
      setIsAnalyzing(true);
      const analysis = await analyzeFile(uploaded.file_id);
      setAnalysisResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim() || !uploadResult) return;
    setIsAsking(true);
    setAnswer("");
    try {
      const result = await askQuestion(uploadResult.file_id, question);
      setAnswer(result.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Question failed");
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <a href="/" className="text-gray-500 hover:text-white text-sm transition-colors">← Back to home</a>
          <h1 className="text-4xl font-black mt-4 mb-2">Analyze your <span className="text-violet-400">data</span></h1>
          <p className="text-gray-400">Upload a CSV or Excel file to get instant insights</p>
        </div>

        {!uploadResult && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all duration-300 ${isDragging ? "border-violet-400 bg-violet-500/10" : "border-white/20 hover:border-violet-500/50 hover:bg-white/5"}`}
          >
            <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} className="hidden" />
            {isUploading ? (
              <div>
                <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-violet-400 font-semibold text-lg">Uploading your file...</p>
              </div>
            ) : isAnalyzing ? (
              <div>
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-cyan-400 font-semibold text-lg">Analyzing data...</p>
              </div>
            ) : (
              <div>
                <div className="text-6xl mb-4">📁</div>
                <p className="text-xl font-bold mb-2">Drop your file here</p>
                <p className="text-gray-400 mb-4">or click to browse</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-lg text-sm">.CSV</span>
                  <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-lg text-sm">.XLSX</span>
                  <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-lg text-sm">.XLS</span>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 mt-4 text-rose-400">⚠️ {error}</div>
        )}

        {uploadResult && analysisResult && (
          <div className="space-y-6">
            <div className="bg-gray-900/80 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">📄 {uploadResult.filename}</h2>
                <button onClick={() => { setUploadResult(null); setAnalysisResult(null); setAnswer(""); }} className="text-gray-400 hover:text-white text-sm border border-white/10 px-3 py-1.5 rounded-lg transition-colors">
                  Upload new file
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Rows", value: uploadResult.rows.toLocaleString(), color: "text-violet-400" },
                  { label: "Total Columns", value: uploadResult.columns, color: "text-cyan-400" },
                  { label: "Numeric Cols", value: analysisResult.numeric_columns.length, color: "text-emerald-400" },
                  { label: "Duplicate Rows", value: analysisResult.duplicate_rows, color: "text-amber-400" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-4 text-center">
                    <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                    <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900/80 border border-white/10 rounded-3xl p-6">
              <h2 className="text-xl font-bold mb-4">👀 Data Preview (first 5 rows)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>{uploadResult.column_names.map((col, i) => (<th key={i} className="text-left text-gray-400 font-semibold pb-3 pr-6 whitespace-nowrap border-b border-white/10">{col}</th>))}</tr>
                  </thead>
                  <tbody>
                    {uploadResult.preview.map((row, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                        {uploadResult.column_names.map((col, j) => (<td key={j} className="py-2.5 pr-6 text-gray-300 whitespace-nowrap">{String(row[col] ?? "")}</td>))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {analysisResult.numeric_columns.length > 0 && (
              <div className="bg-gray-900/80 border border-white/10 rounded-3xl p-6">
                <h2 className="text-xl font-bold mb-4">📊 Numeric Column Stats</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisResult.numeric_columns.map((col, i) => {
                    const s = analysisResult.numeric_stats[col];
                    return (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <div className="font-semibold text-violet-400 mb-3">{col}</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div><span className="text-gray-500">Mean: </span><span className="text-white font-semibold">{s?.mean}</span></div>
                          <div><span className="text-gray-500">Sum: </span><span className="text-white font-semibold">{s?.sum}</span></div>
                          <div><span className="text-gray-500">Min: </span><span className="text-emerald-400 font-semibold">{s?.min}</span></div>
                          <div><span className="text-gray-500">Max: </span><span className="text-cyan-400 font-semibold">{s?.max}</span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-b from-violet-500/10 to-violet-500/5 border border-violet-500/30 rounded-3xl p-6">
              <h2 className="text-xl font-bold mb-2">🤖 Ask AI about your data</h2>
              <p className="text-gray-400 text-sm mb-4">Ask anything in plain English</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                  placeholder="e.g. Which column has the most missing values?"
                  className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-violet-500/50 transition-colors"
                />
                <button onClick={handleAsk} disabled={isAsking || !question.trim()} className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 px-6 py-3 rounded-xl font-semibold transition-colors text-sm">
                  {isAsking ? "Thinking..." : "Ask →"}
                </button>
              </div>
              {answer && (
                <div className="mt-4 bg-black/30 border border-white/10 rounded-2xl p-4 text-gray-200 text-sm leading-relaxed">
                  <span className="text-violet-400 font-bold text-xs block mb-2">DataWhisper AI</span>
                  {answer}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}