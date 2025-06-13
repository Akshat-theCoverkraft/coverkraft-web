import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const policies = [
    {
        label: "Privacy Policy",
        id: "PrivacyPolicy",
        content: (
            <div style={{ padding: "1rem", color: "#fff", lineHeight: "1.6" }}> <h2> Privacy Policy for{" "} <a href="http://www.TheCoverKraft.com" target="_blank" rel="noopener noreferrer" style={{ color: "#1DB1BB", textDecoration: "underline" }} > www.TheCoverKraft.com </a>{" "} and “CoverKraft” App </h2> <p> This Privacy Policy explains how{" "} <a href="http://www.TheCoverKraft.com" target="_blank" rel="noopener noreferrer" style={{ color: "#1DB1BB", textDecoration: "underline" }} > www.TheCoverKraft.com </a>{" "} (“we,” “us,” or “our”) and the “CoverKraft” mobile application collect, use, disclose, and protect your personal information. By accessing our website or using our app, you agree to this Privacy Policy. </p> <p>This policy complies with Indian data protection laws, including:</p> <ul> <li>Information Technology Act, 2000</li> <li>IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</li> <li>Personal Data Protection Bill (PDPB)</li> <li>Insurance Regulatory and Development Authority of India (IRDAI) guidelines</li> </ul> <h3>1. Information We Collect</h3> <ul> <li> <strong>Personal Information:</strong> Name, contact details, address, date of birth, identification documents, etc. </li> <li> <strong>Policy Information:</strong> Policy numbers, insurer names, coverage, expiry dates </li> <li> <strong>Usage Data:</strong> Pages visited, device type, interaction time </li> <li> <strong>Transaction Data:</strong> Payment history, billing data </li> <li> <strong>Uploaded Content:</strong> Files/documents added to the Policy Vault </li> <li> <strong>Cookies & Tracking:</strong> To improve performance and user experience </li> </ul> <h3>2. How We Use Your Information</h3> <ul> <li>Provide and enhance our services</li> <li>Support policy comparison, purchase, and renewals</li> <li>Manage policies in the Policy Vault</li> <li>Send reminders and notifications</li> <li>Recommend personalized insurance options</li> <li>Meet legal and regulatory requirements</li> <li>Prevent fraud and enforce terms</li> </ul> <h3>3. Sharing and Disclosure of Information</h3> <p> We do <strong>not</strong> sell or rent your data. We may share it with: </p> <ul> <li> <strong>Insurance Companies:</strong> For quotations and policy servicing </li> <li> <strong>Service Providers:</strong> For secure payments, analytics, tech support </li> <li> <strong>Legal/Regulatory Bodies:</strong> If mandated by law </li> <li> <strong>Business Transfers:</strong> During acquisitions or mergers </li> </ul> <h3>4. Data Security</h3> <ul> <li>SSL and secure encryption (data in transit and at rest)</li> <li>System logs retained for 180 days (as per IRDAI)</li> <li>Access control, breach reporting within 6 hours</li> <li>Periodic audits, privacy training for staff</li> </ul> <p> <strong>Note:</strong> No system is impenetrable. We respond swiftly to breaches and inform users as required. </p> <h3>5. User Rights and Choices</h3> <ul> <li>Access and update personal data</li> <li>Request corrections or deletion</li> <li>Withdraw data consent</li> <li>Export your data</li> </ul> <p>To exercise these rights, contact us via the details below.</p> <h3>6. Data Retention</h3> <p>We retain data:</p> <ul> <li>While your account is active</li> <li>For legal, regulatory, or complaint resolution purposes</li> </ul> <p>Afterward, data is securely deleted or anonymized.</p> <h3>7. Children’s Privacy</h3> <p> Our services are not meant for users under 18. If a child’s data is collected, we’ll remove it upon notice. </p> <h3>8. Updates to This Policy</h3> <p> We may revise this policy. Significant changes will be posted, and continued use implies acceptance. </p> <h3>9. Contact Us</h3> <p> <strong>Principal Officer/Compliance Officer</strong> <br /> CoverKraft Insurance Brokers Private Limited <br /> 16 D-1, Danish Nagar, Hoshangabad Road, Bhopal, Madhya Pradesh, PIN - 462026 <br /> Email:{" "} <a href="mailto:grievance@thecoverkraft.com" style={{ color: "#1DB1BB", textDecoration: "underline" }} >grievance@thecoverkraft.com</a> <br /> Phone: [To be provided] </p> <h3>10. Grievance Redressal</h3> <p> If you have complaints about our privacy practices, contact our Grievance Officer. We respond within the legal timeframe. </p> <p> By using{" "} <a href="http://www.TheCoverKraft.com" target="_blank" rel="noopener noreferrer" style={{ color: "#1DB1BB", textDecoration: "underline" }} > www.TheCoverKraft.com </a>{" "} and the CoverKraft App, you confirm that you’ve read, understood, and accepted this Privacy Policy. </p> </div>
        ),
    },
    {
        label: "Grievance Redress Policy",
        id: "GrievanceRedressPolicy",
        content: (
            <div id="GrievanceRedressPolicy">
                <h2>Grievance Redress Policy</h2>
                <p>Got a problem? We got a form. Fill it, chill.</p>
            </div>
        ),
    },
    {
        label: "License",
        id: "License",
        content: (
            <div id="License">
                <h2>License</h2>
                <p>This app is licensed under the Meme License 1.0. Use it for memes, not for world domination.</p>
            </div>
        ),
    },
    {
        label: "Terms & Conditions",
        id: "TermsOfUse",
        content: (
            <div id="TermsOfUse" style={{ color: "#fff", lineHeight: "1.6", padding: "1rem" }}>
                <h2>Terms of Use for <a href="http://www.TheCoverKraft.com" target="_blank" rel="noopener noreferrer" style={{ color: "#1DB1BB", textDecoration: "underline" }}>www.TheCoverKraft.com</a> and “CoverKraft” App</h2>
                <p>
                    Welcome to www.TheCoverKraft.com and the “CoverKraft” mobile application (“we,” “us,” or “our”). These Terms of Use (“Terms”) govern your access to and use of our website and mobile application (collectively, the “Services”). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree, please do not use our Services.
                </p>
                <h3>1. Acceptance of Terms</h3>
                <ul>
                    <li>You are at least 18 years old and legally capable of entering into contracts.</li>
                    <li>You agree to comply with all applicable laws and regulations.</li>
                    <li>You accept these Terms and our Privacy Policy.</li>
                </ul>
                <h3>2. Description of Services</h3>
                <p>
                    www.TheCoverKraft.com and “CoverKraft” App provide insurance awareness, educational content, policy comparison, quote generation, policy purchase facilitation, and a Policy Vault for storing insurance documents and renewal reminders.<br />
                    We do not provide insurance coverage directly but act as an insurance intermediary/broker authorized under IRDAI regulations.
                </p>
                <h3>3. User Account</h3>
                <ul>
                    <li>To access certain features, you may need to create an account.</li>
                    <li>You agree to provide accurate, current, and complete information during registration.</li>
                    <li>You are responsible for safeguarding your login credentials and for all activities under your account.</li>
                    <li>Notify us immediately if you suspect unauthorized use of your account.</li>
                </ul>
                <h3>4. User Obligations</h3>
                <ul>
                    <li>Do not use the Services for any unlawful or fraudulent purposes.</li>
                    <li>Do not upload, post, or transmit any content that is illegal, harmful, defamatory, obscene, or infringes on intellectual property rights.</li>
                    <li>Do not attempt to gain unauthorized access to our systems or other users’ accounts.</li>
                    <li>Do not interfere with or disrupt the Services or servers/networks connected to the Services.</li>
                    <li>Do not use automated systems or software to extract data from the Services without our consent.</li>
                </ul>
                <h3>5. Intellectual Property Rights</h3>
                <ul>
                    <li>All content, trademarks, logos, software, and materials on the Services are owned or licensed by us.</li>
                    <li>You may use the content for personal, non-commercial purposes only.</li>
                    <li>No content from the Services may be copied, reproduced, republished, uploaded, posted, transmitted, or distributed without our prior written consent.</li>
                </ul>
                <h3>6. Insurance Products and Advice</h3>
                <ul>
                    <li>We provide information and tools to help you understand insurance products and make informed choices.</li>
                    <li>We do not guarantee the accuracy or completeness of information provided by insurance companies.</li>
                    <li>Any insurance purchase is subject to terms and conditions of the respective insurer.</li>
                </ul>
                <h3>7. Payments and Transactions</h3>
                <ul>
                    <li>When you purchase insurance policies through our platform, payments are processed securely.</li>
                    <li>We are not responsible for payment failures or delays caused by third-party payment gateways or banks.</li>
                    <li>Refunds, cancellations, and claims are governed by the policies of the respective insurance companies.</li>
                </ul>
                <h3>8. Policy Vault</h3>
                <ul>
                    <li>The Policy Vault allows you to upload and store your insurance documents.</li>
                    <li>You are responsible for the accuracy and legality of the documents you upload.</li>
                    <li>We take reasonable security measures to protect your data but do not guarantee absolute security.</li>
                </ul>
                <h3>9. Limitation of Liability</h3>
                <ul>
                    <li>To the maximum extent permitted by law:</li>
                    <ul>
                        <li>We disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.</li>
                        <li>We are not liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use or inability to use the Services.</li>
                        <li>We do not guarantee uninterrupted or error-free access to the Services.</li>
                        <li>We are not responsible for third-party websites or services linked through our platform.</li>
                    </ul>
                </ul>
                <h3>10. Indemnification</h3>
                <p>
                    You agree to indemnify, defend, and hold harmless TheCoverKraft.com, its affiliates, officers, directors, employees, and agents from any claims, damages, liabilities, losses, and expenses arising out of your use of the Services or violation of these Terms.
                </p>
                <h3>11. Termination</h3>
                <ul>
                    <li>We may suspend or terminate your access to the Services at any time without prior notice for violations of these Terms or for any other reason.</li>
                    <li>Upon termination, your right to use the Services will immediately cease.</li>
                    <li>Sections relating to Intellectual Property, Limitation of Liability, Indemnification, and Governing Law survive termination.</li>
                </ul>
                <h3>12. Changes to Terms</h3>
                <p>
                    We reserve the right to modify these Terms at any time. We will notify you of significant changes by posting the updated Terms on our website/app and updating the effective date. Continued use of the Services after changes constitutes acceptance of the new Terms.
                </p>
                <h3>13. Governing Law and Jurisdiction</h3>
                <p>
                    These Terms are governed by the laws of India. Any disputes arising out of or related to these Terms or the Services shall be subject to the exclusive jurisdiction of courts in [Your City, State].
                </p>
                <h3>14. Contact Us</h3>
                <p>
                    If you have any questions or concerns about these Terms, please contact us at:<br />
                    <strong>CoverKraft Insurance Brokers Private Limited</strong><br />
                    16 D-1, Danish Nagar, Hoshangabad Road, Bhopal, Madhya Pradesh, PIN - 462026<br />
                    Email: <a href="mailto:contact@thecoverkraft.com" style={{ color: "#1DB1BB", textDecoration: "underline" }}>contact@thecoverkraft.com</a><br />
                    Phone: 
                </p>
                <p>
                    By using TheCoverKraft.com and the “CoverKraft” App, you acknowledge that you have read, understood, and agreed to these Terms of Use.
                </p>
            </div>
        ),
    },
    {
        label: "Refund & cancellation Policy",
        id: "RefundCancellationPolicy",
        content: (
            <div id="RefundCancellationPolicy">
                <h2>Refund & Cancellation Policy</h2>
                <p>Refunds available only if you can reverse time.</p>
            </div>
        ),
    },
    {
        label: "ISNP",
        id: "ISNP",
        content: (
            <div id="ISNP">
                <h2>ISNP</h2>
                <p>This section covers all your ISNP drama.</p>
            </div>
        ),
    },
    {
        label: "Terms of Use",
        id: "TermsOfUse",
        content: (
            <div id="TermsOfUse">
                <h2>Terms of Use</h2>
                <p>Use it wisely. Or don’t use it at all.</p>
            </div>
        ),
    },
];

const LegalPoliciesTabs = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(policies[0].label);

    useEffect(() => {
        // Check for hash in URL to set correct tab
        if (location.hash) {
            const hash = location.hash.replace("#", "");
            const matchedPolicy = policies.find((p) => p.id === hash);
            if (matchedPolicy) {
                setActiveTab(matchedPolicy.label);
                // Scroll to the matching element
                const element = document.getElementById(hash);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }
        }
    }, [location]);

    const activePolicy = policies.find((p) => p.label === activeTab);

    return (
        <div style={{
            backgroundColor: "#121212",
            color: "#E0E0E0",
            padding: "3rem 1.5rem",
            fontFamily: "Inter, sans-serif"
        }}>
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
