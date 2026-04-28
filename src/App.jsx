import { useState, useMemo, useRef } from "react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CURRENT_YEAR = new Date().getFullYear();
const EARN_CATEGORIES = ["Salary","Freelance","Investments","Bonus","Side Hustle","Gifts","Other"];
const EXP_CATEGORIES = ["Food","Transport","Housing","Entertainment","Utilities","Healthcare","Shopping","Education","Other"];
const MAX_UNDO = 30;

const defaultYearData = () => {
  const d = {};
  MONTHS.forEach((_, i) => { d[i] = { earnings: [], expenses: [] }; });
  return d;
};
let nextId = 1;

// ─── EARNING ICONS (Garden / Growth theme) ───
const EarnIcons = {
  Salary: ({ a, o }) => (<>
    <rect x="10" y="12" width="40" height="46" rx="2" fill={a?"#047857":"#444"} opacity={o}/>
    <rect x="14" y="16" width="10" height="7" rx="1" fill={a?"#34d399":"#555"} opacity={o}/>
    <rect x="28" y="16" width="10" height="7" rx="1" fill={a?"#34d399":"#555"} opacity={o}/>
    <rect x="14" y="27" width="10" height="7" rx="1" fill={a?"#6ee7b7":"#555"} opacity={o}/>
    <rect x="28" y="27" width="10" height="7" rx="1" fill={a?"#6ee7b7":"#555"} opacity={o}/>
    <rect x="14" y="38" width="10" height="7" rx="1" fill={a?"#34d399":"#555"} opacity={o}/>
    <rect x="28" y="38" width="10" height="7" rx="1" fill={a?"#34d399":"#555"} opacity={o}/>
    <rect x="24" y="48" width="12" height="10" rx="1" fill={a?"#a7f3d0":"#555"} opacity={o}/>
    <polygon points="2,14 30,-4 58,14" fill={a?"#065f46":"#3a3a3a"} opacity={o}/>
    {a&&<rect x="28" y="-8" width="4" height="8" fill="#059669" opacity={0.8}/>}
    {a&&<polygon points="26,-8 30,-16 34,-8" fill="#34d399" opacity={0.7}/>}
  </>),
  Freelance: ({ a, o }) => (<>
    <rect x="6" y="18" width="48" height="30" rx="3" fill={a?"#5b21b6":"#444"} opacity={o}/>
    <rect x="10" y="22" width="40" height="22" rx="2" fill={a?"#7c3aed":"#555"} opacity={o}/>
    {a&&<><text x="30" y="37" textAnchor="middle" fill="#c4b5fd" fontSize="8" fontFamily="monospace" opacity={0.9}>{"< / >"}</text>
    <rect x="14" y="27" width="16" height="2" rx="1" fill="#a78bfa" opacity={0.4}/>
    <rect x="14" y="31" width="12" height="2" rx="1" fill="#a78bfa" opacity={0.3}/></>}
    <path d="M2,48 L58,48 L54,52 Q30,56 6,52 Z" fill={a?"#4c1d95":"#3a3a3a"} opacity={o}/>
    {a&&<circle cx="30" cy="54" r="2" fill="#7c3aed" opacity={0.5}/>}
  </>),
  Investments: ({ a, o }) => (<>
    <rect x="8" y="50" width="44" height="8" rx="2" fill={a?"#92400e":"#444"} opacity={o}/>
    <line x1="14" y1="50" x2="14" y2="40" stroke={a?"#059669":"#555"} strokeWidth="3" opacity={o}/>
    <ellipse cx="14" cy="36" rx="6" ry="5" fill={a?"#34d399":"#555"} opacity={o}/>
    {a&&<ellipse cx="11" cy="34" rx="4" ry="3" fill="#6ee7b7" opacity={0.5}/>}
    <line x1="30" y1="50" x2="30" y2="28" stroke={a?"#059669":"#555"} strokeWidth="3" opacity={o}/>
    <ellipse cx="30" cy="24" rx="8" ry="6" fill={a?"#10b981":"#555"} opacity={o}/>
    {a&&<ellipse cx="27" cy="22" rx="5" ry="4" fill="#6ee7b7" opacity={0.4}/>}
    <line x1="46" y1="50" x2="46" y2="16" stroke={a?"#059669":"#555"} strokeWidth="4" opacity={o}/>
    <ellipse cx="46" cy="12" rx="10" ry="7" fill={a?"#34d399":"#555"} opacity={o}/>
    {a&&<><ellipse cx="42" cy="10" rx="6" ry="5" fill="#6ee7b7" opacity={0.4}/>
    <circle cx="46" cy="8" r="3" fill="#fbbf24" opacity={0.8}/>
    <text x="46" y="10" textAnchor="middle" fill="#92400e" fontSize="4" fontWeight="700">$</text></>}
  </>),
  Bonus: ({ a, o }) => (<>
    <rect x="14" y="28" width="32" height="28" rx="3" fill={a?"#dc2626":"#444"} opacity={o}/>
    <rect x="10" y="22" width="40" height="10" rx="3" fill={a?"#ef4444":"#555"} opacity={o}/>
    <rect x="27" y="22" width="6" height="34" fill={a?"#fecdd3":"#555"} opacity={o}/>
    <rect x="10" y="33" width="40" height="4" fill={a?"#fecdd3":"#555"} opacity={o}/>
    <path d="M30,22 Q20,6 12,16" stroke={a?"#fbbf24":"#555"} strokeWidth="3" fill="none" opacity={o}/>
    <path d="M30,22 Q40,6 48,16" stroke={a?"#fbbf24":"#555"} strokeWidth="3" fill="none" opacity={o}/>
    {a&&<><circle cx="12" cy="14" r="3" fill="#fbbf24" opacity={0.8}/>
    <circle cx="48" cy="14" r="3" fill="#fbbf24" opacity={0.8}/></>}
  </>),
  "Side Hustle": ({ a, o }) => (<>
    <path d="M16,20 L16,52 Q16,56 20,56 L40,56 Q44,56 44,52 L44,20 Q44,16 40,16 L20,16 Q16,16 16,20 Z" fill={a?"#ea580c":"#444"} opacity={o}/>
    <path d="M44,30 Q56,30 56,40 Q56,50 44,50" stroke={a?"#fb923c":"#555"} strokeWidth="3" fill="none" opacity={o}/>
    <ellipse cx="30" cy="58" rx="16" ry="3" fill={a?"#9a3412":"#3a3a3a"} opacity={o}/>
    {a&&<><path d="M24,12 Q24,4 28,8" stroke="#fdba74" strokeWidth="2" fill="none" opacity={0.7}/>
    <path d="M30,10 Q30,2 34,6" stroke="#fed7aa" strokeWidth="2" fill="none" opacity={0.6}/>
    <path d="M36,12 Q36,6 40,10" stroke="#fdba74" strokeWidth="1.5" fill="none" opacity={0.5}/></>}
  </>),
  Gifts: ({ a, o }) => (<>
    <path d="M30,56 L8,34 Q2,20 16,16 Q26,13 30,28 Q34,13 44,16 Q58,20 52,34 Z" fill={a?"#e11d48":"#444"} opacity={o}/>
    {a&&<><path d="M30,56 L8,34 Q2,20 16,16 Q26,13 30,28 Q34,13 44,16 Q58,20 52,34 Z" fill="none" stroke="#fda4af" strokeWidth="1.5" opacity={0.5}/>
    <path d="M20,22 Q24,28 30,28" stroke="#fecdd3" strokeWidth="1" fill="none" opacity={0.6}/>
    <path d="M40,22 Q36,28 30,28" stroke="#fecdd3" strokeWidth="1" fill="none" opacity={0.6}/></>}
  </>),
  Other: ({ a, o }) => (<>
    <circle cx="30" cy="32" r="20" fill={a?"#0e7490":"#444"} opacity={o}/>
    <circle cx="30" cy="32" r="14" fill={a?"#06b6d4":"#555"} opacity={o} strokeWidth="0"/>
    <text x="30" y="37" textAnchor="middle" fill={a?"#ecfeff":"#777"} fontSize="18" fontWeight="700" opacity={o}>+</text>
    {a&&<circle cx="30" cy="32" r="20" fill="none" stroke="#22d3ee" strokeWidth="1.5" opacity={0.3} strokeDasharray="4 3"/>}
  </>),
};

