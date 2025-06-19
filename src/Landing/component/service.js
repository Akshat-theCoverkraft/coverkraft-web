import React from "react";
import { Typography } from "@mui/material";
import services from "../../Images/Coming-Soon.png";
import "./CSS/service.css";
import Background from "../../Images/OurCerification1.png";

const Service = () => {
  return (
    <section
      className="service-section"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="grid-overlay" />

      <div className="service-container">
        <div className="service-left">
          <Typography
            className="service-title ml-5"
            variant="h5"
            fontWeight="bold"
            fontSize="2.8rem"
          >
            OUR CERTIFICATIONS
          </Typography>
          <Typography
            className="service-heading ml-5"
            variant="h3"
            fontWeight="700"
            fontSize="2.5rem"
            gutterBottom
          >
            Change your business
          </Typography>
          <Typography
            className="service-description ml-5"
            fontSize="1.7rem"
            lineHeight="1.7"
          >
            This certificate acknowledges our commitment to providing exceptional services. 
            Your trust in us is our greatest asset. We pledge to continue delivering reliable 
            and comprehensive support to protect your future.
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
