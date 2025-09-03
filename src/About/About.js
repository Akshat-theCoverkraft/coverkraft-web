import React from "react";
import Navbar from "../component/Navbar";
import Footer from "../Landing/component/Footer";
import vision from "../Images/ic_vision.png";
import mission from "../Images/ic_mission.png";
import { Grid } from "@mui/material";
import "../profile/about.css";
import { THEME_COLOR } from "../constants";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async"; 

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const About = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Helmet>
        <title>About Us | Cover Kraft</title>
        <meta
          name="description"
          content="Learn about Cover Kraft's mission and vision. We aim to make insurance accessible, transparent, and simple for everyone."
        />
        <meta
          name="keywords"
          content="About Cover Kraft, Insurance mission, Insurance vision, Cover Kraft company, insurance platform"
        />
        <meta property="og:title" content="About Cover Kraft" />
        <meta
          property="og:description"
          content="Discover Cover Kraft's mission and vision for making insurance easier for everyone."
        />
        <meta
          property="og:image"
          content="https://yourdomain.com/coverkraft-about.jpg"
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://yourdomain.com/about" />
      </Helmet>

      <header>
        <Navbar />
      </header>

      <main className="flex-grow-1">
        <div className="content py-5 px-3">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <motion.h1
              className="text-center"
              style={{
                fontSize: "3.5rem",
                fontWeight: 800,
                color: "#8BC642",
              }}
            >
              About CoverKraft
            </motion.h1>

            <motion.p
              className="text-center my-4"
              style={{
                color: THEME_COLOR.SECONDARY_TEXT,
                maxWidth: "800px",
                fontWeight: 500,
                lineHeight: "1.6",
                fontSize: "1.7rem",
              }}
              variants={fadeInUp}
              custom={1}
            >
              Coverkraft Insurance Brokers Private Limited is on a mission to
              revolutionize the insurance industry. <br />
              Led by a team of experts and tech enthusiasts, we have developed a
              user-friendly tech platform to make insurance easily understandable
              and accessible for all.
            </motion.p>
          </motion.div>

          <section aria-label="Mission and Vision">
            <Grid
              container
              spacing={4}
              justifyContent="center"
              alignItems="stretch"
            >
              {[
                {
                  img: mission,
                  title: "Mission",
                  desc: "To educate customers about various risks and insurance products, equip them with tools for accessing and sharing their policies, and empower them with technology to purchase the most suitable products.",
                  alt: "Cover Kraft mission icon",
                },
                {
                  img: vision,
                  title: "Vision",
                  desc: "To be the preferred distribution partner for customers, recognized for our innovation, transparent advice, and integrity.",
                  alt: "Cover Kraft vision icon",
                },
              ].map((card, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.article
                    className="card card-container h-100"
                    style={{
                      backgroundColor: THEME_COLOR.FADE_BACKGROUND,
                      color: THEME_COLOR.COLOR,
                      cursor: "pointer",
                      borderRadius: "16px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    custom={index + 2}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.img
                      src={card.img}
                      alt={card.alt}
                      className="image"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        objectFit: "contain",
                        padding: "20px",
                      }}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.3 }}
                    />
                    <h2
                      className="header mb-3 text-center"
                      style={{ color: "#8BC642", fontWeight: 600 }}
                    >
                      {card.title}
                    </h2>
                    <p
                      className="text px-4 pb-4"
                      style={{
                        color: THEME_COLOR.SECONDARY_TEXT,
                        textAlign: "center",
                      }}
                    >
                      {card.desc}
                    </p>
                  </motion.article>
                </Grid>
              ))}
            </Grid>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
