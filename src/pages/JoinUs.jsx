import React, { useState, useEffect } from "react";
import Navbar from "../component/Navbar";
import Footer from "../Landing/component/Footer";
import FormField from "../component/Components/FormField";
import LoaderOverlay from "../component/Components/LoaderOverlay";
import StateAutocomplete from "../component/Components/StateAutocomplete";
import Button from "../component/Button";
import Popup from "../component/Components/Popup";
import API_URL from "../ServiceModule/Service";
import { submitAgent } from "../store/action/action";
import { useDispatch } from "react-redux";
import {
  validateFullName,
  validateEmail,
  validatePhoneNumber,
  validatePinCode,
  validateDOB,
  validateAddress,
  validateState,
  validateGender,
  validateApplyingFor,
  validateFile,
} from "../utils/formValidation";
import { useNavigate } from "react-router-dom";

const JoinUs = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dob: "",
    address: "",
    stateAgent: "",
    pinCode: "",
    contactNumber: "",
    email: "",
    applyingFor: "",
  });

  const [resumeFile, setResumeFile] = useState(null);
  
  // POS Documents state - Added passportPhoto and cancelledCheque
  const [posDocuments, setPosDocuments] = useState({
    passportPhoto: null,
    panCard: null,
    aadharFront: null,
    aadharBack: null,
    educationCertificate: null,
    cancelledCheque: null,
  });

  // Drag active state - Added passportPhoto and cancelledCheque
  const [dragActive, setDragActive] = useState({
    resume: false,
    passportPhoto: false,
    panCard: false,
    aadharFront: false,
    aadharBack: false,
    educationCertificate: false,
    cancelledCheque: false,
  });

  const [statesData, setStatesData] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

    useEffect(() => {
    fetchStates();
  }, []);


    const fetchStates = async () => {
    setLoadingStates(true);
    try {
      const response = await fetch("https://api.thecoverkraft.com/state/getAll");
      const result = await response.json();
      
      if (result.status && result.data) {
        // Transform the data to match FormField options format
        const stateOptions = result.data.map(state => ({
          value: state.stateNameEnglish,
          label: state.stateNameEnglish
        }));
        setStatesData(stateOptions);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      alert("Failed to load states data");
    } finally {
      setLoadingStates(false);
    }
  };

  // Updated validateForm to include passportPhoto and cancelledCheque
  const validateForm = (data, file, isPOS, posFiles) => {
    const errors = {};
    if (validateFullName(data.fullName).error)
      errors.fullName = validateFullName(data.fullName).error;
    if (validateEmail(data.email).error)
      errors.email = validateEmail(data.email).error;
    if (validatePhoneNumber(data.contactNumber).error)
      errors.contactNumber = validatePhoneNumber(data.contactNumber).error;
    if (validatePinCode(data.pinCode).error)
      errors.pinCode = validatePinCode(data.pinCode).error;
    if (validateDOB(data.dob).error) errors.dob = validateDOB(data.dob).error;
    if (validateAddress(data.address).error)
      errors.address = validateAddress(data.address).error;
    if (validateState(data.stateAgent).error)
      errors.stateAgent = validateState(data.stateAgent).error;
    if (validateGender(data.gender).error)
      errors.gender = validateGender(data.gender).error;
    if (validateApplyingFor(data.applyingFor).error)
      errors.applyingFor = validateApplyingFor(data.applyingFor).error;

    // For Employee, validate resume; for POS, validate passportPhoto
    if (isPOS) {
      if (!validateFile(posFiles.passportPhoto, true).valid)
        errors.passportPhoto = validateFile(posFiles.passportPhoto, true).error;
      if (!validateFile(posFiles.panCard, true).valid)
        errors.panCard = validateFile(posFiles.panCard, true).error;
      if (!validateFile(posFiles.aadharFront, true).valid)
        errors.aadharFront = validateFile(posFiles.aadharFront, true).error;
      if (!validateFile(posFiles.aadharBack, true).valid)
        errors.aadharBack = validateFile(posFiles.aadharBack, true).error;
      if (!validateFile(posFiles.educationCertificate, true).valid)
        errors.educationCertificate = validateFile(
          posFiles.educationCertificate,
          true
        ).error;
      if (!validateFile(posFiles.cancelledCheque, true).valid)
        errors.cancelledCheque = validateFile(posFiles.cancelledCheque, true).error;
    } else {
      if (!validateFile(file, false).valid)
        errors.resume = validateFile(file, false).error;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const handleChange = (field, value) => {
    // Special handling for phone number - only allow digits and limit to 10
    if (field === "contactNumber") {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 10) {
        setFormData((prev) => ({ ...prev, [field]: digitsOnly }));
      }
    }
    // Special handling for pin code - only allow digits and limit to 6
    else if (field === "pinCode") {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 6) {
        setFormData((prev) => ({ ...prev, [field]: digitsOnly }));
      }
    }
    else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileValidation = validateFile(file, false);

      if (!fileValidation.valid) {
        setFieldErrors((prev) => ({ ...prev, resume: fileValidation.error }));
        return;
      }

      setResumeFile(file);
      setFieldErrors((prev) => ({ ...prev, resume: "" }));
    }
  };

  // Handle POS document file selection
  const handlePosFileSelect = (docType, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileValidation = validateFile(file, true);

      if (!fileValidation.valid) {
        setFieldErrors((prev) => ({
          ...prev,
          [docType]: fileValidation.error,
        }));
        return;
      }

      setPosDocuments((prev) => ({ ...prev, [docType]: file }));
      setFieldErrors((prev) => ({ ...prev, [docType]: "" }));
    }
  };

  const handleDrag = (e, field = "resume") => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive((prev) => ({ ...prev, [field]: true }));
    } else if (e.type === "dragleave") {
      setDragActive((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleDrop = (e, field = "resume", isPosDoc = false) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [field]: false }));
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      if (isPosDoc) {
        handlePosFileSelect(field, { target: { files } });
      } else {
        handleFileSelect({ target: { files } });
      }
    }
  };

  const handleWelcomeButtonClick = (applyingForValue) => {
    setFormData((prev) => ({ ...prev, applyingFor: applyingForValue }));
    setShowWelcomeModal(false);
    setShowForm(true);
  };

  // Updated handleSubmit with passportPhoto and cancelledCheque
  const handleSubmit = async () => {
    const allFields = [
      "fullName",
      "gender",
      "dob",
      "address",
      "stateAgent",
      "pinCode",
      "contactNumber",
      "email",
      "applyingFor",
    ];

    setTouched(
      allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
    );

    const isPOS = formData.applyingFor === "POS";

    const validation = validateForm(formData, resumeFile, isPOS, posDocuments);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    const {
      fullName,
      gender,
      dob,
      address,
      stateAgent,
      pinCode,
      contactNumber,
      email,
      applyingFor,
    } = formData;

    const data = new FormData();
    data.append("fullName", fullName);
    data.append("gender", gender);
    data.append("dob", dob);
    data.append("address", address);
    data.append("state", stateAgent);
    data.append("pinCode", pinCode);
    data.append("contactNumber", contactNumber);
    data.append("email", email);
    data.append("applyingFor", applyingFor);

    // Append files based on role
    if (isPOS) {
      if (posDocuments.passportPhoto) 
        data.append("passportPhoto", posDocuments.passportPhoto);
      if (posDocuments.panCard) 
        data.append("panCard", posDocuments.panCard);
      if (posDocuments.aadharFront)
        data.append("aadharFront", posDocuments.aadharFront);
      if (posDocuments.aadharBack)
        data.append("aadharBack", posDocuments.aadharBack);
      if (posDocuments.educationCertificate)
        data.append("educationCertificate", posDocuments.educationCertificate);
      if (posDocuments.cancelledCheque)
        data.append("cancelledCheque", posDocuments.cancelledCheque);
    } else {
      if (resumeFile) data.append("resume", resumeFile);
    }

    setLoading(true);

    try {
      const res = await dispatch(submitAgent(API_URL, data));
      console.log("Response:", res);

      if (res?.status === true) {
        setShowSuccessModal(true);

        // Reset form fields
        setFormData({
          fullName: "",
          gender: "",
          dob: "",
          address: "",
          stateAgent: "",
          pinCode: "",
          contactNumber: "",
          email: "",
          applyingFor: "",
        });
        setResumeFile(null);
        setPosDocuments({
          passportPhoto: null,
          panCard: null,
          aadharFront: null,
          aadharBack: null,
          educationCertificate: null,
          cancelledCheque: null,
        });
        setFieldErrors({});
        setTouched({});
      } else {
        alert(`❌ ${res?.message || "Something went wrong."}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("❌ Failed to submit. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const welcomeButtons = [
    {
      label: "Continue",
      onClick: () => {
        if (selectedRole) {
          handleWelcomeButtonClick(selectedRole);
        }
      },
      style: {
        backgroundColor: selectedRole ? "#8AC642" : "#666",
        color: "#fff",
        opacity: selectedRole ? 1 : 0.5,
        cursor: selectedRole ? "pointer" : "not-allowed",
      },
    },
  ];

  const successButtons = [
    {
      label: "OK",
      onClick: () => {
        setShowSuccessModal(false);
        navigate("/");
      },
      style: {
        backgroundColor: "#8AC642",
        color: "#fff",
      },
    },
  ];

  // Reusable file upload component
  const FileUploadBox = ({
    id,
    label,
    tooltip,
    file,
    error,
    onFileSelect,
    dragActiveState,
    icon = "📄",
    accept = ".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff,.tif",
  }) => (
    <div style={{ marginBottom: 24 }}>
      <label
        style={{
          color: "#fff",
          fontSize: "1.05rem",
          marginBottom: 8,
          fontWeight: 500,
          display: "block",
        }}
      >
        {label} 
       {tooltip && (
  <div style={{ position: "relative", display: "inline-block", marginLeft: 6 }}>
    <span
      style={{
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        width: 22,
        height: 22,
        borderRadius: "50%",
        color: "#8AC642",
        fontSize: "1rem",
        fontWeight: "bold",
        cursor: "pointer",
      }}
    >
      ⓘ
    </span>

    {/* Tooltip box */}
    <div
      style={{
        position: "absolute",
        bottom: "125%", // place above the icon
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#212121",
        // color: "#8AC642",
        padding: "6px 10px",
        borderRadius: 6,
        fontSize: "0.85rem",
        whiteSpace: "nowrap",
        textAlign: "center",
        border: "1px solid #8AC642",
        zIndex: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
      }}
    >
      {tooltip}

      {/* Small arrow pointing down */}
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "6px solid #212121",
        }}
      />
    </div>
  </div>
)}

        <span style={{ color: "#f44336" }}>*</span>
      </label>

      <input
        type="file"
        id={id}
        onChange={onFileSelect}
        style={{ display: "none" }}
        accept={accept}
      />

      <label
        htmlFor={id}
        onDragEnter={(e) => handleDrag(e, id)}
        onDragLeave={(e) => handleDrag(e, id)}
        onDragOver={(e) => handleDrag(e, id)}
        onDrop={(e) => handleDrop(e, id, id !== "resumeUpload")}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          minHeight: "140px",
          backgroundColor: dragActiveState ? "#2c2c2c" : "#1a1a1a",
          border:
            dragActiveState || error
              ? dragActiveState
                ? "2px dashed #8AC642"
                : "2px dashed #f44336"
              : "2px dashed #444",
          borderRadius: "12px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          padding: "20px",
        }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>{icon}</div>
        {file ? (
          <>
            <span style={{ color: "#8AC642", fontWeight: 600 }}>
              {file.name}
            </span>
            <span style={{ color: "#999", fontSize: "0.85rem" }}>
              Click to change file
            </span>
          </>
        ) : (
          <>
            <span style={{ color: "#8AC642", fontWeight: 600 }}>
              Drag and drop your file here
            </span>
            <span style={{ color: "#999", fontSize: "0.85rem" }}>
              or click to browse
            </span>
          </>
        )}
      </label>

      {error && (
        <span
          style={{
            color: "#FF4444",
            fontSize: "1.3rem",
            display: "block",
            marginTop: 4,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );

  return (
    <>
      <Navbar />
      {loading && <LoaderOverlay />}

      <Popup
        visible={showWelcomeModal}
        title="👋 Welcome to CoverKraft"
        message="Thank you for choosing to partner with us. Please provide your details to begin. We will review and respond at the earliest."
        radioOptions={[
          { label: "Employee", value: "Employee" },
          { label: "POSP", value: "POS" },
        ]}
        selectedRadio={selectedRole}
        onRadioChange={setSelectedRole}
        buttons={welcomeButtons}
        onClose={() => setShowWelcomeModal(false)}
      />

      <Popup
        visible={showSuccessModal}
        title="Application Submitted 🎉"
        message="Thank you for applying! Our team will review your application and contact you soon."
        buttons={successButtons}
        onClose={() => setShowSuccessModal(false)}
        navigateTo={"/"}
      />

      <div
        style={{
          backgroundColor: "#000",
          minHeight: "100vh",
          padding: "40px 20px",
          filter: showWelcomeModal ? "blur(4px)" : "none",
          opacity: showWelcomeModal ? 0.6 : 1,
          pointerEvents: showWelcomeModal ? "none" : "auto",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "100%",
              maxWidth: 900,
              padding: "40px",
              boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
              borderRadius: 12,
              backgroundColor: "#212121",
              border: "1px solid #333",
            }}
          >
            <div style={{ marginBottom: 32 }}>
              <h1
                style={{
                  color: "#8AC642",
                  fontWeight: 700,
                  fontSize: "2.5rem",
                 
                  marginBottom: 8,
                  letterSpacing: 1,
                  margin: 0,
                }}
              >
               {formData.applyingFor === "POS" 
      ? "Become a POSP Insurance Agent"
      : formData.applyingFor === "Employee"
      ? "Employee Application Details"
      : "Application Form"}
              </h1>
              <div
                style={{
                  height: 4,
                  width: 60,
                  // backgroundColor: "#8AC642",
                  borderRadius: 2,
                }}
              />
            </div>

            <div
              style={{
                marginBottom: 32,
                marginTop: 32,
                padding: "16px",
                backgroundColor: "#1a1a1a",
                borderRadius: "8px",
                border: "1px solid #333",
              }}
            >
              <p style={{ color: "#8AC642", fontWeight: 600, margin: 0 }}>
                Applying For:{" "}
                <span style={{ color: "#fff" }}>
      {formData.applyingFor === "POS" 
        ? "POSP (Point of Sales Person)"
        : formData.applyingFor === "Employee"
        ? "Employee"
        : "Not Selected"}
    </span>
              </p>
            </div>

           {/* Replace your entire grid section with this */}
<div style={{ marginBottom: 32 }}>
  {/* Row 1: Full Name | Gender */}
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 24,
    marginBottom: 24,
  }}>
    <FormField
      label="Full Name"
      field="fullName"
      type="text"
      placeholder="Enter your full name"
      value={formData.fullName}
      onChange={(val) => handleChange('fullName', val)}
      onBlur={() => handleBlur('fullName')}
      error={fieldErrors.fullName}
      touched={touched.fullName}
    />
    <FormField
      label="Gender"
      field="gender"
      type="select"
      value={formData.gender}
      onChange={(val) => handleChange('gender', val)}
      onBlur={() => handleBlur('gender')}
      error={fieldErrors.gender}
      touched={touched.gender}
      options={[
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Others', label: 'Others' },
      ]}
    />
  </div>

  {/* Row 2: Date of Birth | Contact Number */}
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 24,
    marginBottom: 24,
  }}>
    <FormField
      label="Date Of Birth"
      field="dob"
      type="date"
      value={formData.dob}
      onChange={(val) => handleChange('dob', val)}
      onBlur={() => handleBlur('dob')}
      error={fieldErrors.dob}
      touched={touched.dob}
    />
    <FormField
      label="Contact Number"
      field="contactNumber"
      type="tel"
      placeholder="Enter your contact number"
      value={formData.contactNumber}
      onChange={(val) => handleChange('contactNumber', val)}
      onBlur={() => handleBlur('contactNumber')}
      error={fieldErrors.contactNumber}
      touched={touched.contactNumber}
    />
  </div>

  {/* Row 3: Address | Email */}
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 24,
    marginBottom: 24,
  }}>
    <FormField
      label="Address"
      field="address"
      type="text"
      placeholder="Enter your address"
      value={formData.address}
      onChange={(val) => handleChange('address', val)}
      onBlur={() => handleBlur('address')}
      error={fieldErrors.address}
      touched={touched.address}
    />
    <FormField
      label="Email"
      field="email"
      type="email"
      placeholder="Enter your email address"
      value={formData.email}
      onChange={(val) => handleChange('email', val)}
      onBlur={() => handleBlur('email')}
      error={fieldErrors.email}
      touched={touched.email}
    />
  </div>

  {/* Row 4: State | Pin Code */}
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 24,
  }}>
    <StateAutocomplete
      label="State"
      value={formData.stateAgent}
      onChange={(val) => handleChange('stateAgent', val)}
      onBlur={() => handleBlur('stateAgent')}
      error={fieldErrors.stateAgent}
      touched={touched.stateAgent}
      options={statesData}
      placeholder="Search and select your state"
      disabled={loadingStates}
    />
    <FormField
      label="Pin Code"
      field="pinCode"
      type="text"
      placeholder="Enter your pin code"
      value={formData.pinCode}
      onChange={(val) => handleChange('pinCode', val)}
      onBlur={() => handleBlur('pinCode')}
      error={fieldErrors.pinCode}
      touched={touched.pinCode}
    />
  </div>
</div>

            {/* Conditional File Upload - Resume for Employee, Passport Photo for POS */}
            {formData.applyingFor === "Employee" && (
              <FileUploadBox
                id="resumeUpload"
                label="Upload Resume"
                file={resumeFile}
                error={fieldErrors.resume}
                onFileSelect={handleFileSelect}
                dragActiveState={dragActive.resume}
                icon="📄"
                accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff,.tif"
              />
            )}

            {/* POS Documents Section */}
            {formData.applyingFor === "POS" && (
              <>
                <div style={{ marginTop: 24, marginBottom: 32 }}>
                  <h2
                    style={{
                      color: "#8AC642",
                      fontWeight: 600,
                      fontSize: "1.5rem",
                      marginBottom: 8,
                    }}
                  >
                    Required Documents for POS
                  </h2>
                  <div
                    style={{
                      height: 3,
                      width: 50,
                      backgroundColor: "#8AC642",
                      borderRadius: 2,
                    }}
                  />
                </div>

                {/* Two-column layout for POS documents */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: 24,
                    marginBottom: 32,
                  }}
                >
                  {/* Left Column */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 24,
                    }}
                  >
                    <FileUploadBox
                      id="passportPhoto"
                      label="Passport Size Photo"
                      file={posDocuments.passportPhoto}
                      error={fieldErrors.passportPhoto}
                      onFileSelect={(e) => handlePosFileSelect("passportPhoto", e)}
                      dragActiveState={dragActive.passportPhoto}
                      icon="📷"
                      accept=".jpg,.jpeg,.png"
                    />

                    <FileUploadBox
                      id="aadharFront"
                      label="Aadhaar Front Side (Number Masked)"
                      file={posDocuments.aadharFront}
                      error={fieldErrors.aadharFront}
                      onFileSelect={(e) =>
                        handlePosFileSelect("aadharFront", e)
                      }
                      dragActiveState={dragActive.aadharFront}
                      icon="🪪"
                      accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff,.tif"
                    />

                    <FileUploadBox
                      id="educationCertificate"
                      label="Education Certificate"
                      file={posDocuments.educationCertificate}
                      error={fieldErrors.educationCertificate}
                      onFileSelect={(e) =>
                        handlePosFileSelect("educationCertificate", e)
                      }
                      dragActiveState={dragActive.educationCertificate}
                      icon="🎓"
                      accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff,.tif"
                    />
                  </div>

                  {/* Right Column */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 24,
                    }}
                  >
                    <FileUploadBox
                      id="panCard"
                      label="PAN Card"
                      file={posDocuments.panCard}
                      error={fieldErrors.panCard}
                      onFileSelect={(e) => handlePosFileSelect("panCard", e)}
                      dragActiveState={dragActive.panCard}
                      icon="🆔"
                      accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff,.tif"
                    />

                    <FileUploadBox
                      id="aadharBack"
                      label="Aadhaar Back Side (Number Masked)"
                      file={posDocuments.aadharBack}
                      error={fieldErrors.aadharBack}
                      onFileSelect={(e) => handlePosFileSelect("aadharBack", e)}
                      dragActiveState={dragActive.aadharBack}
                      icon="🪪"
                      accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff,.tif"
                    />

                    <FileUploadBox
                      id="cancelledCheque"
                      label="Cancelled Cheque & Bank Passbook ( Name must be visible )"
                      file={posDocuments.cancelledCheque}
                      error={fieldErrors.cancelledCheque}
                      onFileSelect={(e) =>
                        handlePosFileSelect("cancelledCheque", e)
                      }
                      dragActiveState={dragActive.cancelledCheque}
                      icon="🏦"
                      accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff,.tif"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <Button
                text="Submit"
                onClick={handleSubmit}
                style={{
                  backgroundColor: "#8AC642",
                  color: "#fff",
                  padding: "10px 40px",
                  fontWeight: 600,
                  borderRadius: "8px",
                  fontSize: "16px",
                  textTransform: "none",
                }}
              />
              <Button
                text="Cancel"
                onClick={() => {
                  setShowWelcomeModal(true);
                  setFormData({
                    fullName: "",
                    gender: "",
                    dob: "",
                    address: "",
                    stateAgent: "",
                    pinCode: "",
                    contactNumber: "",
                    email: "",
                    applyingFor: "",
                  });
                  setResumeFile(null);
                  setPosDocuments({
                    passportPhoto: null,
                    panCard: null,
                    aadharFront: null,
                    aadharBack: null,
                    educationCertificate: null,
                    cancelledCheque: null,
                  });
                  setFieldErrors({});
                  setTouched({});
                }}
                style={{
                  backgroundColor: "transparent",
                  color: "#8AC642",
                  border: "2px solid #8AC642",
                  padding: "10px 40px",
                  fontWeight: 600,
                  borderRadius: "8px",
                  fontSize: "16px",
                  textTransform: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default JoinUs;