import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Container,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_URL from "../../ServiceModule/Service";
import SessionExpiredModal from "../../utils/sessionExpireModal";
import ProfileDrawer from "../../component/profile";
import bgImage from "../../Images/bg.png";
import {
  fadeInUp,
  fadeInScale,
  slideInLeft,
  slideInRight,
  staggerContainer,
  AnimatedSection,
  StaggeredContainer,
  ScaleInWhenVisible,
  cardHoverAnimation,
  buttonHoverAnimation,
  chipHoverAnimation,
} from "../../component/Animations/animations";
import Popup from "../../component/Components/Popup";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip } from "@mui/material";
import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Animated components
const MotionBox = motion(Box);
const MotionGrid = motion(Grid);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);
const MotionChip = motion(Chip);

// Reusable styled components
const sectionTitleStyle = {
  fontWeight: 700,
  color: "#FF9906",
  textAlign: "center",
  mb: { xs: 4, md: 6 },
  fontSize: { xs: '24px', sm: '28px', md: '30px' },
  lineHeight: 1.2,
};

const cardGradientStyle = {
  background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
  borderRadius: "16px",
  border: "1px solid #333",
  transition: "all 0.3s ease",
};

// Profile Incomplete Modal
const ProfileIncompleteModal = ({ 
  visible, 
  onClose, 
  message, 
  missingFields,
  onCompleteProfile
}) => {
  if (!visible) return null;

  const handleCompleteProfile = () => {
    onClose();
    if (onCompleteProfile) {
      onCompleteProfile();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
      }}
    >
      <div
        style={{
          background: "#1e1e1e",
          padding: "2em",
          borderRadius: "16px",
          maxWidth: "450px",
          textAlign: "center",
          color: "#fff",
          boxShadow: "0 0 20px rgba(0,0,0,0.7)",
        }}
      >
        <div style={{ fontSize: "3em", marginBottom: "0.5em" }}>👤</div>
        <h2 style={{ marginBottom: "1em", fontSize: "1.5em" }}>Complete Your Profile</h2>
        <p style={{ marginBottom: "1em", color: "#ccc", lineHeight: 1.6 }}>
          {message || "Please complete your profile to continue purchasing insurance."}
        </p>
        {missingFields && missingFields.length > 0 && (
          <div style={{ 
            marginBottom: "1.5em", 
            padding: "1em", 
            background: "#2a2a2a", 
            borderRadius: "8px",
            textAlign: "left"
          }}>
            <p style={{ fontSize: "0.9em", color: "#ff9800", marginBottom: "0.5em" }}>
              <b>Missing Information:</b>
            </p>
            <ul style={{ margin: 0, paddingLeft: "1.5em", color: "#ccc" }}>
              {missingFields.map((field, index) => (
                <li key={index} style={{ textTransform: "capitalize" }}>{field}</li>
              ))}
            </ul>
          </div>
        )}
        <div style={{ display: "flex", gap: "1em", justifyContent: "center" }}>
          <Button 
            variant="contained"
            onClick={handleCompleteProfile}
            sx={{
              flex: 1,
              background: "#5A9E1E",
              color: "#fff",
              px: 3,
              py: 1.5,
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { background: "#4B8719" }
            }}
          >
            Complete Profile
          </Button>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              flex: 1,
              border: "2px solid #555",
              color: "#ccc",
              px: 3,
              py: 1.5,
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { border: "2px solid #777", background: "rgba(255,255,255,0.05)" }
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

// Decorative circles
const DecorativeCircles = () => (
  <>
    {[
      { bottom: "60%", left: "25%", size: "120px", blur: "35px", opacity: 0.4 },
      { bottom: "20%", left: "20%", size: "180px", blur: "45px", opacity: 0.5 },
      { bottom: "30%", right: "15%", size: "160px", blur: "40px", opacity: 0.4 },
    ].map((circle, i) => (
      <Box
        key={i}
        sx={{
          position: "absolute",
          ...circle,
          width: circle.size,
          height: circle.size,
          background: `rgba(50, 50, 50, ${circle.opacity})`,
          borderRadius: "50%",
          filter: `blur(${circle.blur})`,
        }}
      />
    ))}
  </>
);

// Coverage cell
const CoverageCell = ({ value, idx, i }) => (
  <TableCell sx={{ textAlign: "center", py: 2, px: { xs: 1.5, md: 2 } }}>
    <ScaleInWhenVisible delay={idx * 0.1 + i * 0.05}>
      <Box sx={{ display: "flex", gap: 0.75 }}>
        {value.covered ? (
          <>
            <CheckCircleIcon sx={{ color: "#8AC642", fontSize: { xs: 18, md: 20 } }} />
            <Typography
              sx={{
                color: "#8AC642",
                fontSize: { xs: "12px", sm: "13px", md: "14px" },
                fontWeight: 500,
              }}
            >
              {value.text}
            </Typography>
          </>
        ) : (
          <>
            <CancelIcon sx={{ color: "#FF4444", fontSize: { xs: 18, md: 20 } }} />
            <Typography
              sx={{
                color: "#FF4444",
                fontSize: { xs: "12px", sm: "13px", md: "14px" },
                fontWeight: 500,
              }}
            >
              {value.text}
            </Typography>
          </>
        )}
      </Box>
    </ScaleInWhenVisible>
  </TableCell>
);

// Add this new CoverageTypeCell component for the first column with tooltip
const CoverageTypeCell = ({ rowType, definition }) => (
  <TableCell
    sx={{
      color: "#fff",
      fontWeight: 500,
      fontSize: { xs: "13px", sm: "14px", md: "15px" },
      py: 2,
      px: { xs: 1.5, md: 2 },
    }}
  >
    <Tooltip
      title={
        <Box sx={{ p: 1 }}>
          <Typography sx={{ fontSize: '14px', lineHeight: 1.6 }}>
            {definition}
          </Typography>
        </Box>
      }
      arrow
      placement="top"
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: '#2a2a2a',
            color: '#fff',
            border: '1px solid #FF9906',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(255, 153, 6, 0.3)',
            maxWidth: '300px',
            fontSize: '13px',
            '& .MuiTooltip-arrow': {
              color: '#2a2a2a',
              '&::before': {
                border: '1px solid #FF9906'
              }
            }
          }
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'help',
          transition: 'color 0.3s ease',
          '&:hover': {
            color: '#FF9906',
          }
        }}
      >
        {rowType}
        <InfoOutlinedIcon 
          sx={{ 
            fontSize: '18px', 
            color: '#FF9906',
            opacity: 0.7,
            transition: 'opacity 0.3s ease',
            '&:hover': {
              opacity: 1
            }
          }} 
        />
      </Box>
    </Tooltip>
  </TableCell>
);

