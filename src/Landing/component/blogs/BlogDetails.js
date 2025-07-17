import React, { useEffect } from "react";
import Navbar, { StyledButton } from "../../../component/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, Button as MuiButton } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import API_URL from "../../../ServiceModule/Service";
import moment from "moment-timezone";
import { capitalizeFirstLetter, truncateString } from "../../../utils/helpers";
import arrow from "../../../Images/Symbol.png";
import { THEME_COLOR } from "../../../constants";
import Footer from "../Footer";
import SessionExpiredModal from "../../../utils/sessionExpireModal";

const NewsBlog = () => {
  const navigate = useNavigate();
  const { type, id } = useParams();
  const [blog, setBlog] = React.useState({});
  const [moreBlogs, setMoreBlogs] = React.useState([]);
  const [error, setError] = useState(null);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  
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
        setError('Failed to load options');
        toast.error(
          error?.response?.data?.message || // from backend
            error?.message || // fallback message
            "Something went wrong while loading the blog."
        );
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlogDetails();
  }, [id]);

  // Function to render media content (image or video)
  const renderMediaContent = (mediaUrl, altText, isMainBlog = false) => {
    if (!mediaUrl) return null;

    const isVideo = mediaUrl.match(/\.(mp4|mov|avi|mkv|webm)$/i);

    if (isVideo) {
      return (
        <video
          controls
          style={
            isMainBlog
              ? { maxWidth: "80%", maxHeight: "80vh", margin: "auto" }
              : { width: "100%", height: "200px", objectFit: "cover" }
          }
          className={isMainBlog ? "" : "card-img-top"}
        >
          <source src={mediaUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <img
          src={mediaUrl}
          style={
            isMainBlog
              ? { maxWidth: "80%", maxHeight: "80vh", margin: "auto" }
              : { width: "100%", height: "200px", objectFit: "cover" }
          }
          className={isMainBlog ? "" : "card-img-top"}
          alt={altText}
        />
      );
    }
  };

  const handleCardClick = (blogId) => {
    navigate(`/feed/blog/${blogId}`);
  };
      const handleSessionExpiredOk = () => {
    setShowSessionExpired(false);
    navigate('/login');
    localStorage.clear();
  sessionStorage.clear(); 
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
              mb: 5,
              px: 2,
            }}
          >
            <StyledButton
              style={{ fontSize: "1.3rem" }}
              onClick={() => navigate(-1)}
            >
              Back
            </StyledButton>

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
            className="card d-flex flex-row gap-4 mb-4"
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
              <div className="text-muted mb-3">
                <span
                  className="mr-3"
                  style={{ color: THEME_COLOR.SECONDARY_TEXT }}
                >
                  <i
                    className="fas fa-user"
                    style={{ color: "rgb(138, 198, 66)" }}
                  ></i>{" "}
                  {blog?.createdBy}
                </span>
                <span style={{ color: THEME_COLOR.SECONDARY_TEXT }}>
                  <i
                    className="fas fa-calendar-alt primary-color"
                    style={{ color: "rgb(138, 198, 66)" }}
                  ></i>{" "}
                  {moment(blog?.createdAt).format("MMM DD, YYYY")}
                </span>
              </div>
              <p className="text-left">{blog?.description}</p>
            </div>
          </div>

          {moreBlogs?.length > 0 && (
            <>
              <h2 className="text-center mb-4">
                <strong>More From Blogs And News</strong>
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
                      {renderMediaContent(mBlog?.newsImg, mBlog?.subtitle)}
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
                            {mBlog?.createdBy}
                          </span>
                          <span style={{ color: THEME_COLOR.SECONDARY_TEXT }}>
                            <i
                              className="fas fa-calendar-alt"
                              style={{ color: "rgb(138, 198, 66)" }}
                            ></i>{" "}
                            {moment(mBlog?.createdAt).format("MMM DD, YYYY")}
                          </span>
                        </div>
                        <p className="card-text flex-grow-1">
                          {truncateString(mBlog?.description)}
                        </p>
                        <div className="mt-auto">
                          <MuiButton
                            variant="text"
                            className="text-light p-0"
                            onClick={() => {
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
