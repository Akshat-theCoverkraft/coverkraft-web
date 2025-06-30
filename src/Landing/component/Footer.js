import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../Images/CKbig.png";
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
    if (route === "/vault") {
      const isLoggedIn = sessionStorage.getItem("isLoggedIn"); // replace with actual key if needed
      if (!isLoggedIn || isLoggedIn === "false") {
        // Redirect to login if not logged in
        navigate("/login");
        return;
      }
    }
    navigate(route);
  };

  const servicesLinks = [
    { to: "/", label: "Home" },
    // { to: "/about", label: "About Us" },
    { to: "/vault", label: "Policy Vault" },
    { to: "/contactus", label: "Contact Us" },
    { label: "Grievance Redress Policy", to: "/legal#GrievanceRedressPolicy" },

  ];

  const companyLinks = [
    { label: "About Us", to: "/about" },
    { label: "Privacy Policy", to: "/legal#PrivacyPolicy" },
    { label: "Legal And Admin Policies", to: "/legal" },
    { label: "Disclaimer", to: "/legal#disclaimer" },
    { label: "Terms of Use", to: "/legal#TermsOfUse" },
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
        background: "#212121",
        color: THEME_COLOR.COLOR,
      }}
    >
      <div
        className="container-fluid"
        style={{
          marginLeft: '60px',
          marginRight: '60px',
        }}
      >
        <div className="row g-4 align-items-start mr-5">
          {/* Logo and Description */}
          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <div className="d-flex flex-column h-100">
              <img
                src={logo}
                alt="Coverkraft Logo"
                style={{
                  height: "65px",
                  width: "300px",
                  objectFit: "cover",
                }}
                className="mb-3"
              />
              <p
                className="text-color lh-base mb-0"
                style={{ fontSize: "1.4rem" }}
              >
                 CoverKraft empowers its clients with the required insurance knowledge for making propoer insurance choice. Our clients can save all thier policies in the Policy Vault and get timely reminder for renewal
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
                    padding: "12px",
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
