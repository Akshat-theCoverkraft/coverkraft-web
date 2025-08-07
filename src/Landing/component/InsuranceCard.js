import bgImg from "../../Images/insurancecardimg.png";
import flag from "../../Images/Flag.png";
import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import API_URL from "../../ServiceModule/Service";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const InsuranceCard = () => {
  const [apiResponse, setApiResponse] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const slidesPerPage = isXs ? 1 : isSm ? 2 : 3;

  const carouselRef = useRef(null);

  const userId = useMemo(() => sessionStorage.getItem("userId"), []);

  const getUncompletedPolicyByUserId = async (userId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.get(`${API_URL}policy/getById`, {
        params: {
          userId,
          policyType: "uncompleted",
        },
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error fetching uncompleted policy:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      getUncompletedPolicyByUserId(userId);
    }
  }, [userId]);

  const handleSlideChange = (index) => {
    const pageStart = Math.floor(index / slidesPerPage) * slidesPerPage;
    setCurrentSlide(pageStart);
  };

  const getAllOffers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}offer/getAll`);
      setApiResponse(data.data);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  useEffect(() => {
    getAllOffers();
  }, []);

  const goToPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.decrement(slidesPerPage);
    }
  };

  const goToNext = () => {
    if (carouselRef.current) {
      carouselRef.current.increment(slidesPerPage);
    }
  };

 return (
  <Box sx={{ position: "relative", px: { xs: 1, sm: 2, md: 4 }, py: 4 }}>
    {apiResponse.length === 0 ? (
      // ✅ No data: Show message in center
      <Box
  sx={{
    width: "100%",
    minHeight: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: { xs: "1.6rem", sm: "2rem", md: "2.4rem" },
    fontWeight: 500,
    color: "white",
    px: 2,
  }}
>
  <Box sx={{ maxWidth: "600px", lineHeight: 1.4 }}>
    Looks a bit quiet here... <br />
    New content will be landing shortly!
  </Box>
</Box>

    ) : (
      <>
        <Carousel
          ref={carouselRef}
          showThumbs={false}
          showStatus={false}
          infiniteLoop={false}
          centerMode
          centerSlidePercentage={100 / slidesPerPage}
          autoPlay={false}
          transitionTime={500}
          swipeable
          emulateTouch
          selectedItem={Math.min(currentSlide, apiResponse.length - 1)}
          onChange={handleSlideChange}
          showIndicators={false}
          showArrows={false}
        >
          {apiResponse.map((value, index) => (
            <Box
              key={index}
              sx={{ px: 1, boxSizing: "border-box" }}
            >
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  width: "100%",
                }}
              >
                <img
                  src={bgImg}
                  alt="Insurance Background"
                  style={{ width: "100%", display: "block" }}
                />

                {/* Flag + Title */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: isXs ? "7rem" : "12rem",
                    px: 1,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={flag}
                    alt="Flag"
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      borderRadius: 2,
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      color: "black",
                      fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.3rem" },
                      fontWeight: "bold",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      maxWidth: "60%",
                    }}
                  >
                    {value?.title}
                  </Box>
                </Box>

                {/* Offer Image */}
                {value?.offerImg && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right: "5%",
                      transform: "translateY(-50%)",
                      width: { xs: "35%", sm: "30%", md: "25%" },
                      height: "auto",
                    }}
                  >
                    <img
                      src={value.offerImg}
                      alt="Offer"
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "12px",
                        opacity: 0.9,
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Carousel>

        {/* Left Arrow */}
        <IconButton
          onClick={goToPrev}
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            zIndex: 10,
            backgroundColor: "white",
            boxShadow: 1,
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          <ArrowBackIos />
        </IconButton>

        {/* Right Arrow */}
        <IconButton
          onClick={goToNext}
          sx={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
            zIndex: 10,
            backgroundColor: "white",
            boxShadow: 1,
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          <ArrowForwardIos />
        </IconButton>
      </>
    )}
  </Box>
);

};

export default InsuranceCard;
