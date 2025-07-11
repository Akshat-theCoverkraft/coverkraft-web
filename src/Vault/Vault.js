import React, { useState, useRef } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography,
  Card, Grid, Breadcrumbs, Link, Stack, CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "react-bootstrap";
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

// Images and constants
import share from "../Images/ic-share1.png";
import cross from "../Images/xmark.png";
import AddIcon from "../Images/addIcon.png";
import uploadPdf from "../Images/uploadPdf.png";
import uploadImg from "../Images/uploadImg.png";
import API_URL from "../ServiceModule/Service";
import IMAGE_PATH from "../ServiceModule/imagePath";
import { THEME_COLOR } from "../constants";

import "./vault.css";
import "react-toastify/dist/ReactToastify.css";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    backgroundColor: "#212121",
    color: "#fff"
  },
  "& .MuiDialogActions-root": { padding: theme.spacing(1) },
}));

const StyledButton = styled("button")(({ isAllSelected }) => ({
  backgroundColor: "transparent",
  color: isAllSelected ? "#000" : "#8AC642",
  border: "1.5px solid #8AC642",
  borderRadius: "20px",
  padding: "8px 16px",
  marginTop: "19px",
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
  // Consolidated state
  const [dialogs, setDialogs] = useState({ addPolicy: false, confirm: false });
  const [files, setFiles] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [selectedPolicyId, setSelectedPolicyId] = useState("");
  const [shareAllPolicy, setShareAllPolicy] = useState(false);
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  const [policyListLength, setPolicyListLength] = useState(0);
  const [allPolicyIds, setAllPolicyIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const inputRef = useRef();
  const imageRef = useRef();
  const navigate = useNavigate();

  // Navigation mapping
  const navigationMap = {
    car_policy: "/motor-policy", bike_policy: "/motor-policy", other_vehicle: "/motor-policy",
    health: "/health-policy", other_health: "/health-policy",
    life: "/life-policy", accident: "/life-policy"
  };

  // Utility functions
  const toggleDialog = (dialogType, state = null) =>
    setDialogs(prev => ({ ...prev, [dialogType]: state !== null ? state : !prev[dialogType] }));

  const resetFiles = (type) => type === 'pdf' ? setFiles(null) : setImage(null);

  const handleFileUpload = (e, type) => {
    const uploadedFiles = e.target.files;
    type === 'pdf' ? setFiles(uploadedFiles) : setImage(uploadedFiles);
    toggleDialog('confirm', true);
  };

  // OCR data extraction
  const handleConfirm = async () => {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    const filesToUpload = files || image;

    if (!filesToUpload) return;

    for (let i = 0; i < filesToUpload.length; i++) {
      formData.append("ocrText", filesToUpload[i]);
      formData.append("policyFile", filesToUpload[i]);
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}document/ocrExtractData`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        const responseData = response.data;
        setResponseData(responseData);
        sessionStorage.setItem("documentId", responseData.documentId);
        const ocrTextObject = JSON.parse(responseData.ocrText);
        const policyType = ocrTextObject.policyType.toLowerCase();
        const route = navigationMap[policyType];

        if (route) navigate(route, { state: { responseData: ocrTextObject } });
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
    if (!shareAllPolicy) setSelectedPolicies([]);
  };

  const handleSelectAll = () =>
    setSelectedPolicies(selectedPolicies.length === allPolicyIds.length ? [] : [...allPolicyIds]);

  const handleCheckboxChange = (policyId) =>
    setSelectedPolicies(prev => prev.includes(policyId) ? prev.filter(id => id !== policyId) : [...prev, policyId]);

  const handleCardClick = (policyId) => {
    setSelectedPolicyId(policyId);
    sessionStorage.setItem("selectedPolicyId", policyId);
  };

  // Export functions
const exportToExcel = async () => {
  if (selectedPolicies.length === 0) {
    return toast.error("Please select at least one policy to export");
  }

  try {
    const token = sessionStorage.getItem("token");
    const queryParams = selectedPolicies.map(id => `_id=${id}`).join("&");

    const response = await axios.get(`${API_URL}policy/excelTable?${queryParams}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const fileUrl = response?.data?.fileUrl;
    if (!fileUrl) throw new Error("File URL missing from backend");

    // Direct download from S3
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", `policies_${new Date().toISOString().split("T")[0]}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Excel file downloaded from S3 successfully!");
  } catch (error) {
    console.error("Excel export failed:", error);
    toast.error("Failed to export Excel. Please try again.");
  }
};



  const exportToPDF = async () => {
    if (selectedPolicies.length === 0) return toast.error("Please select at least one policy to export");

    try {
      const token = sessionStorage.getItem("token");
      const queryParams = selectedPolicies.map(id => `_id=${id}`).join("&");
      const response = await axios.get(`${API_URL}policy/pdfTable?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const fileUrl = response?.data?.fileUrl;
      if (!fileUrl) throw new Error("PDF file URL is missing in response.");

      const filename = fileUrl.split("/").pop() || "policies.pdf";
      const pdfResponse = await fetch(fileUrl);
      if (!pdfResponse.ok) throw new Error("Failed to fetch PDF file");

      const blob = await pdfResponse.blob();
      const file = new File([blob], filename, { type: "application/pdf", lastModified: new Date() });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: "Policy Documents", text: "Here are your policy documents.", files: [file] });
      } else {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      toast.success("PDF processed successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Unable to export PDF. Try again later.");
    }
  };

  // File upload card component
  const FileUploadCard = ({ type, files, icon, text, inputRef, onChange }) => (
    <Card className="border mx-1 mb-1" style={{ backgroundColor: "#2a2a2a", color: "#fff", boxShadow: "rgba(27, 186, 54, 0.1) 0px 0px 16px" }}>
      {!files ? (
        <>
          <input type="file" multiple onChange={onChange} hidden ref={inputRef} accept={type === 'pdf' ? '.pdf,.doc,.docx' : 'image/*'} />
          <Card
            className="p-3 cursor-pointer d-flex justify-content-center align-items-center"
            onClick={() => inputRef.current.click()}
            style={{ backgroundColor: "#333", fontSize: "18px", color: "#fff", boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px", minHeight: "60px", cursor: "pointer" }}
          >
            <img src={icon} alt="" height={28} className="mr-3" />
            <span>{text}</span>
          </Card>
        </>
      ) : (
        Array.from(files).map((file, idx) => (
          <Card key={idx} className="d-flex justify-content-between align-items-center p-3" style={{ backgroundColor: "#333", color: "#fff", fontSize: "18px" }}>
            <span>{file.name}</span>
            <IconButton onClick={() => resetFiles(type)} sx={{ color: "#fff" }}>
              <CloseIcon />
            </IconButton>
          </Card>
        ))
      )}
    </Card>
  );

  return (
    <div className="overflow-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
      <style jsx>{`
        * { scrollbar-width: none; -ms-overflow-style: none; }
        *::-webkit-scrollbar { display: none; }
        .overflow-hidden { scrollbar-width: none; -ms-overflow-style: none; }
        .overflow-hidden::-webkit-scrollbar { display: none; }
      `}</style>
      <div className="d-flex align-items-center gap-2 flex-wrap" style={{ marginTop: "12px", marginLeft: 55 }}>
        <input
          type="text"
          placeholder="Search by policy name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "8px 16px", borderRadius: "8px", border: "1px solid #ccc",
            fontSize: "16px", width: "200px", background: "#fff", color: "#000"
          }}
        />

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={{
            padding: "8px 16px", borderRadius: "8px", border: "1px solid #ccc",
            fontSize: "16px", width: "160px", background: "#fff", color: "#000"
          }}
        >
          <option value="">All Types</option>
          <option value="life">Life</option>
          <option value="health">Health</option>
          <option value="car">Car</option>
          <option value="bike">Bike</option>
          <option value="accident">Accident</option>
        </select>
      </div>

      <Navbar />
      <div className="bg-color" style={{ backgroundColor: THEME_COLOR.BACKGROUND }}>
        <Stack spacing={2} className="p-5">
          <div className="d-flex justify-content-between align-items-start flex-wrap">
            <div className="d-flex flex-column">
              <Breadcrumbs aria-label="breadcrumb" style={{ marginBottom: '16px' }}>
                <Link className="text-decoration-none" style={{ fontSize: '21px', fontWeight: 'bold', color: "#A5A5A5", marginLeft: 55 }} href="/vault">
                  Policy Vault
                </Link>
                <Typography style={{ fontSize: "21px", fontWeight: "bolder", color: THEME_COLOR.COLOR }}>
                  My Policy
                </Typography>
              </Breadcrumbs>

              <div className="d-flex align-items-center gap-2 flex-wrap" style={{ marginLeft: 55 }}>
                {policyListLength > 0 && (
                  <div
                    onClick={handleShareIconClick}
                    style={{
                      height: '40px', width: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '50%', border: '1px solid #e0e0e0', backgroundColor: '#fff', transition: 'all 0.2s ease',
                      marginTop: '18px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                  >
                    <img src={shareAllPolicy ? cross : share} alt={shareAllPolicy ? "Close" : "Share"} style={{ height: '40px', width: '40px', objectFit: 'contain' }} />
                  </div>
                )}

                <GradientButton
                  text="Add Policy"
                  size="sm"
                  startIcon={AddIcon}
                  onClick={() => toggleDialog('addPolicy', true)}
                  style={{ padding: '8px 16px', minHeight: '28px', borderRadius: '8px', fontSize: '18px', marginTop: policyListLength > 0 ? '10px' : '0px' }}
                />

                {shareAllPolicy && (
                  <>
                    <StyledButton onClick={handleSelectAll} isAllSelected={selectedPolicies.length === allPolicyIds.length}>
                      Select All ({selectedPolicies.length}/{allPolicyIds.length})
                    </StyledButton>
                    <StyledButton onClick={exportToExcel} disabled={selectedPolicies.length === 0}>Excel</StyledButton>
                    <StyledButton onClick={exportToPDF} disabled={selectedPolicies.length === 0}>PDF</StyledButton>
                  </>
                )}
              </div>
            </div>
          </div>
        </Stack>

        <Grid container spacing={2} className="px-5">
          <Grid item xs={12} md={5.5}>
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
          <Grid item xs={12} md={6.5}>
            <PolicyDetail policyId={selectedPolicyId} />
          </Grid>
        </Grid>
      </div>

      <About />
      <Footer />

      {/* Add Policy Dialog */}
      <StyledDialog open={dialogs.addPolicy} onClose={() => toggleDialog('addPolicy', false)} fullWidth maxWidth="sm" sx={{ "& .MuiPaper-root": { borderRadius: "4%", backgroundColor: "#212121", color: "#fff" } }}>
        <DialogTitle className="text-center fw-bold pt-4 fs-2" style={{ backgroundColor: "#212121", color: "#fff" }}>
          Add Policies
        </DialogTitle>
        <Typography className="text-center px-4 pb-2" style={{ backgroundColor: "#212121", color: "#fff", fontSize: "18px" }}>
          Effortlessly upload documents, fill forms with ease.
        </Typography>
        <IconButton onClick={() => toggleDialog('addPolicy', false)} sx={{ position: "absolute", right: 8, top: 8 ,color: "#fff" }}>
          <CloseIcon />
        </IconButton>

        <DialogContent className="p-4">
          <FileUploadCard className='' type='pdf' files={files} icon={uploadPdf} text='Upload Document' inputRef={inputRef} onChange={(e) => handleFileUpload(e, 'pdf')} />
          <FileUploadCard type='image' files={image} icon={uploadImg} text='Upload Image' inputRef={imageRef} onChange={(e) => handleFileUpload(e, 'image')} />

          <Card className="mt-3 p-3" style={{ background: "#121212", borderRadius: "20px", marginTop: "20px", color: "#fff" }}>
            <div className="d-flex flex-column flex-md-row align-items-center">
              <div className="mb-3 mb-md-0 me-md-4 text-start" style={{ flex: 1 }}>
                <h5 style={{ fontWeight: 700, marginBottom: "6px" }}>Sync from Gmail</h5>
                <p style={{ fontSize: "14px", color: "#cccccc" }}>Save time by auto-fetching your insurance policies.</p>
                <button
                  onClick={() => navigate("/gmail-sync")}
                  style={{
                    backgroundColor: "#fff", color: "#000", border: "none", borderRadius: "30px",
                    padding: "6px 16px", fontWeight: 600, fontSize: "14px", marginTop: "8px", cursor: "pointer"
                  }}
                >
                  Fetch policy
                </button>
              </div>
              <div style={{ flexShrink: 0 }}>
                <img src={Gmail} alt="gmail-sync" style={{ maxWidth: "140px", height: "auto" }} />
              </div>
            </div>
            <div className="text-center mt-3" style={{
              backgroundColor: "#21a362", padding: "6px", borderRadius: "0 0 20px 20px",
              fontSize: "12px", fontWeight: 600, color: "#fff"
            }}>
              ✅ Approved by Google
            </div>
          </Card>
        </DialogContent>
      </StyledDialog>

      {/* Confirmation Dialog */}
      <StyledDialog
        open={dialogs.confirm}
        onClose={() => toggleDialog('confirm', false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ style: { borderRadius: '16px', padding: '24px', backgroundColor: '#212121', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' } }}
      >
        <DialogContent style={{ position: 'relative', minHeight: '120px' }}>
          {loading && (
            <div style={{
              position: 'absolute', top: 0, left: 0, height: '100%', width: '100%',
              backgroundColor: '#212121', display: 'flex', justifyContent: 'center',
              alignItems: 'center', borderRadius: '16px', zIndex: 10
            }}>
              <Spinner style={{ width: '3rem', height: '3rem', color: '#8AC642' }} animation="border" />
            </div>
          )}
          <Typography variant="h6" align="center" style={{ fontWeight: 600, fontSize: '20px', color: '#fff', paddingTop: '20px' }}>
            Are you sure you want to proceed?
          </Typography>
        </DialogContent>

        <DialogActions style={{ justifyContent: 'center', gap: '16px', padding: '16px 32px' }}>
          <Button
            text="Cancel"
            size="md"
            onClick={() => toggleDialog('confirm', false)}
            style={{ border: '2px solid #8AC642', color: '#8AC642', backgroundColor: 'transparent', borderRadius: '8px', fontWeight: 600, padding: '8px 24px' }}
          />
          <Button
            text="Confirm"
            size="md"
            onClick={handleConfirm}
            disabled={loading}
            style={{ backgroundColor: '#8AC642', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, padding: '8px 24px' }}
          />
        </DialogActions>
      </StyledDialog>
    </div>
  ); 
  
  
};

export default Vault;