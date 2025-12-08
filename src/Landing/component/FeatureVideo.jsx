import React, { useEffect, useRef, useState } from "react";
import API_URL from "../../ServiceModule/Service";

let YT_API_READY = false;

function loadYouTubeAPI(callback) {
  if (window.YT && window.YT.Player) {
    YT_API_READY = true;
    return callback();
  }
  
  if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
    const checkReady = setInterval(() => {
      if (window.YT && window.YT.Player) {
        YT_API_READY = true;
        clearInterval(checkReady);
        callback();
      }
    }, 100);
    return;
  }

  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
  window.onYouTubeIframeAPIReady = () => {
    YT_API_READY = true;
    callback();
  };
}

export default function CaseStudiesCarousel() {
  const trackRef = useRef(null);
  const wrapperRef = useRef(null);
  const videoRefs = useRef({});
  const ytPlayersRef = useRef({});

  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(6);
  const [autoScrollPaused, setAutoScrollPaused] = useState(false);

  const totalSlides = caseStudies.length;
  const totalPages = Math.ceil(totalSlides / cardsPerView);
  const showNavButtons = true; // Always show navigation buttons

  // Fetch case studies
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}featureVideo/getAll`);
        const json = await res.json();
        const active = json?.data?.filter((x) => x.status === "active") || [];
        setCaseStudies(active);
      } catch (err) {
        console.error("Fetch Failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Responsive cards per view
  const updateCardsPerView = () => {
    const w = window.innerWidth;
    if (w < 560) setCardsPerView(1);
    else if (w < 768) setCardsPerView(2);
    else if (w < 1024) setCardsPerView(3);
    else if (w < 1280) setCardsPerView(4);
    else if (w < 1536) setCardsPerView(5);
    else setCardsPerView(6);
  };

  useEffect(() => {
    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  useEffect(() => setCurrentIndex(0), [cardsPerView]);

  // CRITICAL: Stop all videos function
  const stopAllVideos = () => {
    // Stop HTML5 videos
    Object.values(videoRefs.current).forEach((video) => {
      if (video && video.pause && typeof video.pause === 'function') {
        try {
          if (!video.paused) video.pause();
        } catch (e) {
          console.log('Error pausing HTML5 video:', e);
        }
      }
    });

    // Stop YouTube players
    Object.values(ytPlayersRef.current).forEach((player) => {
      if (player && player.pauseVideo && typeof player.pauseVideo === 'function') {
        try {
          player.pauseVideo();
        } catch (e) {
          console.log('Error pausing YouTube video:', e);
        }
      }
    });
  };

  // Handle video play
  const handleVideoPlay = (index, type) => {
    console.log(`Video ${index} (${type}) started playing`);
    
    // Stop all OTHER videos
    Object.entries(videoRefs.current).forEach(([key, video]) => {
      if (parseInt(key) !== index && video && video.pause && !video.paused) {
        video.pause();
      }
    });

    Object.entries(ytPlayersRef.current).forEach(([key, player]) => {
      if (parseInt(key) !== index && player && player.pauseVideo) {
        try {
          player.pauseVideo();
        } catch (e) {
          console.log('Error pausing YT player:', e);
        }
      }
    });
  };

  // Move carousel
  const moveCarousel = (dir) => {
    stopAllVideos();
    const maxIndex = Math.max(totalSlides - cardsPerView, 0);
    let newIndex = currentIndex + dir;
    if (newIndex < 0) newIndex = maxIndex;
    if (newIndex > maxIndex) newIndex = 0;
    setCurrentIndex(newIndex);
  };

  const goToPage = (page) => {
    stopAllVideos();
    let idx = page * cardsPerView;
    if (idx > totalSlides - cardsPerView) idx = totalSlides - cardsPerView;
    if (idx < 0) idx = 0;
    setCurrentIndex(idx);
  };

  // Scroll transform
  useEffect(() => {
    if (!trackRef.current || !wrapperRef.current) return;
    const cardWidth = wrapperRef.current.offsetWidth / cardsPerView;
    trackRef.current.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  }, [currentIndex, cardsPerView]);

  // Auto-scroll
  useEffect(() => {
    if (!loading && totalSlides > cardsPerView && !autoScrollPaused) {
      const timer = setInterval(() => moveCarousel(1), 4500);
      return () => clearInterval(timer);
    }
  }, [loading, autoScrollPaused, currentIndex, cardsPerView, totalSlides]);

  // YouTube detection
  const isYouTubeUrl = (url) =>
    url?.includes("youtube.com") || url?.includes("youtu.be");

  const extractYouTubeVideoId = (url) => {
    try {
      if (url.includes("youtu.be")) {
        return url.split("/").pop().split("?")[0];
      }
      if (url.includes("watch?v=")) {
        return new URL(url).searchParams.get("v");
      }
      if (url.includes("/embed/")) {
        return url.split("/embed/")[1].split("?")[0];
      }
    } catch {}
    return null;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            {/* Spinner */}
            <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#5a9e1e] rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-xl font-semibold animate-pulse">Loading Videos...</p>
        </div>
      </div>
    );
  }

  if (!caseStudies.length) {
    return (
      <div className="py-20 text-center text-white bg-black">
        No featured videos.
      </div>
    );
  }

  return (
    <div className="py-16 px-4 bg-black relative">
      <div className="relative max-w-[1600px] mx-auto px-3 sm:px-8">
        {/* LEFT ARROW */}
        <button
          onClick={() => moveCarousel(-1)}
          disabled={totalSlides <= cardsPerView}
          className={`absolute left-0 top-1/2 -translate-y-1/2 text-white w-14 h-14 rounded-full flex items-center justify-center transition-all z-30 border-2 
            ${totalSlides <= cardsPerView 
              ? 'bg-gray-700 border-gray-600 cursor-not-allowed opacity-50' 
              : 'bg-gradient-to-br from-[#5a9e1e] to-[#4a8519] hover:from-[#6bb023] hover:to-[#5a9e1e] shadow-[0_8px_20px_rgba(90,158,30,0.5)] hover:scale-110 hover:shadow-[0_12px_30px_rgba(90,158,30,0.7)] border-[#6bb023]/30'
            }`}
        >
          ❮
        </button>

        {/* CAROUSEL */}
        <div className="pt-20 pb-10">
          <div ref={wrapperRef} className="overflow-visible">
            <div
              ref={trackRef}
              className="flex gap-6 transition-all duration-500 ease-in-out"
              style={{ touchAction: "pan-y" }}
            >
              {caseStudies.map((card, i) => {
                const src = (card.video !== "null" && card.video) ? card.video : card.youTubeLink;
                const isYT = isYouTubeUrl(src) || card.mediaType === "youtubelink";

                return (
                  <div
                    key={card._id || i}
                    onMouseEnter={() => setAutoScrollPaused(true)}
                    onMouseLeave={() => setAutoScrollPaused(false)}
                    onTouchStart={() => setAutoScrollPaused(true)}
                    onTouchEnd={() => setAutoScrollPaused(false)}
                    className={`flex-shrink-0 h-[360px] relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black cursor-pointer transition-all duration-500 group 
                      ${i % 2 === 0 ? "mt-12" : "mt-0"} 
                      shadow-[0_8px_30px_rgb(0,0,0,0.5)] 
                      hover:scale-105 hover:z-40 
                      hover:shadow-[0_20px_60px_rgba(90,158,30,0.4),0_0_40px_rgba(90,158,30,0.2)] 
                      border-2 border-gray-700/50 hover:border-[#5a9e1e]/50`}
                    style={{ width: `${100 / cardsPerView}%` }}
                  >
                    {isYT ? (
                      <div 
                        className="w-full h-full bg-gray-900"
                        ref={(containerEl) => {
                          if (!containerEl || ytPlayersRef.current[i]) return;

                          const divId = `yt-player-${card._id || i}`;
                          
                          // Create the div for YouTube player immediately
                          if (!document.getElementById(divId)) {
                            containerEl.innerHTML = `<div id="${divId}" class="w-full h-full"></div>`;
                          }

                          // Initialize YouTube Player with minimal delay
                          setTimeout(() => {
                            loadYouTubeAPI(() => {
                              const targetDiv = document.getElementById(divId);
                              if (!targetDiv || ytPlayersRef.current[i]) return;

                              const videoId = extractYouTubeVideoId(src);
                              if (!videoId) return;

                              try {
                                const player = new window.YT.Player(divId, {
                                  height: '100%',
                                  width: '100%',
                                  videoId: videoId,
                                  playerVars: {
                                    enablejsapi: 1,
                                    origin: window.location.origin,
                                    rel: 0,
                                    modestbranding: 1
                                  },
                                  events: {
                                    onStateChange: (event) => {
                                      if (event.data === 1) {
                                        handleVideoPlay(i, "youtube");
                                      }
                                    }
                                  }
                                });
                                
                                ytPlayersRef.current[i] = player;
                              } catch (e) {
                                console.error('YouTube player init error:', e);
                              }
                            });
                          }, 100);
                        }}
                      />
                    ) : card.video?.endsWith(".mp4") ? (
                      <video
                        ref={(el) => {
                          if (el) videoRefs.current[i] = el;
                        }}
                        src={src}
                        controls
                        playsInline
                        preload="metadata"
                        onPlay={() => handleVideoPlay(i, "video")}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={card.image}
                        className="w-full h-full object-cover"
                        alt={card.subtitle || "cover"}
                        loading="lazy"
                      />
                    )}

                    {/* TEXT OVERLAY */}
                    <div
                      className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent"
                      style={{ pointerEvents: "none" }}
                    >
                      <div className="relative z-10">
                        <h2 className="text-xl font-bold text-white drop-shadow-lg">
                          {card.subtitle || card.title}
                        </h2>
                        {card.desc && (
                          <p className="text-white/90 text-sm mt-2 drop-shadow-md">{card.desc}</p>
                        )}
                      </div>
                      {/* Decorative line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5a9e1e] via-[#6bb023] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT ARROW */}
        <button
          onClick={() => moveCarousel(1)}
          disabled={totalSlides <= cardsPerView}
          className={`absolute right-0 top-1/2 -translate-y-1/2 text-white w-14 h-14 rounded-full flex items-center justify-center transition-all z-30 border-2 
            ${totalSlides <= cardsPerView 
              ? 'bg-gray-700 border-gray-600 cursor-not-allowed opacity-50' 
              : 'bg-gradient-to-br from-[#5a9e1e] to-[#4a8519] hover:from-[#6bb023] hover:to-[#5a9e1e] shadow-[0_8px_20px_rgba(90,158,30,0.5)] hover:scale-110 hover:shadow-[0_12px_30px_rgba(90,158,30,0.7)] border-[#6bb023]/30'
            }`}
        >
          ❯
        </button>
      </div>

      {/* PAGINATION DOTS */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-3">
          {Array.from({ length: totalPages }).map((_, i) => {
            const active = Math.floor(currentIndex / cardsPerView) === i;
            return (
              <div
                key={i}
                onClick={() => goToPage(i)}
                className={`cursor-pointer transition-all ${
                  active
                    ? "w-10 h-3 bg-[#5a9e1e] rounded-md shadow-[0_0_10px_rgba(90,158,30,0.5)]"
                    : "w-3 h-3 bg-white/20 rounded-full hover:bg-white/40"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}