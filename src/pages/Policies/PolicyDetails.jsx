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

const PolicyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userName, setUserName] = useState("");
  
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
              whyChoose: parsedDetails.whyChoose,
              keyFeatures: parsedDetails.keyFeatures,
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
          style={{ opacity, scale }}
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
            <MotionButton
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
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
              <MotionTypography
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
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

              <MotionTypography
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                sx={{
                  color: "#ccc",
                  fontSize: { xs: "16px", sm: "18px", md: "20px" },
                  fontWeight: 400,
                  mb: 4,
                }}
              >
                {policy.tagline}
              </MotionTypography>

              <MotionButton
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
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
          {policy.keyFeatures?.length > 0 && (
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
          )}

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
                            <TableCell
                              sx={{
                                color: "#fff",
                                fontWeight: 500,
                                fontSize: { xs: "13px", sm: "14px", md: "15px" },
                                py: 2,
                                px: { xs: 1.5, md: 2 },
                              }}
                            >
                              {row.type}
                            </TableCell>
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
                              <MotionChip
                                label={addon}
                                {...chipHoverAnimation}
                                whileHover={{
                                  ...chipHoverAnimation.whileHover,
                                  background: "#8AC642",
                                  color: "#000",
                                }}
                                sx={{
                                  background: "#333",
                                  color: "#fff",
                                  border: "1px solid #8AC642",
                                  fontSize: { xs: "12px", sm: "13px", md: "14px" },
                                  fontWeight: 500,
                                  py: 2.5,
                                  transition: "all 0.3s ease",
                                  cursor: "pointer",
                                }}
                              />
                            </ScaleInWhenVisible>
                          ))}
                        </Box>
                      </CardContent>
                    </MotionCard>
                  </MotionGrid>
                )}

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
                              <MotionChip
                                label={exclusion}
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
                                  transition: "all 0.3s ease",
                                  cursor: "pointer",
                                  borderRadius: "10px",
                                }}
                              />
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
          <AnimatedSection>
            <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              sx={{
                mb: { xs: 4, md: 6 },
                p: { xs: 4, sm: 5, md: 6 },
                textAlign: "center",
                background: "linear-gradient(90deg, #8AC642 0%, #FFEB3B 100%)",
                borderRadius: "20px",
                boxShadow: "0 8px 40px rgba(90, 158, 30, 0.3)",
              }}
            >
              <MotionTypography
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                sx={{
                  fontWeight: 700,
                  color: "#000",
                  mb: 2,
                  fontSize: { xs: '24px', sm: '28px', md: '30px' },
                  lineHeight: 1.2,
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
                  color: "#333",
                  mb: 4,
                  fontSize: { xs: "16px", sm: "18px", md: "20px" },
                  fontWeight: 500,
                  lineHeight: 1.5,
                  maxWidth: "700px",
                  mx: "auto",
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
                  scale: 1.05,
                  backgroundColor: "#4B8719",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
                }}
                variant="contained"
                onClick={handleBuyNow}
                disabled={buying}
                sx={{
                  background: "#5A9E1E",
                  color: "#fff",
                  px: { xs: 5, sm: 6, md: 8 },
                  py: { xs: 1.5, md: 2 },
                  fontSize: { xs: "14px", sm: "16px", md: "18px" },
                  fontWeight: 600,
                  borderRadius: "50px",
                  textTransform: "none",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  transition: "background-color 0.3s ease, transform 0.2s ease",
                  "&:focus-visible": {
                    outline: "2px solid #4B8719",
                    outlineOffset: "2px",
                  },
                }}
              >
                {buying ? "Processing..." : "Buy Insurance Now →"}
              </MotionButton>
            </MotionBox>
          </AnimatedSection>
        </Container>
      </Box>
      <ToastContainer />
    </>
  );
};

export default PolicyDetails;