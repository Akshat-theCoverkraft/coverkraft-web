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
         <div
  key={index}
  className="mx-5 flex-shrink-0"
  style={{
    width: "240px", // fixed width for all icons
    height: "140px", // fixed height for all icons
    backgroundColor: "white", // bright transparent background
    image: "contain",
    // backdropFilter: "blur(8px)",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <img
    src={item.icon}
    alt={item.label || "logo"}
    className="img-fluid"
    style={{
      height: "80px", // consistent icon size
      width: "auto",
      transition: "transform 0.3s ease",
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
