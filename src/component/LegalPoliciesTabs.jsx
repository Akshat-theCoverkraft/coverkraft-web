import { useState, useEffect } from "react";
import API_URL from "../ServiceModule/Service";

const API_URL1 = API_URL+ "legal/getAll";

const policies = [
  { label: "Privacy Policy", id: "PrivacyPolicy" },
  { label: "Grievance Redress Policy", id: "GrievanceRedressPolicy" },
  { label: "Terms of Use", id: "TermsOfUse" },
  { label: "Terms & Conditions", id: "TermsAndConditions" },
  { label: "Refund & Cancellation Policy", id: "RefundCancellationPolicy" },
  { label: "ISNP", id: "ISNP" },
  { label: "License", id: "License" },
  { label: "Disclaimer", id: "disclaimer" },
];

const LegalPoliciesTabs = () => {
  const [activeTab, setActiveTab] = useState(policies[0].label);
  const [policyData, setPolicyData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL1);
      const result = await response.json();

      if (result?.status && Array.isArray(result.data)) {
        // Convert array to object for quick access
        const mappedData = {};
        result.data.forEach((item) => {
          mappedData[item.legalPolicyType] = item.description || "<p>No content available.</p>";
        });
        setPolicyData(mappedData);
      }
    } catch (error) {
      console.error("Error fetching policies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const activePolicy = policies.find((p) => p.label === activeTab);
  const content = activePolicy ? policyData[activePolicy.id] : "<p>No content found.</p>";

  return (
    <div
      style={{
        backgroundColor: "#121212",
        color: "#E0E0E0",
        padding: "3rem 1.5rem",
        fontFamily: "DM Sans, sans-serif",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <h1
        style={{
          color: "#8BC642",
          fontSize: "2.7rem",
          marginBottom: "4rem",
          borderBottom: "2px solid rgb(141, 227, 27)",
          textAlign: "center",
        }}
      >
        Legal and Admin Policies
      </h1>

      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
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
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  minWidth: "120px",
                }}
              >
                {policy.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div
        style={{
          backgroundColor: "#121212",
          padding: "2.5rem",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(139, 198, 66, 0.1), 0 8px 32px rgba(0,0,0,0.4)",
          lineHeight: "1.75",
          fontSize: "1.1rem",
          color: "#CCCCCC",
          maxHeight: "75vh",
          overflowY: "auto",
          border: "1px solid #2E2E2E",
        }}
      >
        {loading ? (
          <p style={{ color: "#8BC642", textAlign: "center" }}>Loading content...</p>
        ) : (
          <div
            id={activePolicy?.id}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </div>
  );
};

export default LegalPoliciesTabs;
