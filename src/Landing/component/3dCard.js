import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Modal,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import API_URL from '../../ServiceModule/Service';
import "./CSS/3dCard.css";

const CARD_WIDTH = 410;
const CARD_GAP = 28;
const CARDS_VISIBLE = 3;
const AUTO_SLIDE_INTERVAL = 5000;
const CARD_HEIGHT = 300; // fixed uniform height

const truncateText = (text, maxLength = 100) =>
  text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

const PolicyCard = ({ number, title, description, onSeeMore }) => {
  const isTruncated = description.length > 120;

  return (
    <Box
      position="relative"
      sx={{
        width: CARD_WIDTH,
        flexShrink: 0,
        height: CARD_HEIGHT,
      }}
    >
      <Typography
        component="div"
        sx={{
          position: 'absolute',
          top: '-10px',
          left: '-20px',
          fontSize: '60px',
          fontWeight: '900',
          color: 'transparent',
          WebkitTextStroke: '2px white',
          fontFamily: 'Bungee, sans-serif',
          zIndex: 2,
        }}
      >
        {number < 10 ? `0${number}` : number}
      </Typography>

      <Box className="policy-container" sx={{ height: '100%' }}>
        <Card
          className="text-white"
          sx={{
            background: 'linear-gradient(to right, #212121, #121212)',
            borderRadius: '25px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 3,
            position: 'relative',
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#fff', paddingLeft: "20px" }}>
              {title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '16px',
                color: '#ccc',
                lineHeight: '1.5',
                mt: 1,
                paddingLeft: "20px"
              }}
            >
              {truncateText(description, 120)}
            </Typography>

            {isTruncated && (
              <Typography
                onClick={onSeeMore}
                sx={{
                  color: '#5A9F1D',
                  cursor: 'pointer',
                  mt: 2,
                  fontWeight: 'bold',
                  fontSize: '14px',
                  paddingLeft: "70%",
                }}
              >
                See More...
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

const WhyCoverKraft = () => {
  const [cardData, setCardData] = useState([]);
  const [popupContent, setPopupContent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef(null);

  const totalPages = Math.ceil(cardData.length / CARDS_VISIBLE);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}tips/getAll`);
        const result = await response.json();
        if (result.status) {
          setCardData(result.data);
        } else {
          console.error('Error: Data not retrieved');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const openPopup = (card) => {
    setPopupContent({
      title: card.subtitle || 'Info',
      description: card.description,
    });
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupContent(null);
  };

  const handleDotClick = (page) => {
    setCurrentPage(page);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: page * (CARD_WIDTH + CARD_GAP) * CARDS_VISIBLE,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextPage = (currentPage + 1) % totalPages;
      handleDotClick(nextPage);
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [currentPage, cardData.length]);

  return (
    <Box sx={{ backgroundColor: '#121212', p: '60px 6%' }}>
      {/* Header */}
      <Box textAlign="center">
        <Typography variant="subtitle1" sx={{ color: '#f39c12', fontSize: '2.7rem', fontWeight: 600 }}>
          TIPS & TRICKS
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#ccc',
            maxWidth: '800px',
            mx: 'auto',
            fontSize: '18px',
          }}
        >
          Choose us for personalized solutions, exceptional customer care,
          and unwavering commitment to protecting what matters most to you.
        </Typography>
      </Box>

      {/* Card carousel */}
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: `${CARD_GAP}px`,
          mt: 6,
          px: 5,
          scrollBehavior: 'smooth',
          // maxWidth: `${(CARD_WIDTH + CARD_GAP) * CARDS_VISIBLE - CARD_GAP + 10}px`,
          mx: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {cardData.map((card, index) => (
          <PolicyCard
            key={index}
            number={index + 1}
            title={card.subtitle}
            description={card.description}
            onSeeMore={() => openPopup(card)}
          />
        ))}
      </Box>

      {/* Pagination Dots */}
      <Box display="flex" justifyContent="center" mt={3}>
        {Array.from({ length: totalPages }).map((_, i) => (
          <Box
            key={i}
            onClick={() => handleDotClick(i)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              mx: 1,
              cursor: 'pointer',
              backgroundColor: currentPage === i ? '#5A9F1D' : '#555',
              transition: '0.3s',
            }}
          />
        ))}
      </Box>

      {/* Popup */}
      <Modal open={showPopup} onClose={closePopup}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: '#212121',
            color: '#fff',
            p: 4,
            borderRadius: 2,
            width: 600,
            height: 400,
            boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.6)',
            overflow: 'hidden',
          }}
        >
          <IconButton
            onClick={closePopup}
            sx={{ position: 'absolute', top: 8, right: 8, color: '#fff' }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" mb={2} sx={{ paddingLeft: "50px" }}>
            {popupContent?.title}
          </Typography>
          <Box
            sx={{
              maxHeight: '300px',
              overflowY: 'auto',
              pr: 1,
              '&::-webkit-scrollbar': {
                width: 0,
              },
              scrollbarWidth: 'none',
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontSize: '16px', color: '#ccc', whiteSpace: 'pre-line' }}
            >
              {popupContent?.description}
            </Typography>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default WhyCoverKraft;
