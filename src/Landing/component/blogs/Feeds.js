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
  Button as MuiButton,
  Pagination,
  CircularProgress,
  Skeleton,
} from "@mui/material";
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
    limit: 10,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const videoRefs = useRef({});

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

  const renderSkeletonCards = () => {
    return Array.from({ length: 6 }).map((_, idx) => (
      <Grid item xs={12} sm={6} md={4} key={idx}>
        <Card sx={{ height: "450px", borderRadius: "16px", backgroundColor: THEME_COLOR.FADE_BACKGROUND }}>
          <Skeleton variant="rectangular" height={200} />
          <Box sx={{ p: 2 }}>
            <Skeleton height={30} width="80%" />
            <Skeleton height={20} width="60%" sx={{ mt: 1 }} />
            <Skeleton height={60} width="100%" sx={{ mt: 1 }} />
          </Box>
        </Card>
      </Grid>
    ));
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Navbar />

      <Tabs
        sx={{
          pt: 3,
          backgroundColor: "#121212",
          borderRadius: "40px",
          padding: "6px",
          width: "100%",
          maxWidth: "600px",
          mx: "auto",
          boxShadow: "0 0 10px rgba(139, 198, 66, 0.15)",
          minHeight: "unset",
        }}
        value={selectedTab}
        onChange={handleTabChange}
        TabIndicatorProps={{ style: { display: "none" } }}
        centered
      >
        {Object.entries(tabLabels).map(([value, label]) => (
          <Tab
            key={value}
            label={label}
            value={value}
            sx={{
              textTransform: "uppercase",
              fontSize: "14px",
              fontWeight: 500,
              color: selectedTab === value ? "#121212" : "#E0E0E0",
              backgroundColor: selectedTab === value ? "#8BC642" : "transparent",
              borderRadius: "30px",
              minHeight: "unset",
              padding: "8px 24px",
              transition: "all 0.3s ease",
              border: "2px solid #8BC642",
              marginX: "4px",
              "&:hover": {
                backgroundColor: selectedTab === value ? "#8BC642" : "#2a2a2a",
              },
            }}
          />
        ))}
      </Tabs>

      <Box sx={{ p: 2, pt: 5, width: "80%" }} className="container">
        <Grid container spacing={4} justifyContent="center">
          {isLoading && renderSkeletonCards()}

          {!isLoading && contentData.length === 0 && hasLoadedOnce && (
            <Box sx={{ width: "100%", textAlign: "center", mt: 4 }}>
              <Typography variant="h6" sx={{ color: "#fff" }}>
                No Data Found
              </Typography>
            </Box>
          )}

          {!isLoading && contentData.map((item, index) => {
            const showReadMore = item?.description?.length > 100;
            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    borderRadius: "16px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
                    },
                    overflow: "hidden",
                    backgroundColor: THEME_COLOR.FADE_BACKGROUND,
                    height: "450px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {item?.type === "short" || item?.type === "video" ? (
                    <CardMedia
                      component="video"
                      src={item?.newsImg}
                      title={item?.subtitle}
                      height="200"
                      controls
                      onPlay={() => handleVideoClick(index)}
                      ref={(el) => (videoRefs.current[index] = el)}
                      sx={{
                        objectFit: "cover",
                        borderBottom: "1px solid #ddd",
                      }}
                    />
                  ) : (
                    <CardMedia
                      component="img"
                      height="200"
                      image={item?.newsImg}
                      alt={item?.newsImg}
                      sx={{
                        objectFit: "cover",
                        borderBottom: "1px solid " + THEME_COLOR.FADE_BACKGROUND,
                      }}
                    />
                  )}
                  <CardContent
                    sx={{
                      padding: "16px",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                        color: THEME_COLOR.SECONDARY_TEXT,
                      }}
                    >
                      {truncateString(item?.subtitle, 50)}
                    </Typography>

                    <Typography sx={{ mb: 1, color: THEME_COLOR.SECONDARY_TEXT }}>
                      <i className="fas fa-user" style={{ color: "rgb(138, 198, 66)" }} /> {item?.createdBy || "Super Admin"} &nbsp;&nbsp;
                      <i className="fas fa-calendar-alt" style={{ color: "rgb(138, 198, 66)" }} /> {moment(item?.createdAt).format("MMM DD, YYYY")}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        flexGrow: 1,
                        mb: showReadMore ? 1 : 0,
                        color: THEME_COLOR.SECONDARY_TEXT,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {item?.description}
                    </Typography>

                    {showReadMore && (
                      <MuiButton
                        onClick={() => navigate(`/feed/${selectedTab}/${item?._id}`)}
                        variant="text"
                        sx={{ color: THEME_COLOR.SECONDARY_TEXT, alignSelf: "flex-start" }}
                      >
                        Read More <img src={arrow} className="ml-2" alt="arrow-right" style={{ height: "16px", marginLeft: "8px" }} />
                      </MuiButton>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {!isLoading && pagination?.totalPages > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={pagination?.totalPages}
              page={pagination?.currentPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              color="secondary"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Feeds;
