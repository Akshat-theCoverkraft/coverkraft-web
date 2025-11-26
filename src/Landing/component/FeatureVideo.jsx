import React, { useEffect, useRef, useState, useCallback } from "react";

// Replace with your actual API_URL import
// import API_URL from "../ServiceModule/Service";
const API_URL = "https://devapi.thecoverkraft.com/";

export default function CaseStudiesCarousel() {
  const trackRef = useRef(null);
  const wrapperRef = useRef(null);
  const videoRefs = useRef([]);
  const ytPlayers = useRef([]);
  const autoScrollRef = useRef(null);

  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(6);
  const [autoScrollPaused, setAutoScrollPaused] = useState(false);

  const totalSlides = caseStudies.length;
  const totalPages = Math.ceil(totalSlides / cardsPerView);
  const showNavButtons = totalSlides > cardsPerView;

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

  // ✅ Fetch videos from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}featureVideo/getAll`);
        const result = await response.json();

        if (Array.isArray(result.data)) {
          const activeItems = result.data.filter(
            (item) => item.status === "active"
          );
          setCaseStudies(activeItems);
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

  const updateCardsPerView = () => {
    const width = window.innerWidth;
    if (width < 640) {
      setCardsPerView(1);
    } else if (width < 768) {
      setCardsPerView(2);
    } else if (width < 1024) {
      setCardsPerView(3);
    } else if (width < 1280) {
      setCardsPerView(4);
    } else if (width < 1536) {
      setCardsPerView(5);
    } else {
      setCardsPerView(6);
    }
  };

  const updateCarousel = () => {
    if (!trackRef.current || !wrapperRef.current) return;
    const containerWidth = wrapperRef.current.offsetWidth;
    const cardWidth = containerWidth / cardsPerView;

    trackRef.current.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  };

  const moveCarousel = (dir) => {
    stopAllVideos(); // Stop all videos before moving
    const maxIndex = totalSlides - cardsPerView;
    let newIndex = currentIndex + dir;

    if (newIndex < 0) newIndex = maxIndex;
    if (newIndex > maxIndex) newIndex = 0;

    setCurrentIndex(newIndex);
  };

  const goToPage = (page) => {
    stopAllVideos(); // Stop all videos before changing page
    let idx = page * cardsPerView;
    if (idx > totalSlides - cardsPerView) {
      idx = totalSlides - cardsPerView;
    }
    setCurrentIndex(idx);
  };

  // ✅ Handle video play
  const handleVideoPlay = (playingIndex) => {
    setAutoScrollPaused(true);

    // Stop other <video> tags
    videoRefs.current.forEach((video, idx) => {
      if (
        video &&
        video.tagName === "VIDEO" &&
        idx !== playingIndex &&
        !video.paused
      ) {
        video.pause();
        video.currentTime = 0;
      }
    });

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

  // ✅ Handle video pause
  const handleVideoPause = () => {
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

    if (!isAnyPlaying) {
      setAutoScrollPaused(false);
    }
  };

  // ✅ YouTube API setup
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
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

    if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady();
    }
  }, [caseStudies]);

  // ✅ Utility functions for YouTube
  const isYouTubeUrl = (url) =>
    url && (url.includes("youtube.com") || url.includes("youtu.be"));

  const convertToEmbedUrl = (url) => {
    try {
      if (url.includes("youtu.be")) {
        const videoId = url.split("/").pop().split("?")[0];
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

  useEffect(() => {
    updateCarousel();
  }, [currentIndex, cardsPerView]);

  // ✅ Auto scroll with video check
  useEffect(() => {
    if (!loading && totalSlides > cardsPerView && !autoScrollPaused) {
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
          moveCarousel(1);
        }
      }, 5000);
    }

    return () => clearInterval(autoScrollRef.current);
  }, [loading, totalSlides, autoScrollPaused, cardsPerView, currentIndex]);

  useEffect(() => {
    updateCardsPerView();
    const handleResize = () => {
      updateCardsPerView();
      updateCarousel();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [cardsPerView]);

  // ✅ Cleanup effect to stop all videos when component unmounts
  useEffect(() => {
    return () => {
      stopAllVideos();
    };
  }, [stopAllVideos]);

  // ✅ Effect to stop videos when currentSlide changes
  useEffect(() => {
    const timer = setTimeout(() => {
      stopAllVideos();
    }, 100);

    return () => clearTimeout(timer);
  }, [currentIndex, stopAllVideos]);

  const cardWidthPercent = 100 / cardsPerView;

  if (loading) {
    return (
      <div className="py-20 px-4 bg-black">
        <div className="max-w-[1600px] mx-auto text-center">
          <div className="text-white text-2xl">Loading featured videos...</div>
        </div>
      </div>
    );
  }

  if (caseStudies.length === 0) {
    return (
      <div className="py-20 px-4 bg-black">
        <div className="max-w-[1600px] mx-auto text-center">
          <div className="text-white text-2xl">No featured videos available.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 px-4 bg-black">
      <div className="max-w-[1600px] mx-auto text-center mb-24">
        <h1 className="text-center font-bold leading-tight">
          <span className="text-[#FF9906] text-3xl sm:text-4xl md:text-5xl">
            Pick a Policy & Get Covered
          </span>
        </h1>
      </div>

      <div className="relative px-4 sm:px-8 md:px-12 lg:px-16">
        {showNavButtons && (
          <button
            onClick={() => moveCarousel(-1)}
            className="absolute left-0 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 bg-[#8bc34a]/90 hover:bg-[#7cb342] text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg transition scale-100 hover:scale-110 z-30"
          >
            <svg
              fill="none"
              stroke="currentColor"
              className="w-6 h-6 sm:w-7 sm:h-7"
              viewBox="0 0 24 24"
            >
              <path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}

        <div className="pt-28 pb-12 -mt-20 -mb-12">
          <div ref={wrapperRef} className="overflow-visible">
            <div
              ref={trackRef}
              className="flex gap-4 sm:gap-5 md:gap-6 transition-all duration-500 ease-in-out"
              style={{ width: `${(totalSlides * 100) / cardsPerView}%` }}
            >
              {caseStudies.map((card, i) => {
                const videoSource =
                  card.video && card.video !== "null"
                    ? card.video
                    : card.youTubeLink;
                const hasVideoContent =
                  videoSource &&
                  videoSource.trim() !== "" &&
                  videoSource !== "null";

                return (
                  <div
                    key={i}
                    style={{
                      width: `calc(${cardWidthPercent}% - ${(cardsPerView - 1) * (cardsPerView >= 4 ? 24 : 20) / cardsPerView}px)`
                    }}
                    className={`h-[380px] relative rounded-2xl overflow-hidden bg-white cursor-pointer transition-all duration-500 group ${
                      i % 2 === 0 ? "mt-12 sm:mt-16 md:mt-20" : "mt-0"
                    } hover:scale-105 hover:z-40 hover:shadow-2xl hover:shadow-[#8bc34a]/30`}
                  >
                    {/* Video/Image Content */}
                    {hasVideoContent && isYouTubeUrl(videoSource) ? (
                      <div className="absolute inset-0 bg-black">
                        <iframe
                          ref={(el) => (videoRefs.current[i] = el)}
                          src={convertToEmbedUrl(videoSource)}
                          title={`YouTube video player ${i}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none'
                          }}
                        />
                      </div>
                    ) : hasVideoContent &&
                      videoSource.toLowerCase().endsWith(".mp4") ? (
                      <video
                        ref={(el) => (videoRefs.current[i] = el)}
                        src={videoSource}
                        controls
                        controlsList="nodownload"
                        onPlay={() => handleVideoPlay(i)}
                        onPause={handleVideoPause}
                        onEnded={handleVideoPause}
                        style={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          backgroundColor: 'black'
                        }}
                      />
                    ) : (
                      <img
                        src={card.image || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop"}
                        alt={card.title || card.subtitle}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 brightness-100"
                        style={{ filter: 'none' }}
                      />
                    )}

                    {/* Minimal bottom overlay - only for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                    {/* Text content - positioned at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 transform transition-all duration-500">
                      <div className="relative inline-block">
                        <h2 className="text-xl sm:text-2xl font-bold text-white relative z-10 drop-shadow-lg group-hover:text-[#8bc34a] transition-colors duration-300">
                          {card.title || card.subtitle || `Featured Video ${i + 1}`}
                        </h2>
                        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#8bc34a]/60 to-[#558b2f]/60 rounded-sm transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                      </div>

                      {/* Additional info on hover */}
                      {card.desc && (
                        <p className="text-base text-white/90 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                          {card.desc}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {showNavButtons && (
          <button
            onClick={() => moveCarousel(1)}
            className="absolute right-0 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 bg-[#8bc34a]/90 hover:bg-[#7cb342] text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg transition scale-100 hover:scale-110 z-30"
          >
            <svg
              fill="none"
              stroke="currentColor"
              className="w-6 h-6 sm:w-7 sm:h-7"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 sm:gap-3 mt-14">
          {[...Array(totalPages)].map((_, i) => {
            const active = Math.floor(currentIndex / cardsPerView) === i;
            return (
              <div
                key={i}
                onClick={() => goToPage(i)}
                className={`transition-all cursor-pointer ${
                  active
                    ? "w-8 sm:w-10 h-3 sm:h-3.5 bg-[#3b9eff] rounded-md"
                    : "w-3 sm:w-3.5 h-3 sm:h-3.5 bg-white/30 rounded-full hover:bg-white/50"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}