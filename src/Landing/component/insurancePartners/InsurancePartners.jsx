import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { headingStyle } from "../../../theme/themeStyles";
import axios from "axios";
import API_URL from "../../../ServiceModule/Service";

const scrollAnimation = `
@keyframes scrollLeft {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
`;

const LogoCarousel = () => {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const res = await axios.get(`${API_URL}api/isWebiste`);
        const data = res.data?.data?.filter((item) => item.icon);
        setLogos(data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchLogos();
  }, []);

  return (
    <div
      className="container-fluid text-center rounded-4"
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        marginTop: "120px",
        marginBottom: "120px",
        paddingTop: "40px",
        paddingBottom: "100px",
      }}
    >
      <style>{scrollAnimation}</style>

      <Typography variant="h3" sx={headingStyle}>
        Our Insurance Partners
      </Typography>
      <Typography
        variant="h4"
        sx={{
          color: "#FFF",
          fontWeight: 700,
          textAlign: "center",
          fontSize: { xs: "26px", sm: "30px", md: "32px" },
        }}
      >
        Leading insurers for your financial freedom
      </Typography>

      {/* Infinite Scrolling Logos */}
      <div className="overflow-hidden position-relative mt-5 py-6 w-100">
        <div
          className="d-flex align-items-center"
          style={{
            animation: "scrollLeft 25s linear infinite",
            height: "150px",
            width: "max-content",
          }}
        >
          {/* Repeat logos twice for perfect infinite loop */}
          {[...logos, ...logos].map((item, index) => (
            <div key={index} className="mx-5 flex-shrink-0">
              <img
                src={item.icon}
                alt={item.label || "logo"}
                className="img-fluid"
                style={{
                  height: "100px",
                  width: "auto",
                  transition: "transform 0.3s ease",
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoCarousel;