// Custom Tooltip Component with better styling
const CustomTooltip = ({ title, children }) => (
  <Tooltip
    title={
      <Box sx={{ p: 1 }}>
        {Array.isArray(title) ? (
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {title.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '8px', lineHeight: 1.6 }}>
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <Typography sx={{ fontSize: '13px', lineHeight: 1.6 }}>
            {title}
          </Typography>
        )}
      </Box>
    }
    arrow
    placement="top"
    componentsProps={{
      tooltip: {
        sx: {
          backgroundColor: '#2a2a2a',
          color: '#fff',
          fontSize: '13px',
          padding: '12px 16px',
          maxWidth: '400px',
          border: '1px solid #444',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          '& .MuiTooltip-arrow': {
            color: '#2a2a2a',
            '&::before': {
              border: '1px solid #444',
            },
          },
        },
      },
    }}
  >
    {children}
  </Tooltip>
);

const PolicyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [policy, setPolicy] = useState(null);
  console.log("policy", policy?.typesofPolicies)
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const [openPopup, setOpenPopup] = useState(false);
const [selectedFeature, setSelectedFeature] = useState(null);


const handleFeatureClick = (feature) => {
  if (feature.details) {
    setSelectedFeature(feature);
    setOpenPopup(true);
  }
};

const handleClosePopup = () => {
  setOpenPopup(false);
  setSelectedFeature(null);
};

  const [openPopupPolicyType, setOpenPopupPolicyType] = useState(false);
const [selectedPolicyType, setSelectedPolicyType] = useState(null);


const handlePolicyTypeClick = (policyType) => {
  if (policyType.details) {
    setSelectedPolicyType(policyType);
    setOpenPopupPolicyType(true);
  }
};

