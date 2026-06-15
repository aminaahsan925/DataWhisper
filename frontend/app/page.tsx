"use client";
import { useEffect, useState, useRef } from "react";

// Use environment variable or try to auto-detect Codespace URL
const BACKEND = 
  process.env.NEXT_PUBLIC_BACKEND_URL || 
  (typeof window !== 'undefined' && window.location.hostname.includes('github.dev')
    ? `https://${window.location.hostname.split('-')[0]}-${window.location.hostname.split('-')[1]}.github.dev:8000`
    : "http://localhost:8000");

const features = [
  { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>), title: "Upload CSV/Excel", desc: "Drag and drop any CSV or Excel file" },
  { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>), title: "Instant Analysis", desc: "AI processes your data in seconds" },
  { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="9" y1="20" x2="9" y2="4"/><line x1="4" y1="12" x2="4" y2="20"/></svg>), title: "Rich Insights", desc: "Get actionable data-driven answers" },
  { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>), title: "Natural Language", desc: "Ask questions in plain English" },
  { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>), title: "Free & Fast", desc: "No credit card, no limits" },
  { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>), title: "Secure", desc: "Your data stays private" },
];

type Message = { role: "user" | "ai"; text: string };
type FileInfo = { filename: string; rows: number; columns: string[]; preview: Record<string, unknown>[] };

