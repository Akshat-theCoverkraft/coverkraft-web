import React, { useState, useEffect } from "react";
import {
  Box,
  Tab,
  Card,
  Grid,
  CardContent,
  Checkbox,
  Typography,
  Pagination,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { TabList, TabContext, TabPanel } from "@mui/lab";
import { makeStyles } from "@mui/styles";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Loader from "../../component/Loader";
import scooty from "../../Images/Scooty.png";
import HealthInsurance from "../../Images/FamilyHealthInsurance.png";
import car from "../../Images/Car.png";
import Health from "../../Images/ic_health.png";
import Life from "../../Images/ic_life.png";
import arrow from "../../Images/right-arrow.png";
import emptyImage from "../../Images/NoData.png";
import "./policy.css";
import API_URL from "../../ServiceModule/Service";
import { THEME_COLOR } from "../../constants";
import moment from "moment";
import redBg from "../../Images/red-img.png";
import SessionExpiredModal from "../../utils/sessionExpireModal";
import DeleteIcon from '@mui/icons-material/Delete';
import {
  parse,
  isBefore,
  differenceInDays,
  startOfDay,
  isValid,
} from 'date-fns';
import { usePolicyContext } from "../../store/policyContext";


const useStyles = makeStyles(() => ({
  searchContainer: {
    backgroundColor: "#2a2a2a !important",
    borderRadius: "12px",
    padding: "1px",
    border: "1px solid #444",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    width: "100%",
  },
  searchField: {
    flex: 1,
    minWidth: "250px",
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#1a1a1a !important",
      borderRadius: "8px",
      border: "none",
      "& fieldset": { border: "none" },
      "&:hover fieldset": { border: "none" },
      "&.Mui-focused fieldset": { border: "none" },
      height: "48px",
    },
    "& .MuiInputBase-input": {
      color: "#fff",
      fontSize: "1.4rem",
    },
    "& .MuiInputLabel-root": { display: "none" },
  },
  filterButton: {
    backgroundColor: "#1a1a1a",
    color: "#fff!important",
    border: "1px solid #444",
    borderRadius: "8px",
    padding: "12px 16px",
    minWidth: "120px",
    height: "48px",
    textTransform: "none",
    fontSize: "1.3rem !important",
    "&:hover": { backgroundColor: "#333 !important", borderColor: "#555" },
  },
  filterMenu: {
    "& .MuiPaper-root": {
      backgroundColor: "#2a2a2a !important",
      border: "1px solid #444",
      borderRadius: "8px",
    },
    "& .MuiMenuItem-root": {
      color: "#fff",
      fontSize: "1.3rem",
      padding: "12px 16px",
      "&:hover": { backgroundColor: "#333 !important" },
    },
  },
}));

const POLICY_CONFIGS = {
  car_policy: { label: "Car Insurance", image: car, category: "motor" },
  bike_policy: {
    label: "Two Wheeler Insurance",
    image: scooty,
    category: "motor",
  },
  other_vehicle: {
    label: "Other Vehicle Insurance",
    image: scooty,
    category: "motor",
  },
  life: { label: "Life Insurance", image: Life, category: "life" },
  accident: { label: "Accident Insurance", image: Health, category: "health" },
  health: { label: "Health Insurance", image: Health, category: "health" },
  other_health: {
    label: "Other Health Insurance",
    image: HealthInsurance,
    category: "health",
  },
};

const TAB_CONFIGS = [
  { label: "Active", value: 0, key: "active" },
  { label: "Expired", value: 1, key: "expired" },
  { label: "Archive", value: 2, key: "archive" },
  { label: "Pending", value: 3, key: "pending" },
];

const POLICY_TYPE_FILTERS = [
  { key: "all", label: "All Policies" },
  { key: "motor", label: "Motor" },
  { key: "life", label: "Life" },
  { key: "health", label: "Health" },
];

const calculatePolicyStatus = (dateString) => {
  if (!dateString) return null;

  const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
  if (!isValid(parsedDate)) {
    console.warn('Invalid date format:', dateString);
    return null;
  }

  const today = startOfDay(new Date());
  const policyEndDate = parsedDate;

  const isExpired = isBefore(policyEndDate, today);
  const daysToRenewal = differenceInDays(policyEndDate, today);

  const shouldShowRenewal = !isExpired && daysToRenewal <= 60 && daysToRenewal >= 0;

  console.log('Policy End Date:', policyEndDate);
  console.log('Today:', today);
  console.log('Days to renewal:', daysToRenewal);
  console.log('isExpired:', isExpired);

  if (daysToRenewal < 0) return "Expired";
  if (daysToRenewal <= 60) return `${daysToRenewal} days left`;

  return null;
};

