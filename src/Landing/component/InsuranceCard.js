import bgImg from "../../Images/insurancecardimg.png";
import flag from "../../Images/Flag.png";
import { Box, Typography } from '@mui/material';
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import API_URL from "../../ServiceModule/Service";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
// import "./component/CSS/carousel1.css";
const InsuranceCard = () => {
    const [apiResponse, setApiResponse] = useState([])
    const slidesPerPage = 3;
    const userId = useMemo(()=>sessionStorage.getItem('userId'))
    const [currentSlide, setCurrentSlide] = useState(0);
    const getUncompletedPolicyByUserId = async (userId) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`${API_URL}policy/getById`, {
                params: {
                    userId,
                    policyType: 'uncompleted',
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            // setApiResponse(response.data);
            console.log(response.data.data,"response.data")
        } catch (error) {
            console.error('Error fetching uncompleted policy:', error);
            throw error;
        }
    };
    useEffect(() => {
        getUncompletedPolicyByUserId(userId)
    }, [userId])
    const handleSlideChange = (index) => {
        const pageStart = Math.floor(index / slidesPerPage) * slidesPerPage;
        setCurrentSlide(pageStart);
    };
    const getAllOffers = async () => {
        await axios.get(`${API_URL}offer/getAll`).then((data) => setApiResponse(data.data.data))
    }
    useEffect(() => {
        getAllOffers()
    }, [])
    return (
        <><Carousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop={false}
            centerMode
            centerSlidePercentage={100 / slidesPerPage}
            autoPlay={false}
            transitionTime={600}
            swipeable
            emulateTouch
            selectedItem={Math.min(currentSlide, apiResponse.length - 1)}
            onChange={handleSlideChange}
            showIndicators={false}
            showArrows={false}
        >
            {apiResponse?.map((value) =>
                <Box sx={{ position: "relative", display: "inline-block", width: "100%" }}>
                    <img
                        src={bgImg}
                        alt="Insurance Background"
                        style={{ width: "100%", display: "block" }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            top: { xs: 10, sm: 15 },
                            left: { xs: 10, sm: 20 },
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Box sx={{ position: "relative" }}>
                            <img
                                src={flag}
                                alt="Flag"
                                style={{
                                    width: "100%",
                                    maxWidth: "15rem",
                                    height: "auto",
                                }}
                            />
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    color: "black",
                                    fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    px: 1,
                                    wordBreak: "break-word",
                                }}
                            >
                                {value?.title}
                            </Box>
                        </Box>
                    </Box>

                    {/* Offer image to the right */}
                    {value?.offerImg && (
                        <Box
                            sx={{
                                position: "absolute",
                                top: "50%",
                                right: { xs: 65, sm: 74 },
                                transform: "translateY(-50%)",
                                width: "30%",
                                height: "auto",
                            }}
                        >
                            <img
                                src={value.offerImg}
                                alt="Offer"
                                style={{ width: "100%", height: "auto", borderRadius: "12px", opacity: "90%" }}
                            />
                        </Box>
                    )}

                </Box>

            )}
        </Carousel></>
    );
};

export default InsuranceCard;
