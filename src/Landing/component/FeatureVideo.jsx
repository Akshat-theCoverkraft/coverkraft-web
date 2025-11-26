import React, { useEffect, useRef, useState, useCallback } from "react";
import API_URL from "../../ServiceModule/Service";



export default function CaseStudiesCarousel() {
  const trackRef = useRef(null);
  const wrapperRef = useRef(null);
  const videoRefs = useRef([]);
  const autoScrollTimer = useRef(null);

  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(6);
  const [autoScrollPaused, setAutoScrollPaused] = useState(false);

  const totalSlides = caseStudies.length;
  const totalPages = Math.ceil(totalSlides / cardsPerView);
  const showNavButtons = totalSlides > cardsPerView;

  /* Stop all videos */
  const stopAllVideos = useCallback(() => {
    videoRefs.current.forEach((video) => {
      if (video && video.pause) video.pause();
    });
  }, []);

  /* Fetch data */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}featureVideo/getAll`);
        const json = await res.json();
        const active = json?.data?.filter((x) => x.status === "active") || [];
        setCaseStudies(active);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* Cards per view responsive */
  const updateCardsPerView = () => {
    const w = window.innerWidth;
    if (w < 640) setCardsPerView(1);
    else if (w < 768) setCardsPerView(2);
    else if (w < 1024) setCardsPerView(3);
    else if (w < 1280) setCardsPerView(4);
    else if (w < 1536) setCardsPerView(5);
    else setCardsPerView(6);
  };

  /* Move Carousel */
  const moveCarousel = (dir) => {
    stopAllVideos();

    const maxIndex = Math.max(totalSlides - cardsPerView, 0);
    let newIndex = currentIndex + dir;

    if (newIndex < 0) newIndex = maxIndex;
    if (newIndex > maxIndex) newIndex = 0;

    setCurrentIndex(newIndex);
  };

  /* Go to page */
  const goToPage = (page) => {
    stopAllVideos();
    let idx = page * cardsPerView;
    if (idx > totalSlides - cardsPerView)
      idx = totalSlides - cardsPerView;

    setCurrentIndex(idx);
  };

  /* Detect YouTube */
  const isYouTubeUrl = (url) =>
    url?.includes("youtube.com") || url?.includes("youtu.be");

  const convertToEmbedUrl = (url) => {
    try {
      if (url.includes("youtu.be")) {
        const id = url.split("/").pop().split("?")[0];
        return `https://www.youtube.com/embed/${id}`;
      }
      if (url.includes("watch?v=")) {
        const id = new URL(url).searchParams.get("v");
        return `https://www.youtube.com/embed/${id}`;
      }
    } catch {}
    return url;
  };

  /* Handle video play */
  const handleVideoPlay = () => {
    setAutoScrollPaused(true);
  };

  /* Handle video pause */
  const handleVideoPause = () => {
    setAutoScrollPaused(false);
  };

  /* Handle video click */
  const handleVideoClick = (e, index) => {
    e.stopPropagation();
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  /* Scroll transform */
  useEffect(() => {
    if (!trackRef.current || !wrapperRef.current) return;

    const cardWidth = wrapperRef.current.offsetWidth / cardsPerView;
    trackRef.current.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  }, [currentIndex, cardsPerView]);

  /* Auto scroll */
  useEffect(() => {
    if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);

    if (!loading && totalSlides > cardsPerView && !autoScrollPaused) {
      autoScrollTimer.current = setInterval(() => moveCarousel(1), 5000);
    }

    return () => clearInterval(autoScrollTimer.current);
  }, [loading, cardsPerView, autoScrollPaused, currentIndex]);

  /* Resize listener */
  useEffect(() => {
    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  /* Reset index when cards per view changes */
  useEffect(() => setCurrentIndex(0), [cardsPerView]);

  if (loading)
    return <div className="py-20 text-center text-white bg-black">Loading…</div>;

  if (!caseStudies.length)
    return (
      <div className="py-20 text-center text-white bg-black">
        No featured videos.
      </div>
    );

  return (
    <div className="py-20 px-4 bg-black/90 relative">

      {/* BACKGROUND GRID OVERLAY – FIXED */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-[1600px] mx-auto text-center mb-24 relative z-10">
        <h1 className="text-[#FF9906] text-3xl sm:text-4xl md:text-5xl font-bold drop-shadow-lg">
          Pick a Policy & Get Covered
        </h1>
      </div>

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">

        {/* LEFT ARROW */}
        {showNavButtons && (
          <button
            onClick={() => moveCarousel(-1)}
            className="absolute left-0 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 bg-[#8bc34a]/90 hover:bg-[#7cb342] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition hover:scale-110 z-30"
          >
            <svg fill="none" stroke="currentColor" className="w-6 h-6">
              <path d="M15 19l-7-7 7-7" strokeWidth="2" />
            </svg>
          </button>
        )}

        <div className="pt-28 pb-12 -mt-20 -mb-12">
          <div ref={wrapperRef} className="overflow-visible">
            <div
              ref={trackRef}
              className="flex gap-6 transition-all duration-500 ease-in-out"
            >
              {caseStudies.map((card, i) => {
                const src = card.video !== "null" ? card.video : card.youTubeLink;
                const isYT = isYouTubeUrl(src);

                return (
                  <div
                    key={i}
                    onMouseEnter={() => setAutoScrollPaused(true)}
                    onMouseLeave={() => setAutoScrollPaused(false)}
                    onTouchStart={() => setAutoScrollPaused(true)}
                    onTouchEnd={() => setAutoScrollPaused(false)}
                    className={`flex-shrink-0 h-[380px] relative rounded-2xl overflow-hidden bg-white cursor-pointer transition-all duration-500 group 
                    ${i % 2 === 0 ? "mt-16" : "mt-0"} 
                    hover:scale-105 hover:z-40 hover:shadow-2xl hover:shadow-[#8bc34a]/30`}
                    style={{ width: `${100 / cardsPerView}%` }}
                  >
                    {isYT ? (
                      <iframe
                        src={convertToEmbedUrl(src)}
                        className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110"
                        allow="autoplay; encrypted-media"
                        title={card.title}
                      ></iframe>
                    ) : card.video?.endsWith(".mp4") ? (
                      <video
                        ref={(el) => (videoRefs.current[i] = el)}
                        src={src}
                        className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110"
                        controls
                        playsInline
                        onPlay={handleVideoPlay}
                        onPause={handleVideoPause}
                        onClick={(e) => handleVideoClick(e, i)}
                      />
                    ) : (
                      <img
                        src={card.image}
                        className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110"
                        alt="cover"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                      <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg group-hover:text-[#8bc34a] transition-colors">
                        {card.title}
                      </h2>

                      {card.desc && (
                        <p className="text-base text-white/90 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
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

        {/* RIGHT ARROW */}
        {showNavButtons && (
          <button
            onClick={() => moveCarousel(1)}
            className="absolute right-0 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 bg-[#8bc34a]/90 hover:bg-[#7cb342] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition hover:scale-110 z-30"
          >
            <svg fill="none" stroke="currentColor" className="w-6 h-6">
              <path d="M9 5l7 7-7 7" strokeWidth="2" />
            </svg>
          </button>
        )}
      </div>

      {/* DOTS */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 gap-3">
          {Array.from({ length: totalPages }).map((_, i) => {
            const active = Math.floor(currentIndex / cardsPerView) === i;
            return (
              <div
                key={i}
                onClick={() => goToPage(i)}
                className={`cursor-pointer transition-all ${
                  active
                    ? "w-10 h-3 bg-[#3b9eff] rounded-md"
                    : "w-3 h-3 bg-black/20 rounded-full"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}