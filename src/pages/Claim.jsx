import { useState } from "react";
import CustomInput from "../component/CustomInput";  // adjust path as needed
import Button from "../component/Button";             // adjust path as needed
import {
  validateEmail,
  validatePhoneNumber,
  validateRequired,
} from "../utils/formValidation";                         // adjust path as needed

// ─── Data ─────────────────────────────────────────────────────────────────────
const MY_POLICIES = [
  { id: "p1", policyNumber: "POL-2024-001", company: "HDFC ERGO",    type: "Motor",  holder: "Rajesh Kumar", startDate: "01-Apr-25", endDate: "31-Mar-26", subType: "Comp.",     detail: "MH-01-AB-1234", model: "Maruti Swift" },
  { id: "p2", policyNumber: "POL-2024-089", company: "Star Health",  type: "Health", holder: "Rajesh Kumar", startDate: "15-Jun-25", endDate: "15-Jun-26", subType: "Floater",   sumInsured: "₹15L" },
  { id: "p3", policyNumber: "POL-2023-445", company: "Bajaj Allianz",type: "Life",   holder: "Rajesh Kumar", startDate: "01-Jan-24", endDate: "01-Jan-28", subType: "Term Plus", sumAssured: "₹1.5Cr" },
];

const DOC_DATA = {
  Motor: [
    { icon: "fa-file-pdf",      title: "Motor Claim Form",        desc: "Required for all motor accident / damage claims.",                    link: "Download Form"  },
    { icon: "fa-image",         title: "Accident Photo Checklist", desc: "Guide to photographing damage for motor surveys.",                    link: "View Checklist" },
    { icon: "fa-car-burst",     title: "Total Loss Declaration",   desc: "For vehicles declared total loss / CTL.",                             link: "Download Form"  },
  ],
  Health: [
    { icon: "fa-file-medical",  title: "Health Claim Form",        desc: "Required for all hospitalization and medical expense claims.",        link: "Download Form"  },
    { icon: "fa-hospital",      title: "Network Hospital List",    desc: "Find cashless hospitals near you for direct settlement.",             link: "View List"      },
    { icon: "fa-receipt",       title: "Reimbursement Checklist",  desc: "Documents needed for out-of-pocket expense reimbursement.",           link: "View Checklist" },
  ],
  Life: [
    { icon: "fa-file-contract", title: "Death Claim Form",         desc: "Required for intimating a life insurance death claim.",              link: "Download Form"  },
    { icon: "fa-coins",         title: "Maturity Claim Form",      desc: "For policy maturity and survival benefit claims.",                   link: "Download Form"  },
    { icon: "fa-shield-halved", title: "Rider Claim Checklist",    desc: "Documents required for critical illness or disability rider claims.", link: "View Checklist" },
  ],
};

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  primary:   "#ffb300",
  accent:    "#c4ed3f",
  bg:        "#0a0a0a",
  bgCard:    "#161616",
  bgInput:   "#1a1a1a",
  text:      "#ffffff",
  muted:     "#a3a3a3",
  border:    "#262626",
  danger:    "#ff4d4d",
  successBg: "rgba(196,237,63,0.08)",
  primaryBg: "rgba(255,179,0,0.08)",
};

