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
  IconButton,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Navbar from "../component/Navbar";
import Footer from "../Landing/component/Footer";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getBYIDUsers } from "../store/action/action";
import API_URL from "../ServiceModule/Service";
import { THEME_COLOR } from "../constants";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [open, setOpen] = useState(false);
  const [sentNotificationsCount, setSentNotificationsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}notification/getAll`, {
        params: { status: "active" },
      });

      const allNotifications = response?.data?.data || [];
      console.log("Fetched notifications:", allNotifications);
      setNotifications(allNotifications);

      const sentCount = allNotifications.filter(
        (n) => n.notificationStatus === "sent"
      ).length;
      setSentNotificationsCount(sentCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to fetch notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsSeen = async (id) => {
    try {
      await axios.post(`${API_URL}notification/update`, {
        _id: id,
        notificationStatus: "seen",
      });
      console.log(`Marked notification ${id} as seen.`);
    } catch (error) {
      console.error("Error marking as seen:", error);
    }
  };

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(" ");
    if (words.length <= wordLimit) return description;
    return words.slice(0, wordLimit).join(" ") + "...";
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

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${API_URL}notification/delete`, {
        data: { _id: id },
      });

      const updatedList = notifications.filter((n) => n._id !== id);
      setNotifications(updatedList);

      const updatedSentCount = updatedList.filter(
        (n) => n.notificationStatus === "sent"
      ).length;
      setSentNotificationsCount(updatedSentCount);

      toast.success("Notification deleted.");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification.");
    }
  };


  const deleteAllNotifications = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("User not found.");
      return;
    }

    try {
      await axios.delete(`${API_URL}notification/deleteAllByUser`, {
        data: { userId },
      });

      setNotifications([]);
      setSentNotificationsCount(0);
      toast.success("All notifications deleted.");
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      toast.error("Failed to delete all notifications.");
    }
  };


  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#121212",
        }}
      >
        <CircularProgress style={{ color: "#E0E0E0" }} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#121212", color: "#E0E0E0", minHeight: "100vh" }}>
      <Navbar />
      <div className="m-5 p-5">
        <div
          style={{
            overflowY: "auto",
            width: "80vw",
            margin: "auto",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <Typography sx={{ fontSize: "17px", fontWeight: "500", color: "#E0E0E0" }}>
              {sentNotificationsCount} new notification
              {sentNotificationsCount !== 1 ? "s" : ""}
            </Typography>
            <IconButton onClick={deleteAllNotifications} style={{ color: "#FF5252" }}>
              <CloseIcon />
            </IconButton>
          </div>

          {notifications?.map((notification, index) => (
            <Card
              key={index}
              className="rounded mb-4"
              sx={{
                mx: 2,
                my: 3,
                backgroundColor: "#1C1C1C",
                boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
              }}
            >
              <Grid
                container
                spacing={3}
                style={{ backgroundColor: "#1C1C1C", minWidth: "80vw" }}
                className="px-5 py-3"
              >
                <Grid item xs={10}>
                  <p style={{ fontSize: "17px", fontWeight: "700", color: "#E0E0E0" }}>
                    {notification.title}
                  </p>
                  <p style={{ color: "#A0A0A0", fontSize: "16px", fontWeight: "400" }}>
                    {truncateDescription(notification.description, 20)}{" "}
                    {notification?.description?.split(" ").length > 20 && (
                      <span
                        onClick={() => handleReadMore(notification)}
                        style={{ color: THEME_COLOR.GREEN, cursor: "pointer" }}
                      >
                        Read more
                      </span>
                    )}
                  </p>
                </Grid>
                <Grid
                  item
                  xs={2}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                  }}
                >
                  <p style={{ color: "white", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                    {sentNotificationsCount} day{sentNotificationsCount > 1 ? "s" : ""} ago
                  </p>
                  <Button
                    onClick={() => deleteNotification(notification._id)}
                    style={{ color: "#FF5252", fontWeight: "bold", fontSize: "13px" }}
                  >
                    Delete
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
        <DialogTitle>{selectedNotification?.title}</DialogTitle>
        <DialogContent>
          <Typography>{selectedNotification?.description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" style={{ color: "#6200EE" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Notification;
