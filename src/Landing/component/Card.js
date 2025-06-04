<<<<<<< Updated upstream
import React, { useState, useEffect } from "react";
import {
  CardContent,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import { ChevronLeft, ChevronRight, Close } from "@mui/icons-material";
import "./CSS/service.css";
import API_URL from "../../ServiceModule/Service";
import { THEME_COLOR } from "../../constants";

const Job = () => {
  const [cardData, setCardData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({
    title: "",
    description: "",
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Cards to show per view based on screen size - Updated to show 3 cards on desktop
  const cardsPerView = isMobile ? 1 : isTablet ? 2 : 3;
  const maxIndex = Math.max(0, cardData.length - cardsPerView);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}tips/getAll`);
        const result = await response.json();
        if (result.status) {
          setCardData(result.data);
        } else {
          console.error("Error: Data not retrieved");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const openPopup = (card) => {
    setPopupContent({
      title: card.subtitle,
      description: card.description,
    });
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  // Close popup when clicking outside or pressing ESC
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closePopup();
      }
    };

    if (showPopup) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showPopup]);

  return (
    <div
      style={{
        marginTop: "80px",
        padding: "20px",
        backgroundColor: "#1a1a1a",
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <div style={styles.headerSection}>
        <Typography
          variant={isMobile ? "h5" : "h3"}
          gutterBottom
          style={{ color: "#FF9906", fontWeight: "bold" }}
        >
          BENEFITS
        </Typography>
        <Typography
          variant={isMobile ? "h6" : "h2"}
          className="mb-4 fw-bold"
          style={{ color: "#ffffff" }}
        >
          Why Prefer Coverkraft
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: isMobile ? "1rem" : "1.2rem",
            lineHeight: 1.7,
            maxWidth: "600px",
            margin: "0 auto",
            color: "#b0b0b0",
          }}
        >
          Choose us for personalized insurance solutions, exceptional customer
          care, and unwavering commitment to protecting what matters most to
          you.
        </Typography>
      </div>

      {/* Carousel Section */}
      <div style={styles.carouselSection}>
        <div style={styles.carouselContainer}>
          {/* Navigation Buttons */}
          {cardData.length > cardsPerView && (
            <>
              <IconButton
                onClick={prevSlide}
                disabled={currentIndex === 0}
                style={{
                  ...styles.navButton,
                  ...styles.prevButton,
                  opacity: currentIndex === 0 ? 0.3 : 1,
                }}
              >
                <ChevronLeft fontSize="large" style={{ color: "#FF9906" }} />
              </IconButton>

              <IconButton
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                style={{
                  ...styles.navButton,
                  ...styles.nextButton,
                  opacity: currentIndex >= maxIndex ? 0.3 : 1,
                }}
              >
                <ChevronRight fontSize="large" style={{ color: "#FF9906" }} />
              </IconButton>
            </>
          )}

          {/* Cards Container */}
          <div style={styles.cardsWrapper}>
            <div
              style={{
                ...styles.cardsContainer,
                transform: `translateX(-${
                  currentIndex * (100 / cardsPerView)
                }%)`,
              }}
            >
              {cardData.map((card) => (
                <div
                  key={card._id}
                  style={{
                    ...styles.cardSlide,
                    width: `${100 / cardsPerView}%`,
                  }}
                >
                  <div style={styles.cardWrapper}>
                    <div style={styles.cardBackground}></div>
                    <div style={styles.cardContainer}>
                      <div style={styles.flexItem}>
                        <img
                          src={card.icon}
                          alt="Icon"
                          style={styles.cardIcon}
                        />
                        <h3 style={styles.cardTitle}>{card.subtitle}</h3>
                      </div>
                      <CardDescription
                        text={card.description}
                        onReadMore={() => openPopup(card)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {cardData.length > cardsPerView && (
            <div style={styles.dotsContainer}>
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  style={{
                    ...styles.dot,
                    backgroundColor:
                      index === currentIndex ? "#FF9906" : "#666",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div style={styles.popupOverlay} onClick={closePopup}>
          <div
            className="popup-content"
            style={styles.popupContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.popupHeader}>
              <h3 style={styles.popupTitle}>{popupContent.title}</h3>
              <IconButton
                onClick={closePopup}
                size="small"
                style={styles.closeButton}
              >
                <Close style={{ color: "#ffffff" }} />
              </IconButton>
            </div>
            <p style={styles.popupDescription}>{popupContent.description}</p>
          </div>
        </div>
      )}
=======
import React, { useEffect, useState } from 'react';
import { Typography, Grid } from '@mui/material';
import API_URL from '../../ServiceModule/Service';
import IMAGE_PATH from '../../ServiceModule/imagePath';
import './CSS/service.css';

const JobCard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}our_job`)
      .then((res) => res.json())
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.textSection}>
        <Typography style={styles.benefitTag}>BENEFITS</Typography>
        <Typography style={styles.heading}>Why Prefer CoverKraft</Typography>
        <Typography style={styles.subText}>
          Choose us for personalized insurance solutions, exceptional customer care,
          and unwavering commitment to protecting what matters most to you.
        </Typography>
      </div>

      <Grid container spacing={3} justifyContent="center">
        {data.map((item, i) => (
          <Grid item key={i}>
            <div style={styles.cardOuter}>
              <div style={styles.gradientGlow}></div>
              <div style={styles.card}>
                <img
                  src={IMAGE_PATH + item.icon}
                  alt="card-icon"
                  style={styles.icon}
                />
                <Typography style={styles.title}>{item.title}</Typography>
                <Typography style={styles.description}>{item.description}</Typography>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
>>>>>>> Stashed changes
    </div>
  );
};

<<<<<<< Updated upstream
export default Job;

// 💡 Read More Component
const MAX_LENGTH = 100;

const CardDescription = ({ text, onReadMore }) => {
  const isLong = text.length > MAX_LENGTH;

  return (
    <div>
      <p style={styles.cardDescription}>
        {isLong ? `${text.slice(0, MAX_LENGTH)}...` : text}
      </p>
      {isLong && (
        <span onClick={onReadMore} style={styles.toggleText}>
          Read More
        </span>
      )}
    </div>
  );
};

// 💅 Styles - Updated for dark theme and better visibility
const styles = {
  headerSection: {
    textAlign: "center",
    marginBottom: "40px",
    padding: "0 20px",
  },
  carouselSection: {
    width: "100%",
    maxWidth: "1400px", // Increased for 3 cards
    margin: "0 auto",
  },
  carouselContainer: {
    position: "relative",
    width: "100%",
    padding: "0 60px",
  },
  navButton: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    backgroundColor: "#2d2d2d",
    border: "2px solid #FF9906",
    boxShadow: "0 4px 12px rgba(255,153,6,0.3)",
    width: "50px",
    height: "50px",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#FF9906",
      transform: "translateY(-50%) scale(1.05)",
      boxShadow: "0 6px 16px rgba(255,153,6,0.5)",
    },
  },
  prevButton: {
    left: "0px",
  },
  nextButton: {
    right: "0px",
  },
  cardsWrapper: {
    overflow: "hidden",
    borderRadius: "15px",
    width: "100%",
  },
  cardsContainer: {
    display: "flex",
    transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    width: "100%",
  },
  cardSlide: {
    padding: "0 12px", // Reduced padding for better spacing with 3 cards
    boxSizing: "border-box",
    flexShrink: 0,
  },
  cardWrapper: {
    position: "relative",
    width: "100%",
    height: "240px", // Slightly increased height
    borderRadius: "15px",
    overflow: "hidden",
  },
  cardBackground: {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    borderRadius: "15px",
    background:
      "linear-gradient(135deg, #FF9906 0%, #FF6B35 50%, #F7931E 100%)",
    zIndex: 1,
  },
  cardContainer: {
    position: "relative",
    zIndex: 2,
    backgroundColor: "#2d2d2d", // Dark background for better contrast
    borderRadius: "15px",
    padding: "20px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    transition: "all 0.3s ease",
    cursor: "pointer",
    border: "1px solid #404040",
    margin: "3px", // Small margin to show the gradient border
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 30px rgba(255,153,6,0.2)",
      borderColor: "#FF9906",
    },
  },
  flexItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px",
  },
  cardIcon: {
    width: "45px",
    height: "45px",
    objectFit: "contain",
    filter: "brightness(1.2)", // Make icons more visible
  },
  cardTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    margin: 0,
    color: "#ffffff", // White text for better visibility
    lineHeight: 1.3,
  },
  cardDescription: {
    fontSize: "0.95rem",
    color: "#e0e0e0", // Light gray for description text
    lineHeight: 1.5,
    margin: 0,
    flex: 1,
  },
  toggleText: {
    color: "#FF9906",
    fontSize: "0.9rem",
    cursor: "pointer",
    marginTop: "8px",
    display: "inline-block",
    transition: "all 0.3s ease",
    textDecoration: "underline",
    fontWeight: "500",
    "&:hover": {
      color: "#FFB84D",
      transform: "translateX(2px)",
    },
  },
  dotsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "30px",
  },
  dot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.3)",
    },
  },
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Darker overlay
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(5px)",
    animation: "fadeIn 0.3s ease-out",
  },
  popupContent: {
    backgroundColor: "#2d2d2d", // Dark theme for popup
    borderRadius: "16px",
    padding: "30px",
    maxWidth: "500px",
    width: "90%",
    maxHeight: "80vh",
    overflow: "auto",
    boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
    border: "1px solid #404040",
    transform: "scale(0.9)",
    animation: "popupScaleIn 0.3s ease-out forwards",
    position: "relative",
  },
  popupHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
    gap: "15px",
  },
  popupTitle: {
    fontSize: "1.6rem",
    fontWeight: "600",
    margin: 0,
    color: "#ffffff", // White text in popup
    lineHeight: 1.3,
  },
  closeButton: {
    color: "#ffffff",
    backgroundColor: "#404040",
    padding: "8px",
    borderRadius: "50%",
    "&:hover": {
      backgroundColor: "#FF9906",
      color: "#ffffff",
    },
  },
  popupDescription: {
    fontSize: "1.1rem",
    color: "#e0e0e0", // Light gray for popup description
    lineHeight: 1.6,
    margin: 0,
  },
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes popupScaleIn {
        from { 
            opacity: 0;
            transform: scale(0.8) translateY(20px); 
        }
        to { 
            opacity: 1;
            transform: scale(1) translateY(0); 
        }
    }
    
    /* Custom scrollbar for dark theme */
    .popup-content::-webkit-scrollbar {
        width: 8px;
    }
    
    .popup-content::-webkit-scrollbar-track {
        background: #404040;
        border-radius: 4px;
    }
    
    .popup-content::-webkit-scrollbar-thumb {
        background: #FF9906;
        border-radius: 4px;
    }
    
    .popup-content::-webkit-scrollbar-thumb:hover {
        background: #FFB84D;
    }
`;
document.head.appendChild(styleSheet);
=======
const styles = {
  wrapper: {
    padding: '50px 30px',
    backgroundColor: '#F8FAFC',
  },
  textSection: {
    maxWidth: 600,
    margin: '0 auto 50px auto',
    textAlign: 'center',
  },
  benefitTag: {
    color: '#FF9F0A',
    fontWeight: 700,
    fontSize: 16,
    letterSpacing: 1,
    marginBottom: 8,
  },
  heading: {
    fontSize: 32,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 12,
  },
  subText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 1.6,
  },
  cardOuter: {
    position: 'relative',
    width: 280,
    height: 180,
    margin: 16,
  },
  gradientGlow: {
    position: 'absolute',
    top: 0,
    left: -20,
    right: -20,
    bottom: 0,
    background: 'linear-gradient(135deg, #0fd88f, #42c2e6)',
    borderRadius: 30,
    filter: 'blur(50px)',
    opacity: 0.5,
    zIndex: 1,
  },
  card: {
    position: 'relative',
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    height: '100%',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.3s ease-in-out',
  },
  icon: {
    width: 48,
    height: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    color: '#111827',
    marginBottom: 6,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 1.4,
  },
};

export default JobCard;
>>>>>>> Stashed changes
