import React, { useState, useEffect } from "react";
import "./component/CSS/carousel1.css";
import API_URL from "../ServiceModule/Service";
import IMAGE_PATH from "../ServiceModule/imagePath";

const Carousel1 = () => {
  const [items, setItems] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}featureVideo/getAll`);
        const result = await response.json();
        if (result.status) {
          setItems(result.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const prevSlide = () => {
    setActiveIdx((prevIdx) => (prevIdx - 1 + items.length) % items.length);
  };

  const nextSlide = () => {
    setActiveIdx((prevIdx) => (prevIdx + 1) % items.length);
  };

  return (
    <div className="carousel__wrap">
      <div className="carousel__inner">
        <button className="carousel__btn carousel__btn--prev" onClick={prevSlide}>
          <i className="carousel__btn-arrow carousel__btn-arrow--left"></i>
        </button>

        <ul className="carousel__slide-list">
          {items.map((item, idx) => (
            <li
              className="carousel__slide-item"
              key={idx}
              style={{
                transform: `translateX(-${activeIdx * (100 / 3)}%)`,
                transition: "transform 0.5s ease-in-out"
              }}
            >
              {item.video.endsWith(".mp4") ? (
                <video
                  controls
                  src={item.video}
                  className="carousel__slide-item-media"
                />
              ) : (
                <img
                  src={item.video}
                  alt={item.subtitle}
                  className="carousel__slide-item-media"
                />
              )}
              <div className="carousel-play-icon">▶</div>
            </li>
          ))}
        </ul>

        <button className="carousel__btn carousel__btn--next" onClick={nextSlide}>
          <i className="carousel__btn-arrow carousel__btn-arrow--right"></i>
        </button>
      </div>

      <div className="carousel__dots">
        {items.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === activeIdx ? "active playing" : ""}`}
            onClick={() => setActiveIdx(idx)}
            style={{ backgroundColor: idx === activeIdx ? "orange" : "#444" }}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel1;