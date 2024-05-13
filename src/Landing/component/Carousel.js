import React, { useState } from 'react';
import './CSS/carousel.css';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // Starting with the first image

  const images = [
    "https://images.pexels.com/photos/19682307/pexels-photo-19682307/free-photo-of-pink-flowers-on-a-shrub.jpeg",
    "https://images.pexels.com/photos/17617625/pexels-photo-17617625/free-photo-of-pink-chrysanthemum-flowers.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
    "https://images.pexels.com/photos/19598202/pexels-photo-19598202/free-photo-of-pink-hyndrangea-flowers.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  return (
    <div className="carousel-container">
      <h1>Carousel</h1>
      <div className="wiper">
        <button className="wiper-button wiper-button__right" onClick={handleNext}>
          <img src="https://www.iconpacks.net/icons/2/free-arrow-left-icon-3099-thumb.png" alt="right" />
        </button>
        <div className="wiper-wrapper">
          <ul className="wiper-track" style={{ transform: `translateX(-${(currentIndex * 100)}%)` }}>
            {images.map((image, index) => (
              <li key={index} className={`wiper-item ${index === 1 ? 'active-swipe' : (index === 0 || index === 2) ? 'blur' : ''}`}>
                <img className="wiper__image" src={image} alt={`Image ${index + 1}`} />
                <button className="swiper__image-button">Click me</button>
              </li>
            ))}
          </ul>
        </div>
        <button className="wiper-button wiper-button__left" onClick={handlePrev}>
          <img src="https://www.iconpacks.net/icons/2/free-arrow-left-icon-3099-thumb.png" alt="left" />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
