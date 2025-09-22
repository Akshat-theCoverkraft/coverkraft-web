import React, { useEffect, useRef, useState, useCallback } from "react";
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
  const youtubeIframeRefs = useRef([]);
  const autoScrollRef = useRef(null);
  const [playingIndex, setPlayingIndex] = useState(null); // Track the currently playing video index

  // ✅ Function to stop all videos
  const stopAllVideos = useCallback(() => {
    // Stop all HTML5 videos
    videoRefs.current.forEach((video) => {
      if (video && video.tagName === "VIDEO" && !video.paused) {
        video.pause();
        video.currentTime = 0;
      }
    });

    // Stop all YouTube players
    ytPlayers.current.forEach((player) => {
      if (player && typeof player.stopVideo === "function") {
        try {
          const state = player.getPlayerState();
          if (
            state === window.YT?.PlayerState?.PLAYING ||
            state === window.YT?.PlayerState?.BUFFERING
          ) {
            player.stopVideo();
          }
        } catch (error) {
          console.warn("Error stopping YouTube player:", error);
        }
      }
    });

    setAutoScrollPaused(false);
  }, []);

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

<<<<<<< HEAD
=======
  // ✅ Auto scroll with video check
>>>>>>> d5b66266e6abe329df09b7d2c7ea7708d680e122
  useEffect(() => {
    if (!loading && items.length > slidesPerPage && !autoScrollPaused) {
      autoScrollRef.current = setInterval(() => {
        // Check if any video is playing before auto-scrolling
        const isAnyVideoPlaying =
          videoRefs.current.some(
            (video) => video && video.tagName === "VIDEO" && !video.paused
          ) ||
          ytPlayers.current.some((player) => {
            if (player && typeof player.getPlayerState === "function") {
              try {
                return (
                  player.getPlayerState() === window.YT?.PlayerState?.PLAYING
                );
              } catch (error) {
                return false;
              }
            }
            return false;
          });

        if (!isAnyVideoPlaying) {
          setCurrentSlide((prevSlide) => {
            const nextSlide = prevSlide + slidesPerPage;
            return nextSlide >= items.length ? 0 : nextSlide;
          });
        }
      }, 3000);
    }

    return () => clearInterval(autoScrollRef.current);
  }, [loading, items.length, autoScrollPaused, slidesPerPage]);

<<<<<<< HEAD
=======
  // ✅ YouTube API setup
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      // Clear existing players
      ytPlayers.current = [];

      videoRefs.current.forEach((iframe, idx) => {
        if (iframe && iframe.tagName === "IFRAME") {
          try {
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
          } catch (error) {
            console.warn(`Error initializing YouTube player ${idx}:`, error);
          }
        }
      });
    };

    // If YT is already loaded, initialize players
    if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady();
    }
  }, [items]);

>>>>>>> d5b66266e6abe329df09b7d2c7ea7708d680e122
  const totalPages = Math.ceil(items.length / slidesPerPage);
  const getCurrentPage = () => Math.floor(currentSlide / slidesPerPage);

  const handleDotClick = (pageIndex) => {
    stopAllVideos(); // Stop all videos before changing slide
    setCurrentSlide(pageIndex * slidesPerPage);
  };

  const goToPrev = () => {
    stopAllVideos(); // Stop all videos before changing slide
    setCurrentSlide(Math.max(currentSlide - slidesPerPage, 0));
  };

  const goToNext = () => {
    stopAllVideos(); // Stop all videos before changing slide
    const maxIndex = Math.max(items.length - slidesPerPage, 0);
    setCurrentSlide(Math.min(currentSlide + slidesPerPage, maxIndex));
  };

  const handleSlideChange = (index) => {
    // Stop all videos when slide changes
    stopAllVideos();
    const pageStart = Math.floor(index / slidesPerPage) * slidesPerPage;
    setCurrentSlide(pageStart);
  };

  // Centralized function to pause all videos
  const pauseAllVideos = (exceptIndex = null) => {
    videoRefs.current.forEach((video, idx) => {
<<<<<<< HEAD
      if (video && idx !== exceptIndex) {
=======
      if (
        video &&
        video.tagName === "VIDEO" &&
        idx !== playingIndex &&
        !video.paused
      ) {
>>>>>>> d5b66266e6abe329df09b7d2c7ea7708d680e122
        video.pause();
      }
    });
    youtubeIframeRefs.current.forEach((iframe, idx) => {
      if (iframe && idx !== exceptIndex) {
        // Use the YouTube Player API to pause the video
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
    });
  };

<<<<<<< HEAD
  const handleVideoPlay = (index) => {
    pauseAllVideos(index);
    setAutoScrollPaused(true);
    setPlayingIndex(index);
  };

  const handleVideoPause = () => {
    // Only set autoScrollPaused to false if no videos are playing
    const isAnyPlaying = videoRefs.current.some(
      (video) => video && !video.paused
    );
=======
    // Stop other YouTube players
    ytPlayers.current.forEach((player, idx) => {
      if (
        player &&
        idx !== playingIndex &&
        typeof player.stopVideo === "function"
      ) {
        try {
          const state = player.getPlayerState();
          if (
            state === window.YT.PlayerState.PLAYING ||
            state === window.YT.PlayerState.BUFFERING
          ) {
            player.stopVideo();
          }
        } catch (error) {
          console.warn(`Error stopping YouTube player ${idx}:`, error);
        }
      }
    });
  };

  const handleVideoPause = () => {
    // Check if any video is still playing
    const isAnyPlaying =
      videoRefs.current.some(
        (video) => video && video.tagName === "VIDEO" && !video.paused
      ) ||
      ytPlayers.current.some((player) => {
        if (player && typeof player.getPlayerState === "function") {
          try {
            return player.getPlayerState() === window.YT.PlayerState.PLAYING;
          } catch (error) {
            return false;
          }
        }
        return false;
      });

>>>>>>> d5b66266e6abe329df09b7d2c7ea7708d680e122
    if (!isAnyPlaying) {
      setAutoScrollPaused(false);
    }
    setPlayingIndex(null);
  };

<<<<<<< HEAD
  const isYouTubeUrl = (url) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };
=======
  // ✅ Cleanup effect to stop all videos when component unmounts or items change
  useEffect(() => {
    return () => {
      stopAllVideos();
    };
  }, [stopAllVideos]);

  // ✅ Effect to stop videos when currentSlide changes
  useEffect(() => {
    // Small delay to ensure slide transition is complete
    const timer = setTimeout(() => {
      stopAllVideos();
    }, 100);

    return () => clearTimeout(timer);
  }, [currentSlide, stopAllVideos]);

  const isYouTubeUrl = (url) =>
    url.includes("youtube.com") || url.includes("youtu.be");
>>>>>>> d5b66266e6abe329df09b7d2c7ea7708d680e122

  const convertToEmbedUrl = (url) => {
    try {
      if (url.includes("youtu.be")) {
        const videoId = url.split("/").pop().split("?")[0]; // Remove query params
        return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1`;
      } else if (url.includes("youtube.com/watch?v=")) {
        const videoId = new URL(url).searchParams.get("v");
        return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1`;
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
              onSwipeStart={stopAllVideos} // Stop videos on swipe
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
                          ref={(el) => (youtubeIframeRefs.current[idx] = el)}
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
                    ) : hasVideoContent ? (
                      // MP4 or other video format
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