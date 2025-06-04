import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import services from "../../Images/image 13.png";
import "../component/CSS/service.css";

const Service = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("xs"));
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div id="service" className="containercards mt-5">
      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="center"
        direction={isSm ? "column-reverse" : "row"}
      >
        {/* LEFT: Text Content */}
        <Grid item xs={12} md={6}>
          <CardContent
            sx={{
              textAlign: isSm ? "center" : "left",
              px: isSm ? 2 : 4,
              py: 3,
            }}
          >
            <Typography
              variant={isXs ? "h5" : "h4"}
              gutterBottom
              sx={{ color: "#FF9906" }}
            >
              OUR CERTIFICATIONS
            </Typography>

            <Typography
              variant={isXs ? "h6" : "h3"}
              className="mb-3 fw-bold"
              sx={{ fontWeight: 600 }}
            >
              Recognized Excellence
            </Typography>

            <Typography
              variant="body1"
              className="text-secondary"
              sx={{
                lineHeight: 1.7,
                fontSize: isXs ? "0.95rem" : "1.1rem",
              }}
            >
              This certificate acknowledges our commitment to providing
              exceptional insurance services. Your trust in us is our greatest
              asset. We pledge to continue delivering reliable and comprehensive
              coverage to protect your future.
            </Typography>
          </CardContent>
        </Grid>

        {/* RIGHT: Image Card */}
        <Grid item xs={12} md={6} className="text-center">
          <Card
            sx={{
              boxShadow: 3,
              borderRadius: 4,
              overflow: "hidden",
              mx: isSm ? "auto" : 0,
            }}
          >
            <CardMedia
              component="img"
              src={services}
              alt="Our Services"
              sx={{
                width: "100%",
                height: { xs: 220, sm: 300, md: 400 },
                objectFit: "contain",
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Service;
