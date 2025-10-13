import React, { useState } from "react";
import Navbar from "../component/Navbar";
import Footer from "../Landing/component/Footer";
import FormField from "../component/Components/FormField";
import LoaderOverlay from "../component/Components/LoaderOverlay";
import Button from "../component/Button";
import Popup from "../component/Components/Popup";
import API_URL from "../ServiceModule/Service";
import { submitAgent } from "../store/action/action";
import { useDispatch } from "react-redux";
import { validateFullName, validateEmail, validatePhoneNumber, validatePinCode, validateDOB, validateAddress, validateState, validateGender, validateApplyingFor, validateFile } from "../utils/formValidation";
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
  // ADD: POS Documents state
  const [posDocuments, setPosDocuments] = useState({
    panCard: null,
    aadharFront: null,
    aadharBack: null,
    educationCertificate: null,
  });
  
  // MODIFY: dragActive to handle multiple upload sections
  const [dragActive, setDragActive] = useState({
    resume: false,
    panCard: false,
    aadharFront: false,
    aadharBack: false,
    educationCertificate: false,
  });
  
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
 const dispatch = useDispatch();
 const navigate = useNavigate();
  // MODIFY: validateForm to include POS documents validation
  const validateForm = (data, file, isPOS, posFiles) => {
    const errors = {};
    if (validateFullName(data.fullName).error) errors.fullName = validateFullName(data.fullName).error;
    if (validateEmail(data.email).error) errors.email = validateEmail(data.email).error;
    if (validatePhoneNumber(data.contactNumber).error) errors.contactNumber = validatePhoneNumber(data.contactNumber).error;
    if (validatePinCode(data.pinCode).error) errors.pinCode = validatePinCode(data.pinCode).error;
    if (validateDOB(data.dob).error) errors.dob = validateDOB(data.dob).error;
    if (validateAddress(data.address).error) errors.address = validateAddress(data.address).error;
    if (validateState(data.stateAgent).error) errors.stateAgent = validateState(data.stateAgent).error;
    if (validateGender(data.gender).error) errors.gender = validateGender(data.gender).error;
    if (validateApplyingFor(data.applyingFor).error) errors.applyingFor = validateApplyingFor(data.applyingFor).error;
    if (!validateFile(file, false).valid) errors.resume = validateFile(file, false).error;

    // ADD: Validate POS documents if applying for POS
    if (isPOS) {
      if (!validateFile(posFiles.panCard, true).valid) errors.panCard = validateFile(posFiles.panCard, true).error;
      if (!validateFile(posFiles.aadharFront, true).valid) errors.aadharFront = validateFile(posFiles.aadharFront, true).error;
      if (!validateFile(posFiles.aadharBack, true).valid) errors.aadharBack = validateFile(posFiles.aadharBack, true).error;
      if (!validateFile(posFiles.educationCertificate, true).valid) errors.educationCertificate = validateFile(posFiles.educationCertificate, true).error;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  // ADD: Handle POS document file selection
  const handlePosFileSelect = (docType, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileValidation = validateFile(file, true);

      if (!fileValidation.valid) {
        setFieldErrors((prev) => ({ ...prev, [docType]: fileValidation.error }));
        return;
      }

      setPosDocuments((prev) => ({ ...prev, [docType]: file }));
      setFieldErrors((prev) => ({ ...prev, [docType]: "" }));
    }
  };

  // MODIFY: handleDrag to accept field parameter
  const handleDrag = (e, field = "resume") => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive((prev) => ({ ...prev, [field]: true }));
    } else if (e.type === "dragleave") {
      setDragActive((prev) => ({ ...prev, [field]: false }));
    }
  };

  // MODIFY: handleDrop to accept field parameter
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

  // MODIFY: handleSubmit to include POS documents in API payload
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

  // Mark all fields as touched
  setTouched(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));

  const isPOS = formData.applyingFor === "POS";

  // Validate form
  const validation = validateForm(formData, resumeFile, isPOS, posDocuments);
  if (!validation.isValid) {
    setFieldErrors(validation.errors);
    return;
  }

  // Destructure form data
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

  // Prepare FormData for API
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
  if (resumeFile) data.append("resume", resumeFile);

  // Append POS documents (if applicable)
  if (isPOS) {
    if (posDocuments.panCard) data.append("panCard", posDocuments.panCard);
    if (posDocuments.aadharFront) data.append("aadharFront", posDocuments.aadharFront);
    if (posDocuments.aadharBack) data.append("aadharBack", posDocuments.aadharBack);
    if (posDocuments.educationCertificate)
      data.append("educationCertificate", posDocuments.educationCertificate);
  }

  setLoading(true);

  try {

    const res = await dispatch(submitAgent(API_URL, data));
    console.log("Response:", res);

    // ✅ Backend response: { status: true/false, message: "...", data: {...} }
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
        panCard: null,
        aadharFront: null,
        aadharBack: null,
        educationCertificate: null,
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


  const { fullName, gender, dob, address, stateAgent, pinCode, contactNumber, email, applyingFor } = formData;

  const welcomeButtons = [
    {
      label: "Employee",
      onClick: () => handleWelcomeButtonClick("Employee"),
      style: {
        backgroundColor: "#8AC642",
        color: "#fff",
      },
    },
    {
      label: "POS",
      onClick: () => handleWelcomeButtonClick("POS"),
      style: {
        backgroundColor: "#8AC642",
        color: "#fff",
      },
    },
  ];

const successButtons = [
  {
    label: "OK",
    onClick: () => {
      setShowSuccessModal(false); // close popup
      navigate("/"); // ✅ redirect to root
    },
    style: {
      backgroundColor: "#8AC642",
      color: "#fff",
    },
  },
];
  // ADD: Reusable file upload component
  const FileUploadBox = ({ 
    id, 
    label, 
    file, 
    error, 
    onFileSelect, 
    dragActiveState, 
    icon = "📄",
    accept = ".pdf,.jpg,.jpeg,.png"
  }) => (
    <div style={{ marginBottom: 24 }}>
      <label
        style={{
          color: "#fff",
          fontSize: "0.95rem",
          marginBottom: 8,
          fontWeight: 500,
          display: "block",
        }}
      >
        {label} <span style={{ color: "#f44336" }}>*</span>
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
            color: "#f44336",
            fontSize: "0.85rem",
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
        title="Welcome to CoverCraft 👋"
        message={`We are happy to know your interest to join CoverCraft. Please share your details below. We will get back to you once we verify your details and if it matches our requirement. Thank you for your time and interest.\n\nRegards,\nTeam CoverCraft`}
        buttons={welcomeButtons}
        onClose={() => setShowWelcomeModal(false)}
      />

      <Popup
        visible={showSuccessModal}
        title="Application Submitted 🎉"
        message="Thank you for applying! Our team will review your application and contact you soon."
        buttons={successButtons}
        onClose={() => setShowSuccessModal(false)}
        navigateTo={'/'}
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
                  textTransform: "uppercase",
                  marginBottom: 8,
                  letterSpacing: 1,
                  margin: 0,
                }}
              >
                Agent Details
              </h1>
              <div
                style={{
                  height: 4,
                  width: 60,
                  backgroundColor: "#8AC642",
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
                <span style={{ color: "#fff" }}>{formData.applyingFor || "Not Selected"}</span>
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 24,
                marginBottom: 32,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <FormField
                  label="Full Name"
                  field="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(val) => handleChange("fullName", val)}
                  onBlur={() => handleBlur("fullName")}
                  error={fieldErrors.fullName}
                  touched={touched.fullName}
                />
                <FormField
                  label="Date Of Birth"
                  field="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(val) => handleChange("dob", val)}
                  onBlur={() => handleBlur("dob")}
                  error={fieldErrors.dob}
                  touched={touched.dob}
                />
                <FormField
                  label="Address"
                  field="address"
                  type="text"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={(val) => handleChange("address", val)}
                  onBlur={() => handleBlur("address")}
                  error={fieldErrors.address}
                  touched={touched.address}
                />
                <FormField
                  label="State"
                  field="stateAgent"
                  type="text"
                  placeholder="Enter your state"
                  value={formData.stateAgent}
                  onChange={(val) => handleChange("stateAgent", val)}
                  onBlur={() => handleBlur("stateAgent")}
                  error={fieldErrors.stateAgent}
                  touched={touched.stateAgent}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <FormField
                  label="Gender"
                  field="gender"
                  type="select"
                  value={formData.gender}
                  onChange={(val) => handleChange("gender", val)}
                  onBlur={() => handleBlur("gender")}
                  error={fieldErrors.gender}
                  touched={touched.gender}
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Others", label: "Others" },
                  ]}
                />
                <FormField
                  label="Pin Code"
                  field="pinCode"
                  type="text"
                  placeholder="Enter your pin code"
                  value={formData.pinCode}
                  onChange={(val) => handleChange("pinCode", val)}
                  onBlur={() => handleBlur("pinCode")}
                  error={fieldErrors.pinCode}
                  touched={touched.pinCode}
                />
                <FormField
                  label="Email"
                  field="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(val) => handleChange("email", val)}
                  onBlur={() => handleBlur("email")}
                  error={fieldErrors.email}
                  touched={touched.email}
                />
                <FormField
                  label="Contact Number"
                  field="contactNumber"
                  type="tel"
                  placeholder="Enter your contact number"
                  value={formData.contactNumber}
                  onChange={(val) => handleChange("contactNumber", val)}
                  onBlur={() => handleBlur("contactNumber")}
                  error={fieldErrors.contactNumber}
                  touched={touched.contactNumber}
                />
              </div>
            </div>

            {/* Resume Upload */}
            <FileUploadBox
              id="resumeUpload"
              label="Upload Resume"
              file={resumeFile}
              error={fieldErrors.resume}
              onFileSelect={handleFileSelect}
              dragActiveState={dragActive.resume}
              icon="📄"
              accept=".pdf,.doc,.docx"
            />

            {/* ADD: POS Documents Section - Only show if POS is selected */}
            {formData.applyingFor === "POS" && (
              <>
                <div style={{ marginTop: 48, marginBottom: 32 }}>
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
                  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <FileUploadBox
                      id="panCard"
                      label="PAN Card"
                      file={posDocuments.panCard}
                      error={fieldErrors.panCard}
                      onFileSelect={(e) => handlePosFileSelect("panCard", e)}
                      dragActiveState={dragActive.panCard}
                      icon="🆔"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />

                    <FileUploadBox
                      id="aadharBack"
                      label="Aadhar Card (Back Side)"
                      file={posDocuments.aadharBack}
                      error={fieldErrors.aadharBack}
                      onFileSelect={(e) => handlePosFileSelect("aadharBack", e)}
                      dragActiveState={dragActive.aadharBack}
                      icon="🪪"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>

                  {/* Right Column */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <FileUploadBox
                      id="aadharFront"
                      label="Aadhar Card (Front Side)"
                      file={posDocuments.aadharFront}
                      error={fieldErrors.aadharFront}
                      onFileSelect={(e) => handlePosFileSelect("aadharFront", e)}
                      dragActiveState={dragActive.aadharFront}
                      icon="🪪"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />

                    <FileUploadBox
                      id="educationCertificate"
                      label="Education Certificate"
                      file={posDocuments.educationCertificate}
                      error={fieldErrors.educationCertificate}
                      onFileSelect={(e) => handlePosFileSelect("educationCertificate", e)}
                      dragActiveState={dragActive.educationCertificate}
                      icon="🎓"
                      accept=".pdf,.jpg,.jpeg,.png"
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
                text="Save"
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
                    panCard: null,
                    aadharFront: null,
                    aadharBack: null,
                    educationCertificate: null,
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