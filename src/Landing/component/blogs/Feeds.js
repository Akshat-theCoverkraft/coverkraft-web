import React, { useState, useEffect, useRef } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Pagination,
  Container,
  Skeleton,
  Chip,
  Avatar,
} from "@mui/material";
import { PlayArrowRounded, CalendarTodayRounded, PersonRounded } from "@mui/icons-material";
import Navbar from "../../../component/Navbar";
import moment from "moment-timezone";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { truncateString } from "../../../utils/helpers";
import arrow from "../../../Images/Symbol.png";
import API_URL from "../../../ServiceModule/Service";
import { THEME_COLOR } from "../../../constants";

function Feeds() {
  const { type } = useParams();
  const navigate = useNavigate();

  const tabLabels = {
    blog: "Blogs",
    news: "News",
    short: "Shorts",
    video: "Videos",
  };

  const [selectedTab, setSelectedTab] = useState(type || "blog");
  const [contentData, setContentData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 9,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [textOverflowStates, setTextOverflowStates] = useState({});
  const videoRefs = useRef({});
  const textRefs = useRef({});

  useEffect(() => {
    if (!type) {
      navigate("/feed/blog", { replace: true });
    }
  }, [type, navigate]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    navigate(`/feed/${newValue}`);
    fetchData(newValue, 1);
  };

  const fetchData = async (contentType, page = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}news/getFeedByType?type=${contentType}&page=${page}&limit=${pagination?.limit}`
      );
      const { data, pagination: pageInfo } = response.data;

      setContentData(data);
      setPagination({
        currentPage: pageInfo.currentPage,
        totalPages: pageInfo.totalPages,
        totalCount: pageInfo.totalCount,
        limit: pageInfo.limit,
      });
      setHasLoadedOnce(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (type) {
      setSelectedTab(type);
      fetchData(type);
    }
  }, [type]);

  const handlePageChange = (event, newPage) => {
    fetchData(selectedTab, newPage);
  };

  const handleVideoClick = (index) => {
    Object.entries(videoRefs.current).forEach(([key, video]) => {
      if (parseInt(key) !== index && video) {
        video.pause();
      }
    });
  };

  const handleCardClick = (item) => {
    navigate(`/feed/${selectedTab}/${item?._id}`);
  };

  // Check if text overflows 2 lines
  const checkTextOverflow = (text, index) => {
    const element = textRefs.current[index];
    if (element) {
      const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
      const maxHeight = lineHeight * 2;
      return element.scrollHeight > maxHeight;
    }
    return false;
  };

  // Update text overflow states after content loads
  useEffect(() => {
    if (!isLoading && contentData.length > 0) {
      const newOverflowStates = {};
      contentData.forEach((item, index) => {
        setTimeout(() => {
          if (textRefs.current[index]) {
            const hasOverflow = checkTextOverflow(item?.description, index);
            newOverflowStates[index] = hasOverflow;
            setTextOverflowStates(prev => ({ ...prev, [index]: hasOverflow }));
          }
        }, 100);
      });
    }
  }, [contentData, isLoading]);

  const renderSkeletonCards = () => {
    return Array.from({ length: 9 }).map((_, idx) => (
      <Grid item xs={12} sm={6} md={4} key={idx}>
        <Card sx={{
          borderRadius: "24px",
          backgroundColor: "#121212)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          height: "400px"
        }}>
          <Skeleton variant="rectangular" height={220} sx={{ borderRadius: "20px 20px 0 0" }} />
          <Box sx={{ p: 3 }}>
            <Skeleton height={32} width="80%" sx={{ mb: 2 }} />
            <Skeleton height={20} width="60%" sx={{ mb: 2 }} />
            <Skeleton height={40} width="100%" />
          </Box>
        </Card>
      </Grid>
    ));
  };

  const getContentTypeColor = (type) => {
    switch (type) {
      case "blog": return "#8BC642";
      case "news": return "#8BC642";
      case "short": return "#8BC642";
      case "video": return "#8BC642";
      default: return "#8BC642";
    }
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case "short":
      case "video":
        return <PlayArrowRounded sx={{ fontSize: 16 }} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "#121212",
    }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              mb: 2,
              // background: "linear-gradient(135deg, #8BC642 0%, #A8E6CF 100%)",
              background: "#8BC642",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Blogs, News, Shorts And Videos           </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              fontWeight: 400,
              maxWidth: "600px",
              mx: "auto",
              fontSize: "1.7rem",
            }}
          >
            Stay updated with the latest stories, insights, and multimedia content
          </Typography>
        </Box>

        {/* Modern Tab Navigation */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
          <Box sx={{
            backgroundColor: "#212121",
            backdropFilter: "blur(20px)",
            borderRadius: "30px",
            padding: "8px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              TabIndicatorProps={{ style: { display: "none" } }}
              sx={{
                "& .MuiTabs-flexContainer": {
                  gap: "8px",
                },
              }}
            >
              {Object.entries(tabLabels).map(([value, label]) => (
                <Tab
                  key={value}
                  label={label}
                  value={value}
                  sx={{
                    textTransform: "none",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    backgroundColor: selectedTab === value ? "#8BC642" : "transparent",
                    borderRadius: "30px",
                    minHeight: "48px",
                    padding: "12px 24px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      backgroundColor: selectedTab === value ? "#8BC642" : "rgba(223, 218, 218, 0.1)",
                      transform: "translateY(-1px)",
                    },
                    "&.Mui-selected": {
                      color: "#fff", 
                    },
                  }}
                />
              ))}
            </Tabs>
          </Box>
        </Box>

        {/* Content Grid */}
        <Grid container spacing={4}>
          {isLoading && renderSkeletonCards()}

          {!isLoading && contentData.length === 0 && hasLoadedOnce && (
            <Grid item xs={12}>
              <Box sx={{
                textAlign: "center",
                py: 8,
                backgroundColor: "#212121",
                borderRadius: "24px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}>
                <Typography variant="h5" sx={{ color: "#FFFFFF", mb: 2 }}>
                  No Content Available
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                  Check back later for new {tabLabels[selectedTab].toLowerCase()}
                </Typography>
              </Box>
            </Grid>
          )}

          {!isLoading && contentData.map((item, index) => {
            const showReadMore = textOverflowStates[index] || false;
            const isVideo = item?.type === "short" || item?.type === "video";

            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    borderRadius: "24px",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: !showReadMore ? "pointer" : "default",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(139, 198, 66, 0.3)",
                    },
                  }}
                  onClick={() => !showReadMore && handleCardClick(item)}
                >
                  {/* Media Section */}
                  <Box sx={{ position: "relative", overflow: "hidden" }}>
                    {isVideo ? (
                      <CardMedia
                        component="video"
                        src={item?.newsImg}
                        title={item?.subtitle}
                        height="220"
                        controls
                        onPlay={() => handleVideoClick(index)}
                        ref={(el) => (videoRefs.current[index] = el)}
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          objectFit: "contain",
                          transition: "transform 0.4s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      />
                    ) : (
                      <CardMedia
                        component="img"
                        height="220"
                        image={item?.newsImg}
                        alt={item?.subtitle}
                        sx={{
                          objectFit: "cover",
                          transition: "transform 0.4s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      />
                    )}

                    {/* Content Type Badge */}
                    <Chip
                      icon={getContentTypeIcon(item?.type)}
                      label={item?.type?.toUpperCase()}
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        backgroundColor: getContentTypeColor(item?.type),
                        color: "#FFFFFF",
                        fontWeight: 600,
                        fontSize: "12px",
                        height: "28px",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                      }}
                    />
                  </Box>

                  {/* Content Section */}
                  <CardContent sx={{
                    p: 3,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2
                  }}>
                    {/* Title */}
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#FFFFFF",
                        fontWeight: 600,
                        fontSize: "18px",
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item?.subtitle}
                    </Typography>

                    {/* Meta Information */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 20, height: 20, bgcolor: "#8BC642" }}>
                          <PersonRounded sx={{ fontSize: 12 }} />
                        </Avatar>
                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "13px" }}>
                          {item?.createdBy || "Super Admin"}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarTodayRounded sx={{ fontSize: 16, color: "#8BC642" }} />
                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "13px" }}>
                          {moment(item?.createdAt).format("MMM DD, YYYY")}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Description */}
                    <Typography
                      ref={(el) => (textRefs.current[index] = el)}
                      variant="body2"
                      sx={{
                        color: "rgba(255, 255, 255, 0.8)",
                        lineHeight: 1.1,
                        fontSize: "14px",
                        flex: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item?.description}
                    </Typography>

                    {/* Read More Button */}
                    {showReadMore && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/feed/${selectedTab}/${item?._id}`);
                        }}
                        variant="text"
                        sx={{
                          color: "#8BC642",
                          fontSize: "14px",
                          fontWeight: 600,
                          textTransform: "none",
                          alignSelf: "flex-start",
                          p: 0,
                          minWidth: "auto",
                          "&:hover": {
                            backgroundColor: "rgba(139, 198, 66, 0.1)",
                            transform: "translateX(4px)",
                          },
                          transition: "all 0.3s ease",
                        }}
                        endIcon={
                          <img
                            src={arrow}
                            alt="arrow-right"
                            style={{ height: "14px", filter: "brightness(0) saturate(100%) invert(71%) sepia(45%) saturate(434%) hue-rotate(56deg) brightness(95%) contrast(89%)" }}
                          />
                        }
                      >
                        Read More
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Modern Pagination */}
        {!isLoading && pagination?.totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <Box sx={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              borderRadius: "16px",
              padding: "12px 16px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}>
              <Pagination
                count={pagination?.totalPages}
                page={pagination?.currentPage}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'transparent',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'rgba(139, 198, 66, 0.1)',
                      borderColor: '#8BC642',
                      color: '#8BC642',
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#8BC642',
                      color: '#FFFFFF',
                      borderColor: '#8BC642',
                      '&:hover': {
                        backgroundColor: '#7BA538',
                      },
                    },
                  },
                }}
              />
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Feeds;