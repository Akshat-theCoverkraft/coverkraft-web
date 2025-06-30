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
const Family = ({ family, onfamilyclose }) => {
  const [familyData, setFamilyData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");

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
      console.error("Error fetching family details:", error);
      setFamilyData([]);
    }
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
    setDrawerOpen(false); // Close the add family drawer
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
          width: "25vw",
        },
      }}
    >
      <ToastContainer />
      <Box
        sx={{ width: "25vw", padding: 0 }}
        role="presentation"
        style={{ overflowX: "hidden" }}
      >
        <Grid container spacing={2} className="d-flex m-3">
          <Grid item>
            <img src={backArrow} alt="Back" onClick={onfamilyclose} />
          </Grid>
          <Grid item>
            <Typography variant="h4">Plans for your family</Typography>
          </Grid>
        </Grid>
        <Grid container xs={12} spacing={2}>
          {familyData?.map((profile, index) => (
            <Grid item xs={6} key={index}>
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <EmailIcon />
                  <span style={{ fontSize: "1.3rem" }} className="ml-2">
                    {profile?.email}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "10px",
                  }}
                >
                  <CallIcon />
                  <span style={{ fontSize: "1.2rem" }} className="ml-2">
                    {profile?.mobile}
                  </span>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Grid
          container
          xs={12}
          justifyContent="center"
          alignItems="center"
          className="mt-5"
          onClick={handleFamilyOpen}
        >
          <Card style={styles.card}>
            <img height={70} src={addMember} />
            <h4 style={{ color: "#0098DB" }}>Add member</h4>
          </Card>
        </Grid>
      </Box>
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
    padding: "30px",
    margin: "0 20px",
    textAlign: "center",
  },
  profileImageContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "0px",
  },
  profileImage: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
  },
  relationship: {
    backgroundColor: "#FACFC6",
    padding: "5px 5px",
    borderRadius: "5px",
    marginBottom: "0px 0px",
  },
  name: {
    marginBottom: "10px",
  },
  infoContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "0px",
    padding: "5px 0",
  },
  infoText: {
    // marginLeft: '10px',
  },
};

export default Family;
