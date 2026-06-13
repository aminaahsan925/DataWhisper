"use client";
import { useEffect, useState } from "react";

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    title: "Upload Any File",
    desc: "CSV, Excel, JSON — drag and drop. Instant parsing, zero configuration.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    title: "Ask in Plain English",
    desc: "\"Which region lost money?\" — no SQL, no formulas. Type and get answers.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    title: "Live Charts",
    desc: "Bar, line, scatter, heatmap — generated automatically from your data.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    title: "Deep Analysis",
    desc: "Outliers, trends, correlations — surfaced automatically, explained clearly.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
    title: "Export Reports",
    desc: "One-click PDF reports with all charts and insights, ready to share.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: "100% Private",
    desc: "Your data stays in your session. No cloud storage, no tracking.",
  },
];

const chatMessages = [
  { role: "user", text: "Which product category had the highest profit?" },
  { role: "ai", text: "Technology leads with $14,200 profit — 43% of total. Furniture is losing money due to high discounts. Want a breakdown?" },
  { role: "user", text: "Yes, show me a chart." },
  { role: "ai", text: "Generating profit breakdown by category..." },
];

export default function Home() {
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    setHeroVisible(true);
    const t1 = setTimeout(() => setBarsVisible(true), 800);
    const timer = setInterval(() => {
      setVisibleMessages((v) => (v < chatMessages.length ? v + 1 : v));
    }, 1400);
    return () => {
      clearInterval(timer);
      clearTimeout(t1);
    };
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "#09090B", color: "#FAFAFA", overflowX: "hidden", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 2rem",
        height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(9,9,11,0.85)",
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px",
            background: "#6366F1",
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.02em",
            color: "white",
          }}>DW</div>
          <span style={{ fontWeight: 600, fontSize: "15px", letterSpacing: "-0.01em" }}>
            DataWhisper
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <a href="#features" style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", textDecoration: "none", transition: "color 0.2s" }}
            onMouseOver={e => (e.currentTarget.style.color = "#fff")}
            onMouseOut={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}>
            Features
          </a>
          <a href="#demo" style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", textDecoration: "none", transition: "color 0.2s" }}
            onMouseOver={e => (e.currentTarget.style.color = "#fff")}
            onMouseOut={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
          >
            Demo
          </a>
          <button style={{
            background: "#6366F1", color: "white",
            border: "none", borderRadius: "8px",
            padding: "8px 18px", fontSize: "14px", fontWeight: 500,
            cursor: "pointer", transition: "background 0.2s, transform 0.1s",
          }}
            onMouseOver={e => (e.currentTarget.style.background = "#4F46E5")}
            onMouseOut={e => (e.currentTarget.style.background = "#6366F1")}
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        maxWidth: "900px", margin: "0 auto", padding: "100px 2rem 80px",
        textAlign: "center",
        opacity: heroVisible ? 1 : 0,
        transform: heroVisible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(99,102,241,0.1)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: "100px",
          padding: "5px 14px",
          fontSize: "12px", fontWeight: 500,
          color: "#A5B4FC",
          marginBottom: "32px",
          letterSpacing: "0.02em",
        }}>
          <span style={{ width: "6px", height: "6px", background: "#6366F1", borderRadius: "50%", display: "inline-block" }} />
          Powered by Gemini AI · Python · FastAPI
        </div>

        <h1 style={{
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          marginBottom: "24px",
          color: "#FAFAFA",
        }}>
          Your data has<br />
          <span style={{ color: "#6366F1" }}>a story to tell</span>
        </h1>

        <p style={{
          fontSize: "1.125rem",
          color: "rgba(255,255,255,0.45)",
          maxWidth: "520px", margin: "0 auto 40px",
          lineHeight: 1.7,
          fontWeight: 400,
        }}>
          Upload a CSV or Excel file. Ask questions in plain English.
          Get instant charts, analysis, and downloadable reports — all AI-powered.
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
          <button style={{
            background: "#6366F1", color: "white",
            border: "none", borderRadius: "10px",
            padding: "14px 28px", fontSize: "15px", fontWeight: 600,
            cursor: "pointer", transition: "background 0.2s, transform 0.1s",
            letterSpacing: "-0.01em",
          }}
            onMouseOver={e => { e.currentTarget.style.background = "#4F46E5"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseOut={e => { e.currentTarget.style.background = "#6366F1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Upload your data →
          </button>
          <button style={{
            background: "transparent", color: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px",
            padding: "14px 28px", fontSize: "15px", fontWeight: 500,
            cursor: "pointer", transition: "border-color 0.2s, color 0.2s",
          }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.color = "#fff"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
          >
            Watch demo
          </button>
        </div>

        {/* STATS ROW */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1px", marginTop: "72px",
          background: "rgba(255,255,255,0.06)",
          borderRadius: "12px", overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          {[
            { value: "10×", label: "Faster insights" },
            { value: "99%", label: "Accuracy" },
            { value: "50+", label: "Chart types" },
            { value: "∞", label: "Data rows" },
          ].map((s, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.02)", padding: "20px 16px", textAlign: "center",
            }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#FAFAFA", letterSpacing: "-0.03em" }}>{s.value}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "4px", fontWeight: 400 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DIVIDER */}
      <div style={{ width: "1px", height: "60px", background: "rgba(255,255,255,0.08)", margin: "0 auto" }} />

      {/* LIVE DEMO */}
      <section id="demo" style={{ maxWidth: "1000px", margin: "0 auto", padding: "80px 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", color: "#6366F1", textTransform: "uppercase", marginBottom: "12px" }}>Live demo</p>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.025em", color: "#FAFAFA" }}>
            See it in action
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {/* Chat */}
          <div style={{
            background: "#111113",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px", padding: "20px",
          }}>
            <div style={{
              fontSize: "12px", color: "rgba(255,255,255,0.3)", fontWeight: 500,
              marginBottom: "20px", paddingBottom: "16px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <span style={{ width: "6px", height: "6px", background: "#22C55E", borderRadius: "50%" }} />
              superstore_sales.csv
            </div>

            <div style={{ minHeight: "200px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {chatMessages.slice(0, visibleMessages).map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "75%", padding: "10px 14px", borderRadius: "10px",
                    fontSize: "13px", lineHeight: 1.5,
                    background: msg.role === "user" ? "#6366F1" : "rgba(255,255,255,0.05)",
                    color: msg.role === "user" ? "white" : "rgba(255,255,255,0.7)",
                    border: msg.role === "ai" ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}>
                    {msg.role === "ai" && (
                      <div style={{ fontSize: "10px", color: "#A5B4FC", fontWeight: 600, letterSpacing: "0.05em", marginBottom: "4px", textTransform: "uppercase" }}>
                        DataWhisper AI
                      </div>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}
              {visibleMessages < chatMessages.length && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{
                    padding: "10px 14px", borderRadius: "10px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    display: "flex", gap: "4px", alignItems: "center",
                  }}>
                    {[0, 150, 300].map((delay) => (
                      <div key={delay} style={{
                        width: "5px", height: "5px", background: "#6366F1", borderRadius: "50%",
                        animation: "bounce 1.2s infinite",
                        animationDelay: `${delay}ms`,
                      }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="Ask about your data..."
                style={{
                  flex: 1, background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px",
                  padding: "9px 14px", fontSize: "13px", color: "rgba(255,255,255,0.6)",
                  outline: "none",
                }}
              />
              <button style={{
                background: "#6366F1", border: "none", borderRadius: "8px",
                padding: "9px 16px", fontSize: "13px", fontWeight: 500,
                color: "white", cursor: "pointer",
              }}>Ask</button>
            </div>
          </div>

          {/* Chart */}
          <div style={{
            background: "#111113",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px", padding: "20px",
          }}>
            <div style={{
              fontSize: "12px", color: "rgba(255,255,255,0.3)", fontWeight: 500,
              marginBottom: "20px", paddingBottom: "16px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              Profit by Category — Auto Generated
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {[
                { label: "Technology", value: 85, color: "#6366F1", amount: "$14,200" },
                { label: "Office Supplies", value: 52, color: "#6366F1", amount: "$8,700" },
                { label: "Furniture", value: 18, color: "#EF4444", amount: "−$3,100" },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontWeight: 400 }}>{item.label}</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: item.amount.startsWith("−") ? "#EF4444" : "#22C55E" }}>
                      {item.amount}
                    </span>
                  </div>
                  <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", background: item.color, borderRadius: "2px",
                      width: barsVisible ? `${item.value}%` : "0%",
                      transition: `width 0.9s ease ${i * 0.15}s`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: "28px", paddingTop: "16px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", textAlign: "center",
            }}>
              {[
                { value: "$22.9k", label: "Total Profit", color: "#22C55E" },
                { value: "847", label: "Orders", color: "#A5B4FC" },
                { value: "62%", label: "Margin", color: "#A5B4FC" },
              ].map((m, i) => (
                <div key={i}>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, color: m.color, letterSpacing: "-0.02em" }}>{m.value}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "3px" }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div style={{ width: "1px", height: "60px", background: "rgba(255,255,255,0.08)", margin: "0 auto" }} />

      {/* FEATURES */}
      <section id="features" style={{ maxWidth: "1000px", margin: "0 auto", padding: "80px 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", color: "#6366F1", textTransform: "uppercase", marginBottom: "12px" }}>Capabilities</p>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.025em", color: "#FAFAFA" }}>
            Everything you need
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "rgba(255,255,255,0.06)", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: "#09090B", padding: "28px 24px",
              transition: "background 0.2s",
            }}
              onMouseOver={e => (e.currentTarget.style.background = "#111113")}
              onMouseOut={e => (e.currentTarget.style.background = "#09090B")}
            >
              <div style={{ color: "#6366F1", marginBottom: "14px" }}>{f.icon}</div>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#FAFAFA", marginBottom: "8px", letterSpacing: "-0.01em" }}>{f.title}</h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, fontWeight: 400 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 2rem 100px", textAlign: "center" }}>
        <div style={{
          background: "#111113",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: "16px",
          padding: "56px 40px",
        }}>
          <h2 style={{
            fontSize: "2rem", fontWeight: 700,
            letterSpacing: "-0.025em", color: "#FAFAFA",
            marginBottom: "16px",
          }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", marginBottom: "32px", lineHeight: 1.6 }}>
            Upload your first file and ask anything. No account required.
          </p>
          <button style={{
            background: "#6366F1", color: "white",
            border: "none", borderRadius: "10px",
            padding: "14px 32px", fontSize: "15px", fontWeight: 600,
            cursor: "pointer", letterSpacing: "-0.01em",
            transition: "background 0.2s, transform 0.1s",
          }}
            onMouseOver={e => { e.currentTarget.style.background = "#4F46E5"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseOut={e => { e.currentTarget.style.background = "#6366F1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Start for free →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "32px 2rem",
        textAlign: "center",
      }}>
        <p style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>
          DataWhisper — Built by Amina Ahsan
        </p>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", marginTop: "6px" }}>
          CS Student · University of the Punjab · Python · FastAPI · Next.js · Gemini AI
        </p>
      </footer>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        @media (max-width: 720px) {
          section > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          section > div[style*="grid-template-columns: repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </main>
  );
}
