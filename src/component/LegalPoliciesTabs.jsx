import React, { useState } from "react";

const policies = [
    {
        label: "Privacy Policy",
        content: (
            <div style={{ padding: "1rem", color: "#fff", lineHeight: "1.6" }}>
                <h2>
                    Privacy Policy for{" "}
                    <a
                        href="http://www.TheCoverKraft.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#1DB1BB", textDecoration: "underline" }}
                    >
                        www.TheCoverKraft.com
                    </a>{" "}
                    and “CoverKraft” App
                </h2>
                <p>
                    This Privacy Policy explains how{" "}
                    <a
                        href="http://www.TheCoverKraft.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#1DB1BB", textDecoration: "underline" }}
                    >
                        www.TheCoverKraft.com
                    </a>{" "}
                    (“we,” “us,” or “our”) and the “CoverKraft” mobile application collect, use, disclose, and protect your personal information. By accessing our website or using our app, you agree to this Privacy Policy.
                </p>
                <p>This policy complies with Indian data protection laws, including:</p>
                <ul>
                    <li>Information Technology Act, 2000</li>
                    <li>IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</li>
                    <li>Personal Data Protection Bill (PDPB)</li>
                    <li>Insurance Regulatory and Development Authority of India (IRDAI) guidelines</li>
                </ul>
                <h3>1. Information We Collect</h3>
                <ul>
                    <li>
                        <strong>Personal Information:</strong> Name, contact details, address, date of birth, identification documents, etc.
                    </li>
                    <li>
                        <strong>Policy Information:</strong> Policy numbers, insurer names, coverage, expiry dates
                    </li>
                    <li>
                        <strong>Usage Data:</strong> Pages visited, device type, interaction time
                    </li>
                    <li>
                        <strong>Transaction Data:</strong> Payment history, billing data
                    </li>
                    <li>
                        <strong>Uploaded Content:</strong> Files/documents added to the Policy Vault
                    </li>
                    <li>
                        <strong>Cookies & Tracking:</strong> To improve performance and user experience
                    </li>
                </ul>
                <h3>2. How We Use Your Information</h3>
                <ul>
                    <li>Provide and enhance our services</li>
                    <li>Support policy comparison, purchase, and renewals</li>
                    <li>Manage policies in the Policy Vault</li>
                    <li>Send reminders and notifications</li>
                    <li>Recommend personalized insurance options</li>
                    <li>Meet legal and regulatory requirements</li>
                    <li>Prevent fraud and enforce terms</li>
                </ul>
                <h3>3. Sharing and Disclosure of Information</h3>
                <p>
                    We do <strong>not</strong> sell or rent your data. We may share it with:
                </p>
                <ul>
                    <li>
                        <strong>Insurance Companies:</strong> For quotations and policy servicing
                    </li>
                    <li>
                        <strong>Service Providers:</strong> For secure payments, analytics, tech support
                    </li>
                    <li>
                        <strong>Legal/Regulatory Bodies:</strong> If mandated by law
                    </li>
                    <li>
                        <strong>Business Transfers:</strong> During acquisitions or mergers
                    </li>
                </ul>
                <h3>4. Data Security</h3>
                <ul>
                    <li>SSL and secure encryption (data in transit and at rest)</li>
                    <li>System logs retained for 180 days (as per IRDAI)</li>
                    <li>Access control, breach reporting within 6 hours</li>
                    <li>Periodic audits, privacy training for staff</li>
                </ul>
                <p>
                    <strong>Note:</strong> No system is impenetrable. We respond swiftly to breaches and inform users as required.
                </p>
                <h3>5. User Rights and Choices</h3>
                <ul>
                    <li>Access and update personal data</li>
                    <li>Request corrections or deletion</li>
                    <li>Withdraw data consent</li>
                    <li>Export your data</li>
                </ul>
                <p>To exercise these rights, contact us via the details below.</p>
                <h3>6. Data Retention</h3>
                <p>We retain data:</p>
                <ul>
                    <li>While your account is active</li>
                    <li>For legal, regulatory, or complaint resolution purposes</li>
                </ul>
                <p>Afterward, data is securely deleted or anonymized.</p>
                <h3>7. Children’s Privacy</h3>
                <p>
                    Our services are not meant for users under 18. If a child’s data is collected, we’ll remove it upon notice.
                </p>
                <h3>8. Updates to This Policy</h3>
                <p>
                    We may revise this policy. Significant changes will be posted, and continued use implies acceptance.
                </p>
                <h3>9. Contact Us</h3>
                <p>
                    <strong>Principal Officer/Compliance Officer</strong>
                    <br />
                    CoverKraft Insurance Brokers Private Limited
                    <br />
                    16 D-1, Danish Nagar, Hoshangabad Road, Bhopal, Madhya Pradesh, PIN - 462026
                    <br />
                    Email:{" "}
                    <a href="mailto:grievance@thecoverkraft.com"
                    style={{ color: "#1DB1BB", textDecoration: "underline" }}
                    >grievance@thecoverkraft.com</a>
                    <br />
                    Phone: [To be provided]
                </p>
                <h3>10. Grievance Redressal</h3>
                <p>
                    If you have complaints about our privacy practices, contact our Grievance Officer. We respond within the legal timeframe.
                </p>
                <p>
                    By using{" "}
                    <a
                        href="http://www.TheCoverKraft.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#1DB1BB", textDecoration: "underline" }}
                    >
                        www.TheCoverKraft.com
                    </a>{" "}
                    and the CoverKraft App, you confirm that you’ve read, understood, and accepted this Privacy Policy.
                </p>
            </div>
        ),
    },
    {
        label: "Grievance Redress Policy",
        content: <p>Got a problem? We got a form. Fill it, chill.</p>,
    },
    {
        label: "License",
        content: (
            <p>
                This app is licensed under the Meme License 1.0. Use it for memes, not for world domination.
            </p>
        ),
    },
    {
        label: "Terms & Conditions",
        content: <p>By using this app, you agree not to sue us for memes.</p>,
    },
    {
        label: "Refund & cancellation Policy",
        content: <p>Refunds available only if you can reverse time.</p>,
    },
    {
        label: "ISNP",
        content: <p>This section covers all your ISNP drama.</p>,
    },
    {
        label: "Terms of Use",
        content: <p>Use it wisely. Or don’t use it at all.</p>,
    },
];

