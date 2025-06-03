import React from "react";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import family from "../../Images/family-home.png";
import { Button } from "@mui/material";

const HeroSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleVault = () => {
    const isLoggedIn = !!localStorage.getItem("token"); // Change 'token' to your actual key if different

    if (isLoggedIn) {
      navigate("/coverkraft/vault");
    } else {
      navigate("/coverkraft/login"); // Redirect to login if not logged in
    }
  };

  return (
    <div style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: { xs: 2, sm: 4, md: 10, lg: 12 } }}
      >
        {/* LEFT TEXT SECTION */}
        <Grid item xs={12} md={7}>
          <h1
            className="custom-size"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
            dangerouslySetInnerHTML={{ __html: t("secureFuture") }}
          />
          <p
            style={{
              color: "#7B7B7B",
              fontSize: "1.2rem",
              lineHeight: 1.7,
              marginBottom: "2rem",
            }}
          >
            Choose us for tailored insurance coverage, exceptional customer
            service, and peace of mind with reliable, comprehensive protection
            for all your needs.
          </p>
          <Button
            onClick={handleVault}
            style={{
              color: "#fff",
              backgroundColor: "#5A9E1E",
              borderRadius: "30px",
              padding: "14px 32px",
              fontSize: "1rem",
              fontWeight: 700,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Policy Vault
          </Button>
        </Grid>

        {/* RIGHT IMAGE SECTION */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "flex-end" },
            alignItems: "center",
          }}
        >
          <img
            src={family}
            alt="Family Home Insurance"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "500px",
              objectFit: "contain",
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default HeroSection;
