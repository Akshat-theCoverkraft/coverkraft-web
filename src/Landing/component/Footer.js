import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../Images/CoverKraft-beta.png";
import twitter from "../../Images/twitter.png";
import facebook from "../../Images/facebook.png";
import instagram from "../../Images/social.png";
import location from "../../Images/location_on.png";
import call from "../../Images/call.png";
import email from "../../Images/email.png";
import "./CSS/footer.css";
import { THEME_COLOR } from "../../constants";
import moment from "moment";

const Footer = () => {
  const navigate = useNavigate();

  const handleStaticNav = (route) => () => {
    navigate(route);
  };

  const servicesLinks = [
    { to: "/coverkraft", label: "Home" },
    { to: "/coverkraft/about", label: "About Us" },
    { to: "/coverkraft/vault", label: "Policy Vault" },
  ];

  const companyLinks = [
    { label: "Privacy Policy", to: "/coverkraft/privacypolicy" },
    { label: "Grievance Redress Policy", to: "/coverkraft/privacypolicy" },
    { label: "License", to: "/coverkraft/privacypolicy" },
    { label: "Terms of Use", to: "/coverkraft/privacypolicy" },
    { label: "Refund & Cancellation Policy", to: "/coverkraft/privacypolicy" },
    { label: "ISNP", to: "/coverkraft/privacypolicy" },
    { label: "legal", to: "/coverkraft/legal" },
  ];

  return (
    <footer
      className="pt-5 text-lg-start px-5"
      style={{
        background: THEME_COLOR.FADE_BACKGROUND,
        color: THEME_COLOR.COLOR,
      }}
    >
      <div className="container text-center text-md-start">
        <div className="row g-4">
          {/* Logo and Description */}
          <div className="col-12 col-md-6 col-lg-3">
            <img src={logo} alt="Coverkraft Logo" height={65} width={214} className="mb-3" />
            <p className="fs-5 text-color">
              Coverkraft offers powerful tools for filling out forms, scanning documents, and uploading them with ease.
            </p>
          </div>

          {/* Contact Info */}
          <address className="col-12 col-md-6 col-lg-3">
            <h6 className="text-uppercase fw-bold mb-3 fs-5 custom-color">Get in Touch</h6>

            <div className="d-flex align-items-start mb-2">
              <img src={location} alt="Location" height={23} className="me-2 mt-1" />
              <span className="fs-5 footer-link">16 D-1, Danish Nagar, Hoshangabad Road, Bhopal, MP, 462026</span>
            </div>

            <div className="d-flex align-items-start mb-2">
              <img src={email} alt="Email" height={23} className="me-2 mt-1" />
              <a href="mailto:contact@thecoverkraft.com" className="fs-5 footer-link">
                contact@thecoverkraft.com
              </a>
            </div>

            <div className="d-flex align-items-start">
              <img src={call} alt="Call" height={23} className="me-2 mt-1" />
              <a href="tel:+13866883295" className="fs-5 footer-link">
                +1 386-688-3295
              </a>
            </div>
          </address>

          {/* Services Navigation */}
          <nav className="col-6 col-md-4 col-lg-2">
            <h6 className="text-uppercase fw-bold mb-3 fs-5 custom-color">Services</h6>
            {servicesLinks.map(({ to, label }) => (
              <p key={label}>
                <Link to={to} className="fs-5 footer-link text-color" aria-label={label}>
                  {label}
                </Link>
              </p>
            ))}
          </nav>

          {/* Company Navigation */}
          <div className="col-6 col-md-4 col-lg-2">
            <h6 className="text-uppercase fw-bold mb-3 fs-5 custom-color">Company</h6>
            {companyLinks.map(({ label, to }) => (
              <p key={label}>
                <span
                  className="fs-5 footer-link text-color clickable"
                  onClick={handleStaticNav(to)}
                  role="button"
                  aria-label={label}
                >
                  {label}
                </span>
              </p>
            ))}
          </div>

          {/* Social Icons */}
          <div className="col-12 col-lg-2 d-flex align-items-center justify-content-lg-end justify-content-center gap-3">
            {[twitter, facebook, instagram].map((icon, i) => (
              <img
                key={i}
                src={icon}
                alt={`Social Icon ${i}`}
                className="social-icon"
                height={24}
                width={24}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="text-center p-3 mt-4" style={{ backgroundColor: THEME_COLOR.BACKGROUND }}>
        <span className="me-2">© Coverkraft {moment().format("YYYY")}</span>
        <span className="text-color">All rights reserved</span>
      </div>
    </footer>
  );
};

export default Footer;
