import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./component/CSS/carousel1.css";
import API_URL from "../ServiceModule/Service";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
 
const Carousel1 = () => {
  const [items, setItems] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesPerPage = 3;
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}featureVideo/getAll`);
        const result = await response.json();
        if (result.status) {
          const activeItems = result.data.filter(item => item.status === "active");
          setItems(activeItems);
        }
      } catch (error) {
        console.error("Error fetching carousel data:", error);
      }
    };
    fetchData();
  }, []);
 
  const totalPages = Math.ceil(items.length / slidesPerPage);
 
  const handleDotClick = (pageIndex) => {
    const slideIndex = pageIndex * slidesPerPage;
    setCurrentSlide(slideIndex);
  };
 
  const getCurrentPage = () => Math.floor(currentSlide / slidesPerPage);
 
  const goToPrev = () => {
    const newIndex = Math.max(currentSlide - slidesPerPage, 0);
    setCurrentSlide(newIndex);
  };
 
  const goToNext = () => {
    const maxIndex = Math.max(items.length - slidesPerPage, 0);
    const newIndex = Math.min(currentSlide + slidesPerPage, maxIndex);
    setCurrentSlide(newIndex);
  };
 
  const handleSlideChange = (index) => {
    // Always align to page start (e.g., 0, 3, 6)
    const pageStart = Math.floor(index / slidesPerPage) * slidesPerPage;
    setCurrentSlide(pageStart);
  };
 
  return (
    <div className="carousel__wrap">
      <div className="carousel__inner">
        <Carousel
          showThumbs={false}
          showStatus={false}
          infiniteLoop={true}
          centerMode
          centerSlidePercentage={100 / slidesPerPage}
          autoPlay={true}
          interval={2000}
          transitionTime={600}
          swipeable
          emulateTouch
          selectedItem={Math.min(currentSlide, items.length - 1)}
          onChange={handleSlideChange}
          showIndicators={false}
          renderArrowPrev={() => (
            <button
              className={`custom-arrow custom-arrow-left ${currentSlide === 0 ? "disabled" : ""}`}
              onClick={goToPrev}
              aria-label="Previous"
              disabled={currentSlide === 0}
            >
              <FaChevronLeft />
            </button>
          )}
          renderArrowNext={() => (
            <button
              className={`custom-arrow custom-arrow-right ${currentSlide + slidesPerPage >= items.length ? "disabled" : ""}`}
              onClick={goToNext}
              aria-label="Next"
              disabled={currentSlide + slidesPerPage >= items.length}
            >
              <FaChevronRight />
            </button>
          )}
        >
          {items.map((item, idx) => (
            <div className="carousel__slide-item" key={idx}>
              {item.video.endsWith(".mp4") ? (
                <video src={item.video} controls className="carousel__slide-item-media" />
              ) : (
                <img src={item.video} alt={item.subtitle} className="carousel__slide-item-media" />
              )}
            </div>
          ))}
        </Carousel>
 
        {items.length > slidesPerPage && (
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
  );
};
 
export default Carousel1;
 