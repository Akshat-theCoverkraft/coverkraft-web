import React, { useEffect, useState, useRef } from "react";
import { 
  Box, 
  IconButton, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid,
  Avatar,
  Button as MuiButton,
  Skeleton
} from '@mui/material';
import { 
  ArrowBack, 
  CalendarTodayRounded, 
  PersonRounded 
} from '@mui/icons-material';
import Navbar from "../../../component/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify';
import API_URL from "../../../ServiceModule/Service";
import moment from "moment-timezone";
import { capitalizeFirstLetter, truncateString } from "../../../utils/helpers";
import arrow from "../../../Images/Symbol.png";
import Footer from "../Footer";
import SessionExpiredModal from "../../../utils/sessionExpireModal";
import DOMPurify from "dompurify";

const NewsBlog = () => {
  const navigate = useNavigate();
  const { type, id } = useParams();
  const [blog, setBlog] = React.useState({});
  const [moreBlogs, setMoreBlogs] = React.useState([]);
  const [error, setError] = useState(null);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [textOverflowStates, setTextOverflowStates] = useState({});
  
  // Refs to store video elements
  const videoRefs = useRef([]);
  const mainVideoRef = useRef(null);
  const textRefs = useRef({});
  
  console.log(type, id, "<===type");

  // Check if link is YouTube
  const isYouTubeLink = (url) => {
    return (
      typeof url === "string" &&
      (url.includes("youtube.com") || url.includes("youtu.be"))
    );
  };

  // Generate embed link for YouTube (Normal, Shorts, youtu.be)
  const getYouTubeEmbedUrl = (url) => {
    try {
      if (!url) return null;
      url = url.trim();

      // Already an embed URL
      if (url.includes("youtube.com/embed/")) return url;

      if (url.includes("youtube.com")) {
        const urlObj = new URL(url);

        // Handle Shorts: /shorts/VIDEO_ID
        if (urlObj.pathname.startsWith("/shorts/")) {
          const videoId = urlObj.pathname.split("/shorts/")[1]?.split("?")[0];
          if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        }

        // Handle normal YouTube links: ?v=VIDEO_ID
        const videoId = urlObj.searchParams.get("v");
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      }

      // Handle youtu.be short links
      if (url.includes("youtu.be")) {
        const videoId = url.split("youtu.be/")[1]?.split("?")[0];
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      }
    } catch (err) {
      console.error("Invalid YouTube URL", url, err);
    }
    return null;
  };

  // Detect media type
  const getMediaType = (url) => {
    if (!url || typeof url !== "string") return "image";
    if (isYouTubeLink(url)) return "youtube";

    const videoExtensions = [".mp4", ".mov", ".webm", ".ogg", ".avi", ".mkv"];
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

    const lowerUrl = url.toLowerCase();
    if (videoExtensions.some(ext => lowerUrl.endsWith(ext))) return "video";
    if (imageExtensions.some(ext => lowerUrl.endsWith(ext))) return "image";

    return "image";
  };

  const fetchBlogDetails = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${API_URL}news/get-blog-details?blogId=${id}`
      );

      if (data?.success) {
        setBlog(data?.blog);

        // Only set moreBlogs with status 'active' and exclude current blog
        const activeBlogs = (data?.moreBlogs || []).filter(
          (blog) => blog.status === "active" && blog._id !== id
        );
        setMoreBlogs(activeBlogs);
      } else {
        toast.error(data?.message || "Failed to load blog details.");
      }
    } catch (error) {
      console.error("Error fetching options:", error);
      if (error.response?.status === 401) {
        setShowSessionExpired(true);
      } else {
        setError('Failed to load options');
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Something went wrong while loading the blog."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to pause all videos
  const pauseAllVideos = () => {
    if (mainVideoRef.current) {
      mainVideoRef.current.pause();
    }
    
    videoRefs.current.forEach(video => {
      if (video) {
        video.pause();
      }
    });
  };

  // Function to handle video play - pause others when one starts
  const handleVideoPlay = (playingVideo) => {
    if (mainVideoRef.current && mainVideoRef.current !== playingVideo) {
      mainVideoRef.current.pause();
    }
    
    videoRefs.current.forEach(video => {
      if (video && video !== playingVideo) {
        video.pause();
      }
    });
  };

  const handleVideoClick = (index) => {
    Object.entries(videoRefs.current).forEach(([key, video]) => {
      if (parseInt(key) !== index && video) video.pause();
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlogDetails();
  }, [id]);

  useEffect(() => {
    if (!isLoading && moreBlogs.length > 0) {
      moreBlogs.forEach((_, index) => {
        const el = textRefs.current[index];
        if (el) {
          const isOverflowing = el.scrollHeight > parseInt(window.getComputedStyle(el).lineHeight) * 2;
          setTextOverflowStates(prev => ({ ...prev, [index]: isOverflowing }));
        }
      });
    }
  }, [moreBlogs, isLoading]);

  // Cleanup effect to pause all videos when component unmounts or route changes
  useEffect(() => {
    const handleBeforeUnload = () => {
      pauseAllVideos();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      pauseAllVideos();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Function to render media content for main blog
  const renderMainMediaContent = (blog) => {
    const mediaUrl = blog?.video || blog?.videoUrl || blog?.youtubeLink || blog?.youTubeLink || blog?.newsImg || blog?.link;
    if (!mediaUrl) return null;

    const mediaType = getMediaType(mediaUrl);

    const commonMainStyles = {
      maxWidth: "100%",
      width: "100%",
      height: "400px",
      borderRadius: "24px",
      margin: "0 auto 2rem auto",
      display: "block"
    };

    if (mediaType === "youtube") {
      const embedUrl = getYouTubeEmbedUrl(mediaUrl);
      return (
        <Box sx={commonMainStyles}>
          <iframe
            width="100%"
            height="100%"
            src={`${embedUrl}?modestbranding=1&rel=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "24px", objectFit: "cover" }}
          />
        </Box>
      );
    }

    if (mediaType === "video") {
      return (
        <Box sx={commonMainStyles}>
          <video
            ref={mainVideoRef}
            controls
            controlsList="nodownload"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "24px",
              objectFit: "contain"
            }}
            onPlay={(e) => handleVideoPlay(e.target)}
            preload="metadata"
          >
            <source src={mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
      );
    }

    return (
      <Box sx={commonMainStyles}>
        <img
          src={mediaUrl}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "24px",
            objectFit: "contain"
          }}
          alt={blog?.subtitle}
        />
      </Box>
    );
  };

  // Function to render media content for more blogs cards
  const renderCardMediaContent = (item, index) => {
    const mediaUrl = item?.video || item?.videoUrl || item?.youtubeLink || item?.youTubeLink || item?.newsImg || item?.link;
    if (!mediaUrl) return null;

    const mediaType = getMediaType(mediaUrl);

    if (mediaType === "youtube") {
      const embedUrl = getYouTubeEmbedUrl(mediaUrl);
      return (
        <Box sx={{ height: 220 }}>
          <iframe
            width="100%"
            height="100%"
            src={`${embedUrl}?modestbranding=1&rel=0&controls=0&disablekb=1&fs=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "20px", objectFit: "cover" }}
          />
        </Box>
      );
    }

    if (mediaType === "video") {
      return (
        <CardMedia
          component="video"
          src={mediaUrl}
          controls
          controlsList="nodownload"
          height="220"
          ref={(el) => (videoRefs.current[index] = el)}
          onClick={(e) => e.stopPropagation()}
          onPlay={() => handleVideoClick(index)}
          sx={{ objectFit: "contain", transition: "transform 0.4s ease" }}
        />
      );
    }

    return (
      <CardMedia
        component="img"
        image={mediaUrl}
        height="220"
        sx={{ objectFit: "contain", transition: "transform 0.4s ease" }}
      />
    );
  };

  const handleCardClick = (blogId) => {
    pauseAllVideos();
    navigate(`/feed/${type}/${blogId}`);
  };
  
  const handleSessionExpiredOk = () => {
    pauseAllVideos();
    setShowSessionExpired(false);
    navigate('/login');
    localStorage.clear();
    sessionStorage.clear(); 
  };

  const handleBackClick = () => {
    pauseAllVideos();
    navigate(`/feed/${type}`);
  };

  const handleReadMoreClick = (e, item) => {
    e.stopPropagation();
    pauseAllVideos();
    navigate(`/feed/${type}/${item._id}`);
  };

  const renderSkeletonCards = () => Array.from({ length: 6 }).map((_, i) => (
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

  if (isLoading) {
    return (
      <>
        <Box sx={{ minHeight: "100vh", background: "#121212" }}>
          <Navbar />
          <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header Skeleton */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width={200} height={40} />
              <Box sx={{ width: 40 }} />
            </Box>
            
            {/* Main Content Skeleton */}
            <Card sx={{ 
              borderRadius: "24px", 
              backgroundColor: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              mb: 6
            }}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: "24px 24px 0 0" }} />
              <Box sx={{ p: 4 }}>
                <Skeleton height={40} width="80%" sx={{ mb: 2 }} />
                <Skeleton height={20} width="40%" sx={{ mb: 3 }} />
                <Skeleton height={20} width="100%" sx={{ mb: 1 }} />
                <Skeleton height={20} width="100%" sx={{ mb: 1 }} />
                <Skeleton height={20} width="60%" />
              </Box>
            </Card>

            {/* More Content Skeleton */}
            <Typography variant="h4" sx={{ color: "#fff", textAlign: "center", mb: 4 }}>
              <Skeleton width={300} height={50} sx={{ margin: "0 auto" }} />
            </Typography>
            <Grid container spacing={4}>
              {renderSkeletonCards()}
            </Grid>
          </Container>
        </Box>
        <Footer />
      </>
    );
  }

  return (
    <>
      <ToastContainer />
      <Box sx={{ minHeight: "100vh", background: "#121212" }}>
        <Navbar />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <SessionExpiredModal
            visible={showSessionExpired}
            onConfirm={handleSessionExpiredOk}
          />

          {/* Header */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            px: 2,
          }}>
            <IconButton 
              onClick={handleBackClick}
              sx={{ 
                color: '#8BC642',
                backgroundColor: 'rgba(139, 198, 66, 0.1)',
                '&:hover': { backgroundColor: 'rgba(139, 198, 66, 0.2)' }
              }}
            >
              <ArrowBack />
            </IconButton>
            
            <Typography variant="h3" sx={{ 
              color: "#fff", 
              fontWeight: 700,
              textAlign: "center",
              fontSize: { xs: "2rem", md: "3rem" }
            }}>
              {capitalizeFirstLetter(type) === "News"
                ? "News"
                : capitalizeFirstLetter(type) + "s"}
            </Typography>

            <Box sx={{ width: 56 }} />
          </Box>

          {/* Main Blog Card */}
          <Card sx={{
            borderRadius: "24px",
            backgroundColor: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            mb: 6,
            overflow: "hidden"
          }}>
            {renderMainMediaContent(blog)}
            
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h3" sx={{
                color: "#fff",
                fontWeight: 700,
                textAlign: "center",
                mb: 3,
                fontSize: { xs: "1.8rem", md: "2.5rem" }
              }}>
                {blog?.subtitle}
              </Typography>
              
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                gap: 4, 
                flexWrap: "wrap", 
                mb: 4 
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar sx={{ width: 24, height: 24, bgcolor: "#8BC642" }}>
                    <PersonRounded sx={{ fontSize: 14 }} />
                  </Avatar>
                  <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "16px" }}>
                    {capitalizeFirstLetter(blog?.createdBy) || "Super Admin"}
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarTodayRounded sx={{ fontSize: "20px", color: "#8BC642" }} />
                  <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "16px" }}>
                    {moment(blog?.createdAt).format("MMM DD, YYYY")}
                  </Typography>
                </Box>
              </Box>
              
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "18px",
                  lineHeight: 1.6,
                  textAlign: "left"
                }}
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(blog?.description) 
                }}
              />
            </CardContent>
          </Card>

          {/* More Blogs Section */}
          {moreBlogs?.length > 0 && (
            <>
              <Typography variant="h4" sx={{
                color: "#fff",
                fontWeight: 700,
                textAlign: "center",
                mb: 6,
                fontSize: { xs: "1.8rem", md: "2.2rem" }
              }}>
                More from {capitalizeFirstLetter(type)}
                {type.toLowerCase() === "blog" || 
                 type.toLowerCase() === "news" || 
                 type.toLowerCase() === "video" || 
                 type.toLowerCase() === "short" ? "s" : ""}
              </Typography>

              <Grid container spacing={4}>
                {moreBlogs?.map((mBlog, index) => {
                  const showReadMore = textOverflowStates[index];
                  
                  return (
                    <Grid item xs={12} sm={6} md={4} key={mBlog._id}>
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
                          cursor: "pointer",
                          transition: "all 0.4s ease",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                            border: "1px solid rgba(139, 198, 66, 0.3)",
                          },
                        }}
                        onClick={() => handleCardClick(mBlog?._id)}
                      >
                        <Box sx={{ position: "relative" }}>
                          {renderCardMediaContent(mBlog, index)}
                        </Box>

                        <CardContent sx={{ display: "flex", flexDirection: "column", flexGrow: 1, p: 3 }}>
                          <Typography variant="h6" sx={{
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "18px",
                            mb: 2,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden"
                          }}>
                            {mBlog?.subtitle}
                          </Typography>

                          <Box sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: 2, 
                            flexWrap: "wrap", 
                            mb: 2 
                          }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Avatar sx={{ width: 20, height: 20, bgcolor: "#8BC642" }}>
                                <PersonRounded sx={{ fontSize: 12 }} />
                              </Avatar>
                              <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>
                                {capitalizeFirstLetter(mBlog?.createdBy) || "Super Admin"}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <CalendarTodayRounded sx={{ fontSize: "16px", color: "#8BC642" }} />
                              <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>
                                {moment(mBlog?.createdAt).format("MMM DD, YYYY")}
                              </Typography>
                            </Box>
                          </Box>

                          {mBlog.description && (
                            <Box
                              ref={el => textRefs.current[index] = el}
                              sx={{
                                color: "rgba(255,255,255,0.8)",
                                lineHeight: 1.4,
                                fontSize: "14px",
                                maxHeight: "3.4em",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                mb: 2,
                                flexGrow: 1
                              }}
                              dangerouslySetInnerHTML={{ 
                                __html: DOMPurify.sanitize(truncateString(mBlog?.description))
                              }}
                            />
                          )}

                          {mBlog.description && showReadMore && (
                            <MuiButton
                              onClick={(e) => handleReadMoreClick(e, mBlog)}
                              sx={{
                                color: "#8BC642",
                                fontSize: "14px",
                                fontWeight: 500,
                                textTransform: "none",
                                p: 0,
                                minWidth: "auto",
                                alignSelf: "flex-end",
                                mt: "auto",
                                "&:hover": { backgroundColor: "rgba(139,198,66,0.1)" }
                              }}
                            >
                              Read More
                              <img
                                src={arrow}
                                style={{
                                  height: "16px",
                                  marginLeft: "8px",
                                  filter: "brightness(0) saturate(100%) invert(71%) sepia(45%) saturate(434%) hue-rotate(56deg) brightness(95%) contrast(89%)",
                                }}
                                alt="arrow-right"
                              />
                            </MuiButton>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default NewsBlog;