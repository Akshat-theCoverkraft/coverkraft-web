import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  useMediaQuery,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import services from "../../Images/Coming-Soon.png";
import "../component/CSS/service.css";

const Service = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Calculate rotation based on mouse position
    const rotateX = -(mouseY / rect.height) * 20; // Max 20 degrees
    const rotateY = (mouseX / rect.width) * 20; // Max 20 degrees

    setMousePosition({ x: rotateY, y: rotateX });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <Box id="service" className="containercards mt-5 p-3">
      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="center"
        direction={isMobile ? "column-reverse" : "row"}
      >
        {/* Text Block */}
        <Grid item xs={12} md={6}>
          <CardContent
            sx={{
              textAlign: isMobile ? "center" : "left",
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 2, sm: 3 },
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              gutterBottom
              sx={{ color: "#FF9906" }}
            >
              OUR CERTIFICATIONS
            </Typography>

            <Typography
              variant={isMobile ? "h6" : "h3"}
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Recognized Excellence
            </Typography>

            {/* <Typography
              variant="body1"
              sx={{
                lineHeight: 1.7,
                fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.3rem" },
                color: "#fff",
              }}
            >
              This certificate acknowledges our commitment to providing exceptional insurance services. Your trust in us is our greatest asset. We pledge to continue delivering reliable and comprehensive coverage to protect your future.
            </Typography> */}
          </CardContent>
        </Grid>

        {/* Image Block */}
        <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
          <Card
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              mx: "auto",
              maxWidth: { xs: "100%", sm: "80%", md: "90%" },
              height: "auto",
              background: isHovered ? "#3E3E3E" : "transparent",
              boxShadow: "none",
              // 3D hover effect styles
              transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg) translateZ(${isHovered ? '30px' : '0px'})`,
              transition: isHovered ? "background-color 0.3s ease, box-shadow 0.3s ease" : "all 0.3s ease-out",
              transformStyle: "preserve-3d",
              cursor: "pointer",
              boxShadow: isHovered ? `0 ${Math.abs(mousePosition.y) + 20}px ${Math.abs(mousePosition.x) + 40}px rgba(0, 0, 0, 0.2)` : "none",
              "&:hover": {
                "& .MuiCardMedia-root": {
                  transform: "scale(1.05)",
                }
              }
            }}
            elevation={0}
          >
            <CardMedia
              component="img"
              src={services}
              alt="Our Services"
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: { xs: 220, sm: 320, md: 400 },
                objectFit: "contain",
                backgroundColor: "transparent",
                transition: "transform 0.3s ease-in-out",
                padding: isHovered ? "20px" : "0px",
                boxSizing: "border-box",
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Service;