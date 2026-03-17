import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../Landing/component/Footer";

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
  teal:      "#3FC8EE",
  mint:      "#90DB78",
  white:     "#ffffff",
  text:      "rgba(255,255,255,0.85)",
  sub:       "rgba(255,255,255,0.50)",
  dim:       "rgba(255,255,255,0.50)",
  gradText:  "linear-gradient(90deg,#90DB78 0%,#5FD4BE 40%,#3FC8EE 100%)",
  gradBorder:"linear-gradient(90deg,#90DB78,#5FD4BE,#3FC8EE)",
};

// ─── STYLES ───────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #000 !important; }
  ::-webkit-scrollbar { width: 5px; background: #080808; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(180deg,#90DB78,#3FC8EE); border-radius: 3px; }

  @keyframes fadeDown {
    from { opacity:0; transform:translateY(-18px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(22px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity:0; }
    to   { opacity:1; }
  }
  @keyframes slideR {
    from { opacity:0; transform:translateX(-20px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes borderRun {
    0%   { background-position:0% 50%;   }
    50%  { background-position:100% 50%; }
    100% { background-position:0% 50%;   }
  }
  @keyframes glowBreath {
    0%,100% { opacity:0.5; transform:scale(1);    }
    50%     { opacity:1;   transform:scale(1.08); }
  }
  @keyframes tabPop {
    0%   { transform:scale(0.9); opacity:0; }
    70%  { transform:scale(1.04); }
    100% { transform:scale(1);   opacity:1; }
  }
  @keyframes cardIn {
    from { opacity:0; transform:translateY(24px) scale(0.97); }
    to   { opacity:1; transform:translateY(0)   scale(1); }
  }
  @keyframes iconFloat {
    0%,100% { transform:translateY(0px); }
    50%     { transform:translateY(-4px); }
  }
  @keyframes shimmer {
    from { transform:translateX(-100%); }
    to   { transform:translateX(100%); }
  }
  @keyframes dotPulse {
    0%,100% { opacity:1; transform:scale(1);    }
    50%     { opacity:0.4; transform:scale(0.7); }
  }

  .ins-tab {
    transition: all 0.2s ease;
    cursor: pointer;
    white-space: nowrap;
  }
  .ins-tab:hover {
    border-color: rgba(144,219,120,0.4) !important;
    color: #90DB78 !important;
  }

  .ins-card {
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease, background 0.22s ease;
    cursor: pointer;
  }
  .ins-card:hover {
    transform: translateY(-6px) scale(1.015) !important;
    box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(144,219,120,0.15) !important;
    border-color: rgba(144,219,120,0.2) !important;
    background: #161616 !important;
  }

  .view-btn {
    transition: all 0.2s ease;
  }
  .view-btn:hover {
    background: rgba(144,219,120,0.1) !important;
    border-color: rgba(144,219,120,0.5) !important;
    color: #90DB78 !important;
    transform: translateX(3px);
  }

  .back-btn {
    transition: all 0.18s ease;
  }
  .back-btn:hover {
    border-color: rgba(95,212,190,0.5) !important;
    color: #3FC8EE !important;
    transform: translateX(-3px);
  }

  .tag-pill {
    transition: all 0.15s ease;
  }
  .tag-pill:hover {
    opacity: 0.85;
    transform: scale(1.05);
  }
`;

// ─── ALL CATEGORIES DATA ──────────────────────────────────────
const CATEGORIES = {
  car: {
    key: "car",
    label: "Car Insurance Plans",
    subtitle: "Comprehensive protection for your four-wheeler — compare & buy in minutes",
    accentColor: "#FF5A1F",
    headerIcon: "🚗",
    products: [
      {
        slug: "car-third-party",
        icon: "🛡️",
        iconBg: "rgba(255,90,31,0.12)",
        iconBorder: "rgba(255,90,31,0.3)",
        title: "Third-Party Car Insurance",
        description: "Mandatory cover protecting against legal liabilities for third-party injuries, death, and property damage.",
        tags: [
          { label: "Mandatory by Law", color: "#FF5A1F" },
          { label: "Low Premium",      color: "#8AC642" },
        ],
      },
      {
        slug: "car-comprehensive",
        icon: "⭐",
        iconBg: "rgba(255,153,6,0.12)",
        iconBorder: "rgba(255,153,6,0.3)",
        title: "Comprehensive Car Insurance",
        description: "360° coverage — own damage + third-party. Best for accidents, theft, fire, and natural calamities.",
        tags: [
          { label: "Most Popular",  color: "#FF9906" },
          { label: "Full Coverage", color: "#3FC8EE" },
        ],
      },
      {
        slug: "car-own-damage",
        icon: "🔧",
        iconBg: "rgba(63,200,238,0.10)",
        iconBorder: "rgba(63,200,238,0.28)",
        title: "Standalone Own Damage",
        description: "Protect your car against accident damage, disasters, and theft. Pair with any active TP policy.",
        tags: [
          { label: "Flexible",    color: "#3FC8EE"  },
          { label: "Own Damage",  color: "#8AC642"  },
        ],
      },
      {
        slug: "car-addons",
        icon: "➕",
        iconBg: "rgba(138,198,66,0.12)",
        iconBorder: "rgba(138,198,66,0.28)",
        title: "Car Insurance Add-ons",
        description: "Zero Dep, Engine Protection, RSA, RTI, Consumables Cover & more — enhance your comprehensive policy.",
        tags: [
          { label: "8 Add-ons",       color: "#8AC642" },
          { label: "Enhanced Cover",  color: "#90DB78" },
        ],
      },
    ],
  },

  bike: {
    key: "bike",
    label: "Two-Wheeler Insurance Plans",
    subtitle: "Complete protection for your bike — from basic TP to add-on covers",
    accentColor: "#00A8E8",
    headerIcon: "🏍️",
    products: [
      {
        slug: "bike-third-party",
        icon: "⚖️",
        iconBg: "rgba(0,168,232,0.12)",
        iconBorder: "rgba(0,168,232,0.3)",
        title: "Third-Party Bike Insurance",
        description: "Legally mandatory cover for all two-wheelers. Protects against third-party injury, death, and property damage.",
        tags: [
          { label: "Mandatory",     color: "#00A8E8" },
          { label: "Low Premium",   color: "#8AC642" },
        ],
      },
      {
        slug: "bike-comprehensive",
        icon: "🏆",
        iconBg: "rgba(138,198,66,0.12)",
        iconBorder: "rgba(138,198,66,0.3)",
        title: "Comprehensive Bike Insurance",
        description: "360° cover for your two-wheeler — own damage, theft, natural disasters, and third-party liabilities.",
        tags: [
          { label: "Recommended", color: "#8AC642" },
          { label: "360° Cover",  color: "#3FC8EE" },
        ],
      },
      {
        slug: "bike-own-damage",
        icon: "🔩",
        iconBg: "rgba(63,200,238,0.10)",
        iconBorder: "rgba(63,200,238,0.28)",
        title: "Standalone Own Damage",
        description: "Cover your bike from accidents, disasters, and theft. Must be paired with a valid third-party policy.",
        tags: [
          { label: "Flexible",       color: "#3FC8EE" },
          { label: "Pairs with TP",  color: "#90DB78" },
        ],
      },
      {
        slug: "bike-addons",
        icon: "🌟",
        iconBg: "rgba(255,153,6,0.12)",
        iconBorder: "rgba(255,153,6,0.28)",
        title: "Bike Add-on Covers",
        description: "Zero Dep, NCB Protection, RSA, Return to Invoice & more — supercharge your comprehensive bike policy.",
        tags: [
          { label: "9 Add-ons",    color: "#FF9906" },
          { label: "Flexible Pick",color: "#8AC642" },
        ],
      },
    ],
  },

  health: {
    key: "health",
    label: "Health Insurance Plans",
    subtitle: "Protect your family's health — cashless claims at 10,000+ network hospitals",
    accentColor: "#E53935",
    headerIcon: "❤️",
    products: [
      {
        slug: "health-individual",
        icon: "👤",
        iconBg: "rgba(229,57,53,0.12)",
        iconBorder: "rgba(229,57,53,0.3)",
        title: "Individual Health Plan",
        description: "Dedicated cover for a single person — hospitalisation, daycare, critical illness, and COVID-19 treatment.",
        tags: [
          { label: "Tax Benefit 80D",  color: "#E53935" },
          { label: "Cashless Claims",  color: "#8AC642" },
        ],
      },
      {
        slug: "health-family",
        icon: "👨‍👩‍👧",
        iconBg: "rgba(255,153,6,0.12)",
        iconBorder: "rgba(255,153,6,0.3)",
        title: "Family Floater Plan",
        description: "One policy for the whole family — shared sum insured, ~20% cheaper than individual plans for each member.",
        tags: [
          { label: "Family Floater",  color: "#FF9906" },
          { label: "~20% Savings",    color: "#8AC642" },
        ],
      },
      {
        slug: "health-covid",
        icon: "🦠",
        iconBg: "rgba(0,196,140,0.10)",
        iconBorder: "rgba(0,196,140,0.28)",
        title: "Corona Kavach / Rakshak",
        description: "IRDAI-approved COVID-19 plans. Lump sum or indemnity payout, home quarantine cover, zero deductibles.",
        tags: [
          { label: "IRDAI Approved",   color: "#00C48C" },
          { label: "Zero Deductibles", color: "#3FC8EE" },
        ],
      },
      {
        slug: "health-claims",
        icon: "📋",
        iconBg: "rgba(138,198,66,0.12)",
        iconBorder: "rgba(138,198,66,0.28)",
        title: "Claims Settlement Guide",
        description: "Step-by-step guide to cashless and reimbursement claims — documents, process, and tips for smooth settlement.",
        tags: [
          { label: "Cashless Guide",      color: "#8AC642" },
          { label: "Reimbursement",       color: "#90DB78" },
        ],
      },
    ],
  },

  travel: {
    key: "travel",
    label: "Travel Insurance Plans",
    subtitle: "Travel worry-free — coverage for medical emergencies, baggage, and trip cancellations",
    accentColor: "#00C48C",
    headerIcon: "✈️",
    products: [
      {
        slug: "travel-international",
        icon: "🌍",
        iconBg: "rgba(0,196,140,0.12)",
        iconBorder: "rgba(0,196,140,0.3)",
        title: "International Travel",
        description: "Complete overseas cover — emergency medical up to $500K, baggage, trip cancellation, 180+ countries.",
        tags: [
          { label: "Medical Cover",      color: "#00C48C" },
          { label: "180+ Countries",     color: "#3FC8EE" },
        ],
      },
      {
        slug: "travel-student",
        icon: "🎓",
        iconBg: "rgba(0,168,232,0.12)",
        iconBorder: "rgba(0,168,232,0.3)",
        title: "Student Travel",
        description: "Tailored for Indian students abroad — mental health cover, sponsor protection, compassionate visit, study interruption.",
        tags: [
          { label: "Study Abroad",     color: "#00A8E8" },
          { label: "Mental Health",    color: "#8AC642" },
        ],
      },
      {
        slug: "travel-schengen",
        icon: "🇪🇺",
        iconBg: "rgba(138,198,66,0.10)",
        iconBorder: "rgba(138,198,66,0.28)",
        title: "Schengen Travel",
        description: "Mandatory for Schengen visa. Minimum €30,000 medical cover, valid across all 26 European Schengen countries.",
        tags: [
          { label: "Visa Mandatory",  color: "#8AC642" },
          { label: "26 Countries",    color: "#90DB78" },
        ],
      },
      {
        slug: "travel-domestic",
        icon: "🇮🇳",
        iconBg: "rgba(255,153,6,0.12)",
        iconBorder: "rgba(255,153,6,0.28)",
        title: "Domestic Travel",
        description: "Travel safely within India — air, rail, and road. Medical cover, baggage loss, and personal accident benefits.",
        tags: [
          { label: "Within India",     color: "#FF9906" },
          { label: "Air/Rail/Road",    color: "#3FC8EE" },
        ],
      },
    ],
  },
};

const TAB_ORDER = ["car", "bike", "health", "travel"];

const TAB_META = {
  car:    { emoji: "🚗", label: "Car Insurance"    },
  bike:   { emoji: "🏍️", label: "Two-Wheeler"      },
  health: { emoji: "❤️", label: "Health Insurance" },
  travel: { emoji: "✈️", label: "Travel Insurance" },
};

// ─── HELPERS ─────────────────────────────────────────────────
const GradientText = ({ children, style = {} }) => (
  <span style={{ background: C.gradText, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", ...style }}>
    {children}
  </span>
);

function useReveal(threshold = 0.08) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

// ─── TAG PILL ─────────────────────────────────────────────────
function TagPill({ label, color }) {
  return (
    <span className="tag-pill" style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "4px 12px", borderRadius: 20,
      fontSize: "0.99rem", fontWeight: 700, letterSpacing: "0.04em",
      background: `${color}18`,
      border: `1px solid ${color}44`,
      color: color,
    }}>
      {label}
    </span>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────
function ProductCard({ product, index, navigate, vis }) {
  return (
    <div
      className="ins-card"
      onClick={() => navigate(`/products/${product.slug}`)}
      style={{
        background: C.card,
        borderRadius: 16,
        border: `1px solid ${C.cardBorder}`,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        position: "relative",
        overflow: "hidden",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
        transition: `opacity 0.45s ease ${index * 80}ms, transform 0.45s ease ${index * 80}ms`,
      }}
    >
      {/* Shimmer on load */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(105deg,transparent 30%,rgba(144,219,120,0.025) 50%,transparent 70%)",
        animation: vis ? `shimmer 1.4s ${index * 0.12}s ease both` : "none",
      }} />

      {/* Top gradient accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: C.gradBorder,
        transform: vis ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left",
        transition: `transform 0.65s ease ${0.2 + index * 0.08}s`,
      }} />

      {/* Icon + Title row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14, flexShrink: 0,
          background: product.iconBg,
          border: `1px solid ${product.iconBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.5rem",
          animation: vis ? `iconFloat 3.5s ${index * 0.3}s ease-in-out infinite` : "none",
          boxShadow: `0 4px 16px ${product.iconBorder}`,
        }}>
          {product.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: "1.7rem",
            fontWeight: 800,
            color: C.white,
            lineHeight: 1.3,
            marginBottom: 8,
          }}>
            {product.title}
          </h3>
          <p style={{
            fontSize: "1.2rem",
            color: C.sub,
            lineHeight: 1.65,
          }}>
            {product.description}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 18 }}>
        {product.tags.map(t => (
          <TagPill key={t.label} label={t.label} color={t.color} />
        ))}
      </div>

      {/* View Full Details button */}
      <button
        className="view-btn"
        style={{
          width: "100%",
          padding: "11px 16px",
          borderRadius: 10,
          border: `1.5px solid ${C.cardBorder}`,
          background: "transparent",
          color: C.sub,
          fontFamily: "'Sora',sans-serif",
          fontSize: "1rem",
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          marginTop: "auto",
          letterSpacing: "0.01em",
        }}
      >
        View Full Details →
      </button>
    </div>
  );
}

