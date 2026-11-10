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
  LinearProgress,
} from "@mui/material";
import { TabList, TabContext, TabPanel } from "@mui/lab";
import { makeStyles } from "@mui/styles";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Loader from "../../component/Loader";
import scooty from "../../Images/new_bike.png";
import HealthInsurance from "../../Images/new_health.png";
import car from "../../Images/ic_car.png";
import Health from "../../Images/new_health.png";
import Life from "../../Images/new_life.png";
import Travel from "../../Images/img_travelCard.png";
import arrow from "../../Images/right-arrow.png";
import emptyImage from "../../Images/NoData.png";
import gmailIcon from "../../Images/logos_google-gmail.png";
import "./policy.css";
import API_URL from "../../ServiceModule/Service";
import { THEME_COLOR } from "../../constants";
import moment from "moment";
import redBg from "../../Images/red-img.png";
import SessionExpiredModal from "../../utils/sessionExpireModal";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  parse,
  isBefore,
  differenceInDays,
  startOfDay,
  isValid,
} from "date-fns";
import { usePolicyContext } from "../../store/policyContext";
import { getSumAssured } from "../utils/policyValues";

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
  progressContainer: {
    display: "flex",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: "6px",
    borderRadius: "3px",
    backgroundColor: "#444 !important",
    "& .MuiLinearProgress-bar": {
      backgroundColor: "#8AC642 !important",
      borderRadius: "3px",
    },
  },
  progressText: {
    color: "#8AC642 !important",
    fontSize: "11px !important",
    fontWeight: "600 !important",
    minWidth: "35px",
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
    motor: {
    label: "motor",
    image: scooty,
    category: "motor",
  },
  life: { label: "Life Insurance", image: Life, category: "life" },
  accident: { label: "Personal Accident Insurance", image: Health, category: "health" },
  health: { label: "Health Insurance", image: Health, category: "health" },
  travel: { label: "Travel Insurance", image: Travel, category: "travel" },
  crop: { label: "Crop Insurance", image: HealthInsurance, category: "crop" },
  crop_policy: { label: "Crop Insurance", image: HealthInsurance, category: "crop" },
  cattle: { label: "Cattle Insurance", image: HealthInsurance, category: "cattle" },
  cattle_policy: { label: "Cattle Insurance", image: HealthInsurance, category: "cattle" },
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
  { key: "health", label: "Health" },
  { key: "life", label: "Life" },
  { key: "car_policy", label: "Four Wheeler" },
  { key: "bike_policy", label: "Two Wheeler" },
  { key: "accident", label: "Accident" },
  { key: "travel", label: "Travel" },
  { key: "crop", label: "Crop" },
  { key: "cattle", label: "Cattle" },
  { key: "pending", label: "Pending" },
];

const normalizePolicyType = (value) =>
  String(value || "").toLowerCase().replace(/[\s-]+/g, "_").trim();

const doesPolicyMatchFilter = (policy, filter) => {
  const policyType = normalizePolicyType(policy?.policyType);
  const normalizedFilter = normalizePolicyType(filter);

  if (!normalizedFilter || normalizedFilter === "all") return true;
  if (normalizedFilter === "health") return policyType.includes("health");
  if (normalizedFilter === "life") return policyType.includes("life");
  if (normalizedFilter === "accident") return policyType.includes("accident");
  if (normalizedFilter === "travel") return policyType.includes("travel");
  if (normalizedFilter === "crop") return policyType.includes("crop");
  if (normalizedFilter === "cattle") return policyType.includes("cattle");

  return policyType === normalizedFilter || policyType.includes(normalizedFilter);
};

