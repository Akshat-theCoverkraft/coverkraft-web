import { useState, useEffect } from "react";

const policies = [
    {
        label: "Privacy Policy",
        id: "PrivacyPolicy",
        content: (
            <div style={{
                maxWidth: '900px',
                margin: '2rem auto',
                padding: '1rem',
                color: '#E0E0E0',
                lineHeight: '1.8',
                fontSize: '1.7rem',
                borderRadius: '10px',
                fontFamily: 'Arial, sans-serif'
            }}>
                <h2 style={{ color: '#8BC642', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                    Privacy Policy for <a href="http://www.TheCoverKraft.com" target="_blank" rel="noopener noreferrer" style={{ color: '#8BC642', textDecoration: 'underline' }}>www.TheCoverKraft.com</a> and “CoverKraft” App
                </h2>

                <p>
                    This Privacy Policy describes how <strong>CoverKraft Insurance Brokers Private Limited</strong> ("we", "our", or "us") collects, uses, shares, and protects your information through our website <a href="http://www.TheCoverKraft.com" target="_blank" rel="noopener noreferrer" style={{ color: '#8BC642' }}>www.TheCoverKraft.com</a> and the “CoverKraft” mobile application.
                </p>

                <h2 style={{ color: '#8BC642' }}>Legal Compliance</h2>
                <p>We comply with the following Indian data protection laws and regulatory frameworks:</p>
                <p>- Information Technology Act, 2000<br />
                    - IT Rules 2011 (Sensitive Personal Data)<br />
                    - Personal Data Protection Bill (PDPB)<br />
                    - IRDAI Guidelines</p>

                <h2 style={{ color: '#8BC642' }}>Collection of Information</h2>
                <p>When you use our services, we may collect various types of information, including:</p>
                <p><strong>Personal Data:</strong> Name, email, phone number, address, date of birth, ID proofs, etc.</p>
                <p><strong>Policy Details:</strong> Policy number, insurer, coverage, premium, expiry date, etc.</p>
                <p><strong>App & Web Usage:</strong> Pages viewed, time spent, device info.</p>
                <p><strong>Payment Data:</strong> Billing info, transactions.</p>
                <p><strong>Uploaded Files:</strong> Documents stored in the Policy Vault.</p>
                <p><strong>Cookies:</strong> Used to enhance your experience and performance.</p>

                <h2 style={{ color: '#8BC642' }}>Use of Information</h2>
                <p>We use your information to:</p>
                <p>- Deliver and maintain our services.<br />
                    - Store and manage policies.<br />
                    - Send reminders, alerts, and policy updates.<br />
                    - Personalize your insurance experience.<br />
                    - Fulfill legal obligations.<br />
                    - Prevent fraud and ensure security.</p>

                <h2 style={{ color: '#8BC642' }}>Sharing and Disclosure</h2>
                <p>We do <strong>not</strong> sell or rent your data. However, we may share your information with:</p>
                <p><strong>Insurance Providers:</strong> For policy issuance and servicing.</p>
                <p><strong>Third-Party Services:</strong> For secure payment, tech support, analytics.</p>
                <p><strong>Legal Bodies:</strong> When required under the law or court order.</p>
                <p><strong>Business Transitions:</strong> In case of mergers or acquisitions.</p>

                <h2 style={{ color: '#8BC642' }}>Data Security</h2>
                <p>We implement robust security measures including:</p>
                <p>- SSL encryption (at rest and in transit)<br />
                    - Access control with strict permissions<br />
                    - Breach alerts and reporting within 6 hours<br />
                    - Log retention (as per IRDAI: 180 days)</p>
                <p><strong>Note:</strong> While we strive for security, no system is 100% hack-proof.</p>

                <h2 style={{ color: '#8BC642' }}>Your Rights</h2>
                <p>As a user, you have the right to:</p>
                <p>- Access or update your data<br />
                    - Request correction or deletion<br />
                    - Export your information<br />
                    - Withdraw consent anytime</p>
                <p>Contact us to exercise any of the above rights.</p>

                <h2 style={{ color: '#8BC642' }}>Data Retention</h2>
                <p>We retain your data for as long as:</p>
                <p>- Your account is active<br />
                    - Required by law or regulatory obligation<br />
                    - Necessary to resolve disputes or enforce agreements</p>
                <p>Post that, data is anonymized or deleted securely.</p>

                <h2 style={{ color: '#8BC642' }}>Children’s Privacy</h2>
                <p>Our services are intended for users above 18. If data is collected from a minor, it will be deleted immediately upon discovery.</p>

                <h2 style={{ color: '#8BC642' }}>Policy Updates</h2>
                <p>This Privacy Policy may be updated periodically. Users will be notified of material changes. Continued use constitutes acceptance.</p>

                <h2 style={{ color: '#8BC642' }}>Grievance & Contact</h2>
                <p>
                    <strong>Grievance Officer / Compliance Contact</strong><br />
                    CoverKraft Insurance Brokers Pvt. Ltd.<br />
                    16 D-1, Danish Nagar, Hoshangabad Road,<br />
                    Bhopal, Madhya Pradesh, 462026<br />
                    Email: <a href="mailto:grievance@thecoverkraft.com" style={{ color: '#8BC642' }}>grievance@thecoverkraft.com</a><br />
                    Phone: [To be provided]
                </p>

                <h2 style={{ color: '#8BC642' }}>Consent</h2>
                <p>By using the CoverKraft App or website, you consent to this Privacy Policy and its practices.</p>

                <p style={{ marginTop: '2rem', fontStyle: 'italic', color: '#CCCCCC' }}>
                    We encourage you to review this policy regularly for any changes.
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
            <div
                id="TermsOfUse"
                style={{
                    maxWidth: '1200px',
                    margin: '2rem auto',
                    padding: '2rem',
                    color: '#E0E0E0',
                    lineHeight: '1.8',
                    fontSize: '1.7rem',
                    borderRadius: '10px',
                    fontFamily: 'Arial, sans-serif',
                }}
            >
                <h2 style={{ color: '#8BC642', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                    Terms of Use for{' '}
                    <a
                        href="http://www.TheCoverKraft.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#8BC642', textDecoration: 'underline' }}
                    >
                        www.TheCoverKraft.com
                    </a>{' '}
                    and “CoverKraft” App
                </h2>

                <p>
                    Welcome to www.TheCoverKraft.com and the “CoverKraft” mobile application (“we,” “us,” or “our”). These Terms of Use (“Terms”) govern your access to and use of our website and mobile application (collectively, the “Services”). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree, please do not use our Services.
                </p>

                <h2 style={{ color: '#8BC642' }}>1. Acceptance of Terms</h2>
                <ul>
                    <li>You are at least 18 years old and legally capable of entering into contracts.</li>
                    <li>You agree to comply with all applicable laws and regulations.</li>
                    <li>You accept these Terms and our Privacy Policy.</li>
                </ul>

                <h2 style={{ color: '#8BC642' }}>2. Description of Services</h2>
                <p>
                    www.TheCoverKraft.com and the “CoverKraft” App provide insurance awareness, educational content, policy comparison, quote generation, policy purchase facilitation, and a Policy Vault for storing insurance documents and renewal reminders. <br />
                    We do not provide insurance coverage directly but act as an insurance intermediary/broker authorized under IRDAI regulations.
                </p>

                <h2 style={{ color: '#8BC642' }}>3. User Account</h2>
                <ul>
                    <li>To access certain features, you may need to create an account.</li>
                    <li>You agree to provide accurate, current, and complete information during registration.</li>
                    <li>You are responsible for safeguarding your login credentials and for all activities under your account.</li>
                    <li>Notify us immediately if you suspect unauthorized use of your account.</li>
                </ul>

                <h2 style={{ color: '#8BC642' }}>4. User Obligations</h2>
                <ul>
                    <li>Do not use the Services for any unlawful or fraudulent purposes.</li>
                    <li>Do not upload or post any harmful, defamatory, obscene, or infringing content.</li>
                    <li>Do not attempt unauthorized access to systems or user accounts.</li>
                    <li>Do not interfere with our servers or use bots/scrapers without consent.</li>
                </ul>

                <h2 style={{ color: '#8BC642' }}>5. Intellectual Property Rights</h2>
                <ul>
                    <li>All content, trademarks, software, and materials are owned or licensed by us.</li>
                    <li>You may use the content only for personal, non-commercial purposes.</li>
                    <li>No part may be copied or redistributed without our written consent.</li>
                </ul>

                <h2 style={{ color: '#8BC642' }}>6. Insurance Products and Advice</h2>
                <ul>
                    <li>We help you understand insurance options, but don’t provide guarantees on accuracy.</li>
                    <li>Purchases are governed by individual insurer terms.</li>
                </ul>

                <h2 style={{ color: '#8BC642' }}>7. Payments and Transactions</h2>
                <ul>
                    <li>Payments are processed securely through third-party gateways.</li>
                    <li>We are not liable for failures caused by payment processors.</li>
                    <li>Refunds and claims are managed by insurers.</li>
                </ul>

                <h2 style={{ color: '#8BC642' }}>8. Policy Vault</h2>
                <ul>
                    <li>You may upload and store policy documents in your account.</li>
                    <li>You are responsible for the legality and correctness of uploaded documents.</li>
                    <li>We protect your data but cannot guarantee absolute security.</li>
                </ul>

                <h2 style={{ color: '#8BC642' }}>9. Limitation of Liability</h2>
                <ul>
                    <li>
                        To the extent permitted by law:
                        <ul>
                            <li>We disclaim all warranties, express or implied.</li>
                            <li>We are not liable for indirect, incidental, or consequential damages.</li>
                            <li>We don’t guarantee uninterrupted access or service error-free.</li>
                            <li>We are not responsible for third-party sites or services.</li>
                        </ul>
                    </li>
                </ul>

                <h2 style={{ color: '#8BC642' }}>10. Indemnification</h2>
                <p>
                    You agree to indemnify and hold harmless TheCoverKraft.com and its officers, agents, and partners against all claims arising from your use of our Services.
                </p>

                <h2 style={{ color: '#8BC642' }}>11. Termination</h2>
                <ul>
                    <li>We may suspend or terminate access for violations or any reason.</li>
                    <li>Upon termination, all rights to access Services cease immediately.</li>
                    <li>Certain sections survive post-termination.</li>
                </ul>

                <h2 style={{ color: '#8BC642' }}>12. Changes to Terms</h2>
                <p>
                    We may update these Terms periodically. Changes will be communicated via website or app notifications. Continued use means acceptance.
                </p>

                <h2 style={{ color: '#8BC642' }}>13. Governing Law and Jurisdiction</h2>
                <p>
                    These Terms are governed by Indian law. Disputes shall be handled in the courts of Bhopal, Madhya Pradesh.
                </p>

                <h2 style={{ color: '#8BC642' }}>14. Contact Us</h2>
                <p>
                    For queries regarding these Terms, contact us at:<br />
                    <strong>CoverKraft Insurance Brokers Private Limited</strong><br />
                    16 D-1, Danish Nagar, Hoshangabad Road, Bhopal, Madhya Pradesh – 462026<br />
                    Email:{' '}
                    <a href="mailto:contact@thecoverkraft.com" style={{ color: '#8BC642', textDecoration: 'underline' }}>
                        contact@thecoverkraft.com
                    </a>
                </p>

                <p style={{ marginTop: '2rem', fontStyle: 'italic', color: '#CCCCCC' }}>
                    By using TheCoverKraft.com and the CoverKraft App, you acknowledge that you have read, understood, and agreed to these Terms of Use.
                </p>
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
useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
}, [activeTab]); // Runs whenever activeTab changes

    return (
        <div style={{
            backgroundColor: "#121212",
            color: "#E0E0E0",
            padding: "3rem 1.5rem",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            minHeight: "100vh",
            minWidth: "70vw",
            width: "80%",
            paddingLeft: "20%",
        }}>
            {/* Centered Heading */}
            <h1 style={{
                color: "#8BC642",
                fontSize: "2.2rem",
                marginBottom: "4rem",
                borderBottom: "2px solidrgb(219, 241, 191)",
                paddingBottom: "0.5rem",
                fontWeight: "600",
                textAlign: "center",
            }}>
                Legal and Admin Policies
            </h1>

            {/* Tab Container - pill background */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "2rem",
            }}>
                <div style={{
                    backgroundColor: "#1A1A1A",
                    padding: "0.5rem",
                    borderRadius: "50px",
                    display: "flex",
                    gap: "0.5rem",
                    boxShadow: "0 0 10px rgba(139, 198, 66, 0.15)",
                }}>
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
                                    border: "none",
                                    fontSize: "1.4rem",
                                    fontWeight: isActive ? "600" : "500",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    minWidth: "120px", // uniform size
                                    textAlign: "center"
                                }}
                            >
                                {policy.label}
                            </button>
                        );
                    })}
                </div>
            </div>


            {/* Scrollable Policy Content */}
            <div style={{
                backgroundColor: "#1A1A1A",
                padding: "2.5rem",
                borderRadius: "12px",
                boxShadow: "0 0 20px rgba(139, 198, 66, 0.1), 0 8px 32px rgba(0,0,0,0.4)",
                lineHeight: "1.75",
                fontSize: "1rem",
                color: "#CCCCCC",
                maxHeight: "75vh",
                overflowY: "scroll",
                border: "1px solid #2E2E2E",
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none"  // IE & Edges
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