// ─── EXPENSE ICONS (Cityscape / Life theme) ───
const ExpIcons = {
  Food: ({ a, o }) => (<>
    <circle cx="30" cy="34" r="20" fill={a?"#991b1b":"#444"} opacity={o}/>
    <circle cx="30" cy="34" r="16" fill={a?"#fecaca":"#555"} opacity={o}/>
    <circle cx="30" cy="34" r="10" fill={a?"#fca5a5":"#555"} opacity={o}/>
    {a&&<><circle cx="26" cy="32" r="3" fill="#ef4444" opacity={0.7}/>
    <circle cx="34" cy="30" r="2" fill="#dc2626" opacity={0.6}/>
    <circle cx="30" cy="38" r="2.5" fill="#f87171" opacity={0.5}/>
    <rect x="6" y="14" width="2.5" height="22" rx="1" fill="#fbbf24" opacity={0.9}/>
    <rect x="2" y="14" width="2" height="14" rx="1" fill="#fbbf24" opacity={0.8}/>
    <rect x="10" y="14" width="2" height="14" rx="1" fill="#fbbf24" opacity={0.8}/>
    <rect x="6" y="12" width="2.5" height="4" rx="1" fill="#f59e0b" opacity={0.9}/></>}
  </>),
  Transport: ({ a, o }) => (<>
    <rect x="4" y="30" width="52" height="20" rx="5" fill={a?"#1e40af":"#444"} opacity={o}/>
    <path d="M12,30 L18,14 L42,14 L48,30" fill={a?"#2563eb":"#555"} opacity={o}/>
    <rect x="20" y="16" width="8" height="12" rx="2" fill={a?"#93c5fd":"#666"} opacity={o}/>
    <rect x="32" y="16" width="8" height="12" rx="2" fill={a?"#93c5fd":"#666"} opacity={o}/>
    <circle cx="16" cy="50" r="6" fill={a?"#1e3a8a":"#3a3a3a"} opacity={o}/>
    <circle cx="16" cy="50" r="3" fill={a?"#64748b":"#555"} opacity={o}/>
    <circle cx="44" cy="50" r="6" fill={a?"#1e3a8a":"#3a3a3a"} opacity={o}/>
    <circle cx="44" cy="50" r="3" fill={a?"#64748b":"#555"} opacity={o}/>
    {a&&<><rect x="4" y="38" width="12" height="3" rx="1" fill="#fbbf24" opacity={0.9}/>
    <rect x="44" y="38" width="12" height="3" rx="1" fill="#f87171" opacity={0.8}/></>}
  </>),
  Housing: ({ a, o }) => (<>
    <rect x="10" y="28" width="40" height="30" fill={a?"#92400e":"#444"} opacity={o}/>
    <polygon points="-2,30 30,4 62,30" fill={a?"#b45309":"#555"} opacity={o}/>
    <rect x="24" y="40" width="12" height="18" rx="1" fill={a?"#fbbf24":"#555"} opacity={o}/>
    {a&&<circle cx="33" cy="50" r="1.5" fill="#92400e"/>}
    <rect x="14" y="32" width="8" height="8" rx="1" fill={a?"#fde68a":"#555"} opacity={o}/>
    <rect x="38" y="32" width="8" height="8" rx="1" fill={a?"#fde68a":"#555"} opacity={o}/>
    {a&&<><line x1="18" y1="32" x2="18" y2="40" stroke="#d97706" strokeWidth="0.8" opacity={0.5}/>
    <line x1="14" y1="36" x2="22" y2="36" stroke="#d97706" strokeWidth="0.8" opacity={0.5}/>
    <rect x="42" y="14" width="6" height="16" rx="1" fill="#78716c" opacity={0.7}/>
    <rect x="44" y="10" width="2" height="6" fill="#a8a29e" opacity={0.6}/></>}
  </>),
  Entertainment: ({ a, o }) => (<>
    <rect x="4" y="22" width="52" height="26" rx="13" fill={a?"#5b21b6":"#444"} opacity={o}/>
    <circle cx="18" cy="33" r="4" fill={a?"#c4b5fd":"#555"} opacity={o}/>
    <rect x="14" y="31" width="8" height="2.5" rx="1" fill={a?"#ddd6fe":"#555"} opacity={o}/>
    <rect x="16.5" y="28" width="2.5" height="8" rx="1" fill={a?"#ddd6fe":"#555"} opacity={o}/>
    <circle cx="40" cy="29" r="3" fill={a?"#a78bfa":"#555"} opacity={o}/>
    <circle cx="46" cy="35" r="3" fill={a?"#c4b5fd":"#555"} opacity={o}/>
    <circle cx="40" cy="39" r="2.5" fill={a?"#8b5cf6":"#555"} opacity={o}/>
    <circle cx="34" cy="35" r="2.5" fill={a?"#ddd6fe":"#555"} opacity={o}/>
    <path d="M12,48 Q8,58 16,58 L22,58 Q16,48 12,48" fill={a?"#4c1d95":"#3a3a3a"} opacity={o}/>
    <path d="M48,48 Q52,58 44,58 L38,58 Q44,48 48,48" fill={a?"#4c1d95":"#3a3a3a"} opacity={o}/>
    {a&&<><circle cx="40" cy="29" r="1.2" fill="#ede9fe"/>
    <circle cx="46" cy="35" r="1.2" fill="#ede9fe"/></>}
  </>),
  Utilities: ({ a, o }) => (<>
    <polygon points="34,4 16,32 26,32 22,58 46,26 34,26" fill={a?"#ca8a04":"#444"} opacity={o}/>
    {a&&<><polygon points="34,4 16,32 26,32 22,58 46,26 34,26" fill="none" stroke="#fde68a" strokeWidth="2" opacity={0.3}/>
    <polygon points="34,12 22,30 28,30 26,48 40,28 34,28" fill="#fef08a" opacity={0.25}/></>}
  </>),
  Healthcare: ({ a, o }) => (<>
    <circle cx="30" cy="32" r="22" fill={a?"#991b1b":"#444"} opacity={o}/>
    <circle cx="30" cy="32" r="18" fill={a?"#dc2626":"#555"} opacity={o}/>
    <rect x="24" y="18" width="12" height="28" rx="3" fill={a?"#fef2f2":"#666"} opacity={o}/>
    <rect x="16" y="26" width="28" height="12" rx="3" fill={a?"#fef2f2":"#666"} opacity={o}/>
    {a&&<circle cx="30" cy="32" r="18" fill="none" stroke="#fecaca" strokeWidth="1" opacity={0.4} strokeDasharray="3 2"/>}
  </>),
  Shopping: ({ a, o }) => (<>
    <path d="M12,22 L10,56 Q10,58 12,58 L48,58 Q50,58 50,56 L48,22 Z" fill={a?"#be123c":"#444"} opacity={o}/>
    <path d="M20,22 Q20,8 30,8 Q40,8 40,22" stroke={a?"#fda4af":"#555"} strokeWidth="3" fill="none" opacity={o}/>
    {a&&<><path d="M20,22 Q20,8 30,8 Q40,8 40,22" stroke="#fecdd3" strokeWidth="1.5" fill="none" opacity={0.3}/>
    <circle cx="30" cy="38" r="6" fill="#fecdd3" opacity={0.9}/>
    <circle cx="30" cy="38" r="3" fill="#be123c" opacity={0.8}/>
    <rect x="16" y="46" width="28" height="1" fill="#fda4af" opacity={0.3}/></>}
    {!a&&<circle cx="30" cy="38" r="5" fill="#555" opacity={o}/>}
  </>),
  Education: ({ a, o }) => (<>
    <polygon points="30,12 2,28 30,44 58,28" fill={a?"#1e40af":"#444"} opacity={o}/>
    <polygon points="30,16 8,28 30,40 52,28" fill={a?"#2563eb":"#555"} opacity={o}/>
    <path d="M18,32 L18,48 Q18,52 30,54 Q42,52 42,48 L42,32" fill={a?"#1d4ed8":"#555"} opacity={o}/>
    {a&&<path d="M18,32 L18,48 Q18,52 30,54 Q42,52 42,48 L42,32" fill="none" stroke="#60a5fa" strokeWidth="1" opacity={0.4}/>}
    <line x1="52" y1="28" x2="52" y2="54" stroke={a?"#fbbf24":"#555"} strokeWidth="2.5" opacity={o}/>
    <circle cx="52" cy="56" r="3.5" fill={a?"#fbbf24":"#555"} opacity={o}/>
    {a&&<circle cx="52" cy="56" r="1.5" fill="#f59e0b" opacity={0.8}/>}
  </>),
  Other: ({ a, o }) => (<>
    <circle cx="30" cy="32" r="20" fill={a?"#4b5563":"#444"} opacity={o}/>
    <circle cx="30" cy="32" r="15" fill={a?"#6b7280":"#555"} opacity={o}/>
    <circle cx="22" cy="30" r="2.5" fill={a?"#d1d5db":"#666"} opacity={o}/>
    <circle cx="30" cy="30" r="2.5" fill={a?"#d1d5db":"#666"} opacity={o}/>
    <circle cx="38" cy="30" r="2.5" fill={a?"#d1d5db":"#666"} opacity={o}/>
    {a&&<circle cx="30" cy="32" r="20" fill="none" stroke="#9ca3af" strokeWidth="1" opacity={0.3} strokeDasharray="4 3"/>}
  </>),
};

