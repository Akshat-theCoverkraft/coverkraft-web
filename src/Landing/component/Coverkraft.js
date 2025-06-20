import React from "react";
import { Grid, Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import checkicon from "../../Images/Check-icon.png";
import googleicon from "../../Images/Google-icon.png";
import appleicon from "../../Images/Apple-icon.png";
import mockup from "../../Images/AppDI.png";
import "./CSS/afterglow.css";

const features = [
  "Track your policy status on the go",
  "Prioritising securing documents",
  "Use the documents anytime from the policy vault",
  "Convert physical policy documents into digital documents",
];

const Coverkraft = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid
      container
      spacing={4}
      justifyContent="center"
      alignItems="center"
      className="bg-image1 mb-5"
      px={{ xs: 2, sm: 4, md: 6 }}
      py={{ xs: 4, md: 8 }}
    >
      <Grid item xs={12} md={6} display="flex" justifyContent="center">
        <Box component="img" src={mockup} alt="Coverkraft Mockup" sx={{
          width: { xs: "90%", sm: "100%", md: "80%" },
          maxWidth: "600px",
        }} />
      </Grid>

      <Grid item xs={12} md={6}>
        <Box>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="#FF9906"
            gutterBottom
            sx={{ fontSize: { xs: "22px", sm: "26px", md: "29px" } }}
          >
            DOWNLOAD APP <span style={{ color: "#8BC642", fontWeight:"6rem", fontSize: "50px" }}>Coming Soon...</span>
          </Typography>
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            sx={{ fontSize: { xs: "32px", sm: "40px", md: "50px" } }}
          >
            Get the Coverkraft app
          </Typography>
        </Box>

        <Box my={4}>
          {features.map((item, index) => (
            <Box key={index} display="flex" alignItems="flex-start" mb={2}>
              <Box
                component="img"
                src={checkicon}
                alt="Check Icon"
                sx={{ height: 26, mt: "4px" }}
              />
              <Typography variant="body1" sx={{ ml: 2, fontSize: "1.1rem" }}>
                {item}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={2}
          mt={4}
        >
          <Box
            component="img"
            src={googleicon}
            alt="Google Play"
            sx={{ width: { xs: "160px", sm: "180px" } }}
          />
          <Box
            component="img"
            src={appleicon}
            alt="Apple Store"
            sx={{ width: { xs: "160px", sm: "180px" } }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Coverkraft;