// Minimal global styles — only what isn't handled by imported components
const GLOBAL_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .ck-label { display:block; font-size:10px; color:#a3a3a3; margin-bottom:8px; letter-spacing:1px; text-transform:uppercase; font-weight:700; }
  .ck-err-msg { color:#ff4d4d; font-size:12px; margin-top:5px; display:block; }
`;

// Shared sx passed into every CustomInput so it inherits the dark theme
const inputSx = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: `1px solid ${T.border}`,
  background: T.bgInput,
  color: T.text,
  outline: "none",
  fontSize: "14px",
  fontFamily: "inherit",
};

const stepNav = () => ({
  display: "flex", justifyContent: "space-between",
  marginTop: 40, paddingTop: 24, borderTop: `1px solid ${T.border}`,
});

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, show }) {
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%",
      transform: show ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(80px)",
      background: T.bgCard, color: type === "err" ? T.danger : T.text,
      border: `1px solid ${type === "err" ? T.danger : T.border}`,
      padding: "12px 24px", borderRadius: 30, fontSize: 14,
      transition: ".35s", opacity: show ? 1 : 0, zIndex: 9999, pointerEvents: "none",
    }}>
      {msg}
    </div>
  );
}

// ─── Tab button ───────────────────────────────────────────────────────────────
function TabBtn({ active, onClick, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, background: "transparent", border: "none",
        borderBottom: active || hov ? `2px solid ${T.accent}` : "2px solid transparent",
        padding: 20, fontSize: 14, fontWeight: 600,
        color: active || hov ? T.accent : T.muted,
        cursor: "pointer", transition: ".2s",
        backgroundImage: active ? "linear-gradient(to top, rgba(255,179,0,0.05), transparent)" : "none",
      }}
    >
      {children}
    </button>
  );
}

// ─── HoverCard ────────────────────────────────────────────────────────────────
function HoverCard({ children }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.bgCard, border: `1px solid ${hov ? T.primary : T.border}`,
        borderRadius: 14, padding: 26, transition: ".25s",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        cursor: "pointer", transform: hov ? "translateY(-2px)" : "none",
      }}
    >
      {children}
    </div>
  );
}

// ─── TypeCard ─────────────────────────────────────────────────────────────────
function TypeCard({ selected, onClick, children }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: selected ? T.successBg : T.bg,
        border: `1.5px solid ${selected ? T.accent : hov ? T.primary : T.border}`,
        borderRadius: 14, padding: "24px 10px", textAlign: "center",
        cursor: "pointer", transition: "0.2s",
      }}
    >
      {children}
    </div>
  );
}

// ─── PolicyItem ───────────────────────────────────────────────────────────────
function PolicyItem({ policy: p, selected, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: selected ? T.primaryBg : T.bg,
        border: `1px solid ${selected ? T.primary : hov ? T.muted : T.border}`,
        borderRadius: 12, padding: 16, cursor: "pointer", transition: "all 0.2s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <h5 style={{ fontSize: 15, fontWeight: 700 }}>{p.policyNumber}</h5>
          <p style={{ fontSize: 11, color: T.muted }}>{p.company}</p>
        </div>
        <div style={{ fontSize: 9, fontWeight: 800, color: T.accent, textTransform: "uppercase", letterSpacing: 1 }}>ACTIVE</div>
      </div>
      <div style={{ paddingTop: 12, borderTop: "1px solid rgba(255,179,0,0.08)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {[
            { lbl: "Insured", val: p.holder },
            { lbl: "Expiry",  val: p.endDate },
            ...(p.type === "Motor"  ? [{ lbl: "Vehicle", val: p.model      }, { lbl: "Reg No",  val: p.detail    }] : []),
            ...(p.type === "Health" ? [{ lbl: "Limit",   val: p.sumInsured }, { lbl: "Plan",    val: p.subType   }] : []),
            ...(p.type === "Life"   ? [{ lbl: "Assured", val: p.sumAssured }, { lbl: "Plan",    val: p.subType   }] : []),
          ].map(({ lbl, val }) => (
            <div key={lbl}>
              <label style={{ fontSize: 8, color: T.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2, display: "block" }}>{lbl}</label>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── OcrZone ──────────────────────────────────────────────────────────────────
function OcrZone({ scanning, onScan }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onScan}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: `2px dashed ${hov ? T.primary : T.border}`, borderRadius: 16, padding: 32,
        textAlign: "center", background: hov ? "rgba(255,179,0,0.03)" : "rgba(255,255,255,0.02)",
        cursor: "pointer", transition: "0.3s", marginBottom: 24, overflow: "hidden",
      }}
    >
      {!scanning ? (
        <>
          <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: 28, color: T.primary, marginBottom: 12, display: "block" }} />
          <h4 style={{ fontSize: 15, marginBottom: 4 }}>Smart Policy Scan (OCR)</h4>
          <p style={{ fontSize: 12, color: T.muted }}>Upload your policy copy (PDF/IMG) to auto-fill details instantly</p>
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0" }}>
          <i className="fa-solid fa-circle-notch" style={{ fontSize: 24, color: T.primary }} />
          <p style={{ marginTop: 12, fontWeight: 700 }}>Scanning Document...</p>
        </div>
      )}
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ navigate }) {
  const [activeTab, setActiveTab] = useState("health");
  const [docFilter, setDocFilter] = useState("Health");
  const [trackId,   setTrackId]   = useState("");

  const heroContent = {
    health: { title: "Intimate a Health Claim", desc: "Need to file for hospitalization or medical expenses? Start your health claim intimation here for rapid processing and TPA coordination." },
    motor:  { title: "Intimate a Motor Claim",  desc: "Experiencing an incident? Register your claim in under 2 minutes. Our experts will trigger an immediate response to assist you." },
    life:   { title: "Intimate a Life Claim",   desc: "We are here for you in difficult times. File for death or maturity benefits with our compassionate claims support team." },
  };

  const procSteps = {
    health: [
      { n: 1, h: "Hospitalization", p: "Admit to any hospital network or otherwise." },
      { n: 2, h: "Intimation",      p: "Notify us via portal or phone within 24hrs."  },
      { n: 3, h: "Processing",      p: "Documents verified by our TPA partner."        },
      { n: 4, h: "Settlement",      p: "Claim paid to provider or your account."       },
    ],
    motor: [
      { n: 1, h: "Accident/Loss", p: "Secure vehicle. Note third-party details." },
      { n: 2, h: "Registration",  p: "Register claim & get reference number."    },
      { n: 3, h: "Survey",        p: "Licensed surveyor inspects within 48hrs."  },
      { n: 4, h: "Repair/Pay",    p: "Vehicle repaired or reimbursement paid."   },
    ],
  };

  const docs = DOC_DATA[docFilter] || [];

  return (
    <div>
      {/* ── Hero ── */}
      <header style={{ background: T.bg, textAlign: "center", padding: "60px 24px 68px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: T.successBg, color: T.accent, fontSize: 11.5, padding: "6px 16px", borderRadius: 30, marginBottom: 22 }}>
          <i className="fa-solid fa-shield-halved" /> Claims Support Center
        </div>
        <h1 style={{ fontSize: 54, fontWeight: 800, marginBottom: 16 }}>
          Your <span style={{ color: T.primary }}>Claims Journey</span>,<br />Simplified
        </h1>
        <p style={{ color: T.muted, fontSize: 17, maxWidth: 540, margin: "0 auto 40px" }}>
          Swift, transparent, and empathetic support from intimation to settlement.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 32 }}>
          <Button text="Intimate a Claim"    onClick={() => navigate("new-claim")}   bgcolor={T.accent}    color="#000" />
          <Button text="Track Claim Status"  onClick={() => navigate("track-claim")} bgcolor="transparent" color={T.text} borderColor={T.border} />
        </div>
      </header>

      {/* ── Stats ── */}
      <div style={{ background: T.bgCard, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "22px 0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "center", gap: 56, flexWrap: "wrap" }}>
          {[["98.2%","Settlement Ratio"],["2.4h","Avg. Approval"],["50K+","Network Hospitals"],["24/7","Claims Support"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 25, fontWeight: 700, color: T.accent }}>{n}</div>
              <div style={{ fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Process ── */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 24px 0" }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Understand the Process</h2>
          <p style={{ color: T.muted, fontSize: 15 }}>Select a product to see how the claim journey works</p>
        </div>

        <div style={{ background: T.bgCard, borderRadius: 18, border: `1px solid ${T.border}`, overflow: "hidden", marginBottom: 56 }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${T.border}` }}>
            {["health","motor","life"].map((t) => (
              <TabBtn key={t} active={activeTab === t} onClick={() => setActiveTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)} Insurance
              </TabBtn>
            ))}
          </div>

          <div style={{ padding: 42 }}>
            {activeTab !== "life" ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, textAlign: "center", position: "relative", marginBottom: 42 }}>
                  <div style={{ position: "absolute", top: 23, left: "12%", right: "12%", height: 1, background: T.border, zIndex: 1 }} />
                  {procSteps[activeTab].map((s) => (
                    <div key={s.n} style={{ position: "relative", zIndex: 2 }}>
                      <div style={{ width: 46, height: 46, background: T.bgCard, color: T.primary, border: `2px solid ${T.border}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 17, margin: "0 auto 13px" }}>{s.n}</div>
                      <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 5 }}>{s.h}</h4>
                      <p style={{ fontSize: 12.5, color: T.muted }}>{s.p}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, borderTop: `1px solid ${T.border}`, paddingTop: 38 }}>
                  {[
                    { accent: T.accent,  badge: "Preferred Choice", badgeBg: T.successBg, badgeBorder: "rgba(196,237,63,.22)", badgeColor: T.accent,  icon: activeTab === "motor" ? "fa-wrench"  : "fa-hospital", title: "Cashless Solution", text: activeTab === "motor" ? "Available at 10,000+ network garages. We settle repair bills directly."            : "Available at 50,000+ network hospitals. We settle bills directly with the provider." },
                    { accent: T.primary, badge: "Any Provider",     badgeBg: T.primaryBg, badgeBorder: "rgba(255,179,0,.22)",  badgeColor: T.primary, icon: "fa-receipt",                                         title: "Reimbursement",    text: activeTab === "motor" ? "Repair anywhere, submit invoices, receive reimbursement within 10 days." : "Pay at any provider, submit documents, get reimbursed in 7 working days."             },
                  ].map((sol) => (
                    <div key={sol.title} style={{ background: T.bg, border: `1px solid ${T.border}`, borderLeft: `4px solid ${sol.accent}`, padding: 26, borderRadius: 14, position: "relative" }}>
                      <span style={{ position: "absolute", top: 26, right: 26, fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: sol.badgeBg, color: sol.badgeColor, border: `1px solid ${sol.badgeBorder}` }}>{sol.badge}</span>
                      <h4 style={{ fontSize: 15.5, fontWeight: 600, marginBottom: 9, display: "flex", alignItems: "center", gap: 8 }}>
                        <i className={`fa-solid ${sol.icon}`} /> {sol.title}
                      </h4>
                      <p style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.6 }}>{sol.text}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ color: T.muted, marginBottom: 24 }}>Process flow varies by claim type (Death / Maturity / Rider).</p>
                <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                  <Button text="Death Claim"    bgcolor="transparent" color={T.accent} borderColor={T.accent} padding="9px 18px" fontSize="13px" />
                  <Button text="Maturity Claim" bgcolor="transparent" color={T.text}   borderColor={T.border} padding="9px 18px" fontSize="13px" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Doc Center ── */}
      <section style={{ padding: "56px 0", background: T.bg, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Document Center</h2>
              <p style={{ color: T.muted }}>Download checklists and claim forms instantly</p>
            </div>
            {/* imported CustomInput as a select */}
            <CustomInput
              type="select"
              name="docFilter"
              value={docFilter}
              onChange={(e) => setDocFilter(e.target.value)}
              fullWidth={false}
              sx={{ ...inputSx, width: "auto" }}
            >
              <option>Health</option>
              <option>Motor</option>
              <option>Life</option>
            </CustomInput>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {docs.map((d) => (
              <HoverCard key={d.title}>
                <div>
                  <div style={{ color: T.primary, fontSize: 21, marginBottom: 14 }}><i className={`fa-solid ${d.icon}`} /></div>
                  <h4 style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 5 }}>{d.title}</h4>
                  <p style={{ fontSize: 12.5, color: T.muted, marginBottom: 20, lineHeight: 1.5 }}>{d.desc}</p>
                </div>
                <a href="#" style={{ color: T.accent, textDecoration: "none", fontSize: 13.5, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                  {d.link} <i className="fa-solid fa-download" />
                </a>
              </HoverCard>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Button text="View all documents" onClick={() => navigate("documents")} bgcolor="transparent" color={T.muted} padding="9px 18px" fontSize="13px" />
          </div>
        </div>
      </section>

      {/* ── Action Grid ── */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, padding: "60px 0 80px" }}>
          <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 20, padding: 40, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, lineHeight: 1.2 }}>{heroContent[activeTab].title}</h3>
            <p style={{ color: T.muted, fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>{heroContent[activeTab].desc}</p>
            <div style={{ marginBottom: 32, display: "flex", flexDirection: "column", gap: 12 }}>
              {["Automated Policy Fetching","Instant Surveyor Assignment","24/7 Priority Support"].map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, fontWeight: 500 }}>
                  <i className="fa-solid fa-circle-check" style={{ color: T.accent, fontSize: 16 }} />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <Button text="Start Intimation" onClick={() => navigate("new-claim")} bgcolor={T.accent} color="#000" width="100%" padding="18px 26px" fontSize="16px" borderRadius="40px" />
          </div>

          <div>
            <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Track Existing Claim</h3>
              <p style={{ color: T.muted, fontSize: 14, marginBottom: 18 }}>Enter your Reference ID for real-time updates.</p>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                {/* imported CustomInput */}
                <CustomInput
                  name="trackId"
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  placeholder="Enter Ref ID (e.g., CK-CLM-001)"
                  sx={{ ...inputSx, paddingRight: 52 }}
                />
                <button
                  onClick={() => navigate("track-claim")}
                  style={{ position: "absolute", right: 6, background: T.bgCard, color: T.primary, border: `1px solid ${T.border}`, width: 34, height: 34, borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
            </div>

            <div style={{ background: "#0f0f0f", border: `1px solid ${T.border}`, borderTop: `3px solid ${T.primary}`, borderRadius: 16, padding: 34, marginTop: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 18 }}>
                <div style={{ width: 38, height: 38, background: T.primaryBg, color: T.primary, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="fa-solid fa-user-tie" />
                </div>
                <h3 style={{ color: T.primary, margin: 0 }}>The Claim Advisory</h3>
              </div>
              <i style={{ display: "block", fontSize: 14, marginBottom: 13, fontStyle: "italic", color: T.muted }}>
                "Claim stuck? Rejected? Not our policy? We can still help."
              </i>
              <p style={{ fontSize: 13.5, color: T.muted, marginBottom: 16 }}>Our experts review claims from any insurer, even if you didn't buy from us.</p>
              <Button text="Get Free Consultation" onClick={() => navigate("advisory")} bgcolor={T.accent} color="#000" width="100%" />
              <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 16, fontSize: 12, color: T.muted, flexWrap: "wrap" }}>
                {["Rejection Review","Legal Guidance","Documentation Aid"].map((f) => (
                  <span key={f}><i className="fa-solid fa-check" style={{ color: T.accent, marginRight: 5 }} />{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── New Claim Wizard ─────────────────────────────────────────────────────────
function NewClaimWizard({ navigate, showToast }) {
  const [step,           setStep]           = useState(1);
  const [category,       setCategory]       = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isManual,       setIsManual]       = useState(false);
  const [ocrScanning,    setOcrScanning]    = useState(false);
  const [ocrDone,        setOcrDone]        = useState(false);
  const [refNum,         setRefNum]         = useState("");
  const [firVal,         setFirVal]         = useState("");
  const [decl,           setDecl]           = useState(false);
  const [errors,         setErrors]         = useState({});

  const [form2, setForm2] = useState({ policy: "", company: "", type: "Motor", holder: "", mobile: "", email: "" });
  const [form3, setForm3] = useState({ date: "", time: "", place: "", hospital: "", desc: "" });

  const clearErr = (field) => setErrors((prev) => ({ ...prev, [field]: "" }));

  function resetWizard() {
    setStep(1); setCategory(""); setSelectedPolicy(null); setIsManual(false);
    setOcrScanning(false); setOcrDone(false); setDecl(false); setFirVal(""); setErrors({});
    setForm2({ policy: "", company: "", type: "Motor", holder: "", mobile: "", email: "" });
    setForm3({ date: "", time: "", place: "", hospital: "", desc: "" });
  }

  function pickCategory(cat) { setCategory(cat); setSelectedPolicy(null); setIsManual(false); }
  function selectPolicy(p)   { setSelectedPolicy(p); setIsManual(false); }

  function goStep(n) {
    if (n === 2 && selectedPolicy) {
      setForm2({ policy: selectedPolicy.policyNumber, company: selectedPolicy.company, type: selectedPolicy.type, holder: selectedPolicy.holder, mobile: "", email: "" });
      setOcrDone(true);
    }
    if (n === 2 && isManual) {
      setForm2({ policy: "", company: "", type: category || "Motor", holder: "", mobile: "", email: "" });
      setOcrDone(false);
    }
    setErrors({});
    setStep(n);
  }

  function simulateOCR() {
    if (ocrScanning) return;
    setOcrScanning(true);
    setTimeout(() => {
      setForm2((f) => ({ ...f, policy: "CK-" + Math.floor(100000 + Math.random() * 900000), company: "HDFC ERGO", type: category || "Motor", holder: "Manish Sharma" }));
      setOcrScanning(false); setOcrDone(true);
      showToast("Policy scanned successfully!");
    }, 2200);
  }

  // ── Validation via imported validators ────────────────────────────────────
  function validateStep2() {
    const errs = {};
    const checks = {
      policy:  validateRequired(form2.policy,  "Policy number"),
      company: validateRequired(form2.company, "Insurance company"),
      holder:  validateRequired(form2.holder,  "Proposer name"),
      mobile:  validatePhoneNumber(form2.mobile),
      email:   validateEmail(form2.email),
    };
    Object.entries(checks).forEach(([field, result]) => {
      if (!result.valid) errs[field] = result.error;
    });
    return errs;
  }

  function validateStep3() {
    const errs = {};
    const checks = {
      date:  validateRequired(form3.date,  "Date"),
      place: validateRequired(form3.place, "Place"),
      desc:  validateRequired(form3.desc,  "Description"),
    };
    Object.entries(checks).forEach(([field, result]) => {
      if (!result.valid) errs[field] = result.error;
    });
    if (form2.type === "Health" && !form3.hospital) errs.hospital = "Hospital name is required";
    if (form2.type === "Motor"  && !firVal)         errs.fir      = "Please select FIR status";
    return errs;
  }

  function handleContinueStep2() {
    const errs = validateStep2();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    goStep(3);
  }

  function handleContinueStep3() {
    const errs = validateStep3();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    goStep(4);
  }

  function submitFinal() {
    if (!decl) { showToast("Accept terms", "err"); return; }
    setRefNum("CK-CLM-" + Math.floor(100000 + Math.random() * 900000));
    setStep("success");
  }

  const filteredPolicies = MY_POLICIES.filter((p) => p.type === category);

  const STEPS = [
    { n: 1, label: "Type"   },
    { n: 2, label: "Policy" },
    { n: 3, label: "Claim"  },
    { n: 4, label: "Docs"   },
    { n: 5, label: "Finish" },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
      {/* Progress */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 40, position: "relative" }}>
        {STEPS.map((s, idx) => {
          const isDone   = typeof step === "number" && s.n < step;
          const isActive = step === s.n;
          return (
            <div key={s.n} style={{ flex: 1, textAlign: "center", position: "relative", zIndex: 2 }}>
              {idx < STEPS.length - 1 && (
                <div style={{ position: "absolute", top: 15, left: "50%", width: "100%", height: 1, background: T.border, zIndex: -1 }} />
              )}
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: isDone ? T.accent : T.bg, border: `1.5px solid ${isDone ? T.accent : isActive ? T.primary : T.border}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: isDone ? "#000" : isActive ? T.primary : T.muted, boxShadow: isActive ? `0 0 0 4px rgba(255,179,0,0.1)` : "none" }}>
                {isDone ? <i className="fa-solid fa-check" style={{ fontSize: 10 }} /> : s.n}
              </div>
              <div style={{ fontSize: 10, marginTop: 8, fontWeight: 700, color: T.muted, textTransform: "uppercase" }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 24, padding: 42 }}>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Select Claim Type</h2>
            <p style={{ color: T.muted, fontSize: 14, marginBottom: 32 }}>Choose the insurance product for your claim.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 32 }}>
              {[
                { id: "Health", icon: "fa-heart-pulse", label: "Health Insurance", sub: "Hospitalization expenses"  },
                { id: "Motor",  icon: "fa-car-burst",   label: "Motor Insurance",  sub: "Accident & vehicle damage" },
                { id: "Life",   icon: "fa-umbrella",    label: "Life Insurance",   sub: "Death & maturity claims"   },
              ].map((t) => (
                <TypeCard key={t.id} selected={category === t.id} onClick={() => pickCategory(t.id)}>
                  <i className={`fa-solid ${t.icon}`} style={{ fontSize: 28, color: T.primary, marginBottom: 12, display: "block" }} />
                  <h4 style={{ fontSize: 15, fontWeight: 700 }}>{t.label}</h4>
                  <p style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{t.sub}</p>
                </TypeCard>
              ))}
            </div>

            {category && (
              <div style={{ marginTop: 32, borderTop: `1px solid ${T.border}`, paddingTop: 32 }}>
                <label className="ck-label">Select Active Policy</label>
                <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
                  {filteredPolicies.length > 0 ? filteredPolicies.map((p) => (
                    <PolicyItem key={p.id} policy={p} selected={selectedPolicy?.id === p.id} onClick={() => selectPolicy(p)} />
                  )) : (
                    <p style={{ color: T.muted, fontSize: 13, padding: "12px 0" }}>No active {category} policies found.</p>
                  )}
                </div>
                {/* imported Button */}
                <Button
                  text="Not seeing your policy? Add it manually"
                  onClick={() => { setIsManual(true); setSelectedPolicy(null); goStep(2); }}
                  bgcolor="transparent"
                  color={T.muted}
                  borderColor={T.border}
                  width="100%"
                  customStyle={{ borderStyle: "dashed", borderRadius: "14px" }}
                />
              </div>
            )}

            <div style={stepNav()}>
              <Button text="Cancel"   onClick={() => navigate("home")} bgcolor="transparent" color={T.muted} borderColor={T.border} />
              <Button text="Continue" onClick={() => goStep(2)}        bgcolor={T.accent}    color="#000"    disabled={!selectedPolicy} />
            </div>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Policy Details</h2>

            {isManual && (
              <>
                <OcrZone scanning={ocrScanning} onScan={simulateOCR} />
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                  <div style={{ height: 1, flex: 1, background: T.border }} />
                  <span style={{ fontSize: 10, color: T.muted, fontWeight: 800, textTransform: "uppercase" }}>or enter manually</span>
                  <div style={{ height: 1, flex: 1, background: T.border }} />
                </div>
              </>
            )}

            {ocrDone && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: T.successBg, border: "1px solid rgba(196,237,63,.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: T.accent }}>
                <i className="fa-solid fa-circle-check" />
                <span>{isManual ? "Details successfully identified and auto-filled." : "Details auto-filled from your policy."}</span>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              {/* imported CustomInput */}
              <CustomInput label="Policy Number" name="policy" value={form2.policy} onChange={(e) => { setForm2((f) => ({ ...f, policy: e.target.value })); clearErr("policy"); }} placeholder="e.g. CK-9988123" validationMessage={errors.policy} sx={inputSx} required />
              <CustomInput type="select" label="Insurance Company" name="company" value={form2.company} onChange={(e) => { setForm2((f) => ({ ...f, company: e.target.value })); clearErr("company"); }} validationMessage={errors.company} sx={inputSx} required>
                <option value="">Select Company</option>
                {["HDFC ERGO","Star Health","ICICI Lombard","Bajaj Allianz"].map((c) => <option key={c}>{c}</option>)}
              </CustomInput>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <CustomInput type="select" label="Insurance Type" name="type" value={form2.type} onChange={(e) => setForm2((f) => ({ ...f, type: e.target.value }))} sx={inputSx} required>
                <option>Motor</option>
                <option>Health</option>
                <option>Life</option>
              </CustomInput>
              <CustomInput label="Proposer Name" name="holder" value={form2.holder} onChange={(e) => { setForm2((f) => ({ ...f, holder: e.target.value })); clearErr("holder"); }} placeholder="Full name" validationMessage={errors.holder} sx={inputSx} required />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <CustomInput type="tel"   label="Mobile" name="mobile" value={form2.mobile} onChange={(e) => { setForm2((f) => ({ ...f, mobile: e.target.value })); clearErr("mobile"); }} placeholder="10-digit number" validationMessage={errors.mobile} sx={inputSx} required />
              <CustomInput type="email" label="Email"  name="email"  value={form2.email}  onChange={(e) => { setForm2((f) => ({ ...f, email:  e.target.value })); clearErr("email");  }} placeholder="you@email.com"    validationMessage={errors.email}  sx={inputSx} required />
            </div>

            <div style={stepNav()}>
              <Button text="Back"     onClick={() => goStep(1)}       bgcolor="transparent" color={T.muted} borderColor={T.border} />
              <Button text="Continue" onClick={handleContinueStep2}   bgcolor={T.accent}    color="#000" />
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Incident Info</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <CustomInput type="date" label="Date" name="date" value={form3.date} onChange={(e) => { setForm3((f) => ({ ...f, date: e.target.value })); clearErr("date"); }} validationMessage={errors.date} sx={inputSx} required />
              <CustomInput type="time" label="Time" name="time" value={form3.time} onChange={(e) => setForm3((f) => ({ ...f, time: e.target.value }))} sx={inputSx} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <CustomInput label="Place" name="place" value={form3.place} onChange={(e) => { setForm3((f) => ({ ...f, place: e.target.value })); clearErr("place"); }} placeholder="City, State" validationMessage={errors.place} sx={inputSx} required />
            </div>

            {form2.type === "Motor" && (
              <div style={{ marginBottom: 16 }}>
                <label className="ck-label">FIR Lodged? <span style={{ color: T.danger }}>*</span></label>
                <div style={{ display: "flex", gap: 10 }}>
                  {/* imported Button used as a toggle group */}
                  {["Yes","No"].map((v) => (
                    <Button
                      key={v}
                      text={v}
                      onClick={() => { setFirVal(v); clearErr("fir"); }}
                      bgcolor={firVal === v ? T.accent : "transparent"}
                      color={firVal === v ? "#000" : T.text}
                      borderColor={firVal === v ? "transparent" : T.border}
                      padding="9px 22px"
                      fontSize="13px"
                    />
                  ))}
                </div>
                {errors.fir && <span className="ck-err-msg">{errors.fir}</span>}
              </div>
            )}

            {form2.type === "Health" && (
              <div style={{ marginBottom: 16 }}>
                <CustomInput label="Hospital Name" name="hospital" value={form3.hospital} onChange={(e) => { setForm3((f) => ({ ...f, hospital: e.target.value })); clearErr("hospital"); }} validationMessage={errors.hospital} sx={inputSx} required />
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <CustomInput type="textarea" label="Description" name="desc" value={form3.desc} onChange={(e) => { setForm3((f) => ({ ...f, desc: e.target.value })); clearErr("desc"); }} validationMessage={errors.desc} sx={{ ...inputSx, resize: "vertical" }} required />
            </div>

            <div style={stepNav()}>
              <Button text="Back"     onClick={() => goStep(2)}       bgcolor="transparent" color={T.muted} borderColor={T.border} />
              <Button text="Continue" onClick={handleContinueStep3}   bgcolor={T.accent}    color="#000" />
            </div>
          </div>
        )}

        {/* ── STEP 4 ── */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Upload Documents</h2>
            <div style={{ border: `2px dashed ${T.border}`, padding: 40, textAlign: "center", borderRadius: 16, cursor: "pointer" }}>
              <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: 32, color: T.muted, display: "block", marginBottom: 12 }} />
              <p style={{ color: T.muted }}>Click to upload files</p>
            </div>
            <div style={stepNav()}>
              <Button text="Back"   onClick={() => goStep(3)} bgcolor="transparent" color={T.muted} borderColor={T.border} />
              <Button text="Review" onClick={() => goStep(5)} bgcolor={T.accent}    color="#000" />
            </div>
          </div>
        )}

        {/* ── STEP 5 ── */}
        {step === 5 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Declaration</h2>
            <p style={{ color: T.muted, marginBottom: 24 }}>I declare that the information provided is true to the best of my knowledge.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" id="ck-decl" checked={decl} onChange={(e) => setDecl(e.target.checked)} />
              <label htmlFor="ck-decl" style={{ margin: 0, fontSize: 14, fontWeight: 400 }}>I accept the terms</label>
            </div>
            <div style={stepNav()}>
              <Button text="Back"         onClick={() => goStep(4)} bgcolor="transparent" color={T.muted} borderColor={T.border} />
              <Button text="Submit Claim" onClick={submitFinal}     bgcolor={T.accent}    color="#000" />
            </div>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {step === "success" && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 60, height: 60, background: T.successBg, color: T.accent, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 22 }}>
              <i className="fa-solid fa-check" />
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 700 }}>Claim Intimated!</h2>
            <p style={{ color: T.primary, fontWeight: 800, fontSize: 20, marginTop: 20 }}>{refNum}</p>
            <Button text="Return Home" onClick={() => { resetWizard(); navigate("home"); }} bgcolor={T.accent} color="#000" customStyle={{ marginTop: 30 }} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Simple stub pages ────────────────────────────────────────────────────────
function SimplePage({ title, navigate }) {
  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "100px 24px", textAlign: "center" }}>
      <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>{title}</h2>
      <Button text="← Back to Home" onClick={() => navigate("home")} bgcolor="transparent" color={T.muted} padding="9px 18px" fontSize="13px" />
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function CoverKraft() {
  const [page,  setPage]  = useState("home");
  const [toast, setToast] = useState({ show: false, msg: "", type: "" });

  function navigate(id) { setPage(id); window.scrollTo(0, 0); }

  function showToast(msg, type = "") {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  }

  return (
    <div style={{ background: T.bg, color: T.text, linaeHeight: 1.6, minHeight: "100vh" }}>
      <style>{GLOBAL_CSS}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {page === "home"        && <HomePage       navigate={navigate} />}
      {page === "new-claim"   && <NewClaimWizard navigate={navigate} showToast={showToast} />}
      {page === "track-claim" && <SimplePage     title="Track Claim Status" navigate={navigate} />}
      {page === "advisory"    && <SimplePage     title="Claim Advisory"     navigate={navigate} />}
      {page === "documents"   && <SimplePage     title="Document Center"    navigate={navigate} />}

      <Toast {...toast} />
    </div>
  );
}