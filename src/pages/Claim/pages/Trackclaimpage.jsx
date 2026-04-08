import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../component/Button";
import { trackClaim, getMyClaims } from "../../../store/action/action";
import { T } from "../tokens";
import API_URL from "../../../ServiceModule/Service";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  submitted: {
    label: "Submitted",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.08)",
  },
  under_review: {
    label: "Under Review",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
  },
  forwarded: {
    label: "Forwarded to Insurer",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.08)",
  },
  resolved: {
    label: "Resolved",
    color: "#10B981",
    bg: "rgba(16,185,129,0.08)",
  },
  rejected: { label: "Rejected", color: "#EF4444", bg: "rgba(239,68,68,0.08)" },
};

const TIMELINE_STEP_ORDER = [
  "submitted",
  "under_review",
  "forwarded",
  "resolved",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || {
    label: capitalize(status),
    color: T.muted,
    bg: "rgba(0,0,0,0.05)",
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 12px",
        borderRadius: 999,
        background: cfg.bg,
        color: cfg.color,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.3,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: cfg.color,
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
function ClaimTimeline({ timeline }) {
  if (!timeline?.length) return null;
  const stepsMap = {};
  timeline.forEach((t) => {
    stepsMap[t.key] = t;
  });
  const steps = TIMELINE_STEP_ORDER.map(
    (key) => stepsMap[key] || { key, label: key, status: "pending" },
  );
  if (stepsMap.rejected) steps.push(stepsMap.rejected);

  return (
    <div style={{ marginTop: 32 }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: T.muted,
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 20,
        }}
      >
        Claim Timeline
      </p>
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: 15,
            top: 8,
            width: 2,
            height: `calc(100% - 16px)`,
            background: T.border,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {steps.map((step, idx) => {
            const isDone = step.status === "completed";
            const isCurrent = step.status === "current";
            const isPending = step.status === "pending";
            const isRejected = step.key === "rejected";
            const dotColor = isRejected
              ? "#EF4444"
              : isDone
                ? T.accent
                : isCurrent
                  ? T.primary
                  : T.border;

            return (
              <div
                key={step.key}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 18,
                  paddingBottom: idx < steps.length - 1 ? 24 : 0,
                }}
              >
                <div style={{ flexShrink: 0, position: "relative", zIndex: 1 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: isDone ? T.accent : T.bgCard,
                      border: `2px solid ${dotColor}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: isCurrent
                        ? `0 0 0 4px rgba(255,179,0,0.15)`
                        : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    {isDone ? (
                      <i
                        className="fa-solid fa-check"
                        style={{ fontSize: 11, color: "#000" }}
                      />
                    ) : isCurrent ? (
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: T.primary,
                        }}
                      />
                    ) : isRejected ? (
                      <i
                        className="fa-solid fa-xmark"
                        style={{ fontSize: 11, color: "#EF4444" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: T.border,
                        }}
                      />
                    )}
                  </div>
                </div>
                <div style={{ paddingTop: 4, flex: 1 }}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      margin: 0,
                      color: isPending ? T.muted : T.text,
                    }}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p
                      style={{
                        fontSize: 12,
                        color: T.primary,
                        fontWeight: 600,
                        margin: "3px 0 0",
                      }}
                    >
                      In progress
                    </p>
                  )}
                  {isPending && !isRejected && (
                    <p
                      style={{
                        fontSize: 12,
                        color: T.muted,
                        margin: "3px 0 0",
                      }}
                    >
                      Pending
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Detail Row ───────────────────────────────────────────────────────────────
function DetailRow({ label, value, accent }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: T.muted,
          textTransform: "uppercase",
          letterSpacing: 0.8,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 14,
          fontWeight: accent ? 700 : 500,
          color: accent ? T.primary : T.text,
        }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

// ─── Claim Result Card ────────────────────────────────────────────────────────
function ClaimResultCard({ data }) {
  return (
    <div
      style={{
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: 20,
        overflow: "hidden",
        textAlign: "left",
        animation: "ckSlideUp 0.35s ease",
      }}
    >
      <div
        style={{
          padding: "24px 28px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: T.muted,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            Claim Reference
          </p>
          <p
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: T.text,
              margin: 0,
              letterSpacing: 0.5,
            }}
          >
            {data.claimRefNo}
          </p>
          {data.crmTicketNumber && (
            <p style={{ fontSize: 12, color: T.muted, margin: "4px 0 0" }}>
              CRM: {data.crmTicketNumber}
            </p>
          )}
        </div>
        <StatusBadge status={data.currentStatus} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        <div style={{ padding: "28px", borderRight: `1px solid ${T.border}` }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: T.muted,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 20,
            }}
          >
            Policy Details
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <DetailRow label="Policy Number" value={data.policyNumber} />
            <DetailRow
              label="Insurance Company"
              value={data.insuranceCompany}
            />
            <DetailRow
              label="Insurance Type"
              value={capitalize(data.insuranceType)}
            />
            <DetailRow label="Proposer Name" value={data.proposerName} />
            <DetailRow
              label="Date of Incident"
              value={formatDate(data.dateOfIncident)}
            />
            {data.estimatedClaimAmount != null && (
              <DetailRow
                label="Estimated Amount"
                value={`₹${Number(data.estimatedClaimAmount).toLocaleString("en-IN")}`}
                accent
              />
            )}
            <DetailRow
              label="Policy Source"
              value={capitalize(data.policySource)}
            />
            <DetailRow
              label="Submitted On"
              value={formatDateTime(data.submittedAt)}
            />
            <DetailRow
              label="Last Updated"
              value={formatDateTime(data.lastUpdated)}
            />
          </div>
        </div>
        <div style={{ padding: "28px" }}>
          <ClaimTimeline timeline={data.timeline} />
        </div>
      </div>
    </div>
  );
}

// ─── My Claim Row Card ────────────────────────────────────────────────────────
function MyClaimRow({ claim, onTrack }) {
  const cfg = STATUS_CONFIG[claim.currentStatus] || {
    label: capitalize(claim.currentStatus),
    color: T.muted,
    bg: "rgba(0,0,0,0.05)",
  };

  return (
    <div
      onClick={() => onTrack(claim.claimRefNo)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 20px",
        borderRadius: 14,
        border: `1px solid ${T.border}`,
        background: T.bgCard,
        cursor: "pointer",
        gap: 16,
        flexWrap: "wrap",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = T.primary;
        e.currentTarget.style.boxShadow = `0 4px 20px rgba(255,179,0,0.08)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = T.border;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Left — Icon + Info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          flex: 1,
          minWidth: 0,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            flexShrink: 0,
            background: `${cfg.color}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i
            className="fa-solid fa-file-shield"
            style={{ color: cfg.color, fontSize: 17 }}
          />
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              margin: 0,
              color: T.text,
              letterSpacing: 0.3,
            }}
          >
            {claim.claimRefNo}
          </p>
          <p
            style={{
              fontSize: 12,
              color: T.muted,
              margin: "3px 0 0",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {capitalize(claim.insuranceType)} · {claim.insuranceCompany || "—"}
          </p>
        </div>
      </div>

      {/* Center — Amount + Date */}
      <div style={{ display: "flex", gap: 28, flexShrink: 0 }}>
        {claim.estimatedClaimAmount != null && (
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.muted,
                textTransform: "uppercase",
                letterSpacing: 0.6,
                margin: "0 0 3px",
              }}
            >
              Amount
            </p>
            <p
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: T.primary,
                margin: 0,
              }}
            >
              ₹{Number(claim.estimatedClaimAmount).toLocaleString("en-IN")}
            </p>
          </div>
        )}
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: T.muted,
              textTransform: "uppercase",
              letterSpacing: 0.6,
              margin: "0 0 3px",
            }}
          >
            Filed On
          </p>
          <p
            style={{ fontSize: 13, fontWeight: 500, color: T.text, margin: 0 }}
          >
            {formatDate(claim.submittedAt)}
          </p>
        </div>
      </div>

      {/* Right — Status + Arrow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
        }}
      >
        <StatusBadge status={claim.currentStatus} />
        <i
          className="fa-solid fa-chevron-right"
          style={{ color: T.muted, fontSize: 12 }}
        />
      </div>
    </div>
  );
}

// ─── My Claims Section ────────────────────────────────────────────────────────
function MyClaimsSection({ onTrack }) {
  const dispatch = useDispatch();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const res = await dispatch(getMyClaims(API_URL));
        if (res?.success && Array.isArray(res.data?.claims)) setClaims(res.data?.claims);
        else setError(res?.message || "Could not load claims.");
      } catch {
        setError("Something went wrong while loading your claims.");
      } finally {
        setLoading(false);
      }
    })();
  }, []); // ← empty deps, runs once on mount

  const tabs = [
    { key: "all", label: "All" },
    { key: "submitted", label: "Submitted" },
    { key: "under_review", label: "Under Review" },
    { key: "resolved", label: "Resolved" },
    { key: "rejected", label: "Rejected" },
  ];

  const filtered =
    filter === "all"
      ? claims
      : claims.filter((c) => c.currentStatus === filter);

  return (
    <div style={{ marginTop: 48 }}>
      {/* Section Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h3
            style={{
              fontSize: 20,
              fontWeight: 800,
              margin: "0 0 4px",
              color: T.text,
            }}
          >
            My Claims
          </h3>
          <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>
            {loading
              ? "Loading…"
              : `${claims.length} claim${claims.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* Filter Tabs */}
        {!loading && claims.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {tabs.map((t) => {
              const count =
                t.key === "all"
                  ? claims.length
                  : claims.filter((c) => c.currentStatus === t.key).length;
              const active = filter === t.key;
              if (t.key !== "all" && count === 0) return null;
              return (
                <button
                  key={t.key}
                  onClick={() => setFilter(t.key)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 999,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    border: `1.5px solid ${active ? T.primary : T.border}`,
                    background: active ? `${T.primary}18` : "transparent",
                    color: active ? T.primary : T.muted,
                    transition: "all 0.18s",
                  }}
                >
                  {t.label}{" "}
                  {count > 0 && <span style={{ opacity: 0.7 }}>({count})</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div
          style={{
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            padding: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            color: T.muted,
            fontSize: 13,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: `3px solid ${T.border}`,
              borderTopColor: T.primary,
              animation: "ckSpin 0.7s linear infinite",
            }}
          />
          <span>Loading your claims…</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 18px",
            borderRadius: 12,
            background: "rgba(239,68,68,0.07)",
            border: "1px solid rgba(239,68,68,0.2)",
            fontSize: 13,
            color: "#EF4444",
          }}
        >
          <i className="fa-solid fa-circle-exclamation" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && claims.length === 0 && (
        <div
          style={{
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              margin: "0 auto 16px",
              background: `${T.primary}12`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i
              className="fa-solid fa-folder-open"
              style={{ fontSize: 24, color: T.primary, opacity: 0.6 }}
            />
          </div>
          <p
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: T.text,
              margin: "0 0 6px",
            }}
          >
            No claims yet
          </p>
          <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>
            Claims you file will appear here for easy tracking.
          </p>
        </div>
      )}

      {/* No filtered results */}
      {!loading && !error && claims.length > 0 && filtered.length === 0 && (
        <div
          style={{
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            padding: "32px 24px",
            textAlign: "center",
            color: T.muted,
            fontSize: 13,
          }}
        >
          No claims with status{" "}
          <strong>{tabs.find((t) => t.key === filter)?.label}</strong>.
        </div>
      )}

      {/* Claims List */}
      {!loading && !error && filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((claim) => (
            <MyClaimRow
              key={claim.claimRefNo}
              claim={claim}
              onTrack={onTrack}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TrackClaimPage ───────────────────────────────────────────────────────────
export default function TrackClaimPage({ navigate }) {
  const dispatch = useDispatch();

  const [refInput, setRefInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleTrack(refNo) {
    const trimmed = (refNo ?? refInput).trim();
    if (!trimmed) {
      setError("Please enter a claim reference number.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");
    setRefInput(trimmed);

    try {
      const res = await dispatch(trackClaim(API_URL, trimmed));
      if (res?.success && res.data) setResult(res.data);
      else
        setError(
          res?.message || "Claim not found. Please check the reference number.",
        );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setRefInput("");
    setResult(null);
    setError("");
  }

  return (
    <>
      <style>{`
        @keyframes ckSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ckSpin    { to { transform: rotate(360deg); } }
        .ck-track-input { width: 100%; background: transparent; border: none; outline: none; font-size: 15px; color: inherit; font-family: inherit; }
        .ck-track-input::placeholder { opacity: 0.45; }
        .ck-track-input-wrap { display: flex; align-items: center; gap: 12px; border: 1.5px solid ${T.border}; border-radius: 14px; padding: 14px 16px; background: ${T.bgCard}; transition: border-color 0.2s; }
        .ck-track-input-wrap:focus-within { border-color: ${T.primary}; box-shadow: 0 0 0 3px rgba(255,179,0,0.1); }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <button
            onClick={() => navigate("home")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: T.muted,
              fontSize: 13,
              fontWeight: 600,
              padding: 0,
              marginBottom: 24,
            }}
          >
            <i className="fa-solid fa-arrow-left" style={{ fontSize: 11 }} />{" "}
            Back to Home
          </button>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              margin: "0 0 8px",
              color: T.text,
            }}
          >
            Track Claim Status
          </h2>
          <p style={{ fontSize: 14, color: T.muted, margin: 0 }}>
            Enter your CoverKraft claim reference number to check the latest
            status and timeline.
          </p>
        </div>

        {/* Search Box */}
        <div
          style={{
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: 20,
            padding: 28,
            marginBottom: 28,
          }}
        >
          <label
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: T.muted,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              display: "block",
              marginBottom: 10,
            }}
          >
            Claim Reference Number
          </label>
          <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
            <div className="ck-track-input-wrap" style={{ flex: 1 }}>
              <i
                className="fa-solid fa-magnifying-glass"
                style={{ color: T.muted, fontSize: 14, flexShrink: 0 }}
              />
              <input
                className="ck-track-input"
                type="text"
                value={refInput}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase(); // ✅ force uppercase
                  setRefInput(value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                placeholder="e.g. CK-CLM-1749123456789-4521"
                spellCheck={false}
                autoComplete="off"
              />
              {refInput && (
                <button
                  onClick={handleReset}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: T.muted,
                    fontSize: 14,
                    padding: 0,
                    flexShrink: 0,
                  }}
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              )}
            </div>
            <Button
              text={loading ? "Tracking…" : "Track Claim"}
              onClick={() => handleTrack()}
              bgcolor={T.accent}
              color="#000"
              disabled={loading}
              customStyle={{ borderRadius: 12, minWidth: 130, fontWeight: 700 }}
            />
          </div>

          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 14,
                padding: "12px 14px",
                background: "rgba(239,68,68,0.07)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 10,
                fontSize: 13,
                color: "#EF4444",
                animation: "ckSlideUp 0.25s ease",
              }}
            >
              <i className="fa-solid fa-circle-exclamation" />{" "}
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div
            style={{
              background: T.bgCard,
              border: `1px solid ${T.border}`,
              borderRadius: 20,
              padding: 48,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              color: T.muted,
              fontSize: 14,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: `3px solid ${T.border}`,
                borderTopColor: T.primary,
                animation: "ckSpin 0.7s linear infinite",
              }}
            />
            <span>Fetching claim details…</span>
          </div>
        )}

        {/* Result */}
        {result && !loading && <ClaimResultCard data={result} />}

        {/* Empty hint */}
        {!loading && !result && !error && (
          <div
            style={{
              textAlign: "center",
              padding: "48px 24px",
              color: T.muted,
              fontSize: 13,
            }}
          >
            <i
              className="fa-solid fa-file-magnifying-glass"
              style={{
                fontSize: 32,
                marginBottom: 14,
                display: "block",
                opacity: 0.35,
              }}
            />
            <p style={{ margin: 0 }}>
              Your claim details will appear here after you search.
            </p>
          </div>
        )}

        {/* ── My Claims Section ── */}
        <MyClaimsSection onTrack={handleTrack} />
      </div>
    </>
  );
}
