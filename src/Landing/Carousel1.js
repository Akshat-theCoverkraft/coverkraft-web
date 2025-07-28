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
  const slidesPerPage = 3;
  const videoRefs = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}featureVideo/getAll`);
        const result = await response.json();

        if (Array.isArray(result.data)) {
          const activeItems = result.data.filter(item => item.status === 'active');
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

  const totalPages = Math.ceil(items.length / slidesPerPage);
  const getCurrentPage = () => Math.floor(currentSlide / slidesPerPage);

  const handleDotClick = (pageIndex) => {
    const slideIndex = pageIndex * slidesPerPage;
    setCurrentSlide(slideIndex);
  };

  const goToPrev = () => setCurrentSlide(Math.max(currentSlide - slidesPerPage, 0));
  const goToNext = () => {
    const maxIndex = Math.max(items.length - slidesPerPage, 0);
    setCurrentSlide(Math.min(currentSlide + slidesPerPage, maxIndex));
  };

  const handleSlideChange = (index) => {
    const pageStart = Math.floor(index / slidesPerPage) * slidesPerPage;
    setCurrentSlide(pageStart);
  };

  const handleVideoPlay = (playingIndex) => {
    videoRefs.current.forEach((video, idx) => {
      if (video && idx !== playingIndex) {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  return (
    <>
      <button
        className={`custom-arrow custom-arrow-left ${currentSlide === 0 ? "disabled" : ""}`}
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
            <div className="carousel__no-data">No featured videos available.</div>
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
              {items.map((item, idx) => (
                <div className="carousel__slide-item" key={idx}>
                  {item.video.endsWith(".mp4") ? (
                    <video
                      ref={(el) => (videoRefs.current[idx] = el)}
                      src={item.video}
                      controls
                      controlsList="nodownload" 
                      className="carousel__slide-item-media"
                      onPlay={() => handleVideoPlay(idx)}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        objectPosition: 'center',
                        background: "black",
                        borderRadius: '12px',
                        padding:"0px !important"
                      }}
                    />
                  ) : (
                    <img
                      src={item.video}
                      alt={item.subtitle}
                      className="carousel__slide-item-media"
                    />
                  )}
                </div>
              ))}
            </Carousel>
          )}

          {!loading && items.length > slidesPerPage && (
            <div className="custom-pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <span
                  key={index}
                  className={`dot ${getCurrentPage() === index ? "active" : ""}`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        className={`custom-arrow custom-arrow-right ${currentSlide + slidesPerPage >= items.length ? "disabled" : ""}`}
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