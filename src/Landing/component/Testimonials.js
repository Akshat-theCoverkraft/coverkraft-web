import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./CSS/Testimonail.css";
import quote from "../../Images/quote-testimonial.png";
import { THEME_COLOR } from "../../constants";
import { Typography, Modal, Box, Grid } from "@mui/material";
import TRight from "../../Images/TRight.png";
import TLeft from "../../Images/TLeft.png";
import API_URL from "../../ServiceModule/Service";
import Loader from "../../component/Loader";
import { headingStyle } from "../../theme/themeStyles";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);

  const sliderRef = useRef();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${API_URL}testimonials`);
        const json = await res.json();
        if (Array.isArray(json.data)) {
          const activeTestimonials = json.data.filter(
            (t) => t.status === "active"
          );
          setTestimonials(activeTestimonials);
        } else {
          console.error("Invalid data format from backend");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const openModal = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTestimonial(null);
  };

  const pauseAllVideos = (e) => {
    if (playingVideo) {
      playingVideo.pause();
      setPlayingVideo(null);
    }
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
      if (video !== e.target) {
        video.pause();
      }
    });
  };

  const handleVideoPlay = (e) => {
    if (playingVideo && playingVideo !== e.target) {
      playingVideo.pause();
    }
    setPlayingVideo(e.target);
  };

  const settings = {
    infinite: testimonials.length > 2,
    slidesToShow: testimonials.length < 3 ? testimonials.length : 2,
    slidesToScroll: 2,
    autoplay: false,
    arrows: false,
    dots: true,
    afterChange: pauseAllVideos,
  };

  const renderMediaSection = (testimonial) => {
    const hasVideo = testimonial.media && testimonial.media.type === "video";
    const hasImage = testimonial.media && testimonial.media.type === "image";

    const mediaStyle = {
      width: "100%",
      height: "100%",
      // maxHeight: '200px',
      objectFit: "contain",
      borderRadius: "10px",
    };

    if (hasVideo) {
      return (
        <div
          className="media-section"
          style={{ flex: "1 1 50%", marginRight: "5px" }}
        >
          <video
            controls
            controlsList="nodownload"
            style={mediaStyle}
            onPlay={handleVideoPlay}
          >
            <source src={testimonial.media.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (hasImage) {
      return (
        <div
          className="media-section"
          style={{ flex: "1 1 50%", marginRight: "5px" }}
        >
          <img
            src={testimonial.media.url}
            alt="Testimonial media"
            style={mediaStyle}
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div id="testimonials" className="testimonials-container px-3">
        <div className="text-center">
          <Typography variant="h3" sx={headingStyle}>
            Testimonials
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: "#FFF",
              fontWeight: 700,
              textAlign: "center",
              fontSize: { xs: "26px", sm: "30px", md: "32px" },
            }}
          >
            Hear From our Clients
          </Typography>
        </div>
        <section className="testimonials">
          <div className="container">
            {loading ? (
              <Grid container spacing={2}>
                {[1, 2].map((_, idx) => (
                  <Grid item xs={12} sm={6} key={idx}>
                    <Loader
                      variant="rectangular"
                      width="100%"
                      height={250}
                      animation="wave"
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : testimonials.length === 0 ? (
              <div
                style={{
                  padding: "2rem",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: "90%",
                    maxWidth: 500,
                    height: 250,
                    bgcolor: "#1c1c1c",
                    borderRadius: 2,
                    border: "1px dashed #444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#888",
                    fontSize: "1.4rem",
                    fontWeight: 500,
                    textAlign: "center",
                    px: 3,
                  }}
                >
                  💤 No testimonials found. Stay tuned for updates!
                </Box>
              </div>
            ) : (
              <div className="slider-arrow-container">
                <button
                  className="testimonial-arrow-btn left-arrow mr-9"
                  onClick={() => sliderRef.current?.slickPrev()}
                >
                  <img src={TLeft} alt="Left" />
                </button>
                <Slider ref={sliderRef} {...settings} className="quotes">
                  {testimonials.map((testimonial, index) => {
                    const hasMedia =
                      testimonial.media &&
                      (testimonial.media.type === "video" ||
                        testimonial.media.type === "image");

                    return (
                      <div
                        key={`testimonial-${testimonial.id || index}`}
                        className="p-2"
                      >
                        <div
                          className={`quote-wrapper card d-flex ${
                            hasMedia ? "flex-row has-media" : "flex-column"
                          }`}
                          style={{
                            backgroundColor: THEME_COLOR.FADE_BACKGROUND,
                            color: THEME_COLOR.COLOR,
                            padding: "20px",
                            borderRadius: "12px",
                            height: "250px",
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              width: "4px",
                              height: "100%",
                              backgroundColor: "#226089",
                              zIndex: 1,
                            }}
                          ></div>

                          <div
                            className="text-section "
                            style={{
                              flex: "1 1 100%",
                              marginLeft: "10px",
                            }}
                          >
                            <img
                              src={quote}
                              alt="quote"
                              className="mb-3"
                              style={{ width: "30px" }}
                            />
                            <div
                              className="quote mb-2"
                              style={{
                                lineHeight: "1.6",
                                textAlign: "left",
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 3,
                              }}
                            >
                              {testimonial.quote}
                            </div>
                            {testimonial.quote.length > 180 && (
                              <span
                                onClick={() => openModal(testimonial)}
                                style={{
                                  color: "#7BC043",
                                  fontWeight: 700,
                                  fontSize: "1.2rem",
                                  cursor: "pointer",
                                  paddingLeft: "70%",
                                  fontFamily: "DM Sans, sans-serif",
                                }}
                              >
                                Read More →
                              </span>
                            )}
                            <div
                              className="author d-flex align-items-center mt-3"
                              style={{ gap: "10px" }}
                            >
                              <img
                                src={
                                  testimonial.pfp ||
                                  require("../../Images/ic_default_profile.png")
                                }
                                height={50}
                                width={50}
                                className="rounded-circle"
                                alt={`${testimonial.author} profile image`}
                              />
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  overflow: "hidden",
                                }}
                              >
                                <span
                                  className="author-name fw-bold"
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {testimonial.author}
                                </span>
                                <span
                                  className="author-role"
                                  style={{
                                    fontSize: "1.2rem",
                                    color: "#ccc",
                                  }}
                                >
                                  {testimonial.role || "Client"}
                                </span>
                              </div>
                            </div>
                          </div>
                          {hasMedia && renderMediaSection(testimonial)}
                        </div>
                      </div>
                    );
                  })}
                </Slider>
                <button
                  className="testimonial-arrow-btn right-arrow"
                  onClick={() => sliderRef.current?.slickNext()}
                >
                  <img src={TRight} alt="Right" />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        aria-labelledby="testimonial-modal-title"
        aria-describedby="testimonial-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "600px",
            bgcolor: "#121212",
            color: "#fff",
            border: "2px solid #7BC043",
            boxShadow: 24,
            p: 4,
            borderRadius: 3,
            position: "relative",
          }}
        >
          {/* Close button */}
          <span
            onClick={closeModal}
            style={{
              position: "absolute",
              top: "12px",
              right: "16px",
              fontSize: "1.9rem",
              cursor: "pointer",
              color: "#ccc",
              fontWeight: "bold",
              zIndex: 10,
            }}
            onMouseEnter={(e) => (e.target.style.color = "#7BC043")}
            onMouseLeave={(e) => (e.target.style.color = "#ccc")}
          >
            &times;
          </span>

          {/* Author Info Row */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <img
              src={
                selectedTestimonial?.pfp ||
                require("../../Images/ic_default_profile.png")
              }
              alt={`${selectedTestimonial?.author} profile`}
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <Box>
              <Typography
                id="testimonial-modal-title"
                sx={{
                  color: "#7BC043",
                  fontWeight: 700,
                  fontSize: "1.5rem",
                }}
              >
                {selectedTestimonial?.author}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontStyle: "italic",
                  color: "#ccc",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                }}
              >
                {selectedTestimonial?.role}
              </Typography>
            </Box>
          </Box>

          {/* Quote */}
          <Typography
            id="testimonial-modal-description"
            sx={{ lineHeight: "1.6", fontSize: "1.6rem", color: "#ccc" }}
          >
            {selectedTestimonial?.quote}
          </Typography>
        </Box>
      </Modal>

      <style jsx>{`
        .testimonial-arrow-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          outline: none;
          transition: box-shadow 0.2s, background 0.2s, filter 0.2s,
            transform 0.2s;
        }
        .testimonial-arrow-btn:hover {
          box-shadow: 0 4px 16px 0 #212121;
          filter: brightness(1.1) contrast(1.1);
          transform: scale(1.13);
        }
        .slick-dots {
          bottom: -50px;
        }
        .slick-dots li button:before {
          color: #f39c12;
          font-size: 12px;
          opacity: 0.5;
        }
        .slick-dots li.slick-active button:before {
          color: #f39c12;
          opacity: 1;
        }
        @media screen and (max-width: 620px) {
          .has-media {
            flex-direction: column !important;
          }
          .has-media .media-section {
            padding-right: 0 !important;
            margin-bottom: 15px;
            height: 200px;
          }
        }
      `}</style>
    </>
  );
}
