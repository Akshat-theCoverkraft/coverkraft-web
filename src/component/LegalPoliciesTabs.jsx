import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API_URL from "../ServiceModule/Service";
import CoverKraft_IRDA from "../Images/CoverKraft_IRDA.png";

const API_URL1 = API_URL + "legal/getAll";

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

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash?.substring(1);
      if (hash) {
        const found = policies.find((p) => p.id === hash);
        if (found) setActiveTab(found.label);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
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
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          color: "#8BC642",
          fontSize: "2.7rem",
          marginBottom: "4rem",
          borderBottom: "2px solid rgb(141, 227, 27)",
          textAlign: "center",
        }}
      >
        Legal and Admin Policies
      </motion.h1>

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
            flexWrap: "wrap",
          }}
        >
          {policies.map((policy) => {
            const isActive = activeTab === policy.label;
            return (
              <motion.button
                key={policy.label}
                onClick={() => setActiveTab(policy.label)}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{
                  backgroundColor: isActive ? "#8BC642" : "transparent",
                  color: isActive ? "#121212" : "#E0E0E0",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "40px",
                  border: "2px solid #8BC642",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  minWidth: "120px",
                }}
              >
                {policy.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <motion.div
        key={activePolicy?.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          backgroundColor: "#121212",
          padding: "2.5rem",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(139, 198, 66, 0.1), 0 8px 32px rgba(0,0,0,0.4)",
          fontSize: "1.1rem",
          color: "#CCCCCC",
          border: "1px solid #2E2E2E",
          display: activePolicy?.id === "License" ? "flex" : "block",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        {loading ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: "#8BC642", textAlign: "center", width: "100%" }}
          >
            Loading content...
          </motion.p>
        ) : (
          <>
            <motion.div
              id={activePolicy?.id}
              dangerouslySetInnerHTML={{ __html: content }}
              style={{ flex: "1", lineHeight: "1.75" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            {activePolicy?.id === "License" && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                  flex: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={CoverKraft_IRDA}
                  alt="License Illustration"
                  style={{
                    maxWidth: "100%",
                    borderRadius: "10px",
                    boxShadow: "0 0 12px rgba(0, 0, 0, 0.3)",
                  }}
                />
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default LegalPoliciesTabs;
