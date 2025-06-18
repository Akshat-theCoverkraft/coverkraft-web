import React, { useState, useEffect } from "react";

const policies = [
    {
        label: "Privacy Policy",
        id: "PrivacyPolicy",
                        content: (
            <div style={{
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#121212', // Dark background for better contrast
    color: '#E0E0E0',           // Soft white text for readability
    lineHeight: '1.8',
    fontSize: '1.1rem',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    fontFamily: 'Arial, sans-serif'
}}>
    <h2 style={{ color: '#1DB1BB', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
        Privacy Policy for{' '}
        <a href="http://www.TheCoverKraft.com" target="_blank" rel="noopener noreferrer" style={{ color: '#1DB1BB', textDecoration: 'underline' }}>
            www.TheCoverKraft.com
        </a>{' '}
        and “CoverKraft” App
    </h2>
    <p>
        This Privacy Policy explains how{' '}
        <a href="http://www.TheCoverKraft.com" target="_blank" rel="noopener noreferrer" style={{ color: '#1DB1BB', textDecoration: 'underline' }}>
            www.TheCoverKraft.com
        </a>{' '}
        (“we,” “us,” or “our”) and the “CoverKraft” mobile application collect, use, disclose, and protect your personal information.
        By accessing our website or using our app, you agree to this Privacy Policy.
    </p>

    <h3 style={{ color: '#1DB1BB' }}>Compliance with Indian Data Protection Laws</h3>
    <ul>
        <li>Information Technology Act, 2000</li>
        <li>IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</li>
        <li>Personal Data Protection Bill (PDPB)</li>
        <li>IRDAI Guidelines</li>
    </ul>

    <h3 style={{ color: '#1DB1BB' }}>1. Information We Collect</h3>
    <ul>
        <li><strong>Personal Information:</strong> Name, contact details, address, date of birth, ID documents, etc.</li>
        <li><strong>Policy Information:</strong> Policy numbers, insurers, coverage details, expiry dates.</li>
        <li><strong>Usage Data:</strong> Pages visited, device type, time spent.</li>
        <li><strong>Transaction Data:</strong> Payment history, billing information.</li>
        <li><strong>Uploaded Content:</strong> Files/documents added to Policy Vault.</li>
        <li><strong>Cookies & Tracking:</strong> Improve performance and user experience.</li>
    </ul>

    <h3 style={{ color: '#1DB1BB' }}>2. How We Use Your Information</h3>
    <ul>
        <li>Provide and enhance our services.</li>
        <li>Support policy comparison, purchase, and renewals.</li>
        <li>Manage your Policy Vault.</li>
        <li>Send reminders and notifications.</li>
        <li>Recommend personalized insurance options.</li>
        <li>Fulfill legal and regulatory obligations.</li>
        <li>Prevent fraud and enforce terms.</li>
    </ul>

    <h3 style={{ color: '#1DB1BB' }}>3. Sharing and Disclosure of Information</h3>
    <p>We do <strong>not</strong> sell or rent your data. Information may be shared with:</p>
    <ul>
        <li><strong>Insurance Companies:</strong> For quotations and policy servicing.</li>
        <li><strong>Service Providers:</strong> For secure payments, analytics, tech support.</li>
        <li><strong>Legal/Regulatory Bodies:</strong> When legally required.</li>
        <li><strong>Business Transfers:</strong> In mergers or acquisitions.</li>
    </ul>

    <h3 style={{ color: '#1DB1BB' }}>4. Data Security</h3>
    <ul>
        <li>SSL encryption (data in transit and at rest).</li>
        <li>System logs retained for 180 days (per IRDAI).</li>
        <li>Strict access control, breach reporting within 6 hours.</li>
        <li>Regular audits and staff privacy training.</li>
    </ul>
    <p><strong>Note:</strong> No system is 100% secure. We respond swiftly to breaches and notify users as required.</p>

    <h3 style={{ color: '#1DB1BB' }}>5. User Rights and Choices</h3>
    <ul>
        <li>Access and update personal data.</li>
        <li>Request corrections or deletions.</li>
        <li>Withdraw consent at any time.</li>
        <li>Export your data.</li>
    </ul>
    <p>To exercise your rights, please contact us via the details below.</p>

    <h3 style={{ color: '#1DB1BB' }}>6. Data Retention</h3>
    <p>We retain data:</p>
    <ul>
        <li>While your account is active.</li>
        <li>For legal, regulatory, or dispute resolution reasons.</li>
    </ul>
    <p>Data is securely deleted or anonymized afterward.</p>

    <h3 style={{ color: '#1DB1BB' }}>7. Children’s Privacy</h3>
    <p>Our services are not for users under 18. If we learn of such data, it will be removed promptly.</p>

    <h3 style={{ color: '#1DB1BB' }}>8. Updates to This Policy</h3>
    <p>We may revise this policy. Major changes will be notified. Continued use implies acceptance.</p>

    <h3 style={{ color: '#1DB1BB' }}>9. Contact Us</h3>
    <p>
        <strong>Principal Officer/Compliance Officer</strong><br />
        CoverKraft Insurance Brokers Private Limited<br />
        16 D-1, Danish Nagar, Hoshangabad Road, Bhopal, Madhya Pradesh, PIN - 462026<br />
        Email:{' '}
        <a href="mailto:grievance@thecoverkraft.com" style={{ color: '#1DB1BB', textDecoration: 'underline' }}>
            grievance@thecoverkraft.com
        </a><br />
        Phone: [To be provided]
    </p>

    <h3 style={{ color: '#1DB1BB' }}>10. Grievance Redressal</h3>
    <p>For complaints about our privacy practices, contact our Grievance Officer. We respond within the required timeframe.</p>

    <p style={{ marginTop: '2rem', fontStyle: 'italic', color: '#CCCCCC' }}>
        By using{' '}
        <a href="http://www.TheCoverKraft.com" target="_blank" rel="noopener noreferrer" style={{ color: '#1DB1BB' }}>
            www.TheCoverKraft.com
        </a>{' '}
        and the CoverKraft App, you confirm that you have read, understood, and accepted this Privacy Policy.
    </p>
            </div>

        ),
    },
    {
        label: "Grievance Redress Policy",
        id: "GrievanceRedressPolicy",
        content: (
            <div id="GrievanceRedressPolicy">
                <h2 style={{ color: "#FFFFFF", marginBottom: "2rem", fontSize: "1.8rem", fontWeight: "700" }}>Grievance Redress Policy</h2>
                <div style={{ color: "#FFFFFF", lineHeight: "1.9", fontSize: "1.1rem", fontWeight: "500" }}>
                    <p style={{ margin: "0", textAlign: "left" }}>Your grievance redress policy content will go here...</p>
                </div>
            </div>
        ),
    },
    {
        label: "License",
        id: "License",
        content: (
            <div id="License">
                <h2 style={{ color: "#FFFFFF", marginBottom: "2rem", fontSize: "1.8rem", fontWeight: "700" }}>License</h2>
                <div style={{ color: "#FFFFFF", lineHeight: "1.9", fontSize: "1.1rem", fontWeight: "500" }}>
                    <p style={{ margin: "0", textAlign: "left" }}>Your license information will go here...</p>
                </div>
            </div>
        ),
    },
    {
        label: "Terms & Conditions",
        id: "TermsAndConditions",
        content: (
            <div id="TermsAndConditions">
                <h2 style={{ color: "#FFFFFF", marginBottom: "2rem", fontSize: "1.8rem", fontWeight: "700" }}>Terms & Conditions</h2>
                <div style={{ color: "#FFFFFF", lineHeight: "1.9", fontSize: "1.1rem", fontWeight: "500" }}>
                    <p style={{ margin: "0", textAlign: "left" }}>Your terms and conditions content will go here...</p>
                </div>
            </div>
        ),
    },
    {
        label: "Refund & Cancellation Policy",
        id: "RefundCancellationPolicy",
        content: (
            <div id="RefundCancellationPolicy">
                <h2 style={{ color: "#FFFFFF", marginBottom: "2rem", fontSize: "1.8rem", fontWeight: "700" }}>Refund & Cancellation Policy</h2>
                <div style={{ color: "#FFFFFF", lineHeight: "1.9", fontSize: "1.1rem", fontWeight: "500" }}>
                    <p style={{ margin: "0", textAlign: "left" }}>Your refund and cancellation policy content will go here...</p>
                </div>
            </div>
        ),
    },
    {
        label: "ISNP",
        id: "ISNP",
        content: (
            <div id="ISNP">
                <h2 style={{ color: "#FFFFFF", marginBottom: "2rem", fontSize: "1.8rem", fontWeight: "700" }}>ISNP</h2>
                <div style={{ color: "#FFFFFF", lineHeight: "1.9", fontSize: "1.1rem", fontWeight: "500" }}>
                    <p style={{ margin: "0", textAlign: "left" }}>Your ISNP content will go here...</p>
                </div>
            </div>
        ),
    },
    {
        label: "Terms of Use",
        id: "TermsOfUse",
        content: (
            <div id="TermsOfUse">
                <h2 style={{ color: "#FFFFFF", marginBottom: "2rem", fontSize: "1.8rem", fontWeight: "700" }}>Terms of Use</h2>
                <div style={{ color: "#FFFFFF", lineHeight: "1.9", fontSize: "1.1rem", fontWeight: "500" }}>
                    <p style={{ margin: "0", textAlign: "left" }}>Your terms of use content will go here...</p>
                </div>
            </div>
        ),
    },
];

const LegalPoliciesTabs = () => {
    const [activeTab, setActiveTab] = useState(policies[0].label);

    // Simulate URL hash handling for demo
    useEffect(() => {
        // In a real app, you'd use useLocation from react-router-dom
        const hash = window.location.hash.replace("#", "");
        if (hash) {
            const matchedPolicy = policies.find((p) => p.id === hash);
            if (matchedPolicy) {
                setActiveTab(matchedPolicy.label);
            }
        }
    }, []);

    const activePolicy = policies.find((p) => p.label === activeTab);

    return (
        <div style={{
            backgroundColor: "#121212",
            color: "#E0E0E0",
            padding: "3rem 1.5rem",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            minHeight: "100vh"
        }}>
            <h1 style={{
                color: "#8BC642",
                fontSize: "2rem",
                marginBottom: "2rem",
                borderBottom: "2px solid #8BC642",
                paddingBottom: "0.5rem",
                fontWeight: "600"
            }}>
                Legal and Admin Policies
            </h1>

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
                            padding: "0.75rem 1.5rem",
                            borderRadius: "8px",
                            border: activeTab === policy.label ? "1px solid #8BC642" : "1px solid #2E2E2E",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            fontWeight: activeTab === policy.label ? "600" : "500",
                            fontSize: "0.95rem",
                            letterSpacing: "0.3px",
                            boxShadow: activeTab === policy.label
                                ? "0 0 12px rgba(139, 198, 66, 0.4)"
                                : "0 2px 4px rgba(0,0,0,0.3)",
                            transform: activeTab === policy.label ? "translateY(-1px)" : "translateY(0)",
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== policy.label) {
                                e.target.style.backgroundColor = "#2A2A2A";
                                e.target.style.borderColor = "#8BC642";
                                e.target.style.transform = "translateY(-1px)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== policy.label) {
                                e.target.style.backgroundColor = "#1A1A1A";
                                e.target.style.borderColor = "#2E2E2E";
                                e.target.style.transform = "translateY(0)";
                            }
                        }}
                    >
                        {policy.label}
                    </button>
                ))}
            </div>

            <div style={{
                backgroundColor: "#1A1A1A",
                padding: "2.5rem",
                borderRadius: "12px",
                boxShadow: "0 0 20px rgba(139, 198, 66, 0.1), 0 8px 32px rgba(0,0,0,0.4)",
                lineHeight: "1.75",
                fontSize: "1rem",
                color: "#CCCCCC",
                maxHeight: "75vh",
                overflowY: "auto",
                border: "1px solid #2E2E2E"
            }}>
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
                {activePolicy?.content}
            </div>
        </div>
    );
};

export default LegalPoliciesTabs;