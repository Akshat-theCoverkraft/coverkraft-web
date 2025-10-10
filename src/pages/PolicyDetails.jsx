import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import parse from "html-react-parser";
import API_URL from "../ServiceModule/Service";
import Button from "../component/Button";
import Navbar from "../component/Navbar";
import Footer from "../Landing/component/Footer";
import { ToastContainer, toast } from "react-toastify";
import SessionExpiredModal from "../utils/sessionExpireModal";
import ProfileDrawer from "../component/profile";
import "react-toastify/dist/ReactToastify.css";

// Enhanced Modal for Coming Soon
const ComingSoonModal = ({ visible, onClose, message, contactEmail }) => {
  if (!visible) return null;

  const defaultMessage = "You may send your requirement to Contact@thecoverkraft.com and our team will get in touch with you.";
  const email = contactEmail || "Contact@thecoverkraft.com";

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
        <h2 style={{ marginBottom: "1em", fontSize: "1.5em" }}>Coming Soon 🚀</h2>
        <p style={{ marginBottom: "1.5em", color: "#ccc", lineHeight: 1.6 }}>
          {message || defaultMessage}
          {!message && (
            <>
              <br />
              <b>{email}</b>
            </>
          )}
        </p>
        <Button text="OK" size="md" block={true} onClick={onClose} />
      </div>
    </div>
  );
};

