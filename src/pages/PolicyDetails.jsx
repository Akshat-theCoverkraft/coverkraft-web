import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_URL from "../ServiceModule/Service";
import Button from "../component/Button";
import Navbar from "../component/Navbar";
import Footer from "../Landing/component/Footer";
import { toast, ToastContainer } from "react-toastify";

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
    return require("../Images/img_defaultcard.png"); // default fallback
  }
};

const PolicyDetails = () => {
  const { id } = useParams();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}policyType/getById?_id=${id}`)
      .then((res) => {
        if (res.data.status) {
          setPolicy(res.data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading)
    return <div style={{ padding: 50, color: "#fff" }}>Loading...</div>;
  if (!policy)
    return <div style={{ padding: 50, color: "#fff" }}>No data found</div>;

  // Static image based on policy type
  const bannerImage = getImageForType(policy.policyType);

  return (
    <>
    <ToastContainer/>
    <Navbar />
  
    <div style={styles.pageWrapper}>
      {/* Banner */}
      <div style={styles.bannerWrapper}>
        <img src={bannerImage} alt="Policy" style={styles.bannerImage} />
      </div>

      {/* Title */}
      <h1 style={styles.policyTitle}>{policy.policyType}</h1>

      {/* Description */}
      <p style={styles.policyDescription}>
        {(policy.details || '')
          .replace(/<\/?p[^>]*>/g, '')        // remove opening & closing <p> tags
          || 'No description available.'}
      </p>


      <Button
        text={"Buy Now"}
        size="lg"
        block={true}
        onClick={() => {
          toast.info
          ("Feature coming soon!");
        }}
      />
    </div>
    <Footer/>
    </>
  );
};

const styles = {
  pageWrapper: {
    padding: "2em",
    maxWidth: "900px",
    height: "100%",
    margin: "0 auto",
    fontFamily: "'Segoe UI', sans-serif",
    background: "linear-gradient(135deg, #1e1e1e, #2c2c2c)",
    // maxHeight: '100vh',
    color: "#ccc",
    borderRadius: "12px",
    boxShadow: "0 0 20px rgba(0,0,0,0.5)",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    overflowY: "auto",
    paddingBottom: "2em",
    marginTop: "2em",
    marginBottom: "2em",
  },
  bannerWrapper: {
    width: "100%",
    maxHeight: "400px",
    overflow: "hidden",
    borderRadius: "35px",
    background: "#111",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "2em",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain", // shows full image
    borderRadius: "35px",
  },
  policyTitle: {
    fontSize: "2.4em",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "1em",
  },
  policyDescription: {
    fontSize: "1.2em",
    color: "#ccc",
    lineHeight: "1.8",
  },
};

export default PolicyDetails;