const LegalPoliciesTabs = () => {
    const [activeTab, setActiveTab] = useState(policies[2].label); // Default to "License"

    const activePolicy = policies.find((p) => p.label === activeTab);

    return (
  <div style={{ backgroundColor: "#121212", color: "#E0E0E0", padding: "3rem 1.5rem", fontFamily: "Inter, sans-serif" }}>
    <h2 style={{
      color: "#8BC642",
      fontSize: "2rem",
      marginBottom: "2rem",
      borderBottom: "2px solid #8BC642",
      paddingBottom: "0.5rem",
    }}>
      Legal and Admin Policies
    </h2>

    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "0.75rem",
      marginBottom: "2rem",
    }}>
      {policies.map((policy) => (
        <button
          key={policy.label}
          onClick={() => setActiveTab(policy.label)}
          style={{
            backgroundColor: activeTab === policy.label ? "#8BC642" : "#1A1A1A",
            color: activeTab === policy.label ? "#121212" : "#B5E18B",
            padding: "0.5rem 1.2rem",
            borderRadius: "6px",
            border: "1px solid #2E2E2E",
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontWeight: 500,
            fontSize: "0.95rem",
            letterSpacing: "0.3px",
            boxShadow: activeTab === policy.label
              ? "0 0 8px rgba(139, 198, 66, 0.4)"
              : "0 1px 3px rgba(0,0,0,0.2)",
          }}
        >
          {policy.label}
        </button>
      ))}
    </div>

    <div style={{
      backgroundColor: "#1A1A1A",
      padding: "2rem",
      borderRadius: "12px",
      boxShadow: "0 0 20px rgba(139, 198, 66, 0.1)",
      lineHeight: "1.75",
      fontSize: "1rem",
      color: "#CCCCCC",
      maxHeight: "75vh",
      overflowY: "auto",
      scrollbarWidth: "thin",
    }}>
      {activePolicy?.content}
    </div>
  </div>
);

};

export default LegalPoliciesTabs;
