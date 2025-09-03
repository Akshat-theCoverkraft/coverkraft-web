import React, { useRef } from "react";
import { Card, CardContent, CardMedia, Box, Typography, Button, Avatar } from "@mui/material";
import { CalendarTodayRounded, PersonRounded } from "@mui/icons-material";
import DOMPurify from "dompurify";
import moment from "moment-timezone";
import arrow from "../../../Images/Symbol.png";
import { capitalizeFirstLetter } from "../../../utils/helpers";

// ✅ Check if link is YouTube
const isYouTubeLink = (url) =>
  typeof url === "string" && (url.includes("youtube.com") || url.includes("youtu.be"));

// ✅ Generate embed link for YouTube
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

// ✅ Detect media type
const getMediaType = (url) => {
  if (!url) return "image";
  if (isYouTubeLink(url)) return "youtube";
  const videoExtensions = [".mp4", ".mov", ".webm", ".ogg"];
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

  if (videoExtensions.some((ext) => url.toLowerCase().endsWith(ext))) return "video";
  if (imageExtensions.some((ext) => url.toLowerCase().endsWith(ext))) return "image";

  return "image"; // default fallback
};

const FeaturedVideoCard = ({ item, index, onReadMoreClick, videoRefs }) => {
  const mediaUrl = item.video || item.videoUrl || item.youTubeLink || item.newsImg;
  const mediaType = getMediaType(mediaUrl);

  // Handle video play pause logic
  const handleVideoClick = () => {
    Object.entries(videoRefs.current).forEach(([key, video]) => {
      if (parseInt(key) !== index && video) video.pause();
    });
  };

  return (
    <Card
      sx={{
        borderRadius: "24px",
        backgroundColor: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "all 0.4s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          border: "1px solid rgba(139, 198, 66, 0.3)",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        {mediaType === "youtube" ? (
          <Box sx={{ height: 220 }}>
            <iframe
              width="100%"
              height="100%"
              src={getYouTubeEmbedUrl(mediaUrl)}
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
            controls
            controlsList="nodownload"
            height="220"
            ref={(el) => (videoRefs.current[index] = el)}
            onClick={(e) => e.stopPropagation()}
            onPlay={handleVideoClick}
            sx={{ objectFit: "contain", transition: "transform 0.4s ease" }}
          />
        ) : (
          <CardMedia
            component="img"
            image={mediaUrl}
            height="220"
            sx={{ objectFit: "cover", transition: "transform 0.4s ease" }}
          />
        )}
      </Box>

      <CardContent sx={{ display: "flex", flexDirection: "column" }}>
        {/* ✅ Title */}
        <Typography
          variant="h6"
          sx={{
            color: "#fff",
            fontWeight: 600,
            fontSize: "18px",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(item.subtitle || ""),
          }}
        />

        {/* ✅ Meta Info */}
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

        {/* ✅ Description */}
        {item.description && (
          <Box
            sx={{
              color: "rgba(255,255,255,0.8)",
              lineHeight: 1.3,
              fontSize: "13px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(item.description || ""),
            }}
          />
        )}

        {/* ✅ Read More */}
        {item.description && (
          <Button
            onClick={(e) => onReadMoreClick(e, item)}
            sx={{
              color: "#8BC642",
              fontSize: "12px",
              fontWeight: 300,
              textTransform: "none",
              p: 0,
              minWidth: "auto",
              alignSelf: "flex-end",
              cursor: "pointer",
              "&:hover": { backgroundColor: "rgba(139,198,66,0.1)" },
            }}
            endIcon={
              <img
                src={arrow}
                alt="arrow"
                style={{
                  height: "14px",
                  filter:
                    "brightness(0) saturate(100%) invert(71%) sepia(45%) saturate(434%) hue-rotate(56deg) brightness(95%) contrast(89%)",
                }}
              />
            }
          >
            Read More
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default FeaturedVideoCard;
