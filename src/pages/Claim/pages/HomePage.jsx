import { useState, useCallback } from "react";
import CustomInput from "../../../component/CustomInput";
import Button from "../../../component/Button";
import { T, inputSx } from "../tokens";
import { DOC_DATA } from "../Data";
import { TabBtn, HoverCard } from "../ui";

// ─── Static content maps ──────────────────────────────────────────────────────
const heroContent = {
  health: {
    title: "Intimate a Health Claim",
    desc: "Need to file for hospitalization or medical expenses? Start your health claim intimation here for rapid processing and TPA coordination.",
  },
  motor: {
    title: "Intimate a Motor Claim",
    desc: "Experiencing an incident? Register your claim in under 2 minutes. Our experts will trigger an immediate response to assist you.",
  },
  life: {
    title: "Intimate a Life Claim",
    desc: "We are here for you in difficult times. File for death or maturity benefits with our compassionate claims support team.",
  },
};

const procSteps = {
  health: {
    cashless: [
      { n: 1, h: "Admission", p: "Admit to network hospital." },
      { n: 2, h: "Notification", p: "Notify insurer / TPA." },
      { n: 3, h: "Authorisation", p: "Cashless auth approved." },
      { n: 4, h: "Treatment", p: "Receive treatment." },
      { n: 5, h: "Pay Difference", p: "Pay any excess to hospital." },
      { n: 6, h: "Discharge", p: "Discharged after treatment." },
      { n: 7, h: "Settlement", p: "Claim paid directly to hospital." },
    ],
    reimbursement: [
      { n: 1, h: "Admission", p: "Admit to any hospital." },
      { n: 2, h: "Notification", p: "Notify insurer / TPA." },
      { n: 3, h: "Treatment", p: "Receive treatment." },
      { n: 4, h: "Pay Bills", p: "Pay hospital bills yourself." },
      { n: 5, h: "Discharge", p: "Discharged after treatment." },
      { n: 6, h: "Submit Docs", p: "Submit all documents to insurer / TPA." },
      { n: 7, h: "Reimbursement", p: "Claim amount reimbursed." },
    ],
  },
  motor: {
    cashless: [
      { n: 1, h: "Accident", p: "Secure vehicle & note details." },
      { n: 2, h: "Notification", p: "Notify insurer." },
      { n: 3, h: "Estimate", p: "Network garage prepares estimate." },
      { n: 4, h: "Survey", p: "Surveyor assesses & approves." },
      { n: 5, h: "Repairs", p: "Garage carries out repairs." },
      { n: 6, h: "Pay Difference", p: "Pay any unapproved amount." },
      { n: 7, h: "Settlement", p: "Approved amount paid to garage." },
    ],
    reimbursement: [
      { n: 1, h: "Accident", p: "Secure vehicle & note details." },
      { n: 2, h: "Notification", p: "Notify insurer." },
      { n: 3, h: "Estimate", p: "Network garage prepares estimate." },
      { n: 4, h: "Survey", p: "Surveyor assesses & approves." },
      { n: 5, h: "Repairs", p: "Garage carries out repairs." },
      { n: 6, h: "Pay Garage", p: "Pay garage yourself." },
      { n: 7, h: "Submit Docs", p: "Submit docs to insurer / surveyor." },
      { n: 8, h: "Reimbursement", p: "Claim amount reimbursed." },
    ],
  },
  life: [
    { n: 1, h: "Incident", p: "Death, maturity, or rider event occurs." },
    { n: 2, h: "Intimate", p: "Inform the insurance company." },
    { n: 3, h: "Documents", p: "Submit all documents as required." },
    { n: 4, h: "Claim Paid", p: "Benefit paid to nominee / policyholder." },
  ],
};

// ─── Documents Center Data ────────────────────────────────────────────────────
const DISCLAIMER =
  "Apart from the documents mentioned here, Insurance company or TPA may ask any further relevant document for claims processing.";

