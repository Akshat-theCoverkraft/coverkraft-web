import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Card,
  Grid,
  CardContent,
  Checkbox,
  Typography,
  Pagination,
  CircularProgress
} from "@mui/material";
import { TabList, TabContext, TabPanel } from "@mui/lab";
import { makeStyles } from "@mui/styles";
import axios from "axios";

// Import images
import scooty from "../../Images/Scooty.png";
import HealthInsurance from "../../Images/FamilyHealthInsurance.png";
import car from "../../Images/Car.png";
import Health from "../../Images/ic_health.png";
import Life from "../../Images/ic_life.png";
import arrow from "../../Images/right-arrow.png";
import red from "../../Images/red-bg.png";
import family from "../../Images/Family.png";
import emptyImage from "../../Images/ic-empty.png";
import "./policy.css";
import API_URL from "../../ServiceModule/Service";
import { THEME_COLOR } from "../../constants";

const useStyles = makeStyles(() => ({
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  loader: {
    color: "#8AC642",
  },
}));

// Policy type configurations
const POLICY_CONFIGS = {
  car_policy: { label: "Car Insurance", image: car },
  bike_policy: { label: "Two Wheeler Insurance", image: scooty },
  other_vehicle: { label: "Other Vehicle Insurance", image: scooty },
  life: { label: "Life Insurance", image: Life },
  accident: { label: "Accident Insurance", image: Health },
  health: { label: "Health Insurance", image: HealthInsurance },
  other_health: { label: "Other Health Insurance", image: HealthInsurance },
};

// Tab configurations
const TAB_CONFIGS = [
  { label: "Active", value: 0, key: "active" },
  { label: "Expired", value: 1, key: "expired" },
  { label: "Archive", value: 2, key: "archive" },
];

// Empty state component
const EmptyState = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      height: "70vh",
      color: THEME_COLOR.COLOR,
    }}
  >
    <img src={emptyImage} alt="No Data" />
    <p>Add your new policy effortlessly to your account</p>
  </div>
);

