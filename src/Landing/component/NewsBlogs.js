import { useEffect, useState, useRef } from "react";
import {
  Card,
  Box,
  Grid,
  Chip,
  Typography,
  Skeleton,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import bgImage from "../../Images/bg.png";
import { headingStyle } from "../../theme/themeStyles";
import SessionExpiredModal from "../../utils/sessionExpireModal";
import API_URL from "../../ServiceModule/Service";
import InsuranceCard from "./InsuranceCard";

const typeLabels = {
  blog: "Blogs",
  news: "News",
  video: "Videos",
  short: "Shorts",
};

const BlogSection = () => {
  const [latestPosts, setLatestPosts] = useState({});
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const navigate = useNavigate(); // navigation hook
  const videoRefs = useRef({});

  const registerVideo = (el, id) => {
    if (el && id) {
      videoRefs.current[id] = el;
    }
  };

  const getVideoType = (url) => {
    if (url.endsWith(".mp4")) return "video/mp4";
    if (url.endsWith(".webm")) return "video/webm";
    if (url.endsWith(".ogg")) return "video/ogg";
    return "video/mp4";
  };

  // Helper functions (add these before your component or at the top of your file)
  const isYouTubeUrl = (url) => {
    return (
      url &&
      typeof url === "string" &&
      (url.includes("youtube.com") || url.includes("youtu.be"))
    );
  };

  const convertToEmbedUrl = (url) => {
    if (!url || typeof url !== "string") return url;
    try {
      if (url.includes("youtube")) {
        const videoId = url.split("/").pop();
        return `https://www.youtube.com/embed/${videoId}`;
      } else if (url.includes("youtube.com/watch?v=")) {
        const videoId = new URL(url).searchParams.get("v");
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } catch (err) {
      console.error("Error converting YouTube URL:", err);
    }
    return url;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, featuredRes] = await Promise.all([
          axios.get(`${API_URL}news/getAll?isActive=true`),
          fetch(`${API_URL}featureVideo/getAll`),
        ]);

        const sortedNews = (newsRes.data?.data || [])
          .filter((item) => item.status === "active")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const latestByType = {
          videos: sortedNews.filter((p) => p.type === "video").slice(0, 1),
          shorts: sortedNews.filter((p) => p.type === "short").slice(0, 1)[0],
          news: sortedNews.find((p) => p.type === "news"),
          blog: sortedNews.find((p) => p.type === "blog"),
        };

        const featuredData = await featuredRes.json();
        const activeFeatured = Array.isArray(featuredData.data)
          ? featuredData.data.filter((item) => item.status === "active")
          : [];
        setFeaturedVideo(activeFeatured[0] || null);

        setLatestPosts(latestByType);
      } catch (error) {
        console.error("Error fetching options:", error);
        if (error.response?.status === 401) {
          setShowSessionExpired(true);
        } else {
          setError("Failed to load options");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const pauseAllVideos = () => {
      Object.values(videoRefs.current).forEach((video) => {
        if (video && !video.paused) video.pause();
      });
    };

    window.addEventListener("scroll", pauseAllVideos);
    return () => window.removeEventListener("scroll", pauseAllVideos);
  }, []);

  const handleSessionExpiredOk = () => {
    setShowSessionExpired(false);
    navigate("/login");
    localStorage.clear();
    sessionStorage.clear();
  };

  const getUrl = (post) =>
    post.videoUrl
      ? post.videoUrl.startsWith("http")
        ? post.videoUrl
        : `${API_URL}${post.videoUrl}`
      : post.newsImg?.startsWith("http")
      ? post.newsImg
      : `${API_URL}${post.newsImg}`;

  const StyledButton = styled("button")(() => ({
    backgroundColor: "transparent",
    color: "#8AC642",
    minHeight: "40px",
    border: "2px solid #8AC642",
    borderRadius: "40px",
    padding: "2px 32px",
    fontSize: "1.6rem",
    fontWeight: "800",
    minWidth: "120px",
    cursor: "pointer",
    userSelect: "none",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    "&:hover": {
      backgroundColor: "#8AC642",
      color: "#000",
    },
  }));

  const renderCard = (post, type, isLarge = false) => {
    if (loading) {
      return (
        <Skeleton
          variant="rectangular"
          height="100%"
          sx={{ borderRadius: "20px" }}
        />
      );
    }
    if (!post) {
      return (
        <Card
          sx={{
            bgcolor: "#212121",
            borderRadius: "20px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
          }}
        >
          <Typography>No {type} available.</Typography>
        </Card>
      );
    }
    const getVideoSource = (post) => {
      // Handle string "null" properly and prioritize video, then youTubeLink
      const videoSource =
        post.video && post.video !== "null" ? post.video : post.youTubeLink;
      return videoSource;
    };
    const url = getUrl(post);
    const videoSource = getVideoSource(post);

    const isVideo =
      /\.(mp4|mov|avi|mkv|webm)$/i.test(url) ||
      post.video ||
      post.videoUrl ||
      post.type === "video" ||
      post.type === "featured" ||
      isYouTubeUrl(url);

    const mediaStyle = {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "20px",
    };

    return (
      <Card
        onClick={() => navigate(`/feed/${post.type}/${post._id}`)}
        sx={{
          position: "relative",
          height: "100%",
          borderRadius: "20px",
          overflow: "hidden",
          cursor: "pointer",
          transition: "transform 0.3s ease",
          "&:hover": { transform: "scale(1.02)" },
        }}
      >
        <Box sx={{ position: "relative", height: "100%" }}>
          <Chip
            icon={<TravelExploreIcon />}
            label={(() => {
              const type = post.type?.toLowerCase();
              const exceptions = {
                news: "News",
                blog: "Blogs",
                video: "Videos",
                featured: "Featureds",
                short: "Shorts",
              };
              return type
                ? exceptions[type] ||
                    type.charAt(0).toUpperCase() + type.slice(1) + "s"
                : "Featureds";
            })()}
            size="small"
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 2,
              bgcolor: "#8AC642",
              color: "#000",
              fontWeight: 600,
              fontSize: "1.1rem",
            }}
          />

          {(() => {
            // Determine which source to use for rendering
            const renderSource = isYouTubeUrl(videoSource)
              ? videoSource
              : isYouTubeUrl(url)
              ? url
              : videoSource || url;

            if (isYouTubeUrl(renderSource)) {
              // YouTube iframe
              return (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#000",
                    borderRadius: "20px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <iframe
                    src={convertToEmbedUrl(renderSource)}
                    title="YouTube video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      objectFit: "contain",
                    }}
                  />
                </div>
              );
            } else if (isVideo) {
              // Video file
              return (
                <video
                  ref={(el) => registerVideo(el, post._id)}
                  controls
                  controlsList="nodownload"
                  preload="metadata"
                  style={{
                    ...mediaStyle,
                    objectFit: "contain",
                    backgroundColor: "#000",
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onPlay={() => {
                    Object.entries(videoRefs.current).forEach(([id, video]) => {
                      if (id !== post._id && video && !video.paused) {
                        video.pause();
                      }
                    });
                  }}
                >
                  <source
                    src={renderSource}
                    type={getVideoType(renderSource)}
                  />
                  Your browser does not support the video tag.
                </video>
              );
            } else {
              // Regular image
              return (
                <img
                  src={renderSource}
                  alt={post.subtitle}
                  style={mediaStyle}
                />
              );
            }
          })()}

          {(type === "blog" || type === "news") && (
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                p: 2,
                background: "rgba(0, 0, 0, 0.65)",
                color: "#fff",
              }}
            >
              <Typography sx={{ fontSize: "1.4rem" }} fontWeight={300}>
                {post.subtitle}
              </Typography>
              <Typography
                variant="caption"
                display="block"
                sx={{ mb: 1, fontSize: "1.3rem" }}
              >
                {moment(post.createdAt).format("MMM DD, YYYY")}
              </Typography>
              <Button
                size="small"
                variant="text"
                sx={{
                  color: "#8AC642",
                  textTransform: "none",
                  fontWeight: 500,
                  padding: 0,
                  fontSize: "1.2rem",
                  minWidth: "auto",
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "underline",
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/feed/${post.type}/${post._id}`);
                }}
              >
                Read More →
              </Button>
            </Box>
          )}
          {post?.subtitle&&(type === "short" || type === "video" || type === "featured") && (
            <Box
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                maxWidth: "60%",
                bgcolor: "rgba(0,0,0,0.6)",
                px: 1.5,
                py: 0.5,
                borderRadius: "12px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={post?.subtitle} // tooltip on hover
              >
                {post?.subtitle}
              </Typography>
            </Box>
          )}
        </Box>
      </Card>
    );
  };

  return (
    <Box
      id="blog"
      sx={{
        backgroundColor: "#111",
        color: "#fff",
        px: 4,
        py: 6,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        scrollMarginTop: "100px",
      }}
    >
      <SessionExpiredModal
        visible={showSessionExpired}
        onConfirm={handleSessionExpiredOk}
      />
      <Typography variant="h3" sx={headingStyle}>
        Blogs And News
      </Typography>

      <Grid container spacing={2} mt={3}>
        <Grid item xs={12} md={5}>
          <Box sx={{ height: "500px" }}>
            {renderCard(latestPosts.shorts, "short", true)}
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              height: "500px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box sx={{ height: "240px" }}>
              {renderCard(latestPosts.news, "news")}
            </Box>
            <Box sx={{ height: "240px" }}>
              {renderCard(latestPosts.blog, "blog")}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              height: "500px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box sx={{ height: "240px" }}>
              {renderCard(latestPosts.videos?.[0], "video")}
            </Box>
            <Box
              sx={{
                height: "240px",
                position: "relative",
                borderRadius: "20px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <Chip
                icon={<TravelExploreIcon />}
                label="Featured"
                size="small"
                sx={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  zIndex: 2,
                  bgcolor: "#8AC642",
                  color: "#000",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  "&:hover": {
                    bgcolor: "#8AC642",
                    color: "#000",
                  },
                }}
                onClick={() => navigate("/feed/featured")}
              />

              {(() => {
                // Determine the video source - handle string "null" properly
                const videoSource =
                  featuredVideo?.video && featuredVideo.video !== "null"
                    ? featuredVideo.video
                    : featuredVideo?.youTubeLink;

                const hasVideoContent =
                  videoSource &&
                  videoSource.trim() !== "" &&
                  videoSource !== "null";

                if (!hasVideoContent) {
                  // No video content available
                  return (
                    <Card
                      sx={{
                        bgcolor: "#212121",
                        borderRadius: "20px",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#888",
                      }}
                    >
                      <Typography>No video available</Typography>
                    </Card>
                  );
                }

                if (isYouTubeUrl(videoSource)) {
                  // YouTube iframe
                  return (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "20px",
                        overflow: "hidden",
                        backgroundColor: "#000",
                      }}
                    >
                      <iframe
                        src={convertToEmbedUrl(videoSource)}
                        title="Featured YouTube video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "none",
                        }}
                      />
                    </div>
                  );
                } else if (
                  videoSource.toLowerCase().endsWith(".mp4") ||
                  videoSource.toLowerCase().endsWith(".mov") ||
                  videoSource.toLowerCase().endsWith(".avi") ||
                  videoSource.toLowerCase().endsWith(".webm") ||
                  videoSource.toLowerCase().endsWith(".mkv")
                ) {
                  // Video file
                  return (
                    <video
                      controls
                      controlsList="nodownload"
                      preload="metadata"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: "20px",
                        backgroundColor: "#000",
                      }}
                    >
                      <source src={videoSource} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  );
                } else {
                  // Unknown format - show as fallback
                  return (
                    <Card
                      sx={{
                        bgcolor: "#212121",
                        borderRadius: "20px",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#888",
                      }}
                    >
                      <Typography>Unsupported video format</Typography>
                    </Card>
                  );
                }
              })()}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box textAlign="center" mt={4}>
        <StyledButton onClick={() => navigate("/feed/blog")}>
          VIEW ALL
        </StyledButton>
      </Box>
      <InsuranceCard />
    </Box>
  );
};

export default BlogSection;
