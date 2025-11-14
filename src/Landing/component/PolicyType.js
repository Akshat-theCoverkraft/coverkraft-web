import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CardActionArea,
  Tooltip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getAllPolicyType } from "../../store/action/action";
import API_URL from "../../ServiceModule/Service";
import { useNavigate } from "react-router-dom";
import "../component/CSS/policyType.css";
import { headingStyle, textStyle } from "../../theme/themeStyles";

const ITEMS_PER_PAGE = 5;

const PolicyType = () => {
  const [policyType, setPolicyType] = useState([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const policyTypes = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllPolicyType(API_URL));
  }, [dispatch]);

  useEffect(() => {
    if (
      policyTypes &&
      policyTypes.getPolicyType &&
      Array.isArray(policyTypes.getPolicyType.data)
    ) {
      setPolicyType(policyTypes.getPolicyType.data);
    }
  }, [policyTypes]);

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleSeeLess = () => {
    setVisibleCount(ITEMS_PER_PAGE);
  };

 const handlePolicyClick = (policy) => {
  console.log("Clicked Policy:", policy);
  navigate(`/policy-details/${policy._id}`, { 
  });
};

  return (
    <Box sx={{ mx: "6%", my: 4, mt: 0, mb: 10 }}>
      <Box
        sx={{
          background: "linear-gradient(105deg, #3E3E3E 0%, #121212 100%)",
          borderRadius: "25px",
          padding: 5,
          marginTop: 5,
          color: "#fff",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
        }}
      >
        <Typography variant="h3" sx={headingStyle}>
          Pick a Policy & Get Covered
        </Typography>
        <Typography variant="h4" sx={textStyle}>
          Let's get you & your family insured
        </Typography>

        {/* Policy Cards Grid */}
        <Grid container spacing={3}>
          {policyType.slice(0, visibleCount).map((policy, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
              <Card
                className="hover-effect"
                sx={{
                  backgroundColor: "#121212 !important",
                  borderRadius: "25px !important",
                  border: "1px solid #FF9906",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  height: 183,
                  width: 271,
                  maxWidth: "100%",
                  margin: "auto",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 8px 30px rgba(255, 153, 6, 0.3)",
                    border: "1px solid #5A9E1E",
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handlePolicyClick(policy)}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <CardContent
                    sx={{
                      textAlign: "center",
                      py: 3,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box mb={2}>
                      <img
                        src={policy.icon}
                        alt={policy.policyType}
                        style={{
                          width: 70,
                          height: 70,
                          objectFit: "contain",
                        }}
                      />
                    </Box>

                    <Tooltip
                      title={policy.policyType}
                      arrow
                      sx={{ fontSize: "40px" }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        color="#fff"
                        sx={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "100%",
                        }}
                      >
                        {policy.policyType}
                      </Typography>
                    </Tooltip>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* See More / See Less Buttons */}
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="end"
          mb={3}
          sx={{ marginTop: 3 }}
        >
          {policyType.length > ITEMS_PER_PAGE && (
            <Box display="flex" gap={2}>
              {visibleCount < policyType.length && (
                <Typography
                  onClick={handleSeeMore}
                  sx={{
                    color: "#5A9E1E",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "1.2rem",
                    textTransform: "uppercase",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  See More
                </Typography>
              )}
              {visibleCount > ITEMS_PER_PAGE && (
                <Typography
                  onClick={handleSeeLess}
                  sx={{
                    color: "#5A9E1E",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "1.2rem",
                    textTransform: "uppercase",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  See Less
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PolicyType;