import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../Images/CKbig.png";
import twitter from "../../Images/twitter.png";
import facebook from "../../Images/facebook.png";
import instagram from "../../Images/social.png";
import linkedin from "../../Images/linkedin.png";
import location from "../../Images/ic-location_on.png";
import call from "../../Images/ic-call.png";
import email from "../../Images/ic-email.png";
import clock from "../../Images/ic-clock.png";
import "./CSS/footer.css";
import { THEME_COLOR } from "../../constants";
import moment from "moment";
import { useEffect, useState } from "react";
import IRDA from "../../Images/IRDA.png";
const Footer = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(null);

  const handleStaticNav = (route) => () => {
    const [pathname, hash] = route.split("#");

    if (pathname === "/vault") {
      const isLoggedIn = sessionStorage.getItem("isLoggedIn");
      if (!isLoggedIn || isLoggedIn === "false") {
        navigate("/login");
        return;
      }
    }

    if (window.location.pathname === pathname && hash) {
      window.location.hash = `#${hash}`;
    } else {
      navigate(route);
    }
  };

  const policies = [
    { label: "Privacy Policy", id: "PrivacyPolicy" },
    { label: "Grievance Redress Policy", id: "GrievanceRedressPolicy" },
    { label: "Terms of Use", id: "TermsOfUse" },
    { label: "Terms & Conditions", id: "TermsAndConditions" },
    { label: "Refund & Cancellation Policy", id: "RefundCancellationPolicy" },
    { label: "ISNP", id: "ISNP" },
    { label: "License", id: "License" },
    { label: "Disclaimer", id: "disclaimer" },
  ];

  const servicesLinks = [
    { to: "/vault", label: "Policy Vault" },
    { to: "/contactus", label: "Contact Us" },
    { label: "Grievance Redress Policy", to: "/legal#GrievanceRedressPolicy" },
  ];

  const companyLinks = [
    { label: "About Us", to: "/about" },
    {label: "Our-Leaders", to: "/Our-LeaderShip" },
    { label: "Privacy Policy", to: "/legal#PrivacyPolicy" },
    { label: "Legal And Admin Policies", to: "/legal" },
    { label: "Disclaimer", to: "/legal#disclaimer" },
    { label: "Terms of Use", to: "/legal#TermsOfUse" },
  ];

  const socialIcons = [
    {
      src: twitter,
      alt: "Twitter",
      href: "https://x.com/thecoverkraft",
      target: "_blank",
    },
    {
      src: facebook,
      alt: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61578344134818",
    },
    {
      src: instagram,
      alt: "Instagram",
      href: "https://www.instagram.com/thecoverkraft/",
    },
    {
      src: linkedin,
      alt: "LinkedIn",
      href: "https://www.linkedin.com/company/thecoverkraft/",
    },
  ];

  useEffect(() => {
    const hash = window.location.hash?.substring(1);
    if (!hash) return;

    const match = policies.find((p) => p.id === hash);
    if (!match) return;

    setActiveTab(match.label);

    setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
  }, []);

  return (
    <footer
      className="pt-5 text-lg-start px-3"
      style={{ background: "#212121", color: THEME_COLOR.COLOR }}
    >
      <div className="container-fluid px-4">
        <div className="row g-4 align-items-start">
          {/* Logo + Description */}
          <div className="col-12 col-sm-6 col-lg-3">
            <img
              src={logo}
              alt="Coverkraft Logo"
              className="mb-3"
              style={{
                height: "65px",
                width: "100%",
                maxWidth: "300px",
                objectFit: "contain",
              }}
            />
            <p
              className="text-color lh-base mb-0"
              style={{ fontSize: "1.4rem", fontFamily: "DM Sans" }}
            ></p>
            CoverKraft empowers its clients with the required insurance
            knowledge for making proper insurance choice. Our clients can save
            all their policies in the Policy Vault and get timely reminders for
            renewal.
          </div>
          <div className="col-12 col-lg-3 d-flex justify-content-lg-end justify-content-center mt-4 mt-lg-0">
            {/* Legal & Footer Bottom Bar */}
            <div className="container-fluid px-4 mt-4">
              <div className="row">
                <div className="col-12 col-lg-12">
                  <div
                    className="footer-legal-text"
                    style={{
                      fontSize: "1.2rem",
                      color: "#fff",
                      lineHeight: "1.5",
                    }}
                  >
                    <h4>
                      <strong>
                        Coverkraft Insurance Brokers Private Limited
                      </strong>
                    </h4>
                    Reg. Office – D-3-591-D, Danish Nagar, Near Central School
                    -3, Hoshangabad Road, Bhopal (MP) - 462 026 <br /> IRDAI
                    Direct Insurance Broker (Life & General)
                    <br /> License No. 1078 | Valid Till - 13/07/2028 <br />{" "}
                    Code No. - IRDAI/INT/BRK/DB1170/2024 <br />
                    CIN NO. - U66220MP2024PTC071585 <br /> Reg. No. 071585
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      marginRight: "60px",
                      marginTop: "10px",
                    }}
                  >
                    <a
                      href="https://irdai.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={IRDA}
                        alt="IRDAI Logo"
                        style={{
                          height: "40px",
                          width: "auto",
                          marginRight: "50px",
                        }}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Contact Info */}
          <div
            className="col-12 col-sm-6 col-lg-2"
            style={{ paddingLeft: "10px" }}
          >
            <h6
              className="text-uppercase fw-bold mb-3"
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
              <a
                href="https://www.google.com/maps/search/?api=1&query=16+D-1,+Danish+Nagar,+Hoshangabad+Road,+Bhopal+(M.P)"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link lh-base"
                style={{
                  fontSize: "1.3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                16 D-1, Danish Nagar, Hoshangabad Road, Bhopal, MP, 462026
              </a>
            </div>

            <div className="d-flex align-items-center mb-3">
              <img
                src={email}
                alt="Email"
                style={{ height: "25px", width: "25px", objectFit: "contain" }}
                className="me-3"
              />
              <a
                href="mailto:contact@thecoverkraft.com"
                className="footer-link text-decoration-none"
                style={{ fontSize: "1.4rem" }}
              >
                contact@thecoverkraft.com
              </a>
            </div>

            <div className="d-flex align-items-center">
              <img
                src={call}
                alt="Call"
                style={{ height: "25px", width: "25px", objectFit: "contain" }}
                className="me-3"
              />
              {/* <a
                href="tel:+917247724735"
                className="footer-link text-decoration-none"
                style={{ fontSize: "1.3rem" }}
              > */}
              <span style={{ fontSize: "1.2rem" }}>+91 7247724735</span>

              {/* </a> */}
            </div>

            <div className="d-flex align-items-center mt-2">
              <img
                src={clock}
                alt="Clock"
                style={{ height: "25px", width: "25px", objectFit: "contain" }}
                className="me-3 mt-1"
              />
              <span style={{ fontSize: "1.2rem" }}>
                Monday – Saturday
                <br />
                9:30 AM  –  6:30 PM
              </span>
            </div>
          </div>

          {/* Services */}
          <div
            className="col-6 col-sm-6 col-lg-2"
            style={{ paddingLeft: "35px" }}
          >
            <h6
              className="text-uppercase fw-bold mb-3"
              style={{ fontSize: "1.4rem" }}
            >
              Services
            </h6>
            <div className="d-flex flex-column gap-2">
              {servicesLinks.map(({ to, label }) => (
                <span
                  key={label}
                  className="footer-link text-color clickable d-inline-block"
                  onClick={handleStaticNav(to)}
                  role="button"
                  aria-label={label}
                  style={{ fontSize: "1.2rem", cursor: "pointer" }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Company */}
          <div
            className="col-6 col-sm-6 col-lg-2"
            style={{ paddingLeft: "35px" }}
          >
            <h6
              className="text-uppercase fw-bold mb-3"
              style={{ fontSize: "1.4rem" }}
            >
              Company
            </h6>
            <div className="d-flex flex-column gap-2">
              {companyLinks.map(({ label, to, external }) =>
                external ? (
                  <a
                    key={label}
                    href={to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link text-color d-inline-block"
                    style={{ fontSize: "1.2rem", textDecoration: "none" }}
                  >
                    {label}
                  </a>
                ) : (
                  <span
                    key={label}
                    className="footer-link text-color clickable d-inline-block"
                    onClick={handleStaticNav(to)}
                    role="button"
                    aria-label={label}
                    style={{ fontSize: "1.2rem", cursor: "pointer" }}
                  >
                    {label}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 d-flex justify-content-center justify-content-center mt-4 ">
        <div className="d-flex gap-3">
          {socialIcons.map((icon, i) => (
            <a
              key={i}
              href={icon.href}
              target="_blank"
              rel="noopener noreferrer"
              className="d-inline-flex align-items-center justify-content-center"
              style={{
                borderRadius: "50%",
                paddingLeft: "10px",
                transition: "transform 0.2s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img
                src={icon.src}
                alt={icon.alt}
                style={{ height: "20px", width: "20px", objectFit: "contain" }}
              />
            </a>
          ))}
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
