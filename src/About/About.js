import React from "react";
import Navbar from "../component/Navbar";
import Footer from "../Landing/component/Footer";
import vision from "../Images/ic_vision.png";
import mission from "../Images/ic_mission.png";
import { Grid } from "@mui/material";
import "../profile/about.css";
import { THEME_COLOR } from "../constants";

const About = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1">
        <div className="content py-5 px-3">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <h1 className="text-center">About CoverKraft</h1>
            <p
              className="text-center fs-5 my-4"
              style={{
                color: THEME_COLOR.SECONDARY_TEXT,
                maxWidth: "800px",
              }}
            >
              CoverKraft Pvt Ltd is on a mission to revolutionize the industry.
              <br />
              Led by a team of experts and tech enthusiasts, we have developed a
              user-friendly tech platform to make insurance easily understandable
              and accessible for all.
            </p>
          </div>

          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="stretch"
          >
            <Grid item xs={12} sm={6} md={4}>
              <div
                className="card card-container h-100"
                style={{
                  backgroundColor: THEME_COLOR.FADE_BACKGROUND,
                  color: THEME_COLOR.COLOR,
                }}
              >
                <img
                  src={mission}
                  alt="Mission"
                  className="image"
                  style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }}
                />
                <h2 className="header mb-3 text-center">Mission</h2>
                <p
                  className="text px-4 pb-4"
                  style={{ color: THEME_COLOR.SECONDARY_TEXT, textAlign: "center" }}
                >
                  To educate customers about various risks of fake products,
                  equip them with tools for accessing and sharing their policies,
                  and empower them with technology to purchase the most suitable
                  products.
                </p>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <div
                className="card card-container h-100"
                style={{
                  backgroundColor: THEME_COLOR.FADE_BACKGROUND,
                  color: THEME_COLOR.COLOR,
                }}
              >
                <img
                  src={vision}
                  alt="Vision"
                  className="image"
                  style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }}
                />
                <h2 className="header mb-3 text-center">Vision</h2>
                <p
                  className="text px-4 pb-4"
                  style={{ color: THEME_COLOR.SECONDARY_TEXT, textAlign: "center" }}
                >
                  To be the preferred distribution partner for customers,
                  recognized for our innovation, transparent advice, and
                  integrity.
                </p>
              </div>
            </Grid>
          </Grid>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