// Progress calculation logic from React Native version
const getInputFieldsByPolicyType = (policy) => {
  switch (policy.policyType) {
    case "car_policy":
    case "bike_policy":
    case "other_vehicle":
      return [
        policy?.policyNumber,
        policy?.policyStartDate,
        policy?.policyEndDate,
        policy?.premiumPaid || policy?.policyDetails?.totalPremium,
        policy?.insuredName,
        policy?.insuredCompany,
        policy?.policyDetails?.registrationNumber,
        policy?.policyDetails?.make,
        policy?.policyDetails?.model,
        policy?.policyDetails?.assetType,
        policy?.policyDetails?.idv,
      ];
    case "life":
    case "accident":
      return [
        policy?.policyNumber,
        policy?.policyStartDate,
        policy?.policyEndDate,
        getSumAssured(policy),
        policy?.premiumPaid,
        policy?.insuredName,
        policy?.insuredCompany,
        policy?.policyDetails?.policyName,
      ];
    case "health":
    case "other_health":
      return [
        policy?.policyNumber,
        policy?.policyStartDate,
        policy?.policyEndDate,
        getSumAssured(policy),
        policy?.premiumPaid,
        policy?.insuredName,
        policy?.insuredCompany,
        policy?.policyDetails?.policyName,
      ];
    case "travel":
      return [
        policy?.policyNumber,
        policy?.policyStartDate,
        policy?.policyEndDate,
        policy?.premiumPaid,
        policy?.insuredCompany,
        policy?.policyDetails?.policyCoverAmount,
        policy?.policyDetails?.travelType,
        policy?.policyDetails?.countryVisited,
        policy?.policyDetails?.tripType,
        policy?.policyDetails?.planName,
      ];
    case "crop":
    case "crop_policy":
      return [
        policy?.policyNumber,
        policy?.policyStartDate,
        policy?.policyEndDate,
        policy?.premiumPaid,
        policy?.insuredCompany,
        policy?.policyDetails?.policyName || policy?.policyName,
        policy?.policyDetails?.farmerName || policy?.farmerName,
        policy?.policyDetails?.season || policy?.season,
        getSumAssured(policy),
      ];
    case "cattle":
    case "cattle_policy":
      return [
        policy?.policyNumber,
        policy?.policyStartDate,
        policy?.policyEndDate,
        policy?.premiumPaid,
        policy?.insuredCompany,
        policy?.policyDetails?.policyName || policy?.policyName,
        policy?.policyDetails?.ownerName || policy?.ownerName,
        policy?.policyDetails?.cattleType || policy?.cattleType,
        getSumAssured(policy),
      ];
    default:
      return [
        policy?.policyNumber,
        policy?.policyStartDate,
        policy?.policyEndDate,
        policy?.insuredName,
      ];
  }
};

const calculateProgress = (policy) => {
  const inputFields = getInputFieldsByPolicyType(policy);
  const filledFields = inputFields.filter(
    (field) => field !== "" && field !== undefined && field !== null
  ).length;
  return Math.round((filledFields / inputFields.length) * 100);
};

// Progress Bar Component
const ProgressBarComponent = ({ progress, classes }) => {
  if (progress >= 100) return null;

  return (
    <Box className={classes.progressContainer}>
      <LinearProgress
        variant="determinate"
        value={progress}
        className={classes.progressBar}
      />
      <Typography className={classes.progressText}>{progress}%</Typography>
    </Box>
  );
};

const calculatePolicyStatus = (dateString) => {
  if (
    !dateString ||
    dateString === "" ||
    dateString === "NaN" ||
    dateString === null ||
    dateString === undefined
  ) {
    return null;
  }

  try {
    const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());

    if (!isValid(parsedDate)) {
      console.warn("Invalid date format:", dateString);
      return null;
    }

    const today = startOfDay(new Date());
    const policyEndDate = parsedDate;

    const isExpired = isBefore(policyEndDate, today);
    const daysToRenewal = differenceInDays(policyEndDate, today);

    if (daysToRenewal < 0) return "Expired";
    if (daysToRenewal <= 60) return `${daysToRenewal} days left`;

    return null;
  } catch (error) {
    console.warn("Error parsing date:", dateString, error);
    return null;
  }
};

