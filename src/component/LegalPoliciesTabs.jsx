import { useState, useEffect } from "react";
import services_certificate from "../Images/CoverKraft_IRDA.png";
import { LegalPolicyHtml, LegalPolicyId } from "./LegalPolicyHtmlData.ts";

const policies = [
  {
    label: "Privacy Policy",
    id: LegalPolicyId.PRIVACY_POLICY,
  },
  {
    label: "Grievance Redress Policy",
    id: LegalPolicyId.GRIEVANCE_POLICY,
  },
  {
    label: "Terms of Use",
    id: LegalPolicyId.TERMS_OF_USE,
  },
  {
    label: "Terms & Conditions",
    id: LegalPolicyId.TERMS_AND_CONDITIONS,
  },
  {
    label: "Refund & Cancellation Policy",
    id: LegalPolicyId.REFUND_CANCELLATION,
  },
  {
    label: "ISNP",
    id: LegalPolicyId.ISNP,
  },
  {
    label: "License",
    id: LegalPolicyId.LICENSE,
  },
  {
    label: "Disclaimer",
    id: LegalPolicyId.DISCLAIMER,
  },
];

const LegalPoliciesTabs = () => {
  const [activeTab, setActiveTab] = useState(policies[0].label);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const matchedPolicy = policies.find((p) => p.id === hash);
      if (matchedPolicy) {
        setActiveTab(matchedPolicy.label);
      }
    }
  }, []);

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (!hash) return;
    const matchedPolicy = policies.find((p) => p.id === hash);
    if (matchedPolicy) {
      setActiveTab(matchedPolicy.label);
    }
    setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 200);
  }, [location.hash]);

  const activePolicy = policies.find((p) => p.label === activeTab);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  return (
    <div
      style={{
        backgroundColor: "#121212",
        color: "#E0E0E0",
        padding: "3rem 1.5rem",
        fontFamily: "DM Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        minHeight: "100vh",
        minWidth: "70vw",
        width: "100%",
      }}
    >
      <h1
        style={{
          color: "#8BC642",
          fontSize: "2.7rem",
          marginBottom: "4rem",
          borderBottom: "2px solid rgb(141, 227, 27)",
          paddingBottom: "0.5rem",
          fontWeight: "700",
          textAlign: "center",
        }}
      >
        Legal and Admin Policies
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            backgroundColor: "#121212",
            padding: "0.5rem",
            borderRadius: "50px",
            display: "flex",
            gap: "0.5rem",
            boxShadow: "0 0 10px rgba(139, 198, 66, 0.15)",
          }}
        >
          {policies.map((policy) => {
            const isActive = activeTab === policy.label;
            return (
              <button
                key={policy.label}
                onClick={() => setActiveTab(policy.label)}
                style={{
                  backgroundColor: isActive ? "#8BC642" : "transparent",
                  color: isActive ? "#121212" : "#E0E0E0",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "40px",
                  border: "2px solid #8BC642",
                  fontSize: "1.4rem",
                  fontWeight: isActive ? "600" : "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  minWidth: "120px",
                  textAlign: "center",
                }}
              >
                {policy.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#121212",
          padding: "2.5rem",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(139, 198, 66, 0.1), 0 8px 32px rgba(0,0,0,0.4)",
          lineHeight: "1.75",
          fontSize: "1rem",
          color: "#CCCCCC",
          maxHeight: "75vh",
          overflowY: "scroll",
          border: "1px solid #2E2E2E",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`
          div::-webkit-scrollbar {
            width: 8px;
          }
          div::-webkit-scrollbar-track {
            background: #2E2E2E;
            border-radius: 4px;
          }
          div::-webkit-scrollbar-thumb {
            background: #8BC642;
            border-radius: 4px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: #7BA538;
          }
        `}</style>
        {activePolicy && (
          <div
            id={activePolicy.id}
            dangerouslySetInnerHTML={{ __html: LegalPolicyHtml[activePolicy.id] }}
          />
        )}
      </div>
    </div>
  );
};

export default LegalPoliciesTabs;