const handleClosePopupPolicyType = () => {
  setOpenPopupPolicyType(false);
  setSelectedPolicyType(null);
};
  
  const [comingSoonModal, setComingSoonModal] = useState({
    visible: false,
    message: "",
    contactEmail: ""
  });
  const [profileModal, setProfileModal] = useState({
    visible: false,
    message: "",
    missingFields: []
  });

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        if (userId) {
          const response = await axios.get(`${API_URL}user/getById?_id=${userId}`);
          if (response.data?.data?.userName) {
            setUserName(response.data.data.userName);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();
  }, []);

  // Fetch policy data
  useEffect(() => {
    axios
      .get(`${API_URL}policyType/getById?_id=${id}`)
      .then((res) => {
        if (res.data.status) {
          // Parse the details string from API
          try {
            const parsedDetails = JSON.parse(res.data.data.details);
            const formattedPolicy = {
              _id: res.data.data._id,
              name: res.data.data.policyType,
              icon: parsedDetails.icon,
              tagline: parsedDetails.tagline,
              subtagline: parsedDetails.subtagline,
              whyChoose: parsedDetails.whyChoose,
              keyFeatures: parsedDetails?.keyFeatures,
              typesofPolicies: parsedDetails?.typesofPolicies,
              coverageComparison: parsedDetails.coverageComparison,
              addOns: parsedDetails.addOns,
              exclusions: parsedDetails.exclusions,
              imageUrl: res.data.data.icon
            };
            setPolicy(formattedPolicy);
          } catch (parseError) {
            console.error("Error parsing policy details:", parseError);
            setPolicy(null);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          setShowSessionExpired(true);
        }
        setLoading(false);
      });
  }, [id]);

  const handleSessionExpiredOk = () => {
    setShowSessionExpired(false);
    navigate("/login");
    localStorage.clear();
    sessionStorage.clear();
  };

  const handleBuyNow = async () => {
    if (!policy) return;

    setBuying(true);

    try {
      const policiesRes = await axios.get(`${API_URL}policyType/getAll`);
      const allPolicies = policiesRes.data?.data || [];

      const matchedPolicy = allPolicies.find(
        (p) => p.policyType === policy.name
      );

      if (!matchedPolicy) {
        setComingSoonModal({
          visible: true,
          message: "This insurance type is not available yet. You may send your requirement to Contact@thecoverkraft.com and our team will get in touch with you.",
          contactEmail: "Contact@thecoverkraft.com"
        });
        setBuying(false);
        return;
      }

      const token = sessionStorage.getItem("token");
      if (!token) {
        setShowSessionExpired(true);
        setBuying(false);
        return;
      }

      const autoLoginRes = await axios.post(
        `${API_URL}autoLogin/auto-login-url`,
        { type: matchedPolicy.policyNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = autoLoginRes.data;

      if (responseData?.success && responseData.redirect_url) {
        window.location.href = responseData.redirect_url;
        return;
      }

      if (!responseData?.success) {
        if (responseData.action === 'complete_profile') {
          setProfileModal({
            visible: true,
            message: responseData.message || "Please complete your profile to continue.",
            missingFields: responseData.missingFields || []
          });
          setBuying(false);
          return;
        }

        if (responseData.status === 'coming_soon') {
          setComingSoonModal({
            visible: true,
            message: responseData.message,
            contactEmail: responseData.contact_email || "Contact@thecoverkraft.com"
          });
          setBuying(false);
          return;
        }

        if (responseData.errors_fields?.type) {
          toast.error("Please select a valid insurance type", {
            position: "top-right",
            autoClose: 3000,
          });
          setBuying(false);
          return;
        }

        toast.error(responseData.message || "Unable to process your request. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
        setBuying(false);
        return;
      }

      setComingSoonModal({
        visible: true,
        message: "Service temporarily unavailable. Please try again later.",
        contactEmail: "Contact@thecoverkraft.com"
      });

    } catch (error) {
      console.error("Buy Now Error:", error);

      if (error.response?.status === 401) {
        setShowSessionExpired(true);
        setBuying(false);
        return;
      }

      if (error.response?.data) {
        const errorData = error.response.data;

        if (errorData.action === 'complete_profile') {
          setProfileModal({
            visible: true,
            message: errorData.message || "Please complete your profile to continue.",
            missingFields: errorData.missingFields || []
          });
          setBuying(false);
          return;
        }

        if (errorData.status === 'coming_soon') {
          setComingSoonModal({
            visible: true,
            message: errorData.message,
            contactEmail: errorData.contact_email || "Contact@thecoverkraft.com"
          });
          setBuying(false);
          return;
        }

        if (errorData.message) {
          toast.error(errorData.message, {
            position: "top-right",
            autoClose: 3000,
          });
          setBuying(false);
          return;
        }
      }

      toast.error("Network error. Please check your connection and try again.", {
        position: "top-right",
        autoClose: 3000,
      });

    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#111",
          color: "#fff",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <MotionTypography
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          sx={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: { xs: "20px", sm: "24px", md: "28px" },
            fontWeight: 600,
          }}
        >
          Loading...
        </MotionTypography>
      </MotionBox>
    );
  }

  if (!policy) {
    return (
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#111",
          color: "#fff",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <MotionTypography
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          sx={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: { xs: "20px", sm: "24px", md: "28px" },
            fontWeight: 600,
          }}
        >
          No data found
        </MotionTypography>
      </MotionBox>
    );
  }

  return (
    <>
      <SessionExpiredModal
        visible={showSessionExpired}
        onConfirm={handleSessionExpiredOk}
      />
      <Popup
        visible={comingSoonModal.visible}
        title="Coming Soon 🚀"
        message={
          comingSoonModal.message ||
          "You may send your requirement to Contact@thecoverkraft.com and our team will get in touch with you."
        }
        buttons={[
          {
            label: "OK",
            onClick: () =>
              setComingSoonModal({
                visible: false,
                message: "",
                contactEmail: "",
              }),
          },
        ]}
      />

      <ProfileIncompleteModal
        visible={profileModal.visible}
        message={profileModal.message}
        missingFields={profileModal.missingFields}
        onClose={() => setProfileModal({ visible: false, message: "", missingFields: [] })}
        onCompleteProfile={() => {
          setProfileModal({ visible: false, message: "", missingFields: [] });
          setDrawerOpen(true);
        }}
      />
      <ProfileDrawer 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        userName={userName}
      />

      <Box sx={{ minHeight: "100vh", fontFamily: "DM Sans, sans-serif", overflow: "hidden" }}>
        {/* Hero Section */}
      <MotionBox
  variants={{
    hidden: { opacity: 0, scale: 0.85 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    },
  }}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  sx={{
    position: "relative",
    color: "#fff",
    py: 8,
    overflow: "hidden",
    minHeight: "400px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <DecorativeCircles />

  <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
    
    {/* Back Button */}
    <MotionButton
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4 }
        }
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate('/')}
      startIcon={<ArrowBackIcon />}
      sx={{
        position: "absolute",
        top: { xs: -40, sm: -50, md: -60 },
        left: 0,
        color: "#fff",
        px: { xs: 2, sm: 3 },
        py: { xs: 1, sm: 1.5 },
        fontSize: { xs: "13px", sm: "14px", md: "16px" },
        fontWeight: 500,
        borderRadius: "50px",
        textTransform: "none",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease",
        "&:hover": { borderColor: "rgba(255, 255, 255, 0.5)" },
      }}
    >
      Back to Policies
    </MotionButton>

    <Box sx={{ mb: 3 }}>

      {/* Main Title */}
      <MotionTypography
        variants={{
          hidden: { opacity: 0, scale: 0.85 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.4 }
          }
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        sx={{
          fontSize: { xs: "48px", sm: "56px", md: "64px" },
          fontWeight: 700,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          mb: 2,
        }}
      >
        {policy.icon} {policy.name}
      </MotionTypography>

      {/* Tagline */}
      <MotionTypography
        variants={{
          hidden: { opacity: 0, y: 15 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
          }
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        sx={{
          color: "#ccc",
          fontSize: { xs: "16px", sm: "18px", md: "20px" },
          fontWeight: 400,
          mb: 4,
        }}
      >
        {policy.tagline}
      </MotionTypography>

      {/* Buy Now Button */}
      <MotionButton
        variants={{
          hidden: { opacity: 0, scale: 0.7 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.4 }
          }
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(90, 158, 30, 0.5)" }}
        whileTap={{ scale: 0.95 }}
        variant="contained"
        onClick={handleBuyNow}
        disabled={buying}
        sx={{
          background: "linear-gradient(90deg, #8AC642 0%, #FFEB3B 100%)",
          color: "#000",
          px: { xs: 4, sm: 5, md: 6 },
          py: { xs: 1.5, md: 2 },
          fontSize: { xs: "14px", sm: "16px", md: "18px" },
          fontWeight: 700,
          borderRadius: "50px",
          textTransform: "none",
          boxShadow: "0 4px 20px rgba(90, 158, 30, 0.3)",
        }}
      >
        {buying ? "Processing..." : "Get Insured Now →"}
      </MotionButton>

    </Box>
  </Container>
</MotionBox>


        <Container maxWidth="lg">
          {/* Why Choose */}
          {policy.whyChoose?.length > 0 && (
            <AnimatedSection>
              <Box sx={{ mb: { xs: 6, md: 8 } }}>
                <MotionTypography
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  sx={sectionTitleStyle}
                >
                  Why Choose Our Insurance?
                </MotionTypography>
                {/* subtagline */}
      <MotionTypography
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                   viewport={{ once: true }}
     sx={{
          color: "#ccc",
           textAlign: "center",
          fontSize: { xs: "16px", sm: "18px", md: "20px" },
          fontWeight: 400,
          mb: 4,
        }}
      >
        {policy.subtagline}
      </MotionTypography>

                <StaggeredContainer>
                  <Grid container spacing={3}>
                    {policy.whyChoose.map((item, idx) => (
                      <MotionGrid item xs={12} sm={6} md={4} key={idx} variants={fadeInScale}>
                        <MotionCard {...cardHoverAnimation} sx={{ ...cardGradientStyle, height: "100%" }}>
                          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                            <Typography sx={{ mb: 2, fontSize: { xs: "40px", md: "48px" }, lineHeight: 1 }}>
                              {item.icon}
                            </Typography>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                color: "#fff",
                                mb: 1.5,
                                fontSize: { xs: "18px", sm: "20px", md: "22px" },
                                lineHeight: 1.3,
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Typography
                              sx={{
                                color: "#999",
                                fontSize: { xs: "14px", sm: "15px", md: "16px" },
                                lineHeight: 1.6,
                              }}
                            >
                              {item.description}
                            </Typography>
                          </CardContent>
                        </MotionCard>
                      </MotionGrid>
                    ))}
                  </Grid>
                </StaggeredContainer>
              </Box>
            </AnimatedSection>
          )}

          {/* Key Features */}
          {/* {policy?.keyFeatures?.length > 0 && (
            <AnimatedSection>
              <MotionBox
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                sx={{
                  mb: { xs: 6, md: 8 },
                  p: { xs: 3, sm: 4, md: 6 },
                  background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
                  borderRadius: "20px",
                  border: "1px solid #2a2a2a",
                }}
              >
                <Typography sx={sectionTitleStyle}>Key Features</Typography>
                <StaggeredContainer>
                  <Grid container spacing={2}>
                    {policy.keyFeatures.map((feature, idx) => (
                      <MotionGrid item xs={6} sm={4} md={2} key={idx} variants={fadeInUp}>
                        <MotionCard
                          whileHover={{
                            scale: 1.08,
                            borderColor: "#FFEB3B",
                            boxShadow: "0 8px 30px rgba(255, 235, 59, 0.3)",
                          }}
                          transition={{ duration: 0.3 }}
                          sx={{
                            background: "#2a2a2a",
                            borderRadius: "12px",
                            border: "1px solid #333",
                            textAlign: "center",
                            height: "100%",
                            cursor: "pointer",
                          }}
                        >
                          <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                            <Typography sx={{ mb: 1.5, fontSize: { xs: "32px", md: "40px" }, lineHeight: 1 }}>
                              {feature.icon}
                            </Typography>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                color: "#fff",
                                mb: 0.5,
                                fontSize: { xs: "14px", sm: "15px", md: "16px" },
                                lineHeight: 1.3,
                              }}
                            >
                              {feature.title}
                            </Typography>
                            <Typography
                              sx={{
                                color: "#999",
                                fontSize: { xs: "11px", sm: "12px", md: "13px" },
                                lineHeight: 1.4,
                              }}
                            >
                              {feature.description}
                            </Typography>
                          </CardContent>
                        </MotionCard>
                      </MotionGrid>
                    ))}
                  </Grid>
                </StaggeredContainer>
              </MotionBox>
            </AnimatedSection>
          )} */}

          {policy?.keyFeatures?.length > 0 && (
  <AnimatedSection>
    <MotionBox
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      sx={{
        mb: { xs: 6, md: 8 },
        p: { xs: 3, sm: 4, md: 6 },
        background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
        borderRadius: "20px",
        border: "1px solid #2a2a2a",
      }}
    >
      <Typography sx={sectionTitleStyle}>Key Features</Typography>
      <StaggeredContainer>
        <Grid container spacing={2}>
          {policy.keyFeatures.map((feature, idx) => (
            <MotionGrid item xs={6} sm={4} md={2} key={idx} variants={fadeInUp}>
              <MotionCard
                whileHover={{
                  scale: 1.08,
                  borderColor: "#FFEB3B",
                  boxShadow: "0 8px 30px rgba(255, 235, 59, 0.3)",
                }}
                transition={{ duration: 0.3 }}
                onClick={() => handleFeatureClick(feature)} // ADD THIS
                sx={{
                  background: "#2a2a2a",
                  borderRadius: "12px",
                  border: "1px solid #333",
                  textAlign: "center",
                  height: "100%",
                  cursor: feature.details ? "pointer" : "default", // ADD THIS
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                  <Typography sx={{ mb: 1.5, fontSize: { xs: "32px", md: "40px" }, lineHeight: 1 }}>
                    {feature.icon}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#fff",
                      mb: 0.5,
                      fontSize: { xs: "14px", sm: "15px", md: "16px" },
                      lineHeight: 1.3,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#999",
                      fontSize: { xs: "11px", sm: "12px", md: "13px" },
                      lineHeight: 1.4,
                    }}
                  >
                    {feature.description}
                  </Typography>
                  {/* ADD THIS: Click indicator */}
                  {feature.details && (
                    <Typography
                      sx={{
                        color: "#8AC642",
                        fontSize: "10px",
                        mt: 1,
                        fontWeight: 600,
                      }}
                    >
                      Click for details
                    </Typography>
                  )}
                </CardContent>
              </MotionCard>
            </MotionGrid>
          ))}
        </Grid>
      </StaggeredContainer>
    </MotionBox>
  </AnimatedSection>
)}

{/* Popup Dialog for Feature Details */}
<Dialog
  open={openPopup}
  onClose={handleClosePopup}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: {
      background: "#000000",
      border: "2px solid #8AC642",
      borderRadius: "20px",
      maxHeight: "90vh",
    }
  }}
>
  <Box sx={{ position: "relative" }}>
    <IconButton
      onClick={handleClosePopup}
      sx={{
        position: "absolute",
        right: 8,
        top: 8,
        color: "#8AC642",
        zIndex: 1,
        background: "#1a1a1a",
        "&:hover": {
          background: "#2a2a2a",
        }
      }}
    >
      <CloseIcon />
    </IconButton>
    
    <DialogContent sx={{ p: { xs: 2, md: 4 } }}>
      {selectedFeature?.details && (
        <div 
          dangerouslySetInnerHTML={{ __html: selectedFeature.details }}
        />
      )}
    </DialogContent>
  </Box>
</Dialog>

{/* Show Types of Policies section */}
{policy?.typesofPolicies?.length > 0 && (
  <AnimatedSection>
    <MotionBox
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      sx={{
        mb: { xs: 6, md: 8 },
        p: { xs: 3, sm: 4, md: 6 },
        background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
        borderRadius: "20px",
        border: "1px solid #2a2a2a",
      }}
    >
      <Typography sx={sectionTitleStyle}>Types of Policies</Typography>
      <StaggeredContainer>
        <Grid container spacing={2}>
          {policy.typesofPolicies.map((policyType, idx) => (
            <MotionGrid item xs={6} sm={4} md={2} key={idx} variants={fadeInUp}>
              <MotionCard
                whileHover={{
                  scale: 1.08,
                  borderColor: "#FFEB3B",
                  boxShadow: "0 8px 30px rgba(255, 235, 59, 0.3)",
                }}
                transition={{ duration: 0.3 }}
                 onClick={() => handlePolicyTypeClick(policyType)}
                sx={{
                  background: "#2a2a2a",
                  borderRadius: "12px",
                  border: "1px solid #333",
                  textAlign: "center",
                  height: "100%",
                  cursor: policyType.details ? "pointer" : "default", // ADD THIS

                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                  <Typography sx={{ mb: 1.5, fontSize: { xs: "32px", md: "40px" }, lineHeight: 1 }}>
                    {policyType.icon}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#fff",
                      mb: 0.5,
                      fontSize: { xs: "14px", sm: "15px", md: "16px" },
                      lineHeight: 1.3,
                    }}
                  >
                    {policyType.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#999",
                      fontSize: { xs: "11px", sm: "12px", md: "13px" },
                      lineHeight: 1.4,
                    }}
                  >
                    {policyType.description}
                  </Typography>
                   {policyType.details && (
                    <Typography
                      sx={{
                        color: "#8AC642",
                        fontSize: "10px",
                        mt: 1,
                        fontWeight: 600,
                      }}
                    >
                      Click for details
                    </Typography>
                  )}
                </CardContent>
              </MotionCard>
            </MotionGrid>
          ))}
        </Grid>
      </StaggeredContainer>
    </MotionBox>
  </AnimatedSection>
)}
{/* Popup Dialog for  Policies section */}
<Dialog
  open={openPopupPolicyType}
  onClose={handleClosePopupPolicyType}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: {
      background: "#000000",
      border: "2px solid #8AC642",
      borderRadius: "20px",
      maxHeight: "90vh",
    }
  }}
>
  <Box sx={{ position: "relative" }}>
    <IconButton
      onClick={handleClosePopupPolicyType}
      sx={{
        position: "absolute",
        right: 8,
        top: 8,
        color: "#8AC642",
        zIndex: 1,
        background: "#1a1a1a",
        "&:hover": {
          background: "#2a2a2a",
        }
      }}
    >
      <CloseIcon />
    </IconButton>
    
    <DialogContent sx={{ p: { xs: 2, md: 4 } }}>
      {selectedPolicyType?.details && (
        <div 
          dangerouslySetInnerHTML={{ __html: selectedPolicyType.details }}
        />
      )}
    </DialogContent>
  </Box>
</Dialog>

          {/* Coverage Comparison */}
          {policy.coverageComparison?.rows?.length > 0 && (
            <AnimatedSection>
              <Box sx={{ mb: { xs: 6, md: 8 } }}>
                <MotionTypography
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  sx={sectionTitleStyle}
                >
                  Coverage Comparison
                </MotionTypography>

                <MotionBox
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <TableContainer
                    component={Card}
                    sx={{
                      background: "#1a1a1a",
                      borderRadius: "16px",
                      border: "1px solid #333",
                      overflow: "auto",
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow sx={{ background: "#2a2a2a" }}>
                          {policy.coverageComparison.headers.map((header, idx) => (
                            <TableCell
                              key={idx}
                              sx={{
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: { xs: "13px", sm: "14px", md: "15px" },
                                py: 2.5,
                                px: { xs: 1.5, md: 2 },
                                whiteSpace: "nowrap",
                              }}
                            >
                              {header}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {policy.coverageComparison.rows.map((row, idx) => (
                          <motion.tr
                            key={idx}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            style={{ borderBottom: "1px solid #333" }}
                          >
                           <CoverageTypeCell 
                    rowType={row.type}
                    definition={policy.coverageComparison.coverageDefinitions?.[row.type] || row.type}
                  />
                            {Object.entries(row)
                              .filter(([key]) => key !== "type")
                              .map(([key, value], i) => (
                                <CoverageCell key={i} value={value} idx={idx} i={i} />
                              ))}
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </MotionBox>
              </Box>
            </AnimatedSection>
          )}

          {/* Add-ons and Exclusions */}
         {(policy.addOns?.length > 0 || policy.exclusions?.length > 0) && (
           <AnimatedSection variant={staggerContainer}>
             <Grid container spacing={3} sx={{ mb: { xs: 6, md: 8 } }}>
               {/* Add-ons Section */}
               {policy.addOns?.length > 0 && (
                 <MotionGrid item xs={12} md={6} variants={slideInLeft}>
                   <MotionCard
                     whileHover={{
                       borderColor: "#8AC642",
                       boxShadow: "0 10px 40px rgba(90, 158, 30, 0.2)",
                     }}
                     sx={{ ...cardGradientStyle, height: "100%" }}
                   >
                     <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                       <Typography
                         sx={{
                           fontWeight: 700,
                           color: "#8AC642",
                           mb: 3,
                           fontSize: { xs: "20px", sm: "22px", md: "24px" },
                           display: "flex",
                           alignItems: "center",
                           gap: 1,
                         }}
                       >
                         ✨ Available Add-ons
                       </Typography>
                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                         {policy.addOns.map((addon, idx) => (
                           <ScaleInWhenVisible key={idx} delay={idx * 0.05}>
                             <CustomTooltip 
                               title={addon.description || addon.title}
                             >
                               <MotionChip
                                 label={
                                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                     {addon.title}
                                     <InfoOutlinedIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                                   </Box>
                                 }
                                 whileHover={{
                                   scale: 1.05,
                                   background: "#8AC642",
                                   color: "#000",
                                   boxShadow: "0 4px 20px rgba(138, 198, 66, 0.4)",
                                 }}
                                 sx={{
                                   background: "#333",
                                   color: "#fff",
                                   border: "1px solid #8AC642",
                                   fontSize: { xs: "12px", sm: "13px", md: "14px" },
                                   fontWeight: 500,
                                   py: 2.5,
                                   px: 2,
                                   transition: "all 0.3s ease",
                                   cursor: "pointer",
                                   '&:hover .MuiChip-label': {
                                     fontWeight: 600,
                                   },
                                 }}
                               />
                             </CustomTooltip>
                           </ScaleInWhenVisible>
                         ))}
                       </Box>
                     </CardContent>
                   </MotionCard>
                 </MotionGrid>
               )}
         
               {/* Exclusions Section */}
               {policy.exclusions?.length > 0 && (
                 <MotionGrid item xs={12} md={6} variants={slideInRight}>
                   <MotionCard
                     whileHover={{
                       borderColor: "#FFB547",
                       boxShadow: "0 10px 40px rgba(255, 181, 71, 0.25)",
                     }}
                     sx={{
                       background: "linear-gradient(135deg, #1c1c1c 0%, #292929 100%)",
                       borderRadius: "16px",
                       border: "1px solid #444",
                       height: "100%",
                       transition: "all 0.3s ease",
                     }}
                   >
                     <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                       <Typography
                         sx={{
                           fontWeight: 700,
                           color: "#FFB547",
                           mb: 3,
                           fontSize: { xs: "20px", sm: "22px", md: "24px" },
                           display: "flex",
                           alignItems: "center",
                           gap: 1,
                         }}
                       >
                         ⚠️ Exclusions
                       </Typography>
                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                         {policy.exclusions.map((exclusion, idx) => (
                           <ScaleInWhenVisible key={idx} delay={idx * 0.05}>
                             <CustomTooltip 
                               title={exclusion.description || exclusion.title}
                             >
                               <MotionChip
                                 label={
                                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                     {exclusion.title}
                                     <InfoOutlinedIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                                   </Box>
                                 }
                                 whileHover={{
                                   scale: 1.05,
                                   background: "#FFB547",
                                   color: "#000",
                                   boxShadow: "0 4px 20px rgba(255, 181, 71, 0.25)",
                                 }}
                                 sx={{
                                   background: "rgba(255, 181, 71, 0.08)",
                                   color: "#fff",
                                   border: "1px solid rgba(255, 181, 71, 0.4)",
                                   fontSize: { xs: "12px", sm: "13px", md: "14px" },
                                   fontWeight: 500,
                                   py: 2.5,
                                   px: 2,
                                   transition: "all 0.3s ease",
                                   cursor: "pointer",
                                   borderRadius: "10px",
                                   '&:hover .MuiChip-label': {
                                     fontWeight: 600,
                                   },
                                 }}
                               />
                             </CustomTooltip>
                           </ScaleInWhenVisible>
                         ))}
                       </Box>
                     </CardContent>
                   </MotionCard>
                 </MotionGrid>
               )}
             </Grid>
           </AnimatedSection>
         )}
          {/* CTA Section */}
 


{/* CTA Section */}
       <AnimatedSection>
            <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              sx={{
                mb: { xs: 4, md: 6 },
                position: "relative",
                overflow: "hidden",
                borderRadius: "24px",
              }}
            >
              {/* Main CTA Card */}
              <Box
                sx={{
                  background: "linear-gradient(135deg, #8AC642 0%, #FFEB3B 100%)",
                  p: { xs: 5, sm: 6, md: 8 },
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", md: "row" },
                  gap: { xs: 4, md: 6 },
                }}
              >
                {/* Decorative circles */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "-50px",
                    right: "-50px",
                    width: "200px",
                    height: "200px",
                    background: "rgba(255, 255, 255, 0.15)",
                    borderRadius: "50%",
                    filter: "blur(40px)",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "-80px",
                    left: "-80px",
                    width: "250px",
                    height: "250px",
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "50%",
                    filter: "blur(50px)",
                  }}
                />

                {/* Left Content */}
                <Box sx={{ position: "relative", zIndex: 1, flex: 1, textAlign: { xs: "center", md: "left" } }}>
                  <MotionTypography
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    sx={{
                      fontWeight: 800,
                      color: "#000",
                      mb: 2,
                      fontSize: { xs: '32px', sm: '38px', md: '44px' },
                      lineHeight: 1.1,
                      textShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    }}
                  >
                    Ready to Get Protected?
                  </MotionTypography>
                  <MotionTypography
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    sx={{
                      color: "#1a1a1a",
                      mb: 5,
                      fontSize: { xs: "16px", sm: "18px", md: "20px" },
                      fontWeight: 600,
                      lineHeight: 1.5,
                    }}
                  >
                    Join millions of satisfied customers. Get your policy in minutes.
                  </MotionTypography>
                  <MotionButton
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
                    viewport={{ once: true }}
                    whileHover={{
                      scale: 1.08,
                      boxShadow: "0 15px 50px rgba(0,0,0,0.35)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    variant="contained"
                    onClick={handleBuyNow}
                    disabled={buying}
                    sx={{
                      background: "#000",
                      color: "#fff",
                      px: { xs: 6, sm: 7, md: 10 },
                      py: { xs: 2, md: 2.5 },
                      fontSize: { xs: "16px", sm: "18px", md: "20px" },
                      fontWeight: 700,
                      borderRadius: "50px",
                      textTransform: "none",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "#1a1a1a",
                      },
                      "&:disabled": {
                        background: "#666",
                        color: "#ccc",
                      },
                    }}
                  >
                    {buying ? "Processing..." : "Buy Insurance"}
                  </MotionButton>
                </Box>

                {/* Right Side - Shield Illustration */}
                <MotionBox
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "350px",
                  }}
                >
                  {/* Shield SVG */}
                  <Box
                    sx={{
                      position: "relative",
                      width: "280px",
                      height: "280px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Glow effect */}
                    <Box
                      sx={{
                        position: "absolute",
                        width: "300px",
                        height: "300px",
                        background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)",
                        borderRadius: "50%",
                        filter: "blur(30px)",
                        animation: "pulse 2s ease-in-out infinite",
                        "@keyframes pulse": {
                          "0%, 100%": { opacity: 0.6 },
                          "50%": { opacity: 1 },
                        },
                      }}
                    />

                    {/* Main Shield */}
                    <svg width="220" height="250" viewBox="0 0 220 250" style={{ position: "relative", zIndex: 2 }}>
                      <defs>
                        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#7BC832" />
                          <stop offset="50%" stopColor="#9DD642" />
                          <stop offset="100%" stopColor="#B8E65C" />
                        </linearGradient>
                        <linearGradient id="shieldHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                        </linearGradient>
                        <filter id="shadow">
                          <feDropShadow dx="0" dy="8" stdDeviation="15" floodColor="#000" floodOpacity="0.3" />
                        </filter>
                      </defs>
                      
                      {/* Shield outline */}
                      <path
                        d="M110 10 L200 50 L200 120 Q200 180 110 240 Q20 180 20 120 L20 50 Z"
                        fill="url(#shieldGradient)"
                        stroke="#5A8A1F"
                        strokeWidth="4"
                        filter="url(#shadow)"
                      />
                      
                      {/* Shield highlight */}
                      <path
                        d="M110 20 L190 55 L190 120 Q190 175 110 230 Q30 175 30 120 L30 55 Z"
                        fill="url(#shieldHighlight)"
                        opacity="0.6"
                      />
                      
                      {/* Inner shield border */}
                      <path
                        d="M110 30 L180 65 L180 120 Q180 170 110 220 Q40 170 40 120 L40 65 Z"
                        fill="none"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                      />
                      
                      {/* Checkmark */}
                      <path
                        d="M70 120 L95 145 L150 90"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <animate
                          attributeName="stroke-dasharray"
                          from="0 200"
                          to="200 0"
                          dur="1s"
                          repeatCount="indefinite"
                        />
                      </path>
                    </svg>

                    {/* Coin stacks */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: "20px",
                        left: "10px",
                        display: "flex",
                        gap: "8px",
                      }}
                    >
                      {[40, 55, 45].map((height, i) => (
                        <Box
                          key={i}
                          sx={{
                            width: "35px",
                            height: `${height}px`,
                            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                            borderRadius: "4px",
                            border: "2px solid #CC8800",
                            position: "relative",
                            animation: `float ${2 + i * 0.3}s ease-in-out infinite`,
                            animationDelay: `${i * 0.2}s`,
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              top: "3px",
                              left: "3px",
                              right: "3px",
                              height: "40%",
                              background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)",
                              borderRadius: "2px",
                            },
                            "@keyframes float": {
                              "0%, 100%": { transform: "translateY(0)" },
                              "50%": { transform: "translateY(-8px)" },
                            },
                          }}
                        />
                      ))}
                    </Box>

                    {/* Document icon */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: "40px",
                        right: "20px",
                        width: "50px",
                        height: "60px",
                        background: "linear-gradient(135deg, #fff 0%, #f0f0f0 100%)",
                        borderRadius: "6px",
                        border: "2px solid #ddd",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                        animation: "rotate 3s ease-in-out infinite",
                        display: "flex",
                        flexDirection: "column",
                        padding: "8px",
                        gap: "4px",
                        "@keyframes rotate": {
                          "0%, 100%": { transform: "rotate(0deg)" },
                          "50%": { transform: "rotate(5deg)" },
                        },
                      }}
                    >
                      <Box sx={{ width: "100%", height: "3px", background: "#8AC642", borderRadius: "2px" }} />
                      <Box sx={{ width: "80%", height: "2px", background: "#ddd", borderRadius: "1px" }} />
                      <Box sx={{ width: "90%", height: "2px", background: "#ddd", borderRadius: "1px" }} />
                      <Box sx={{ width: "70%", height: "2px", background: "#ddd", borderRadius: "1px" }} />
                    </Box>
                  </Box>
                </MotionBox>
              </Box>

              {/* Disclaimer Section */}
              <MotionBox
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
                sx={{
                  background: "#1a1a1a",
                  p: { xs: 3, sm: 4 },
                  borderTop: "3px solid #FF9906",
                }}
              >
                <Box 
                  sx={{ 
                    display: "flex", 
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "rgba(255, 153, 6, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                    }}
                  >
                    ⚠️
                  </Box>
                  <Typography
                    sx={{
                      color: "#FF9906",
                      fontSize: { xs: "14px", sm: "15px", md: "16px" },
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    Important Notice
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: "#ccc",
                    fontSize: { xs: "13px", sm: "14px", md: "15px" },
                    fontWeight: 400,
                    lineHeight: 1.8,
                    textAlign: "center",
                    maxWidth: "750px",
                    mx: "auto",
                  }}
                >
                  Please read all policy terms and conditions, coverages & exclusions before buying policy as they may change for every policy and every insurance company.
                </Typography>
              </MotionBox>
            </MotionBox>
          </AnimatedSection>
          
        </Container>
      </Box>
      <ToastContainer />
    </>
  );
};

export default PolicyDetails;