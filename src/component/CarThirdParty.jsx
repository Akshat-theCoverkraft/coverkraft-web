import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";

// ─── DESIGN TOKENS ────────────────────────────────────────────
const C = {
  bg:        "#000000",
  surface:   "#0a0a0a",
  card:      "#101010",
  cardBorder:"#1e1e1e",
  cardHov:   "#161616",
  green:     "#8AC642",
  orange:    "#FF9906",
  danger:    "#FF4444",
  white:     "#ffffff",
  text:      "rgba(255,255,255,0.85)",
  sub:       "rgba(255,255,255,0.50)",
  dim:       "rgba(255,255,255,0.28)",
  gradText:  "linear-gradient(90deg,#90DB78 0%,#5FD4BE 40%,#3FC8EE 100%)",
  gradBorder:"linear-gradient(90deg,#90DB78,#5FD4BE,#3FC8EE)",
};

// ─── STATIC DATA ──────────────────────────────────────────────
const DATA = {
  icon: "🛡️",
  title: "Third-Party Car Insurance",
  subtitle: "Legally mandatory under Motor Vehicle Act 1988 · Covers third-party liabilities",
  badges: ["Mandatory by Law", "Low Premium", "Instant Issuance"],
  facts: [
    { label: "Premium Range", value: "From ₹2,094/yr" },
    { label: "Validity",      value: "1 Year"          },
    { label: "TP Cover",      value: "Unlimited"       },
    { label: "PA Cover",      value: "₹15 Lakh"        },
  ],
  overview:
    "Mandated by the Motor Vehicle Act 1988, third-party (TP) car insurance protects you legally and financially if your vehicle causes injury, death, or property damage to a third party. It does not cover damage to your own vehicle.",
  covered: [
    "Unlimited liability for third-party death/injury claims",
    "Third-party property damage up to ₹7.5 Lakh",
    "Legal costs and court fees from covered incidents",
    "Compulsory personal accident cover for owner-driver",
  ],
  excluded: [
    "Damage to your own vehicle",
    "Vehicle theft",
    "Natural calamity damage to own car",
    "No add-on coverage available with this plan",
  ],
  comparison: {
    cols: ["Coverage", "Third-Party", "Comprehensive"],
    rows: [
      ["Own car damage",           false, true ],
      ["Theft of car",             false, true ],
      ["Choose own IDV",           false, true ],
      ["Customized add-ons",       false, true ],
      ["Third-party injury/death", true,  true ],
      ["TP property damage",       true,  true ],
      ["PA Cover",                 true,  true ],
    ],
  },
};

