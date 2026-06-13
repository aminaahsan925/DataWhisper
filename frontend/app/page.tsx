"use client";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: "10x", label: "Faster insights" },
  { value: "99%", label: "Accuracy rate" },
  { value: "50+", label: "Chart types" },
  { value: "∞", label: "Data rows" },
];

const features = [
  {
    icon: "📁",
    title: "Upload Any File",
    desc: "CSV, Excel, JSON — drag and drop. Instant parsing with zero setup.",
    color: "from-violet-500/20 to-violet-500/5",
    border: "border-violet-500/30",
    glow: "shadow-violet-500/20",
  },
  {
    icon: "🤖",
    title: "Ask AI Anything",
    desc: "\"Which region lost money last quarter?\" — plain English, instant answer.",
    color: "from-cyan-500/20 to-cyan-500/5",
    border: "border-cyan-500/30",
    glow: "shadow-cyan-500/20",
  },
  {
    icon: "📊",
    title: "Live Charts",
    desc: "Bar, line, scatter, heatmap — auto-generated from your data in seconds.",
    color: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/20",
  },
  {
    icon: "🔍",
    title: "Deep Analysis",
    desc: "Outliers, trends, correlations — discovered automatically, explained clearly.",
    color: "from-pink-500/20 to-pink-500/5",
    border: "border-pink-500/30",
    glow: "shadow-pink-500/20",
  },
  {
    icon: "📄",
    title: "Export Reports",
    desc: "One-click PDF reports with all charts and insights, ready to share.",
    color: "from-amber-500/20 to-amber-500/5",
    border: "border-amber-500/30",
    glow: "shadow-amber-500/20",
  },
  {
    icon: "🔒",
    title: "100% Private",
    desc: "Your data never leaves your session. No storage, no tracking, ever.",
    color: "from-rose-500/20 to-rose-500/5",
    border: "border-rose-500/30",
    glow: "shadow-rose-500/20",
  },
];

const chatMessages = [
  { role: "user", text: "Which product category had the highest profit?" },
  { role: "ai", text: "Technology leads with $14,200 profit — 43% of total. Furniture is losing money due to high discounts. Want a breakdown chart?" },
  { role: "user", text: "Yes, show me a chart!" },
  { role: "ai", text: "📊 Generating profit breakdown by category..." },
];

