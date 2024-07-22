import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './about.css'; // Import your stylesheet here
import { Drawer, Box, Grid, Typography } from '@mui/material'
import backArrow from '../Images/ic_back_button.png';
import vision from '../Images/ic_vision.png';
import mission from '../Images/ic_mission.png'
const About = ({ about, onAboutclose }) => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [duration, setDuration] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  return (
    <Drawer anchor="right" open={about} onClose={onAboutclose}>
      <Box sx={{ width: 750, padding: 0 }} role="presentation">

        <div  style={{ backgroundColor: "#FFFEFE" }}>
          <Grid container spacing={2} className='d-flex m-3'>
            <Grid item>
              <img src={backArrow} alt="Back" onClick={onAboutclose} />
            </Grid>
            <Grid item>
              <Typography variant="h4">About Us</Typography>
            </Grid>
          </Grid>
          <div className="content">
            <div className="padding-container">
              <div>
                <h2 className="header-left">About CoverKraft</h2>
                <p className="text-style-hint">
                  CoverKraft Insurance Broking Pvt Ltd is on a mission to revolutionize the insurance industry. Led by a team of insurance experts and tech enthusiasts, we have developed a user-friendly tech platform to make insurance easily understandable and accessible for all.
                </p>
                <div className="spacer"></div>
              </div>
              <div className="spacer"></div>
              <div className="card card-container">
                <img
                  src={mission}
                  alt="Mission"
                  className="image"
                />
                <h2 className="header">Mission</h2>
                <p className="text">
                  To educate customers about various risks and insurance products, equip them with tools for accessing and sharing their policies, and empower them with technology to purchase the most suitable products.
                </p>
                <div className="spacer"></div>
              </div>
              <div className="spacer"></div>
              <div className="card card-container">
                <img
                  src={vision}
                  alt="Vision"
                  className="image"
                />
                <h2 className="header">Vision</h2>
                <p className="text">
                  To be the preferred distribution partner for customers, recognized for our innovation, transparent advice, and integrity.
                </p>
                <div className="spacer"></div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Drawer>
  );
};

export default About;
