import React, { useEffect, useState, useRef } from "react";
import Navbar, { StyledButton } from "../../../component/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, IconButton, Button as MuiButton } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import API_URL from "../../../ServiceModule/Service";
import moment from "moment-timezone";
import { capitalizeFirstLetter, truncateString } from "../../../utils/helpers";
import arrow from "../../../Images/Symbol.png";
import { THEME_COLOR } from "../../../constants";
import Footer from "../Footer";
import backArrow from "../../../Images/ic_back_button.png";
import SessionExpiredModal from "../../../utils/sessionExpireModal";
import DOMPurify from "dompurify";

// ✅ Utility to decode HTML entities
const decodeHtmlEntities = (str) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = str;
  return textarea.value;
};

const NewsBlog = () => {
  const navigate = useNavigate();
  const { type, id } = useParams();
  const [blog, setBlog] = React.useState({});
  const [moreBlogs, setMoreBlogs] = React.useState([]);
  const [error, setError] = useState(null);
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  // Refs to store video elements
  const videoRefs = useRef([]);
  const mainVideoRef = useRef(null);

  console.log(type, id, "<===type");

  const fetchBlogDetails = async () => {
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
        setError("Failed to load options");
        toast.error(
          error?.response?.data?.message || // from backend
            error?.message || // fallback message
            "Something went wrong while loading the blog."
        );
      }
    }
  };

  // Function to pause all videos
  const pauseAllVideos = () => {
    if (mainVideoRef.current) {
      mainVideoRef.current.pause();
    }
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
      }
    });
  };

  const handleVideoPlay = (playingVideo) => {
    if (mainVideoRef.current && mainVideoRef.current !== playingVideo) {
      mainVideoRef.current.pause();
    }
    videoRefs.current.forEach((video) => {
      if (video && video !== playingVideo) {
        video.pause();
      }
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlogDetails();
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      pauseAllVideos();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      pauseAllVideos();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const isYouTubeLink = (url) => {
    return (
      typeof url === "string" &&
      (url.includes("youtube.com") || url.includes("youtu.be"))
    );
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = "";

    if (url.includes("youtube.com/watch?v=")) {
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get("v");
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    }

    return `https://www.youtube.com/embed/${videoId}`;
  };

  const renderMediaContent = (
    mediaUrl,
    altText,
    isMainBlog = false,
    index = null
  ) => {
    if (!mediaUrl) return null;

    const isVideo = mediaUrl.match(/\.(mp4|mov|avi|mkv|webm)$/i);
    const isYouTube = isYouTubeLink(mediaUrl);

    if (isYouTube) {
      const embedUrl = getYouTubeEmbedUrl(mediaUrl);
      return (
        <div
          style={
            isMainBlog
              ? { maxWidth: "80%", height: "auto", margin: "auto" }
              : { width: "100%", height: "180px" }
          }
        >
          <iframe
            width="100%"
            height={isMainBlog ? "400px" : "180px"}
            src={embedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "10px", objectFit: "cover" }}
          ></iframe>
        </div>
      );
    }

    if (isVideo) {
      return (
        <video
          ref={
            isMainBlog
              ? mainVideoRef
              : (el) => {
                  if (index !== null) {
                    videoRefs.current[index] = el;
                  }
                }
          }
          controls
          controlsList="nodownload"
          style={
            isMainBlog
              ? { maxWidth: "80%", maxHeight: "70vh", margin: "auto" }
              : { width: "100%", height: "180px", objectFit: "cover" }
          }
          className={isMainBlog ? "" : "card-img-top"}
          onPlay={(e) => handleVideoPlay(e.target)}
          preload="metadata"
        >
          <source src={mediaUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    return (
      <img
        src={mediaUrl}
        style={
          isMainBlog
            ? { maxWidth: "80%", maxHeight: "70vh", margin: "auto" }
            : { width: "100%", height: "180px", objectFit: "cover" }
        }
        className={isMainBlog ? "" : "card-img-top"}
        alt={altText}
      />
    );
  };

  const handleCardClick = (blogId) => {
    pauseAllVideos();
    navigate(`/feed/blog/${blogId}`);
  };

  const handleSessionExpiredOk = () => {
    pauseAllVideos();
    setShowSessionExpired(false);
    navigate("/login");
    localStorage.clear();
    sessionStorage.clear();
  };

  const handleBackClick = () => {
    pauseAllVideos();
    navigate(`/feed/${type}`);
  };

  return (
    <>
      <ToastContainer />
      <div className="overflow-hidden">
        <Navbar />
        <SessionExpiredModal
          visible={showSessionExpired}
          onConfirm={handleSessionExpiredOk}
        />
        <div
          className="container my-4"
          style={{ marginTop: "100px", width: "90%" }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              px: 2,
            }}
          >
            <IconButton onClick={handleBackClick}>
              <img src={backArrow} alt="Back" style={{ width: 24 }} />
            </IconButton>
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <h1 className="mb-0 text-center">
                {capitalizeFirstLetter(type) === "News"
                  ? "News"
                  : capitalizeFirstLetter(type) + "s"}
              </h1>
            </Box>

            <Box sx={{ width: "85px" }} />
          </Box>

          <div
            className={`card d-flex ${
              ["short", "video", "featured"].includes(type)
                ? "flex-column"
                : "flex-row"
            } gap-4 mb-4`}
            style={{
              backgroundColor: THEME_COLOR.FADE_BACKGROUND,
              color: THEME_COLOR.SECONDARY_TEXT,
            }}
          >
            {renderMediaContent(blog?.newsImg, blog?.subtitle, true)}
            <div className="card-body">
              <h2 className="text-center">
                <strong>{blog?.subtitle}</strong>
              </h2>
              <div className="text-muted mb-5">
                <span
                  className="mr-3 mt-5"
                  style={{ color: THEME_COLOR.SECONDARY_TEXT }}
                >
                  <i
                    className="fas fa-user"
                    style={{ color: "rgb(138, 198, 66)" }}
                  ></i>{" "}
                  {capitalizeFirstLetter(blog?.createdBy)}
                </span>
                <span style={{ color: THEME_COLOR.SECONDARY_TEXT }}>
                  <i
                    className="fas fa-calendar-alt primary-color"
                    style={{ color: "rgb(138, 198, 66)" }}
                  ></i>{" "}
                  {moment(blog?.createdAt).format("MMM DD, YYYY")}
                </span>
              </div>

              {/* ✅ Decode + Sanitize HTML */}
              <p
                className="text-left mt-2"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    decodeHtmlEntities(blog?.description || "")
                  ),
                }}
              />
            </div>
          </div>

          {moreBlogs?.length > 0 && (
            <>
              <h2 className="text-center mb-4">
                <strong>
                  More from {capitalizeFirstLetter(type)}
                  {type.toLowerCase() === "blog" ||
                  type.toLowerCase() === "news" ||
                  type.toLocaleLowerCase() === "videos" ||
                  type.toLocaleLowerCase() === "shorts"
                    ? "s"
                    : ""}
                </strong>
              </h2>

              <div className="row">
                {moreBlogs?.map((mBlog, index) => (
                  <div className="col-md-4 mb-4" key={index}>
                    <div
                      className="card text-left h-100"
                      style={{
                        backgroundColor: THEME_COLOR.FADE_BACKGROUND,
                        color: THEME_COLOR.SECONDARY_TEXT,
                        cursor: "pointer",
                        transition: "transform 0.2s ease-in-out",
                      }}
                      onClick={() => handleCardClick(mBlog?._id)}
                      onMouseEnter={(e) =>
                        (e.target.style.transform = "translateY(-5px)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.transform = "translateY(0)")
                      }
                    >
                      {renderMediaContent(
                        mBlog?.newsImg,
                        mBlog?.subtitle,
                        false,
                        index
                      )}
                      <div className="card-body d-flex flex-column">
                        <h3 className="card-title h5">{mBlog?.subtitle}</h3>
                        <div className="text-muted mb-2">
                          <span
                            className="mr-3"
                            style={{ color: THEME_COLOR.SECONDARY_TEXT }}
                          >
                            <i
                              className="fas fa-user"
                              style={{ color: "rgb(138, 198, 66)" }}
                            ></i>{" "}
                            {capitalizeFirstLetter(mBlog?.createdBy)}
                          </span>
                          <span style={{ color: THEME_COLOR.SECONDARY_TEXT }}>
                            <i
                              className="fas fa-calendar-alt"
                              style={{ color: "rgb(138, 198, 66)" }}
                            ></i>{" "}
                            {moment(mBlog?.createdAt).format("MMM DD, YYYY")}
                          </span>
                        </div>

                        {/* ✅ Decode + Sanitize HTML for moreBlogs */}
                        <p
                          className="text-left mt-2"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              decodeHtmlEntities(
                                truncateString(mBlog?.description || "")
                              )
                            ),
                          }}
                        />
                        <div className="mt-auto">
                          <MuiButton
                            variant="text"
                            className="text-light p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCardClick(mBlog?._id);
                            }}
                            style={{
                              color: "rgb(138, 198, 66)",
                              textTransform: "none",
                              fontSize: "14px",
                            }}
                          >
                            Read More
                            <img
                              src={arrow}
                              style={{
                                height: "16px",
                                marginLeft: "8px",
                                filter:
                                  "brightness(0) saturate(100%) invert(69%) sepia(45%) saturate(425%) hue-rotate(54deg) brightness(94%) contrast(89%)",
                              }}
                              alt="arrow-right"
                            />
                          </MuiButton>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NewsBlog;
