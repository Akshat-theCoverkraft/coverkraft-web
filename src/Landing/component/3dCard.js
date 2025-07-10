import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Modal,
  IconButton,
  useMediaQuery,
  Skeleton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Carousel } from 'react-responsive-carousel';
import API_URL from '../../ServiceModule/Service';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const CARD_WIDTH = 420;
const CARD_HEIGHT = 180;

const truncateText = (text, maxLength = 100) =>
  text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

const PolicyCard = ({ number, title, description, onSeeMore }) => {
  const isTruncated = description.length > 120;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: CARD_WIDTH,
        height: CARD_HEIGHT + 15,
        mx: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        flex: '1 1 auto',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '0px',
          left: '-50px',
          width: CARD_HEIGHT + 15,
          height: CARD_HEIGHT + 15,
          borderRadius: '50%',
          backgroundColor: '#33a26e',
          zIndex: 1,
        }}
      />

      <Typography
        sx={{
          position: 'absolute',
          top: '20px',
          left: '-15px',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '36px',
          color: 'transparent',
          WebkitTextStroke: '2px white',
          fontWeight: 900,
          zIndex: 3,
        }}
      >
        {number < 10 ? `0${number}` : number}
      </Typography>

      <Box
        sx={{
          position: 'relative',
          background: 'linear-gradient(to bottom right, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.5) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '20px',
          width: '120%',
          height: CARD_HEIGHT,
          boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.15)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >

        <Typography variant="h5" pl="15px" sx={{ color: 'white', fontWeight: 600, textAlign: 'left' }}>
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: '#fff', mt: 1, lineHeight: 1.4, textAlign: 'left', pl: '10px', fontSize: '14px' }}
        >
          {truncateText(description, 80)}
        </Typography>

        {isTruncated && (
          <Typography
            onClick={onSeeMore}
            sx={{
              color: '#5A9F1D',
              cursor: 'pointer',
              mt: 1,
              fontWeight: 'bold',
              fontSize: '13px',
              textAlign: 'left',
              pl: '10px',
              paddingLeft: '70%',
            }}
          >
            Read More...
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const SkeletonCard = () => (
  <Box
    sx={{
      width: CARD_WIDTH,
      height: CARD_HEIGHT + 15,
      mx: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      backgroundColor: '#1e1e1e',
      borderRadius: '20px',
      p: 2,
    }}
  >
    <Skeleton variant="text" height={40} width="60%" sx={{ bgcolor: '#333' }} />
    <Skeleton variant="text" height={20} width="90%" sx={{ bgcolor: '#333' }} />
    <Skeleton variant="text" height={20} width="80%" sx={{ bgcolor: '#333' }} />
    <Skeleton variant="text" height={20} width="70%" sx={{ bgcolor: '#333' }} />
  </Box>
);

const WhyCoverKraft = () => {
  const [cardData, setCardData] = useState([]);
  const [popupContent, setPopupContent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const isSmall = useMediaQuery('(max-width:600px)');
  const isMedium = useMediaQuery('(max-width:1024px)');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}tips/getAll`);
        const result = await response.json();
        if (result.status) {
          const activeCards = result.data.filter(card => card.status === 'active');
          setCardData(activeCards);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
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

  const groupCards = () => {
    const groupSize = isSmall ? 1 : isMedium ? 2 : 3;
    const grouped = [];
    for (let i = 0; i < cardData.length; i += groupSize) {
      grouped.push(cardData.slice(i, i + groupSize));
    }
    return grouped;
  };

  const groupedData = groupCards();

  return (
    <Box id="card" sx={{ backgroundColor: '#121212', px: 2, py: 6,scrollMarginTop: '100px'
 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="subtitle1" sx={{ color: '#f39c12', fontSize: '2.2rem', fontWeight: 600 }}>
          Tips & Tricks
        </Typography>
      </Box>

      {/* Loading State or No Data */}
      {loading ? (
        <Box display="flex" justifyContent="center" gap={3} flexWrap="wrap">
          {[...Array(isSmall ? 1 : isMedium ? 2 : 3)].map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </Box>
      ) : cardData.length === 0 ? (
        <Box textAlign="center" color="#aaa" mt={4}>
          <Typography variant="h6" color="white">
            No tips & tricks available right now.
          </Typography>
        </Box>
      ) : (
        <>
          <Carousel
            selectedItem={currentSlide}
            onChange={(index) => setCurrentSlide(index)}
            showThumbs={false}
            showStatus={false}
            infiniteLoop
            autoPlay={false}
            showArrows={false}
            swipeable
          >
            {groupedData.map((group, i) => (
              <Box
                key={i}
                display="flex"
                justifyContent="center"
                flexWrap="nowrap"
                gap={3}
                sx={{ py: 2 }}
              >
                {group.map((card, j) => (
                  <PolicyCard
                    key={`${i}-${j}`}
                    number={i * (isSmall ? 1 : isMedium ? 2 : 3) + j + 1}
                    title={card.subtitle}
                    description={card.description}
                    onSeeMore={() => openPopup(card)}
                  />
                ))}
              </Box>
            ))}
          </Carousel>

          {/* Pagination Dots */}
          <Box display="flex" justifyContent="center" mt={3}>
            {groupedData.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentSlide(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  mx: 1,
                  cursor: 'pointer',
                  backgroundColor: currentSlide === index ? '#f39c12' : '#888',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>
        </>
      )}

      {/* Popup Modal */}
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
            width: '90%',
            maxWidth: 600,
            maxHeight: 500,
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
          <Typography variant="h5" mb={2} sx={{ pl: '20px' }}>
            {popupContent?.title}
          </Typography>
          <Box
            sx={{
              maxHeight: '350px',
              overflowY: 'auto',
              pr: 1,
              '&::-webkit-scrollbar': { width: 0 },
              scrollbarWidth: 'none',
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontSize: '16px', color: '#ccc', whiteSpace: 'pre-line', pl: '20px' }}
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
