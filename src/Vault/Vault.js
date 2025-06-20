import React, { useState, useRef } from "react";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Components
import Navbar from "../component/Navbar";
import Footer from "../Landing/component/Footer";
import PolicyTabs from "./component/PolicyTabs";
import PolicyDetail from "./component/PolicyDetail";
import Button from "../component/Button";
import GradientButton from "../component/GradientButton";
import About from "../Landing/component/About";

// Images and constants
import share from "../Images/ic-share1.png";
import AddIcon from "../Images/addIcon.png";
import uploadPdf from "../Images/uploadPdf.png";
import uploadImg from "../Images/uploadImg.png";
import API_URL from "../ServiceModule/Service";
import IMAGE_PATH from "../ServiceModule/imagePath";
import { THEME_COLOR } from "../constants";

// Styles
import "./vault.css";
import "react-toastify/dist/ReactToastify.css";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  borderRadius: "300px",
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Vault = () => {
  // State management
  const [dialogs, setDialogs] = useState({
    addPolicy: false,
    confirm: false,
  });
  const [files, setFiles] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [selectedPolicyId, setSelectedPolicyId] = useState("");
  const [shareAllPolicy, setShareAllPolicy] = useState(false);
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  const [policyListLength, setPolicyListLength] = useState(0);
  const [allPolicyIds, setAllPolicyIds] = useState([]);

  // Refs
  const inputRef = useRef();
  const imageRef = useRef();
  const navigate = useNavigate();

  // Dialog handlers
  const toggleDialog = (dialogType, state = null) => {
    setDialogs(prev => ({
      ...prev,
      [dialogType]: state !== null ? state : !prev[dialogType]
    }));
  };

  // File upload handlers
  const handleFileUpload = (e, type) => {
    const uploadedFiles = e.target.files;
    if (type === 'pdf') {
      setFiles(uploadedFiles);
    } else {
      setImage(uploadedFiles);
    }
    toggleDialog('confirm', true);
  };

  const resetFiles = (type) => {
    if (type === 'pdf') {
      setFiles(null);
    } else {
      setImage(null);
    }
  };

  // OCR data extraction
  const handleConfirm = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    
    const filesToUpload = files || image;
    if (!filesToUpload) return;

    for (let i = 0; i < filesToUpload.length; i++) {
      formData.append("ocrText", filesToUpload[i]);
    }

    setLoading(true);
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
        
        const documentId = responseData.documentId;
        localStorage.setItem("documentId", documentId);
        
        const ocrTextObject = JSON.parse(responseData.ocrText);
        const policyType = ocrTextObject.policyType.toLowerCase();
        
        // Navigation based on policy type
        const navigationMap = {
          car_policy: "/coverkraft/motor-policy",
          bike_policy: "/coverkraft/motor-policy", 
          other_vehicle: "/coverkraft/motor-policy",
          health: "/coverkraft/health-policy",
          other_health: "/coverkraft/health-policy",
          life: "/coverkraft/life-policy",
          accident: "/coverkraft/life-policy"
        };

        const route = navigationMap[policyType];
        if (route) {
          navigate(route, { state: { responseData: ocrTextObject } });
        }
      } else {
        toast.error("File processing failed!");
      }
      
      setFiles(null);
      setImage(null);
      toggleDialog('confirm', false);
    } catch (error) {
      toast.error("File extraction failed!");
    } finally {
      setLoading(false);
    }
  };

  // Share functionality
  const handleShareIconClick = () => {
    setShareAllPolicy(prev => !prev);
    if (!shareAllPolicy) {
      setSelectedPolicies([]);
    }
  };

  const handleSelectAll = () => {
    if (selectedPolicies.length === allPolicyIds.length) {
      setSelectedPolicies([]);
    } else {
      setSelectedPolicies([...allPolicyIds]);
    }
  };

  const handleCheckboxChange = (policyId) => {
    setSelectedPolicies(prev =>
      prev.includes(policyId)
        ? prev.filter(id => id !== policyId)
        : [...prev, policyId]
    );
  };

  const handleCardClick = (policyId) => {
    setSelectedPolicyId(policyId);
    localStorage.setItem("selectedPolicyId", policyId);
  };

  // Export functions
  const exportToExcel = async () => {
    if (selectedPolicies.length === 0) {
      toast.error("Please select at least one policy to export");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const queryParams = selectedPolicies.map(id => `_id=${id}`).join("&");

      console.log("Exporting to Excel with IDs:", selectedPolicies);
      console.log("Query params:", queryParams);

      const response = await axios.get(
        `${API_URL}policy/excelTable?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob' // Important for file download
        }
      );

      // Create blob and download
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `policies_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to export to Excel");
    }
  };

  const exportToPDF = async () => {
    if (selectedPolicies.length === 0) {
      toast.error("Please select at least one policy to export");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const queryParams = selectedPolicies.map(id => `_id=${id}`).join("&");

      const response = await axios.get(
        `${API_URL}policy/pdfTable?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const filePath = response.data.filePath;
      const url = IMAGE_PATH + filePath;

      // Fetch and share/download PDF
      const pdfResponse = await fetch(url);
      const blob = await pdfResponse.blob();
      const filename = filePath.split("/").pop() || "policies.pdf";
      const file = new File([blob], filename, {
        type: "application/pdf",
        lastModified: new Date(),
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Policy Documents",
          text: "Here are your policy documents.",
          files: [file],
        });
      } else {
        // Fallback download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast.success("PDF processed successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    }
  };

  // Render file upload card
  const renderFileUploadCard = (type, files, icon, text, inputRef, onChange) => (
    <Card className="border mx-3 mb-3" style={{ boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px" }}>
      {!files ? (
        <>
          <input
            type="file"
            multiple
            onChange={onChange}
            hidden
            ref={inputRef}
            accept={type === 'pdf' ? '.pdf,.doc,.docx' : 'image/*'}
          />
          <Card
            className="p-3 cursor-pointer d-flex justify-content-center align-items-center"
            onClick={() => inputRef.current.click()}
            style={{
              backgroundColor: "white",
              fontSize: "18px",
              boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
              minHeight: "60px"
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
            style={{ backgroundColor: "white", fontSize: "18px" }}
          >
            <span>{file.name}</span>
            <IconButton onClick={() => resetFiles(type)}>
              <CloseIcon />
            </IconButton>
          </Card>
        ))
      )}
    </Card>
  );

  return (
    <div className="overflow-hidden">
      <Navbar />
      
      <div className="bg-color" style={{ backgroundColor: THEME_COLOR.BACKGROUND }}>
        {/* Header Section */}
        <Stack spacing={2} className="p-5">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="d-flex align-items-center">
              <Breadcrumbs aria-label="breadcrumb">
                <Link
                  className="text-decoration-none"
                  style={{
                    fontSize: '21px',
                    fontWeight: 'bold',
                    color: "#A5A5A5",
                    marginLeft: 55,
                  }}
                  href="#"
                >
                  Vault
                </Link>
                <Typography
                  style={{ 
                    fontSize: "21px", 
                    fontWeight: "bolder", 
                    color: THEME_COLOR.COLOR 
                  }}
                >
                  My Policies
                </Typography>
              </Breadcrumbs>
              
              {policyListLength > 0 && (
                <img
                  src={share}
                  alt="Share"
                  className="ml-4"
                  onClick={handleShareIconClick}
                  style={{
                    height: '40px',
                    width: '40px',
                    cursor: 'pointer',
                    objectFit: 'contain',
                  }}
                />
              )}
            </div>

            <div className="d-flex align-items-center gap-3 flex-wrap">
              <GradientButton
                text="Add Policy"
                size="ml"
                startIcon={AddIcon}
                onClick={() => toggleDialog('addPolicy', true)}
                style={{
                  padding: '12px 24px',
                  minHeight: '48px',
                  borderRadius: '12px',
                }}
              />

              {shareAllPolicy && (
                <>
                  <Button
                    text={`Select All (${selectedPolicies.length}/${allPolicyIds.length})`}
                    size="md"
                    onClick={handleSelectAll}
                    style={{
                      backgroundColor: selectedPolicies.length === allPolicyIds.length ? '#28a745' : '#6c757d',
                      color: 'white',
                      border: 'none'
                    }}
                  />
                  <Button
                    text="Export to Excel"
                    size="md"
                    onClick={exportToExcel}
                    disabled={selectedPolicies.length === 0}
                  />
                  <Button
                    text="Export to PDF"
                    size="md"
                    onClick={exportToPDF}
                    disabled={selectedPolicies.length === 0}
                  />
                </>
              )}
            </div>
          </div>
        </Stack>

        {/* Main Content */}
        <Grid container spacing={2} className="px-4">
          <Grid item xs={12} md={7}>
            <PolicyTabs
              handleCardClick={handleCardClick}
              shareAllPolicy={shareAllPolicy}
              selectedPolicies={selectedPolicies}
              handleCheckboxChange={handleCheckboxChange}
              onPolicyListLengthChange={setPolicyListLength}
              onArchieveListLength={(length) => {}}
              onAllPolicyIdsChange={setAllPolicyIds}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <PolicyDetail policyId={selectedPolicyId} />
          </Grid>
        </Grid>
      </div>

      <About />
      <Footer />

      {/* Add Policy Dialog */}
      <StyledDialog
        open={dialogs.addPolicy}
        onClose={() => toggleDialog('addPolicy', false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="text-center fw-bold pt-4 fs-2">
          Add Policies
        </DialogTitle>
        <Typography className="text-center px-4 pb-2" style={{ color: "#616060", fontSize: "18px" }}>
          Effortlessly upload documents, fill forms with ease.
        </Typography>
        <IconButton
          onClick={() => toggleDialog('addPolicy', false)}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        
        <DialogContent className="p-4">
          {renderFileUploadCard(
            'pdf', 
            files, 
            uploadPdf, 
            'Upload Document', 
            inputRef, 
            (e) => handleFileUpload(e, 'pdf')
          )}
          {renderFileUploadCard(
            'image', 
            image, 
            uploadImg, 
            'Upload Image', 
            imageRef, 
            (e) => handleFileUpload(e, 'image')
          )}
        </DialogContent>
      </StyledDialog>

      {/* Confirmation Dialog */}
      <StyledDialog
        open={dialogs.confirm}
        onClose={() => toggleDialog('confirm', false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: {
            borderRadius: '16px',
            padding: '24px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <DialogContent style={{ position: 'relative', minHeight: '120px' }}>
          {loading && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                backgroundColor: 'rgba(255,255,255,0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '16px',
                zIndex: 10,
              }}
            >
              <Spinner
                style={{ width: '3rem', height: '3rem', color: '#8AC642' }}
                animation="border"
              />
            </div>
          )}
          <Typography
            variant="h6"
            align="center"
            style={{
              fontWeight: 600,
              fontSize: '20px',
              color: '#333',
              paddingTop: '20px',
            }}
          >
            Are you sure you want to proceed?
          </Typography>
        </DialogContent>

        <DialogActions style={{ justifyContent: 'center', gap: '16px', padding: '16px 32px' }}>
          <Button
            text="Cancel"
            size="md"
            onClick={() => toggleDialog('confirm', false)}
            style={{
              border: '2px solid #8AC642',
              color: '#8AC642',
              backgroundColor: 'transparent',
              borderRadius: '8px',
              fontWeight: 600,
              padding: '8px 24px',
            }}
          />
          <Button
            text="Confirm"
            size="md"
            onClick={handleConfirm}
            disabled={loading}
            style={{
              backgroundColor: '#8AC642',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              padding: '8px 24px',
            }}
          />
        </DialogActions>
      </StyledDialog>
    </div>
  );
};

export default Vault;