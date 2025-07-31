import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Pagination
} from "@mui/material";
import axios from "axios";
import API_URL from "../ServiceModule/Service";
import Navbar from "../component/Navbar";
import Footer from "../Landing/component/Footer";
import SessionExpiredModal from "../utils/sessionExpireModal";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10
  });
  const [activeTab, setActiveTab] = useState(0); // 0=General, 1=Policy
  const [loading, setLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        status: "active",
        page: pagination.currentPage,
        limit: pagination.limit
      };
      if (activeTab === 1) params.type = "policy";

      const res = await axios.get(`${API_URL}notification/getAll`, { params });

      const { data, pagination: pageInfo } = res.data;
      const deletedIds = JSON.parse(localStorage.getItem("deletedNotifications") || "[]");

      const filteredNotifications = data.filter((n) => !deletedIds.includes(n._id));

      setNotifications(filteredNotifications);
      setPagination((prev) => ({
        ...prev,
        totalPages: pageInfo.totalPages || 1,
        currentPage: pageInfo.currentPage || 1
      }));
    } catch (err) {
      if (err.response?.status === 401) {
        setShowSessionExpired(true);
      }
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, activeTab]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleTabChange = (e, newTab) => {
    setActiveTab(newTab);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (e, page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const truncateText = (text, wordLimit = 40) => {
    const words = text.split(" ");
    return words.length <= wordLimit ? text : words.slice(0, wordLimit).join(" ") + "...";
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hr${diffInHours > 1 ? "s" : ""} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} wk${diffInWeeks > 1 ? "s" : ""} ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} mo${diffInMonths > 1 ? "s" : ""} ago`;
    return `${Math.floor(diffInDays / 365)} yr ago`;
  };

  const updateNotificationStatus = async (id) => {
    try {
      await axios.put(
        `${API_URL}notification/update-status/${id}`,
        { notificationStatus: "seen" }
      );

      // Optimistic UI update
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, notificationStatus: "seen" } : item
        )
      );
    } catch (error) {
      console.error("Failed to update notification status:", error);
    }
  };


  return (
    <Box sx={{ backgroundColor: "#121212", minHeight: "100vh", color: "#fff", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Typography fontWeight={700} color="#8AC642" sx={{ fontSize: "2.5rem", mb: 1 }}>
          Notifications
        </Typography>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="inherit"
          TabIndicatorProps={{ style: { backgroundColor: "#8AC642" } }}
          sx={{ mb: 3 }}
        >
          <Tab label="Policy" sx={{ color: "#fff", fontSize: "1.4rem" }} />
          <Tab label="General" sx={{ color: "#fff", fontSize: "1.4rem" }} />
        </Tabs>


        {/* Loader */}
        {loading ? (
          <Grid container justifyContent="center" sx={{ minHeight: "40vh" }}>
            <CircularProgress style={{ color: "#8BC642" }} />
          </Grid>
        ) : notifications.length === 0 ? (
          <Typography align="center" sx={{ mt: 6, fontSize: "1.6rem" }}>
            No notifications found.
          </Typography>
        ) : (
          <>
            {/* Scrollable List Container */}
            <Box
              sx={{
                maxHeight: "60vh", // Adjust height if needed
                overflowY: "auto",
                pr: 1, // padding for scrollbar
                mb: 2
              }}
            >
              <Grid container direction="column" spacing={2}>
                {notifications.map((n) => (
                  <Grid item key={n._id}>
                    <Box
                      sx={{
                        backgroundColor: "#212121",
                        p: 2,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                        cursor: "pointer"
                      }}
                      onClick={() => {
                        setSelectedNotification(n);
                        setShowDialog(true);

                        if (activeTab === 0 && n.notificationStatus !== "seen") {
                          updateNotificationStatus(n._id);
                        }
                      }}

                    >
                      {/* Left Image */}
                      {n.imagePath && n.imagePath !== "null" ? (
                        <img
                          src={n.imagePath}
                          alt="Notification"
                          style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "8px",
                            objectFit: "contain"
                          }}
                        />
                      ) : (
                        <img
                          src={require("../Images/CoverKraft-Logo-6.png")}
                          alt="Notification"
                          style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "8px",
                            objectFit: "contain"
                          }}
                        />
                      )}

                      {/* Right Content */}
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography fontWeight={600} sx={{ fontSize: "1.4rem", color: "#fff" }}>
                              {n.title}
                            </Typography>

                            {n.notificationStatus !== "seen" && activeTab === 0 && (
                              <Box
                                sx={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: "50%",
                                  backgroundColor: "#8BC642"
                                }}
                              />
                            )}
                          </Box>
                          <Typography sx={{ fontSize: "1rem", color: "#8BC642" }}>
                            {getTimeAgo(n.createdAt)}
                          </Typography>
                        </Box>

                        <Typography sx={{ mt: 0.5, fontSize: "1.2rem", color: "#ccc" }}>
                          {truncateText(n.description, 15)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}

              </Grid>
            </Box>

            {/* Fixed Pagination */}
            <Box display="flex" justifyContent="center" mb={2}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.currentPage}
                onChange={handlePageChange}
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#8AC642",
                    fontSize: "1.2rem"
                  }
                }}
              />
            </Box>

          </>
        )}
      </Container>

      <Footer />

      {/* Read More Modal */}
      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: "#1E1E1E",
            color: "#fff",
            width: "80%",
            height: "80%",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            padding: "16px"
          }
        }}
      >
        {/* Image Section */}
        {selectedNotification?.imagePath && selectedNotification?.imagePath !== "null" ? (
          <img
            src={selectedNotification.imagePath}
            alt="Notification"
            style={{
              width: "100%",
              height: "250px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "16px"
            }}
          />
        ) : (
          <img
            src={require("../Images/CoverKraft-Logo-6.png")}
            alt="Notification"
            style={{
              width: "100%",
              height: "250px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "16px"
            }}
          />
        )}

        {/* Title */}
        <DialogTitle
          sx={{
            color: "#8BC642",
            fontSize: "2rem",
            fontWeight: "bold",
            padding: 0,
            marginBottom: "12px"
          }}
        >
          {selectedNotification?.title}
        </DialogTitle>

        {/* Description with custom scrollbar */}
        <DialogContent
          dividers
          sx={{
            flex: 1,
            overflowY: "auto", // vertical scroll
            overflowX: "hidden", // disable horizontal scroll
            fontSize: "1.4rem",
            lineHeight: "1.8rem",
            color: "#ccc",
            whiteSpace: "pre-line",
            "&::-webkit-scrollbar": {
              width: "8px"
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#444", // Dark scrollbar
              borderRadius: "4px"
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#666"
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#1E1E1E"
            }
          }}
        >
          {selectedNotification?.description}
        </DialogContent>

        {/* Footer Actions */}
        <DialogActions sx={{ justifyContent: "flex-end", padding: "12px 0 0" }}>
          <Button
            onClick={() => setShowDialog(false)}
            sx={{
              color: "#fff",
              backgroundColor: "#8BC642",
              fontSize: "1.3rem",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#76A932"
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>



      <SessionExpiredModal visible={showSessionExpired} onConfirm={() => window.location.href = "/login"} />
    </Box>
  );
};

export default Notification;