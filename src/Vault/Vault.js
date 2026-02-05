import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Card,
  Grid,
  Breadcrumbs,
  Link,
  Stack,
  CircularProgress,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Gmail from "../Images/Group 1000001305.png";

// Components
import Navbar from "../component/Navbar";
import Footer from "../Landing/component/Footer";
import PolicyTabs from "./component/PolicyTabs";
import PolicyDetail from "./component/PolicyDetail";
import Button from "../component/Button";
import GradientButton from "../component/GradientButton";
import About from "../Landing/component/About";
import Loader from "../component/Loader";
// Images and constants
import share from "../Images/ic-share1.png";
import cross from "../Images/xmark.png";
import AddIcon from "../Images/addIcon.png";
import uploadPdf from "../Images/uploadPdf.png";
import uploadImg from "../Images/uploadImg.png";
import API_URL from "../ServiceModule/Service";
import { THEME_COLOR } from "../constants";
import emptyImage from "../../src/Images/NoData.png";

import "./vault.css";
import SessionExpiredModal from "../utils/sessionExpireModal";
import { color } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePolicyContext } from "../store/policyContext";
import SyncIcon from "@mui/icons-material/Sync";

// import { Toast } from "react-bootstrap";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.dispatchEvent(new Event("session-expired"));
    }
    return Promise.reject(error);
  }
);

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    backgroundColor: "#212121",
    color: "#fff",
  },
  "& .MuiDialogActions-root": { padding: theme.spacing(1) },
}));

const StyledButton = styled("button")(({ isAllSelected }) => ({
  backgroundColor: "transparent",
  color: isAllSelected ? "#000" : "#8AC642",
  border: "1.5px solid #8AC642",
  borderRadius: "20px",
  padding: "8px 16px",
  marginTop: "0px",
  fontSize: "1.4rem",
  fontWeight: 600,
  minWidth: "100px",
  cursor: "pointer",
  userSelect: "none",
  transition: "all 0.25s ease",
  background: isAllSelected ? "#8AC642" : "transparent",
  "&:hover": { backgroundColor: "#8AC642", color: "#000" },
}));