// ─── SCENE COMPONENT ───
function FinancialScene({ type, data, categories, Icons }) {
  const total = data.reduce((s, e) => s + e.amount, 0);
  const catData = {};
  categories.forEach(c => { catData[c] = 0; });
  data.forEach(e => {
    const cat = e.category || "Other";
    if (catData[cat] !== undefined) catData[cat] += e.amount;
    else catData["Other"] += e.amount;
  });
  const catList = categories.map(c => ({
    name: c, amount: catData[c],
    pct: total > 0 ? (catData[c] / total) * 100 : 0,
    active: catData[c] > 0,
  }));

  const isE = type === "earning";
  const cols = categories.length;
  const spacing = 680 / cols;
  const fmt = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Generate scene-specific particles
  const particles = useMemo(() => Array.from({ length: 35 }, (_, i) => ({
    x: (i * 19.4 + 7) % 680,
    y: 6 + ((i * 13 + 5) % 80),
    r: 0.6 + (i % 4) * 0.5,
    delay: (i * 0.3) % 4,
    speed: 2 + (i % 3),
  })), []);

  return (
    <div style={{
      borderRadius: 14, overflow: "hidden", border: "1px solid #334155",
      marginBottom: 16, background: "#0f172a", position: "relative",
    }}>
      <style>{`
        @keyframes float-${type} { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes twinkle-${type} { 0%,100%{opacity:0.15} 50%{opacity:0.8} }
        .scene-icon-${type} { transition: filter 0.6s ease, opacity 0.6s ease; }
        .scene-icon-${type}.inactive { filter: grayscale(100%) brightness(0.5); }
        .scene-icon-${type}.active { filter: none; }
      `}</style>
      <div style={{ padding: "12px 16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: isE ? "#34d399" : "#f87171" }}>
          {isE ? "↗ Earnings" : "↘ Expenses"} Breakdown
        </h3>
        <span style={{ fontSize: 13, color: "#64748b", fontFamily: "'Space Mono', monospace" }}>
          Total: ${fmt(total)}
        </span>
      </div>

      <svg viewBox="0 0 680 245" style={{ width: "100%", display: "block" }}>
        <defs>
          <linearGradient id={`sky-${type}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isE ? "#022c22" : "#0c0a1a"}/>
            <stop offset="60%" stopColor={isE ? "#064e3b" : "#1e1b4b"}/>
            <stop offset="100%" stopColor={isE ? "#065f46" : "#312e81"}/>
          </linearGradient>
          <radialGradient id={`moon-${type}`}><stop offset="0%" stopColor={isE?"#d1fae5":"#c7d2fe"}/><stop offset="100%" stopColor={isE?"#6ee7b7":"#818cf8"} stopOpacity="0"/></radialGradient>
        </defs>
        <rect width="680" height="245" fill={`url(#sky-${type})`}/>

        {/* Moon / Sun */}
        <circle cx={isE ? 600 : 80} cy="40" r="16" fill={isE ? "#a7f3d0" : "#c7d2fe"} opacity={total > 0 ? 0.9 : 0.2} style={{ transition: "opacity 1s ease" }}/>
        <circle cx={isE ? 600 : 80} cy="40" r="30" fill={`url(#moon-${type})`} opacity={total > 0 ? 0.3 : 0.05} style={{ transition: "opacity 1s ease" }}/>

        {/* Stars / particles */}
        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r}
            fill={total > 0 ? (isE ? "#6ee7b7" : "#a5b4fc") : "#334155"}
            opacity={total > 0 ? 0.3 : 0.1}
            style={{ animation: total > 0 ? `twinkle-${type} ${p.speed}s ease-in-out ${p.delay}s infinite` : "none", transition: "fill 1s ease" }}
          />
        ))}

        {/* Hills / background landscape */}
        <ellipse cx="120" cy="180" rx="160" ry="30" fill={isE ? "#053b2e" : "#1a1640"} opacity={total > 0 ? 0.6 : 0.2} style={{ transition: "opacity 0.8s ease" }}/>
        <ellipse cx="480" cy="182" rx="200" ry="25" fill={isE ? "#042f26" : "#171340"} opacity={total > 0 ? 0.5 : 0.15} style={{ transition: "opacity 0.8s ease" }}/>
        <ellipse cx="340" cy="178" rx="280" ry="20" fill={isE ? "#064e3b" : "#1e1b4b"} opacity={total > 0 ? 0.4 : 0.1} style={{ transition: "opacity 0.8s ease" }}/>

        {/* Ground plane */}
        <rect x="0" y="175" width="680" height="70" fill={total > 0 ? (isE ? "#064e3b" : "#1e1b4b") : "#151525"} style={{ transition: "fill 0.8s ease" }}/>
        <rect x="0" y="175" width="680" height="2" fill={total > 0 ? (isE ? "#34d399" : "#818cf8") : "#222"} opacity={total > 0 ? 0.15 : 0.05} style={{ transition: "opacity 0.8s ease" }}/>

        {/* Category icons */}
        {catList.map((cat, i) => {
          const Icon = Icons[cat.name];
          if (!Icon) return null;
          const iconScale = 0.9;
          const x = spacing * i + spacing / 2 - 30;
          const y = 105;
          const op = cat.active ? Math.max(0.7, Math.min(1, 0.6 + cat.pct / 100)) : 0.2;

          return (
            <g key={cat.name}>

              {/* Floating animation wrapper */}
              <g style={{
                animation: cat.active ? `float-${type} ${7 + i % 3}s ease-in-out ${i * 0.5}s infinite` : "none",
              }}>
                <g
                  className={`scene-icon-${type} ${cat.active ? "active" : "inactive"}`}
                  transform={`translate(${x}, ${y}) scale(${iconScale})`}
                >
                  <Icon a={cat.active} o={op}/>
                </g>
              </g>

              {/* Label */}
              <text x={x + 30} y={192} textAnchor="middle"
                fill={cat.active ? (isE ? "#6ee7b7" : "#c7d2fe") : "#3f3f5c"}
                fontSize="9" fontWeight={cat.active ? "600" : "400"}
                style={{ transition: "fill 0.5s ease" }}>
                {cat.name}
              </text>

              {/* Percentage */}
              <text x={x + 30} y={204} textAnchor="middle"
                fill={cat.active ? (isE ? "#34d399" : "#818cf8") : "#2a2a40"}
                fontSize={cat.active ? "11" : "9"} fontWeight="700" fontFamily="'Space Mono', monospace"
                style={{ transition: "all 0.5s ease" }}>
                {cat.active ? cat.pct.toFixed(1) + "%" : "0%"}
              </text>

              {/* Amount */}
              <text x={x + 30} y={217} textAnchor="middle"
                fill={cat.active ? "#94a3b8" : "#2a2a40"}
                fontSize={cat.active ? "11" : "9"} fontWeight="500" fontFamily="'Space Mono', monospace"
                style={{ transition: "all 0.5s ease" }}>
                {cat.active ? "$" + fmt(cat.amount) : ""}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}


// ─── MAIN APP ───
export default function ExpenseTracker() {
  const [startingBalance, setStartingBalance] = useState("");
  const [editingBalance, setEditingBalance] = useState(true);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [allYearData, setAllYearData] = useState(() => ({ [CURRENT_YEAR]: defaultYearData() }));

  const [earnAmount, setEarnAmount] = useState("");
  const [earnLabel, setEarnLabel] = useState("");
  const [earnCategory, setEarnCategory] = useState(EARN_CATEGORIES[0]);
  const todayStr = new Date().toISOString().split("T")[0];
  const [earnDate, setEarnDate] = useState(todayStr);

  const [expAmount, setExpAmount] = useState("");
  const [expCategory, setExpCategory] = useState(EXP_CATEGORIES[0]);
  const [expLabel, setExpLabel] = useState("");
  const [expDate, setExpDate] = useState(todayStr);

  // Budgets
  const [budgetEntries, setBudgetEntries] = useState([]);
  const [budgetLabel, setBudgetLabel] = useState("");
  const [budgetCategory, setBudgetCategory] = useState(EXP_CATEGORIES[0]);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [editingBudgetId, setEditingBudgetId] = useState(null);
  const [editingBudgetAmount, setEditingBudgetAmount] = useState("");

  const addBudget = () => {
    if (!budgetAmount) return;
    saveSnapshot("Add budget");
    setBudgetEntries(prev => [...prev, { id: nextId++, label: budgetLabel || `Budget ${prev.length + 1}`, category: budgetCategory, amount: parseFloat(budgetAmount) || 0, locked: false, lockedSpent: 0 }]);
    setBudgetAmount(""); setBudgetLabel("");
  };
  const removeBudget = (id) => { saveSnapshot("Remove budget"); setBudgetEntries(prev => prev.filter(b => b.id !== id)); };
  const toggleLockBudget = (id) => {
    saveSnapshot("Toggle budget lock");
    setBudgetEntries(prev => prev.map(b => {
      if (b.id !== id) return b;
      if (!b.locked) {
        // Locking — snapshot current spent amount
        const spent = spendingByCategory[b.category] || 0;
        return { ...b, locked: true, lockedSpent: spent };
      } else {
        // Unlocking — clear snapshot, go back to live tracking
        return { ...b, locked: false, lockedSpent: 0 };
      }
    }));
  };
  const saveEditBudget = (id) => {
    saveSnapshot("Edit budget");
    setBudgetEntries(prev => prev.map(b => b.id === id ? { ...b, amount: parseFloat(editingBudgetAmount) || 0 } : b));
    setEditingBudgetId(null); setEditingBudgetAmount("");
  };

  // Goals
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState("");
  const [goalValue, setGoalValue] = useState("");
  const [goalImage, setGoalImage] = useState("");
  const [goalImageType, setGoalImageType] = useState("preset"); // "preset" | "emoji" | "url"
  const [autoMatched, setAutoMatched] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSource, setAiSource] = useState(""); // "keyword" | "ai"
  const [showGoalForm, setShowGoalForm] = useState(false);

  const GOAL_PRESETS = [
    { emoji: "🚗", label: "Car" },
    { emoji: "🏠", label: "House" },
    { emoji: "💻", label: "Laptop" },
    { emoji: "📱", label: "Phone" },
    { emoji: "✈️", label: "Travel" },
    { emoji: "🎓", label: "Education" },
    { emoji: "👗", label: "Clothing" },
    { emoji: "🎮", label: "Gaming" },
    { emoji: "💍", label: "Jewelry" },
    { emoji: "🏋️", label: "Fitness" },
    { emoji: "🎸", label: "Music" },
    { emoji: "📷", label: "Camera" },
    { emoji: "🛋️", label: "Furniture" },
    { emoji: "🎟️", label: "Tickets" },
    { emoji: "⌚", label: "Watch" },
    { emoji: "🎁", label: "Gift" },
    { emoji: "🏍️", label: "Motorcycle" },
    { emoji: "💰", label: "Savings" },
    { emoji: "🐶", label: "Pet" },
    { emoji: "🔧", label: "Tools" },
  ];

  // Keyword → emoji mapping for auto-match
  const KEYWORD_MAP = [
    { keywords: ["car","tesla","bmw","audi","mercedes","toyota","honda","ford","vehicle","sedan","suv","truck","pickup","civic","camry","mustang","porsche","lambo","lamborghini","ferrari","corvette","jeep","lexus","hyundai","kia","mazda","subaru","nissan","chevy","chevrolet","volkswagen","vw","dodge","chrysler","acura","infiniti","volvo","jaguar","maserati","bentley","rolls","royce","aston","martin","bugatti","mclaren"], emoji: "🚗" },
    { keywords: ["motorcycle","motorbike","harley","ducati","yamaha","kawasaki","suzuki","bike","scooter","vespa"], emoji: "🏍️" },
    { keywords: ["house","home","apartment","condo","flat","mortgage","down payment","property","real estate","rent","townhouse","mansion","villa"], emoji: "🏠" },
    { keywords: ["laptop","computer","macbook","pc","desktop","imac","chromebook","thinkpad","surface","dell","lenovo","asus","acer","razer"], emoji: "💻" },
    { keywords: ["phone","iphone","samsung","pixel","galaxy","android","smartphone","mobile","ipad","tablet","airpods","earbuds","headphones"], emoji: "📱" },
    { keywords: ["travel","trip","vacation","holiday","flight","cruise","resort","hotel","airbnb","backpack","passport","beach","island","europe","asia","japan","paris","london","bali","hawaii","mexico","caribbean","disney","disneyland","disneyworld"], emoji: "✈️" },
    { keywords: ["school","college","university","tuition","course","degree","masters","mba","bootcamp","certification","class","education","textbook","student","study","training"], emoji: "🎓" },
    { keywords: ["clothes","clothing","dress","suit","jacket","coat","hoodie","sneakers","shoes","boots","nike","adidas","jordan","yeezy","puma","vans","converse","gucci","prada","louis vuitton","balenciaga","zara","fashion","outfit","uniform","jersey"], emoji: "👗" },
    { keywords: ["game","gaming","playstation","ps5","ps4","xbox","nintendo","switch","steam","deck","console","controller","vr","oculus","quest","pc gaming","gpu","graphics card","rtx","rig"], emoji: "🎮" },
    { keywords: ["ring","necklace","bracelet","earring","jewelry","jewellery","diamond","gold","silver","pendant","chain","engagement","wedding band","rolex","cartier","tiffany"], emoji: "💍" },
    { keywords: ["gym","fitness","workout","treadmill","weights","dumbbell","peloton","exercise","crossfit","yoga","mat","bench","barbell","kettlebell","protein","supplement"], emoji: "🏋️" },
    { keywords: ["guitar","piano","drum","music","instrument","violin","bass","ukulele","keyboard","speaker","amp","amplifier","microphone","mic","headphone","studio","dj","turntable","saxophone","flute","trumpet"], emoji: "🎸" },
    { keywords: ["camera","photography","dslr","mirrorless","canon","nikon","sony","fuji","gopro","drone","lens","tripod","photo"], emoji: "📷" },
    { keywords: ["furniture","couch","sofa","desk","chair","table","bed","mattress","shelf","bookshelf","dresser","cabinet","ikea","wardrobe","nightstand","ottoman","recliner"], emoji: "🛋️" },
    { keywords: ["ticket","concert","show","festival","event","game ticket","movie","premiere","pass","vip","broadway","theater","theatre","match","season pass","f1","formula"], emoji: "🎟️" },
    { keywords: ["watch","apple watch","smartwatch","fitbit","garmin","rolex","omega","seiko","casio","tag heuer","chronograph","timepiece"], emoji: "⌚" },
    { keywords: ["gift","present","surprise","birthday gift","christmas gift","anniversary"], emoji: "🎁" },
    { keywords: ["save","saving","savings","emergency fund","rainy day","nest egg","retirement","401k","ira","investment","stock","crypto","bitcoin","ethereum"], emoji: "💰" },
    { keywords: ["dog","puppy","golden retriever","labrador","bulldog","poodle","husky","corgi","beagle","rottweiler","pitbull","german shepherd","doberman"], emoji: "🐶" },
    { keywords: ["cat","kitten","persian","siamese","tabby","bengal","ragdoll","maine coon","sphynx"], emoji: "🐱" },
    { keywords: ["pet","aquarium","fish","bird","hamster","rabbit","bunny","parrot","turtle","reptile","terrarium","veterinary","vet","guinea pig"], emoji: "🐾" },
    { keywords: ["tool","tools","drill","saw","wrench","hammer","workshop","garage","renovation","repair","lawnmower","mower","garden","chainsaw","workbench"], emoji: "🔧" },
    { keywords: ["tv","television","monitor","screen","oled","qled","projector","home theater","home theatre","soundbar","roku","fire stick"], emoji: "📺" },
    { keywords: ["bicycle","cycling","trek","specialized","road bike","mountain bike","e-bike","ebike"], emoji: "🚲" },
    { keywords: ["book","books","kindle","e-reader","reading","novel","library","bookshelf collection"], emoji: "📚" },
    { keywords: ["coffee","espresso","latte","cafe","barista","nespresso","breville","coffee machine","grinder"], emoji: "☕" },
    { keywords: ["kitchen","oven","stove","refrigerator","fridge","blender","mixer","cookware","dishwasher","microwave","air fryer","instant pot","food processor"], emoji: "🍳" },
    { keywords: ["baby","nursery","stroller","crib","car seat","infant","newborn","maternity","pregnancy"], emoji: "👶" },
    { keywords: ["wedding","honeymoon","engagement","bridal","groom","ceremony","reception"], emoji: "💒" },
    { keywords: ["boat","yacht","kayak","canoe","jet ski","sailing","marine","fishing boat","pontoon"], emoji: "⛵" },
    { keywords: ["ski","snowboard","skiing","snowboarding","winter sport","snow gear","slopes","lift pass"], emoji: "⛷️" },
    { keywords: ["camp","camping","tent","rv","camper","hiking","backpacking","outdoors","sleeping bag","trail"], emoji: "⛺" },
    { keywords: ["dental","braces","invisalign","teeth","dentist","orthodontic","whitening","implant"], emoji: "🦷" },
    { keywords: ["glasses","sunglasses","contacts","eyewear","frames","prescription","ray-ban","oakley"], emoji: "🕶️" },
    { keywords: ["tattoo","piercing","body art","ink"], emoji: "🎨" },
    { keywords: ["moving","relocation","new city","apartment deposit","security deposit","first month","last month"], emoji: "📦" },
  ];

  const autoMatchEmoji = (name) => {
    const lower = name.toLowerCase();
    for (const entry of KEYWORD_MAP) {
      for (const kw of entry.keywords) {
        if (lower.includes(kw)) return entry.emoji;
      }
    }
    return "";
  };

  const aiTimerRef = useRef(null);

  const aiMatchEmoji = async (name) => {
    const target = name || goalName;
    if (!target.trim()) return;
    setAiLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `I need exactly ONE emoji that best represents this item someone wants to buy or save for: "${target.trim()}". Reply with ONLY the single emoji character, nothing else. No text, no explanation, no quotes — just the emoji.`
          }]
        })
      });
      const data = await response.json();
      const emoji = data.content?.[0]?.text?.trim();
      if (emoji && emoji.length <= 4) {
        setGoalImage(emoji);
        setGoalImageType("emoji");
        setAutoMatched(true);
        setAiSource("ai");
      }
    } catch (err) {
      console.error("AI match error:", err);
    }
    setAiLoading(false);
  };

  const handleGoalNameChange = (val) => {
    setGoalName(val);

    // Clear any pending AI call
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);

    if (goalImageType === "preset" || autoMatched) {
      const match = autoMatchEmoji(val);
      if (match) {
        // Keyword match found — use it instantly
        setGoalImage(match);
        setGoalImageType("emoji");
        setAutoMatched(true);
        setAiSource("keyword");
      } else {
        // No keyword match — clear old match and queue AI after user stops typing
        if (autoMatched) {
          setGoalImage("");
          setGoalImageType("preset");
          setAutoMatched(false);
          setAiSource("");
        }
        if (val.trim().length >= 3) {
          aiTimerRef.current = setTimeout(() => {
            aiMatchEmoji(val);
          }, 800);
        }
      }
    }
  };

  const addGoal = () => {
    if (!goalName || !goalValue) return;
    saveSnapshot("Add goal");
    setGoals(prev => [...prev, { id: nextId++, name: goalName, value: parseFloat(goalValue) || 0, image: goalImage || "", imageType: goalImageType, saved: 0 }]);
    setGoalName(""); setGoalValue(""); setGoalImage(""); setGoalImageType("preset"); setAutoMatched(false); setAiSource(""); setShowGoalForm(false);
  };
  const removeGoal = (id) => { saveSnapshot("Remove goal"); setGoals(prev => prev.filter(g => g.id !== id)); };
  const [goalInputs, setGoalInputs] = useState({});

  const addToGoal = (id) => {
    const amount = parseFloat(goalInputs[id]) || 0;
    if (amount <= 0) return;
    saveSnapshot("Fund goal");
    const available = currentBalance - totalAllocated;
    const toAdd = Math.min(amount, available);
    if (toAdd <= 0) return;
    setGoals(prev => prev.map(g => g.id === id ? { ...g, saved: Math.min(g.value, g.saved + toAdd) } : g));
    setGoalInputs(prev => ({ ...prev, [id]: "" }));
  };

  const transferFromFroggy = (id) => {
    const amount = parseFloat(goalInputs[id]) || 0;
    if (amount <= 0 || froggyBank <= 0) return;
    saveSnapshot("Transfer from Froggy Bank");
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    const spaceInGoal = goal.value - goal.saved;
    const toTransfer = Math.min(amount, froggyBank, spaceInGoal);
    if (toTransfer <= 0) return;
    setGoals(prev => prev.map(g => g.id === id ? { ...g, saved: g.saved + toTransfer } : g));
    setFroggyWithdrawn(prev => prev + toTransfer);
    setGoalInputs(prev => ({ ...prev, [id]: "" }));
  };

  const withdrawFromGoal = (id) => {
    const amount = parseFloat(goalInputs[id]) || 0;
    if (amount <= 0) return;
    saveSnapshot("Withdraw from goal");
    setGoals(prev => prev.map(g => g.id === id ? { ...g, saved: Math.max(0, g.saved - amount) } : g));
    setGoalInputs(prev => ({ ...prev, [id]: "" }));
  };

  const handleYearChange = (val) => {
    const num = parseInt(val);
    if (!isNaN(num) && num > 0) { setSelectedYear(num); setAllYearData(prev => prev[num] ? prev : { ...prev, [num]: defaultYearData() }); }
    else if (val === "") setSelectedYear("");
  };

  const yearData = allYearData[selectedYear] || defaultYearData();
  const isAll = selectedMonth === "all";
  const tableMonth = isAll ? null : selectedMonth;

  const currentBalance = useMemo(() => {
    const start = parseFloat(startingBalance) || 0;
    let totalEarn = 0, totalExp = 0;
    MONTHS.forEach((_, i) => { yearData[i].earnings.forEach(e => { totalEarn += e.amount; }); yearData[i].expenses.forEach(e => { totalExp += e.amount; }); });
    return start + totalEarn - totalExp;
  }, [startingBalance, yearData]);

  const [froggyWithdrawn, setFroggyWithdrawn] = useState(0);

  const froggyBankRaw = useMemo(() => {
    return budgetEntries.reduce((s, b) => {
      if (b.locked) return s + Math.max(0, b.amount - b.lockedSpent);
      return s;
    }, 0);
  }, [budgetEntries]);
  const froggyBank = Math.max(0, froggyBankRaw - froggyWithdrawn);

  const totalAllocated = useMemo(() => goals.reduce((s, g) => s + g.saved, 0) + froggyBank, [goals, froggyBank]);
  const availableBalance = currentBalance - totalAllocated;

  const currentTableData = useMemo(() => {
    if (tableMonth !== null) return yearData[tableMonth];
    const combined = { earnings: [], expenses: [] };
    MONTHS.forEach((_, i) => {
      yearData[i].earnings.forEach(e => combined.earnings.push({ ...e, month: MONTHS[i] }));
      yearData[i].expenses.forEach(e => combined.expenses.push({ ...e, month: MONTHS[i] }));
    });
    return combined;
  }, [yearData, tableMonth]);

  // ─── UNDO SYSTEM ───
  const [undoStack, setUndoStack] = useState([]);
  const [undoMessage, setUndoMessage] = useState("");
  const undoTimerRef = useRef(null);

  const saveSnapshot = (label) => {
    setUndoStack(prev => {
      const snapshot = {
        label,
        startingBalance,
        allYearData: JSON.parse(JSON.stringify(allYearData)),
        budgetEntries: JSON.parse(JSON.stringify(budgetEntries)),
        goals: JSON.parse(JSON.stringify(goals)),
        froggyWithdrawn,
      };
      const next = [...prev, snapshot];
      return next.length > MAX_UNDO ? next.slice(next.length - MAX_UNDO) : next;
    });
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setStartingBalance(last.startingBalance);
    setAllYearData(last.allYearData);
    setBudgetEntries(last.budgetEntries);
    setGoals(last.goals);
    setFroggyWithdrawn(last.froggyWithdrawn);
    setUndoStack(prev => prev.slice(0, -1));
    setUndoMessage(`Undid: ${last.label}`);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => setUndoMessage(""), 2500);
  };

  const addEarning = () => {
    if (!earnAmount) return;
    saveSnapshot("Add earning");
    const dateObj = new Date(earnDate + "T00:00:00");
    const targetMonth = dateObj.getMonth();
    const targetYear = dateObj.getFullYear();
    setAllYearData(prev => {
      const yd = { ...(prev[targetYear] || defaultYearData()) };
      yd[targetMonth] = { ...yd[targetMonth], earnings: [...yd[targetMonth].earnings, { id: nextId++, label: earnLabel || `Earning ${yd[targetMonth].earnings.length + 1}`, amount: parseFloat(earnAmount) || 0, category: earnCategory, date: earnDate }] };
      return { ...prev, [targetYear]: yd };
    });
    if (targetYear !== selectedYear) setSelectedYear(targetYear);
    setEarnAmount(""); setEarnLabel(""); setEarnDate(todayStr);
  };

  const addExpense = () => {
    if (!expAmount) return;
    saveSnapshot("Add expense");
    const amt = parseFloat(expAmount) || 0;
    const dateObj = new Date(expDate + "T00:00:00");
    const targetMonth = dateObj.getMonth();
    const targetYear = dateObj.getFullYear();
    setAllYearData(prev => {
      const yd = { ...(prev[targetYear] || defaultYearData()) };
      yd[targetMonth] = { ...yd[targetMonth], expenses: [...yd[targetMonth].expenses, { id: nextId++, label: expLabel || `Expense ${yd[targetMonth].expenses.length + 1}`, amount: amt, category: expCategory, date: expDate }] };
      return { ...prev, [targetYear]: yd };
    });
    if (targetYear !== selectedYear) setSelectedYear(targetYear);
    setExpAmount(""); setExpLabel(""); setExpCategory(EXP_CATEGORIES[0]); setExpDate(todayStr);
  };

  const removeEarning = (id) => {
    saveSnapshot("Remove earning");
    setAllYearData(prev => {
      const yd = { ...(prev[selectedYear] || defaultYearData()) };
      MONTHS.forEach((_, i) => { if (yd[i].earnings.some(e => e.id === id)) yd[i] = { ...yd[i], earnings: yd[i].earnings.filter(e => e.id !== id) }; });
      return { ...prev, [selectedYear]: yd };
    });
  };

  const removeExpense = (id) => {
    saveSnapshot("Remove expense");
    setAllYearData(prev => {
      const yd = { ...(prev[selectedYear] || defaultYearData()) };
      MONTHS.forEach((_, i) => { if (yd[i].expenses.some(e => e.id === id)) yd[i] = { ...yd[i], expenses: yd[i].expenses.filter(e => e.id !== id) }; });
      return { ...prev, [selectedYear]: yd };
    });
  };

  const totals = useMemo(() => ({
    earnings: currentTableData.earnings.reduce((s, e) => s + e.amount, 0),
    expenses: currentTableData.expenses.reduce((s, e) => s + e.amount, 0),
  }), [currentTableData]);

  // Monthly spending per category (for budget tracking)
  const budgetMonth = isAll ? new Date().getMonth() : selectedMonth;
  const budgetMonthData = yearData[budgetMonth] || { earnings: [], expenses: [] };
  const spendingByCategory = useMemo(() => {
    const spending = {};
    budgetEntries.forEach(b => {
      spending[b.category] = 0;
      budgetMonthData.expenses.forEach(e => {
        const eCat = (e.category || "Other").toLowerCase();
        if (eCat === b.category.toLowerCase()) {
          spending[b.category] += e.amount;
        }
      });
    });
    return spending;
  }, [budgetMonthData, budgetEntries]);
  const totalBudget = budgetEntries.reduce((s, b) => s + b.amount, 0);
  const totalSpentInMonth = budgetEntries.reduce((s, b) => s + (spendingByCategory[b.category] || 0), 0);

  const fmt = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const balanceColor = currentBalance >= 0 ? "#34d399" : "#f87171";

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", color: "#e2e8f0", padding: "24px 16px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        input, select { outline: none; }
        input:focus, select:focus { border-color: #38bdf8 !important; box-shadow: 0 0 0 2px rgba(56,189,248,0.25); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #38bdf8, #818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>$</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, fontFamily: "'Space Mono', monospace", letterSpacing: "-0.5px" }}>Money Tracker</h1>
              <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>{selectedYear} · {isAll ? "Full Year" : MONTHS[selectedMonth]}</p>
            </div>
          </div>
          {undoStack.length > 0 && (
            <button onClick={undo} style={{
              padding: "8px 16px", borderRadius: 8,
              border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #334155, #475569)",
              color: "#e2e8f0", fontSize: 13, fontWeight: 700,
              display: "flex", alignItems: "center", gap: 6,
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}>
              <span style={{ fontSize: 14 }}>↩</span> Undo
              <span style={{
                padding: "1px 6px", borderRadius: 5, background: "rgba(255,255,255,0.15)",
                fontSize: 11, fontFamily: "'Space Mono', monospace",
              }}>{undoStack.length}</span>
            </button>
          )}
        </div>

        {/* Balance */}
        <div style={{ marginTop: 20, marginBottom: 20, padding: "28px 24px", background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", borderRadius: 16, border: `1px solid ${currentBalance >= 0 ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
            Current Balance {!editingBalance && <span style={{ fontSize: 10, color: "#64748b", cursor: "pointer", marginLeft: 6 }} onClick={() => setEditingBalance(true)}>✎ edit</span>}
          </div>
          {editingBalance ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <span style={{ fontSize: 42, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: balanceColor }}>$</span>
              <input type="number" placeholder="0.00" autoFocus value={startingBalance} onChange={e => setStartingBalance(e.target.value)} onKeyDown={e => { if (e.key === "Enter") setEditingBalance(false); }}
                style={{ width: 260, padding: "6px 12px", borderRadius: 10, border: "2px solid rgba(56,189,248,0.4)", background: "rgba(15,23,42,0.8)", color: balanceColor, fontSize: 38, fontWeight: 700, fontFamily: "'Space Mono', monospace", textAlign: "center" }} />
              <button onClick={() => setEditingBalance(false)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #38bdf8, #818cf8)", color: "#0f172a", fontSize: 13, fontWeight: 700 }}>Set</button>
            </div>
          ) : (
            <div onClick={() => setEditingBalance(true)} style={{ fontSize: 42, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: balanceColor, lineHeight: 1.1, cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.7"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              {currentBalance < 0 ? "-" : ""}${fmt(Math.abs(currentBalance))}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 14, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>Total Earnings</div>
              <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "'Space Mono', monospace", color: "#34d399", marginTop: 2 }}>+${fmt(totals.earnings)}</div>
            </div>
            <div style={{ width: 1, background: "#334155" }}></div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>Total Expenses</div>
              <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "'Space Mono', monospace", color: "#f87171", marginTop: 2 }}>-${fmt(totals.expenses)}</div>
            </div>
            <div style={{ width: 1, background: "#334155" }}></div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>Net</div>
              <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "'Space Mono', monospace", color: totals.earnings - totals.expenses >= 0 ? "#34d399" : "#f87171", marginTop: 2 }}>
                {totals.earnings - totals.expenses >= 0 ? "+" : "-"}${fmt(Math.abs(totals.earnings - totals.expenses))}
              </div>
            </div>
          </div>
          {totalAllocated > 0 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 12, paddingTop: 12, borderTop: "1px solid #334155" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>Saved for Goals</div>
                <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "'Space Mono', monospace", color: "#fbbf24", marginTop: 2 }}>${fmt(goals.reduce((s, g) => s + g.saved, 0))}</div>
              </div>
              <div style={{ width: 1, background: "#334155" }}></div>
              {froggyBank > 0 && <>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>Froggy Bank</div>
                  <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "'Space Mono', monospace", color: "#6ee7b7", marginTop: 2 }}>${fmt(froggyBank)}</div>
                </div>
                <div style={{ width: 1, background: "#334155" }}></div>
              </>}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>Available</div>
                <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "'Space Mono', monospace", color: availableBalance >= 0 ? "#38bdf8" : "#f87171", marginTop: 2 }}>${fmt(availableBalance)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24, padding: 16, background: "#1e293b", borderRadius: 12, border: "1px solid #334155" }}>
          <div>
            <label style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Enter Year</label>
            <input type="number" placeholder="e.g. 2026" value={selectedYear} onChange={e => handleYearChange(e.target.value)}
              style={{ width: 160, padding: "10px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#e2e8f0", fontSize: 15, fontFamily: "'Space Mono', monospace" }} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Select Month</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              <button onClick={() => setSelectedMonth("all")} style={{ padding: "7px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: isAll ? 700 : 500, background: isAll ? "linear-gradient(135deg, #fbbf24, #f59e0b)" : "#334155", color: isAll ? "#0f172a" : "#94a3b8" }}>All</button>
              {MONTHS.map((m, i) => (
                <button key={m} onClick={() => setSelectedMonth(i)} style={{ padding: "7px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: selectedMonth === i ? 700 : 500, background: selectedMonth === i ? "linear-gradient(135deg, #38bdf8, #818cf8)" : "#334155", color: selectedMonth === i ? "#0f172a" : "#94a3b8" }}>{m}</button>
              ))}
            </div>
          </div>
        </div>

        {isAll && (
          <div style={{ padding: "10px 14px", borderRadius: 8, marginBottom: 16, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", fontSize: 12, color: "#fbbf24" }}>
            📌 Viewing all months. Entries are automatically sorted into the correct month based on the date you select.
          </div>
        )}

        {/* ─── BUDGET CONTROL ─── */}
        <div style={{ padding: 16, borderRadius: 14, background: "#1e293b", border: "1px solid #334155", marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#c084fc", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>◎</span> Monthly Budget
            <span style={{ fontSize: 11, fontWeight: 500, color: "#64748b" }}>— {MONTHS[budgetMonth]} {selectedYear}</span>
          </h3>

          {/* Input row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            <input placeholder="Label (e.g. Weekly groceries)" value={budgetLabel} onChange={e => setBudgetLabel(e.target.value)}
              style={{ flex: "1 1 160px", padding: "9px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#e2e8f0", fontSize: 13 }} />
            <select value={budgetCategory} onChange={e => setBudgetCategory(e.target.value)}
              style={{ flex: "1 1 130px", padding: "9px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#e2e8f0", fontSize: 13 }}>
              {EXP_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="number" placeholder="Budget limit ($)" value={budgetAmount} onChange={e => setBudgetAmount(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") addBudget(); }}
              style={{ flex: "1 1 140px", padding: "9px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#e2e8f0", fontSize: 13, fontFamily: "'Space Mono', monospace" }} />
            <button onClick={addBudget} style={{
              padding: "9px 18px", borderRadius: 8, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #c084fc, #a855f7)", color: "#0f172a", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap",
            }}>+ Set</button>
          </div>

          {/* Budget table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #334155" }}>
                  {["Label", "Category", "Budget Limit ($)", "Spent ($)", "Status", ""].map((h, idx) => (
                    <th key={idx} style={{ padding: "8px 10px", textAlign: "left", color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {budgetEntries.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: 20, textAlign: "center", color: "#475569", fontStyle: "italic" }}>No budgets set yet — use the form above to set your first monthly budget limit</td></tr>
                ) : budgetEntries.map((b, i) => {
                  const liveSpent = spendingByCategory[b.category] || 0;
                  const spent = b.locked ? b.lockedSpent : liveSpent;
                  const spentPct = b.amount > 0 ? (spent / b.amount) * 100 : 0;
                  const isOver = spent >= b.amount;
                  const isClose = spentPct >= 80 && !isOver;
                  const remaining = b.amount - spent;
                  const isEditing = editingBudgetId === b.id;

                  return (
                    <tr key={b.id} style={{ borderBottom: "1px solid #1e293b", background: i % 2 === 0 ? "transparent" : "rgba(51,65,85,0.3)", opacity: b.locked ? 0.7 : 1, transition: "opacity 0.3s ease" }}>
                      <td style={{ padding: "8px 10px", fontWeight: 500 }}>
                        {b.label}
                        {b.locked && <span style={{ marginLeft: 6, fontSize: 10 }}>🔒</span>}
                      </td>
                      <td style={{ padding: "8px 10px" }}>
                        <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: "rgba(192,132,252,0.15)", color: "#d8b4fe" }}>{b.category}</span>
                      </td>
                      <td style={{ padding: "8px 10px", fontFamily: "'Space Mono', monospace" }}>
                        {isEditing && !b.locked ? (
                          <div style={{ display: "flex", gap: 4 }}>
                            <input type="number" value={editingBudgetAmount} autoFocus
                              onChange={e => setEditingBudgetAmount(e.target.value)}
                              onKeyDown={e => { if (e.key === "Enter") saveEditBudget(b.id); if (e.key === "Escape") setEditingBudgetId(null); }}
                              style={{ width: 80, padding: "4px 6px", borderRadius: 4, border: "1px solid #a855f7", background: "#0f172a", color: "#e2e8f0", fontSize: 12, fontFamily: "'Space Mono', monospace" }} />
                            <button onClick={() => saveEditBudget(b.id)} style={{ padding: "4px 8px", borderRadius: 4, border: "none", background: "#a855f7", color: "#0f172a", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>✓</button>
                          </div>
                        ) : (
                          <span onClick={() => { if (!b.locked) { setEditingBudgetId(b.id); setEditingBudgetAmount(String(b.amount)); } }}
                            style={{ cursor: b.locked ? "default" : "pointer", color: "#c084fc", borderBottom: b.locked ? "none" : "1px dashed #7c3aed" }}
                            title={b.locked ? "Unlock to edit" : "Click to edit"}>
                            ${fmt(b.amount)}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "8px 10px", fontFamily: "'Space Mono', monospace", color: isOver ? "#f87171" : "#94a3b8" }}>
                        ${fmt(spent)}
                      </td>
                      <td style={{ padding: "8px 10px", minWidth: 180 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: 9, color: "#64748b" }}>${fmt(spent)} of ${fmt(b.amount)} spent</span>
                          <span style={{ fontSize: 9, color: isOver ? "#f87171" : "#34d399" }}>
                            {isOver ? `$${fmt(Math.abs(remaining))} over` : `$${fmt(remaining)} remaining`}
                          </span>
                        </div>
                        <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#0f172a", overflow: "hidden", marginBottom: 4 }}>
                          <div style={{ width: `${Math.min(100, spentPct)}%`, height: "100%", borderRadius: 3,
                            background: isOver ? "linear-gradient(90deg, #ef4444, #f87171)" : isClose ? "linear-gradient(90deg, #f59e0b, #fbbf24)" : "linear-gradient(90deg, #a855f7, #c084fc)",
                            transition: "width 0.6s ease",
                          }}/>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 9, color: isOver ? "#f87171" : "#475569" }}>
                            {spentPct.toFixed(0)}% of budget limit
                          </span>
                          {b.locked && <span style={{ fontSize: 9, color: "#fbbf24", fontWeight: 600 }}>Locked</span>}
                        </div>
                      </td>
                      <td style={{ padding: "8px 10px" }}>
                        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                          <button onClick={() => toggleLockBudget(b.id)}
                            title={b.locked ? "Unlock — resume tracking new expenses" : "Lock — stop tracking new expenses"}
                            style={{ background: "none", border: "none", color: b.locked ? "#fbbf24" : "#64748b", cursor: "pointer", fontSize: 14 }}>
                            {b.locked ? "🔒" : "🔓"}
                          </button>
                          <button onClick={() => removeBudget(b.id)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 16 }}>×</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {budgetEntries.length > 0 && (
                  <tr style={{ borderTop: "2px solid #334155", fontWeight: 700 }}>
                    <td style={{ padding: "10px 10px" }}>TOTAL</td>
                    <td></td>
                    <td style={{ padding: "10px 10px", fontFamily: "'Space Mono', monospace", color: "#c084fc" }}>${fmt(totalBudget)}</td>
                    <td style={{ padding: "10px 10px", fontFamily: "'Space Mono', monospace", color: totalSpentInMonth > totalBudget ? "#f87171" : "#94a3b8" }}>${fmt(totalSpentInMonth)}</td>
                    <td style={{ padding: "10px 10px" }}>
                      <span style={{
                        padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                        background: totalSpentInMonth > totalBudget ? "rgba(239,68,68,0.15)" : "rgba(52,211,153,0.15)",
                        color: totalSpentInMonth > totalBudget ? "#f87171" : "#34d399",
                      }}>
                        {totalSpentInMonth > totalBudget ? "OVER BUDGET" : "ON TRACK"}
                      </span>
                    </td>
                    <td></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visual Scenes */}
        <FinancialScene type="earning" data={currentTableData.earnings} categories={EARN_CATEGORIES} Icons={EarnIcons} />
        <FinancialScene type="expense" data={currentTableData.expenses} categories={EXP_CATEGORIES} Icons={ExpIcons} />

        {/* ─── GOALS & FROGGY BANK ─── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginBottom: 20, alignItems: "start" }}>

        {/* ─── GOALS SECTION ─── */}
        <div style={{ padding: 20, borderRadius: 14, background: "#1e293b", border: "1px solid #334155" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#fbbf24", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>★</span> Goals
            </h3>
            <button onClick={() => setShowGoalForm(!showGoalForm)} style={{
              padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              background: showGoalForm ? "#334155" : "linear-gradient(135deg, #fbbf24, #f59e0b)",
              color: showGoalForm ? "#94a3b8" : "#0f172a", fontSize: 13, fontWeight: 700,
            }}>{showGoalForm ? "Cancel" : "+ Add Goal"}</button>
          </div>

          {/* Add Goal Form */}
          {showGoalForm && (
            <div style={{
              padding: 16, borderRadius: 10, background: "#0f172a", border: "1px solid #334155", marginBottom: 16,
            }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                <input placeholder="Goal name (e.g. Tesla Model 3)" value={goalName} onChange={e => handleGoalNameChange(e.target.value)}
                  style={{ flex: "1 1 200px", padding: "10px 12px", borderRadius: 8, border: "1px solid #334155", background: "#1e293b", color: "#e2e8f0", fontSize: 13 }} />
                <input type="number" placeholder="Target price ($)" value={goalValue} onChange={e => setGoalValue(e.target.value)}
                  style={{ flex: "1 1 140px", padding: "10px 12px", borderRadius: 8, border: "1px solid #334155", background: "#1e293b", color: "#e2e8f0", fontSize: 13, fontFamily: "'Space Mono', monospace" }} />
              </div>

              {/* Image picker tabs */}
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Choose an icon</label>
                <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                  {[
                    { key: "preset", label: "Pick Icon" },
                    { key: "emoji", label: "Type Emoji" },
                    { key: "upload", label: "Upload Photo" },
                  ].map(tab => (
                    <button key={tab.key} onClick={() => { setGoalImageType(tab.key); setGoalImage(""); setAutoMatched(false); setAiSource(""); }}
                      style={{
                        padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer",
                        fontSize: 11, fontWeight: goalImageType === tab.key ? 700 : 500,
                        background: goalImageType === tab.key ? "linear-gradient(135deg, #fbbf24, #f59e0b)" : "#334155",
                        color: goalImageType === tab.key ? "#0f172a" : "#94a3b8",
                      }}>{tab.label}</button>
                  ))}
                </div>

                {/* Preset grid */}
                {goalImageType === "preset" && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {GOAL_PRESETS.map(p => (
                      <button key={p.label} onClick={() => { setGoalImage(p.emoji); setAutoMatched(false); setAiSource(""); }}
                        style={{
                          width: 56, height: 56, borderRadius: 10, border: goalImage === p.emoji ? "2px solid #fbbf24" : "1px solid #334155",
                          background: goalImage === p.emoji ? "rgba(251,191,36,0.1)" : "#1e293b",
                          cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
                          transition: "all 0.15s",
                        }}>
                        <span style={{ fontSize: 22 }}>{p.emoji}</span>
                        <span style={{ fontSize: 8, color: goalImage === p.emoji ? "#fbbf24" : "#64748b" }}>{p.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Emoji input */}
                {goalImageType === "emoji" && (
                  <div>
                    <input placeholder="Type or paste any emoji (e.g. 🎯 🏖️ 👟)" value={goalImage} onChange={e => { setGoalImage(e.target.value); setAutoMatched(false); setAiSource(""); }}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #334155", background: "#1e293b", color: "#e2e8f0", fontSize: 20, textAlign: "center" }} />
                    <p style={{ margin: "6px 0 0", fontSize: 11, color: "#64748b" }}>
                      Windows: Win + . &nbsp;|&nbsp; Mac: Ctrl + Cmd + Space &nbsp;→&nbsp; opens emoji keyboard
                    </p>
                  </div>
                )}

                {/* Upload photo */}
                {goalImageType === "upload" && (
                  <div>
                    <label style={{
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      padding: "24px 16px", borderRadius: 10, border: "2px dashed #334155",
                      background: goalImage ? "transparent" : "#1a1a2e", cursor: "pointer",
                      transition: "border-color 0.2s ease",
                    }}
                      onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = "#fbbf24"; }}
                      onDragLeave={e => { e.currentTarget.style.borderColor = "#334155"; }}
                      onDrop={e => {
                        e.preventDefault();
                        e.currentTarget.style.borderColor = "#334155";
                        const file = e.dataTransfer.files[0];
                        if (file && file.type.startsWith("image/")) {
                          const reader = new FileReader();
                          reader.onload = (ev) => { setGoalImage(ev.target.result); setAutoMatched(false); setAiSource(""); };
                          reader.readAsDataURL(file);
                        }
                      }}
                    >
                      {goalImage ? (
                        <img src={goalImage} alt="preview" style={{ maxWidth: "100%", maxHeight: 120, borderRadius: 8, objectFit: "contain" }} />
                      ) : (
                        <>
                          <span style={{ fontSize: 32, marginBottom: 8 }}>📁</span>
                          <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>Click to browse or drag & drop</span>
                          <span style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>JPG, PNG, WEBP — any image from your device</span>
                        </>
                      )}
                      <input type="file" accept="image/*"
                        style={{ display: "none" }}
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => { setGoalImage(ev.target.result); setAutoMatched(false); setAiSource(""); };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {goalImage && (
                      <button onClick={() => setGoalImage("")}
                        style={{ marginTop: 8, padding: "4px 12px", borderRadius: 6, border: "1px solid #334155", background: "transparent", color: "#64748b", fontSize: 11, cursor: "pointer" }}>
                        Remove photo
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Preview + Submit */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  {aiLoading && !goalImage && (
                    <span style={{ fontSize: 12, color: "#a5b4fc", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⟳</span> AI is picking an icon...
                    </span>
                  )}
                  {goalImage && (
                    <>
                      <span style={{ fontSize: 11, color: autoMatched ? "#fbbf24" : "#64748b" }}>
                        {autoMatched ? (aiSource === "ai" ? "✨ AI picked:" : "Auto-matched:") : "Preview:"}
                      </span>
                      {goalImageType === "url" || goalImageType === "upload" ? (
                        <img src={goalImage} alt="preview" style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover", border: "1px solid #334155" }} />
                      ) : (
                        <span style={{ fontSize: 28 }}>{goalImage}</span>
                      )}
                      {autoMatched && (
                        <span style={{ fontSize: 10, color: "#64748b", fontStyle: "italic" }}>
                          not right? pick below
                        </span>
                      )}
                    </>
                  )}
                  {/* Manual retry button — shows when AI failed or no match at all */}
                  {goalName.trim().length > 1 && !goalImage && !aiLoading && (
                    <button onClick={() => aiMatchEmoji(goalName)}
                      style={{
                        padding: "6px 14px", borderRadius: 6, border: "1px solid rgba(129,140,248,0.3)",
                        background: "rgba(129,140,248,0.1)",
                        color: "#a5b4fc", fontSize: 12, fontWeight: 600, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 6,
                      }}>
                      ✨ Ask AI to pick an icon
                    </button>
                  )}
                </div>
                <button onClick={addGoal} style={{
                  padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#0f172a", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap",
                }}>Add Goal</button>
              </div>
            </div>
          )}

          {/* Goal Cards */}
          {goals.length === 0 && !showGoalForm && (
            <p style={{ textAlign: "center", color: "#475569", fontStyle: "italic", fontSize: 13, padding: "20px 0" }}>
              No goals yet — add something you're saving for!
            </p>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {goals.map(goal => {
              const progress = goal.value > 0 ? Math.min(100, (goal.saved / goal.value) * 100) : 0;
              const isComplete = goal.saved >= goal.value;
              const remaining = Math.max(0, goal.value - goal.saved);
              const inputVal = goalInputs[goal.id] || "";

              return (
                <div key={goal.id} style={{
                  borderRadius: 12, overflow: "hidden",
                  background: "#0f172a", border: `1px solid ${isComplete ? "rgba(52,211,153,0.4)" : "#334155"}`,
                  transition: "border-color 0.5s ease",
                }}>
                  {/* Image */}
                  <div style={{
                    width: "100%", height: 160, background: "#1a1a2e",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden", position: "relative",
                  }}>
                    {goal.image && (goal.imageType === "url" || goal.imageType === "upload") ? (
                      <img src={goal.image} alt={goal.name}
                        style={{
                          width: "100%", height: "100%", objectFit: "cover",
                          filter: isComplete ? "none" : `grayscale(${100 - progress}%) brightness(${0.4 + progress * 0.006})`,
                          transition: "filter 0.8s ease",
                        }}
                      />
                    ) : goal.image ? (
                      <div style={{
                        fontSize: 72,
                        filter: isComplete ? "none" : `grayscale(${100 - progress}%) brightness(${0.5 + progress * 0.005})`,
                        transition: "filter 0.8s ease",
                        lineHeight: 1,
                      }}>{goal.image}</div>
                    ) : (
                      <div style={{ fontSize: 40, color: "#334155" }}>★</div>
                    )}
                    {isComplete && (
                      <div style={{
                        position: "absolute", top: 10, right: 10,
                        padding: "4px 10px", borderRadius: 6,
                        background: "rgba(52,211,153,0.9)", color: "#0f172a",
                        fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                      }}>GOAL REACHED!</div>
                    )}
                    <button onClick={() => removeGoal(goal.id)} style={{
                      position: "absolute", top: 8, left: 8,
                      width: 24, height: 24, borderRadius: 6,
                      background: "rgba(0,0,0,0.5)", border: "none",
                      color: "#94a3b8", cursor: "pointer", fontSize: 14,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>×</button>
                  </div>

                  {/* Info */}
                  <div style={{ padding: "12px 14px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.3, flex: 1, marginRight: 8 }}>{goal.name}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: "#fbbf24", whiteSpace: "nowrap" }}>
                        ${fmt(goal.value)}
                      </div>
                    </div>

                    {/* Saved amount */}
                    <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8, fontFamily: "'Space Mono', monospace" }}>
                      ${fmt(goal.saved)} <span style={{ color: "#475569" }}>saved of</span> ${fmt(goal.value)}
                    </div>

                    {/* Progress bar */}
                    <div style={{
                      width: "100%", height: 10, borderRadius: 5,
                      background: "#1e293b", overflow: "hidden", marginBottom: 8,
                    }}>
                      <div style={{
                        width: `${progress}%`, height: "100%", borderRadius: 5,
                        background: isComplete
                          ? "linear-gradient(90deg, #34d399, #6ee7b7)"
                          : progress > 50
                            ? "linear-gradient(90deg, #fbbf24, #f59e0b)"
                            : "linear-gradient(90deg, #f87171, #fb923c)",
                        transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.5s ease",
                      }}/>
                    </div>

                    {/* Progress info */}
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: "'Space Mono', monospace", marginBottom: 10 }}>
                      <span style={{ color: isComplete ? "#34d399" : "#94a3b8" }}>
                        {progress.toFixed(1)}%
                      </span>
                      <span style={{ color: isComplete ? "#34d399" : "#64748b" }}>
                        {isComplete ? "Goal reached!" : `$${fmt(remaining)} to go`}
                      </span>
                    </div>

                    {/* Fund controls */}
                    {!isComplete && (
                      <div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <input type="number" placeholder="$ amount" value={inputVal}
                            onChange={e => setGoalInputs(prev => ({ ...prev, [goal.id]: e.target.value }))}
                            onKeyDown={e => { if (e.key === "Enter") addToGoal(goal.id); }}
                            style={{
                              flex: 1, padding: "7px 10px", borderRadius: 6, border: "1px solid #334155",
                              background: "#1e293b", color: "#e2e8f0", fontSize: 12, fontFamily: "'Space Mono', monospace",
                            }} />
                          <button onClick={() => addToGoal(goal.id)} style={{
                            padding: "7px 12px", borderRadius: 6, border: "none", cursor: "pointer",
                            background: "linear-gradient(135deg, #34d399, #22d3ee)", color: "#0f172a",
                            fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                          }}>+ Add</button>
                          {goal.saved > 0 && (
                            <button onClick={() => withdrawFromGoal(goal.id)} style={{
                              padding: "7px 12px", borderRadius: 6, border: "1px solid #334155",
                              background: "transparent", color: "#94a3b8", cursor: "pointer",
                              fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
                            }}>− Take</button>
                          )}
                        </div>
                        {froggyBank > 0 && (
                          <button onClick={() => transferFromFroggy(goal.id)} style={{
                            width: "100%", marginTop: 6, padding: "7px 12px", borderRadius: 6,
                            border: "1px solid rgba(110,231,183,0.3)", cursor: "pointer",
                            background: "rgba(6,78,59,0.3)", color: "#6ee7b7",
                            fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                          }}>
                            🐸 Use from Froggy Bank <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#34d399" }}>(${fmt(froggyBank)})</span>
                          </button>
                        )}
                      </div>
                    )}
                    {isComplete && (
                      <div style={{
                        textAlign: "center", padding: "8px 0", borderRadius: 6,
                        background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)",
                        fontSize: 12, color: "#34d399", fontWeight: 600,
                      }}>
                        🎉 Fully funded!
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── FROGGY BANK ─── */}
        <div style={{
          padding: 20, borderRadius: 14,
          background: "linear-gradient(180deg, #1e293b 0%, #0f2918 100%)",
          border: `1px solid ${froggyBank > 0 ? "rgba(110,231,183,0.3)" : "#334155"}`,
          textAlign: "center",
          transition: "border-color 0.5s ease",
        }}>
          <svg viewBox="0 0 120 100" style={{ width: 110, margin: "0 auto 12px", display: "block" }}>
            <defs>
              <radialGradient id="frog-glow"><stop offset="0%" stopColor="#34d399" stopOpacity="0.3"/><stop offset="100%" stopColor="#34d399" stopOpacity="0"/></radialGradient>
            </defs>
            {froggyBank > 0 && <circle cx="60" cy="55" r="48" fill="url(#frog-glow)"/>}
            <ellipse cx="60" cy="62" rx="32" ry="28" fill={froggyBank > 0 ? "#059669" : "#374151"} style={{ transition: "fill 0.6s ease" }}/>
            <ellipse cx="60" cy="68" rx="22" ry="18" fill={froggyBank > 0 ? "#6ee7b7" : "#4b5563"} style={{ transition: "fill 0.6s ease" }}/>
            <circle cx="44" cy="38" r="12" fill={froggyBank > 0 ? "#10b981" : "#4b5563"} style={{ transition: "fill 0.6s ease" }}/>
            <circle cx="76" cy="38" r="12" fill={froggyBank > 0 ? "#10b981" : "#4b5563"} style={{ transition: "fill 0.6s ease" }}/>
            <circle cx="44" cy="36" r="7" fill={froggyBank > 0 ? "#d1fae5" : "#6b7280"} style={{ transition: "fill 0.6s ease" }}/>
            <circle cx="76" cy="36" r="7" fill={froggyBank > 0 ? "#d1fae5" : "#6b7280"} style={{ transition: "fill 0.6s ease" }}/>
            <circle cx="46" cy="35" r="3.5" fill={froggyBank > 0 ? "#064e3b" : "#374151"} style={{ transition: "fill 0.6s ease" }}/>
            <circle cx="78" cy="35" r="3.5" fill={froggyBank > 0 ? "#064e3b" : "#374151"} style={{ transition: "fill 0.6s ease" }}/>
            {froggyBank > 0 && <><circle cx="47" cy="33" r="1.5" fill="#a7f3d0" opacity="0.7"/><circle cx="79" cy="33" r="1.5" fill="#a7f3d0" opacity="0.7"/></>}
            {froggyBank > 0 ? (
              <path d="M48,58 Q60,68 72,58" stroke="#047857" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            ) : (
              <path d="M50,60 L70,60" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
            )}
            {froggyBank > 0 && <><circle cx="38" cy="55" r="5" fill="#34d399" opacity="0.3"/><circle cx="82" cy="55" r="5" fill="#34d399" opacity="0.3"/></>}
            <rect x="52" y="26" width="16" height="3" rx="1.5" fill={froggyBank > 0 ? "#047857" : "#4b5563"} style={{ transition: "fill 0.6s ease" }}/>
            {froggyBank > 0 && <><circle cx="52" cy="65" r="4" fill="#fbbf24" opacity="0.8"/><text x="52" y="67" textAnchor="middle" fill="#92400e" fontSize="4" fontWeight="700">$</text></>}
            {froggyBank >= 50 && <><circle cx="62" cy="70" r="4" fill="#f59e0b" opacity="0.7"/><text x="62" y="72" textAnchor="middle" fill="#92400e" fontSize="4" fontWeight="700">$</text></>}
            {froggyBank >= 100 && <><circle cx="68" cy="63" r="4" fill="#fbbf24" opacity="0.9"/><text x="68" y="65" textAnchor="middle" fill="#92400e" fontSize="4" fontWeight="700">$</text></>}
            <ellipse cx="38" cy="88" rx="12" ry="5" fill={froggyBank > 0 ? "#059669" : "#374151"} style={{ transition: "fill 0.6s ease" }}/>
            <ellipse cx="82" cy="88" rx="12" ry="5" fill={froggyBank > 0 ? "#059669" : "#374151"} style={{ transition: "fill 0.6s ease" }}/>
          </svg>

          <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 700, color: froggyBank > 0 ? "#6ee7b7" : "#64748b" }}>
            🐸 Froggy Bank
          </h3>
          <p style={{ margin: "0 0 14px", fontSize: 11, color: "#475569", lineHeight: 1.4 }}>
            Collects leftover dollars from locked budgets
          </p>

          <div style={{
            fontSize: 28, fontWeight: 700, fontFamily: "'Space Mono', monospace",
            color: froggyBank > 0 ? "#34d399" : "#475569",
            marginBottom: 14,
            transition: "color 0.5s ease",
          }}>
            ${fmt(froggyBank)}
          </div>

          {budgetEntries.filter(b => b.locked && b.amount - b.lockedSpent > 0).length > 0 && (
            <div style={{ textAlign: "left", borderTop: "1px solid #334155", paddingTop: 12 }}>
              <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Saved from</div>
              {budgetEntries.filter(b => b.locked && b.amount - b.lockedSpent > 0).map(b => (
                <div key={b.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>{b.label}</span>
                  <span style={{ fontSize: 12, fontFamily: "'Space Mono', monospace", color: "#34d399", fontWeight: 600 }}>+${fmt(b.amount - b.lockedSpent)}</span>
                </div>
              ))}
            </div>
          )}

          {froggyBank === 0 && (
            <p style={{ margin: 0, fontSize: 10, color: "#475569", fontStyle: "italic" }}>
              {budgetEntries.length > 0 ? "Lock a budget with remaining money to start saving" : "Set a monthly budget first, then lock it when done"}
            </p>
          )}
        </div>

        </div> {/* end goals & froggy grid */}

        {/* Earnings Table */}
        <div style={{ padding: 16, borderRadius: 12, background: "#1e293b", border: "1px solid #334155", marginBottom: 16 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#34d399", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>↗</span> Earnings — {isAll ? `${selectedYear} (All Months)` : `${MONTHS[selectedMonth]} ${selectedYear}`}
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            <input placeholder="Label (e.g. Salary)" value={earnLabel} onChange={e => setEarnLabel(e.target.value)} style={{ flex: "1 1 140px", padding: "9px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#e2e8f0", fontSize: 13 }} />
            <select value={earnCategory} onChange={e => setEarnCategory(e.target.value)} style={{ flex: "1 1 120px", padding: "9px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#e2e8f0", fontSize: 13 }}>
              {EARN_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="number" placeholder="Amount ($)" value={earnAmount} onChange={e => setEarnAmount(e.target.value)} style={{ flex: "1 1 120px", padding: "9px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#e2e8f0", fontSize: 13, fontFamily: "'Space Mono', monospace" }} />
            <input type="date" value={earnDate} max={todayStr} onChange={e => setEarnDate(e.target.value)} style={{ flex: "1 1 130px", padding: "9px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#e2e8f0", fontSize: 13, fontFamily: "'Space Mono', monospace" }} />
            <button onClick={addEarning} style={{ padding: "9px 18px", borderRadius: 8, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #34d399, #22d3ee)", color: "#0f172a", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}>+ Add</button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ borderBottom: "2px solid #334155" }}>
                {["Date", "Source", "Category", "Amount ($)", ""].map((h, idx) => (
                  <th key={idx} style={{ padding: "8px 10px", textAlign: "left", color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {currentTableData.earnings.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: 20, textAlign: "center", color: "#475569", fontStyle: "italic" }}>No earnings added yet</td></tr>
                ) : currentTableData.earnings.map((e, i) => (
                  <tr key={e.id} style={{ borderBottom: "1px solid #1e293b", background: i % 2 === 0 ? "transparent" : "rgba(51,65,85,0.3)" }}>
                    <td style={{ padding: "8px 10px", fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#94a3b8" }}>{e.date || "—"}</td>
                    <td style={{ padding: "8px 10px", fontWeight: 500 }}>{e.label}</td>
                    <td style={{ padding: "8px 10px" }}><span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: "rgba(52,211,153,0.15)", color: "#6ee7b7" }}>{e.category}</span></td>
                    <td style={{ padding: "8px 10px", fontFamily: "'Space Mono', monospace", color: "#34d399" }}>+${fmt(e.amount)}</td>
                    <td style={{ padding: "8px 10px" }}><button onClick={() => removeEarning(e.id)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 16 }}>×</button></td>
                  </tr>
                ))}
                {currentTableData.earnings.length > 0 && (
                  <tr style={{ borderTop: "2px solid #334155", fontWeight: 700 }}>
                    <td></td><td style={{ padding: "10px 10px" }}>TOTAL</td><td></td>
                    <td style={{ padding: "10px 10px", fontFamily: "'Space Mono', monospace", color: "#34d399" }}>+${fmt(totals.earnings)}</td><td></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses Table */}
        <div style={{ padding: 16, borderRadius: 12, background: "#1e293b", border: "1px solid #334155", marginBottom: 24 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#f87171", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>↘</span> Expenses — {isAll ? `${selectedYear} (All Months)` : `${MONTHS[selectedMonth]} ${selectedYear}`}
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            <input placeholder="Label (e.g. Rent)" value={expLabel} onChange={e => setExpLabel(e.target.value)} style={{ flex: "1 1 140px", padding: "9px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#e2e8f0", fontSize: 13 }} />
            <select value={expCategory} onChange={e => setExpCategory(e.target.value)} style={{ flex: "1 1 120px", padding: "9px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#e2e8f0", fontSize: 13 }}>
              {EXP_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="number" placeholder="Amount ($)" value={expAmount} onChange={e => setExpAmount(e.target.value)} style={{ flex: "1 1 120px", padding: "9px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#e2e8f0", fontSize: 13, fontFamily: "'Space Mono', monospace" }} />
            <input type="date" value={expDate} max={todayStr} onChange={e => setExpDate(e.target.value)} style={{ flex: "1 1 130px", padding: "9px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#e2e8f0", fontSize: 13, fontFamily: "'Space Mono', monospace" }} />
            <button onClick={addExpense} style={{ padding: "9px 18px", borderRadius: 8, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #f87171, #fb923c)", color: "#0f172a", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}>+ Add</button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ borderBottom: "2px solid #334155" }}>
                {["Date", "Item", "Category", "Amount ($)", ""].map((h, idx) => (
                  <th key={idx} style={{ padding: "8px 10px", textAlign: "left", color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {currentTableData.expenses.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: 20, textAlign: "center", color: "#475569", fontStyle: "italic" }}>No expenses added yet</td></tr>
                ) : currentTableData.expenses.map((e, i) => (
                  <tr key={e.id} style={{ borderBottom: "1px solid #1e293b", background: i % 2 === 0 ? "transparent" : "rgba(51,65,85,0.3)" }}>
                    <td style={{ padding: "8px 10px", fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#94a3b8" }}>{e.date || "—"}</td>
                    <td style={{ padding: "8px 10px", fontWeight: 500 }}>{e.label}</td>
                    <td style={{ padding: "8px 10px" }}><span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: "rgba(129,140,248,0.15)", color: "#a5b4fc" }}>{e.category}</span></td>
                    <td style={{ padding: "8px 10px", fontFamily: "'Space Mono', monospace", color: "#f87171" }}>-${fmt(e.amount)}</td>
                    <td style={{ padding: "8px 10px" }}><button onClick={() => removeExpense(e.id)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 16 }}>×</button></td>
                  </tr>
                ))}
                {currentTableData.expenses.length > 0 && (
                  <tr style={{ borderTop: "2px solid #334155", fontWeight: 700 }}>
                    <td></td><td style={{ padding: "10px 10px" }}>TOTAL</td><td></td>
                    <td style={{ padding: "10px 10px", fontFamily: "'Space Mono', monospace", color: "#f87171" }}>-${fmt(totals.expenses)}</td><td></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Undo toast */}
        {undoMessage && (
          <div style={{
            position: "sticky", bottom: 16,
            margin: "0 auto", width: "fit-content",
            padding: "10px 20px", borderRadius: 10,
            background: "#334155", color: "#e2e8f0", fontSize: 13, fontWeight: 600,
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            animation: "fadeInUp 0.3s ease",
          }}>
            ✓ {undoMessage}
          </div>
        )}
      </div>
    </div>
  );
}
