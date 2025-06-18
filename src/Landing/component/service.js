import React from "react";
import { Box, Typography } from "@mui/material";
import services from "../../Images/Coming-Soon.png";
import "./CSS/service.css";

const Service = () => {
  return (
    <section className="service-section">
      <div className="grid-overlay" />

      <div className="service-container">
        <div className="service-left">
          <Typography className="service-title fs-5,fw-bold">OUR CERTIFICATIONS</Typography>
          <Typography className="service-heading">Change your business</Typography>
          <Typography className="service-description">
            This certificate acknowledges our commitment to providing exceptional insurance services. 
            Your trust in us is our greatest asset. We pledge to continue delivering reliable and comprehensive 
            coverage to protect your future.
          </Typography>
        </div>

        <div className="service-right">
          <img src={services} alt="certification" className="service-image" />
        </div>
      </div>

      {/* Ellipses */}
      <span className="ellipse ellipse-1" />
      <span className="ellipse ellipse-2" />
      <span className="ellipse ellipse-3" />
      <span className="ellipse ellipse-4" />
    </section>
  );
};

export default Service;
