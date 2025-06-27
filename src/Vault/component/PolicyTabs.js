import React, { useState, useEffect } from "react";
import {
  Box, Tabs, Tab, Card, Grid, CardContent, Checkbox, Typography, Pagination, CircularProgress
} from "@mui/material";
import { TabList, TabContext, TabPanel } from "@mui/lab";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

// Import images
import scooty from "../../Images/Scooty.png";
import HealthInsurance from "../../Images/FamilyHealthInsurance.png";
import car from "../../Images/Car.png";
import Health from "../../Images/ic_health.png";
import Life from "../../Images/ic_life.png";
import arrow from "../../Images/right-arrow.png";
import red from "../../Images/red-bg.png";
import family from "../../Images/Family.png";
import emptyImage from "../../Images/NoData.png";
import "./policy.css";
import API_URL from "../../ServiceModule/Service";
import { THEME_COLOR } from "../../constants";

const useStyles = makeStyles(() => ({
  loaderContainer: { display: "flex", justifyContent: "center", alignItems: "center", height: "300px" },
  loader: { color: "#8AC642" },
}));

// Configuration objects
const POLICY_CONFIGS = {
  car_policy: { label: "Car Insurance", image: car },
  bike_policy: { label: "Two Wheeler Insurance", image: scooty },
  other_vehicle: { label: "Other Vehicle Insurance", image: scooty },
  life: { label: "Life Insurance", image: Life },
  accident: { label: "Accident Insurance", image: Health },
  health: { label: "Health Insurance", image: Health },
  other_health: { label: "Other Health Insurance", image: HealthInsurance },
};

const TAB_CONFIGS = [
  { label: "Active", value: 0, key: "active" },
  { label: "Expired", value: 1, key: "expired" },
  { label: "Archive", value: 2, key: "archive" },
];

// Utility function to calculate policy status
const calculatePolicyStatus = (policyEndDate) => {
  if (!policyEndDate) return null;
  try {
    const [day, month, year] = policyEndDate.split(" ")[0].split("/");
    const endDate = new Date(year, month - 1, day);
    if (isNaN(endDate)) return null;

    const now = new Date();
    const endDateWithoutTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    const nowWithoutTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffInDays = Math.floor((endDateWithoutTime - nowWithoutTime) / (1000 * 60 * 60 * 24));

    if (diffInDays <= 0) return "Expired";
    if (diffInDays <= 60) return `${diffInDays} days left`;
    return null;
  } catch (error) {
    console.error("Error parsing policy end date:", error);
    return null;
  }
};

// Count expired policies
const countExpiredPolicies = (policies) => {
  return policies.filter(policy => calculatePolicyStatus(policy.policyEndDate) === "Expired").length;
};

// Empty state component
const EmptyState = () => (
  <Box sx={{
    display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column",
    height: "400px", color: THEME_COLOR.COLOR
  }}>
    <img src={emptyImage} alt="No Data" style={{ width: '40%', height: 'auto', maxWidth: '200px' }} />
    <Typography className="mt-5 fs-bold">No Records Found</Typography>
  </Box>
);