export default function Home() {
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const [heroVisible, setHeroVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setHeroVisible(true);
    const timer = setInterval(() => {
      setVisibleMessages((v) => (v < chatMessages.length ? v + 1 : v));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const targets = [10, 99, 50, 100];
    const interval = setInterval(() => {
      setCounts((prev) =>
        prev.map((v, i) => (v < targets[i] ? v + Math.ceil(targets[i] / 40) : targets[i]))
      );
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }
    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${p.alpha})`;
        ctx.fill();
      });
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach((q) => {
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(139,92,246,${0.15 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <main className="min-h-screen bg-[#030712] text-white overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />

      {/* NAVBAR */}
      <nav className="relative z-10 border-b border-white/5 px-6 py-4 flex items-center justify-between backdrop-blur-sm bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-violet-500/30">
            DW
          </div>
          <span className="font-bold text-lg tracking-tight">
            Data<span className="text-violet-400">Whisper</span>
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
          <a href="#demo" className="text-gray-400 hover:text-white transition-colors">Demo</a>
          <button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white px-5 py-2 rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-105">
            Launch App →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className={`transition-all duration-1000 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></span>
            Powered by Gemini AI + Python
          </div>

          <h1 className="text-6xl md:text-7xl font-black leading-none mb-6 tracking-tight">
            Your data has
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent animate-pulse">
              a story to tell
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Upload your CSV or Excel file. Ask questions in plain English.
            Get instant charts, deep insights, and downloadable reports — all powered by AI.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap mb-16">
            <button className="group bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105">
              <span className="flex items-center gap-2">
                Upload your data
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </button>
            <button className="border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-gray-300 px-8 py-4 rounded-2xl font-bold text-lg transition-all backdrop-blur-sm">
              Watch demo ▶
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm hover:border-violet-500/30 transition-colors">
                <div className="text-3xl font-black bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="text-gray-400 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE DEMO CHAT */}
      <section id="demo" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">
            See it in <span className="text-violet-400">action</span>
          </h2>
          <p className="text-gray-400 text-lg">Real conversation with your data</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Chat window */}
          <div className="bg-gray-900/80 border border-white/10 rounded-3xl p-6 backdrop-blur-sm shadow-2xl shadow-violet-500/10">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-gray-400 text-sm">DataWhisper AI — superstore_sales.csv</span>
            </div>

            <div className="space-y-4 min-h-48">
              {chatMessages.slice(0, visibleMessages).map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                  <div className={`max-w-xs px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-br-sm"
                      : "bg-white/10 text-gray-200 rounded-bl-sm border border-white/10"
                  }`}>
                    {msg.role === "ai" && (
                      <span className="text-violet-400 font-bold text-xs block mb-1">DataWhisper AI</span>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}
              {visibleMessages < chatMessages.length && (
                <div className="flex justify-start">
                  <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay:"0.15s"}}></div>
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay:"0.3s"}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Ask about your data..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 placeholder-gray-600 outline-none focus:border-violet-500/50 transition-colors"
              />
              <button className="bg-violet-600 hover:bg-violet-500 px-4 py-2.5 rounded-xl transition-colors text-sm font-semibold">
                Ask →
              </button>
            </div>
          </div>

          {/* Fake chart visual */}
          <div className="bg-gray-900/80 border border-white/10 rounded-3xl p-6 backdrop-blur-sm shadow-2xl shadow-cyan-500/10">
            <div className="text-sm text-gray-400 mb-4 font-semibold">📊 Profit by Category — Auto Generated</div>
            <div className="space-y-4">
              {[
                { label: "Technology", value: 85, color: "from-violet-500 to-cyan-500", amount: "$14,200" },
                { label: "Office Supplies", value: 52, color: "from-cyan-500 to-emerald-500", amount: "$8,700" },
                { label: "Furniture", value: 18, color: "from-rose-500 to-pink-500", amount: "-$3,100" },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-300">{item.label}</span>
                    <span className={item.amount.startsWith("-") ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                      {item.amount}
                    </span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`}
                      style={{ width: visibleMessages > 1 ? `${item.value}%` : "0%" }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-emerald-400 font-black text-lg">$22.9k</div>
                <div className="text-gray-500 text-xs">Total Profit</div>
              </div>
              <div>
                <div className="text-violet-400 font-black text-lg">847</div>
                <div className="text-gray-500 text-xs">Orders</div>
              </div>
              <div>
                <div className="text-cyan-400 font-black text-lg">62%</div>
                <div className="text-gray-500 text-xs">Margin</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black mb-4">
            Everything you need to
            <span className="text-cyan-400"> understand your data</span>
          </h2>
          <p className="text-gray-400 text-lg">Built for analysts, students, and business teams</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className={`group bg-gradient-to-b ${f.color} border ${f.border} rounded-3xl p-6 hover:shadow-xl ${f.glow} transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-lg mb-2 text-white">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-r from-violet-500/10 via-cyan-500/10 to-emerald-500/10 border border-white/10 rounded-3xl p-12 backdrop-blur-sm">
          <h2 className="text-4xl font-black mb-4">
            Ready to whisper to
            <span className="text-violet-400"> your data?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of analysts who turned their raw data into clear decisions.
          </p>
          <button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-violet-500/30 hover:scale-105">
            Start for free — no signup needed
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-8 text-center text-gray-600 text-sm">
        <p className="text-gray-400 font-semibold">DataWhisper — Built by Amina Ahsan</p>
        <p className="mt-1">CS Student · University of the Punjab · Python · FastAPI · Next.js · Gemini AI</p>
      </footer>
    </main>
  );
}