// ─── CARDS GRID ───────────────────────────────────────────────
function CardsGrid({ products, navigate }) {
  const [ref, vis] = useReveal(0.06);
  return (
    <div
      ref={ref}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 18,
      }}
    >
      {products.map((p, i) => (
        <ProductCard key={p.slug} product={p} index={i} navigate={navigate} vis={vis} />
      ))}
    </div>
  );
}

// ─── CATEGORY HEADER ──────────────────────────────────────────
function CategoryHeader({ cat, mounted }) {
  return (
    <div style={{
      position: "relative",
      borderRadius: 20,
      overflow: "hidden",
      background: "linear-gradient(135deg,#080808 0%,#000 60%,#050505 100%)",
      border: `1px solid ${C.cardBorder}`,
      padding: "36px 40px 32px",
      marginBottom: 28,
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(-16px)",
      transition: "opacity 0.55s ease, transform 0.55s ease",
    }}>
      {/* Running border */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: "linear-gradient(90deg,#90DB78,#5FD4BE,#3FC8EE,#5FD4BE,#90DB78)",
        backgroundSize: "300% 100%",
        animation: "borderRun 5s linear infinite",
      }} />

      {/* Glow blobs */}
      <div style={{ position:"absolute", top:-60, right:-60, width:300, height:300, background:`radial-gradient(circle,${cat.accentColor}12 0%,transparent 65%)`, pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-40, left:40, width:200, height:200, background:"radial-gradient(circle,rgba(63,200,238,0.06) 0%,transparent 65%)", pointerEvents:"none", animation:"glowBreath 4s ease-in-out infinite" }} />

      {/* Grid texture */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:"linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)", backgroundSize:"40px 40px" }} />

      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 20 }}>
        {/* Big icon */}
        <div style={{
          width: 64, height: 64, borderRadius: 18, flexShrink: 0,
          background: `${cat.accentColor}18`,
          border: `1.5px solid ${cat.accentColor}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2rem",
          boxShadow: `0 0 24px ${cat.accentColor}20`,
          animation: "iconFloat 4s ease-in-out infinite",
        }}>
          {cat.headerIcon}
        </div>

        <div>
          {/* Category chip */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: `${cat.accentColor}18`,
            border: `1px solid ${cat.accentColor}3a`,
            borderRadius: 20, padding: "4px 14px", marginBottom: 10,
            animation: "slideR 0.5s 0.1s ease both",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: cat.accentColor, display: "inline-block", boxShadow: `0 0 8px ${cat.accentColor}`, animation: "dotPulse 2s ease-in-out infinite" }} />
            <span style={{ fontSize: "1rem", fontWeight: 800, color: cat.accentColor, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {cat.products.length} Plans Available
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: "clamp(2.6rem,3.6vw,3.6rem)",
            fontWeight: 900, lineHeight: 1.1, marginBottom: 8,
            animation: "slideR 0.5s 0.15s ease both",
          }}>
            <GradientText>{cat.label}</GradientText>
          </h1>
          <p style={{
            color: C.sub, fontSize: "1.8rem", lineHeight: 1.6,
            animation: "slideR 0.5s 0.25s ease both",
          }}>
            {cat.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── TABS ─────────────────────────────────────────────────────
function CategoryTabs({ activeKey, onSelect, mounted }) {
  return (
    <div style={{
      display: "flex", gap: 10, flexWrap: "wrap",
      marginBottom: 28,
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(12px)",
      transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
    }}>
      {TAB_ORDER.map((key, i) => {
        const meta    = TAB_META[key];
        const isActive = key === activeKey;
        return (
          <button
            key={key}
            className="ins-tab"
            onClick={() => onSelect(key)}
            style={{
              padding: "10px 22px",
              borderRadius: 50,
              border: isActive ? "1.5px solid transparent" : `1.5px solid ${C.cardBorder}`,
              background: isActive
                ? "linear-gradient(#101010,#101010) padding-box, linear-gradient(90deg,#90DB78,#5FD4BE,#3FC8EE) border-box"
                : C.card,
              fontFamily: "'Sora',sans-serif",
              fontSize: "1.6rem",
              fontWeight: isActive ? 800 : 600,
              color: isActive ? C.white : C.sub,
              display: "flex", alignItems: "center", gap: 7,
              position: "relative",
              animation: `tabPop 0.4s ${i * 0.06}s ease both`,
            }}
          >
            <span style={{ fontSize: "1.6rem" }}>{meta.emoji}</span>
            {meta.label}
            {isActive && (
              <span style={{
                position: "absolute", bottom: -1, left: "50%",
                transform: "translateX(-50%)",
                width: 24, height: 2, borderRadius: 2,
                background: C.gradBorder,
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── BACK BUTTON ─────────────────────────────────────────────
function BackButton({ onClick, mounted }) {
  return (
    <button
      className="back-btn"
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "transparent",
        border: `1.5px solid ${C.cardBorder}`,
        borderRadius: 8, padding: "8px 18px",
        fontFamily: "'Sora',sans-serif", fontSize: "1rem",
        fontWeight: 600, cursor: "pointer",
        color: C.sub,
        marginBottom: 26,
        opacity: mounted ? 1 : 0,
        animation: mounted ? "fadeIn 0.4s ease both" : "none",
      }}
    >
      ← Back to Home
    </button>
  );
}

// ─── STATS BAR ───────────────────────────────────────────────
function StatsBar({ cat, mounted }) {
  const stats = [
    { icon: "🏢", val: "20+",    label: "Insurer Partners" },
    { icon: "✅", val: "98%",    label: "Claim Settlement" },
    { icon: "📞", val: "24/7",   label: "Expert Support"   },
    { icon: "⚡", val: "5 min",  label: "Instant Policy"   },
  ];
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 12,
      marginBottom: 28,
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(16px)",
      transition: "opacity 0.55s ease 0.2s, transform 0.55s ease 0.2s",
    }}>
      {stats.map((s, i) => (
        <div key={s.label} style={{
          background: C.card,
          borderRadius: 12,
          border: `1px solid ${C.cardBorder}`,
          padding: "14px 16px",
          display: "flex", alignItems: "center", gap: 12,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 0.4s ease ${0.25 + i * 0.07}s, transform 0.4s ease ${0.25 + i * 0.07}s`,
        }}>
          <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>{s.icon}</span>
          <div>
            <div style={{
              fontFamily: "'Sora',sans-serif", fontWeight: 900,
              fontSize: "1.88rem",
              background: C.gradText, WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>{s.val}</div>
            <div style={{ fontSize: "1.5rem", color: C.dim, marginTop: 1 }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────
// Usage: <Route path="/products/:category" element={<InsuranceCategoryPage />} />
// Also works standalone: <InsuranceCategoryPage defaultCategory="car" />
export default function InsuranceCategoryPage({ defaultCategory }) {
  const { category: slugParam } = useParams() || {};
  const navigate = useNavigate();

  const initialCat = slugParam && CATEGORIES[slugParam]
    ? slugParam
    : (defaultCategory || "car");

  const [activeTab, setActiveTab] = useState(initialCat);
  const [mounted, setMounted]     = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 30);
  }, []);

  // Sync tab if URL slug changes
  useEffect(() => {
    if (slugParam && CATEGORIES[slugParam]) {
      setActiveTab(slugParam);
    }
  }, [slugParam]);

  const cat = CATEGORIES[activeTab];

  const handleTabSelect = (key) => {
    setActiveTab(key);
    navigate(`/products/${key}`);
  };

  return (
    <>
    <div style={{
      fontFamily: "'Sora','DM Sans',sans-serif",
      background: C.bg,
      minHeight: "100vh",
      color: C.text,
      padding: "32px 24px 80px",
    }}>
      <style>{STYLES}</style>

      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <Navbar />

        <BackButton onClick={() => navigate("/")} mounted={mounted} />

        {/* Category header banner */}
        <CategoryHeader cat={cat} mounted={mounted} />

        {/* Tabs */}
        <CategoryTabs activeKey={activeTab} onSelect={handleTabSelect} mounted={mounted} />

        {/* Stats bar */}
        <StatsBar cat={cat} mounted={mounted} />

        {/* Product cards grid */}
        <CardsGrid products={cat.products} navigate={navigate} />

        {/* Bottom CTA */}
        {/* <div style={{
          marginTop: 40,
          borderRadius: 16,
          background: "linear-gradient(135deg,#0c1700,#001609,#000d07)",
          border: "1.5px solid rgba(138,198,66,0.18)",
          padding: "28px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20,
          position: "relative",
          overflow: "hidden",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s",
        }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,#90DB78,#5FD4BE,#3FC8EE,#5FD4BE,#90DB78)", backgroundSize:"280% 100%", animation:"borderRun 4s linear infinite" }} />
          <div style={{ position:"absolute", top:-30, right:-30, width:140, height:140, background:"radial-gradient(circle,rgba(138,198,66,0.08) 0%,transparent 70%)", pointerEvents:"none", animation:"glowBreath 3.5s ease-in-out infinite" }} />
          <div>
            <div style={{ fontSize:"0.68rem", fontWeight:800, letterSpacing:"0.13em", textTransform:"uppercase", marginBottom:6, background:C.gradText, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              🛡️ Not sure which plan to pick?
            </div>
            <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:"1.1rem", fontWeight:900, color:C.white, marginBottom:4 }}>
              Talk to a CoverKraft Expert
            </h3>
            <p style={{ color:C.sub, fontSize:"0.82rem", lineHeight:1.6 }}>
              Our advisors compare plans from 20+ insurers — free, unbiased guidance.
            </p>
          </div>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <button
              onClick={() => window.open("https://www.thecoverkraft.com","_blank")}
              style={{
                padding:"12px 28px", borderRadius:10, border:"none",
                background:"linear-gradient(90deg,#90DB78 0%,#5FD4BE 40%,#3FC8EE 100%)",
                color:"#000", fontFamily:"'Sora',sans-serif", fontSize:"0.88rem",
                fontWeight:800, cursor:"pointer",
                boxShadow:"0 4px 20px rgba(95,212,190,0.2)",
                transition:"all 0.2s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform="scale(1.04)"; e.currentTarget.style.boxShadow="0 8px 28px rgba(95,212,190,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 4px 20px rgba(95,212,190,0.2)"; }}
            >
              Get Free Advice →
            </button>
            <button
              onClick={() => window.open("https://www.thecoverkraft.com","_blank")}
              style={{
                padding:"12px 22px", borderRadius:10, cursor:"pointer",
                border:`1.5px solid rgba(255,153,6,0.35)`,
                background:"rgba(255,153,6,0.08)",
                color:C.orange, fontFamily:"'Sora',sans-serif",
                fontSize:"0.88rem", fontWeight:700,
                transition:"all 0.2s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(255,153,6,0.6)"; e.currentTarget.style.background="rgba(255,153,6,0.14)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,153,6,0.35)"; e.currentTarget.style.background="rgba(255,153,6,0.08)"; }}
            >
              📞 Call Us
            </button>
          </div>
          
        </div> */}

      </div>
      
    </div>
    <Footer />
    </>
  );
}