// Policy card component
const PolicyCard = ({ policy, index, shareAllPolicy, selectedPolicies, handleCheckboxChange, handleCardClick, showStatus = false, isExpired = false, isSelected = false }) => {
  const config = POLICY_CONFIGS[policy.policyType] || { label: "", image: scooty };
  const status = showStatus ? calculatePolicyStatus(policy.policyEndDate) : null;

  return (
    <Card
      className="mb-5 rounded-5 card-detail"
      key={index}
      onClick={() => handleCardClick(policy._id)}
      sx={{
        boxShadow: isSelected ? "0 0 20px rgba(138, 198, 66, 0.5)" : "rgba(17, 17, 26, 0.1) 0px 0px 16px",
        backgroundColor: THEME_COLOR.FADE_BACKGROUND,
        color: THEME_COLOR.COLOR,
        width: "100%",
        height: { xs: "100%", sm: "100%" },
        cursor: "pointer",
        position: "relative",
        border: isSelected ? "2px solid #8AC642" : "1px solid transparent",
        transition: "all 0.3s ease"
      }}
    >
      <CardContent sx={{ position: "relative", p: { xs: 3, sm: 4 }, height: "70%" }}>
        {/* Status overlay */}
        {(status || isExpired) && (
          <>
            <Box sx={{
              position: "absolute", top: 0, right: 0,
              width: { xs: "100px", sm: isExpired ? "120px" : "220px" },
              height: { xs: "40px", sm: "50px" },
              backgroundImage: `url(${red})`, backgroundSize: "cover", opacity: 1
            }} />
            <Typography sx={{
              position: "absolute", top: { xs: 16, sm: 20 }, right: { xs: 20, sm: 28 },
              color: "#ffffff", fontSize: { xs: "1.5rem", sm: "2rem" }, fontWeight: "bold"
            }}>
              {isExpired ? "Expired" : status}
            </Typography>
          </>
        )}

        <Grid container spacing={1} alignItems="center" sx={{ height: "80%" }}>
          {shareAllPolicy && (
            <Grid item xs={2} sm={1}>
              <Checkbox
                checked={selectedPolicies.includes(policy._id)}
                onChange={() => handleCheckboxChange(policy._id)}
                sx={{
                  color: "#ffffff", "&.Mui-checked": { color: THEME_COLOR.GREEN },
                  p: { xs: 0.5, sm: 1 }
                }}
              />
            </Grid>
          )}

          <Grid item xs={shareAllPolicy ? 3 : 4} sm={shareAllPolicy ? 2 : 3}>
            <img
              src={config.image}
              alt="Policy"
              style={{ width: "170%", maxWidth: "110px", height: "auto" }}
              className="img-fluid"
            />
          </Grid>

          <Grid item xs={shareAllPolicy ? 6 : 7} sm={shareAllPolicy ? 8 : 8}>
            <Box sx={{ pr: { xs: 2, sm: 4 } }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                <Box sx={{
                  backgroundColor: "#8AC642", width: "14px", height: "14px",
                  borderRadius: "50%", mr: 1.5, flexShrink: 0
                }} />
                <Typography sx={{
                  color: "#8AC642", fontSize: { xs: "1.2rem", sm: "1.4rem" },
                  fontWeight: "600", lineHeight: 1.2
                }}>
                  {config.label}
                </Typography>
              </Box>

              <Typography sx={{
                fontSize: { xs: "2rem", sm: "1.5rem" }, fontWeight: "800",
                mb: 1.2, wordBreak: "break-word", lineHeight: 1.3,
                maxWidth: "100%", overflow: "hidden"
              }}>
                {policy.insuredName}
              </Typography>

              <Typography sx={{
                fontSize: { xs: "1.1rem", sm: "1.2rem" }, fontWeight: "600",
                color: "#fff", mb: 1, wordBreak: "break-all"
              }}>
                {policy.policyNumber}
              </Typography>

              <Typography sx={{
                fontSize: { xs: "1.1rem", sm: "1.2rem" }, fontWeight: "600",
                color: "#fff", lineHeight: 1.2
              }}>
                Expires on {policy.policyEndDate}
              </Typography>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            sm={1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              pt: { xs: 4, sm: 8 },
              mt: { xs: 4, sm: 8 },
            }}
          >
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip style={{ fontSize: '2rem', padding: '8px 12px' }}>Policy Details</Tooltip>
              }
            >
              <img
                src={arrow}
                alt="arrow"
                style={{
                  height: "40px",
                  width: "auto",
                  cursor: "pointer",
                }}
              />
            </OverlayTrigger>
          </Grid>

        </Grid>
      </CardContent>
    </Card>
  );
};

