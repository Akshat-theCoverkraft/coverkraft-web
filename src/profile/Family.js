import React, { useState, useEffect } from "react";
import { Drawer, Box, Button } from "@mui/material";
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
import { toast, ToastContainer } from "react-toastify";
import { THEME_COLOR } from "../constants";
import SessionExpiredModal from "../utils/sessionExpireModal";
import { capitalizeFirstLetter } from "../utils/helpers";
import "react-toastify/dist/ReactToastify.css";

const Family = ({ family, onfamilyclose }) => {
  const [familyData, setFamilyData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [editData, setEditData] = useState(null);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");

  const fetchFamilyDetails = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}family/getById?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data?.data && Array.isArray(response.data.data)) {
        setFamilyData(response.data.data);
      } else {
        setFamilyData([]);
      }
    } catch (error) {
      if (error.response?.status === 401) setShowSessionExpired(true);
      setFamilyData([]);
    }
  };

  const handleSessionExpiredOk = () => {
    setShowSessionExpired(false);
    navigate("/login");
    localStorage.clear();
    sessionStorage.clear();
  };

  useEffect(() => {
    fetchFamilyDetails();
  }, [userId]);

  const handleAdd = () => {
    setMode("add");
    setEditData(null);
    setDrawerOpen(true);
  };

  const handleEdit = (member) => {
    setMode("edit");
    setEditData(member);
    setDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(`${API_URL}family/delete`, { _id: id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Member deleted successfully");
      fetchFamilyDetails();
    } catch (error) {
      toast.error("Failed to delete member");
    }
  };

  const handleFamilyAddClose = () => setDrawerOpen(false);
  const handleFamilyAddSuccess = () => {
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

      <Box sx={{ width: "100%", padding: 0 }}>
        {/* Header */}
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
            <Typography variant="h4">Manage Your Family Members</Typography>
          </Grid>
        </Grid>

        {/* Family List */}
        <Grid container xs={12} style={{ padding: "0 15px" , justifyContent: "center" }}>
          {familyData.map((profile, index) => (
            <Grid container xs={6} gap={2} key={index} style={styles.card}>

              <Grid container style={styles.profileImageContainer}>
                <div style={styles.profileImageContainer}>
                  {profile.familyImg ? (
                    <img
                      src={profile.familyImg}
                      alt="Profile"
                      style={styles.profileImage}
                    />
                  ) : (
                    <div style={styles.initialCircle}>
                      {profile.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <Grid item><Typography variant="h6" style={{ fontWeight: "bold", maxWidth:'80px' , maxLines:1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {capitalizeFirstLetter(profile.fullName)}
                </Typography>
                  <Typography variant="body2" style={styles.relationship}>
                    {profile.familyMember}
                  </Typography></Grid>
              </Grid>


              <div style={styles.detailsContainer}>

                <div style={styles.infoRow}>
                  <EmailIcon fontSize="small" />
                  <span style={{ marginLeft: "8px" }}>{profile?.email}</span>
                </div>
                <div style={styles.infoRow}>
                  <CallIcon fontSize="small" />
                  <span style={{ marginLeft: "8px" }}>{profile?.mobile}</span>
                </div>

                <div style={styles.buttonRow}>
                  <Button
                    variant="outlined"
                    size="small"

                    style={{ borderColor: "#8AC642", color: "#8AC642" }}
                    onClick={() => handleEdit(profile)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleDelete(profile._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>

            </Grid>
          ))}
        </Grid>

        {/* Add Button */}
        <Grid container justifyContent="center" style={{ marginTop: "20px" }}>
          <Card
            style={{
              ...styles.card,
              justifyContent: "center",
              borderStyle: "dashed",
              borderColor: "#8AC642",
              borderWidth: 1.5,
              cursor: "pointer",
            }}
            onClick={handleAdd}
          >
            <img height={40} src={addMember} alt="Add Member" style={{ marginRight: '16px' }} />
            <h4 style={{ color: "#8AC642", marginTop: "10px" }}>
              Add New Member
            </h4>
          </Card>
        </Grid>
      </Box>

      {/* Family Add/Edit Drawer */}
      <FamilyAdd
        familyAdd={drawerOpen}
        mode={mode}
        editData={editData}
        onfamilyAddClose={handleFamilyAddClose}
        onSuccess={handleFamilyAddSuccess}
      />
    </Drawer>
  );
};

const styles = {
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    padding: "15px",
    paddingBottom: "16px",
    borderRadius: "12px",
    width: "50%",
    backgroundColor: "#1c1c1c",
  },
  profileImageContainer: { marginRight: "5px" },
  profileImage: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  initialCircle: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#87C63F",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontSize: "24px",
    fontWeight: "bold",
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    flex: 1,
  },
  relationship: {
    backgroundColor: "#304715",
    color: "#fff",
    padding: "2px 8px",
    borderRadius: "5px",
    marginTop: "4px",
    fontSize: "12px",
    display: "inline-block",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    marginTop: "6px",
  },
  buttonRow: {
    display: "flex",
    gap: "12px",
    marginTop: "12px",
  },
};

export default Family;