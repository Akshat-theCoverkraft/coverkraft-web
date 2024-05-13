import React, { useState } from 'react';
import './CSS/carousel.css';
import { Card } from '@mui/material'
import profilePic from '../../Images/profilePic.png'
import rating from '../../Images/rating.png'

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // Starting with the first image

  // const images = [
  //   "https://images.pexels.com/photos/19682307/pexels-photo-19682307/free-photo-of-pink-flowers-on-a-shrub.jpeg",
  //   "https://images.pexels.com/photos/17617625/pexels-photo-17617625/free-photo-of-pink-chrysanthemum-flowers.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
  //   "https://images.pexels.com/photos/19598202/pexels-photo-19598202/free-photo-of-pink-hyndrangea-flowers.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
  //   // Add more image URLs here
  //   "https://images.pexels.com/photos/19598202/pexels-photo-19598202/free-photo-of-pink-hyndrangea-flowers.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
  //   "https://images.pexels.com/photos/19598202/pexels-photo-19598202/free-photo-of-pink-hyndrangea-flowers.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
  // ];
  const cards = [
    {
      "profilePic": "https://example.com/profile1.jpg",
      "name": "Gloria Rose",
      "rating": 4,
      "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod est nec nisi ultricies, non posuere elit tempor."
    },
    {
      "profilePic": "https://example.com/profile2.jpg",
      "name": "Gloria Rose",
      "rating": 5,
      "content": "Duis nec diam et urna lacinia pulvinar. Donec in purus a libero eleifend maximus nec nec nulla."
    },
    {
      "profilePic": "https://example.com/profile3.jpg",
      "name": "Alice Johnson",
      "rating": 3,
      "content": "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus nec quam in arcu fringilla rhoncus."
    },
    {
      "profilePic": "https://example.com/profile4.jpg",
      "name": "Bob Brown",
      "rating": 4,
      "content": "Fusce non turpis quis nisi venenatis egestas. Nunc mattis nulla a est hendrerit, sit amet suscipit quam finibus."
    },
    {
      "profilePic": "https://example.com/profile5.jpg",
      "name": "Emily Davis",
      "rating": 5,
      "content": "Vestibulum euismod nisl quis malesuada finibus. Sed ac magna id urna ullamcorper ultricies. Sed quis est lobortis, efficitur justo ac, luctus libero."
    }
  ]


  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === cards.length - 3 ? 0 : prevIndex + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? cards.length - 3 : prevIndex - 1));
  };

  return (
    <>
    <div className="carousel-container">
      <h1>Carousel</h1>
      <div className="wiper">
        <button className="wiper-button wiper-button__left" onClick={handlePrev}>
          <img src="https://www.iconpacks.net/icons/2/free-arrow-left-icon-3099-thumb.png" alt="left" />
        </button>
        <div className="wiper-wrapper">
          <ul className="wiper-track" style={{ transform: `translateX(-${(currentIndex * 0)}%)` }}>

            {cards.slice(currentIndex, currentIndex + 3).map((card, index) => (
              <div key={index} className={`wiper-item ${index === 1 ? 'center' : 'blur'}`}>
                <Card className='rounded-4' style={{ padding: '20px 40px', borderLeft: '15px solid #42988E' }}>
                  <img className="profile-pic" src={profilePic} alt={`Profile Pic ${index + 1}`} />
                  <h2 className="name mt-3" style={{ color: '#5F5F7E', fontSize: '24px' }}>{card.name}</h2>

                  {/* <div className="rating">
                    {Array.from({ length: card.rating }, (_, i) => (
                      <span key={i} className="star">&#9733;</span>
                    ))}
                  </div> */}
                  <img src={rating} />
                  <p className="content mt-3" style={{ color: '#5F5F7E', fontSize: '22px' }}>{card.content}</p>
                </Card>
              </div>
            ))}

          </ul>
        </div>
        <button className="wiper-button wiper-button__right" onClick={handleNext}>
          <img src="https://www.iconpacks.net/icons/2/free-arrow-right-icon-3098-thumb.png" alt="right" />
        </button>
      </div>
    </div>
    </>
  );
};

export default Carousel;
