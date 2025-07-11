import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import parse from "html-react-parser";
import API_URL from "../ServiceModule/Service";
import Button from "../component/Button";
import Navbar from "../component/Navbar";
import Footer from "../Landing/component/Footer";
import { toast } from "react-toastify";

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

  const bannerImage = getImageForType(policy.policyType);

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #1e1e1e, #2c2c2c)",
        }}
      >
        {/* Content Section */}
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
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              paddingBottom: "2em",
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

        {/* Sticky Buy Button */}
        <div
          style={{
            position: "sticky",
            bottom: 0,
            background: "#1e1e1e",
            padding: "1em 0",
            boxShadow: "0 -4px 10px rgba(0,0,0,0.4)",
            zIndex: 10,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: "900px", padding: "0 2em" }}>
            <Button
              text={"Buy Now"}
              size="lg"
              block={true}
              onClick={() => {
                toast.info("Feature coming soon!");
              }}
            />
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
};

export default PolicyDetails;
