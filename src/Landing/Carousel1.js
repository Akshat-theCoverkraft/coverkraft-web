import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./component/CSS/carousel1.css";
import API_URL from "../ServiceModule/Service";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";

const Carousel1 = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}featureVideo/getAll`);
        const result = await response.json();
        if (result.status) {
          setItems(result.data);
        }
      } catch (error) {
        console.error("Error fetching carousel data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="carousel__wrap">
      <div className="carousel__inner">
        <Carousel
          showThumbs={false}
          showStatus={false}
          infiniteLoop
          centerMode
          centerSlidePercentage={33.33}
          autoPlay={false}
          swipeable
          emulateTouch
          renderIndicator={(onClickHandler, isSelected, index, label) => {
            return (
              <span
                className={`dot ${isSelected ? "active" : ""}`}
                onClick={onClickHandler}
                key={index}
                aria-label={`${label} ${index + 1}`}
              />
            );
          }}
          renderArrowPrev={(onClickHandler, hasPrev, label) =>
            hasPrev && (
              <button className="custom-arrow custom-arrow-left" onClick={onClickHandler} aria-label={label}>
              <FaChevronLeft />
              </button>
            )
          }
          renderArrowNext={(onClickHandler, hasNext, label) =>
            hasNext && (
              <button className="custom-arrow custom-arrow-right" onClick={onClickHandler} aria-label={label}>
                  <FaChevronRight  />

              </button>
            )
          }
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
      </div>
    </div>
  );
};

export default Carousel1;
