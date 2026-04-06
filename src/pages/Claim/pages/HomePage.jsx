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

// ─── HomePage ─────────────────────────────────────────────────────────────────
export default function HomePage({ navigate, loggedIn }) {
  const [activeTab, setActiveTab] = useState("health");
  const [docFilter, setDocFilter] = useState("Health");
  const [trackId,   setTrackId]   = useState("");

  const docs = DOC_DATA[docFilter] || [];

  // Logic applied here
  const handleClaim = useCallback(() => {
    if (loggedIn) {
      navigate("new-claim");
    } else {
      window.location.assign("/login");
    }
  }, [navigate, loggedIn]);

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
          {/* Hero Button with Logic */}
          <Button text="Intimate a Claim"   onClick={handleClaim}   bgcolor={T.accent}    color="#000" />
          <Button text="Track Claim Status" onClick={() => navigate("track-claim")} bgcolor="transparent" color={T.text} borderColor={T.border} />
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
                    { accent: T.accent,  badge: "Preferred Choice", badgeBg: T.successBg, badgeBorder: "rgba(196,237,63,.22)", badgeColor: T.accent,  icon: activeTab === "motor" ? "fa-wrench" : "fa-hospital", title: "Cashless Solution", text: activeTab === "motor" ? "Available at 10,000+ network garages. We settle repair bills directly." : "Available at 50,000+ network hospitals. We settle bills directly with the provider." },
                    { accent: T.primary, badge: "Any Provider",     badgeBg: T.primaryBg, badgeBorder: "rgba(255,179,0,.22)", badgeColor: T.primary, icon: "fa-receipt",                                          title: "Reimbursement",    text: activeTab === "motor" ? "Repair anywhere, submit invoices, receive reimbursement within 10 days." : "Pay at any provider, submit documents, get reimbursed in 7 working days." },
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
            
            {/* Action Grid Button with Logic */}
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
            <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Track Existing Claim</h3>
              <p style={{ color: T.muted, fontSize: 14, marginBottom: 18 }}>Enter your Reference ID for real-time updates.</p>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
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