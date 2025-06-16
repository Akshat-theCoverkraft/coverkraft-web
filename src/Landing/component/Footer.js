import React from "react";
import { Link } from "react-router-dom";
import logo from "../../Images/coverkraft_logo_1.png";
import facebook from "../../Images/facebook.png";
import instagram from "../../Images/instagram.png";
import location from "../../Images/location_on.png";
import call from "../../Images/call.png";
import email from "../../Images/email.png";
import "./CSS/footer.css";
import { THEME_COLOR } from "../../constants";
import moment from "moment";

const Footer = () => {
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
            <img
              src={logo}
              alt="Coverkraft Logo"
              height={65}
              width={214}
              className="mb-3"
            />
            <p className="fs-5 text-color">
              Coverkraft offers powerful tools for filling out forms, scanning
              documents, and uploading them with ease.
            </p>
          </div>

          {/* Get in Touch */}
          <address className="col-12 col-md-6 col-lg-3">
            <h6 className="text-uppercase fw-bold mb-3 fs-5 custom-color">
              Get in Touch
            </h6>

            <div className="d-flex align-items-start mb-2">
              <img src={location} alt="" height={23} className="me-2 mt-1" />
              <span className="fs-5 footer-link">
                8819 Ohio St. South Gate, CA 90280
              </span>
            </div>

            <div className="d-flex align-items-start mb-2">
              <img src={email} alt="" height={23} className="me-2 mt-1" />
              <a href="mailto:Ourstudio@hello.com" className="fs-5 footer-link">
                Ourstudio@hello.com
              </a>
            </div>

            <div className="d-flex align-items-start">
              <img src={call} alt="" height={23} className="me-2 mt-1" />
              <a href="tel:+13866883295" className="fs-5 footer-link">
                +1 386-688-3295
              </a>
            </div>
          </address>

          <nav className="col-6 col-md-4 col-lg-2">
            <h6 className="text-uppercase fw-bold mb-3 fs-5 custom-color">
              Service
            </h6>
            {[
              { to: "/coverkraft", label: "Home" },
              { to: "/coverkraft/about", label: "About Us" },
              { to: "/coverkraft/vault", label: "Vault" },
              { to: "/coverkraft/vault", label: "Policy" },
              { to: "/coverkraft/privacypolicy", label: "Privacy Policy" },
            ].map(({ to, label }) => (
              <p key={label}>
                <Link to={to} className="fs-5 footer-link text-color">
                  {label}
                </Link>
              </p>
            ))}
          </nav>

          <div className="col-6 col-md-4 col-lg-2">
            <h6 className="text-uppercase fw-bold mb-3 fs-5 custom-color">
              Company
            </h6>
            {["Blog", "Help", "Terms & Conditions"].map((item) => (
              <p className="fs-5 footer-link text-color" key={item}>
                {item}
              </p>
            ))}
          </div>

          <div className="col-12 col-lg-2 d-flex align-items-center justify-content-lg-end justify-content-center gap-3">
            <img
              src={require("../../Images/ic_twitter.png")}
              alt="Twitter"
              className="twitter"
              aria-label="Twitter"
            />
            <img
              src={facebook}
              alt="Facebook"
              className="social-icon"
              aria-label="Facebook"
            />
            <img
              src={instagram}
              alt="Instagram"
              className="social-icon"
              aria-label="Instagram"
            />
          </div>
        </div>
      </div>

      <div
        className="text-center p-3 mt-4"
        style={{ backgroundColor: THEME_COLOR.BACKGROUND }}
      >
<span className="me-2">© Coverkraft {moment().format('YYYY')}</span>
        <span className="border-start border-secondary ps-2">
          All Rights Reserved
        </span>
      </div>
    </footer>
  );
};

export default Footer;
