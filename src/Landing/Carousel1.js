import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import "./component/CSS/carousel1.css";
import API_URL from "../ServiceModule/Service";

const Carousel1 = () => {
  const [items, setItems] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}featureVideo/getAll`);
        const result = await response.json();
        if (result.status) {
          const activeItems = result.data.filter(item => item.status === "inactive");
          setItems(activeItems);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const goToIdx = (idx) => {
    setActiveIdx(idx % items.length);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => goToIdx(activeIdx + 1),
    onSwipedRight: () => goToIdx((activeIdx - 1 + items.length) % items.length),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });
    return (
  <div className="carousel__wrap">
    <div className="carousel__inner">
      <ul className="carousel__slide-list" {...handlers}>
        {items.map((item, idx) => (
          <li
            className="carousel__slide-item"
            key={idx}
            style={{
              transform: `translateX(-${activeIdx * (100 / 3)}%)`,
              transition: "transform 0.5s ease-in-out",
            }}
          >
            <div className="carousel__slide-content">
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
            </div>
          </li>
        ))}
      </ul>
    </div>

    <div className="carousel__dots">
      {items.map((_, idx) => (
        <span
          key={idx}
          className={`dot ${idx === activeIdx ? "active playing" : ""}`}
          onClick={() => goToIdx(idx)}
          style={{ backgroundColor: idx === activeIdx ? "orange" : "#444" }}
        />
      ))}
    </div>
  </div>

  );
};

export default Carousel1;
