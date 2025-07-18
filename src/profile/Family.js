import React, { useState, useEffect } from "react";
import { Drawer, Box } from "@mui/material";
import { Card, Grid, Typography } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import backArrow from "../Images/ic_back_button.png";
import icDefaultProfile from "../Images/ic_default_profile.png";
import EmailIcon from "@mui/icons-material/Email";
import CallIcon from "@mui/icons-material/Call";
import axios from "axios";
import API_URL from "../ServiceModule/Service";
import addMember from "../Images/add-member.png";
import FamilyAdd from "./FamilyAdd";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { THEME_COLOR } from "../constants";
import SessionExpiredModal from "../utils/sessionExpireModal";

const Family = ({ family, onfamilyclose }) => {
  const [familyData, setFamilyData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const userId = sessionStorage.getItem("userId");
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const navigate = useNavigate(); // navigation hook

  const fetchFamilyDetails = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}family/getById?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        setFamilyData(response.data.data);
      } else {
        console.error("Expected an array but got:", response.data);
        setFamilyData([]);
      }
    } catch (error) {
       if (error.response?.status === 401) {
            setShowSessionExpired(true);
          } 
      console.error("Error fetching family details:", error);
      setFamilyData([]);
    }
  };
    const handleSessionExpiredOk = () => {
    setShowSessionExpired(false);
    navigate('/login');
    localStorage.clear();
  sessionStorage.clear(); 
  };

  useEffect(() => {
    fetchFamilyDetails();
  }, [userId]);

  const handleFamilyOpen = () => {
    setDrawerOpen(true);
  };

  const handleFamilyClose = () => {
    setDrawerOpen(false);
  };

  const handleFamilyAddSuccess = () => {
    // Refresh the family details when a new member is added
    fetchFamilyDetails();
    setDrawerOpen(false);
  };

  return (
    <Drawer
      anchor="right"
      open={family}
      onClose={onfamilyclose}
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: THEME_COLOR.FADE_BACKGROUND,
          color: THEME_COLOR.COLOR,
          width: "35vw",
          maxWidth: "400px",
          padding: "10px",
        },
      }}
    >
        <SessionExpiredModal
        visible={showSessionExpired}
        onConfirm={handleSessionExpiredOk}
      />
      <ToastContainer position="top-left" style={{ zIndex: 99999 }} />
      <Box
        sx={{ width: "100%", padding: 0 }}
        role="presentation"
        style={{ overflowX: "hidden" }}
      >
        <Grid container spacing={2} className="d-flex m-3" alignItems="center">
          <Grid item>
            <img
              src={backArrow}
              alt="Back"
              onClick={onfamilyclose}
              style={{ cursor: "pointer" }}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h5" noWrap>
              Manage Your Family Members
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} direction="column" style={{ padding: "0 16px" }}>
          {familyData?.map((profile, index) => (
            <Grid item xs={12} key={index}>
              <Card style={styles.card}>
                <div
                  className="profile-image-container"
                  style={styles.profileImageContainer}
                >
                  <img
                    src={
                      !profile.familyImg ? icDefaultProfile : profile.familyImg
                    }
                    alt="Profile"
                    className="profile-image"
                    style={styles.profileImage}
                  />
                </div>
                <p style={{ fontSize: "16px" }} className={styles.relationship}>
                  {profile.familyMember}
                </p>
                <p
                  style={{ fontSize: "20px", fontWeight: "500" }}
                  className={styles.name}
                >
                  {profile.fullName}
                </p>
                <div style={styles.infoContainer}>
                  <EmailIcon />
                  <span style={{ fontSize: "1.3rem", marginLeft: "8px" }}>
                    {profile?.email}
                  </span>
                </div>
                <div style={{ ...styles.infoContainer, marginTop: "10px" }}>
                  <CallIcon />
                  <span style={{ fontSize: "1.2rem", marginLeft: "8px" }}>
                    {profile?.mobile}
                  </span>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid
          container
          justifyContent="center"
          alignItems="center"
          className="mt-5"
          onClick={handleFamilyOpen}
          style={{ padding: "0 16px", marginTop: "20px", cursor: "pointer" }}
        >
          <Card style={{
            ...styles.card, width: "60%",
            borderStyle: 'dashed',
            borderColor: "#8AC642",

            borderWidth: 1.5,
          }}>
            <img height={70} src={addMember} alt="Add Member" />
            <h4 style={{ color: "#8AC642", marginTop: "10px" }}>Add New Member</h4>
          </Card>
        </Grid>
      </Box>

      {/* Pass drawerOpen as prop to FamilyAdd */}
      <FamilyAdd
        familyAdd={drawerOpen}
        onfamilyAddClose={handleFamilyClose}
        onSuccess={handleFamilyAddSuccess}
      />
    </Drawer>
  );
};

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    textAlign: "center",
    width: "100%", // Make card take full width of container
    boxSizing: "border-box",
  },
  profileImageContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "10px",
  },
  profileImage: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  relationship: {
    backgroundColor: "#FACFC6",
    padding: "5px 10px",
    borderRadius: "5px",
    marginBottom: "10px",
    display: "inline-block",
  },
  name: {
    marginBottom: "10px",
  },
  infoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default Family;
