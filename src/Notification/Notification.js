import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import API_URL from "../ServiceModule/Service";
import Navbar from "../component/Navbar";
import Footer from "../Landing/component/Footer";
import SessionExpiredModal from "../utils/sessionExpireModal";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}notification/getAll`, {
        params: { status: "active" },
      });
      const deletedIds = JSON.parse(localStorage.getItem("deletedNotifications") || "[]");
      const validNotifications = response.data.data.filter(n => !deletedIds.includes(n._id));
      setNotifications(validNotifications);
    } catch (err) {
      if (err.response?.status === 401) {
        setShowSessionExpired(true);
      }
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleSessionExpiredOk = () => {
    setShowSessionExpired(false);
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const handleReadMore = (notification) => {
    setSelectedNotification(notification);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedNotification(null);
    setShowDialog(false);
  };

  const handleDeleteAllClick = () => {
    setConfirmDeleteAll(true);
  };

  const handleConfirmDeleteAll = () => {
    const allIds = notifications.map(n => n._id);
    localStorage.setItem("deletedNotifications", JSON.stringify(allIds));
    setNotifications([]);
    setConfirmDeleteAll(false);
  };

  const truncateText = (text, wordLimit = 40) => {
    const words = text.split(" ");
    return words.length <= wordLimit
      ? text
      : words.slice(0, wordLimit).join(" ") + "...";
  };

  return (
    <Box style={{ backgroundColor: "#121212", minHeight: "100vh", color: "#fff", display: "flex",
      flexDirection: "column", }}>
      <Navbar />
      <Box sx={{ flexGrow: 1 }}>
      <SessionExpiredModal visible={showSessionExpired} onConfirm={handleSessionExpiredOk} />

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Typography  fontWeight={700} color={"#8AC642"} sx={{ fontSize: "2.5rem" }}>
            Notifications
          </Typography>
          {notifications.length > 0 && (
            <Button
              variant="contained"
              onClick={handleDeleteAllClick}
              sx={{
                 backgroundColor: "transparent",
  color: "#8AC642",
  border: "1.5px solid #8AC642",
  borderRadius: "20px",
  padding: "8px 16px",
  fontSize: "1.4rem",
  fontWeight: "600",
  minWidth: "100px",
  cursor: "pointer",
  userSelect: "none",
  transition: "all 0.25s ease",
  "&:hover": {
    backgroundColor: "#8AC642",
    color: "#000",
  },
              }}
            >
              Clear All
            </Button>
          )}
        </Grid>

        {loading ? (
          <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "40vh" }}>
            <CircularProgress style={{ color: "#8BC642" }} />
          </Grid>
        ) : notifications.length === 0 ? (
          <Typography align="center" sx={{ mt: 10, fontSize: "1.6rem" }}>
            You have no notifications.
          </Typography>
        ) : (
          <Grid container direction="column" spacing={2}>
            {notifications.map((notification) => (
              <Grid item key={notification._id}>
                <Box
                  sx={{
                    backgroundColor: "#212121",
                    padding: "1.5rem",
                    color: "#ffffff",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    fontSize: "1.5rem",
                    lineHeight: "1.6",
                  }}
                >
                  <Typography variant="h6" fontWeight="600" sx={{ fontSize: "1.5rem" }}>
                    {notification.title}
                  </Typography>
                  <Typography sx={{ fontSize: "1.5rem", color: "#cccccc" }}>
                    {truncateText(notification.description)}
                    {notification.description.split(" ").length > 20 && (
                      <span
                        onClick={() => handleReadMore(notification)}
                        style={{
                          color: "#8BC642",
                          cursor: "pointer",
                          fontWeight: 500,
                          marginLeft: "10px",
                        }}
                      >
                        Read more
                      </span>
                    )}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
</Box>
      <Footer />

      {/* Read More Modal */}
      <Dialog
        open={showDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            backgroundColor: "#212121",
            color: "#fff",
            maxWidth: "600px",
          },
        }}
      >
        <DialogTitle sx={{ color: "#8BC642", fontSize: "2rem", fontWeight: "700" }}>
          {selectedNotification?.title}
        </DialogTitle>
        <DialogContent dividers sx={{ whiteSpace: "pre-line", fontSize: "1.5rem" }}>
          {selectedNotification?.description}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: "#8BC642", fontSize: "1.5rem" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete All Confirmation */}
      <Dialog
        open={confirmDeleteAll}
        onClose={() => setConfirmDeleteAll(false)}
        PaperProps={{ style: { backgroundColor: "#212121", color: "#fff" } }}
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.6rem" }}>
          Delete All Notifications?
        </DialogTitle>
        <DialogContent sx={{ fontSize: "1.5rem" }}>
          This will permanently remove all your notifications. This cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteAll(false)} sx={{ color: "#8BC642", fontSize: "1.5rem" }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteAll} sx={{ color: "#8BC642", fontSize: "1.5rem" }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notification;
