import React from "react";
import Navbar from "../component/Navbar";
import Footer from "../Landing/component/Footer";
import vision from "../Images/ic_vision.png";
import mission from "../Images/ic_mission.png";
import { Card, Grid } from "@mui/material";
import "../profile/about.css";
import { THEME_COLOR } from "../constants";

const About = () => {
  return (
    <div
      id="about"
      className="overflow-hidden">
      <Navbar />
      <div className="content">
        <div className="padding-container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <h1 className="text-center">About CoverKraft</h1>
            <p
              className="text-center m-5 fs-3 "
              style={{
                color: THEME_COLOR.SECONDARY_TEXT,
                width: "70%",
                alignSelf: "center",
              }}
            >
              CoverKraft  Pvt Ltd is on a mission to
              revolutionize the industry. <br />
              Led by a team of experts and tech enthusiasts, we have
              developed a user-friendly tech platform to make insurance easily
              understandable and accessible for all.
            </p>
            <div className="spacer"></div>
          </div>
          {/* <div className="spacer"></div> */}
          <Grid
            container
            spacing={4}
            xs={12}
            justifyContent="center"
            alignItems="center"
            className=""
          >
            <Grid item xs={4}>
              <div
                className="card card-container"
                style={{
                  backgroundColor: THEME_COLOR.FADE_BACKGROUND,
                  color: THEME_COLOR.COLOR,
                  maxHeight: "500px",
                }}
              >
                <img src={mission} alt="Mission" className="image" />
                <h2 className="header mb-3">Mission</h2>
                <p
                  className="text px-5"
                  style={{ color: THEME_COLOR.SECONDARY_TEXT }}
                >
                  To educate customers about various risks of fake
                  products, equip them with tools for accessing and sharing
                  their policies, and empower them with technology to purchase
                  the most suitable products.
                </p>
              </div>
              {/* <div className="spacer"></div> */}
            </Grid>
            {/* <div className="spacer"></div> */}
            <Grid item xs={4}>
              <div
                className="card card-container"
                style={{
                  backgroundColor: THEME_COLOR.FADE_BACKGROUND,
                  color: THEME_COLOR.COLOR,
                  minHeight: "310px",
                }}
              >
                <img src={vision} alt="Vision" className="image" />
                <h2 className="header ">Vision</h2>
                <p
                  className="text px-5"
                  style={{ color: THEME_COLOR.SECONDARY_TEXT }}
                >
                  To be the preferred distribution partner for customers,
                  recognized for our innovation, transparent advice, and
                  integrity.
                </p>
                {/* <div className="spacer"></div> */}
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
