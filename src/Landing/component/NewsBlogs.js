import { useEffect, useState, useRef } from "react";
import {
  Card,
  Box,
  Grid,
  Chip,
  Typography,
  Skeleton,
  Button,
  Tooltip,
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

// ✅ Helper Functions
const isYouTubeUrl = (url) =>
  typeof url === "string" &&
  (url.includes("youtube.com") || url.includes("youtu.be"));

const getYouTubeEmbedUrl = (url) => {
  try {
    if (url.includes("youtube.com")) {
      const videoId = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("youtu.be")) {
      const videoId = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch (err) {
    console.error("Invalid YouTube URL", err);
  }
  return null;
};

const isVideoFile = (url) =>
  /\.(mp4|mov|avi|mkv|webm|ogg)$/i.test(url || "");

const BlogSection = () => {
  const [latestPosts, setLatestPosts] = useState({});
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const navigate = useNavigate();
  const videoRefs = useRef({});

  const registerVideo = (el, id) => {
    if (el && id) {
      videoRefs.current[id] = el;
    }
  };

  const handleSessionExpiredOk = () => {
    setShowSessionExpired(false);
    navigate("/login");
    localStorage.clear();
    sessionStorage.clear();
  };

  const getUrl = (post) => {
    if (post.videoUrl) {
      return post.videoUrl.startsWith("http")
        ? post.videoUrl
        : `${API_URL}${post.videoUrl}`;
    }
    return post.newsImg?.startsWith("http")
      ? post.newsImg
      : `${API_URL}${post.newsImg}`;
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
        setFeaturedVideo(activeFeatured[0,1,2,3] || null);

        setLatestPosts(latestByType);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 401) {
          setShowSessionExpired(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Pause all videos on scroll
    const pauseAllVideos = () => {
      Object.values(videoRefs.current).forEach((video) => {
        if (video && !video.paused) video.pause();
      });
    };

    window.addEventListener("scroll", pauseAllVideos);
    return () => window.removeEventListener("scroll", pauseAllVideos);
  }, []);

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
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    "&:hover": {
      backgroundColor: "#8AC642",
      color: "#000",
    },
  }));

  const renderMedia = (source, id) => {
    if (!source) return null;

    if (isYouTubeUrl(source)) {
      return (
        <iframe
          src={getYouTubeEmbedUrl(source)}
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "20px",
            backgroundColor: "#000",
          }}
        />
      );
    } else if (isVideoFile(source)) {
      return (
        <video
          ref={(el) => registerVideo(el, id)}
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
          onPlay={() => {
            Object.entries(videoRefs.current).forEach(([vidId, video]) => {
              if (vidId !== id && video && !video.paused) {
                video.pause();
              }
            });
          }}
        >
          <source src={source} type="video/mp4" />
        </video>
      );
    } else {
      return (
        <img
          src={source}
          alt="content"
          style={{ width: "100%", height: "100%", borderRadius: "20px", objectFit: "cover" }}
        />
      );
    }
  };

  const renderCard = (post, type) => {
    if (loading) {
      return <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: "20px" }} />;
    }
    if (!post) {
      return (
        <Card sx={{ bgcolor: "#212121", borderRadius: "20px", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
          <Typography>No {type} available.</Typography>
        </Card>
      );
    }

    const mediaSource = post.video || post.youTubeLink || getUrl(post);

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
        <Chip
          icon={<TravelExploreIcon />}
          label={post.type ? post.type.charAt(0).toUpperCase() + post.type.slice(1) : "Content"}
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
        {(type === "blog" || type === "news" || type === "short" || type === "featureds" || type ===  "video" ) && post.subtitle && (
          <Tooltip title={post.subtitle} arrow>
            <Box
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                maxWidth: "50%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                bgcolor: "rgba(0,0,0,0.6)",
                px: 1.5,
                py: 0.5,
                borderRadius: "12px",
                color: "#fff",
                fontSize: "1.2rem",
                fontWeight: 500,
                zIndex: 2,
              }}
            >
              {post.subtitle.length > 20 ? post.subtitle.slice(0, 20) + "..." : post.subtitle}
            </Box>
          </Tooltip>
        )}

        {renderMedia(mediaSource, post._id)}
        {(type === "blog" || type === "news" || type === "short" || type === "featured" || type ===  "video") && (
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
            <Typography
              variant="caption"
              display="block"
              sx={{ mb: 1, fontSize: "1.3rem" }}
            >
              {moment(post.createdAt).format("MMM DD, YYYY")}
            </Typography>
            <Button
              size="small"
              sx={{
                color: "#8AC642",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "1.2rem",
                "&:hover": { textDecoration: "underline" },
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
      }}
    >
      <SessionExpiredModal visible={showSessionExpired} onConfirm={handleSessionExpiredOk} />
      <Typography variant="h3" sx={headingStyle}>
        Blogs And News
      </Typography>

      <Grid container spacing={2} mt={3}>
        <Grid item xs={12} md={5}>
          <Box sx={{ height: "500px" }}>
            {renderCard(latestPosts.shorts, "short")}
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ height: "500px", display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ height: "240px" }}>{renderCard(latestPosts.news, "news")}</Box>
            <Box sx={{ height: "240px" }}>{renderCard(latestPosts.blog, "blog")}</Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ height: "500px", display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ height: "240px" }}>{renderCard(latestPosts.videos?.[0], "video")}</Box>
            <Box sx={{ height: "240px" }}>
              {renderMedia(featuredVideo?.video || featuredVideo?.youTubeLink, "featured")}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box textAlign="center" mt={4}>
        <StyledButton onClick={() => navigate("/feed/blog")}>VIEW ALL</StyledButton>
      </Box>
      <InsuranceCard />
    </Box>
  );
};

export default BlogSection;
