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
    const rotateX = -(mouseY / rect.height) * 20;
    const rotateY = (mouseX / rect.width) * 20;
    setMousePosition({ x: rotateY, y: rotateX });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <Box id="service" className="containercards mt-5 p-3">
      <Grid
        container
        spacing={4}
        alignItems="stretch"
        justifyContent="center"
        direction={isMobile ? "column-reverse" : "row"}
      >
        {/* Text Block */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              background: "#232323",
              borderRadius: 4,
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              p: { xs: 3, sm: 4, md: 5 },
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              border: "1px solid #333",
            }}
          >
            <CardContent
              sx={{
                textAlign: isMobile ? "center" : "left",
                px: 0,
                py: 0,
              }}
            >
              <Typography
                variant={isMobile ? "h5" : "h4"}
                gutterBottom
                sx={{ color: "#FF9906", fontWeight: "bold" }}
              >
                OUR CERTIFICATIONS
              </Typography>
              <Typography
                variant={isMobile ? "h6" : "h3"}
                sx={{ fontWeight: 500, mb: 2 }}
              >
                Recognized Excellence
              </Typography>
              {/* <Typography ...> ... </Typography> */}
            </CardContent>
          </Box>
        </Grid>

        {/* Image Block */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              background: "#181818",
              borderRadius: 4,
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              p: { xs: 3, sm: 4, md: 5 },
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #333",
            }}
          >
            <Card
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                mx: "auto",
                maxWidth: "100%",
                height: "auto",
                background: isHovered ? "#3E3E3E" : "transparent",
                boxShadow: "none",
                transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg) translateZ(${isHovered ? '30px' : '0px'})`,
                transition: isHovered
                  ? "background-color 0.3s ease, box-shadow 0.3s ease"
                  : "all 0.3s ease-out",
                transformStyle: "preserve-3d",
                cursor: "pointer",
                boxShadow: isHovered
                  ? `0 ${Math.abs(mousePosition.y) + 20}px ${Math.abs(mousePosition.x) + 40}px rgba(0, 0, 0, 0.2)`
                  : "none",
                "&:hover": {
                  "& .MuiCardMedia-root": {
                    transform: "scale(1.05)",
                  },
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 220,
              }}
              elevation={0}
            >
              <CardMedia
                component="img"
                src={services}
                alt="Our Services"
                sx={{
                  width: "60%",
                  height: "auto",
                  maxHeight: { xs: 220, sm: 320, md: 400 },
                  objectFit: "contain",
                  backgroundColor: "transparent",
                  transition: "transform 0.3s ease-in-out",
                  padding: isHovered ? "20px" : "0px",
                  boxSizing: "border-box",
                  margin: "0 auto",
                  display: "block",
                }}
              />
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Service;