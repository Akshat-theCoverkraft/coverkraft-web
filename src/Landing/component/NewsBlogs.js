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

// ✅ Helper Functions
const isYouTubeUrl = (url) =>
  typeof url === "string" &&
  (url.includes("youtube.com") || url.includes("youtu.be"));

const getYouTubeEmbedUrl = (url) => {
  try {
    if (!url) return null;
    url = url.trim();

    if (url.includes("youtube.com/embed/")) return url;

    let videoId = null;

    if (url.includes("youtube.com")) {
      const urlObj = new URL(url);
      if (urlObj.pathname.startsWith("/shorts/")) {
        videoId = urlObj.pathname.split("/shorts/")[1]?.split("?")[0];
      } else {
        videoId = urlObj.searchParams.get("v");
      }
    } else if (url.includes("youtu.be")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch (err) {
    console.error("Invalid YouTube URL", err);
    return null;
  }
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
  const youtubePlayers = useRef({});

  const registerVideo = (el, id) => {
    if (el && id) videoRefs.current[id] = el;
  };

  const handleSessionExpiredOk = () => {
    pauseAllVideos();
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

  // ✅ Pause ALL videos (YouTube + HTML5)
  const pauseAllVideos = () => {
    // Pause HTML5 videos
    Object.values(videoRefs.current).forEach((video) => {
      if (video && !video.paused) video.pause();
    });

    // Pause YouTube players
    Object.values(youtubePlayers.current).forEach((player) => {
      if (player?.pauseVideo) {
        try {
          player.pauseVideo();
        } catch (e) {
          console.warn("Error pausing YouTube player:", e);
        }
      }
    });
  };

  // ✅ Handle when an HTML5 video plays
  const handleVideoPlay = (playingId) => {
    // Pause other HTML5 videos
    Object.entries(videoRefs.current).forEach(([id, video]) => {
      if (id !== playingId && video && !video.paused) video.pause();
    });

    // Pause YouTube players
    Object.values(youtubePlayers.current).forEach((player) => {
      if (player?.pauseVideo) {
        try {
          player.pauseVideo();
        } catch (e) {
          console.warn("Error pausing YouTube player:", e);
        }
      }
    });
  };

  // ✅ Load YouTube API once
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
    window.onYouTubeIframeAPIReady = () =>
      console.log("YouTube API loaded for BlogSection");
  }, []);

  // ✅ Fetch Data
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
          shorts: sortedNews.find((p) => p.type === "short"),
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
        console.error("Error fetching data:", error);
        if (error.response?.status === 401) setShowSessionExpired(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Pause all videos on scroll
    window.addEventListener("scroll", pauseAllVideos);
    return () => {
      window.removeEventListener("scroll", pauseAllVideos);
      pauseAllVideos();
      youtubePlayers.current = {};
    };
  }, []);

  // ✅ Initialize YouTube players after posts load
  useEffect(() => {
    if (window.YT?.Player) {
      const ids = ["featured", latestPosts.shorts?._id, latestPosts.videos?.[0]?._id].filter(Boolean);

      ids.forEach((id) => {
        const iframe = document.getElementById(`youtube-${id}`);
        if (iframe && !youtubePlayers.current[id]) {
          try {
            youtubePlayers.current[id] = new window.YT.Player(`youtube-${id}`, {
              events: {
                onStateChange: (event) => {
                  if (event.data === window.YT.PlayerState.PLAYING) {
                    // Pause all other YouTube players
                    Object.entries(youtubePlayers.current).forEach(([key, player]) => {
                      if (key !== id && player?.pauseVideo) player.pauseVideo();
                    });
                    // Pause all HTML5 videos
                    Object.values(videoRefs.current).forEach((video) => {
                      if (video && !video.paused) video.pause();
                    });
                  }
                },
              },
            });
          } catch (e) {
            console.warn(`Error creating YouTube player ${id}:`, e);
          }
        }
      });
    }
  }, [latestPosts, featuredVideo]);

  // ✅ Styled Button
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

  // ✅ Render Media (YouTube, Video, Image)
  const renderMedia = (source, id) => {
    if (!source) return null;

    if (isYouTubeUrl(source)) {
      const embedUrl = getYouTubeEmbedUrl(source);
      return (
        <iframe
          id={`youtube-${id}`}
          src={`${embedUrl}?enablejsapi=1&modestbranding=1&rel=0&controls=0&disablekb=1&fs=0`}
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "20px",
            backgroundColor: "#000",
            objectFit: "cover",
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
          onPlay={() => handleVideoPlay(id)}
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

  // ✅ Render Card
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
        onClick={() => {
          pauseAllVideos();
          navigate(`/feed/${post.type}/${post._id}`);
        }}
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

        {renderMedia(mediaSource, post._id)}

        {(type === "blog" || type === "news" || type === "short" || type === "featured" || type === "video") && (
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
            <Typography variant="caption" display="block" sx={{ mb: 1, fontSize: "1.3rem" }}>
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
                pauseAllVideos();
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
    <>
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
            <Box sx={{ height: "500px" }}>{renderCard(latestPosts.shorts, "short")}</Box>
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
          <StyledButton
            onClick={() => {
              pauseAllVideos();
              navigate("/feed/blog");
            }}
          >
            VIEW ALL
          </StyledButton>
        </Box>
        <InsuranceCard />
      </Box>
    </>
  );
};

export default BlogSection;
