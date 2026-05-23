import React from "react";
import Navbar from "../component/Navbar";
import Footer from "../Landing/component/Footer";
import { Container, Row, Col, Card } from "react-bootstrap";

const Section = ({ title, children }) => (
  <div className="mb-4">
    <h5 className="text-success fw-semibold">{title}</h5>
    <div className="text-light">{children}</div>
  </div>
);

const PrivacyPolicy = () => {
  return (
    <div style={{ backgroundColor: "#1c1c1e", color: "#ffffff" }}>
      <Navbar />

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={10}>
            <Card className="bg-dark text-white p-4 shadow-lg border-0 rounded-4" style={{ lineHeight: "1.8", fontSize: "1.05rem" }}>
              <Card.Body style={{ textAlign: "left" }}>
                <h1 className="text-success mb-5 fw-bold display-5 text-center">
                  Privacy Policy
                </h1>

                <div className="px-md-3 px-1">
                  <Section title="📋 Introduction">
                    <span className="text-secondary">
                      This Privacy Policy describes how <strong>CoverKraft Insurance Brokers Private Limited</strong> ("we", "our", or "us") 
                      collects, uses, shares, and protects your information through our website{" "}
                      <a href="http://www.TheCoverKraft.com" target="_blank" rel="noopener noreferrer" className="text-success">
                        www.TheCoverKraft.com
                      </a>{" "}
                      and the "CoverKraft" mobile application.
                    </span>
                  </Section>

                  <Section title="⚖️ Legal Compliance">
                    We comply with the following Indian data protection laws and regulatory frameworks:
                    <ul className="mt-2">
                      <li>Information Technology Act, 2000</li>
                      <li>IT Rules 2011 (Sensitive Personal Data)</li>
                      <li>Personal Data Protection Bill (PDPB)</li>
                      <li>IRDAI Guidelines</li>
                    </ul>
                  </Section>

                  <Section title="📊 Collection of Information">
                    When you use our services, we may collect various types of information, including:
                    <ul className="mt-2">
                      <li><strong>Personal Data:</strong> Name, email, phone number, address, date of birth, ID proofs, etc.</li>
                      <li><strong>Policy Details:</strong> Policy number, insurer, coverage, premium, expiry date, etc.</li>
                      <li><strong>App & Web Usage:</strong> Pages viewed, time spent, device info.</li>
                      <li><strong>Payment Data:</strong> Billing info, transactions.</li>
                      <li><strong>Uploaded Files:</strong> Documents stored in the Policy Vault.</li>
                      <li><strong>Cookies:</strong> Used to enhance your experience and performance.</li>
                    </ul>
                  </Section>

                  <Section title="🔐 Google OAuth & Google User Data">
                    <p>
                      We use Google OAuth to allow users to sign in securely to the CoverKraft website and mobile application.
                    </p>
                    <p>
                      When you sign in using Google, we may collect limited information from your Google account such as your name, 
                      email address, and profile picture, strictly for authentication and account creation purposes.
                    </p>
                    <p className="mb-2">
                      <strong>Important:</strong>
                    </p>
                    <ul>
                      <li>We do not access, read, modify, or store any Google user data beyond what is necessary for login and account identification.</li>
                      <li>We do not sell, share, or use Google user data for advertising or marketing purposes.</li>
                      <li>All Google user data is handled in accordance with Google OAuth policies and applicable data protection laws.</li>
                    </ul>
                  </Section>

                  <Section title="🎯 Use of Information">
                    We use your information to:
                    <ul className="mt-2">
                      <li>Deliver and maintain our services</li>
                      <li>Store and manage policies</li>
                      <li>Send reminders, alerts, and policy updates</li>
                      <li>Personalize your insurance experience</li>
                      <li>Fulfill legal obligations</li>
                      <li>Prevent fraud and ensure security</li>
                    </ul>
                  </Section>

                  <Section title="🤝 Sharing and Disclosure">
                    <p>
                      We do <strong>not</strong> sell or rent your data. However, we may share your information with:
                    </p>
                    <ul>
                      <li><strong>Insurance Providers:</strong> For policy issuance and servicing</li>
                      <li><strong>Third-Party Services:</strong> For secure payment, tech support, analytics</li>
                      <li><strong>Legal Bodies:</strong> When required under the law or court order</li>
                      <li><strong>Business Transitions:</strong> In case of mergers or acquisitions</li>
                      <li><strong>Google Services:</strong> Limited data may be shared with Google solely for authentication purposes via Google OAuth</li>
                    </ul>
                  </Section>

                  <Section title="🔒 Data Security">
                    We implement robust security measures including:
                    <ul className="mt-2">
                      <li>SSL encryption (at rest and in transit)</li>
                      <li>Access control with strict permissions</li>
                      <li>Breach alerts and reporting within 6 hours</li>
                      <li>Log retention (as per IRDAI: 180 days)</li>
                    </ul>
                    <p className="mt-2">
                      <strong>Note:</strong> While we strive for security, no system is 100% hack-proof.
                    </p>
                  </Section>

                  <Section title="✅ Your Rights">
                    As a user, you have the right to:
                    <ul className="mt-2">
                      <li>Access or update your data</li>
                      <li>Request correction or deletion</li>
                      <li>Export your information</li>
                      <li>Withdraw consent anytime</li>
                    </ul>
                    <p className="mt-2">Contact us to exercise any of the above rights.</p>
                  </Section>

                  <Section title="📅 Data Retention">
                    We retain your data for as long as:
                    <ul className="mt-2">
                      <li>Your account is active</li>
                      <li>Required by law or regulatory obligation</li>
                      <li>Necessary to resolve disputes or enforce agreements</li>
                    </ul>
                    <p className="mt-2">Post that, data is anonymized or deleted securely.</p>
                  </Section>

                  <Section title="👶 Children's Privacy">
                    Our services are intended for users above 18. If data is collected from a minor, it will be deleted immediately upon discovery.
                  </Section>

                  <Section title="🔄 Policy Updates">
                    This Privacy Policy may be updated periodically. Users will be notified of material changes. Continued use constitutes acceptance.
                  </Section>

                  <Section title="📞 Grievance & Contact">
                    <p><strong>Grievance Officer / Compliance Contact</strong></p>
                    <p className="mb-1">CoverKraft Insurance Brokers Pvt. Ltd.</p>
                    <p className="mb-1">16 D-1, Danish Nagar, Hoshangabad Road,</p>
                    <p className="mb-1">Bhopal, Madhya Pradesh, 462026</p>
                    <p className="mb-1">
                      Email:{" "}
                      <a href="mailto:grievance@thecoverkraft.com" className="text-success fw-semibold">
                        grievance@thecoverkraft.com
                      </a>
                    </p>
                    <p>Phone: +91 7247724739</p>
                  </Section>

                  <Section title="✍️ Consent">
                    <p>
                      By using the CoverKraft App or website, you consent to this Privacy Policy and its practices.
                    </p>
                    <p>
                      By using Google Sign-In, you consent to the collection and use of your Google account information as described above.
                    </p>
                  </Section>
                </div>

                <hr className="border-secondary my-5" />
                <p className="text-muted small text-end">Last Updated: 02/05/2025</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;