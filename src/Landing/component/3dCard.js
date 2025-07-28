import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Modal,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Carousel } from 'react-responsive-carousel';
import { motion, AnimatePresence } from 'framer-motion';
import API_URL from '../../ServiceModule/Service';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Loader from '../../component/Loader';
import { headingStyle } from '../../theme/themeStyles';
import ellipse from '../../Images/Ellipse12.png';
import cardBG from '../../Images/tip2.png';

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
        width: 'fit-content',
        maxWidth: CARD_WIDTH,
        height: CARD_HEIGHT + 40,
        mx: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        flex: '1 1 auto',
      }}
    >
      <Box
        component="img"
        src={ellipse}
        alt="ellipse"
        sx={{
          position: 'absolute',
          top: '3px',
          left: '0px',
          width: '200px !important',
          height: '215px',
          zIndex: 0,
        }}
      />

      <Typography
        sx={{
          position: 'absolute',
          top: 15,
          left: 42,
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 36,
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
          backgroundImage: `url(${cardBG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '20px',
          padding: 2,
          width: '100%',
          height: CARD_HEIGHT,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          marginLeft: 4.5,
          backdropFilter: 'blur(8px)',
          color: '#121212',
        }}
      >

        <Typography
          variant="h5"
          pl={2}
          sx={{ color: 'white', fontWeight: 600, textAlign: 'left' }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#fff',
            mt: 1,
            lineHeight: 1.4,
            textAlign: 'left',
            pl: 2,
            fontSize: 14,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {description}
        </Typography>

        <Typography
          onClick={onSeeMore}
          sx={{
            color: '#5A9F1D',
            cursor: 'pointer',
            mt: 1,
            fontWeight: 'bold',
            fontSize: 13,
            textAlign: 'right',
            paddingLeft: '70%',
          }}
        >
          {isTruncated ? 'Read More' : ''}
        </Typography>
      </Box>
    </Box>
  );
};

const WhyCoverKraft = () => {
  const [cardData, setCardData] = useState([]);
  const [popupContent, setPopupContent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const isSmall = useMediaQuery('(max-width:600px)');
  const isMedium = useMediaQuery('(max-width:1024px)');
  const groupSize = isSmall ? 1 : isMedium ? 2 : 3;

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

  const groupedData = [];
  for (let i = 0; i < cardData.length; i += groupSize) {
    groupedData.push(cardData.slice(i, i + groupSize));
  }

  return (
    <Box id="card" sx={{ backgroundColor: '#121212', px: 2, py: 6, scrollMarginTop: '100px' }}>
      <Box textAlign="center" mb={4}>
        <Typography
          variant="subtitle1"
          sx={headingStyle}
        >
          Tips & Tricks
        </Typography>
      </Box>

      {/* Loader or No Data */}
      {loading ? (
        <Box display="flex" justifyContent="center" gap={3} flexWrap="wrap">
          {[...Array(groupSize)].map((_, idx) => (
            <Loader key={idx} />
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
              // flexWrap="nowrap"
              // gap={3}
              // sx={{ py: 2 }}
              >
                {group.map((card, j) => (
                  <PolicyCard
                    key={`${i}-${j}`}
                    number={i * groupSize + j + 1}
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

      {/* Modal with Thanos Snap Effect */}
      <AnimatePresence>
        {showPopup && (
          <Modal open={true} onClose={closePopup}>
            <Box
              component={motion.div}
              initial={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
              exit={{ opacity: 0, clipPath: 'inset(0% 100% 0% 0%)' }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'rgba(33, 33, 33, 0.75)',
                backdropFilter: 'blur(12px)',
                borderRadius: 3,
                color: '#fff',
                p: 3,
                width: '90%',
                maxWidth: 600,
                maxHeight: 600,
                boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.6)',
                overflow: 'hidden',
              }}
            >
              <IconButton
                onClick={closePopup}
                sx={{ position: 'absolute', top: 8, right: 8, color: '#fff' }}
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h5" mb={2} sx={{ pl: 2 }}>
                {popupContent?.title}
              </Typography>

              <Box
                sx={{
                  maxHeight: 350,
                  overflowY: 'auto',
                  pr: 1,
                  '&::-webkit-scrollbar': { width: 0 },
                  scrollbarWidth: 'none',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: 16,
                    color: '#ccc',
                    whiteSpace: 'pre-line',
                    pl: 2,
                  }}
                >
                  {popupContent?.description}
                </Typography>
              </Box>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default WhyCoverKraft;
