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
    // Check login status only for 'Policy Vault'
    if (route === "/coverkraft/vault") {
      const isLoggedIn = localStorage.getItem("isLoggedIn"); // replace with actual key if needed
      if (!isLoggedIn || isLoggedIn === "false") {
        // Redirect to login if not logged in
        navigate("/coverkraft/login");
        return;
      }
    }
    navigate(route);
  };

  const servicesLinks = [
    { to: "/coverkraft", label: "Home" },
    // { to: "/coverkraft/about", label: "About Us" },
    { to: "/coverkraft/vault", label: "Policy Vault" },
  ];

  const companyLinks = [
    { label: "Privacy Policy", to: "/coverkraft/legal#PrivacyPolicy" },
    {
      label: "Grievance Redress Policy",
      to: "/coverkraft/legal#GrievanceRedressPolicy",
    },
    { label: "License", to: "/coverkraft/legal#License" },
    { label: "Terms of Use", to: "/coverkraft/legal#TermsOfUse" },
    {
      label: "Refund & Cancellation Policy",
      to: "/coverkraft/legal#RefundCancellationPolicy",
    },
    { label: "ISNP", to: "/coverkraft/legal#ISNP" },
    { label: "legal", to: "/coverkraft/legal" },
    { to: "/coverkraft/about", label: "About Us" },
  ];

  const socialIcons = [
    { src: twitter, alt: "Twitter", href: "#" },
    { src: facebook, alt: "Facebook", href: "#" },
    { src: instagram, alt: "Instagram", href: "#" },
  ];

  return (
    <footer
      className="pt-5 text-lg-start px-3"
      style={{
        background: THEME_COLOR.FADE_BACKGROUND,
        color: THEME_COLOR.COLOR,
      }}
    >
      <div className="container-fluid">
        <div className="row g-4 align-items-start">
          {/* Logo and Description */}
          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <div className="d-flex flex-column h-100">
              <img
                src={logo}
                alt="Coverkraft Logo"
                style={{
                  height: "65px",
                  width: "214px",
                  objectFit: "contain",
                }}
                className="mb-3"
              />
              <p
                className="text-color lh-base mb-0"
                style={{ fontSize: "1.4rem" }}
              >
                Coverkraft offers powerful tools for filling out forms, scanning
                documents, and uploading them with ease.
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <h6
              className="text-uppercase fw-bold mb-3 custom-color"
              style={{ fontSize: "1.4rem" }}
            >
              Get in Touch
            </h6>

            <div className="d-flex align-items-start mb-3">
              <img
                src={location}
                alt="Location"
                style={{
                  height: "25px",
                  width: "25px",
                  objectFit: "contain",
                  flexShrink: 0,
                }}
                className="me-3 mt-1"
              />
              <span
                className="footer-link lh-base"
                style={{ fontSize: "1.3rem" }}
              >
                16 D-1, Danish Nagar, Hoshangabad Road,
                <br />
                Bhopal, MP, 462026
              </span>
            </div>

            <div className="d-flex align-items-center mb-3">
              <img
                src={email}
                alt="Email"
                style={{
                  height: "25px",
                  width: "25px",
                  objectFit: "contain",
                  flexShrink: 0,
                }}
                className="me-3"
              />
              <a
                href="mailto:contact@thecoverkraft.com"
                className="footer-link text-decoration-none"
                style={{ fontSize: "1.3rem" }}
              >
                contact@thecoverkraft.com
              </a>
            </div>

            <div className="d-flex align-items-center">
              <img
                src={call}
                alt="Call"
                style={{
                  height: "25px",
                  width: "25px",
                  objectFit: "contain",
                  flexShrink: 0,
                }}
                className="me-3"
              />
              <a
                href="tel:+91XXXXXXXXXX"
                className="footer-link text-decoration-none"
                style={{ fontSize: "1.3rem" }}
              >
                +91 XXXX-XXXXX
              </a>
            </div>
          </div>

          {/* Services Navigation */}
          <div className="col-6 col-md-4 col-lg-2 mb-4">
            <h6
              className="text-uppercase fw-bold mb-3 fs-7 custom-color"
              style={{ fontSize: "1.4rem" }}
            >
              Services
            </h6>
            <div className="d-flex flex-column gap-2">
              {servicesLinks.map(({ to, label }) => (
                <span
                  key={label}
                  className=" footer-link text-color clickable d-inline-block"
                  onClick={handleStaticNav(to)}
                  role="button"
                  aria-label={label}
                  style={{ cursor: "pointer", fontSize: "1.3rem" }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Company Navigation */}
          <div className="col-6 col-md-4 col-lg-2 mb-4">
            <h6
              className="text-uppercase fw-bold mb-3 fs-7 custom-color"
              style={{ fontSize: "1.4rem" }}
            >
              Company
            </h6>
            <div className="d-flex flex-column gap-2">
              {companyLinks.map(({ label, to }) => (
                <span
                  key={label}
                  className=" footer-link text-color clickable d-inline-block"
                  onClick={handleStaticNav(to)}
                  role="button"
                  aria-label={label}
                  style={{
                    cursor: "pointer",
                    fontSize: "1.3rem",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Social Icons */}
          <div className="col-12 col-lg-2 mb-4">
            <div className="d-flex align-items-center justify-content-lg-end justify-content-center gap-3 h-100">
              {socialIcons.map((icon, i) => (
                <a
                  key={i}
                  href={icon.href}
                  className="d-inline-flex align-items-center justify-content-center"
                  style={{
                    textDecoration: "none",
                    borderRadius: "50%",
                    padding: "8px",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
                  onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                >
                  <img
                    src={icon.src}
                    alt={icon.alt}
                    style={{
                      height: "20px",
                      width: "20px",
                      objectFit: "contain",
                    }}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div
        className="text-center p-3 mt-4"
        style={{ backgroundColor: THEME_COLOR.BACKGROUND }}
      >
        <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-2">
          <span>© Coverkraft {moment().format("YYYY")}</span>
          <span className="text-color">All rights reserved</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
