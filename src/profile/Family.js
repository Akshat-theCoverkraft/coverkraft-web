// Inside Family.jsx — FULL UPDATED VERSION

import React, { useState, useEffect } from "react";
import { Drawer, Box, Button, Tooltip } from "@mui/material";
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
import { motion, AnimatePresence } from 'framer-motion';

const Family = ({ family, onfamilyclose }) => {
  const [familyData, setFamilyData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [editData, setEditData] = useState(null);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(`${API_URL}family/delete`, { _id: deleteId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Member deleted successfully",{
        autoClose: 2000,
        closeButton: true,          // show the ❌ button
        closeOnClick: true,                // allow click on toast to close it
        draggable: true,                   // allow drag to dismiss
        pauseOnHover: true,                // (optional, default: true)
      });
      fetchFamilyDetails();
    } catch (error) {
      toast.error("Failed to delete member",{
        autoClose: 2000,
        closeButton: true,          // show the ❌ button
        closeOnClick: true,                // allow click on toast to close it
        draggable: true,                   // allow drag to dismiss
        pauseOnHover: true,                // (optional, default: true)
      });
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const handleFamilyAddClose = () => setDrawerOpen(false);
  const handleFamilyAddSuccess = () => {
    fetchFamilyDetails();
    setDrawerOpen(false);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
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
      <ToastContainer position="top-left" style={{ zIndex: 99999 }}closeButton={true}          // show the ❌ button
  closeOnClick                // allow click on toast to close it
  draggable                   // allow drag to dismiss
  pauseOnHover                // (optional, default: true)
  autoClose={2000}  />

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
        <Grid container spacing={2} style={{ padding: "0 15px" }}>
          {familyData.map((profile, index) => (
            <Grid item xs={12} key={index}>
              <Card style={styles.memberCard}>
                {/* Profile Section */}
                <div style={styles.profileSection}>
                  <div style={styles.profileImageWrapper}>
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
                  <div style={styles.profileInfo}>
                    <Tooltip
  title={profile.fullName || ""}
  arrow
  placement="top"
  componentsProps={{
    tooltip: {
      sx: {
        fontSize: "1.3rem",
        padding: "8px 12px",
      },
    },
  }}
>
  <Typography variant="h6" style={styles.memberName}>
    {capitalizeFirstLetter(truncateText(profile.fullName, 12))}
  </Typography>
</Tooltip>

                    <Typography variant="body2" style={styles.relationship}>
                      {profile.familyMember}
                    </Typography>
                  </div>
                </div>

                {/* Contact Details Section */}
                <div style={styles.contactSection}>
                  <div style={styles.contactRow}>
                    <EmailIcon fontSize="small" style={styles.icon} />
                    <Tooltip title={profile?.email || ""} arrow placement="top" componentsProps={{
    tooltip: {
      sx: {
        fontSize: "1.3rem",
        padding: "8px 12px",
      },
    },
  }}>
                      <span style={styles.contactText}>
                        {truncateText(profile?.email, 20)}
                      </span>
                    </Tooltip>
                  </div>
                  <div style={styles.contactRow}>
                    <CallIcon fontSize="small" style={styles.icon} />
                    <Tooltip title={profile?.mobile || ""} arrow placement="top" componentsProps={{
    tooltip: {
      sx: {
        fontSize: "1.3rem",
        padding: "8px 12px",
      },
    },
  }}>
                      <span style={styles.contactText}>
                        {truncateText(profile?.mobile, 15)}
                      </span>
                    </Tooltip>
                  </div>
                </div>

                {/* Action Buttons Section */}
                <div style={styles.actionSection}>
                  <Button
                    variant="outlined"
                    size="small"
                    style={styles.editButton}
                    onClick={() => handleEdit(profile)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    style={styles.deleteButton}
                    onClick={() => handleDeleteClick(profile._id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Add Button */}
        <Grid container justifyContent="center" style={{ marginTop: "20px", padding: "0 15px" }}>
          <Grid item xs={12}>
            <Card style={styles.addMemberCard} onClick={handleAdd}>
              <img height={40} src={addMember} alt="Add Member" style={styles.addIcon} />
              <Typography variant="h6" style={styles.addText}>
                Add New Member
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Add/Edit Member Drawer */}
      <FamilyAdd
        familyAdd={drawerOpen}
        mode={mode}
        editData={editData}
        onfamilyAddClose={handleFamilyAddClose}
        onSuccess={handleFamilyAddSuccess}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={styles.overlay}>
          <div style={styles.backdrop} onClick={() => setShowDeleteModal(false)} />
          <AnimatePresence>
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={styles.modal}
            >
              <h2 style={styles.title}>Delete Member</h2>
              <p style={styles.message}>Are you absolutely sure you want to delete this member? This action cannot be undone.</p>
              <div style={styles.actions}>
                <button style={styles.cancelButton} onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button style={styles.deleteButton} onClick={handleConfirmDelete}>
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </Drawer>
  );
};

const styles = {
  memberCard: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "16px",
    borderRadius: "12px",
    backgroundColor: "#1c1c1c",
    marginBottom: "12px",
    border: "1px solid #333",
    transition: "all 0.3s ease",
    cursor: "default",
    '&:hover': {
      borderColor: "#8AC642",
      boxShadow: "0 4px 12px rgba(138, 198, 66, 0.1)",
    }
  },
  profileSection: {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
  },
  profileImageWrapper: {
    marginRight: "12px",
    flexShrink: 0,
  },
  profileImage: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #333",
  },
  initialCircle: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#87C63F",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontSize: "20px",
    fontWeight: "bold",
    border: "2px solid #333",
  },
  profileInfo: {
    flex: 1,
    minWidth: 0, // This allows text truncation to work
  },
  memberName: {
    fontWeight: "600",
    color: "#f2f2f2",
    fontSize: "16px",
    lineHeight: 1.2,
    margin: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  relationship: {
    backgroundColor: "#304715",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "6px",
    marginTop: "6px",
    fontSize: "11px",
    fontWeight: "500",
    display: "inline-block",
    textTransform: "capitalize",
  },
  contactSection: {
    marginBottom: "16px",
  },
  contactRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
    minHeight: "24px",
  },
  icon: {
    color: "#8AC642",
    marginRight: "8px",
    flexShrink: 0,
  },
  contactText: {
    color: "#e0e0e0",
    fontSize: "14px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    flex: 1,
    minWidth: 0,
  },
  actionSection: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    paddingTop: "8px",
    borderTop: "1px solid #333",
  },
  editButton: {
    fontSize: "14px",
    borderColor: "#8AC642",
    color: "#8AC642",
    fontWeight: "500",
    textTransform: "none",
    minWidth: "70px",
    height: "36px",
    '&:hover': {
      borderColor: "#7AB536",
      backgroundColor: "rgba(138, 198, 66, 0.1)",
    }
  },
  deleteButton: {
    fontSize: "14px",
    borderColor: "#f44336",
    color: "#f44336",
    fontWeight: "500",
    textTransform: "none",
    minWidth: "70px",
    height: "36px",
    '&:hover': {
      borderColor: "#d32f2f",
      backgroundColor: "rgba(244, 67, 54, 0.1)",
    }
  },
  addMemberCard: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    borderRadius: "12px",
    backgroundColor: "transparent",
    border: "2px dashed #8AC642",
    cursor: "pointer",
    transition: "all 0.3s ease",
    '&:hover': {
      backgroundColor: "rgba(138, 198, 66, 0.05)",
      borderColor: "#7AB536",
    }
  },
  addIcon: {
    marginRight: "12px",
    opacity: 0.8,
  },
  addText: {
    color: "#8AC642",
    fontWeight: "600",
    margin: 0,
  },
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(2px)',
  },
  modal: {
    position: 'relative',
    backgroundColor: '#121212',
    borderRadius: '12px',
    padding: '24px',
    width: '100%',
    maxWidth: '420px',
    zIndex: 1001,
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  },
  title: {
    margin: 0,
    fontSize: '1.6rem',
    fontWeight: '600',
    color: '#f2f2f2',
  },
  message: {
    marginTop: '12px',
    fontSize: '1.4rem',
    color: '#f2f2f2',
  },
  actions: {
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  cancelButton: {
    padding: '10px 16px',
    border: '1px solid #ccc',
    backgroundColor: '#121212',
    color: '#f2f2f2',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 500,
  },
  deleteButton: {
    fontSize: '10px',
    padding: '10px 16px',
    backgroundColor: '#8bc642',
    color: '#121212',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
  },
};

export default Family;