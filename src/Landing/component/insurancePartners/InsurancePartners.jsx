import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import { Typography } from "@mui/material";
import { headingStyle } from "../../../theme/themeStyles";

const partnerLogos = [
  { src: "https://cdn.worldvectorlogo.com/logos/react-2.svg", alt: "React" },
  { src: "https://cdn.worldvectorlogo.com/logos/next-js.svg", alt: "Next.js" },
  { src: "https://cdn.worldvectorlogo.com/logos/vercel.svg", alt: "Vercel" },
  { src: "https://cdn.worldvectorlogo.com/logos/typescript.svg", alt: "TypeScript" },
  { src: "https://cdn.worldvectorlogo.com/logos/tailwindcss.svg", alt: "Tailwind CSS" },
  { src: "https://cdn.worldvectorlogo.com/logos/stripe-4.svg", alt: "Stripe" },
  { src: "https://cdn.worldvectorlogo.com/logos/notion-2.svg", alt: "Notion" },
  { src: "https://cdn.worldvectorlogo.com/logos/github-icon-1.svg", alt: "GitHub" },
  { src: "https://cdn.worldvectorlogo.com/logos/figma-icon-one-color.svg", alt: "Figma" },
  { src: "https://cdn.worldvectorlogo.com/logos/framer-motion.svg", alt: "Framer Motion" },
  { src: "https://cdn.worldvectorlogo.com/logos/storybook-1.svg", alt: "Storybook" },
  { src: "https://cdn.worldvectorlogo.com/logos/sanity.svg", alt: "Sanity" },
];

const scrollAnimation = `
@keyframes scrollLeft {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
`;

const LogoCarousel = () => {
  return (
      <div
    className="container-fluid text-center rounded-4"
    style={{
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      marginTop: "120px",   // ⬅️ Added extra space above
      marginBottom: "120px", // ⬅️ Added extra space below
      paddingTop: "40px",   // ⬅️ Increase top padding inside
      paddingBottom: "100px" // ⬅️ Increase bottom padding inside
    }}
  >
      <style>{scrollAnimation}</style>

      {/* Heading */}
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
          }}
        >
          {[...partnerLogos, ...partnerLogos, ...partnerLogos].map(
            (logo, index) => (
              <div key={index} className="mx-4 flex-shrink-0">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="img-fluid"
                  style={{
                    height: "100px",
                    width: "auto",
                    transition: "transform 0.3s ease",
                    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoCarousel;