const docsByCategory = {
  Motor: {
    subTypes: [
      {
        key: "own-damage",
        label: "Own Damage of Vehicle",
        icon: "fa-car-burst",
        docs: [
          "Claim form duly filled and signed by insured",
          "Policy copy",
          "Copy of Registration Certificate",
          "Copy of Driving License (if vehicle is driven at the time of loss)",
          "Copy of permit (commercial vehicles)",
          "Copy of fitness certificate (commercial vehicles)",
          "Copy of load challan (commercial vehicles)",
          "Repair Estimates",
          "Damage Photographs",
          "Repair bills",
          "Payment receipts (in case of reimbursement case)",
          "Discharge Voucher signed by Insured in case of Cashless claim",
          "IRDAI Licensed Surveyor Report (Mandatory for claims beyond ₹50,000)",
          "Original Registration Certificate (in case of total loss)",
          "NOC from financier if hypothecated (in case of total loss)",
          "All transfer documents duly signed by insured (in case of total loss)",
          "Original Keys (in case of total loss)",
          "KYC Documents",
          "Bank details / Cancelled cheque of insured / beneficiary (in case of reimbursement case)",
        ],
      },
      {
        key: "theft",
        label: "Theft of Vehicle",
        icon: "fa-car-on",
        docs: [
          "Claim form duly filled and signed by insured",
          "Policy",
          "Original Registration Certificate",
          "Copy of Driving License (if vehicle is driven at the time of loss)",
          "Copy of permit (commercial vehicles)",
          "Copy of fitness certificate (commercial vehicles)",
          "Copy of load challan (commercial vehicles)",
          "Police FIR",
          "Police Final Report",
          "No Trace Certificate",
          "NOC from financier if hypothecated (in case of total loss)",
          "All transfer documents duly signed by insured (in case of total loss)",
          "Original Keys (in case of total loss)",
          "KYC Documents",
          "Bank details / Cancelled cheque of insured / beneficiary",
        ],
      },
      {
        key: "personal-accident-motor",
        label: "Personal Accident in Motor Policy",
        icon: "fa-person-falling-burst",
        docs: [
          "Claim form duly filled and signed by insured / claimant",
          "Policy copy",
          "Copy of Registration Certificate",
          "Copy of Driving License",
          "Police FIR",
          "Disability Certificate from treating doctor",
          "Hospital Discharge Summary",
          "MLC Document",
          "Death Certificate (In case of death)",
          "Legal Heir Certificate (In case of death)",
          "Indemnity bond signed by insured / beneficiary",
          "KYC Documents",
          "Bank details / Cancelled cheque of insured / beneficiary",
        ],
      },
      {
        key: "third-party",
        label: "Third Party",
        icon: "fa-gavel",
        docs: [
          "This claim is handled in court – MACT (Motor Accident Claims Tribunal).",
          "A lawyer from the Insurance company may ask for required information from the Insured.",
        ],
        isInfo: true,
      },
    ],
  },
  Health: {
    subTypes: [
      {
        key: "health-claim",
        label: "Health Claim",
        icon: "fa-heart-pulse",
        docs: [
          "Claim Form duly filled and signed by insured",
          "Policy Copy",
          "All diagnostic reports",
          "All prescriptions / advise by treating doctor",
          "All Indoor case papers",
          "All pharmacy bills",
          "Hospital Discharge summary",
          "Hospital Bill/s",
          "Payment receipt/s",
          "KYC Documents",
          "Bank details / Cancelled cheque of insured / beneficiary (in case of reimbursement claim)",
        ],
      },
      {
        key: "personal-accident",
        label: "Personal Accident",
        icon: "fa-person-falling-burst",
        docs: [
          "Claim form duly filled and signed by insured / claimant",
          "Policy copy",
          "Police FIR",
          "Disability Certificate from treating doctor",
          "Hospital Discharge Summary",
          "MLC Document",
          "Death Certificate (In case of death)",
          "Legal Heir Certificate / succession certificate (In case of death and no nominee in policy)",
          "Indemnity bond signed by insured / beneficiary",
          "KYC Documents",
          "Bank details / Cancelled cheque of insured / beneficiary",
        ],
      },
    ],
  },
  Life: {
    subTypes: [
      {
        key: "surrender",
        label: "Surrender",
        icon: "fa-file-circle-xmark",
        docs: [
          "Original Policy Bond",
          "Surrender Request Form",
          "KYC Documents",
          "Bank details / Cancelled cheque of insured",
        ],
      },
      {
        key: "death",
        label: "Death Claim",
        icon: "fa-file-medical",
        docs: [
          "Claim form duly filled and signed by beneficiary",
          "Original Policy",
          "Death Certificate",
          "Cause of death certificate",
          "Attending physician statement",
          "Medical records",
          "Police FIR (in case of unnatural death)",
          "Post Mortem Report if applicable (in case of unnatural death)",
          "Panchnama / Inquest Report (in case of unnatural death)",
          "Police Final Investigation report (in case of unnatural death)",
          "Legal heir certificate / Succession certificate (where there is no nominee in policy)",
          "Indemnity bond",
          "KYC Documents",
          "Bank details / Cancelled cheque of insured / beneficiary",
        ],
      },
      {
        key: "maturity",
        label: "Maturity",
        icon: "fa-calendar-check",
        docs: [
          "Original Policy",
          "Discharge Voucher",
          "KYC Documents",
          "Bank details / Cancelled cheque of insured / beneficiary",
        ],
      },
      {
        key: "others",
        label: "Others",
        icon: "fa-folder-open",
        docs: [
          "Claim form duly filled and signed by Insured",
          "Policy copy",
          "Other documents as required by Insurance Company or Surveyor or insurer authorised investigator",
          "KYC Documents",
          "Bank details / Cancelled cheque of insured / beneficiary",
        ],
      },
    ],
  },
};

