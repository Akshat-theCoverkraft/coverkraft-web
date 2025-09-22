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
  const [slidesPerPage, setSlidesPerPage] = useState(3);

  const videoRefs = useRef([]);
  const ytPlayers = useRef([]);
  const autoScrollRef = useRef(null);

  // ✅ Responsive slidesPerPage
  useEffect(() => {
    const updateSlidesPerPage = () => {
      if (window.innerWidth < 768) {
        setSlidesPerPage(1); // Mobile
      } else if (window.innerWidth < 1024) {
        setSlidesPerPage(2); // Tablet
      } else {
        setSlidesPerPage(3); // Desktop
      }
    };

    updateSlidesPerPage();
    window.addEventListener("resize", updateSlidesPerPage);
    return () => window.removeEventListener("resize", updateSlidesPerPage);
  }, []);

  // ✅ Fetch videos
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

  // ✅ Auto scroll
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
  }, [loading, items.length, autoScrollPaused, slidesPerPage]);

  // ✅ YouTube API setup
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      videoRefs.current.forEach((iframe, idx) => {
        if (iframe && iframe.tagName === "IFRAME") {
          ytPlayers.current[idx] = new window.YT.Player(iframe, {
            events: {
              onStateChange: (event) => {
                if (event.data === window.YT.PlayerState.PLAYING) {
                  handleVideoPlay(idx);
                }
                if (
                  event.data === window.YT.PlayerState.PAUSED ||
                  event.data === window.YT.PlayerState.ENDED
                ) {
                  handleVideoPause();
                }
              },
            },
          });
        }
      });
    };
  }, [items]);

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

  // ✅ Stop all other videos when one starts
  const handleVideoPlay = (playingIndex) => {
    setAutoScrollPaused(true);

    // Stop other <video> tags
    videoRefs.current.forEach((video, idx) => {
      if (video && video.tagName === "VIDEO" && idx !== playingIndex) {
        video.pause();
        video.currentTime = 0;
      }
    });

    // Stop other YouTube players
    ytPlayers.current.forEach((player, idx) => {
      if (player && idx !== playingIndex) {
        player.stopVideo();
      }
    });
  };

  const handleVideoPause = () => {
    const isAnyPlaying =
      videoRefs.current.some(
        (video) => video && video.tagName === "VIDEO" && !video.paused
      ) ||
      ytPlayers.current.some(
        (player) => player && player.getPlayerState() === window.YT.PlayerState.PLAYING
      );

    if (!isAnyPlaying) {
      setAutoScrollPaused(false);
    }
  };

  const isYouTubeUrl = (url) =>
    url.includes("youtube.com") || url.includes("youtu.be");

  const convertToEmbedUrl = (url) => {
    try {
      if (url.includes("youtu.be")) {
        const videoId = url.split("/").pop();
        return `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
      } else if (url.includes("youtube.com/watch?v=")) {
        const videoId = new URL(url).searchParams.get("v");
        return `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
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
                const videoSource =
                  item.video && item.video !== "null"
                    ? item.video
                    : item.youTubeLink;
                const hasVideoContent =
                  videoSource &&
                  videoSource.trim() !== "" &&
                  videoSource !== "null";

                return (
                  <div className="carousel__slide-item" key={idx}>
                    {hasVideoContent && isYouTubeUrl(videoSource) ? (
                      <div className="carousel__slide-item-media youtube">
                        <iframe
                          ref={(el) => (videoRefs.current[idx] = el)}
                          src={convertToEmbedUrl(videoSource)}
                          title={`YouTube video player ${idx}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            borderRadius: "12px",
                            background: "black",
                          }}
                        />
                      </div>
                    ) : hasVideoContent &&
                      videoSource.toLowerCase().endsWith(".mp4") ? (
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
                          background: "black",
                          borderRadius: "12px",
                        }}
                      />
                    ) : (
                      <img
                        src={require("../Images/CKanimation.gif")}
                        alt={item.subtitle || `Carousel item ${idx}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          background: "black",
                          borderRadius: "12px",
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
