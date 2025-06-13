import React from "react";
import Navbar from "../component/Navbar";
import Footer from "../Landing/component/Footer";
import { Container, Row, Col, Card } from "react-bootstrap";

const Section = ({ title, children }) => (
  <div className="mb-4">
    <h5 className="text-success fw-semibold">{title}</h5>
    <p className="text-light">{children}</p>
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
    <Section title="🛡️ Introduction">
      <span className="text-secondary">
        COVERKRAFT BROKERS PRIVATE LIMITED respects your privacy and is committed
        to protecting your personal information. This policy outlines how we collect,
        use, and safeguard your data as part of our services.
      </span>
    </Section>

    <Section title="📋 Information We Collect">
      We collect <strong>Personal Information</strong> (name, contact details, professional info) and
      <strong> Sensitive Personal Information</strong> (financial details, health records, policy details, etc.),
      including data from service providers or during your interaction with our services.
    </Section>

    <Section title="🎯 Purpose & Usage">
      Your data helps us:
      <ul>
        <li>Deliver and improve our services</li>
        <li>Verify identity and process transactions</li>
        <li>Personalize communication and marketing</li>
      </ul>
    </Section>

    <Section title="🤝 Sharing of Information">
      We may share data with:
      <ul>
        <li>Service providers</li>
        <li>Partner companies</li>
        <li>Payment gateways and regulators</li>
        <li>Legal authorities (if required)</li>
      </ul>
    </Section>

    <Section title="🔐 Data Security">
      We apply strict technical, operational, and legal controls to protect your data.
      Any third party we work with must also comply with our security requirements.
    </Section>

    <Section title="🧾 Your Rights">
      You may review, update, or delete your personal information by contacting us at{" "}
      <a href="mailto:vivek.lalan@thecoverkraft.com" className="text-success fw-semibold">
        vivek.lalan@thecoverkraft.com
      </a>.
    </Section>

    <Section title="🔗 Google User Data">
      If you connect your Google Account, we securely access relevant data through Google’s API
      with your permission. You’re always in control of this.
    </Section>

    <Section title="🧹 Data Deletion">
      Want out? Email us anytime, and we’ll completely delete your data from our systems.
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
