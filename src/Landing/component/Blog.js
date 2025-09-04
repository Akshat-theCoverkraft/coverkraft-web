import React, { useState, useEffect } from "react";
import {
  Grid,
  Chip,
  Typography,
  Button as MuiButton,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import symbol from "../../Images/Symbol.png";
import Video from "../../Images/Video.svg";
import API_URL from "../../ServiceModule/Service";
import { Link, useNavigate } from "react-router-dom";
import { capitalizeFirstLetter, truncateString } from "../../utils/helpers";
import { THEME_COLOR } from "../../constants";

// 🔹 Styled Components
const ScrollContainer = styled("div")({
  display: "flex",
  // overflowX: "hidden", // Hide scrollbar
  gap: "20px",
  width: "100%",
  position: "relative",
  "&:hover .scrolling-content": {
    animationPlayState: "paused", // Pause on hover
  },
});

const ScrollingContent = styled("div")({
  display: "flex",
  gap: "20px",
  animation: "infiniteScroll 120s linear infinite", // Infinite scroll animation
  "&:hover": {
    animationPlayState: "paused",
  },
  "@keyframes infiniteScroll": {
    "0%": {
      transform: "translateX(0)",
    },
    "100%": {
      transform: "translateX(-50%)",
    },
  },
});

const Card = styled("div")({
  flex: "0 0 auto",
  width: 500,
  borderRadius: 10,
  backgroundColor: THEME_COLOR.FADE_BACKGROUND,
  padding: 10,
  borderRadius: 25,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
  },
});

const MediaContainer = styled("div")({
  height: 250,
  borderRadius: 6,
  overflow: "hidden",
  backgroundColor: "#000",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 20,
});

const CenteredContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "150%",
  maxWidth: "1200px",
  margin: "0 auto",
});

// 🔹 Main Blog Component
const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${API_URL}news/getAll`);
        const result = await response.json();
        // console.log("📦 Blog API Result:", result);

        if (result?.status && Array.isArray(result.data)) {
          setPosts(result.data);
        } else {
          console.warn("⚠️ Unexpected blog structure:", result);
        }
      } catch (err) {
        console.error("🔥 Blog Fetch Failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const firstPostType = posts?.[0]?.type || "news";

  // Duplicate posts for infinite scroll effect
  const duplicatedPosts = [...posts, ...posts];

  if (loading) {
    return (
      <Grid container justifyContent="center" style={{ padding: "60px" }}>
        <CircularProgress />
      </Grid>
    );
  }

  const renderCard = (post, index) => (
    <Card
      key={`${post?._id}-${index}`}
      onClick={() => navigate(`/feed/${post?.type}`)}
    >
      <MediaContainer>
        {post?.newsVideo ? (
          <>
            <video
              key={post._id || index}
              controls
              playsInline
              muted
              preload="metadata"
              style={{
                width: "100%",
                height: "120%",
                objectFit: "cover",
                display: "block",
              }}
              onError={(e) => {
                console.warn("📛 Video failed:", e);
                const fallback = document.getElementById(
                  `fallback-img-${index}`
                );
                if (fallback) fallback.style.display = "block";
                e.target.style.display = "none";
              }}
            >
              <source src={post.newsVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <img
              id={`fallback-img-${index}`}
              src={post?.newsImg || Video}
              alt={post?.title}
              style={{
                display: "none",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.target.src = Video;
              }}
            />
          </>
        ) : (
          <img
            src={post?.newsImg || Video}
            alt={post?.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.target.src = Video;
            }}
          />
        )}
      </MediaContainer>

      <div style={{ paddingTop: "10px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <Typography
            variant="body2"
            fontWeight="bold"
            fontSize="1.2rem"
            color={THEME_COLOR.GREEN}
          >
            {post?.date}
          </Typography>
          <Chip
            label={capitalizeFirstLetter(post?.type)}
            variant="outlined"
            size="small"
            sx={{
              fontSize: "12px",
              borderColor: THEME_COLOR.GREEN,
              color: THEME_COLOR.GREEN,
              fontWeight: "bold",
            }}
          />
        </div>

        <Typography
          variant="h6"
          style={{
            marginBottom: "8px",
            fontSize: "1.6rem",
            fontWeight: "bold",
          }}
        >
          {truncateString(post?.subtitle, 50)}
        </Typography>

        <Typography
          variant="body2 "
          style={{ marginBottom: "8px", fontSize: "1.3rem" }}
        >
          {truncateString(post?.description, 80)}
        </Typography>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "10px",
            cursor: "pointer",
          }}
        >
          <Link
            to={`/feed/${post?.type}`}
            style={{
              textDecoration: "none",
              fontWeight: "bold",
              color: THEME_COLOR.PRIMARY_TEXT || "#fff",
              marginRight: "8px",
              fontSize: "14px",
            }}
          >
            See More
          </Link>
          <img src={symbol} height={15} alt="symbol" />
        </div>
      </div>
    </Card>
  );

  return (
    <Grid
      id="blog"
      container
      justifyContent="center"
      style={{ backgroundColor: THEME_COLOR.BACKGROUND, padding: "35px 20px" }}
    >
      <CenteredContainer>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h3
            style={{ color: "#FF9906", fontWeight: "bold", fontSize: "29px" }}
          >
            Latest from the blogs
          </h3>
          {/* <h1 style={{ fontWeight: "bold", margin: "20px 0" }}>Latest from the blog</h1> */}
        </div>

        {/* Infinite Horizontal Carousel */}
        <Grid item xs={12} style={{ width: "100%" }}>
          <ScrollContainer>
            <ScrollingContent className="scrolling-content">
              {duplicatedPosts.map((post, index) => renderCard(post, index))}
            </ScrollingContent>
          </ScrollContainer>
        </Grid>

        {/* View All Button */}
        <Grid
          item
          xs={12}
          style={{
            textAlign: "center",
            marginTop: "40px",
            marginBottom: "20px",
          }}
        >
          <MuiButton
            variant="contained"
            onClick={() => navigate(`/feed/${firstPostType}`)}
            style={{
              borderRadius: "25px",
              padding: "10px 20px",
              backgroundColor: THEME_COLOR.FADE_BACKGROUND,
              color: THEME_COLOR.PRIMARY_TEXT || "#fff",
              boxShadow: "none",
              width: "250px",
              fontWeight: "bold",
              height: "60px",
              fontSize: "13px",
            }}
          >
            View All
          </MuiButton>
        </Grid>
      </CenteredContainer>
    </Grid>
  );
};

export default Blog;
