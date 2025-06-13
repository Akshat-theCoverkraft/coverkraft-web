import React from "react";
import "./CSS/afterglow.css";
import mockup from "../../Images/Afterglow-mockup.png";
import checkicon from "../../Images/Check-icon.png";
import googleicon from "../../Images/Google-icon.png";
import appleicon from "../../Images/Apple-icon.png";
import Grid from "@mui/material/Grid";
import Carousel1 from "../Carousel1";

const Afterglow = () => {
  return (
    <div style={{ height: "85vh", margin: "2rem  0" }}>
      <div className="bg-image p-5">
        <div className="text-center text-white " style={{ marginBottom: "135px" }}>
          <h3 className=" fw-bold mt-5" style={{ fontSize: "2rem" }}>
            BENEFITS
          </h3>
          <h1 className="mt-5 fw-bold " style={{ fontSize: "3rem" }}>
            Comprehensive Coverage Options
          </h1>
          <p className="mt-4 fs-2">
            Our Comprehensive programs offer extensive financial backing, ensuring you and your loved ones are
            well-covered in <br />
            any situation. Enjoy peace of mind with our reliable and tailored solutions.
          </p>
          {/* <button className="btn">View all</button> */}
        </div>
        <Carousel1 />
      </div>
    </div>
  );
};

export default Afterglow;