export default function Home() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setHeroVisible(true); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleFile = async (file: File) => {
    setUploadError(""); setUploading(true); setFileInfo(null); setMessages([]);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${BACKEND}/upload`, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Upload failed");
      setFileInfo(data);
      setMessages([{ role: "ai", text: `✓ Loaded ${data.filename} — ${data.rows.toLocaleString()} rows, ${data.columns.length} columns. Ask me anything!` }]);
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : "Upload failed. Is the backend running on port 8000?");
    } finally { setUploading(false); }
  };

  const handleAsk = async () => {
    if (!question.trim() || !fileInfo || asking) return;
    const q = question.trim();
    setQuestion("");
    setMessages(prev => [...prev, { role: "user", text: q }]);
    setAsking(true);
    try {
      const res = await fetch(`${BACKEND}/analyze`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: fileInfo.filename, question: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Analysis failed");
      setMessages(prev => [...prev, { role: "ai", text: data.answer }]);
    } catch (e: unknown) {
      setMessages(prev => [...prev, { role: "ai", text: `Error: ${e instanceof Error ? e.message : "Something went wrong"}` }]);
    } finally { setAsking(false); }
  };

  const S: Record<string, React.CSSProperties> = {
    page: { minHeight: "100vh", background: "#09090B", color: "#FAFAFA", overflowX: "hidden", fontFamily: "'Inter', system-ui, sans-serif" },
    nav: { position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 2rem", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    card: { background: "#111113", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "20px" },
    btn: { background: "#6366F1", color: "white", border: "none", borderRadius: "8px", padding: "9px 16px", fontSize: "14px", fontWeight: 500, cursor: "pointer" },
    inp: { flex: 1 as unknown as undefined, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "9px 14px", fontSize: "13px", color: "rgba(255,255,255,0.9)" },
  };

  return (
    <main style={S.page}>
      <nav style={S.nav}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", background: "#6366F1", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "white" }}>DW</div>
          <span style={{ fontWeight: 600, fontSize: "15px" }}>DataWhisper</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <a href="#features" style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", textDecoration: "none" }}>Features</a>
          <a href="#app" style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", textDecoration: "none" }}>App</a>
          <button style={S.btn} onClick={() => document.getElementById("app")?.scrollIntoView({ behavior: "smooth" })}>Launch App</button>
        </div>
      </nav>

      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "100px 2rem 80px", textAlign: "center", opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(10px)", transition: "all 0.6s ease" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "100px", padding: "5px 12px", fontSize: "12px", color: "#A5B4FC", marginBottom: "24px" }}>
          <span style={{ width: "6px", height: "6px", background: "#6366F1", borderRadius: "50%", display: "inline-block" }} />
          Powered by Gemini AI · Python · FastAPI
        </div>
        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "24px" }}>
          Your data has<br /><span style={{ color: "#6366F1" }}>a story to tell</span>
        </h1>
        <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.45)", maxWidth: "520px", margin: "0 auto 40px", lineHeight: 1.7 }}>
          Upload a CSV or Excel file. Ask questions in plain English. Get instant AI-powered analysis.
        </p>
        <button style={{ ...S.btn, padding: "14px 28px", fontSize: "15px", fontWeight: 600, borderRadius: "10px" }}
          onClick={() => document.getElementById("app")?.scrollIntoView({ behavior: "smooth" })}>
          Upload your data →
        </button>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", marginTop: "72px", background: "rgba(255,255,255,0.06)", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
          {[{ value: "10×", label: "Faster insights" }, { value: "99%", label: "Accuracy" }, { value: "50+", label: "Chart types" }, { value: "∞", label: "Data rows" }].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", padding: "20px 16px", textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em" }}>{s.value}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ width: "1px", height: "60px", background: "rgba(255,255,255,0.08)", margin: "0 auto" }} />

      <section id="app" style={{ maxWidth: "1000px", margin: "0 auto", padding: "80px 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", color: "#6366F1", textTransform: "uppercase", marginBottom: "12px" }}>Live App</p>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.025em" }}>Upload and Analyze</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]); }}
              style={{ ...S.card, border: dragOver ? "1px solid #6366F1" : fileInfo ? "1px solid rgba(34,197,94,0.4)" : "1px dashed rgba(255,255,255,0.15)", cursor: "pointer", textAlign: "center", paddingTop: "40px", paddingBottom: "40px" }}
              onClick={() => fileInputRef.current?.click()}>
              <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
              {uploading ? <div style={{ color: "#A5B4FC", fontSize: "14px" }}>Uploading...</div>
                : fileInfo ? (<><div style={{ color: "#22C55E", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>✓ {fileInfo.filename}</div><div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>Click to change</div></>)
                : (<><div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "6px" }}>Drop your CSV or Excel file here</div><div style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>or click to browse</div></>)}
              {uploadError && <div style={{ color: "#EF4444", fontSize: "12px", marginTop: "10px" }}>{uploadError}</div>}
            </div>
            {fileInfo && (
              <div style={{ ...S.card, overflow: "auto", maxHeight: "280px" }}>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>Data Preview</div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <thead><tr>{fileInfo.columns.map(col => (<th key={col} style={{ textAlign: "left", padding: "6px 10px", color: "rgba(255,255,255,0.4)", borderBottom: "1px solid rgba(255,255,255,0.08)", fontWeight: 500 }}>{col}</th>))}</tr></thead>
                  <tbody>{fileInfo.preview.map((row, i) => (<tr key={i}>{fileInfo.columns.map(col => (<td key={col} style={{ padding: "6px 10px", color: "rgba(255,255,255,0.6)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{String(row[col] || "")}</td>))}</tr>))}</tbody>
                </table>
              </div>
            )}
          </div>
          <div style={{ ...S.card, display: "flex", flexDirection: "column", minHeight: "420px" }}>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", fontWeight: 500, marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "6px", height: "6px", background: fileInfo ? "#22C55E" : "rgba(255,255,255,0.2)", borderRadius: "50%" }} />
              {fileInfo ? fileInfo.filename : "No file uploaded yet"}
            </div>
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
              {messages.length === 0 && <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px", textAlign: "center", marginTop: "40px" }}>Upload a file to start asking questions</div>}
              {messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "85%", padding: "10px 14px", borderRadius: "10px", fontSize: "13px", lineHeight: 1.6, background: msg.role === "user" ? "#6366F1" : "rgba(255,255,255,0.05)", border: msg.role === "ai" ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                    {msg.role === "ai" && <div style={{ fontSize: "10px", color: "#A5B4FC", fontWeight: 600, letterSpacing: "0.05em", marginBottom: "4px", textTransform: "uppercase" }}>DataWhisper</div>}
                    {msg.text}
                  </div>
                </div>
              ))}
              {asking && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "4px", alignItems: "center" }}>
                    {[0, 150, 300].map(d => <div key={d} style={{ width: "5px", height: "5px", background: "#6366F1", borderRadius: "50%", animation: "bounce 1.2s infinite", animationDelay: `${d}ms` }} />)}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input style={S.inp} placeholder={fileInfo ? "Ask anything about your data..." : "Upload a file first..."} value={question} disabled={!fileInfo || asking} onChange={e => setQuestion(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAsk()} />
              <button style={{ ...S.btn, opacity: (!fileInfo || asking) ? 0.5 : 1 }} onClick={handleAsk} disabled={!fileInfo || asking}>Ask</button>
            </div>
          </div>
        </div>
      </section>

      <div style={{ width: "1px", height: "60px", background: "rgba(255,255,255,0.08)", margin: "0 auto" }} />

      <section id="features" style={{ maxWidth: "1000px", margin: "0 auto", padding: "80px 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", color: "#6366F1", textTransform: "uppercase", marginBottom: "12px" }}>Capabilities</p>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.025em" }}>Everything you need</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "rgba(255,255,255,0.06)", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: "#09090B", padding: "28px 24px", transition: "background 0.2s" }} onMouseOver={e => (e.currentTarget.style.background = "#111113")} onMouseOut={e => (e.currentTarget.style.background = "#09090B")}>
              <div style={{ color: "#6366F1", marginBottom: "14px" }}>{f.icon}</div>
              <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 2rem 100px", textAlign: "center" }}>
        <div style={{ background: "#111113", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "16px", padding: "56px 40px" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.025em", marginBottom: "16px" }}>Ready to get started?</h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", marginBottom: "32px", lineHeight: 1.6 }}>Upload your first file and ask anything. No account required.</p>
          <button style={{ ...S.btn, padding: "14px 32px", fontSize: "15px", fontWeight: 600, borderRadius: "10px" }} onClick={() => document.getElementById("app")?.scrollIntoView({ behavior: "smooth" })}>Get started →</button>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 2rem", textAlign: "center" }}>
        <p style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>DataWhisper — Built by Amina Ahsan</p>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", marginTop: "6px" }}>CS Student · University of the Punjab · Python · FastAPI · Next.js · Gemini AI</p>
      </footer>

      <style>{`
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>
    </main>
  );
}