const isPendingPolicy = (policy) => {
  return (
    !policy.policyEndDate ||
    policy.policyEndDate === "" ||
    policy.policyEndDate === "NaN" ||
    !policy.policyStartDate ||
    policy.policyStartDate === "" ||
    policy.policyStartDate === "NaN" ||
    !policy.premiumPaid ||
    policy.premiumPaid === "" ||
    policy.premiumPaid === "NaN" ||
    policy.status === "pending" ||
    policy.status === "uncompleted"
  );
};

const filterPolicies = (
  policies,
  searchTerm = "",
  selectedTypeFilter = "all",
  isPendingTab = false
) => {
  if (!Array.isArray(policies)) return [];

  const searchLower = searchTerm.trim().toLowerCase();

  return policies.filter((policy) => {
    const config = POLICY_CONFIGS[policy.policyType] || {
      label: "Unknown Policy",
      category: "other",
    };


    let matchesTypeFilter;

    if (isPendingTab) {
      // For pending tab, policies are already filtered as pending
      // Just apply category filter on top
      if (selectedTypeFilter === "all" || selectedTypeFilter === "pending") {
        matchesTypeFilter = true;
      } else {
        matchesTypeFilter = doesPolicyMatchFilter(policy, selectedTypeFilter);
      }
    } else {
      // For other tabs, use normal category filtering
      if (selectedTypeFilter === "all") {
        matchesTypeFilter = true;
      } else if (selectedTypeFilter === "pending") {
        matchesTypeFilter = isPendingPolicy(policy);
      } else {
        matchesTypeFilter = doesPolicyMatchFilter(policy, selectedTypeFilter);
      }
    }

    const matchesSearchTerm =
      !searchLower ||
      [
        policy.insuredName || "",
        policy.policyNumber || "",
        config.label || "",
        policy.insuredCompany || "",
      ].some((field) => field.toLowerCase().includes(searchLower));

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
  onPendingPolicyClick,
  showStatus = false,
  isExpired = false,
  isSelected = false,
  fetchData,
  activeTab,
  value,
  classes,
  showProgress = false, // New prop to control progress bar display
  fetchTabCount,
}) => {
  const config = POLICY_CONFIGS[policy.policyType] || {
    label: "Unknown Policy",
    image: scooty,
  };

  
  console.log("policu" , policy)
  const getSafeValue = (value, fallback = "Not Available") => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === "NaN"
    ) {
      return fallback;
    }
    return value;
  };

  const isValidDate = (dateString) => {
    if (!dateString || dateString === "" || dateString === "NaN") {
      return false;
    }
    const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
    return isValid(parsedDate);
  };

  const status =
    showStatus && isValidDate(policy?.policyEndDate)
      ? calculatePolicyStatus(policy?.policyEndDate)
      : null;

  const isPendingPolicy =
    value === 3 || !policy.policyEndDate || policy.policyEndDate === "";

  const progress = showProgress ? calculateProgress(policy) : 0;

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenConfirm = (e) => {
    e.stopPropagation();
    setOpenConfirm(true);
  };

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
         if (value === 0) {
          await fetchData("policy/getById", { policyType: "active" });
          fetchTabCount("active"); // ✅ Update active count
        } 
       else if (value === 1) {
          await fetchData("policy/getById", { policyType: "expired" });
          fetchTabCount("expired"); // ✅ Update expired count
        }
        else if (value === 2) {
          await fetchData("policy/archiveData", { status: "archive" }, true);
          fetchTabCount("archive"); // ✅ Update archive count
        }  else if (value === 3) {
          await fetchData(
            "policy/getById",
            { policyType: "uncompleted" },
            false,
            true
          );
          fetchTabCount("pending"); // ✅ Update pending count
        }
      } else {
        console.error("Failed to delete policy:", response.status);
      }
    } catch (error) {
      console.error("Error deleting policy:", error);
    }
  };

  const getCompanyInitials = (label) => {
  if (!label) return 'IC';
  
  return label
    .split(' ')
    .map((word) => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

  const pendingReasonTitle =
    policy.reason === "password_protected"
      ? "Password protected policy"
      : "Policy document pending";
  const pendingReasonLabel = getSafeValue(policy.reason, "pending").replace(
    /_/g,
    " "
  );
  const pendingEmail = getSafeValue(policy.senderEmail || policy.gmailAddress, "");
  const pendingPolicyNumber = getSafeValue(policy.policyNumber, "Policy number not found");

  if (isPendingPolicy) {
    return (
      <Card
        className="mb-4"
        onClick={() =>
          onPendingPolicyClick
            ? onPendingPolicyClick(policy)
            : handleCardClick(policy._id)
        }
        sx={{
          backgroundColor: "#252936 !important",
          color: "#fff",
          cursor: "pointer",
          border: isSelected ? "2px solid #8AC642" : "1px solid #464b5c",
          borderRadius: "20px !important",
          boxShadow: isSelected
            ? "0 0 10px rgba(138, 198, 66, 0.35)"
            : "0 14px 30px rgba(0, 0, 0, 0.28)",
          overflow: "hidden",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        <CardContent sx={{ p: "0 !important" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "96px 1fr", sm: "126px 1fr" },
              minHeight: { xs: 116, sm: 132 },
            }}
          >
            <Box
              sx={{
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                borderRight: "2px solid #cfd3df",
              }}
            >
              <img
                src={gmailIcon}
                alt="Gmail"
                style={{
                  width: "52%",
                  maxWidth: 64,
                  height: "auto",
                  objectFit: "contain",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  right: { xs: 10, sm: 14 },
                  bottom: { xs: 22, sm: 28 },
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  backgroundColor: "#ffe1a2",
                  border: "3px solid #fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#5a4116",
                }}
              >
                <LockOutlinedIcon sx={{ fontSize: 18 }} />
              </Box>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: { xs: 1.5, sm: 2 },
                alignItems: "center",
                p: { xs: 1.6, sm: 2.2 },
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1.5,
                    mb: 0.6,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "1.15rem", sm: "1.35rem" },
                      fontWeight: 800,
                      lineHeight: 1.15,
                      color: "#f6f7fb",
                    }}
                  >
                    {pendingReasonTitle}
                  </Typography>
                  <Box
                    sx={{
                      display: { xs: "none", md: "inline-flex" },
                      alignItems: "center",
                      gap: 0.8,
                      color: "#ffc76b",
                      border: "2px solid rgba(255, 199, 107, 0.42)",
                      backgroundColor: "rgba(255, 179, 68, 0.12)",
                      borderRadius: "999px",
                      px: 1.6,
                      py: 0.45,
                      fontSize: "1.1rem",
                      fontWeight: 800,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <LockOutlinedIcon sx={{ fontSize: 17 }} />
                    {pendingReasonLabel}
                  </Box>
                </Box>

                <Typography
                  sx={{
                    fontSize: { xs: "1.25rem", sm: "1.55rem" },
                    fontWeight: 800,
                    color: "#fff",
                    lineHeight: 1.15,
                    wordBreak: "break-word",
                  }}
                >
                  {pendingPolicyNumber}
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: "0.95rem", sm: "1.15rem" },
                    color: "#c5cad6",
                    mt: 0.4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: { xs: "normal", sm: "nowrap" },
                    wordBreak: "break-word",
                  }}
                >
                  {pendingEmail}
                </Typography>

              </Box>

              <IconButton
                aria-label="Open Add Policy"
                sx={{
                  width: { xs: 36, sm: 44 },
                  height: { xs: 36, sm: 44 },
                  backgroundColor: "#445066",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#53617a" },
                }}
              >
                <ChevronRightIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />
              </IconButton>
            </Box>
          </Box>
        </CardContent>

        <Dialog open={openConfirm} onClose={handleCloseConfirm}>
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
            <Button
              fontSize="1rem"
              onClick={confirmDelete}
              color="error"
              variant="contained"
              sx={{ fontSize: 12 }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    );
  }

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
        opacity: isPendingPolicy ? 1 : 1,
      }}
    >
      <CardContent>
        {isPendingPolicy && (
          <>
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: "120px",
                height: "30px",
                backgroundColor: "#ffa500",
                clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
                opacity: 0.9,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 5,
                right: 15,
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "bold",
                zIndex: 1,
              }}
            >
              Incomplete
            </div>
          </>
        )}
        {(status || isExpired) && !isPendingPolicy && (
          <>
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: "120px",
                height: "30px",
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
          {shareAllPolicy && (
            <Grid item xs={12} sm={1}>
              <Checkbox
                checked={selectedPolicies.includes(policy._id)}
                onChange={() => handleCheckboxChange(policy._id)}
                sx={{
                  transform: "scale(1.5)",
                  color: "#ffffff !important",
                  "&.Mui-checked": { color: THEME_COLOR.GREEN },
                }}
              />
            </Grid>
          )}

        <Grid item xs={12} sm={shareAllPolicy ? 2 : 3}>
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      mb: { xs: 2, sm: 0 },
      width: "100%",
    }}
  >
    {/* Company Logo or Initials */}
    {policy.companyDetails?.icon ? (
      <img
        src={policy.companyDetails.icon}
        alt={policy.companyDetails?.label || "Company Logo"}
        style={{
          width: "80px",
          height: "60px",
          objectFit: "contain",
          borderRadius: "6px",
          backgroundColor: "transparent",
        }}
      />
    ) : (
      <Box
        sx={{
          width: "80px",
          height: "60px",
          backgroundColor: policy.companyDetails?.label ? "#00bcd4" : "#555",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "6px",
        }}
      >
        <Typography
          sx={{ 
            fontSize: "1.25rem", 
            color: "#fff", 
            fontWeight: 700 
          }}
        >
          {getCompanyInitials(policy.companyDetails?.label)}
        </Typography>
      </Box>
    )}

    {/* Company Name */}
    <Typography
      sx={{
        fontSize: "0.9rem",
        fontWeight: 600,
        color: "#fff",
        textAlign: "center",
        mt: 0.5,
        maxWidth: "100px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        lineHeight: 1.3,
      }}
    >
      {policy.companyDetails?.label || "No Company Found"}
    </Typography>
  </Box>