// Policy card component
const PolicyCard = ({
  policy,
  index,
  shareAllPolicy,
  selectedPolicies,
  handleCheckboxChange,
  handleCardClick,
  showStatus = false,
  isExpired = false,
}) => {
  const config = POLICY_CONFIGS[policy.policyType] || { label: "", image: scooty };
  
  // Calculate status for active policies
  let status = null;
  if (showStatus && policy.policyEndDate) {
    try {
      const datePart = policy.policyEndDate.split(" ")[0];
      const [day, month, year] = datePart.split("/");
      const endDate = new Date(year, month - 1, day);
      
      if (!isNaN(endDate)) {
        const now = new Date();
        const endDateWithoutTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        const nowWithoutTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const diffInMs = endDateWithoutTime.getTime() - nowWithoutTime.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
        if (diffInDays <= 0) {
          status = "Expired";
        } else if (diffInDays <= 60) {
          status = `${diffInDays} days left`;
        }
      }
    } catch (error) {
      console.error("Error parsing policy end date:", error);
    }
  }

  return (
    <Card
      className="mb-5 rounded card-detail"
      key={index}
      style={{
        boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
        backgroundColor: THEME_COLOR.FADE_BACKGROUND,
        color: THEME_COLOR.COLOR,
        width: "100%",
      }}
      onClick={() => handleCardClick(policy._id)}
    >
      <CardContent style={{ position: "relative" }}>
        {/* Status overlay */}
        {(status || isExpired) && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: isExpired ? "100px" : "200px",
              height: "60px",
              backgroundImage: `url(${red})`,
              backgroundSize: "cover",
              opacity: 1,
            }}
          />
        )}
        
        <Grid container spacing={0} alignItems="center">
          {shareAllPolicy && (
            <Grid item xs={1}>
              <Checkbox
                checked={selectedPolicies.includes(policy._id)}
                onChange={() => handleCheckboxChange(policy._id)}
                sx={{
                  color: "#ffffff",
                  "&.Mui-checked": {
                    color: THEME_COLOR.GREEN,
                  },
                }}
              />
            </Grid>
          )}
          
          <Grid item xs={shareAllPolicy ? 2 : 3}>
            <img
              src={config.image}
              alt="Policy Image"
              style={{ width: "75%", maxWidth: "75%" }}
              className="img-fluid rounded-start"
            />
          </Grid>
          
          <Grid
            item
            xs={shareAllPolicy ? 9 : 9}
            className="d-flex align-items-end justify-content-between"
          >
            <div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  className="dot"
                  style={{
                    backgroundColor: "#8AC642",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    marginRight: "8px",
                    marginBottom: "14px",
                  }}
                />
                <p
                  style={{
                    color: "#8AC642",
                    fontSize: "11px",
                    fontWeight: "500",
                  }}
                  className="mb-3"
                >
                  {config.label}
                </p>
              </div>
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: "700",
                }}
                className="fw-bold"
              >
                {policy.insuredName}
              </p>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: "500",
                  color: "#585858",
                }}
                className="mb-4"
              >
                {policy.policyNumber}
              </p>
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: "500",
                  color: "#9E9E9E",
                }}
              >
                Expires on {policy.policyEndDate}
              </p>
            </div>
            <div style={{ alignItems: "end" }}>
              <img src={arrow} className="mr-2" height={40} alt="arrow" />
            </div>
          </Grid>
        </Grid>
        
        {/* Status text overlay */}
        {(status || isExpired) && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 30,
              color: "#ffffff",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            {isExpired ? "Expired" : status}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Custom pagination component
const CustomPagination = ({ totalItems, currentPage, onPageChange, itemsPerPage = 10 }) => (
  <Box sx={{ display: "flex", justifyContent: "center", m: 2 }}>
    <Pagination
      variant="outlined"
      size="large"
      count={Math.ceil(totalItems / itemsPerPage)}
      page={currentPage}
      onChange={onPageChange}
      sx={{
        "& .MuiPaginationItem-root": {
          color: "#fff",
          borderColor: "#fff",
        },
        "& .MuiPaginationItem-root.Mui-selected": {
          backgroundColor: "#fff",
          color: "#000",
        },
        "& .MuiPaginationItem-ellipsis": {
          color: "#fff",
        },
      }}
    />
  </Box>
);

export default function PolicyTabs({
  handleCardClick,
  shareAllPolicy,
  selectedPolicies,
  handleCheckboxChange,
  onPolicyListLengthChange,
  onArchieveListLength,
  onAllPolicyIdsChange,
}) {
  const [value, setValue] = useState(0);
  const [pages, setPages] = useState({ active: 1, expired: 1, archive: 1 });
  const [policyList, setPolicyList] = useState([]);
  const [archieveList, setArchieveList] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const [activeCardId, setActiveCardId] = useState(null);
  const itemsPerPage = 10;

  const handleCardClickWithState = (id) => {
    setActiveCardId(id);
    handleCardClick(id);
  };

  const handlePageChange = (tabType) => (event, newPage) => {
    setPages(prev => ({ ...prev, [tabType]: newPage }));
  };

  const getPaginatedData = (list, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return list.slice(startIndex, endIndex);
  };

  // Unified fetch function
  const fetchData = async (endpoint, params, isArchive = false) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const response = await axios.get(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId, ...params },
      });

      const data = response?.data?.data;
      if (Array.isArray(data)) {
        if (isArchive) {
          setArchieveList(data);
          onArchieveListLength(data.length);
        } else {
          setPolicyList(data);
          onPolicyListLengthChange(data.length);
          
          // Call this when policy list is loaded with all policy IDs
          const allPolicyIds = data.map(policy => policy._id);
          onAllPolicyIdsChange?.(allPolicyIds);
        }
      } else {
        if (isArchive) {
          setArchieveList([]);
          onArchieveListLength(0);
        } else {
          setPolicyList([]);
          onPolicyListLengthChange(0);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if (isArchive) {
        setArchieveList([]);
        onArchieveListLength(0);
      } else {
        setPolicyList([]);
        onPolicyListLengthChange(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPolicyList = () => {
    fetchData("policy/getById", { policyType: activeTab });
  };

  const fetchArchieveList = () => {
    fetchData("policy/archiveData", { status: "archive" }, true);
  };

  useEffect(() => {
    if (value === 2) {
      fetchArchieveList();
    } else {
      fetchPolicyList();
    }
  }, [value, activeTab]);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    if (newValue < 2) {
      setActiveTab(TAB_CONFIGS[newValue].key);
    }
  };

  // Render tab content
  const renderTabContent = (tabValue, dataList, pageKey, showStatus = false, isExpired = false) => {
    const currentPage = pages[pageKey];
    const paginatedData = getPaginatedData(dataList, currentPage);

    return (
      <TabPanel value={tabValue}>
        <div
          style={{
            minHeight: tabValue === 0 ? "90vh" : "86vh", // SECTION HEIGHT: Edit these values to make tabs taller/shorter
            maxHeight: tabValue === 0 ? "90vh" : "86vh", // SECTION HEIGHT: Active tab is slightly taller than others
            overflowY: "auto",
            paddingBottom: "10vh",
          }}
        >
          {dataList.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {paginatedData.map((policy, index) => (
                <PolicyCard
                  key={policy._id || index}
                  policy={policy}
                  index={index}
                  shareAllPolicy={shareAllPolicy}
                  selectedPolicies={selectedPolicies}
                  handleCheckboxChange={handleCheckboxChange}
                  handleCardClick={tabValue === 0 ? handleCardClickWithState : handleCardClick}
                  showStatus={showStatus}
                  isExpired={isExpired}
                />
              ))}
              <CustomPagination
                totalItems={dataList.length}
                currentPage={currentPage}
                onPageChange={handlePageChange(pageKey)}
                itemsPerPage={itemsPerPage}
              />
            </>
          )}
        </div>
      </TabPanel>
    );
  };

  return (
    <div>
      <Card
        className="mx-5 rounded-4"
        style={{
          justifyContent: "center",
          boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
          backgroundColor: THEME_COLOR.BACKGROUND,
          border: "0.5px solid white",
          padding: "20px 0px",
          height: "100vh",
        }}
      >
        <TabContext value={value}>
          <Grid item xs={12}>
            <Box sx={{ width: "95%" }} className="m-3">
              <Box
                sx={{
                  maxWidth: { xs: 370, sm: 530 },
                  width: "50%",
                  bgcolor: "#EAF0FD",
                  margin: "auto",
                  borderRadius: "35px",
                  display: "flex",
                  justifyContent: "space-around",
                }}
                style={{
                  backgroundColor: THEME_COLOR.FADE_BACKGROUND,
                  overflow: "hidden",
                }}
              >
                <TabList
                  onChange={handleTabChange}
                  variant="standard"
                  TabIndicatorProps={{ style: { display: "none" } }}
                  style={{
                    backgroundColor: THEME_COLOR.FADE_BACKGROUND,
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  {TAB_CONFIGS.map((tab) => (
                    <Tab
                      key={tab.value}
                      label={tab.label}
                      value={tab.value}
                      className="m-2 fw-bolder px-5"
                      sx={{
                        color: value === tab.value ? "#8AC642" : "#777777",
                        backgroundColor: value === tab.value ? "white" : "inherit",
                        textTransform: "capitalize",
                        borderRadius: "25px",
                        fontSize: "12px",
                        fontWeight: "700",
                        minWidth: "unset",
                        flex: 1,
                        mx: 1,
                      }}
                      onClick={() => tab.value < 2 && setActiveTab(tab.key)}
                    />
                  ))}
                </TabList>
              </Box>
            </Box>
          </Grid>

          {loading ? (
            <div className={classes.loaderContainer}>
              <CircularProgress className={classes.loader} />
            </div>
          ) : (
            <div>
              {renderTabContent(0, policyList, "active", true, false)}
              {renderTabContent(1, policyList, "expired", false, true)}
              {renderTabContent(2, archieveList, "archive", false, false)}
            </div>
          )}
        </TabContext>
      </Card>
    </div>
  );
}