// ─── ALL CSS KEYFRAMES ────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #000 !important; }
  ::-webkit-scrollbar { width: 5px; background: #080808; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(180deg,#90DB78,#3FC8EE); border-radius: 3px; }

  @keyframes fadeDown  { from{opacity:0;transform:translateY(-22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(28px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes scaleIn   { from{opacity:0;transform:scale(0.82)} to{opacity:1;transform:scale(1)} }
  @keyframes slideR    { from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideL    { from{opacity:0;transform:translateX(28px)}  to{opacity:1;transform:translateX(0)} }

  @keyframes shieldFloat {
    0%,100% { transform: translateY(0px) rotate(-1.5deg); }
    50%      { transform: translateY(-11px) rotate(1.5deg); }
  }
  @keyframes pulseRing {
    0%   { transform:scale(1);   opacity:0.55; }
    70%  { transform:scale(1.22);opacity:0;    }
    100% { transform:scale(1);   opacity:0;    }
  }
  @keyframes orbit {
    from { transform:rotate(0deg)   translateX(46px) rotate(0deg);   }
    to   { transform:rotate(360deg) translateX(46px) rotate(-360deg);}
  }
  @keyframes glowBreath {
    0%,100%{ opacity:0.45; transform:scale(1);    }
    50%    { opacity:0.95; transform:scale(1.09); }
  }
  @keyframes borderRun {
    0%  { background-position:0%   50%; }
    50% { background-position:100% 50%; }
    100%{ background-position:0%   50%; }
  }
  @keyframes badgePop {
    0%   { transform:scale(0) translateY(8px); opacity:0; }
    68%  { transform:scale(1.1) translateY(-2px); opacity:1; }
    100% { transform:scale(1) translateY(0); opacity:1; }
  }
  @keyframes countPop {
    0%   { transform:scale(0.5); opacity:0; }
    60%  { transform:scale(1.14);opacity:1; }
    100% { transform:scale(1);   opacity:1; }
  }
  @keyframes particleUp {
    0%  { opacity:0; transform:translateY(0) translateX(0); }
    10% { opacity:1; }
    90% { opacity:0.5; }
    100%{ opacity:0; transform:translateY(-110px) translateX(var(--dx,18px)); }
  }
  @keyframes twinkle {
    0%,100%{ opacity:0;   transform:scale(0.4); }
    50%    { opacity:0.9; transform:scale(1.3); }
  }
  @keyframes shimmerSweep {
    from{ transform:translateX(-100%); }
    to  { transform:translateX(100%);  }
  }
  @keyframes lineDraw {
    from{ transform:scaleX(0); transform-origin:left; }
    to  { transform:scaleX(1); transform-origin:left; }
  }
  @keyframes dotBlink {
    0%,100%{ opacity:1; }
    50%    { opacity:0.25; }
  }

  .cta-btn {
    transition: transform 0.2s ease, box-shadow 0.2s ease !important;
  }
  .cta-btn:hover {
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 12px 36px rgba(95,212,190,0.35) !important;
  }
  .cta-btn:active { transform:scale(0.97) !important; }

  .list-row { transition: padding-left 0.18s ease, background 0.15s ease; }
  .list-row:hover { padding-left: 20px !important; }

  .stat-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
  .stat-card:hover { transform: translateY(-7px) scale(1.04) !important; box-shadow: 0 16px 40px rgba(0,0,0,0.6) !important; }

  .cmp-row { transition: background 0.14s ease; }
  .cmp-row:hover { background: rgba(144,219,120,0.035) !important; }

  .icon-bounce { transition: transform 0.2s ease; }
  .icon-bounce:hover { transform: scale(1.18) rotate(8deg); }
`;

// ─── HELPERS ──────────────────────────────────────────────────
const GradientText = ({ children, style = {} }) => (
  <span style={{
    background: C.gradText,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    ...style,
  }}>{children}</span>
);

const GradientLine = ({ style = {} }) => (
  <div style={{
    height: 2,
    background: C.gradBorder,
    borderRadius: 2,
    ...style,
  }} />
);

// Animated entry
const useMount = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 30); }, []);
  return mounted;
};

// ─── BADGE ────────────────────────────────────────────────────
function Badge({ label, index }) {
  const colors = [
    { bg: "rgba(138,198,66,0.12)",  border: "rgba(138,198,66,0.3)",  text: C.green  },
    { bg: "rgba(63,200,238,0.10)",  border: "rgba(63,200,238,0.3)",  text: "#3FC8EE"},
    { bg: "rgba(255,153,6,0.12)",   border: "rgba(255,153,6,0.3)",   text: C.orange },
  ];
  const c = colors[index % colors.length];
  return (
    <span style={{
      padding: "5px 14px",
      borderRadius: 20,
      fontSize: "0.99rem",
      fontWeight: 700,
      letterSpacing: "0.04em",
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.text,
    }}>{label}</span>
  );
}

// ─── SECTION CARD ─────────────────────────────────────────────
function SectionCard({ children, delay = 0, mounted }) {
  return (
    <div style={{
      background: C.card,
      borderRadius: 16,
      border: `1px solid ${C.cardBorder}`,
      padding: "28px 30px",
      position: "relative",
      overflow: "hidden",
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ─── SECTION HEADING ──────────────────────────────────────────
function SectionHeading({ children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{
        fontFamily: "'Sora', 'DM Sans', sans-serif",
        fontSize: "2rem",
        fontWeight: 700,
        color: C.white,
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <GradientLine style={{ width: 4, height: 18, borderRadius: 2, display: "inline-block" }} />
        {children}
      </h3>
    </div>
  );
}

// ─── LIST ROW ─────────────────────────────────────────────────
function ListRow({ text, covered, last }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "11px 10px",
        borderRadius: 8,
        borderBottom: last ? "none" : `1px solid ${C.cardBorder}`,
        background: hov ? (covered ? "rgba(138,198,66,0.04)" : "rgba(255,68,68,0.04)") : "transparent",
        transition: "background 0.15s",
        cursor: "default",
      }}
    >
      <div style={{
        flexShrink: 0,
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: covered ? "rgba(138,198,66,0.15)" : "rgba(255,68,68,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 1,
      }}>
        <span style={{ fontSize: "0.9rem", fontWeight: 900, color: covered ? C.green : C.danger }}>
          {covered ? "✓" : "✗"}
        </span>
      </div>
      <span style={{ fontSize: "1.1rem", color: C.text, lineHeight: 1.6 }}>{text}</span>
    </div>
  );
}

// ─── COMPARISON TABLE ─────────────────────────────────────────
function ComparisonTable() {
  const { cols, rows } = DATA.comparison;
  return (
    <div style={{ overflowX: "auto", borderRadius: 12, border: `1px solid ${C.cardBorder}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "1.1rem" }}>
        <thead>
          <tr>
            {cols.map((col, i) => (
              <th key={col} style={{
                padding: "14px 18px",
                textAlign: "left",
                background: "#0d0d0d",
                borderBottom: `2px solid ${C.cardBorder}`,
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700,
                color: i === 0 ? C.sub : "transparent",
                backgroundImage: i === 0 ? "none" : C.gradText,
                WebkitBackgroundClip: i === 0 ? "unset" : "text",
                WebkitTextFillColor: i === 0 ? C.sub : "transparent",
                backgroundClip: i === 0 ? "unset" : "text",
                whiteSpace: "nowrap",
              }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
              {row.map((cell, ci) => {
                const base = { padding: "12px 18px", borderBottom: `1px solid ${C.cardBorder}` };
                if (ci === 0) return (
                  <td key={ci} style={{ ...base, color: C.sub, fontWeight: 500 }}>{cell}</td>
                );
                if (cell === true)  return (
                  <td key={ci} style={base}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      background: "rgba(138,198,66,0.1)", border: "1px solid rgba(138,198,66,0.25)",
                      borderRadius: 20, padding: "3px 12px",
                      color: C.green, fontWeight: 700, fontSize: "0.78rem",
                    }}>✓ Yes</span>
                  </td>
                );
                if (cell === false) return (
                  <td key={ci} style={base}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.2)",
                      borderRadius: 20, padding: "3px 12px",
                      color: C.danger, fontWeight: 700, fontSize: "0.78rem",
                    }}>✗ No</span>
                  </td>
                );
                return <td key={ci} style={{ ...base, color: C.text }}>{cell}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



// ─── SPARKLE SVG ─────────────────────────────────────────────
const Sparkle = ({ x, y, delay, color = "#90DB78", size = 7 }) => (
  <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none", animation: `twinkle 2.6s ${delay}s ease-in-out infinite` }}>
    <svg width={size} height={size} viewBox="0 0 8 8">
      <path d="M4 0 L4.5 3.5 L8 4 L4.5 4.5 L4 8 L3.5 4.5 L0 4 L3.5 3.5 Z" fill={color} />
    </svg>
  </div>
);

// ─── ANIMATED SHIELD ─────────────────────────────────────────
function AnimatedShield() {
  return (
    <div style={{ position: "relative", width: 108, height: 108, flexShrink: 0 }}>
      {/* Pulse rings */}
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: `1.5px solid rgba(255,153,6,${0.35 - i * 0.1})`,
          animation: `pulseRing 2.6s ${i * 0.75}s ease-out infinite`,
        }} />
      ))}
      {/* Orbiting teal dot */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          width: 9, height: 9, borderRadius: "50%",
          background: C.teal, boxShadow: `0 0 12px ${C.teal}`,
          animation: "orbit 3.2s linear infinite",
        }} />
      </div>
      {/* Main floating box */}
      <div style={{
        position: "absolute", inset: 10, borderRadius: 20,
        background: "linear-gradient(135deg,rgba(255,153,6,0.14),rgba(255,153,6,0.04))",
        border: "1px solid rgba(255,153,6,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "shieldFloat 4s ease-in-out infinite",
        boxShadow: "0 0 32px rgba(255,153,6,0.18), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}>
        <svg width="40" height="44" viewBox="0 0 36 40" fill="none">
          <defs>
            <linearGradient id="shieldG" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#90DB78" />
              <stop offset="40%"  stopColor="#5FD4BE" />
              <stop offset="100%" stopColor="#3FC8EE" />
            </linearGradient>
          </defs>
          <path d="M18 2L4 8V20C4 28.8 10.4 37 18 39C25.6 37 32 28.8 32 20V8L18 2Z" fill="url(#shieldG)" opacity="0.92"/>
          <path d="M18 2L4 8V20C4 28.8 10.4 37 18 39C25.6 37 32 28.8 32 20V8L18 2Z" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6"/>
          <path d="M11.5 20L16 24.5L24.5 16" stroke="#000" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {/* Sparkles */}
      <Sparkle x="-6px"  y="6px"  delay={0}   color={C.mint}   size={7} />
      <Sparkle x="96px"  y="14px" delay={0.9}  color={C.teal}   size={6} />
      <Sparkle x="6px"   y="90px" delay={1.7}  color={C.orange} size={5} />
      <Sparkle x="84px"  y="78px" delay={0.5}  color={C.mint}   size={7} />
    </div>
  );
}


// ─── HERO BANNER ──────────────────────────────────────────────
function HeroBanner({ mounted }) {
  return (
    <div style={{
      position: "relative",
      borderRadius: 20,
      overflow: "hidden",
      background: "linear-gradient(135deg,#0a0f00 0%,#000 50%,#000d1a 100%)",
      border: `1px solid ${C.cardBorder}`,
      padding: "36px 40px",
      marginBottom: 28,
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(-16px)",
      transition: "opacity 0.6s ease, transform 0.6s ease",
    }}>
      {/* Top gradient line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: C.gradBorder }} />

      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: -60, right: -60,
        width: 300, height: 300,
        background: "radial-gradient(circle,rgba(63,200,238,0.07) 0%,transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -40, left: 80,
        width: 200, height: 200,
        background: "radial-gradient(circle,rgba(138,198,66,0.05) 0%,transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap", position: "relative" }}>
        {/* Icon */}
       <div style={{ animation:"scaleIn 0.6s 0.15s ease both" }}>
          <AnimatedShield />
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 220 }}>
          <h1 style={{
            fontFamily: "'Sora','DM Sans',sans-serif",
            fontSize: "clamp(1.9rem,3.5vw,4.5rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: 8,
            color: C.white,
          }}>
            <GradientText>{DATA.title}</GradientText>
          </h1>
          <p style={{ color: C.sub, fontSize: "1.9rem", lineHeight: 1.6, marginBottom: 16 }}>
            {DATA.subtitle}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {DATA.badges.map((b, i) => <Badge key={b} label={b} index={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR CTA ──────────────────────────────────────────────
function SidebarCTA({ mounted }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{
      borderRadius: 16,
      overflow: "hidden",
      position: "relative",
      background: "linear-gradient(135deg,#0d1800,#001a0a)",
      border: "1.5px solid rgba(138,198,66,0.25)",
      padding: "24px 22px",
      marginBottom: 16,
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.6s ease 100ms, transform 0.6s ease 100ms",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: C.gradBorder }} />
      <div style={{
        fontSize: "0.80rem", fontWeight: 800, letterSpacing: "0.12em",
        textTransform: "uppercase", marginBottom: 10,
        background: C.gradText,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>🛡️ Best Price Guarantee</div>
      <h3 style={{
        fontFamily: "'Sora',sans-serif", fontSize: "1.18rem",
        fontWeight: 800, color: C.white, marginBottom: 6,
      }}>Get Your Best Quote</h3>
      <p style={{ color: C.sub, fontSize: "0.90rem", lineHeight: 1.6, marginBottom: 20 }}>
        Compare rates from 20+ insurers. Instant policy issuance. Best price guaranteed.
      </p>
      <button
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={() => window.open("https://www.thecoverkraft.com", "_blank")}
        style={{
          width: "100%",
          padding: "13px",
          borderRadius: 10,
          border: "none",
          background: hov
            ? "linear-gradient(90deg,#90DB78,#5FD4BE,#3FC8EE)"
            : "linear-gradient(90deg,#90DB78 0%,#5FD4BE 40%,#3FC8EE 100%)",
          color: "#000",
          fontFamily: "'Sora',sans-serif",
          fontSize: "0.88rem",
          fontWeight: 800,
          cursor: "pointer",
          transition: "all 0.2s",
          transform: hov ? "scale(1.02)" : "scale(1)",
          boxShadow: hov ? "0 8px 28px rgba(95,212,190,0.3)" : "0 4px 16px rgba(95,212,190,0.15)",
          letterSpacing: "0.01em",
        }}
      >
        Buy Now at TheCoverKraft →
      </button>
    </div>
  );
}

// ─── QUICK FACTS ──────────────────────────────────────────────
function QuickFacts({ mounted }) {
  return (
    <div style={{
      background: C.card,
      borderRadius: 16,
      border: `1px solid ${C.cardBorder}`,
      padding: "22px",
      marginBottom: 16,
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.6s ease 200ms, transform 0.6s ease 200ms",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <GradientLine style={{ width: 4, height: 16, borderRadius: 2 }} />
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.18rem", fontWeight: 700, color: C.white }}>
          Quick Facts
        </h3>
      </div>
      {DATA.facts.map((f, i) => (
        <div key={f.label} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 0",
          borderBottom: i < DATA.facts.length - 1 ? `1px solid ${C.cardBorder}` : "none",
          fontSize: "0.90rem",
        }}>
          <span style={{ color: C.sub }}>{f.label}</span>
          <span style={{
            fontWeight: 700,
            background: C.gradText,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>{f.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── NEED HELP ────────────────────────────────────────────────
function NeedHelp({ mounted }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{
      background: C.card,
      borderRadius: 16,
      border: `1px solid ${C.cardBorder}`,
      padding: "22px",
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.6s ease 300ms, transform 0.6s ease 300ms",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <GradientLine style={{ width: 4, height: 16, borderRadius: 2 }} />
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.18rem", fontWeight: 700, color: C.white }}>
          Need Help?
        </h3>
      </div>
      <p style={{ color: C.sub, fontSize: "0.90rem", lineHeight: 1.6, marginBottom: 16 }}>
        Our insurance experts are available 9am–9pm, 7 days a week.
      </p>
      <button
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={() => window.open("https://www.thecoverkraft.com", "_blank")}
        style={{
          width: "100%",
          padding: "11px",
          borderRadius: 9,
          border: `1.5px solid ${hov ? C.orange : "rgba(255,153,6,0.3)"}`,
          background: hov ? "rgba(255,153,6,0.1)" : "transparent",
          color: C.orange,
          fontFamily: "'Sora',sans-serif",
          fontSize: "0.84rem",
          fontWeight: 700,
          cursor: "pointer",
          transition: "all 0.2s",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
      >
        📞 Talk to an Expert
      </button>
    </div>
  );
}

// ─── BACK BUTTON ──────────────────────────────────────────────
function BackButton({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "transparent",
        border: `1.5px solid ${hov ? "rgba(95,212,190,0.5)" : "rgba(255,255,255,0.12)"}`,
        borderRadius: 8, padding: "8px 18px",
        fontFamily: "'Sora',sans-serif", fontSize: "0.83rem",
        fontWeight: 600, cursor: "pointer",
        color: hov ? "#5FD4BE" : C.sub,
        marginBottom: 24,
        transition: "all 0.15s",
      }}
    >
      ← Back to Products
    </button>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────
export default function CarThirdParty() {
  const navigate = useNavigate();
  const mounted  = useMount();

  return (
    <div style={{
      fontFamily: "'Sora','DM Sans',sans-serif",
      background: C.bg,
      minHeight: "100vh",
      color: C.text,
      padding: "32px 24px 80px",
    }}>
      {/* Inject Google Font */}
           <style>{STYLES}</style>
   


      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
 <Navbar />
        {/* Back */}
        <div style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}>
          <BackButton onClick={() => navigate("/")} />
        </div>

        {/* Hero */}
        <HeroBanner mounted={mounted} />

        {/* 2-column layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)",
          gap: 20,
          alignItems: "start",
        }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Overview */}
            <SectionCard delay={100} mounted={mounted}>
              <SectionHeading>Overview</SectionHeading>
              <p style={{ fontSize: "1.1rem", color: C.text, lineHeight: 1.8 }}>
                {DATA.overview}
              </p>
            </SectionCard>

            {/* What's Covered */}
            <SectionCard delay={180} mounted={mounted}>
              <SectionHeading>
                What's Covered&nbsp;
                <span style={{
                  background: C.gradText,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>✓</span>
              </SectionHeading>
              {DATA.covered.map((item, i) => (
                <ListRow key={i} text={item} covered={true} last={i === DATA.covered.length - 1} />
              ))}
            </SectionCard>

            {/* What's NOT Covered */}
            <SectionCard delay={260} mounted={mounted}>
              <SectionHeading>
                What's NOT Covered&nbsp;
                <span style={{ color: C.danger }}>✗</span>
              </SectionHeading>
              {DATA.excluded.map((item, i) => (
                <ListRow key={i} text={item} covered={false} last={i === DATA.excluded.length - 1} />
              ))}
            </SectionCard>

            {/* Plan Comparison */}
            <SectionCard delay={340} mounted={mounted}>
              <SectionHeading>Plan Comparison</SectionHeading>
              <ComparisonTable />
            </SectionCard>

          </div>

          {/* ── RIGHT COLUMN (SIDEBAR) ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <SidebarCTA mounted={mounted} />
            <QuickFacts mounted={mounted} />
            <NeedHelp mounted={mounted} />
          </div>

        </div>
      </div>
    </div>
  );
}
