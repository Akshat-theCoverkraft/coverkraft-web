<<<<<<< Updated upstream
import React from "react";
import "./CSS/afterglow.css";
import checkicon from "../../Images/Check-icon.png";
import googleicon from "../../Images/Google-icon.png";
import appleicon from "../../Images/Apple-icon.png";
import mockup from "../../Images/Coverkraft-mockup.png";
import Grid from "@mui/material/Grid";
const Coverkraft = () => {
  return (
    <Grid
      container
      xs={12}
      md={12}
      spacing={4}
      justifyContent="center"
      className="bg-image1 mb-5 p-5"
    >
      <Grid item xs={12} md={6} className="d-flex">
        <img src={mockup} alt="" width={800} />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        className="mt-5 d-flex flex-column justify-content-center "
      >
        <div>
          <h1
            className="fw-bold mb-1"
            style={{ color: "#FF9906", fontSize: "29px" }}
          >
            DOWNLOAD APP
          </h1>
          <h1 className="mt-3 mb-5 fw-bold" style={{ fontSize: "50px" }}>
            Get the Coverkraft app
          </h1>
        </div>
        <div className="mb-5">
          <div className="d-flex mb-2">
            <img src={checkicon} height={30} alt="check icon" />
            <p className="ml-2 fs-3">Track your policy status on the go</p>
          </div>
          <div className="d-flex mb-2">
            <img src={checkicon} height={30} alt="check icon" />
            <p className="ml-2 fs-3">Prioritising securing documents</p>
          </div>
          <div className="d-flex mb-2">
            <img src={checkicon} height={30} alt="check icon" />
            <p className="ml-2 fs-3">
              Use the documents anytime from the policy vault
            </p>
          </div>
          <div className="d-flex mb-2">
            <img src={checkicon} height={30} alt="check icon" />
            <p className="ml-2 fs-3">
              Convert physical policy documents into digital documents
            </p>
          </div>
        </div>
        <div className="my-5">
          <img src={googleicon} className="mr-3" alt="Google Play Store" />
          <img src={appleicon} alt="Apple App Store" />
        </div>
      </Grid>
    </Grid>
=======
import React from 'react';
import './CSS/afterglow.css';
import checkicon from '../../Images/Check-icon.png';
import googleicon from '../../Images/Google-icon.png';
import appleicon from '../../Images/Apple-icon.png';
import mockup from '../../Images/Coverkraft-mockup.png';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';

const Coverkraft = () => {
  return (
    <Box className="bg-image1 mb-5 p-4" sx={{ overflow: 'hidden' }}>
      <Grid container spacing={4} justifyContent="center" alignItems="center">

        {/* IMAGE SECTION */}
        <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
          <Box
            component="img"
            src={mockup}
            alt="App Mockup"
            sx={{
              width: { xs: '90%', sm: '80%', md: '100%' },
              maxWidth: 500,
              height: 'auto',
              mx: 'auto',
            }}
          />
        </Grid>

        {/* TEXT CONTENT SECTION */}
        <Grid item xs={12} md={6}>
          <Box sx={{ px: { xs: 2, sm: 4 }, textAlign: { xs: 'center', md: 'left' } }}>
            <h1 className="fw-bold mb-1" style={{ color: '#FF9906', fontSize: '29px' }}>
              DOWNLOAD APP
            </h1>
            <h1 className="mt-3 mb-5 fw-bold" style={{ fontSize: '40px' }}>
              Get the Coverkraft app
            </h1>

            {/* Feature list */}
            <Box className="mb-5" sx={{ textAlign: { xs: 'left', md: 'left' } }}>
              {[
                'Track your policy status on the go',
                'Prioritising securing documents',
                'Use the documents anytime from the policy vault',
                'Convert physical policy documents into digital documents',
              ].map((text, idx) => (
                <Box key={idx} className="d-flex align-items-start mb-3">
                  <img src={checkicon} height={24} alt="check icon" style={{ marginTop: '5px' }} />
                  <p className="ml-2 fs-5" style={{ marginLeft: '10px' }}>{text}</p>
                </Box>
              ))}
            </Box>

            {/* Store buttons */}
            <Box className="my-4 d-flex justify-content-center justify-content-md-start" gap={2}>
              <img src={googleicon} alt="Google Play Store" style={{ height: 50 }} />
              <img src={appleicon} alt="Apple App Store" style={{ height: 50 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
>>>>>>> Stashed changes
  );
};

export default Coverkraft;
