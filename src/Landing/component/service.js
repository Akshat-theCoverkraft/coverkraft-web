import React from "react";
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
import services from "../../Images/image 13.png";
import "../component/CSS/service.css";

const Service = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.7,
                fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.3rem" },
                color: "#fff",
              }}
            >
              This certificate acknowledges our commitment to providing exceptional insurance services. Your trust in us is our greatest asset. We pledge to continue delivering reliable and comprehensive coverage to protect your future.
            </Typography>
          </CardContent>
        </Grid>

        {/* Image Block */}
        <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
          <Card
            sx={{
              boxShadow: 3,
              borderRadius: 4,
              overflow: "hidden",
              mx: "auto",
              maxWidth: { xs: "100%", sm: "80%", md: "90%" },
              height: "auto",
            }}
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
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Service;