// Custom pagination component
const CustomPagination = ({ totalItems, currentPage, onPageChange, itemsPerPage = 3 }) => (
  <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 2 }}>
    <Pagination
      variant="outlined"
      size="large"
      count={Math.ceil(totalItems / itemsPerPage)}
      page={currentPage}
      onChange={onPageChange}
      sx={{
        "& .MuiPaginationItem-root": {
          color: "#fff", borderColor: "#fff",
          "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)", borderColor: "#fff", color: "#fff" }
        },
        "& .MuiPaginationItem-root.Mui-selected": {
          backgroundColor: "#fff", color: "#000", borderColor: "#fff",
          "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)", color: "#000" }
        },
        "& .MuiPaginationItem-ellipsis, & .MuiPaginationItem-icon": { color: "#fff" }
      }}
    />
  </Box>
);

export default function PolicyTabs({
  handleCardClick, shareAllPolicy, selectedPolicies, handleCheckboxChange,
  onPolicyListLengthChange, onArchieveListLength, onAllPolicyIdsChange
}) {
  const [value, setValue] = useState(0);
  const [pages, setPages] = useState({ active: 1, expired: 1, archive: 1 });
  const [policyList, setPolicyList] = useState([]);
  const [archieveList, setArchieveList] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [loading, setLoading] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const classes = useStyles();
  const itemsPerPage = 3;

  // Load selected policy from sessionStorage on mount
  useEffect(() => {
    const savedPolicyId = sessionStorage.getItem("selectedPolicyId");
    const savedTab = sessionStorage.getItem("selectedTab");

    if (savedPolicyId) {
      setSelectedPolicyId(savedPolicyId);
    }

    if (savedTab) {
      const tabValue = parseInt(savedTab);
      setValue(tabValue);
      if (tabValue < 2) {
        setActiveTab(TAB_CONFIGS[tabValue].key);
      }
    }
  }, []);

  // Auto-select first policy when data loads and no policy is selected
useEffect(() => {
  const currentList = value === 2 ? archieveList : policyList;

  // Don't proceed if list isn't ready yet
  if (!currentList || currentList.length === 0) return;

  // Get from session or default to first policy
  const storedId = sessionStorage.getItem("selectedPolicyId");

  const policyExists = currentList.some(p => p._id === storedId);

  if (policyExists) {
    // Sync to session-stored policy only if it's in the current tab's list
    setSelectedPolicyId(storedId);
    handleCardClick(storedId);
  } else {
    // Fall back to first policy of the current tab
    const firstId = currentList[0]._id;
    setSelectedPolicyId(firstId);
    sessionStorage.setItem("selectedPolicyId", firstId);
    handleCardClick(firstId);
  }
}, [value, policyList, archieveList]);
  
useEffect(() => {
  sessionStorage.removeItem("selectedPolicyId");
}, [value]);


 const handleCardClickWithState = (id) => {
  setSelectedPolicyId(id);
  sessionStorage.setItem("selectedPolicyId", id);
  handleCardClick(id);
};


  const handlePageChange = (tabType) => (event, newPage) => setPages(prev => ({ ...prev, [tabType]: newPage }));
  const getPaginatedData = (list, page) => list.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Unified fetch function
  const fetchData = async (endpoint, params, isArchive = false) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("userId");
      const response = await axios.get(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId, ...params }
      });

      const data = response?.data?.data || [];
      if (isArchive) {
        setArchieveList(data);
        onArchieveListLength(data.length);
      } else {
        setPolicyList(data);
        onPolicyListLengthChange(data.length);
        onAllPolicyIdsChange?.(data.map(policy => policy._id));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      const emptyData = [];
      if (isArchive) {
        setArchieveList(emptyData);
        onArchieveListLength(0);
      } else {
        setPolicyList(emptyData);
        onPolicyListLengthChange(0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (value === 2) {
      fetchData("policy/archiveData", { status: "archive" }, true);
    } else {
      fetchData("policy/getById", { policyType: activeTab });
    }
  }, [value, activeTab]);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    sessionStorage.setItem("selectedTab", newValue.toString());

    if (newValue < 2) {
      setActiveTab(TAB_CONFIGS[newValue].key);
    }
    setPages(prev => ({ ...prev, [TAB_CONFIGS[newValue]?.key || 'archive']: 1 }));

    // Clear selected policy when switching tabs, will auto-select first policy in new tab
    setSelectedPolicyId(null);
    sessionStorage.removeItem("selectedPolicyId");
  };

  // Get expired count for display
  const expiredCount = countExpiredPolicies(policyList);

  // Render tab content
  const renderTabContent = (tabValue, dataList, pageKey, showStatus = false, isExpired = false) => {
    const currentPage = pages[pageKey];
    const paginatedData = getPaginatedData(dataList, currentPage);
    const totalPages = Math.ceil(dataList.length / itemsPerPage);

    return (
      <TabPanel value={tabValue} sx={{ p: { xs: 1, sm: 2 } }}>
        <Box sx={{ minHeight: "400px" }}>
          {dataList.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <Box sx={{ mb: 2 }}>
                {paginatedData.map((policy, index) => (
                  <PolicyCard
                    key={policy._id || index}
                    policy={policy}
                    index={index}
                    shareAllPolicy={shareAllPolicy}
                    selectedPolicies={selectedPolicies}
                    handleCheckboxChange={handleCheckboxChange}
                    handleCardClick={handleCardClickWithState}
                    showStatus={showStatus}
                    isExpired={isExpired}
                    isSelected={policy._id === selectedPolicyId}
                  />
                ))}
              </Box>
              {totalPages > 1 && (
                <CustomPagination
                  totalItems={dataList.length}
                  currentPage={currentPage}
                  onPageChange={handlePageChange(pageKey)}
                  itemsPerPage={itemsPerPage}
                />
              )}
            </>
          )}
        </Box>
      </TabPanel>
    );
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 5 } }}>
      <Card sx={{
        borderRadius: 5, boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
        backgroundColor: THEME_COLOR.BACKGROUND, border: "1px solid white",
        py: 2.5, minHeight: "85vh"
      }}>
        <TabContext value={value}>
          <Box sx={{ width: "95%", mx: "auto", mb: 2 }}>
            <Box sx={{
              maxWidth: { xs: "100%", sm: 530 }, width: { xs: "100%", sm: "50%" },
              bgcolor: THEME_COLOR.FADE_BACKGROUND, mx: "auto", borderRadius: "35px",
              overflow: "hidden"
            }}>
              <TabList
                onChange={handleTabChange}
                variant="standard"
                TabIndicatorProps={{ style: { display: "none" } }}
                sx={{ width: "100%", display: "flex", justifyContent: "space-around" }}
              >
                {TAB_CONFIGS.map((tab) => (
                  <Tab
                    key={tab.value}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <span>{tab.label}</span>
                        {tab.value === 1 && value === 1 && expiredCount > 0 && (
                          <Box sx={{
                            backgroundColor: "red", color: "white", borderRadius: "50%",
                            width: "20px", height: "20px", display: "flex", alignItems: "center",
                            justifyContent: "center", fontSize: "1rem", fontWeight: "bold"
                          }}>
                            {expiredCount}
                          </Box>
                        )}
                      </Box>
                    }
                    value={tab.value}
                    sx={{
                      color: value === tab.value ? THEME_COLOR.GREEN : "white",
                      backgroundColor: value === tab.value ? "white" : "inherit",
                      textTransform: "capitalize", borderRadius: "25px",
                      fontSize: { xs: "1.2rem", sm: "1.2rem" }, fontWeight: "700",
                      minWidth: "unset", flex: 1, mx: 0.5, my: 1,
                      px: { xs: 1, sm: 2 }
                    }}
                    onClick={() => tab.value < 2 && setActiveTab(tab.key)}
                  />
                ))}
              </TabList>
            </Box>
          </Box>

          {loading ? (
            <Box className={classes.loaderContainer}>
              <CircularProgress className={classes.loader} />
            </Box>
          ) : (
            <>
              {renderTabContent(0, policyList, "active", true, false)}
              {renderTabContent(1, policyList, "expired", false, true)}
              {renderTabContent(2, archieveList, "archive", false, false)}
            </>
          )}
        </TabContext>
      </Card>
    </Box>
  );
}