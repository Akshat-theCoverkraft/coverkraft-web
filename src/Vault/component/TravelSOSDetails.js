import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  Collapse,
  Grid,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PublicIcon from "@mui/icons-material/Public";
import PhoneIcon from "@mui/icons-material/Phone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ShieldIcon from "@mui/icons-material/Shield";
import API_URL from "../../ServiceModule/Service";
import axios from "axios";

const normalize = (value) => String(value || "").trim().toLowerCase();
const extractDialableNumber = (value) => String(value || "").replace(/[^\d+]/g, "");

const TravelSOSDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(location.state?.policy || null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (policy || !id) return;
    const fetchPolicy = async () => {
      const res = await axios.get(`${API_URL}policy/fetchFullData?_id=${id}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      setPolicy(res.data?.data?.[0] || null);
    };
    fetchPolicy().catch(() => {});
  }, [id, policy]);

  const categories = useMemo(() => {
    const travelCategory = policy?.companyDetails?.travelCategory;
    const raw = Array.isArray(travelCategory) ? travelCategory : travelCategory ? [travelCategory] : [];
    return [...raw].sort((a, b) => (normalize(a?.category).includes("international") ? -1 : 1) - (normalize(b?.category).includes("international") ? -1 : 1));
  }, [policy]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#08090B", color: "#fff", px: { xs: 2, md: 4 }, py: 3 }}>
      <Card sx={{ maxWidth: 1100, mx: "auto", bgcolor: "#17191D", borderRadius: 4, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <Box sx={{ p: 3, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ color: "#fff", textTransform: "none" }}>
            Back
          </Button>
          <Typography variant="h4" sx={{ mt: 2, fontWeight: 800 }}>SOS Details</Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.68)", mt: 1 }}>{policy?.companyDetails?.label || policy?.insuredCompany || "Travel Assistance"}</Typography>
        </Box>

        <Box sx={{ p: 3, bgcolor: "rgba(138,198,66,0.08)" }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <ShieldIcon sx={{ color: "#8AC642" }} />
            <Box>
              <Typography sx={{ fontWeight: 700 }}>Travel Assistance</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>Emergency contacts and support for your travel policy.</Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {categories.map((category, idx) => {
              const key = `${normalize(category?.category)}-${idx}`;
              const open = expanded[key] ?? true;
              return (
                <Grid item xs={12} key={key}>
                  <Box sx={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                    <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => setExpanded((prev) => ({ ...prev, [key]: !open }))}>
                      <Box sx={{ display: "flex", gap: 1.2, alignItems: "center" }}>
                        <PublicIcon sx={{ color: "#00BCD4" }} />
                        <Typography sx={{ fontWeight: 700 }}>{category?.category || `Assistance ${idx + 1}`}</Typography>
                      </Box>
                      <IconButton sx={{ color: "#fff", transform: open ? "rotate(180deg)" : "none" }}>
                        <ExpandMoreIcon />
                      </IconButton>
                    </Box>
                    <Collapse in={open}>
                      <Box sx={{ p: 2, pt: 0 }}>
                        {(category?.phoneNumbers || []).map((phone, pIdx) => {
                          const dial = extractDialableNumber(phone);
                          if (!dial) return null;
                          return (
                            <Box key={`${dial}-${pIdx}`} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1.5, mb: 1, bgcolor: "#22242A", borderRadius: 2 }}>
                              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                <PhoneIcon sx={{ color: "#8AC642" }} />
                                <Box>
                                  <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Phone Number</Typography>
                                  <Typography>{phone}</Typography>
                                </Box>
                              </Box>
                              <Button href={`tel:${dial}`} sx={{ color: "#8AC642", textTransform: "none" }}>Call</Button>
                            </Box>
                          );
                        })}
                        {(category?.emails || []).map((email, eIdx) => (
                          <Box key={`${email}-${eIdx}`} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1.5, mb: 1, bgcolor: "#22242A", borderRadius: 2 }}>
                            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                              <MailOutlineIcon sx={{ color: "#00BCD4" }} />
                              <Box>
                                <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Email</Typography>
                                <Typography>{email}</Typography>
                              </Box>
                            </Box>
                            <Button href={`mailto:${email}`} sx={{ color: "#00BCD4", textTransform: "none" }}>Mail</Button>
                          </Box>
                        ))}
                      </Box>
                    </Collapse>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};

export default TravelSOSDetails;
