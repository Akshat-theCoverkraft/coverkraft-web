import { useNavigate } from "react-router-dom";
import { T } from "../tokens";

export default function TravelClaimPage({ locationState }) {
  const navigate = useNavigate();
  const companyDetails = locationState?.companyDetails || {};
  const travelCategories = Array.isArray(companyDetails.travelCategory)
    ? companyDetails.travelCategory
    : [];

  const contactDetails = travelCategories.map((item) => {
    const phoneNumbers = Array.isArray(item.phoneNumbers) ? item.phoneNumbers : [];
    const emails = Array.isArray(item.emails) ? item.emails : [];
    const links = Array.isArray(item.links) ? item.links : [];
    return {
      category: item.category || "-",
      phoneNumbers,
      emails,
      links,
    };
  });

  return (
    <section style={{ maxWidth: 980, margin: "0 auto", padding: "28px 18px 72px" }}>
      <div
        style={{
          background: `linear-gradient(135deg, ${T.bgCard} 0%, #1f1f1f 55%, ${T.bg} 100%)`,
          borderRadius: 28,
          padding: 28,
          border: `1px solid ${T.border}`,
          boxShadow: "0 28px 80px rgba(0,0,0,0.35)",
          color: T.text,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div>
            <div
              style={{
                color: T.accent,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1.2,
                textTransform: "uppercase",
              }}
            >
              Travel Emergency Contacts
            </div>
            <h1 style={{ fontSize: 34, margin: "8px 0 10px", fontWeight: 800 }}>
              Quick help for travel policy emergencies
            </h1>
            <p style={{ margin: 0, maxWidth: 720, color: T.muted, fontSize: 15.5, lineHeight: 1.7 }}>
              Use the direct helplines below for immediate assistance. This page only shows travel support contacts, so it stays focused and easy to use.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              border: `1px solid ${T.border}`,
              background: "rgba(255,255,255,0.04)",
              color: T.text,
              borderRadius: 999,
              padding: "10px 16px",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <i className="fa-solid fa-arrow-left" />
            Back
          </button>
        </div>
      </div>

      <div
        style={{
          background: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: 24,
          padding: 24,
          boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.text }}>Emergency Contacts</h2>
            <p style={{ margin: "6px 0 0", color: T.muted, fontSize: 14 }}>
              Call the correct number based on your trip type.
            </p>
          </div>
          <div
            style={{
              background: T.primaryBg,
              color: T.primary,
              border: `1px solid ${T.border}`,
              borderRadius: 999,
              padding: "8px 12px",
              fontSize: 12.5,
              fontWeight: 700,
              height: "fit-content",
            }}
          >
            24x7 support
          </div>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          {contactDetails.map((item) => (
            <div
              key={item.category}
              style={{
                border: `1px solid ${T.border}`,
                borderRadius: 18,
                padding: 18,
                background: T.bg,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: T.text, textTransform: "capitalize" }}>
                  {item.category}
                </h3>
                <span
                  style={{
                    background: item.category === "International" ? "rgba(255,179,0,0.12)" : "rgba(196,237,63,0.12)",
                    color: item.category === "International" ? T.primary : T.accent,
                    borderRadius: 999,
                    padding: "6px 10px",
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {item.category === "International" ? "Call back facility" : "Domestic helpline"}
                </span>
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                <div>
                  <div style={{ color: T.muted, fontSize: 12.5, marginBottom: 6 }}>Phone</div>
                  <div style={{ display: "grid", gap: 6 }}>
                    {item.phoneNumbers.map((phone) => (
                      <div key={phone} style={{ fontSize: 18, fontWeight: 800, letterSpacing: 0.2, color: T.text }}>
                        {phone}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ color: T.muted, fontSize: 12.5, marginBottom: 6 }}>Email</div>
                  <div style={{ display: "grid", gap: 6 }}>
                    {item.emails.map((email) => (
                      <div key={email} style={{ fontSize: 15.5, fontWeight: 700, wordBreak: "break-word", color: T.text }}>
                        {email}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ color: T.muted, fontSize: 12.5, marginBottom: 6 }}>Link</div>
                  <div style={{ display: "grid", gap: 10 }}>
                    {item.links.map((link) => (
                      <a
                        key={link.value}
                        href={link.value}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 10,
                          color: T.primary,
                          fontWeight: 800,
                          textDecoration: "underline",
                          textUnderlineOffset: "4px",
                          fontSize: 14.5,
                          lineHeight: 1.5,
                        }}
                      >
                        <span>{link.label}</span>
                        <span
                          aria-hidden="true"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 22,
                            height: 22,
                            borderRadius: 999,
                            border: `1px solid ${T.border}`,
                            background: "rgba(255,179,0,0.08)",
                            color: T.primary,
                            fontSize: 12,
                            flexShrink: 0,
                          }}
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square" />
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