const filterPolicies = (
  policies,
  searchTerm = "",
  selectedTypeFilter = "all"
) => {
  if (!Array.isArray(policies)) return [];
  const searchLower = searchTerm.trim().toLowerCase();
  return policies.filter((policy) => {
    const config = POLICY_CONFIGS[policy.policyType] || {
      label: "",
      category: "",
    };
    const matchesTypeFilter =
      selectedTypeFilter === "all" || config.category === selectedTypeFilter;
    const matchesSearchTerm =
      !searchLower ||
      (policy.insuredName?.toLowerCase().includes(searchLower) ?? false) ||
      (policy.policyNumber?.toLowerCase().includes(searchLower) ?? false) ||
      config.label.toLowerCase().includes(searchLower);
    return matchesTypeFilter && matchesSearchTerm;
  });
};

const SearchAndFilter = ({
  searchTerm,
  onSearchChange,
  selectedTypeFilter,
  onTypeFilterChange,
  onClearAll,
  classes,
}) => {
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const selectedFilter = POLICY_TYPE_FILTERS.find(
    (f) => f.key === selectedTypeFilter
  );

  return (
    <Box className={classes.searchContainer}>
      <TextField
        fullWidth
        variant="outlined"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={classes.searchField}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#8AC642", fontSize: "2rem" }} />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                onClick={() => onSearchChange("")}
                sx={{ color: "#fff" }}
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        placeholder="Search by Name, Policy number, or Policy type..."
      />

      <Button
        className={classes.filterButton}
        onClick={(e) => setFilterAnchorEl(e.currentTarget)}
        endIcon={<ExpandMoreIcon />}
        startIcon={<FilterListIcon />}
      >
        {selectedFilter.label}
      </Button>

      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
        className={classes.filterMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {POLICY_TYPE_FILTERS.map((filter) => (
          <MenuItem
            key={filter.key}
            onClick={() => {
              onTypeFilterChange(filter.key);
              setFilterAnchorEl(null);
            }}
            selected={selectedTypeFilter === filter.key}
          >
            {filter.label}
          </MenuItem>
        ))}
      </Menu>

      {(searchTerm || selectedTypeFilter !== "all") && (
        <Button
          onClick={onClearAll}
          sx={{
            color: "#ff6b6b",
            fontSize: "1.2rem",
            textTransform: "none",
            minWidth: "auto",
            padding: "8px 12px",
            "&:hover": { backgroundColor: "rgba(255, 107, 107, 0.1)" },
          }}
        >
          Clear
        </Button>
      )}
    </Box>
  );
};

const PolicyCard = ({
  policy,
  shareAllPolicy,
  selectedPolicies,
  handleCheckboxChange,
  handleCardClick,
  showStatus = false,
  isExpired = false,
  isSelected = false,
  fetchData,
  activeTab,
  value
}) => {
  const config = POLICY_CONFIGS[policy.policyType] || {
    label: "",
    image: scooty,
  };
  const status = showStatus
    ? calculatePolicyStatus(policy.policyEndDate)
    : null;

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

  const confirmDelete = () => {
    handleDelete(policy._id);
    setOpenConfirm(false);
  };
  
  const handleDelete = async (policyId) => {
    try {
      const response = await fetch(`${API_URL}policy/delete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: (() => {
          const formData = new FormData();
          formData.append("policyId", policyId);
          return formData;
        })(),
      });

      if (response.ok) {
        console.log("Policy deleted successfully!");
        if (value === 2) {
          fetchData("policy/archiveData", { status: "archive" }, true);
        } else if (value === 3) {
          fetchData("policy/getById", { policyType: "uncompleted" }, false, true);
        } else {
          fetchData("policy/getById", { policyType: activeTab });
        }
      } else {
        console.error("Failed to delete policy:", response.status);
      }
    } catch (error) {
      console.error("Error deleting policy:", error);
    }
  };

  return (
    <Card
      className="mb-4 rounded-5 card-detail"
      onClick={() => handleCardClick(policy._id)}
      sx={{
        boxShadow: isSelected
          ? "0 0 5px rgba(138, 198, 66, 0.5)"
          : "rgba(17, 17, 26, 0.1) 0px 0px 16px",
        backgroundColor: "#3E3E3E !important",
        color: THEME_COLOR.COLOR,
        cursor: "pointer",
        borderWidth: isSelected ? "2px" : "1px",
        border: isSelected ? "1px solid #8AC642" : "1px solid #999999",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{}}>
        {/* Status Badge - Fixed positioning to prevent overlap */}
        {(status || isExpired) && (
          <>
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: "120px",
                height: '30px',
                backgroundImage: `url(${redBg})`,
                backgroundSize: "cover",
                opacity: 1,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 5,
                right: 25,
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "bold",
                zIndex: 1,
              }}
            >
              {isExpired ? "Expired" : status}
            </div>
          </>
        )}

        <Grid container spacing={2} alignItems="center">
          {/* Checkbox */}
          {shareAllPolicy && (
            <Grid item xs={12} sm={1}>
              <Checkbox
                checked={selectedPolicies.includes(policy._id)}
                onChange={() => handleCheckboxChange(policy._id)}
                sx={{
                  color: "#ffffff !important",
                  "&.Mui-checked": { color: THEME_COLOR.GREEN },
                }}
              />
            </Grid>
          )}

          {/* Policy Image */}
          <Grid item xs={12} sm={shareAllPolicy ? 2 : 2}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: { xs: 2, sm: 0 },
              }}
            >
              <img
                src={config.image}
                alt="Policy"
                style={{
                  width: "100%",
                  maxWidth: "80px",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </Box>
          </Grid>

          {/* Policy Details */}
          <Grid item xs={12} sm={8} sx={{}}>
            <Box sx={{ pr: { xs: 0, sm: status || isExpired ? 8 : 2 } }}>
              {/* Policy Type */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <Box
                  sx={{
                    backgroundColor: "#8AC642 !important",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    mr: 1,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    color: "#8AC642 !important",
                    fontSize: "1.3rem",
                    fontWeight: "600",
                  }}
                >
                  {config.label}
                </Typography>
              </Box>

              {/* Insured Name */}
              <Typography
                sx={{
                  fontSize: "1.6rem",
                  color: "#fff !important",
                  fontWeight: "800",
                  wordBreak: "break-word",
                  mb: 0.4,
                }}
              >
                {policy.insuredName}
              </Typography>

              {/* Policy Number */}
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#fff !important",
                  mb: 0.15,
                  wordBreak: "break-all",
                }}
              >
                {policy.policyNumber}
              </Typography>

              {/* Expiry Date */}
              <Typography
                sx={{
                  fontSize: "1rem !important",
                  fontWeight: "600",
                  color: "#fff",
                }}
              >
                Expires on{" "}
                {moment(policy.policyEndDate, [
                  "DD/MM/YYYY",
                  "YYYY-MM-DD",
                ]).format("DD MMM, YYYY")}
              </Typography>
            </Box>
          </Grid>

          {/* Arrow Icon */}
          <Grid item xs={12} sm={1}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip style={{ fontSize: "1.2rem" }}>
                    Policy Details
                  </Tooltip>
                }
              >
                <img
                  src={arrow}
                  alt="arrow"
                  style={{
                    height: "30px",
                    width: "auto",
                    cursor: "pointer",
                  }}
                />
              </OverlayTrigger>
            </Box>
          </Grid>

          {/* Delete Icon */}
          <Grid item xs={12} sm={1}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip style={{ fontSize: "1.2rem" }}>
                    Delete Policy
                  </Tooltip>
                }
              >
                <IconButton
                  sx={{
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                    width: 25,
                    height: 25,
                    boxShadow: 2,
                  }}
                  onClick={handleOpenConfirm}
                >
                  <DeleteIcon
                    sx={{
                      fontSize: 16,
                      color: "red",
                    }}
                  />
                </IconButton>
              </OverlayTrigger>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
      >
        <DialogTitle variant="h5">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText variant="h5">
            Are you sure you want to delete this policy?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="inherit" sx={{ fontSize: 12 }}>
            Cancel
          </Button>
          <Button fontSize="1rem" onClick={confirmDelete} color="error" variant="contained" sx={{ fontSize: 12 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

const EmptyState = ({ hasFilters, onClearFilters }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      height: "500px",
      color: THEME_COLOR.COLOR,
    }}
  >
    <img
      src={emptyImage}
      alt="No Data"
      style={{ width: "40%", height: "auto", maxWidth: "200px" }}
    />
    <Typography sx={{ fontSize: "1.6rem", mb: 2, mt: 3 }}>
      {hasFilters ? "No policies match your search" : "No Record Found"}
    </Typography>
    {hasFilters && (
      <Button
        variant="outlined"
        onClick={onClearFilters}
        sx={{
          color: "#8AC642",
          borderColor: "#8AC642",
          "&:hover": { backgroundColor: "rgba(138, 198, 66, 0.1)" },
        }}
      >
        Clear Filters
      </Button>
    )}
  </Box>
);

const CustomPagination = ({
  totalItems,
  currentPage,
  onPageChange,
  itemsPerPage = 3,
}) => (
  <Box sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}>
    <Pagination
      variant="outlined"
      size="small"
      count={Math.ceil(totalItems / itemsPerPage)}
      page={currentPage}
      onChange={onPageChange}
      sx={{
        "& .MuiPaginationItem-root": {
          color: "#fff",
          borderColor: "#fff",
          "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
        },
        "& .MuiPaginationItem-root.Mui-selected": {
          backgroundColor: "#fff",
          color: "#000",
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
}) {
  const {
    value,
    pages,
    policyList,
    activeTab,
    loading,
    selectedPolicyId,
    searchTerm,
    selectedTypeFilter,
    showSessionExpired,
    setSelectedPolicyId,
    setSearchTerm,
    setSelectedTypeFilter,
    setPages,
    fetchData,
    handleTabChange,
    handleClearAll,
    handleSessionExpiredOk,
    itemsPerPage,
    setActiveTab,
    archieveList,
    pendingList, // Added pendingList from context
    setValue
  } = usePolicyContext();

  const classes = useStyles();

  useEffect(() => {
    setActiveTab('active')
    const savedPolicyId = sessionStorage.getItem("selectedPolicyId");
    const savedTab = sessionStorage.getItem("selectedTab");
    if (savedPolicyId) setSelectedPolicyId(savedPolicyId);
    if (savedTab) {
      const tabValue = parseInt(0);
      setValue(tabValue);
      if (tabValue < 2) setActiveTab(TAB_CONFIGS[tabValue].key);
    }
  }, []);

  useEffect(() => {
    // Updated to handle pending list separately
    const currentList = value === 2 ? archieveList : value === 3 ? pendingList : policyList;
    const filteredList = filterPolicies(
      currentList,
      searchTerm,
      selectedTypeFilter
    );

    if (!filteredList || filteredList.length === 0) {
      setSelectedPolicyId(null);
      sessionStorage.removeItem("selectedPolicyId");
      handleCardClick(null); // notify Vault.js to clear PolicyDetail
      return;
    }

    const storedId = sessionStorage.getItem("selectedPolicyId");
    const policyExists = filteredList.some((p) => p._id === storedId);

    if (policyExists) {
      setSelectedPolicyId(storedId);
      handleCardClick(storedId);
    } else {
      const firstId = filteredList[0]._id;
      setSelectedPolicyId(firstId);
      sessionStorage.setItem("selectedPolicyId", firstId);
      handleCardClick(firstId);
    }
  }, [value, policyList, archieveList, pendingList, searchTerm, selectedTypeFilter]); // Added pendingList dependency

  const handleCardClickWithState = (id) => {
    setSelectedPolicyId(id);
    sessionStorage.setItem("selectedPolicyId", id);
    handleCardClick(id);
  };

  useEffect(() => {
    if (value === 2) {
      fetchData("policy/archiveData", { status: "archive" }, true);
    } else if (value === 3) {
      fetchData("policy/getById", { policyType: "uncompleted" }, false, true); // Added isPending flag
    } else {
      fetchData("policy/getById", { policyType: activeTab });
    }
  }, [value, activeTab]);

  const renderTabContent = (
    tabValue,
    dataList,
    pageKey,
    showStatus = false,
    isExpired = false
  ) => {
    const filteredList = filterPolicies(
      dataList,
      searchTerm,
      selectedTypeFilter
    );
    const currentPage = pages[pageKey];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredList.slice(
      startIndex,
      startIndex + itemsPerPage
    );
    const hasFilters = searchTerm.trim() || selectedTypeFilter !== "all";

    return (
      <TabPanel
        value={tabValue}
        sx={{
          flex: 1,
          borderRadius: "12px !important",
          zIndex: 1,
          position: "relative  !important",
          paddingTop: 2,
          width: '100%',
          minHeight: '600px'
        }}
      >
        <Box
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          {filteredList.length === 0 ? (
            <EmptyState
              hasFilters={hasFilters}
              onClearFilters={handleClearAll}
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "500px"
              }}
            >
              {/* Scrollable List Area */}
              <Box sx={{ flex: 0.85, }}>
                {paginatedData.map((policy) => (
                  <PolicyCard
                    key={policy._id}
                    policy={policy}
                    shareAllPolicy={shareAllPolicy}
                    selectedPolicies={selectedPolicies}
                    handleCheckboxChange={handleCheckboxChange}
                    handleCardClick={handleCardClickWithState}
                    showStatus={showStatus}
                    isExpired={isExpired}
                    isSelected={policy._id === selectedPolicyId}
                    fetchData={fetchData}
                    value={value}
                    activeTab={activeTab}
                  />
                ))}
              </Box>

              {/* Fixed Pagination at Bottom */}
              <Box className='absolute bottom-0 !important' sx={{}}>
                {Math.ceil(filteredList.length / itemsPerPage) > 1 ? (
                  <CustomPagination
                    totalItems={filteredList.length}
                    currentPage={currentPage}
                    onPageChange={(event, newPage) =>
                      setPages((prev) => ({ ...prev, [pageKey]: newPage }))
                    }
                    itemsPerPage={itemsPerPage}
                  />
                ) : (
                  <Box sx={{ minHeight: "200px" }} /> // Empty space if pagination not needed
                )}
              </Box>
            </div>
          )}
        </Box>
      </TabPanel>
    );
  };

  const expiredCount = policyList.filter(
    (policy) => calculatePolicyStatus(policy.policyEndDate) === "Expired"
  ).length;

  return (
    <Box sx={{ px: { xs: 2, sm: 2 }, height: "100%" }}>
      <SessionExpiredModal
        visible={showSessionExpired}
        onConfirm={handleSessionExpiredOk}
      />
      <Card
        sx={{
          borderRadius: 5,
          boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
          backgroundColor: "#121212 !important",
          border: "0.5px solid white",
          pt: 1.5,
          height: '600px'
        }}
      >
        <TabContext value={value}>
          <Box
            sx={{ width: "100%", maxWidth: "1200px", mx: "auto", mb: 0, px: 2 }}
          >
            <SearchAndFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedTypeFilter={selectedTypeFilter}
              onTypeFilterChange={setSelectedTypeFilter}
              onClearAll={handleClearAll}
              classes={classes}
            />

            <Box
              sx={{
                width: { xs: "100%", sm: "100%" },
                backgroundColor: "#929292",
                mx: "auto",
                mt: 1,
                borderRadius: "35px",
                overflow: "hidden",
              }}
            >
              <TabList
                onChange={handleTabChange}
                variant="standard"
                TabIndicatorProps={{ style: { display: "none" } }}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "#3E3E3E",
                  padding: 0,
                  borderRadius: "35px",
                  px: 1,
                }}
              >
                {TAB_CONFIGS.map((tab) => (
                  <Tab
                    key={tab.value}
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          px: { xs: 1, sm: 2 },
                        }}
                      >
                        <span style={{ fontSize: "1.4rem" }}>{tab.label}</span>
                        {tab.value === 1 && value === 1 && expiredCount > 0 && (
                          <Box
                            sx={{
                              backgroundColor: "red",
                              color: "white",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1rem",
                              fontWeight: "bold",
                              minWidth: "20px",
                              minHeight: "20px",
                              lineHeight: "1",
                            }}
                          >
                            {expiredCount}
                          </Box>
                        )}
                      </Box>
                    }
                    value={tab.value}
                    sx={{
                      color: value === tab.value ? THEME_COLOR.GREEN : "white",
                      backgroundColor:
                        value === tab.value ? "white" : "inherit",
                      textTransform: "capitalize",
                      borderRadius: "25px",
                      fontSize: { xs: "1.2rem", sm: "1.2rem" },
                      fontWeight: "700",
                      minWidth: "unset",
                      flex: 1,
                      mx: 0.5,
                      my: 0.5,
                      px: { xs: 1, sm: 2 },
                    }}
                    onClick={() => tab.value < 2 && setActiveTab(tab.key)}
                  />
                ))}
              </TabList>
            </Box>
          </Box>

          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Loader sx={{ color: "#8AC642" }} />
            </Box>
          ) : (
            <div style={{ height: "100%" }}>
              {renderTabContent(0, policyList, "active", true, false)}
              {renderTabContent(1, policyList, "expired", false, true)}
              {renderTabContent(2, archieveList, "archive", false, false)}
              {renderTabContent(3, pendingList, "pending", true, false)}
            </div>
          )}
        </TabContext>
      </Card>
    </Box>
  );
}