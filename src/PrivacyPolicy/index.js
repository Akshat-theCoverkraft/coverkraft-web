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
            <Card className="bg-dark text-white p-4 shadow border-0 rounded">
              <Card.Body>
                <h2 className="text-center text-success mb-4">
                  Privacy Policy
                </h2>

                <Section title="Introduction">
                  COVERKRAFT INSURANCE BROKERS PRIVATE LIMITED respects your
                  privacy and is committed to protecting your personal
                  information. This policy outlines how we collect, use, and
                  safeguard your data.
                </Section>

                <Section title="Information We Collect">
                  We collect Personal Information (name, contact details,
                  professional info) and Sensitive Personal Information
                  (financial details, health records, etc.), including data from
                  service providers or during your interaction with our
                  services.
                </Section>

                <Section title="Purpose & Usage">
                  Your data helps us deliver and improve services, verify
                  identity, support underwriting and claims, process payments,
                  camera and personalize communication and marketing.
                </Section>

                <Section title="Sharing of Information">
                  We may share data with insurance companies, banks, service
                  providers, regulators, and payment gateways for the provision
                  of our services and legal compliance.
                </Section>

                <Section title="Data Security">
                  We apply strict technical, operational, and legal controls to
                  protect your data. Any third party we share it with is
                  obligated to handle it securely.
                </Section>

                <Section title="Your Rights">
                  You may review, update, or delete your personal information by
                  contacting us at{" "}
                  <a
                    href="mailto:vivek.lalan@thecoverkraft.com"
                    className="text-success"
                  >
                    vivek.lalan@thecoverkraft.com
                  </a>
                  .
                </Section>

                <Section title="Google User Data">
                  If you connect your Google Account, we securely access
                  relevant data through Google's API with your consent. This is
                  optional and under your control.
                </Section>

                <Section title="Data Deletion">
                  You may request deletion of your data at any time by emailing
                  us. We will ensure its complete removal from our systems.
                </Section>

                <hr className="border-secondary my-4" />
                <p className="text-muted small">Last Updated: 02/05/2025</p>
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
