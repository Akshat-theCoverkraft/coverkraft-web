import { useState, useEffect } from "react";
const td = {
    border: '1px solid #444',
    padding: '1rem',
    verticalAlign: 'top',
};
const policies = [
    {
        label: "Privacy Policy",
        id: "PrivacyPolicy",
        content: (
            <div style={{
                maxWidth: '1500px',
                margin: '2rem auto',
                // padding: '1rem',
                color: '#E0E0E0',
                lineHeight: '1.8',
                fontSize: '1.7rem',
                borderRadius: '10px',
                fontFamily: 'DM Sans',
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
            <div
                style={{
                    maxWidth: '1500px',
                    margin: '2rem auto',
                    // padding: '1rem',
                    color: '#E0E0E0',
                    lineHeight: '1.8',
                    fontSize: '1.7rem',
                    borderRadius: '10px',
                    fontFamily: 'DM Sans, sans-serif'
                }}
                id="GrievanceRedressPolicy">
                <h2 style={{ color: '#8BC642' }}>Grievance Redressal Mechanism</h2>
                <p>
                    All our customers can log queries or requests via the website or mobile app to register a grievance.
                </p>

                <ol style={{ paddingLeft: '1.5rem' }}>
                    <li style={{ marginBottom: '1rem' }}>
                        All grievances will be properly recorded and acknowledged to the customer.
                    </li>
                    <li style={{ marginBottom: '1rem' }}>
                        Each grievance will be reviewed in coordination with the respective Insurance Company(s) as needed.
                    </li>
                    <li style={{ marginBottom: '1rem' }}>
                        The company will make all reasonable efforts to address the grievance quickly, including escalating it to the concerned Insurance Company for prompt resolution.
                    </li>
                    <li style={{ marginBottom: '1rem' }}>
                        Customers will receive a resolution within regulatory timelines, along with the contact details of the respective Insurance Company.
                    </li>
                    <li style={{ marginBottom: '1rem' }}>
                        The Company aims to resolve all grievances within <strong>14 days</strong> from the date of receiving the request.
                    </li>
                    <li style={{ marginBottom: '1rem' }}>
                        If unresolved within 14 days or if dissatisfied with the response, customers may escalate by:
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Emailing the Grievance Officer, Mr. Vivek Lalan, at <a href="mailto:support@thecoverkraft.com" style={{ color: '#8BC642' }}>support@thecoverkraft.com</a></li>
                            <li>Calling us at [Toll Free Number — to be provided]</li>
                            <li>Visiting or writing to:<br />
                                CoverKraft Insurance Brokers Pvt. Ltd.,<br />
                                16 D-1, Danish Nagar, Hoshangabad Road,<br />
                                Bhopal, Madhya Pradesh, PIN – 462026
                            </li>
                        </ul>
                    </li>
                    <li style={{ marginBottom: '1rem' }}>
                        For escalations, you can write directly to Mr. Vivek Lalan at <a href="mailto:vivek.lalan@thecoverkraft.com" style={{ color: '#8BC642' }}>vivek.lalan@thecoverkraft.com</a>
                    </li>
                    <li style={{ marginBottom: '1rem' }}>
                        If you are still unsatisfied with the outcome, you may:
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>Register and monitor your complaint through IRDAI’s <strong>Integrated Grievance Management System (IGMS)</strong>: <a href="https://igms.irda.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#8BC642' }}>igms.irda.gov.in</a></li>
                            <li>Approach the <strong>Insurance Ombudsman</strong>: For details, visit <a href="http://ecoi.co.in" target="_blank" rel="noopener noreferrer" style={{ color: '#8BC642' }}>ecoi.co.in</a></li>
                        </ul>
                    </li>
                    <li style={{ marginBottom: '1rem' }}>
                        If no reply is received from the complainant within 2 weeks of us requesting any clarification, the grievance will be considered <strong>closed</strong>.
                    </li>
                </ol>

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
                    maxWidth: '1500px',
                    margin: '2rem auto',
                    // padding: '1rem',
                    color: '#E0E0E0',
                    lineHeight: '1.8',
                    fontSize: '1.7rem',
                    borderRadius: '10px',
                    fontFamily: 'DM Sans, sans-serif'
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
    {
        label: "Terms & Conditions",
        id: "TermsAndConditions",
        content: (
            <div style={{
                maxWidth: '1500px',
                margin: '2rem auto',
                color: '#E0E0E0',
                lineHeight: '1.8',
                fontSize: '1.7rem',
                borderRadius: '10px',
                fontFamily: 'DM Sans, sans-serif'
            }}>
                <h2 style={{ color: '#8BC642', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                    Terms & Conditions for <a href="http://www.TheCoverKraft.com" target="_blank" rel="noopener noreferrer" style={{ color: '#8BC642', textDecoration: 'underline' }}>www.TheCoverKraft.com</a> and “CoverKraft” App
                </h2>

                <ol style={{ paddingLeft: '1.5rem' }}>
                    <li>
                        Welcome to <strong>www.thecoverkraft.com</strong> (the "Site") operated by <strong>COVERKRAFT INSURANCE BROKERS PRIVATE LIMITED</strong> ("Coverkraft Insurance"), providing an easy way to buy insurance products from multiple Insurance Companies. Coverkraft Insurance is a licensed Insurance Broking Company holding a Broking license from the Insurance Regulatory and Development Authority. The IRDAI Direct Broker (General & Life) License Code: <strong>xxx</strong>.
                    </li>

                    <li>
                        Coverkraft Insurance provides its services to you subject to the following conditions. Before you use the portal, you must read and accept all of the terms and conditions in this Terms of Use (ToU) and the Privacy Policy. Use of any functionality of the portal constitutes acceptance of this ToU. If this ToU conflicts with any other documents, the ToU will control. If you do not agree to be bound by this ToU and the Privacy Policy, you may not use the portal. Please revisit this page periodically to review the most current version.
                    </li>

                    <li>
                        We reserve the right, at our sole discretion, to change or modify the ToU without prior notice. Continued use of this site signifies your acceptance of the updated ToU.
                    </li>

                    <li>
                        This Site provides users with access to information focused on insurance products and services. To the maximum extent permitted by law, Coverkraft Insurance Brokers is not liable for Website Information or recommendations. You are responsible for your product choice. Review all information before proceeding. If in doubt, consult Coverkraft Insurance Brokers or the provider.
                    </li>

                    <li>
                        By visiting our website and accessing the Resources we provide, you agree to use them only for their intended purpose and in accordance with (a) this User Agreement, and (b) applicable laws and accepted online practices.
                    </li>

                    <li>
                        We reserve the right to remove any content that we determine violates this agreement, is offensive, harmful, inaccurate, or infringes copyrights or trademarks. We are not liable for any delay in removing such content. Posting such content implies your consent to its removal and a waiver of claims.
                    </li>

                    <li>
                        By using the Portal/site, you confirm you are of legal age to form a binding contract and are not barred from receiving services under Indian law or applicable jurisdiction. You may use the site to make legitimate purchases for yourself or others for whom you are legally authorized. You are responsible for sharing these terms with them. You must provide accurate, up-to-date information for registration or access.
                    </li>

                    <li>
                        You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities under your account. We strongly recommend logging out at the end of each session. Notify us immediately of any unauthorized use.
                    </li>

                    <li>
                        You agree to indemnify and hold harmless Coverkraft Insurance Brokers Private Limited and its team from all losses, damages, and costs (including legal fees) resulting from any violation of this ToU or unauthorized use of your account.
                    </li>

                    <li>
                        When you use the site or send emails to Coverkraft, you are communicating electronically. You consent to receive electronic communications from us. These may include emails, notices posted on the portal, calls, or other available methods. All communications satisfy legal requirements for written documentation.
                    </li>

                    <li>
                        The site may include links to external websites. Coverkraft Insurance Brokers has no control over those sites and is not responsible for their content, availability, products, or services.
                    </li>

                    <li>
                        By using our website, you agree that all Resources are provided “as is” and “as available.” We do not warrant that:
                        <ul style={{ paddingLeft: '1.5rem' }}>
                            <li>The Resources will meet your needs or expectations.</li>
                            <li>The use of Resources will be uninterrupted, timely, or error-free.</li>
                            <li>The information will be accurate or reliable.</li>
                            <li>Any defects or issues will be corrected.</li>
                        </ul>
                    </li>

                    <li>
                        All content and materials on <a href="http://www.TheCoverKraft.com" target="_blank" rel="noopener noreferrer" style={{ color: '#8BC642' }}>www.TheCoverKraft.com</a>, including but not limited to text, graphics, code, images, and logos, are the intellectual property of Coverkraft Insurance Brokers Private Limited and protected under copyright and trademark law. Unauthorized use is prohibited unless explicitly authorized.
                    </li>

                    <li>
                        Coverkraft Insurance Brokers does not guarantee the timeliness, accuracy, or completeness of Website Information or the quality of outcomes from using the site.
                    </li>

                    <li>
                        By using this Site, you accept this policy. If you do not agree, do not use the Site. Continued use after changes implies acceptance of those changes.
                    </li>

                    <li>
                        You authorize Coverkraft Insurance and its representatives to contact you on the provided phone number for your insurance needs. This authorization overrides any NDNC registration.
                    </li>

                    <li>
                        Ensure you enter the correct PYP number and declare your previous year’s NCB status accurately. (NCB should be zero if a claim was made last year.) Misrepresentation or nondisclosure, including pre-existing health conditions, may lead to policy cancellation or claim denial.
                    </li>

                    <li>
                        If you have any questions or comments about these Terms of Service, please contact us at:
                        <br />
                        <strong>Email:</strong> <a href="mailto:contact@thecoverkraft.com" style={{ color: '#8BC642' }}>contact@thecoverkraft.com</a><br />
                        <strong>Address:</strong> 16 D-1, Danish Nagar, Hoshangabad Road, Bhopal, Madhya Pradesh, PIN - 462026
                    </li>
                </ol>

                <p style={{ marginTop: '2rem', fontStyle: 'italic', color: '#CCCCCC' }}>
                    Please review this policy regularly to stay updated on any changes or amendments.
                </p>
            </div>
        )


    },
    {
        label: "Refund & Cancellation Policy",
        id: "RefundCancellationPolicy",
        content: (
            <div
                id="RefundCancellationPolicy"
                style={{
                    maxWidth: '1500px',
                    margin: '2rem auto',
                    color: '#E0E0E0',
                    lineHeight: '1.8',
                    fontSize: '1.7rem',
                    borderRadius: '10px',
                    fontFamily: 'DM Sans, sans-serif',
                }}
            >
                <h2 style={{ color: '#8BC642', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                    Refund & Cancellation Policy
                </h2>

                <h3 style={{ color: '#8BC642', marginTop: '1.5rem' }}>Refund Policy</h3>
                <p>
                    In case of a refund due to an erroneous transaction or policy cancellation, the premium amount paid will be refunded through direct credit or cheque, depending on the prevailing refund policy of the respective Insurance Company from whom you purchased the insurance product.
                </p>

                <h3 style={{ color: '#8BC642', marginTop: '1.5rem' }}>Cancellation Policy</h3>
                <p>
                    For cancellations, the refund of the premium amount will also be processed by the respective Insurance Company, either via direct credit or cheque, based on their individual cancellation and refund terms. Please refer to your insurer’s policy document for detailed procedures and timelines.
                </p>

                <p style={{ marginTop: '2rem', fontStyle: 'italic', color: '#CCCCCC' }}>
                    Note: TheCoverKraft acts as an intermediary and does not directly handle premium refunds or cancellations. All transactions are subject to the insurer's terms and conditions.
                </p>
            </div>

        ),
    },
    {
        label: "ISNP",
        id: "ISNP",
        content: (
            <div
                id="ISNPPolicyServicing"
                style={{
                    maxWidth: '1500px',
                    margin: '2rem auto',
                    color: '#E0E0E0',
                    lineHeight: '1.8',
                    fontSize: '1.7rem',
                    borderRadius: '10px',
                    fontFamily: 'DM Sans, sans-serif',
                }}
            >
                <h2 style={{ color: '#8BC642', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                    ISNP – Procedures, Processes and Timelines for Post-Sales Servicing of Insurance Policies
                </h2>
                <h2 style={{ color: '#8BC642', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                    Service TAT - Health
                </h2>
                <p>
                    In accordance with Schedule I of the Insurance ecommerce guidelines issued by IRDAI on 9th March 2017, Coverkraft Insurance Brokers Private Limited as an ISNP follows the following service TAT’s for online sale of Health Insurance products:                 </p>

                {/* Health Insurance Section */}
                {/* <h3 style={{ color: '#8BC642', marginTop: '2rem' }}>Service TAT – Health Insurance</h3> */}

                <p style={{ marginBottom: '1rem', color: '#8BC642' }}>
                    Policyholder Servicing Turnaround Times Are As Follows:                 </p>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#1E1E1E', color: '#8BC642' }}>
                            <th style={{ border: '1px solid #333', padding: '1rem' }}>Service Parameters</th>
                            <th style={{ border: '1px solid #333', padding: '1rem' }}>Maximum Turnaround Time (Calendar Days) </th>
                            <th style={{ border: '1px solid #333', padding: '1rem' }}>Turnaround Time To Be Calculated From </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={td}>Written communication of decisions on the proposal / raising additional requirements on the proposal</td>
                            <td style={td}>15 days</td>
                            <td style={td}>Date of receipt of the proposal or the date of receipt of any requirement called for, whichever is later </td>
                        </tr>
                        <tr>
                            <td style={td}>Providing copy of accepted proposal form </td>
                            <td style={td}>5 days</td>
                            <td style={td}>Date of acceptance of the proposal </td>
                        </tr>
                        <tr>
                            <td style={td}>Refund post cancellation</td>
                            <td style={td}>10 days</td>
                            <td style={td}>From decision date / last document / cancellation request</td>
                        </tr>
                        <tr>
                            <td style={td}>Requests for refund towards free look cancellation, surrender and withdrawal; refund of proposal deposit; refund of outstanding proposal deposit, if any </td>
                            <td style={td}>10 days</td>
                            <td style={td}>Date of receipt of request/last necessary document, whichever is later </td>
                        </tr>
                        <tr>
                            <td style={td}>Acknowledgement of Grievance </td>
                            <td style={td}>5 days</td>
                            <td style={td}>Date of receipt of Grievance </td>
                        </tr>
                        <tr>
                            <td style={td}>Resolution of Grievance </td>
                            <td style={td}>30 days</td>
                            <td style={td}>Date of receipt of Grievance </td>
                        </tr>
                        <tr>
                            <td style={td}>Compliance of KYC norms </td>
                            <td style={td}>—</td>
                            <td style={td}>KYC not needed if premium &lt; ₹50K. PAN required if &gt; ₹50K.</td>
                        </tr>
                    </tbody>
                </table>

                {/* General Insurance Workflow Section */}
                <h4 style={{ color: '#8BC642' }}>The General Insurance Policy (Including Health Insurance) Servicing Details May Include The Process And Timelines For: </h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#1E1E1E', color: '#8BC642' }}>
                            <th style={{ border: '1px solid #333', padding: '1rem' }}>Process</th>
                            <th style={{ border: '1px solid #333', padding: '1rem' }}>Timeline</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={td}>Filling up of proposal form </td>
                            <td style={td}>45 days</td>
                        </tr>
                        <tr>
                            <td style={td}>Electronic copy of proposal form and payment acknowledgement </td>
                            <td style={td}>5 days</td>
                        </tr>
                        <tr>
                            <td style={td}>One Time Password (OTP) for authentication of details mentioned in proposal form </td>
                            <td style={td}>10 minutes</td>
                        </tr>
                        <tr>
                            <td style={td}>KYC documentation</td>
                            <td style={td}>The Customer relationship team will follow up on completion of proposal form </td>
                        </tr>
                        <tr>
                            <td style={td}>Medical scheduling</td>
                            <td style={td}>The Customer relationship team will follow up on completion of proposal form </td>
                        </tr>
                        <tr>
                            <td style={td}>Proposal form acceptance</td>
                            <td style={td}>15 days post completion of documentation & medicals, if any </td>
                        </tr>
                        <tr>
                            <td style={td}>Refund</td>
                            <td style={td}>15 days from the date of underwriting </td>
                        </tr>
                    </tbody>
                </table>

                {/* Life Insurance Section */}
                <h3 style={{ color: '#8BC642', marginTop: '2rem' }}>Service TAT – Life Insurance</h3>
                <p style={{ marginBottom: '1rem' }}>
                    In accordance with Schedule I of the Insurance ecommerce guidelines issued by IRDAI on 9th March 2017, Coverkraft Insurance Brokers Private Limited (formerly known as Coverkraft Insurance Web Aggregator Private Limited), as an ISNP follows the following service TAT’s for online sale of Life Insurance products:
                </p>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#121212', color: '#8BC642' }}>
                            <th >Policyholder Servicing Turnaround Times Are As Follows: </th>
                        </tr>
                        <tr style={{ backgroundColor: '#1E1E1E', color: '#8BC642' }}>
                            <th style={{ border: '1px solid #333', padding: '1rem' }}>Service Parameters</th>
                            <th style={{ border: '1px solid #333', padding: '1rem' }}>Maximum Turnaround Time (Calendar Days) </th>
                            <th style={{ border: '1px solid #333', padding: '1rem' }}>Turnaround Time To Be Calculated From </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={td}>Written communication of decisions on the proposal / raising additional requirements on the proposal </td>
                            <td style={td}>15 days</td>
                            <td style={td}>Date of receipt of the proposal or the date of receipt of any requirement called for, whichever is later </td>
                        </tr>
                        <tr>
                            <td style={td}>Providing copy of accepted proposal form </td>
                            <td style={td}>5 days</td>
                            <td style={td}>From acceptance date</td>
                        </tr>
                        <tr>
                            <td style={td}>Refund of proposal deposit post cancellation of proposal </td>
                            <td style={td}>10 days</td>
                            <td style={td}>Date of case decision/date of receipt of last necessary document /date of receipt of request for cancellation of proposal, whichever is later </td>
                        </tr>
                        <tr>
                            <td style={td}>Requests for refund towards free look cancellation, surrender and withdrawal; refund of proposal deposit; refund of outstanding proposal deposit, if any </td>
                            <td style={td}>10 days</td>
                            <td style={td}>Date of receipt of request/last necessary document, whichever is later </td>
                        </tr>
                        <tr>
                            <td style={td}>Acknowledgement of Grievance </td>
                            <td style={td}>5 days</td>
                            <td style={td}>Date of receipt of Grievance </td>
                        </tr>
                        <tr>
                            <td style={td}>Resolution of Grievance </td>
                            <td style={td}>30 days</td>
                            <td style={td}>Date of receipt of Grievance </td>
                        </tr>
                        <tr>
                            <td style={td}>Compliance of KYC norms </td>
                            <td style={td}>45 days</td>
                            <td style={td}>Date of transaction of the Website. </td>
                        </tr>
                    </tbody>
                </table>
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
        label: "Disclaimer",
        id: "disclaimer",
        content: (
            <div style={{
                maxWidth: '1500px',
                margin: '2rem auto',
                color: '#E0E0E0',
                lineHeight: '1.8',
                fontSize: '1.7rem',
                borderRadius: '10px',
                fontFamily: 'DM Sans, sans-serif'
            }}>
                <h2 style={{ color: '#8BC642', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                    Disclaimer for <a href="http://www.TheCoverKraft.com" target="_blank" rel="noopener noreferrer" style={{ color: '#8BC642', textDecoration: 'underline' }}>www.TheCoverKraft.com</a> and “CoverKraft” App
                </h2>

                <h3 style={{ color: '#8BC642' }}>General Information</h3>
                <p>
                    The information, content, and materials provided on <strong>www.TheCoverKraft.com</strong> and the “CoverKraft” App (collectively, “the Platform”) are for general informational and educational purposes only. The Platform is owned and operated by <strong>CoverKraft Insurance Brokers Private Limited</strong>, an IRDAI-licensed insurance broker in India.
                </p>

                <h3 style={{ color: '#8BC642' }}>No Professional Advice</h3>
                <p>
                    The content, including but not limited to videos, blogs, articles, policy comparisons, and policy wordings, is intended to increase insurance awareness and help users make informed decisions. However, the information provided does not constitute professional financial, legal, or insurance advice. Users are encouraged to consult with qualified professionals or directly with insurance companies for advice tailored to their individual circumstances.
                </p>

                <h3 style={{ color: '#8BC642' }}>Accuracy of Information</h3>
                <p>
                    While we strive to ensure that all information on the Platform is accurate, current, and complete, we make no representations or warranties, express or implied, regarding the accuracy, reliability, suitability, or availability of any information, products, services, or related graphics contained on the Platform. Insurance product details, premiums, coverage, and terms are subject to change by insurers without notice.
                </p>

                <h3 style={{ color: '#8BC642' }}>No Endorsement</h3>
                <p>
                    References to specific insurance companies, products, or services on the Platform do not constitute or imply endorsement, recommendation, or favouring by CoverKraft Insurance Brokers Private Limited or its affiliates.
                </p>

                <h3 style={{ color: '#8BC642' }}>Third-Party Links</h3>
                <p>
                    The Platform may contain links to third-party websites or services for your convenience and information. We do not control, endorse, or assume responsibility for the content, privacy policies, or practices of any third-party sites.
                </p>

                <h3 style={{ color: '#8BC642' }}>Limitation of Liability</h3>
                <p>
                    To the fullest extent permitted by law, CoverKraft Insurance Brokers Private Limited, its owners, directors, employees, affiliates, and agents disclaim all liability for any direct, indirect, incidental, consequential, or special damages arising out of or in any way connected with your use of, or inability to use, the Platform or reliance on any information provided on the Platform.
                </p>

                <h3 style={{ color: '#8BC642' }}>Policy Vault and User Content</h3>
                <p>
                    Users are solely responsible for the accuracy, legality, and completeness of any insurance documents or personal information uploaded to the Policy Vault. We do not guarantee the security or retention of user-uploaded content beyond our stated security practices.
                </p>

                <h3 style={{ color: '#8BC642' }}>Regulatory Status</h3>
                <p>
                    CoverKraft Insurance Brokers Private Limited operates as an insurance broker in accordance with the regulations of the Insurance Regulatory and Development Authority of India (IRDAI). All insurance products offered through the Platform are underwritten by respective insurance companies, and all claims, renewals, and policy servicing are subject to the terms and conditions of the respective insurers.
                </p>

                <h3 style={{ color: '#8BC642' }}>Changes to Disclaimer</h3>
                <p>
                    We reserve the right to update or modify this Disclaimer at any time without prior notice. Please review this Disclaimer periodically for changes. Continued use of the Platform constitutes acceptance of any changes.
                </p>

                <h3 style={{ color: '#8BC642' }}>Contact</h3>
                <p>
                    For any questions or clarifications regarding this Disclaimer, please contact:
                    <br />
                    <strong>TheCoverKraft.com</strong><br />
                    16 D-1, Danish Nagar, Hoshangabad Road,<br />
                    Bhopal, Madhya Pradesh, PIN - 462026<br />
                    <strong>Email:</strong> <a href="mailto:contact@thecoverkraft.com" style={{ color: '#8BC642' }}>contact@thecoverkraft.com</a><br />
                    <strong>Phone:</strong> [To be provided]
                </p>

                <h3 style={{ color: '#8BC642' }}>Shape</h3>
                <p>
                    By using TheCoverKraft.com and the CoverKraft App, you acknowledge that you have read, understood, and agreed to this Disclaimer.
                </p>

                <p style={{ marginTop: '2rem', fontStyle: 'italic', color: '#CCCCCC' }}>
                    This Disclaimer was last updated on [insert date here if needed].
                </p>
            </div>
        )

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
            fontFamily: "DM Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            minHeight: "100vh",
            minWidth: "70vw",
            width: "100%",
        }}>
            {/* Centered Heading */}
            <h1 style={{
                color: "#8BC642",
                fontSize: "2.7rem",
                marginBottom: "4rem",
                borderBottom: "2px solid rgb(141, 227, 27)",
                paddingBottom: "0.5rem",
                fontWeight: "700",
                textAlign: "center",
                // textDecoration: "underline"
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
                    backgroundColor: "#121212",
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
                                    border: "2px solid #8BC642",
                                    fontSize: "1.4rem",
                                    fontWeight: isActive ? "600" : "500",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    minWidth: "120px",
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
                msOverflowStyle: "none"
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