import { useState } from "react";
import { T } from "./tokens";

// ─── Tab Button ───────────────────────────────────────────────────────────────
export function TabBtn({ active, onClick, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1,
        background: "transparent",
        border: "none",
        borderBottom:
          active || hov
            ? `2px solid ${T.accent}`
            : "2px solid transparent",
        padding: 20,
        fontSize: 14,
        fontWeight: 600,
        color: active || hov ? T.accent : T.muted,
        cursor: "pointer",
        transition: ".2s",
        backgroundImage: active
          ? "linear-gradient(to top, rgba(255,179,0,0.05), transparent)"
          : "none",
      }}
    >
      {children}
    </button>
  );
}

// ─── Hover Card ───────────────────────────────────────────────────────────────
export function HoverCard({ children }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.bgCard,
        border: `1px solid ${hov ? T.primary : T.border}`,
        borderRadius: 14,
        padding: 26,
        transition: ".25s",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        transform: hov ? "translateY(-2px)" : "none",
      }}
    >
      {children}
    </div>
  );
}

// ─── Type Card ────────────────────────────────────────────────────────────────
export function TypeCard({ selected, onClick, children }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: selected ? T.successBg : T.bg,
        border: `1.5px solid ${
          selected ? T.accent : hov ? T.primary : T.border
        }`,
        borderRadius: 14,
        padding: "24px 10px",
        textAlign: "center",
        cursor: "pointer",
        transition: "0.2s",
      }}
    >
      {children}
    </div>
  );
}

// ─── Policy Item ──────────────────────────────────────────────────────────────
export function PolicyItem({ policy: p, selected, onClick }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: selected ? "rgba(255,179,0,0.08)" : T.bg,
        border: `2px solid ${selected ? T.accent : hov ? T.muted : T.border}`,
        borderRadius: 12,
        padding: 16,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: selected
          ? "0 0 0 3px rgba(255,179,0,0.15), 0 4px 16px rgba(255,179,0,0.10)"
          : "none",
        position: "relative",
      }}
    >
      {/* Badge */}
      {selected && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: T.accent,
            color: "#000",
            borderRadius: 20,
            padding: "3px 10px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.3,
            pointerEvents: "none",
          }}
        >
          <i className="fa-solid fa-circle-check" style={{ fontSize: 10 }} />
          Selected
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <div>
          <h5
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: selected ? T.accent : T.text,
              transition: "color 0.2s ease",
            }}
          >
            {p.policyNumber}
          </h5>
          <p style={{ fontSize: 11, color: T.muted }}>{p.insuranceCompany}</p>
        </div>

        <div
          style={{
            fontSize: 9,
            fontWeight: 800,
            color: T.accent,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginRight: selected ? 84 : 0,
            transition: "margin 0.2s ease",
          }}
        >
          {p.status?.toUpperCase()}
        </div>
      </div>

      {/* Details */}
      <div style={{ paddingTop: 12, borderTop: "1px solid rgba(255,179,0,0.08)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {[
            { lbl: "Insured", val: p.insuredName },
            { lbl: "Expiry",  val: p.policyEndDate },
            ...(p.insuranceType === "other_vehicle"
              ? [{ lbl: "Vehicle", val: p.model }, { lbl: "Reg No", val: p.registrationNumber }]
              : []),
            ...(p.insuranceType === "health"
              ? [{ lbl: "Limit", val: p.coverAmount }, { lbl: "Plan", val: p.insuranceType }]
              : []),
            ...(p.insuranceType === "life"
              ? [{ lbl: "Assured", val: p.coverAmount }, { lbl: "Plan", val: p.insuranceType }]
              : []),
          ].map(({ lbl, val }) => (
            <div key={lbl}>
              <label
                style={{
                  fontSize: 8,
                  color: T.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: 2,
                  display: "block",
                }}
              >
                {lbl}
              </label>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{val || "-"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── OCR Zone ─────────────────────────────────────────────────────────────────
export function OcrZone({ scanning, onScan }) {
  const [hov, setHov] = useState(false);
  return (
    <>
      {/* Keyframe injection — only renders once in DOM */}
      <style>{`
        @keyframes ckSpin { to { transform: rotate(360deg); } }
        @keyframes ckPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      <div
        onClick={!scanning ? onScan : undefined}
        onMouseEnter={() => !scanning && setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          border: `2px dashed ${scanning ? T.primary : hov ? T.primary : T.border}`,
          borderRadius: 16,
          padding: 32,
          textAlign: "center",
          background: scanning
            ? "rgba(255,179,0,0.04)"
            : hov
            ? "rgba(255,179,0,0.03)"
            : "rgba(255,255,255,0.02)",
          cursor: scanning ? "default" : "pointer",
          transition: "0.3s",
          marginBottom: 24,
          overflow: "hidden",
          userSelect: "none",
        }}
      >
        {!scanning ? (
          <>
            <i
              className="fa-solid fa-wand-magic-sparkles"
              style={{
                fontSize: 28,
                color: T.primary,
                marginBottom: 12,
                display: "block",
              }}
            />
            <h4 style={{ fontSize: 15, marginBottom: 4 }}>
              Smart Policy Scan (OCR)
            </h4>
            <p style={{ fontSize: 12, color: T.muted }}>
              Upload your policy copy (PDF/IMG) to auto-fill details instantly
            </p>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "12px 0",
              gap: 12,
            }}
          >
            <i
              className="fa-solid fa-circle-notch"
              style={{
                fontSize: 28,
                color: T.primary,
                display: "block",
                animation: "ckSpin 0.8s linear infinite",
              }}
            />
            <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>
              Scanning Document…
            </p>
            <p
              style={{
                fontSize: 12,
                color: T.muted,
                margin: 0,
                animation: "ckPulse 1.4s ease-in-out infinite",
              }}
            >
              Extracting policy details, please wait
            </p>
          </div>
        )}
      </div>
    </>
  );
}