// ─── Reusable Process Row ─────────────────────────────────────────────────────
function ProcessRow({ steps, accentColor, label, badgeBg, badgeColor }) {
  const cols = steps.length;
  return (
    <div style={{ marginBottom: 32 }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: badgeBg,
          color: badgeColor,
          fontSize: 11,
          fontWeight: 600,
          padding: "4px 12px",
          borderRadius: 20,
          marginBottom: 18,
          border: `1px solid ${badgeColor}33`,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 12,
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Connector line */}
        <div
          style={{
            position: "absolute",
            top: 21,
            left: `${(0.5 / cols) * 100}%`,
            right: `${(0.5 / cols) * 100}%`,
            height: 1,
            background: T.border,
            zIndex: 1,
          }}
        />
        {steps.map((s) => (
          <div key={s.n} style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                width: 42,
                height: 42,
                background: T.bgCard,
                color: accentColor,
                border: `2px solid ${accentColor}`,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 15,
                margin: "0 auto 10px",
              }}
            >
              {s.n}
            </div>
            <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
              {s.h}
            </h4>
            <p style={{ fontSize: 11.5, color: T.muted, lineHeight: 1.4 }}>
              {s.p}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Documents Center Section ─────────────────────────────────────────────────
function DocumentsCenter() {
  const [activeCategory, setActiveCategory] = useState("Motor");
  const [activeSubType, setActiveSubType] = useState("own-damage");

  const categoryData = docsByCategory[activeCategory];
  const subTypeData = categoryData.subTypes.find((s) => s.key === activeSubType)
    || categoryData.subTypes[0];

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setActiveSubType(docsByCategory[cat].subTypes[0].key);
  };

  return (
    <section
      style={{
        padding: "56px 0",
        background: T.bg,
        borderTop: `1px solid ${T.border}`,
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
            Documents Center
          </h2>
          <p style={{ color: T.muted }}>
            Know exactly which documents you need for your claim type
          </p>
        </div>

        {/* Main Category Tabs */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: `1px solid ${T.border}`,
            marginBottom: 0,
          }}
        >
          {Object.keys(docsByCategory).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              style={{
                padding: "12px 28px",
                background: activeCategory === cat ? T.bgCard : "transparent",
                color: activeCategory === cat ? T.text : T.muted,
                border: "none",
                borderBottom:
                  activeCategory === cat
                    ? `2px solid ${T.accent}`
                    : "2px solid transparent",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: activeCategory === cat ? 700 : 500,
                transition: "all 0.15s",
              }}
            >
              {cat} Insurance
            </button>
          ))}
        </div>

        {/* Card container */}
        <div
          style={{
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderTop: "none",
            borderRadius: "0 0 18px 18px",
            overflow: "hidden",
          }}
        >
          {/* Sub-type selector */}
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: "20px 28px",
              borderBottom: `1px solid ${T.border}`,
              flexWrap: "wrap",
            }}
          >
            {categoryData.subTypes.map((st) => (
              <button
                key={st.key}
                onClick={() => setActiveSubType(st.key)}
                style={{
                  padding: "8px 18px",
                  borderRadius: 30,
                  border: `1px solid ${
                    activeSubType === st.key ? T.accent : T.border
                  }`,
                  background:
                    activeSubType === st.key ? `${T.accent}18` : "transparent",
                  color: activeSubType === st.key ? T.accent : T.muted,
                  fontSize: 13,
                  fontWeight: activeSubType === st.key ? 600 : 400,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  transition: "all 0.15s",
                }}
              >
                <i className={`fa-solid ${st.icon}`} style={{ fontSize: 11 }} />
                {st.label}
              </button>
            ))}
          </div>

          {/* Document list */}
          <div style={{ padding: "28px 28px 8px" }}>
            {subTypeData.isInfo ? (
              /* Info-only sub type (Third Party) */
              <div
                style={{
                  background: `${T.primary}10`,
                  border: `1px solid ${T.primary}33`,
                  borderRadius: 12,
                  padding: "22px 26px",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <i
                    className="fa-solid fa-circle-info"
                    style={{ color: T.primary, fontSize: 18 }}
                  />
                  <span
                    style={{ fontWeight: 700, fontSize: 15, color: T.primary }}
                  >
                    Handled via Court – MACT
                  </span>
                </div>
                {subTypeData.docs.map((d, i) => (
                  <p
                    key={i}
                    style={{ color: T.muted, fontSize: 13.5, lineHeight: 1.6 }}
                  >
                    {d}
                  </p>
                ))}
              </div>
            ) : (
              /* Regular doc list */
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px 24px",
                  marginBottom: 20,
                }}
              >
                {subTypeData.docs.map((doc, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "10px 0",
                      borderBottom: `1px solid ${T.border}`,
                    }}
                  >
                    <i
                      className="fa-solid fa-circle-check"
                      style={{
                        color: T.accent,
                        fontSize: 13,
                        marginTop: 2,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 13, lineHeight: 1.5 }}>{doc}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Disclaimer */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                background: `${T.primary}0d`,
                border: `1px solid ${T.primary}28`,
                borderRadius: 10,
                padding: "14px 18px",
                marginBottom: 24,
              }}
            >
              <i
                className="fa-solid fa-triangle-exclamation"
                style={{ color: T.primary, fontSize: 14, marginTop: 1, flexShrink: 0 }}
              />
              <p style={{ fontSize: 12.5, color: T.muted, margin: 0, lineHeight: 1.6 }}>
                {DISCLAIMER}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────
export default function HomePage({ navigate, loggedIn }) {
  const [activeTab, setActiveTab] = useState("health");
  const [docFilter, setDocFilter] = useState("Health");
  const [trackId, setTrackId] = useState("");

  const docs = DOC_DATA[docFilter] || [];

  const handleClaim = useCallback(() => {
    if (loggedIn) {
      navigate("new-claim");
    } else {
      window.location.assign("/login");
    }
  }, [navigate, loggedIn]);

  const handleTrack = useCallback(() => {
    if (loggedIn) {
      navigate("track-claim");
    } else {
      window.location.assign("/login");
    }
  }, [navigate, loggedIn]);

  return (
    <div>
      {/* ── Hero ── */}
      <header
        style={{
          background: T.bg,
          textAlign: "center",
          padding: "60px 24px 68px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            background: T.successBg,
            color: T.accent,
            fontSize: 11.5,
            padding: "6px 16px",
            borderRadius: 30,
            marginBottom: 22,
          }}
        >
          <i className="fa-solid fa-shield-halved" /> Claims Support Center
        </div>
        <h1 style={{ fontSize: 54, fontWeight: 800, marginBottom: 16 }}>
          Your <span style={{ color: T.primary }}>Claims Journey</span>,<br />
          Simplified
        </h1>
        <p
          style={{
            color: T.muted,
            fontSize: 17,
            maxWidth: 540,
            margin: "0 auto 40px",
          }}
        >
          Swift, transparent, and empathetic support from intimation to
          settlement.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginTop: 32,
          }}
        >
          <Button
            text="Intimate a Claim"
            onClick={handleClaim}
            bgcolor={T.accent}
            color="#000"
          />
          <Button
            text="Track Claim Status"
            onClick={handleTrack}
            bgcolor="transparent"
            color={T.text}
            borderColor={T.border}
          />
        </div>
      </header>

      {/* ── Stats ── */}
      <div
        style={{
          background: T.bgCard,
          borderTop: `1px solid ${T.border}`,
          borderBottom: `1px solid ${T.border}`,
          padding: "22px 0",
        }}
      />

      {/* ── Process ── */}
      <section
        style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 24px 0" }}
      >
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
            Understand the Process
          </h2>
          <p style={{ color: T.muted, fontSize: 15 }}>
            Select a product to see how the claim journey works
          </p>
        </div>

        <div
          style={{
            background: T.bgCard,
            borderRadius: 18,
            border: `1px solid ${T.border}`,
            overflow: "hidden",
            marginBottom: 56,
          }}
        >
          {/* Tab bar */}
          <div
            style={{ display: "flex", borderBottom: `1px solid ${T.border}` }}
          >
            {["health", "motor", "life"].map((t) => (
              <TabBtn
                key={t}
                active={activeTab === t}
                onClick={() => setActiveTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)} Insurance
              </TabBtn>
            ))}
          </div>

          <div style={{ padding: 42 }}>
            {/* ── Health & Motor: two process rows ── */}
            {activeTab !== "life" ? (
              <>
                <ProcessRow
                  steps={procSteps[activeTab].cashless}
                  accentColor={T.accent}
                  label="Cashless Process — Network Hospital / Garage Route"
                  badgeBg={T.successBg}
                  badgeColor={T.accent}
                />

                <div
                  style={{
                    borderTop: `1px dashed ${T.border}`,
                    margin: "8px 0 28px",
                  }}
                />

                <ProcessRow
                  steps={procSteps[activeTab].reimbursement}
                  accentColor={T.primary}
                  label="Reimbursement Process — Any Provider Route"
                  badgeBg={T.primaryBg}
                  badgeColor={T.primary}
                />

                {/* Solution cards */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 18,
                    borderTop: `1px solid ${T.border}`,
                    paddingTop: 32,
                    marginTop: 8,
                  }}
                >
                  {[
                    {
                      accent: T.accent,
                      badge: "Preferred Choice",
                      badgeBg: T.successBg,
                      badgeBorder: "rgba(196,237,63,.22)",
                      badgeColor: T.accent,
                      icon: activeTab === "motor" ? "fa-wrench" : "fa-hospital",
                      title: "Cashless Solution",
                      text:
                        activeTab === "motor"
                          ? "Available at 10,000+ network garages. We settle repair bills directly."
                          : "Available at 50,000+ network hospitals. We settle bills directly with the provider.",
                    },
                    {
                      accent: T.primary,
                      badge: "Any Provider",
                      badgeBg: T.primaryBg,
                      badgeBorder: "rgba(255,179,0,.22)",
                      badgeColor: T.primary,
                      icon: "fa-receipt",
                      title: "Reimbursement",
                      text:
                        activeTab === "motor"
                          ? "Repair anywhere, submit invoices, receive reimbursement within 10 days."
                          : "Pay at any provider, submit documents, get reimbursed in 7 working days.",
                    },
                  ].map((sol) => (
                    <div
                      key={sol.title}
                      style={{
                        background: T.bg,
                        border: `1px solid ${T.border}`,
                        borderLeft: `4px solid ${sol.accent}`,
                        padding: 26,
                        borderRadius: 14,
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: 26,
                          right: 26,
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "4px 10px",
                          borderRadius: 6,
                          background: sol.badgeBg,
                          color: sol.badgeColor,
                          border: `1px solid ${sol.badgeBorder}`,
                        }}
                      >
                        {sol.badge}
                      </span>
                      <h4
                        style={{
                          fontSize: 15.5,
                          fontWeight: 600,
                          marginBottom: 9,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <i className={`fa-solid ${sol.icon}`} /> {sol.title}
                      </h4>
                      <p
                        style={{
                          fontSize: 13.5,
                          color: T.muted,
                          lineHeight: 1.6,
                        }}
                      >
                        {sol.text}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* ── Life: single 4-step process ── */
              <>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: T.primaryBg,
                    color: T.primary,
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "4px 12px",
                    borderRadius: 20,
                    marginBottom: 24,
                    border: `1px solid ${T.primary}33`,
                  }}
                >
                  Life Claim Process — All Claim Types
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 20,
                    textAlign: "center",
                    position: "relative",
                    marginBottom: 40,
                  }}
                >
                  {/* Connector line */}
                  <div
                    style={{
                      position: "absolute",
                      top: 21,
                      left: "12%",
                      right: "12%",
                      height: 1,
                      background: T.border,
                      zIndex: 1,
                    }}
                  />
                  {procSteps.life.map((s) => (
                    <div key={s.n} style={{ position: "relative", zIndex: 2 }}>
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          background: T.bgCard,
                          color: T.primary,
                          border: `2px solid ${T.primary}`,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: 15,
                          margin: "0 auto 10px",
                        }}
                      >
                        {s.n}
                      </div>
                      <h4
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          marginBottom: 5,
                        }}
                      >
                        {s.h}
                      </h4>
                      <p
                        style={{
                          fontSize: 12.5,
                          color: T.muted,
                          lineHeight: 1.4,
                        }}
                      >
                        {s.p}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Life claim type buttons */}
                <div
                  style={{
                    borderTop: `1px solid ${T.border}`,
                    paddingTop: 28,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{ fontSize: 13, color: T.muted, marginRight: 4 }}
                  >
                    Applies to:
                  </span>
                  {["Death Claim", "Maturity Claim", "Rider Claim"].map(
                    (label) => (
                      <Button
                        key={label}
                        text={label}
                        bgcolor="transparent"
                        color={T.text}
                        borderColor={T.border}
                        padding="9px 18px"
                        fontSize="13px"
                      />
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Documents Center (replaces old Doc Center) ── */}
      <DocumentsCenter />

      {/* ── Action Grid ── */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 28,
            padding: "60px 0 80px",
          }}
        >
          <div
            style={{
              background: T.bgCard,
              border: `1px solid ${T.border}`,
              borderRadius: 20,
              padding: 40,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h3
              style={{
                fontSize: 28,
                fontWeight: 700,
                marginBottom: 16,
                lineHeight: 1.2,
              }}
            >
              {heroContent[activeTab].title}
            </h3>
            <p
              style={{
                color: T.muted,
                fontSize: 15,
                lineHeight: 1.6,
                marginBottom: 32,
              }}
            >
              {heroContent[activeTab].desc}
            </p>
            <div
              style={{
                marginBottom: 32,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {[
                "Automated Policy Fetching",
                "Instant Surveyor Assignment",
                "24/7 Priority Support",
              ].map((f) => (
                <div
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  <i
                    className="fa-solid fa-circle-check"
                    style={{ color: T.accent, fontSize: 16 }}
                  />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <Button
              text="Start Intimation"
              onClick={handleClaim}
              bgcolor={T.accent}
              color="#000"
              width="100%"
              padding="18px 26px"
              fontSize="16px"
              borderRadius="40px"
            />
          </div>

          <div>
            <div
              onClick={handleTrack}
              style={{
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: 28,
                cursor: "pointer",
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = `0 4px 24px ${T.primary}22`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "none")
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: 16 }}
                >
                  <div
                    style={{
                      background: `${T.primary}18`,
                      borderRadius: 12,
                      width: 48,
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      className="fa-solid fa-file-lines"
                      style={{ color: T.primary, fontSize: 20 }}
                    />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        marginBottom: 4,
                      }}
                    >
                      My Claims
                    </h3>
                    <p style={{ color: T.muted, fontSize: 13, margin: 0 }}>
                      Track & manage all your submitted claims
                    </p>
                  </div>
                </div>
                <i
                  className="fa-solid fa-arrow-right"
                  style={{ color: T.primary, fontSize: 18 }}
                />
              </div>
            </div>

            <div
              style={{
                background: "#0f0f0f",
                border: `1px solid ${T.border}`,
                borderTop: `3px solid ${T.primary}`,
                borderRadius: 16,
                padding: 34,
                marginTop: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    background: T.primaryBg,
                    color: T.primary,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i className="fa-solid fa-user-tie" />
                </div>
                <h3 style={{ color: T.primary, margin: 0 }}>
                  The Claim Advisory
                </h3>
              </div>
              <i
                style={{
                  display: "block",
                  fontSize: 14,
                  marginBottom: 13,
                  fontStyle: "italic",
                  color: T.muted,
                }}
              >
                "Claim stuck? Rejected? Not our policy? We can still help."
              </i>
              <p style={{ fontSize: 13.5, color: T.muted, marginBottom: 16 }}>
                Our experts review claims from any insurer, even if you didn't
                buy from us.
              </p>
              <Button
                text="Get Free Consultation"
                onClick={() => navigate("advisory")}
                bgcolor={T.accent}
                color="#000"
                width="100%"
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 16,
                  marginTop: 16,
                  fontSize: 12,
                  color: T.muted,
                  flexWrap: "wrap",
                }}
              >
                {["Rejection Review", "Legal Guidance", "Documentation Aid"].map(
                  (f) => (
                    <span key={f}>
                      <i
                        className="fa-solid fa-check"
                        style={{ color: T.accent, marginRight: 5 }}
                      />
                      {f}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}