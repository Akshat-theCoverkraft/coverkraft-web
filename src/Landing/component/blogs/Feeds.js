import React, { useState, useEffect, useRef } from "react";
import {
  Tabs, Tab, Box, Typography, Grid, Card, CardContent,
  CardMedia, Button, Pagination, Container, Skeleton,
  Avatar
} from "@mui/material";
import {
  CalendarTodayRounded, PersonRounded
} from "@mui/icons-material";
import Navbar from "../../../component/Navbar";
import moment from "moment-timezone";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { capitalizeFirstLetter } from "../../../utils/helpers";
import arrow from "../../../Images/Symbol.png";
import API_URL from "../../../ServiceModule/Service";
import Footer from "../Footer";
import SessionExpiredModal from "../../../utils/sessionExpireModal";

const TABS = {
  blog: "Blogs",
  news: "News",
  short: "Shorts",
  video: "Videos",
};

// ✅ Check if link is YouTube
const isYouTubeLink = (url) => {
  return (
    typeof url === "string" &&
    (url.includes("youtube.com") || url.includes("youtu.be"))
  );
};

// ✅ Generate embed link for YouTube (Normal, Shorts, youtu.be)
const getYouTubeEmbedUrl = (url) => {
  try {
    if (!url) return null;
    url = url.trim();

    if (url.includes("youtube.com/embed/")) return url;

    if (url.includes("youtube.com")) {
      const urlObj = new URL(url);

      if (urlObj.pathname.startsWith("/shorts/")) {
        const videoId = urlObj.pathname.split("/shorts/")[1]?.split("?")[0];
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      }

      const videoId = urlObj.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    if (url.includes("youtu.be")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch (err) {
    console.error("Invalid YouTube URL", url, err);
  }
  return null;
};

// ✅ Detect media type
const getMediaType = (url) => {
  if (!url || typeof url !== "string") return "image";
  if (isYouTubeLink(url)) return "youtube";

  const videoExtensions = [".mp4", ".mov", ".webm", ".ogg"];
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

  const lowerUrl = url.toLowerCase();
  if (videoExtensions.some(ext => lowerUrl.endsWith(ext))) return "video";
  if (imageExtensions.some(ext => lowerUrl.endsWith(ext))) return "image";

  return "image";
};

const Feeds = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState(type || "blog");
  const [contentData, setContentData] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCount: 0, limit: 9 });
  const [isLoading, setIsLoading] = useState(false);
  const [textOverflowStates, setTextOverflowStates] = useState({});
  const videoRefs = useRef({});
  const youtubePlayers = useRef({});
  const textRefs = useRef({});
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Load YouTube Iframe API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      console.log("YouTube API Loaded");
    };
  }, []);

  const fetchContent = async (tab, page = 1) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}news/getFeedByType`, {
        params: { type: tab, page, limit: pagination.limit }
      });
      setContentData(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error('Error fetching options:', error);
      if (error.response?.status === 401) {
        setShowSessionExpired(true);
      } else {
        setError('Failed to load options');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const tabToLoad = type || "blog";
    setSelectedTab(tabToLoad);
    fetchContent(tabToLoad);
  }, [type]);

  const handleSessionExpiredOk = () => {
    setShowSessionExpired(false);
    navigate('/login');
    localStorage.clear();
    sessionStorage.clear();
  };

  // ✅ Detect text overflow for "Read More"
  useEffect(() => {
    if (!isLoading) {
      contentData.forEach((_, index) => {
        const el = textRefs.current[index];
        if (el) {
          const isOverflowing = el.scrollHeight > parseInt(window.getComputedStyle(el).lineHeight) * 2;
          setTextOverflowStates(prev => ({ ...prev, [index]: isOverflowing }));
        }
      });
    }
  }, [contentData, isLoading]);

  // ✅ Initialize YouTube players after content load
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      contentData.forEach((item, index) => {
        const mediaUrl = item.video || item.videoUrl || item.youtubeLink || item.youTubeLink || item.newsImg || item.link;
        const mediaType = getMediaType(mediaUrl);
        if (mediaType === "youtube") {
          const playerId = `youtube-player-${index}`;
          if (!youtubePlayers.current[index] && document.getElementById(playerId)) {
            youtubePlayers.current[index] = new window.YT.Player(playerId, {
              events: {
                onStateChange: (event) => {
                  if (event.data === window.YT.PlayerState.PLAYING) {
                    // Pause all other YouTube players
                    Object.entries(youtubePlayers.current).forEach(([key, player]) => {
                      if (parseInt(key) !== index) {
                        player.pauseVideo();
                      }
                    });

                    // ✅ Pause all normal videos
                    Object.values(videoRefs.current).forEach(video => {
                      if (video && !video.paused) {
                        video.pause();
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  }, [contentData]);

  // ✅ Handle when normal video plays
  const handleVideoPlayHover = (index) => {
    // Pause all other videos
    Object.entries(videoRefs.current).forEach(([key, video]) => {
      if (parseInt(key) !== index && video) video.pause();
    });

    // Pause all YouTube videos
    Object.values(youtubePlayers.current).forEach(player => {
      if (player && player.pauseVideo) {
        player.pauseVideo();
      }
    });

    // Play this video
    const currentVideo = videoRefs.current[index];
    if (currentVideo) currentVideo.play();
  };

  const handleVideoPauseHover = (index) => {
    const currentVideo = videoRefs.current[index];
    if (currentVideo) currentVideo.pause();
  };

  const handleTabChange = (_, newValue) => {
    setSelectedTab(newValue);
    navigate(`/feed/${newValue}`);
    fetchContent(newValue, 1);
  };

  const handlePageChange = (_, page) => fetchContent(selectedTab, page);

  const handleReadMoreClick = (e, item) => {
    e.stopPropagation();
    navigate(`/feed/${selectedTab}/${item._id}`);
  };

  const renderSkeletonCards = () => Array.from({ length: 9 }).map((_, i) => (
    <Grid item xs={12} sm={6} md={4} key={i}>
      <Card sx={{ borderRadius: "24px", height: 400, backgroundColor: "#121212" }}>
        <Skeleton variant="rectangular" height={220} sx={{ borderRadius: "20px 20px 0 0" }} />
        <Box sx={{ p: 3 }}>
          <Skeleton height={32} width="80%" sx={{ mb: 2 }} />
          <Skeleton height={20} width="60%" sx={{ mb: 2 }} />
          <Skeleton height={40} width="100%" />
        </Box>
      </Card>
    </Grid>
  ));

  return (
    <>
      <Box sx={{ minHeight: "100vh", background: "#121212" }}>
        <Navbar />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <SessionExpiredModal
            visible={showSessionExpired}
            onConfirm={handleSessionExpiredOk}
          />

          <Box sx={{ display: "flex", justifyContent: "center", mb: 8 }}>
            <Box sx={{
              backgroundColor: "#121212", padding: "0.5rem", borderRadius: "50px",
              maxWidth: "1000px", width: "100%", boxShadow: "0 0 10px rgba(139, 198, 66, 0.15)",
            }}>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                TabIndicatorProps={{ style: { display: "none" } }}
                sx={{
                  "& .MuiTabs-flexContainer": {
                    flexWrap: "wrap", justifyContent: "center", gap: "0.5rem"
                  }
                }}
              >
                {Object.entries(TABS).map(([val, label]) => (
                  <Tab
                    key={val}
                    label={label}
                    value={val}
                    sx={{
                      flex: 1,
                      borderRadius: "40px", textTransform: "none", padding: "0.75rem 1.5rem",
                      backgroundColor: selectedTab === val ? "#8BC642" : "transparent",
                      color: "#fff",
                      border: "2px solid #8BC642", fontSize: "1.4rem", fontWeight: 600,
                      minWidth: "120px", transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </Tabs>
            </Box>
          </Box>

          {isLoading ? (
            <Grid container spacing={4}>{renderSkeletonCards()}</Grid>
          ) : contentData.length === 0 ? (
            <Grid item xs={12}>
              <Box sx={{
                textAlign: "center", py: 8, backgroundColor: "#212121",
                borderRadius: "24px", border: "1px solid rgba(255, 255, 255, 0.1)",
              }}>
                <Typography variant="h5" sx={{ color: "#FFFFFF", mb: 2 }}>
                  No Content Available
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "1.6rem" }}>
                  Check back later for new {TABS[selectedTab].toLowerCase()}
                </Typography>
              </Box>
            </Grid>
          ) : (
            <Grid container spacing={4}>
              {contentData.map((item, index) => {
                const mediaUrl = item.video || item.videoUrl || item.youtubeLink || item.youTubeLink || item.newsImg || item.link;
                const mediaType = getMediaType(mediaUrl);
                const showReadMore = textOverflowStates[index];

                return (
                  <Grid item xs={12} sm={6} md={4} key={item._id}>
                    <Card
                      sx={{
                        borderRadius: "24px", backgroundColor: "rgba(255,255,255,0.03)",
                        backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)",
                        height: "100%", display: "flex", flexDirection: "column", overflow: "hidden",
                        transition: "all 0.4s ease",
                        "&:hover": {
                          transform: "translateY(-8px)", boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                          border: "1px solid rgba(139, 198, 66, 0.3)",
                        },
                      }}
                    >
                      <Box sx={{ position: "relative" }}>
                        {mediaType === "youtube" ? (
                          <Box sx={{ height: 220 }}>
                            <iframe
                              id={`youtube-player-${index}`}
                              width="100%"
                              height="100%"
                              src={`${getYouTubeEmbedUrl(mediaUrl)}?enablejsapi=1&modestbranding=1&rel=0&controls=0&disablekb=1&fs=0`}
                              title="YouTube video player"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              style={{ borderRadius: "20px", objectFit: "cover" }}
                            ></iframe>
                          </Box>
                        ) : mediaType === "video" ? (
                          <CardMedia
                            component="video"
                            src={mediaUrl}
                            ref={(el) => (videoRefs.current[index] = el)}
                            onMouseEnter={() => handleVideoPlayHover(index)}
                            onMouseLeave={() => handleVideoPauseHover(index)}
                            sx={{ objectFit: "contain", height: 220, transition: "transform 0.4s ease" }}
                          />
                        ) : (
                          <CardMedia
                            component="img"
                            image={mediaUrl}
                            height="220"
                            sx={{ objectFit: "contain", transition: "transform 0.4s ease" }}
                          />
                        )}
                      </Box>

                      <CardContent sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="h6" sx={{
                          color: "#fff", fontWeight: 600, fontSize: "18px",
                          display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden"
                        }}>
                          {item.subtitle}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", marginBottom: "10px" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar sx={{ width: 20, height: 20, bgcolor: "#8BC642" }}>
                              <PersonRounded sx={{ fontSize: 12 }} />
                            </Avatar>
                            <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>
                              {capitalizeFirstLetter(item.createdBy) || "Super Admin"}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CalendarTodayRounded sx={{ fontSize: "1.8rem", color: "#8BC642" }} />
                            <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>
                              {moment(item.createdAt).format("MMM DD, YYYY")}
                            </Typography>
                          </Box>
                        </Box>

                        {item.description ? (
                          <Box
                            ref={el => textRefs.current[index] = el}
                            sx={{
                              color: "rgba(255,255,255,0.8)",
                              lineHeight: 1.4,
                              fontSize: "13px",
                              maxHeight: "3.4em",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              mb: 2
                            }}
                            dangerouslySetInnerHTML={{ __html: item.description }}
                          />
                        ) : null}

                        {item.description && showReadMore && (
                          <Button
                            onClick={(e) => handleReadMoreClick(e, item)}
                            sx={{
                              color: "#8BC642", fontSize: "12px", fontWeight: 300,
                              textTransform: "none", p: 0, minWidth: "auto", alignSelf: "flex-end",
                              cursor: "pointer",
                              "&:hover": { backgroundColor: "rgba(139,198,66,0.1)" }
                            }}
                            endIcon={
                              <img src={arrow} alt="arrow" style={{
                                height: "14px",
                                filter: "brightness(0) saturate(100%) invert(71%) sepia(45%) saturate(434%) hue-rotate(56deg) brightness(95%) contrast(89%)"
                              }} />
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
          )}

          {!isLoading && pagination.totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.currentPage}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#8BC642', borderColor: 'rgba(255,255,255,0.2)',
                    '&.Mui-selected': {
                      backgroundColor: '#8BC642', color: '#121212', fontWeight: 700
                    }
                  }
                }}
              />
            </Box>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Feeds;
