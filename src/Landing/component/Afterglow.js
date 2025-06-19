import React from "react";
import "./CSS/afterglow.css";
import Carousel1 from "../Carousel1";

const Afterglow = () => {
  return (
   <div style={{ height: "60vh", overflow: "visible", position: "relative" }}>
  <div className="bg-image p-6" style={{ overflow: "visible", position: "relative" }}>
    <Carousel1 />
  </div>
</div>

  );
};

export default Afterglow;