// New Modal for Profile Completion - FIXED VERSION
const ProfileIncompleteModal = ({ 
  visible, 
  onClose, 
  message, 
  missingFields,
  onCompleteProfile  // Add this prop
}) => {
  if (!visible) return null;

  const handleCompleteProfile = () => {
    onClose(); // Close the modal first
    if (onCompleteProfile) {
      onCompleteProfile(); // Then call the function to open ProfileDrawer
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
            text="Complete Profile" 
            size="md" 
            onClick={handleCompleteProfile}
            style={{ flex: 1 }}
          />
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "0.8em 1.5em",
              background: "transparent",
              border: "2px solid #555",
              color: "#ccc",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1em",
              fontWeight: "600",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const getImageForType = (type) => {
  if (!type) return require("../Images/img_lifecard.png");

  const lowerType = type.toLowerCase();

  if (lowerType.includes("health")) {
    return require("../Images/img_healthcard.png");
  } else if (lowerType.includes("life")) {
    return require("../Images/img_lifecard.png");
  } else if (
    lowerType.includes("two wheeler") ||
    lowerType.includes("car") ||
    lowerType.includes("motor")
  ) {
    return require("../Images/img_motorcard.png");
  } else if (lowerType.includes("travel")) {
    return require("../Images/img_travelCard.png");
  } else {
    return require("../Images/img_defaultcard.png");
  }
};

const PolicyDetails = () => {
  const { id } = useParams();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [buying, setBuying] = useState(false);
  
  // FIXED: Move drawerOpen state here inside PolicyDetails component
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userName, setUserName] = useState("");
  
  // Enhanced state for different modals
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

  const footerRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user data to get userName
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

  useEffect(() => {
    axios
      .get(`${API_URL}policyType/getById?_id=${id}`)
      .then((res) => {
        if (res.data.status) {
          setPolicy(res.data.data);
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

  useEffect(() => {
    const footerEl = footerRef.current;
    if (!footerEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { root: null, threshold: 0.1 }
    );

    observer.observe(footerEl);

    return () => observer.disconnect();
  }, [footerRef.current]);

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
        (p) => p.policyType === policy.policyType
      );

      if (!matchedPolicy) {
        setComingSoonModal({
          visible: true,
          message: "This insurance type is not available yet. You may send your requirement to Contact@thecoverkraft.com and our team will get in touch with you.",
          contactEmail: "Contact@thecoverkraft.com"
        });
        return;
      }

      const token = sessionStorage.getItem("token");
      if (!token) {
        setShowSessionExpired(true);
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

      // Handle success with redirect URL
      if (responseData?.success && responseData.redirect_url) {
        window.location.href = responseData.redirect_url;
        return;
      }

      // Handle different error scenarios from backend
      if (!responseData?.success) {
        // Check for specific action types
        if (responseData.action === 'complete_profile') {
          // Profile incomplete
          setProfileModal({
            visible: true,
            message: responseData.message || "Please complete your profile to continue.",
            missingFields: responseData.missingFields || []
          });
          return;
        }

        if (responseData.status === 'coming_soon') {
          // Coming soon feature
          setComingSoonModal({
            visible: true,
            message: responseData.message,
            contactEmail: responseData.contact_email || "Contact@thecoverkraft.com"
          });
          return;
        }

        // Invalid type or other validation errors
        if (responseData.errors_fields?.type) {
          toast.error("Please select a valid insurance type", {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }

        // Generic error message from backend
        toast.error(responseData.message || "Unable to process your request. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // Fallback if response structure is unexpected
      setComingSoonModal({
        visible: true,
        message: "Service temporarily unavailable. Please try again later.",
        contactEmail: "Contact@thecoverkraft.com"
      });

    } catch (error) {
      console.error("Buy Now Error:", error);

      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        setShowSessionExpired(true);
        return;
      }

      // Handle backend error responses
      if (error.response?.data) {
        const errorData = error.response.data;

        // Profile incomplete
        if (errorData.action === 'complete_profile') {
          setProfileModal({
            visible: true,
            message: errorData.message || "Please complete your profile to continue.",
            missingFields: errorData.missingFields || []
          });
          return;
        }

        // Coming soon
        if (errorData.status === 'coming_soon') {
          setComingSoonModal({
            visible: true,
            message: errorData.message,
            contactEmail: errorData.contact_email || "Contact@thecoverkraft.com"
          });
          return;
        }

        // Show specific error message from backend
        if (errorData.message) {
          toast.error(errorData.message, {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }
      }

      // Network or unknown error
      toast.error("Network error. Please check your connection and try again.", {
        position: "top-right",
        autoClose: 3000,
      });

    } finally {
      setBuying(false);
    }
  };

  if (loading)
    return <div style={{ padding: 50, color: "#fff" }}>Loading...</div>;
  if (!policy)
    return <div style={{ padding: 50, color: "#fff" }}>No data found</div>;

  const bannerImage = getImageForType(policy.policyType);

  return (
    <>
      <Navbar />
      <SessionExpiredModal
        visible={showSessionExpired}
        onConfirm={handleSessionExpiredOk}
      />
      <ComingSoonModal
        visible={comingSoonModal.visible}
        message={comingSoonModal.message}
        contactEmail={comingSoonModal.contactEmail}
        onClose={() => setComingSoonModal({ visible: false, message: "", contactEmail: "" })}
      />
      
      {/* FIXED: Pass onCompleteProfile prop */}
      <ProfileIncompleteModal
        visible={profileModal.visible}
        message={profileModal.message}
        missingFields={profileModal.missingFields}
        onClose={() => setProfileModal({ visible: false, message: "", missingFields: [] })}
        onCompleteProfile={() => {
          // Close the modal and open the drawer
          setProfileModal({ visible: false, message: "", missingFields: [] });
          setDrawerOpen(true);
        }}
      />

      {/* FIXED: Add ProfileDrawer component here */}
      <ProfileDrawer 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        userName={userName}
      />

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #1e1e1e, #2c2c2c)",
        }}
      >
        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div
            style={{
              padding: "2em",
              maxWidth: "900px",
              margin: "0 auto",
              fontFamily: "'DM Sans', sans-serif",
              color: "#ccc",
              borderRadius: "12px",
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              marginTop: "2em",
              marginBottom: "2em",
            }}
          >
            {/* Banner */}
            <div
              style={{
                width: "100%",
                maxHeight: "400px",
                overflow: "hidden",
                borderRadius: "35px",
                background: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2em",
              }}
            >
              <img
                src={bannerImage}
                alt="Policy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "35px",
                }}
              />
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: "2.4em",
                fontWeight: "800",
                color: "#fff",
                marginBottom: "1em",
              }}
            >
              {policy.policyType}
            </h1>

            {/* Description */}
            <div
              style={{
                fontSize: "1.2em",
                color: "#ccc",
                lineHeight: "1.8",
                textAlign: "left",
                maxWidth: "100%",
                marginBottom: "2em",
              }}
            >
              {policy.details
                ? parse(policy.details)
                : "No description available."}
            </div>
          </div>
        </div>

        {/* Sticky Smart Button */}
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: `translate(-50%, ${isFooterVisible ? "-330px" : "0"})`,
            zIndex: 9999,
            width: "100%",
            maxWidth: "400px",
            padding: "0 2em",
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <Button
            text={buying ? "Processing..." : "Buy Now"}
            size="lg"
            block={true}
            onClick={handleBuyNow}
            disabled={buying}
          />
        </div>
      </div>
      <footer ref={footerRef}>
        <Footer />
      </footer>
      <ToastContainer />
    </>
  );
};

export default PolicyDetails;