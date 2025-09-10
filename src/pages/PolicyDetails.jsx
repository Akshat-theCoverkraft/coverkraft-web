import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import parse from "html-react-parser";
import API_URL from "../ServiceModule/Service";
import Button from "../component/Button";
import Navbar from "../component/Navbar";
import Footer from "../Landing/component/Footer";
import { toast, ToastContainer } from "react-toastify";
import SessionExpiredModal from "../utils/sessionExpireModal";
import "react-toastify/dist/ReactToastify.css";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [buying, setBuying] = useState(false);

  const footerRef = useRef(null);
  const navigate = useNavigate();

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
    // Fetch all available policy types
    const policiesRes = await axios.get(
      "https://api.thecoverkraft.com/policyType/getAll"
    );

    const allPolicies = policiesRes.data?.data || [];

    // Find the policy that matches the current selected policyType
    const matchedPolicy = allPolicies.find(
      (p) => p.policyType === policy.policyType
    );

    if (!matchedPolicy) {
      toast.error("Policy number not found for this type.");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Session expired. Please login again.");
      setShowSessionExpired(true);
      return;
    }

    // Only send `type` with the value of `policyNumber`
    const autoLoginRes = await axios.post(
      "https://api.thecoverkraft.com/autoLogin/auto-login-url",
      { type: matchedPolicy.policyNumber },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (autoLoginRes.data?.success && autoLoginRes.data.redirect_url) {
      // Redirect to the generated URL in the same tab
      window.location.href = autoLoginRes.data.redirect_url;
    } else {
      toast.error(autoLoginRes.data?.message || "Unable to generate login link");
    }

  } catch (error) {
    if (error.response?.status === 401) {
      setShowSessionExpired(true);
    } else {
      toast.error("Failed to generate login link. Please try again.");
    }
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

      {/* Modal for redirect_url */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
          }}
        >
          <div
            style={{
              width: "90%",
              height: "90%",
              background: "#fff",
              borderRadius: "12px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "#f00",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "35px",
                height: "35px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ✕
            </button>
            <iframe
              src={redirectUrl}
              title="Policy Auto Login"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </div>
      )}

      <footer ref={footerRef}>
        <Footer />
      </footer>
      <ToastContainer />
    </>
  );
};

export default PolicyDetails;
