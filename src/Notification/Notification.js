import {
  Card,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@material-ui/core";
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../component/Navbar";
import Footer from "../Landing/component/Footer";
import axios from "axios";
import API_URL from "../ServiceModule/Service";
import { THEME_COLOR } from "../constants";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import SessionExpiredModal from "../utils/sessionExpireModal";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const navigate = useNavigate(); // navigation hook


  // Suppress ResizeObserver errors
useEffect(() => {
  const handleResizeObserverError = (e) => {
    if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
      e.stopImmediatePropagation();
    }
  };

  window.addEventListener('error', handleResizeObserverError);
  return () => window.removeEventListener('error', handleResizeObserverError);
}, []);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getDeletedIds = () => JSON.parse(sessionStorage.getItem("deletedNotifications")) || [];
  const saveDeletedIds = (ids) => sessionStorage.setItem("deletedNotifications", JSON.stringify(ids));

      const handleSessionExpiredOk = () => {
    setShowSessionExpired(false);
    navigate('/login');
    localStorage.clear();
  sessionStorage.clear(); 
  };

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}notification/getAll`, {
        params: { status: "active" },
      });
      const allNotifications = response?.data?.data || [];
      const deletedIds = getDeletedIds();

      // Filter out deleted notifications on frontend
      const filteredNotifications = allNotifications.filter(
        (notification) => !deletedIds.includes(notification._id)
      );

      setNotifications(filteredNotifications);
    } catch (error) {
       if (error.response?.status === 401) {
            setShowSessionExpired(true);
          }
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsSeen = async (id) => {
    try {
      await axios.post(`${API_URL}notification/update`, {
        _id: id,
        notificationStatus: "seen",
      });
    } catch (error) {
      console.error("Error marking as seen:", error);
    }
  };

  const truncateDescription = (description, wordLimit = 20) => {
    const words = description.split(" ");
    return words.length <= wordLimit
      ? description
      : words.slice(0, wordLimit).join(" ") + "...";
  };

  const handleReadMore = (notification) => {
    setSelectedNotification(notification);
    setOpen(true);
    markAsSeen(notification._id);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedNotification(null);
  };

  const handleDeleteNotification = useCallback((id) => {
    const deletedIds = getDeletedIds();
    const updatedDeletedIds = [...deletedIds, id];
    saveDeletedIds(updatedDeletedIds);

    // Remove from current state
    setNotifications(prev => prev.filter(n => n._id !== id));
  }, []);

  const deleteAllNotifications = useCallback(() => {
    const allIds = notifications.map(n => n._id);
    const existingDeletedIds = getDeletedIds();
    const updatedDeletedIds = [...new Set([...existingDeletedIds, ...allIds])];
    saveDeletedIds(updatedDeletedIds);

    // Clear current notifications
    setNotifications([]);
  }, [notifications]);

  const sentNotificationsCount = notifications.filter(n => n.notificationStatus === "sent").length;

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#121212"
      }}>
        <CircularProgress style={{ color: "#E0E0E0" }} />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div style={{
        backgroundColor: "#121212",
        color: "#E0E0E0",
        minHeight: "100vh"
      }}>
        <Navbar />
        <div style={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Typography variant="h5">
            You have no notifications at the moment.
          </Typography>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#121212", color: "#E0E0E0", minHeight: "100vh" }}>
      <Navbar />
        <SessionExpiredModal
        visible={showSessionExpired}
        onConfirm={handleSessionExpiredOk}
      />
      <div className="m-5 p-5" style={{ minHeight: "60vh" }}>
        <div style={{
          overflowY: "auto",
          width: "80vw",
          margin: "auto",
          alignItems: "center",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{
            width: "100%",
            paddingLeft: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <Typography sx={{ fontSize: "17px", fontWeight: "500", color: "#E0E0E0", marginBottom: "1rem" }}>
              {sentNotificationsCount} new notification{sentNotificationsCount !== 1 ? "s" : ""}
            </Typography>
            {notifications.length > 0 && (
              <Button
                onClick={deleteAllNotifications}
                style={{
                  backgroundColor: "#D32F2F",
                  color: "white",
                  padding: "8px",
                  fontSize: "14px",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                  minWidth: "auto"
                }}
              >
                <CloseIcon />
              </Button>
            )}
          </div>

          {notifications.map((notification, index) => (
            <Card
              key={`notification-${notification._id || index}`}
              className="rounded mb-4"
              sx={{
                mx: 2,
                my: 3,
                backgroundColor: "#1C1C1C",
                boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
                minHeight: "auto", // Prevent ResizeObserver issues
              }}
            >
              <Grid
                container
                spacing={3}
                style={{
                  backgroundColor: "#1C1C1C",
                  minWidth: "80vw",
                  minHeight: "10px" // Fixed height to prevent resize calculations
                }}
                className="px-5 py-3"
              >
                <Grid item xs={10} className="pt-5">
                  <Typography style={{ fontSize: "17px", fontWeight: "700", color: "#E0E0E0" }}>
                    {notification.title}
                  </Typography>
                  <Typography style={{ color: "#A0A0A0", fontSize: "16px", fontWeight: "400" }}>
                    {truncateDescription(notification.description)}
                    {notification?.description?.split(" ").length > 20 && (
                      <span
                        onClick={() => handleReadMore(notification)}
                        style={{ color: THEME_COLOR.GREEN, cursor: "pointer", marginLeft: "5px" }}
                      >
                        Read more
                      </span>
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={2} style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  paddingTop: "1.5rem"
                }}>
                  <Typography style={{ color: "white", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                    {sentNotificationsCount} day{sentNotificationsCount > 1 ? "s" : ""} ago
                  </Typography>
                  <Button
                    onClick={() => handleDeleteNotification(notification._id)}
                    style={{ color: "#FF5252", minWidth: "auto", padding: "8px" }}
                  >
                    <DeleteIcon />
                  </Button>
                </Grid>
              </Grid>
            </Card>
          ))}
        </div>
      </div>
      <Footer />

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { backgroundColor: "#121212", color: "#E0E0E0" } }}
      >
        <DialogTitle style={{ color: "#E0E0E0" }}>
          {selectedNotification?.title}
        </DialogTitle>
        <DialogContent dividers style={{ maxHeight: "300px", overflowY: "auto" }}>
          <Typography style={{ whiteSpace: "pre-line", lineHeight: "1.5" }}>
            {selectedNotification?.description}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{ color: "#6200EE" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Notification;