</Grid>

          <Grid item xs={12} sm={7} sx={6}>
            <Box
              sx={{
                pr: {
                  xs: 0,
                  sm: status || isExpired || isPendingPolicy ? 8 : 2,
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <Box
                  sx={{
                    backgroundColor: isPendingPolicy
                      ? "#ffa500 !important"
                      : "#8AC642 !important",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    mr: 1,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    color: isPendingPolicy
                      ? "#ffa500 !important"
                      : "#8AC642 !important",
                    fontSize: "1.3rem",
                    fontWeight: "600",
                  }}
                >
                  {config.label}
                </Typography>
              </Box>

              {policy.policyType !== "travel" && (
                <Typography
                  sx={{
                    fontSize: "1.6rem",
                    color: "#fff !important",
                    fontWeight: "800",
                    wordBreak: "break-word",
                    mb: 0.4,
                  }}
                >
                  {getSafeValue(policy.insuredName, "")}
                </Typography>
              )}

              {/* Don't show policy number for pending policies */}
              {!isPendingPolicy && (
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#fff !important",
                    mb: 0.15,
                    wordBreak: "break-all",
                  }}
                >
                  {getSafeValue(
                    policy.policyNumber,
                    "Policy number not available"
                  )}
                </Typography>
              )}

              {/* Progress Bar - Only show for pending policies */}
              {showProgress && (
                <ProgressBarComponent progress={progress} classes={classes} />
              )}
            </Box>
          </Grid>

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

      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle variant="h5">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText variant="h5">
            Are you sure you want to delete this policy?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirm}
            color="inherit"
            sx={{ fontSize: 12 }}
          >
            Cancel
          </Button>
          <Button
            fontSize="1rem"
            onClick={confirmDelete}
            color="error"
            variant="contained"
            sx={{ fontSize: 12 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

const EmptyState = ({ hasFilters, onClearFilters, isPendingTab = false }) => (
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
      {hasFilters
        ? "No policies match your search"
        : isPendingTab
        ? "No pending policies found"
        : "No Record Found"}
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
  <Box sx={{ display: "flex", justifyContent: "center", mb: 0 }}>
    <Pagination
      variant="outlined"
      size="medium"
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
  onPendingPolicyClick,
  shareAllPolicy,
  selectedPolicies,
  handleCheckboxChange,
}) {
  const {
    value,
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
    fetchData,
    handleTabChange,
    handleClearAll,
    handleSessionExpiredOk,
    setActiveTab,
    archieveList,
    pendingList,
    setValue,
  } = usePolicyContext();

  const classes = useStyles();

    // ✅ NEW: State to store counts
  const [tabCounts, setTabCounts] = useState({
    active: 0,
    expired: 0,
    archive: 0,
    pending: 0,
  });

    // ✅ NEW: Separate function to fetch count only
  const fetchTabCount = async (tabKey) => {
    try {
      let endpoint = "";
      let params = {};

      if (tabKey === "archive") {
        endpoint = `${API_URL}policy/archiveData`;
        params = { status: "archive" };
      } else if (tabKey === "pending") {
        endpoint = `${API_URL}policy/getById`;
        params = { policyType: "uncompleted" };
      } else {
        endpoint = `${API_URL}policy/getById`;
        params = { policyType: tabKey };
      }

      // Build URL with query params
      const queryString = new URLSearchParams({
        userId: sessionStorage.getItem("userId") || "",
        ...params,
      }).toString();

      const response = await fetch(`${endpoint}?${queryString}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
              console.log(`✅ Response for ${tabKey}:`, data); // ✅ Debug log

        if (data.totalCount !== undefined) {
                  console.log(`📊 Setting count for ${tabKey}:`, data.totalCount); // ✅ Debug log

          setTabCounts((prev) => ({
            ...prev,
            [tabKey]: data.totalCount,
          }));
        }
         else {
        console.warn(`⚠️ No totalCount in response for ${tabKey}`); // ✅ Debug log
      }
    } else {
      console.error(`❌ Failed to fetch ${tabKey}:`, response.status); // ✅ Debug log
    }
    } catch (error) {
      console.error(`Error fetching count for ${tabKey}:`, error);
    }
  };

    // ✅ Fetch all tab counts on mount
  useEffect(() => {
    fetchTabCount("active");
    fetchTabCount("expired");
    fetchTabCount("archive");
    fetchTabCount("pending");
  }, []); // Only run once on mount

  // Restore selected policy & tab
  useEffect(() => {
    setActiveTab("active");
    const savedPolicyId = sessionStorage.getItem("selectedPolicyId");
    const savedTab = sessionStorage.getItem("selectedTab");

    if (savedPolicyId) setSelectedPolicyId(savedPolicyId);
    if (savedTab) {
      const tabValue = parseInt(0);
      setValue(tabValue);
      if (tabValue < 2) setActiveTab(TAB_CONFIGS[tabValue].key);
    }
  }, []);

 

  // Select correct policy when filters change
  useEffect(() => {
    const currentList =
      value === 2 ? archieveList : value === 3 ? pendingList : policyList;

    const filteredList = filterPolicies(
      currentList,
      searchTerm,
      selectedTypeFilter
    );

    if (!filteredList || filteredList.length === 0) {
      setSelectedPolicyId(null);
      sessionStorage.removeItem("selectedPolicyId");
      handleCardClick(null);
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
  }, [
    value,
    policyList,
    archieveList,
    pendingList,
    searchTerm,
    selectedTypeFilter,
  ]);

  // Fetch data based on tab
  useEffect(() => {
    if (value === 2) {
      fetchData("policy/archiveData", { status: "archive" }, true);
    } else if (value === 3) {
      fetchData("policy/getById", { policyType: "uncompleted" }, false, true);
    } else {
      fetchData("policy/getById", { policyType: activeTab });
    }
  }, [value, activeTab]);

 

  const handleCardClickWithState = (id) => {
    setSelectedPolicyId(id);
    sessionStorage.setItem("selectedPolicyId", id);
    handleCardClick(id);
  };

  // Renders tab contents
  const renderTabContent = (
    tabValue,
    dataList,
    showStatus = false,
    isExpired = false
  ) => {
    let actualDataList = dataList;
    if (
      tabValue === 3 &&
      (!dataList || dataList.length === 0) &&
      policyList &&
      policyList.length > 0
    ) {
      actualDataList = policyList.filter(isPendingPolicy);
    }

    const filteredList = filterPolicies(
      actualDataList,
      searchTerm,
      selectedTypeFilter,
      tabValue === 3
    );

    const hasFilters = searchTerm.trim() || selectedTypeFilter !== "all";

   return (
  <TabPanel
    value={tabValue}
    sx={{
      flex: 1,
      borderRadius: "12px !important",
      zIndex: 1,
      position: "relative !important",
      paddingTop: 2,
      width: "100%",
      height: "600px",
      overflowY: "auto", // ✅ Enables scrolling
      scrollbarWidth: "thin",
      "&::-webkit-scrollbar": {
        width: "6px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#555",
        borderRadius: "6px",
      },
    }}
  >
    {filteredList.length === 0 ? (
      <EmptyState
        hasFilters={hasFilters}
        onClearFilters={handleClearAll}
        isPendingTab={tabValue === 3}
      />
    ) : (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pb: 12, // ✅ Increased bottom padding (more space below last card)
          pr: 1,  // optional spacing from scrollbar
        }}
      >
        {filteredList.map((policy) => (
          <PolicyCard
            key={policy._id}
            policy={policy}
            shareAllPolicy={shareAllPolicy}
            selectedPolicies={selectedPolicies}
            handleCheckboxChange={handleCheckboxChange}
            handleCardClick={handleCardClickWithState}
            onPendingPolicyClick={onPendingPolicyClick}
            showStatus={showStatus}
            isExpired={isExpired}
            isSelected={policy._id === selectedPolicyId}
            fetchData={fetchData}
            value={tabValue}
            activeTab={activeTab}
            classes={classes}
            showProgress={tabValue === 3}
             fetchTabCount={fetchTabCount}
          />
        ))}
      </Box>
    )}
  </TabPanel>
);

  };

  const expiredCount = policyList.filter(
    (policy) => calculatePolicyStatus(policy?.policyEndDate) === "Expired"
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
          height: "600px",
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
                width: "100%",
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
                  borderRadius: "35px",
                  px: 1,
                }}
              >
                   {TAB_CONFIGS.map((tab) => {
                  const tabCount = tabCounts[tab.key];
                  const showCount = tabCount > 0;

                  return (
                    <Tab
                      key={tab.value}
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <span style={{ fontSize: "1.4rem" }}>{tab.label}</span>
                          {showCount && (
                            <Box
                              sx={{
                                backgroundColor: tab.value === 1 ? "red" : "#8AC642",
                                color: "white",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1rem",
                                fontWeight: "bold",
                                minWidth: "24px",
                                minHeight: "24px",
                                padding: "2px 6px",
                              }}
                            >
                              {tabCount}
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
                        fontSize: "1.2rem",
                        fontWeight: "700",
                        flex: 1,
                        px: 1,
                      }}
                      onClick={() => tab.value < 2 && setActiveTab(tab.key)}
                    />
                  );
                })}
                {/* {TAB_CONFIGS.map((tab) => (
                  <Tab
                    key={tab.value}
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
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
                      fontSize: "1.2rem",
                      fontWeight: "700",
                      flex: 1,
                      px: 1,
                    }}
                    onClick={() => tab.value < 2 && setActiveTab(tab.key)}
                  />
                ))} */}
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
            <>
              {renderTabContent(0, policyList, true, false)}
              {renderTabContent(1, policyList, false, true)}
              {renderTabContent(2, archieveList, false, false)}
              {renderTabContent(3, pendingList, true, false)}
            </>
          )}
        </TabContext>
      </Card>
    </Box>
  );
}