const Vault = () => {
  const {
    policyListLength,
    setPolicyListLength,
    allPolicyIds,
    setAllPolicyIds,
  } = usePolicyContext();
  // Consolidated state
  const [dialogs, setDialogs] = useState({
    addPolicy: false,
    confirm: false,
    error: "",
  });
  const [files, setFiles] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [selectedPolicyId, setSelectedPolicyId] = useState("");
  const [shareAllPolicy, setShareAllPolicy] = useState(false);
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const navigate = useNavigate(); // navigation hook

  const inputRef = useRef();
  const imageRef = useRef();

  // Navigation mapping
  const navigationMap = {
    car_policy: "/motor-policy",
    bike_policy: "/motor-policy",
    other_vehicle: "/motor-policy",
    health: "/health-policy",
    other_health: "/health-policy",
    life: "/life-policy",
    accident: "/life-policy",
  };


  // ---- last sync
  const userId = useMemo(() => sessionStorage.getItem("userId"), []);

const [lastSync, setLastSync] = useState(null);

const getPolicyByUserId = async (userId) => {
  try {
    const token = sessionStorage.getItem("token");

    const res = await axios.get(`${API_URL}policy/getById`, {
      params: {
        userId,
        policyType: "all",
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    // 👇 use backend lastSyncedAt (UTC)
    const lastSyncedAt = res?.data?.lastSyncDate?.currentSyncTime;

    if (lastSyncedAt) {
      setLastSync(new Date(lastSyncedAt));
    }

  } catch (error) {
    console.error("Error fetching policy:", error);
  }
};


useEffect(() => {
  if (userId) {
    getPolicyByUserId(userId);
  }
}, [userId]);


const formatLastSyncIST = (date) => {
  if (!date) return "Not synced yet";

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const outlineChipStyle = {
  height: "38px",
  padding: "0 16px",
  borderRadius: "22px",
  border: "1.5px solid #8AC642",
  backgroundColor: "transparent",
  color: "#8AC642",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "default",
  whiteSpace: "nowrap",
};





  useEffect(() => {
    const handleSessionExpired = () => {
      setShowSessionExpired(true);
    };
    window.addEventListener("session-expired", handleSessionExpired);
    return () =>
      window.removeEventListener("session-expired", handleSessionExpired);
  }, []);

  // Utility functions
  const toggleDialog = (dialogType, state = null) =>
    setDialogs((prev) => ({
      ...prev,
      [dialogType]: state !== null ? state : !prev[dialogType],
    }));

  const resetFiles = (type) =>
    type === "pdf" ? setFiles(null) : setImage(null);

  const handleFileUpload = (e, type) => {
    const uploadedFiles = e.target.files;
    type === "pdf" ? setFiles(uploadedFiles) : setImage(uploadedFiles);
    // toggleDialog("addPolicy", false)
    toggleDialog("error", "");
  };

  // OCR data extraction
  const handleConfirm = async () => {
    setLoading(true);
    if (files == null && image == null) {
      toggleDialog("error", "Select at least one file to proceed.");
      return;
    }
    toggleDialog("error", "");
    toggleDialog("addPolicy", false);

    const token = sessionStorage.getItem("token");
    // console.log("Token from session:", sessionStorage.getItem("token"));
    const formData = new FormData();
    const filesToUpload = files || image;

    if (!filesToUpload) return;

    for (let i = 0; i < filesToUpload.length; i++) {
      formData.append("ocrText", filesToUpload[i]);
      formData.append("policyFile", filesToUpload[i]);
    }

    try {
      const response = await axios.post(
        `${API_URL}document/ocrExtractData`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const responseData = response.data;
        setResponseData(responseData);
        localStorage.setItem("documentId", responseData.documentId);
        const ocrTextObject = JSON.parse(responseData.ocrText);
        const policyType = ocrTextObject.policyType.toLowerCase();
        const route = navigationMap[policyType];
        setLoading(false);
        if (route) navigate(route, { state: { responseData: ocrTextObject } });
      } else {
        toast.error("File processing failed!");
      }
      setLoading(false);
      setFiles(null);
      setImage(null);
      toggleDialog("confirm", false);
    } catch (error) {
      setLoading(false);

      if (error.response?.status === 401) {
        setShowSessionExpired(true);
      }
      toast.error("File extraction failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleSessionExpiredOk = () => {
    setShowSessionExpired(false);
    navigate("/login");
    sessionStorage.clear();
  };

  // Share functionality
  const handleShareIconClick = () => {
    setShareAllPolicy((prev) => !prev);
    if (!shareAllPolicy) setSelectedPolicies([]);
  };

  const handleSelectAll = () => {
    setSelectedPolicies((prev) => {
      const newSelections = allPolicyIds.filter((id) => !prev.includes(id));
      return [...prev, ...newSelections];
    });
  };

  const handleCheckboxChange = (policyId) =>
    setSelectedPolicies((prev) =>
      prev.includes(policyId)
        ? prev.filter((id) => id !== policyId)
        : [...prev, policyId]
    );

  const handleCardClick = (policyId) => {
    setSelectedPolicyId(policyId);
    sessionStorage.setItem("selectedPolicyId", policyId);
  };


  const handleExport = (exportFunc) => {
    if (selectedPolicies.length === 0) {
      toast.error("Please select at least one policy!");
      return;
    }
    exportFunc();
  };

  // Export functions
  const exportToExcel = async () => {
    if (selectedPolicies.length === 0) {
      return toast.error("Please select at least one policy to export");
    }

    try {
      const token = sessionStorage.getItem("token");
      const queryParams = selectedPolicies.map((id) => `_id=${id}`).join("&");

      const response = await axios.get(
        `${API_URL}policy/excelTable?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fileUrl = response?.data?.fileUrl;
      if (!fileUrl) throw new Error("File URL missing from backend");

      // Direct download from S3
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute(
        "download",
        `policies_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Excel file downloaded  successfully!");

      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Excel export failed:", error);
      toast.error("Failed to export Excel. Please try again.");
    }
  };

const exportToPDF = async () => {
  if (selectedPolicies.length === 0) {
    return toast.error("Please select at least one policy to export");
  }

  try {
    const token = sessionStorage.getItem("token");
    const queryParams = selectedPolicies.map((id) => `_id=${id}`).join("&");

    // Step 1: Get fresh signed URL from backend
    const response = await axios.get(`${API_URL}policy/pdfTable?${queryParams}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const fileUrl = response?.data?.fileUrl;
    if (!fileUrl) throw new Error("PDF file URL is missing in response.");

    // Extract filename from URL
    const filename = fileUrl.split("/").pop() || "policies.pdf";

    // Step 2: Trigger download automatically (avoids CORS issues)
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = filename; // suggested filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("PDF downloaded successfully!");
  } catch (error) {
    console.error("Error exporting PDF:", error);

    // Handle access denied / expired URL gracefully
    if (error.response?.status === 403) {
      toast.error("Access denied or expired link. Please try again.");
    } else {
      toast.error("Unable to export PDF. Try again later.");
    }
  }
};



  const exportToImage = async () => {
    if (selectedPolicies.length === 0) {
      return toast.error("Please select at least one policy to export");
    }

    try {
      const token = sessionStorage.getItem("token");
      const queryParams = selectedPolicies.map((id) => `_id=${id}`).join("&");

      // Step 1: Get the file URL from backend
      const response = await axios.get(
        `${API_URL}policy/imageTable?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fileUrl = response?.data?.fileUrl;
      if (!fileUrl) throw new Error("Image file URL is missing in response.");

      const filename = fileUrl.split("/").pop() || "policies.Image";

      // Step 2: Trigger download via anchor tag — no CORS issues here
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Image downloded successfully!");
    } catch (error) {
      console.error("Error exporting Image:", error);
      toast.error("Unable to export Image. Try again later.");
    }
  };
  // File upload card component
  const FileUploadCard = ({
    type,
    files,
    icon,
    text,
    inputRef,
    onChange,
    onClick,
  }) => (
    <Card
      className="border mx-1 mb-1"
      style={{
        backgroundColor: "#2a2a2a !important",
        color: "#fff !important",
        boxShadow: "rgba(27, 186, 54, 0.1) 0px 0px 16px",
        borderRadius: 10,
      }}
    >
      {!files ? (
        <>
          <input
            type="file"
            multiple
            onChange={onChange}
            hidden
            ref={inputRef}
            accept={type === "pdf" ? ".pdf,.doc,.docx" : "image/*"}
          />
          <Card
            className="p-3 cursor-pointer d-flex justify-content-center align-items-center"
            onClick={onClick}
            style={{
              backgroundColor: "#333",
              fontSize: "18px",
              color: "#fff",
              boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
              minHeight: "60px",
              cursor: "pointer",
            }}
          >
            <img src={icon} alt="" height={28} className="mr-3" />
            <span>{text}</span>
          </Card>
        </>
      ) : (
        Array.from(files).map((file, idx) => (
          <Card
            key={idx}
            className="d-flex justify-content-between align-items-center p-3"
            style={{ backgroundColor: "#333", color: "#fff", fontSize: "18px" }}
          >
            <span>{file.name}</span>
            <IconButton
              onClick={() => {
                toggleDialog("error", "");
                resetFiles(type);
              }}
              sx={{ color: "#fff" }}
            >
              <CloseIcon />
            </IconButton>
          </Card>
        ))
      )}
    </Card>
  );

  return (
    <div
      className="overflow-hidden"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <ToastContainer />

      <SessionExpiredModal
        visible={showSessionExpired}
        onConfirm={handleSessionExpiredOk}
      />

      <style jsx>{`
        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        *::-webkit-scrollbar {
          display: none;
        }
        .overflow-hidden {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .overflow-hidden::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <Navbar />

      <div
        className="bg-color !important"
        style={{ backgroundColor: THEME_COLOR.BACKGROUND }}
      >
        <Stack spacing={2} className="px-5 py-3">
          <div className="d-flex justify-content-between align-items-start flex-wrap ">
            <div className="d-flex flex-column">
              <Breadcrumbs
                aria-label="breadcrumb"
                style={{ marginBottom: "5px" }}
              >
                <Link
                  className="text-decoration-none"
                  style={{
                    fontSize: "21px",
                    fontWeight: "bold",
                    color: "#A5A5A5",
                    marginLeft: 55,
                  }}
                  href="/vault"
                >
                  Policy Vault
                </Link>
                <Typography
                  style={{
                    fontSize: "21px",
                    fontWeight: "bolder",
                    color: THEME_COLOR.COLOR,
                  }}
                >
                  My Policy
                </Typography>
              </Breadcrumbs>
              {loading === true && <Loader loading={loading} />}
              <div
                className="d-flex align-items-center flex-row gap-2 flex-wrap"
                style={{ marginLeft: 55 }}
              >
                {policyListLength > 0 && (
                  <div
                    onClick={handleShareIconClick}
                    style={{
                      height: "40px",
                      width: "40px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      border: "1px solid #e0e0e0",
                      backgroundColor: "#fff",
                      transition: "all 0.2s ease",
                      marginTop: "0px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    }}
                  >
                    <img
                      src={shareAllPolicy ? cross : share}
                      alt={shareAllPolicy ? "Close" : "Share"}
                      style={{
                        height: "40px",
                        width: "40px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                )}

                <GradientButton
                  text="Add Policy"
                  size="sm"
                  startIcon={AddIcon}
                  onClick={() => {
                    setFiles(null);
                    setImage(null);
                    toggleDialog("error", "");
                    toggleDialog("addPolicy", true);
                  }}
                />

{lastSync && (
  <div style={outlineChipStyle}>
    <SyncIcon style={{ fontSize: "16px" }} />
    <span>Last synced: {formatLastSyncIST(lastSync)}</span>
  </div>
)}




                {shareAllPolicy && (
                  <>
                    <StyledButton onClick={handleSelectAll}>
                      Select All ({selectedPolicies.length}/{allPolicyIds.length})
                    </StyledButton>

                    <StyledButton onClick={() => handleExport(exportToExcel)}>
                      Excel
                    </StyledButton>

                    <StyledButton onClick={() => handleExport(exportToPDF)}>
                      PDF
                    </StyledButton>

                    <StyledButton onClick={() => handleExport(exportToImage)}>
                      Image
                    </StyledButton>
                  </>
                )}
              </div>
            </div>
          </div>
        </Stack>

        <Grid
          container
          spacing={1}
          sx={{
            px: "40px !important",
            width: "100% !important",
            margin: "0 auto !important ",
          }}
        >
          <Grid
            item
            md={6.5}
            sx={{
              width: "100% !important",
              maxWidth: "100% !important",
              zIndex: 2,
              position: "relative !important",
            }}
          >
            <PolicyTabs
              handleCardClick={handleCardClick}
              shareAllPolicy={shareAllPolicy}
              selectedPolicies={selectedPolicies}
              handleCheckboxChange={handleCheckboxChange}
              onPolicyListLengthChange={setPolicyListLength}
              onArchieveListLength={() => { }}
              onAllPolicyIdsChange={setAllPolicyIds}
              searchQuery={searchQuery}
              selectedType={selectedType}
            />
          </Grid>

          <Grid
            item
            md={5.5}
            sx={{
              width: "100% !important",
              maxWidth: "100% !important",
              zIndex: 2,
              position: "relative !important",
            }}
          >
            {/* <PolicyDetail policyId={selectedPolicyId} /> */}
            {selectedPolicyId ? (
              <PolicyDetail policyId={selectedPolicyId} />
            ) : (
              <Card
                sx={{
                  borderRadius: 5,
                  boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
                  backgroundColor: "#121212 !important",
                  border: "0.5px solid white",
                  pt: 2.5,
                  height: "600px",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                    flexDirection: "column",
                    alignSelf: "center",
                    height: "auto",
                    color: THEME_COLOR.COLOR,
                  }}
                >
                  <img
                    src={emptyImage}
                    height="auto"
                    alt="No Data"
                    style={{
                      width: "40%",
                      height: "100%",
                      maxWidth: "200px",
                      height: "100%",
                      resize: "none",
                    }}
                  />
                  <Typography sx={{ fontSize: "1.6rem", mb: 2, mt: 3 }}>
                    {"No Record Found"}
                  </Typography>
                </Box>
              </Card>
            )}
          </Grid>
        </Grid>
      </div>

      <About />

      <Footer />

      {/* Add Policy Dialog */}
      <StyledDialog
        open={dialogs.addPolicy}
        onClose={() => toggleDialog("addPolicy", false)}
        maxWidth="sm"
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "4%",
            backgroundColor: "#212121",
            color: "#fff",
          },
        }}
      >
        <DialogTitle
          className="text-center fw-bold pt-4 fs-2"
          style={{ backgroundColor: "#212121", color: "#fff" }}
        >
          Add Policies
        </DialogTitle>
        <Typography
          className="text-center px-4 pb-2"
          style={{
            backgroundColor: "#212121",
            color: "#fff",
            fontSize: "18px",
          }}
        >
          Effortlessly upload documents, fill forms with ease.
        </Typography>
        <IconButton
          onClick={() => toggleDialog("addPolicy", false)}
          sx={{ position: "absolute", right: 8, top: 8, color: "#fff" }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent className="p-4">
          <FileUploadCard
            className=""
            type="pdf"
            files={files}
            icon={uploadPdf}
            text="Upload Document"
            inputRef={inputRef}
            onClick={() => {
              if (image === null || image === "") {
                inputRef.current.click();
              } else {
                toggleDialog(
                  "error",
                  "Only one file can be selected.. Clear image data to proceed with PDF."
                );
              }
            }}
            onChange={(e) => {
              // if(image===null|| image===""){
              handleFileUpload(e, "pdf");
              // }else{
              //  toggleDialog('error', 'Only one file can be selected.. Clear image data to proceed with PDF.')
              // }
            }}
          />
          <div style={{ height: 10 }} />
          <FileUploadCard
            type="image"
            files={image}
            icon={uploadImg}
            text="Upload Image"
            inputRef={imageRef}
            onClick={() => {
              if (files === null || files === "") {
                imageRef.current.click();
              } else {
                toggleDialog(
                  "error",
                  "Only one file can be selected.. Clear pdf data to proceed with Image."
                );
              }
            }}
            onChange={(e) => {
              handleFileUpload(e, "image");
            }}
          />
          {dialogs.error !== "" ? (
            <div
              style={{
                alignSelf: "center",
                justifyContent: "center",
                color: "red",
              }}
            >
              {dialogs.error}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              justifyContent: "center", // center horizontally
              gap: "16px", // space between buttons
            }}
          >
            <Button
              text="Cancel"
              size="md"
              onClick={() => toggleDialog("addPolicy", false)}
              style={{
                border: "2px solid #8AC642",
                color: "#8AC642",
                backgroundColor: "transparent",
                borderRadius: "8px",
                fontWeight: 600,
              }}
            />
            <Button
              text="Upload"
              size="md"
              onClick={handleConfirm}
              disabled={!files && !image}
              style={{
                backgroundColor: !files && !image ? "#ccc" : "#8AC642",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: !files && !image ? "default" : "pointer",
                opacity: !files && !image ? 0.6 : 1,
              }}
            />

          </div>

          <Card
            className="mt-4 p-3"
            style={{
              background: "#121212",
              borderRadius: "20px",
              marginTop: "20px",
              color: "#fff",
            }}
          >
            <div className="d-flex flex-column flex-md-row align-items-center">
              <div
                className="mb-3 mb-md-0 me-md-4 text-start"
                style={{ flex: 1 }}
              >
                <h5 style={{ fontWeight: 700, marginBottom: "6px" }}>
                  Sync from Gmail
                </h5>
                <p style={{ fontSize: "14px", color: "#cccccc" }}>
                  Save time by auto-fetching your insurance policies.
                </p>
                <button
                  onClick={() => navigate("/gmail-sync")}
                  style={{
                    backgroundColor: "#fff",
                    color: "#000",
                    border: "none",
                    borderRadius: "30px",
                    padding: "6px 16px",
                    fontWeight: 600,
                    fontSize: "14px",
                    marginTop: "8px",
                    cursor: "pointer",
                  }}
                >
                  Fetch policy
                </button>
              </div>
              <div style={{ flexShrink: 0 }}>
                <img
                  src={Gmail}
                  alt="gmail-sync"
                  style={{ maxWidth: "140px", height: "auto" }}
                />
              </div>
            </div>
            <div
              className="text-center mt-3"
              style={{
                backgroundColor: "#21a362",
                padding: "6px",
                borderRadius: "0 0 20px 20px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#fff",
              }}
            >
              ✅ Approved by Google
            </div>
          </Card>
        </DialogContent>
      </StyledDialog>

      {/* Confirmation Dialog */}
      <StyledDialog
        open={dialogs.confirm}
        onClose={() => toggleDialog("confirm", false)}
        maxWidth
        PaperProps={{
          style: {
            backgroundColor: "#212121",
            borderRadius: "16px",
            border: "1px solid #9E9E9E", // ensure visible border
            padding: "10px",
            boxShadow: "0px 8px 30px rgba(0, 0, 0, 1)", // stronger shadow
          },
        }}
      >
        <DialogContent style={{ position: "relative", height: "85px" }}>
          <Typography
            variant="h6"
            align="center"
            style={{
              fontWeight: 600,
              fontSize: "20px",
              color: "#fff",
              // paddingTop: "10px",
            }}
          >
            Alert
          </Typography>
          <Typography
            variant="h6"
            align="center"
            style={{
              fontWeight: 500,
              fontSize: "16px",
              color: "#fff",
              // paddingTop: "20px",
            }}
          >
            Are you sure you want to proceed?
          </Typography>
        </DialogContent>

        <DialogActions
          style={{
            justifyContent: "center",
            gap: "16px",
            // padding: "16px 32px",
          }}
        ></DialogActions>
      </StyledDialog>
    </div>
  );
};

export default Vault;
