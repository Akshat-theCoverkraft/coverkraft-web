import React, { useEffect, useRef, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./component/CSS/carousel1.css";
import API_URL from "../ServiceModule/Service";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Loader from "../component/Loader";

const Carousel1 = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoScrollPaused, setAutoScrollPaused] = useState(false);
  const slidesPerPage = 3;
  const videoRefs = useRef([]);
  const autoScrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}featureVideo/getAll`);
        const result = await response.json();

        if (Array.isArray(result.data)) {
          const activeItems = result.data.filter(
            (item) => item.status === "active"
          );
          setItems(activeItems);
        } else {
          console.error("Invalid data format from backend");
        }
      } catch (error) {
        console.error("Error fetching carousel data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && items.length > slidesPerPage && !autoScrollPaused) {
      autoScrollRef.current = setInterval(() => {
        setCurrentSlide((prevSlide) => {
          const nextSlide = prevSlide + slidesPerPage;
          return nextSlide >= items.length ? 0 : nextSlide;
        });
      }, 3000);
    }

    return () => clearInterval(autoScrollRef.current);
  }, [loading, items.length, autoScrollPaused]);

  const totalPages = Math.ceil(items.length / slidesPerPage);
  const getCurrentPage = () => Math.floor(currentSlide / slidesPerPage);

  const handleDotClick = (pageIndex) => {
    setCurrentSlide(pageIndex * slidesPerPage);
  };

  const goToPrev = () =>
    setCurrentSlide(Math.max(currentSlide - slidesPerPage, 0));
  const goToNext = () => {
    const maxIndex = Math.max(items.length - slidesPerPage, 0);
    setCurrentSlide(Math.min(currentSlide + slidesPerPage, maxIndex));
  };

  const handleSlideChange = (index) => {
    const pageStart = Math.floor(index / slidesPerPage) * slidesPerPage;
    setCurrentSlide(pageStart);
  };

  const handleVideoPlay = (playingIndex) => {
    setAutoScrollPaused(true);
    videoRefs.current.forEach((video, idx) => {
      if (video && idx !== playingIndex) {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  const handleVideoPause = () => {
    const isAnyPlaying = videoRefs.current.some(
      (video) => video && !video.paused && !video.ended
    );
    if (!isAnyPlaying) {
      setAutoScrollPaused(false);
    }
  };

  const isYouTubeUrl = (url) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const convertToEmbedUrl = (url) => {
    try {
      if (url.includes("youtu.be")) {
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

  return (
    <>
      <button
        className={`custom-arrow custom-arrow-left ${
          currentSlide === 0 ? "disabled" : ""
        }`}
        onClick={goToPrev}
        aria-label="Previous"
        disabled={currentSlide === 0}
      >
        <FaChevronLeft />
      </button>

      <div className="carousel__wrap">
        <div className="carousel__inner">
          {loading ? (
            <div className="carousel__loader-wrap">
              <Loader size={100} message="Loading video..." />
            </div>
          ) : items.length === 0 ? (
            <div className="carousel__loader-wrap">
              No featured videos available.
            </div>
          ) : (
            <Carousel
              showThumbs={false}
              showStatus={false}
              infiniteLoop={false}
              centerMode
              centerSlidePercentage={100 / slidesPerPage}
              autoPlay={false}
              transitionTime={600}
              swipeable
              emulateTouch
              selectedItem={Math.min(currentSlide, items.length - 1)}
              onChange={handleSlideChange}
              showIndicators={false}
              showArrows={false}
            >
              {items.map((item, idx) => {
                // Fix: Handle string "null" properly
                const videoSource =
                  item.video && item.video !== "null"
                    ? item.video
                    : item.youTubeLink;
                const hasVideoContent =
                  videoSource &&
                  videoSource.trim() !== "" &&
                  videoSource !== "null";

                console.log(
                  "Video source for item:",
                  idx,
                  videoSource,
                  isYouTubeUrl(videoSource),
                  videoSource.toLowerCase().endsWith(".mp4")
                );
                console.log("Item data:", item); // Debug log to see the actual data

                return (
                  <div className="carousel__slide-item" key={idx}>
                    {hasVideoContent && isYouTubeUrl(videoSource) ? (
                      // YouTube video
                      <div
                        className="carousel__slide-item-media"
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "12px",
                          overflow: "hidden",
                          background: "black",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                        }}
                      >
                        <iframe
                          src={convertToEmbedUrl(videoSource)}
                          title={`YouTube video player ${idx}`}
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
                    ) : hasVideoContent &&
                      videoSource.toLowerCase().endsWith(".mp4") ? (
                      // MP4 video
                      <video
                        ref={(el) => (videoRefs.current[idx] = el)}
                        src={videoSource}
                        controls
                        controlsList="nodownload"
                        className="carousel__slide-item-media"
                        onPlay={() => handleVideoPlay(idx)}
                        onPause={handleVideoPause}
                        onEnded={handleVideoPause}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          objectPosition: "center",
                          background: "black",
                          borderRadius: "12px",
                          padding: "0px",
                        }}
                      />
                    ) : hasVideoContent &&
                      (videoSource.toLowerCase().endsWith(".mov") ||
                        videoSource.toLowerCase().endsWith(".avi") ||
                        videoSource.toLowerCase().endsWith(".webm") ||
                        videoSource.toLowerCase().endsWith(".mkv")) ? (
                      // Other video formats
                      <video
                        ref={(el) => (videoRefs.current[idx] = el)}
                        src={videoSource}
                        controls
                        controlsList="nodownload"
                        className="carousel__slide-item-media"
                        onPlay={() => handleVideoPlay(idx)}
                        onPause={handleVideoPause}
                        onEnded={handleVideoPause}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          objectPosition: "center",
                          background: "black",
                          borderRadius: "12px",
                          padding: "0px",
                        }}
                      />
                    ) : (
                      // Fallback image
                      <img
                        src={require("../Images/CKanimation.gif")}
                        alt={item.subtitle || `Carousel item ${idx}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          objectPosition: "center",
                          background: "black",
                          borderRadius: "12px",
                          padding: "0px",
                        }}
                        className="carousel__slide-item-media"
                      />
                    )}
                  </div>
                );
              })}
            </Carousel>
          )}

          {!loading && items.length > slidesPerPage && (
            <div className="custom-pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <span
                  key={index}
                  className={`dot ${
                    getCurrentPage() === index ? "active" : ""
                  }`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        className={`custom-arrow custom-arrow-right ${
          currentSlide + slidesPerPage >= items.length ? "disabled" : ""
        }`}
        onClick={goToNext}
        aria-label="Next"
        disabled={currentSlide + slidesPerPage >= items.length}
      >
        <FaChevronRight />
      </button>
    </>
  );
};

export default Carousel1;
