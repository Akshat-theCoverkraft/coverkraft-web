import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_URL from "../../ServiceModule/Service";
import SessionExpiredModal from "../../utils/sessionExpireModal";
import ProfileDrawer from "../../component/profile";
import {
  fadeInScale,
  staggerContainer,
  AnimatedSection,
  StaggeredContainer,
  ScaleInWhenVisible,
  cardHoverAnimation,
  chipHoverAnimation,
} from "../../component/Animations/animations";
import Popup from "../../component/Components/Popup";

// Motion components (created once, reused)
const MotionBox = motion(Box);
const MotionGrid = motion(Grid);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);
const MotionChip = motion(Chip);

// Memoized styles
const styles = {
  sectionTitle: {
    fontWeight: 700,
    color: "#FF9906",
    textAlign: "center",
    mb: { xs: 4, md: 6 },
    fontSize: { xs: '24px', sm: '28px', md: '30px' },
    lineHeight: 1.2,
  },
  cardGradient: {
    background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
    borderRadius: "16px",
    border: "1px solid #333",
    transition: "all 0.3s ease",
  },
};

// Extracted ProfileIncompleteModal component
const ProfileIncompleteModal = ({ visible, onClose, message, missingFields, onCompleteProfile }) => {
  if (!visible) return null;

  return (
    <Box
      sx={{
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
      <Box
        sx={{
          background: "#1e1e1e",
          p: 4,
          borderRadius: "16px",
          maxWidth: "450px",
          textAlign: "center",
          color: "#fff",
          boxShadow: "0 0 20px rgba(0,0,0,0.7)",
        }}
      >
        <Typography sx={{ fontSize: "3em", mb: 2 }}>👤</Typography>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Complete Your Profile
        </Typography>
        <Typography sx={{ mb: 2, color: "#ccc", lineHeight: 1.6 }}>
          {message || "Please complete your profile to continue purchasing insurance."}
        </Typography>
        {missingFields?.length > 0 && (
          <Box sx={{ mb: 3, p: 2, background: "#2a2a2a", borderRadius: "8px", textAlign: "left" }}>
            <Typography sx={{ fontSize: "0.9em", color: "#ff9800", mb: 1, fontWeight: 600 }}>
              Missing Information:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 3, color: "#ccc" }}>
              {missingFields.map((field, i) => (
                <li key={i} style={{ textTransform: "capitalize" }}>{field}</li>
              ))}
            </Box>
          </Box>
        )}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button 
            variant="contained"
            onClick={() => {
              onClose();
              onCompleteProfile?.();
            }}
            sx={{
              flex: 1,
              background: "#5A9E1E",
              px: 3,
              py: 1.5,
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
              borderColor: "#555",
              color: "#ccc",
              "&:hover": { borderColor: "#777" }
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// Decorative circles component
const DecorativeCircles = () => {
  const circles = useMemo(() => [
    { bottom: "60%", left: "25%", size: "120px", blur: "35px", opacity: 0.4 },
    { bottom: "20%", left: "20%", size: "180px", blur: "45px", opacity: 0.5 },
    { bottom: "30%", right: "15%", size: "160px", blur: "40px", opacity: 0.4 },
  ], []);

  return (
    <>
      {circles.map((circle, i) => (
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
};

// Coverage cell component
const CoverageCell = ({ value, idx, i }) => (
  <TableCell sx={{ textAlign: "center", py: 2, px: { xs: 1.5, md: 2 } }}>
    <ScaleInWhenVisible delay={idx * 0.1 + i * 0.05}>
      <Box sx={{ display: "flex", gap: 0.75, alignItems: "center" }}>
        {value.covered ? (
          <>
            <CheckCircleIcon sx={{ color: "#8AC642", fontSize: { xs: 18, md: 20 } }} />
            <Typography sx={{ color: "#8AC642", fontSize: { xs: "12px", sm: "13px", md: "14px" }, fontWeight: 500 }}>
              {value.text}
            </Typography>
          </>
        ) : (
          <>
            <CancelIcon sx={{ color: "#FF4444", fontSize: { xs: 18, md: 20 } }} />
            <Typography sx={{ color: "#FF4444", fontSize: { xs: "12px", sm: "13px", md: "14px" }, fontWeight: 500 }}>
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
  
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [comingSoonModal, setComingSoonModal] = useState({ visible: false, message: "", contactEmail: "" });
  const [profileModal, setProfileModal] = useState({ visible: false, message: "", missingFields: [] });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) return;
        
        const response = await axios.get(`${API_URL}user/getById?_id=${userId}`);
        if (response.data?.data?.userName) {
          setUserName(response.data.data.userName);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();
  }, []);

  // Fetch policy data
  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await axios.get(`${API_URL}policyType/getById?_id=${id}`);
        
        if (res.data.status) {
          const parsedDetails = JSON.parse(res.data.data.details);
          setPolicy({
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
          });
        }
      } catch (error) {
        if (error.response?.status === 401) {
          setShowSessionExpired(true);
        }
        console.error("Error fetching policy:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, [id]);

  const handleSessionExpiredOk = useCallback(() => {
    setShowSessionExpired(false);
    navigate("/login");
    localStorage.clear();
    sessionStorage.clear();
  }, [navigate]);

  const handleBuyNow = useCallback(async () => {
    if (!policy) return;

    setBuying(true);

    try {
      const [policiesRes, token] = await Promise.all([
        axios.get(`${API_URL}policyType/getAll`),
        Promise.resolve(sessionStorage.getItem("token"))
      ]);

      if (!token) {
        setShowSessionExpired(true);
        return;
      }

      const matchedPolicy = policiesRes.data?.data?.find(p => p.policyType === policy.name);

      if (!matchedPolicy) {
        setComingSoonModal({
          visible: true,
          message: "This insurance type is not available yet. You may send your requirement to Contact@thecoverkraft.com and our team will get in touch with you.",
          contactEmail: "Contact@thecoverkraft.com"
        });
        return;
      }

      const autoLoginRes = await axios.post(
        `${API_URL}autoLogin/auto-login-url`,
        { type: matchedPolicy.policyNumber },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      const responseData = autoLoginRes.data;

      if (responseData?.success && responseData.redirect_url) {
        window.location.href = responseData.redirect_url;
        return;
      }

      if (responseData.action === 'complete_profile') {
        setProfileModal({
          visible: true,
          message: responseData.message || "Please complete your profile to continue.",
          missingFields: responseData.missingFields || []
        });
        return;
      }

      if (responseData.status === 'coming_soon') {
        setComingSoonModal({
          visible: true,
          message: responseData.message,
          contactEmail: responseData.contact_email || "Contact@thecoverkraft.com"
        });
        return;
      }

      toast.error(responseData.message || "Unable to process your request. Please try again.");

    } catch (error) {
      console.error("Buy Now Error:", error);

      if (error.response?.status === 401) {
        setShowSessionExpired(true);
        return;
      }

      const errorData = error.response?.data;

      if (errorData?.action === 'complete_profile') {
        setProfileModal({
          visible: true,
          message: errorData.message || "Please complete your profile to continue.",
          missingFields: errorData.missingFields || []
        });
        return;
      }

      if (errorData?.status === 'coming_soon') {
        setComingSoonModal({
          visible: true,
          message: errorData.message,
          contactEmail: errorData.contact_email || "Contact@thecoverkraft.com"
        });
        return;
      }

      toast.error(errorData?.message || "Network error. Please check your connection and try again.");
    } finally {
      setBuying(false);
    }
  }, [policy]);

  // Loading state
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
        }}
      >
        <Typography sx={{ fontSize: { xs: "20px", sm: "24px", md: "28px" }, fontWeight: 600 }}>
          Loading...
        </Typography>
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
        }}
      >
        <Typography sx={{ fontSize: { xs: "20px", sm: "24px", md: "28px" }, fontWeight: 600 }}>
          No data found
        </Typography>
      </MotionBox>
    );
  }

  return (
    <>
      <SessionExpiredModal visible={showSessionExpired} onConfirm={handleSessionExpiredOk} />
      
      <Popup
        visible={comingSoonModal.visible}
        title="Coming Soon 🚀"
        message={comingSoonModal.message}
        buttons={[{
          label: "OK",
          onClick: () => setComingSoonModal({ visible: false, message: "", contactEmail: "" })
        }]}
      />

      <ProfileIncompleteModal
        visible={profileModal.visible}
        message={profileModal.message}
        missingFields={profileModal.missingFields}
        onClose={() => setProfileModal({ visible: false, message: "", missingFields: [] })}
        onCompleteProfile={() => setDrawerOpen(true)}
      />
      
      <ProfileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} userName={userName} />

      <Box sx={{ minHeight: "100vh", fontFamily: "DM Sans, sans-serif", overflow: "hidden" }}>
        {/* Hero Section */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{
            position: "relative",
            color: "#fff",
            py: 8,
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DecorativeCircles />
          
          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <MotionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              startIcon={<ArrowBackIcon />}
              sx={{
                position: "absolute",
                top: { xs: -40, sm: -50, md: -60 },
                left: 0,
                color: "#fff",
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.5 },
              }}
            >
              Back to Policies
            </MotionButton>

            <Typography variant="h2" sx={{ fontSize: { xs: "48px", sm: "56px", md: "64px" }, fontWeight: 700, mb: 2 }}>
              {policy.icon} {policy.name}
            </Typography>

            <Typography sx={{ color: "#ccc", fontSize: { xs: "16px", sm: "18px", md: "20px" }, mb: 4 }}>
              {policy.tagline}
            </Typography>

            <MotionButton
              whileHover={{ scale: 1.05 }}
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
              }}
            >
              {buying ? "Processing..." : "Get Insured Now →"}
            </MotionButton>
          </Container>
        </MotionBox>

        <Container maxWidth="lg">
          {/* Why Choose Section */}
          {policy.whyChoose?.length > 0 && (
            <AnimatedSection>
              <Box sx={{ mb: { xs: 6, md: 8 } }}>
                <Typography sx={styles.sectionTitle}>Why Choose Our Insurance?</Typography>
                <StaggeredContainer>
                  <Grid container spacing={3}>
                    {policy.whyChoose.map((item, idx) => (
                      <MotionGrid item xs={12} sm={6} md={4} key={idx} variants={fadeInScale}>
                        <MotionCard {...cardHoverAnimation} sx={{ ...styles.cardGradient, height: "100%" }}>
                          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                            <Typography sx={{ mb: 2, fontSize: "48px" }}>{item.icon}</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: "#fff", mb: 1.5 }}>
                              {item.title}
                            </Typography>
                            <Typography sx={{ color: "#999", fontSize: { xs: "14px", md: "16px" } }}>
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
              <Box sx={{ mb: { xs: 6, md: 8 }, p: { xs: 3, sm: 4, md: 6 }, ...styles.cardGradient }}>
                <Typography sx={styles.sectionTitle}>Key Features</Typography>
                <Grid container spacing={2}>
                  {policy.keyFeatures.map((feature, idx) => (
                    <Grid item xs={6} sm={4} md={2} key={idx}>
                      <Card sx={{ background: "#2a2a2a", borderRadius: "12px", textAlign: "center", height: "100%" }}>
                        <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                          <Typography sx={{ mb: 1.5, fontSize: "40px" }}>{feature.icon}</Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#fff", mb: 0.5 }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#999" }}>
                            {feature.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </AnimatedSection>
          )}

          {/* Coverage Comparison */}
          {policy.coverageComparison?.rows?.length > 0 && (
            <AnimatedSection>
              <Box sx={{ mb: { xs: 6, md: 8 } }}>
                <Typography sx={styles.sectionTitle}>Coverage Comparison</Typography>
                <TableContainer component={Card} sx={{ background: "#1a1a1a", borderRadius: "16px" }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: "#2a2a2a" }}>
                        {policy.coverageComparison.headers.map((header, idx) => (
                          <TableCell key={idx} sx={{ color: "#fff", fontWeight: 700, py: 2.5 }}>
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {policy.coverageComparison.rows.map((row, idx) => (
                        <TableRow key={idx} sx={{ borderBottom: "1px solid #333" }}>
                          <TableCell sx={{ color: "#fff", fontWeight: 500 }}>{row.type}</TableCell>
                          {Object.entries(row)
                            .filter(([key]) => key !== "type")
                            .map(([, value], i) => (
                              <CoverageCell key={i} value={value} idx={idx} i={i} />
                            ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </AnimatedSection>
          )}

          {/* Add-ons and Exclusions */}
          {(policy.addOns?.length > 0 || policy.exclusions?.length > 0) && (
            <Grid container spacing={3} sx={{ mb: { xs: 6, md: 8 } }}>
              {policy.addOns?.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Card sx={{ ...styles.cardGradient, height: "100%" }}>
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#8AC642", mb: 3 }}>
                        ✨ Available Add-ons
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                        {policy.addOns.map((addon, idx) => (
                          <Chip
                            key={idx}
                            label={addon}
                            sx={{
                              background: "#333",
                              color: "#fff",
                              border: "1px solid #8AC642",
                              fontWeight: 500,
                            }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {policy.exclusions?.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Card sx={{ ...styles.cardGradient, height: "100%" }}>
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#FFB547", mb: 3 }}>
                        ⚠️ Exclusions
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                        {policy.exclusions.map((exclusion, idx) => (
                          <Chip
                            key={idx}
                            label={exclusion}
                            sx={{
                              background: "rgba(255, 181, 71, 0.08)",
                              color: "#fff",
                              border: "1px solid rgba(255, 181, 71, 0.4)",
                              fontWeight: 500,
                            }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}

          {/* CTA Section */}
          <Box
            sx={{
              mb: { xs: 4, md: 6 },
              p: { xs: 4, sm: 5, md: 6 },
              textAlign: "center",
              background: "linear-gradient(90deg, #8AC642 0%, #FFEB3B 100%)",
              borderRadius: "20px",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#000", mb: 2 }}>
              Ready to Get Protected?
            </Typography>
            <Typography sx={{ color: "#333", mb: 4, fontSize: { xs: "16px", md: "18px" } }}>
              Join millions of satisfied customers. Get your policy in minutes.
            </Typography>
            <Button
              variant="contained"
              onClick={handleBuyNow}
              disabled={buying}
              sx={{
                background: "#5A9E1E",
                color: "#fff",
                px: { xs: 5, sm: 6, md: 8 },
                py: { xs: 1.5, md: 2 },
                fontSize: { xs: "14px", md: "18px" },
                fontWeight: 600,
                borderRadius: "50px",
                "&:hover": { background: "#4B8719" },
              }}
            >
              {buying ? "Processing..." : "Buy Insurance Now →"}
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default PolicyDetails;
