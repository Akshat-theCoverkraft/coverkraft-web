import React from "react";
import "./CSS/afterglow.css";
import Carousel1 from "../Carousel1";

const Afterglow = () => {
  return (
    <div style={{ height: "60vh", margin: "0rem  0", padding: "0rem 0" }}>
      <div className="bg-image p-3">
        <div className="text-center text-white " style={{ marginBottom: "50px" }}>
        </div>
        <Carousel1 />
      </div>
    </div>
  );
};

export default Afterglow;
