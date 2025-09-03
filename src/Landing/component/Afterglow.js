import React from "react";
import "./CSS/afterglow.css";
import Carousel1 from "../Carousel1";

const Afterglow = () => {
  return (
    <div style={{ height: "50vh", overflow: "visible", position: "relative" }}>
      <div
        className="bg-image px-0 pt-4 pb-2 mx-5"
        style={{ overflow: "visible", position: "relative" }}
      >
        <Carousel1 />
      </div>
    </div>
  );
};

export default Afterglow;
