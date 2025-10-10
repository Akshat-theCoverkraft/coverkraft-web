import React, { useState } from "react";
import Button from "../component/Button";
import FormField from "../component/Components/FormField";
import LoaderOverlay from "../component/Components/LoaderOverlay";
import {
  validateEmail,
  validatePhoneNumber,
  validatePinCode,
  validateFullName,
  validateDOB,
  validateAddress,
  validateState,
  validateGender,
  validateApplyingFor,
  validateFile,
  validateForm,
} from "../utils/formValidation";
import Footer from "../Landing/component/Footer";
import Navbar from "../component/Navbar";
import API_URL from "../ServiceModule/Service";
import { submitAgent } from "../store/action/action";
import { useDispatch } from "react-redux";
import Popup from "../component/Components/Popup";

const JoinUs = () => {
  const dispatch = useDispatch();

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
  const [dragActive, setDragActive] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ✅ Form field helpers
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field) => {
    let error = "";

    switch (field) {
      case "fullName":
        error = validateFullName(formData.fullName).error;
        break;
      case "email":
        error = validateEmail(formData.email).error;
        break;
      case "contactNumber":
        error = validatePhoneNumber(formData.contactNumber).error;
        break;
      case "pinCode":
        error = validatePinCode(formData.pinCode).error;
        break;
      case "dob":
        error = validateDOB(formData.dob).error;
        break;
      case "address":
        error = validateAddress(formData.address).error;
        break;
      case "stateAgent":
        error = validateState(formData.stateAgent).error;
        break;
      case "gender":
        error = validateGender(formData.gender).error;
        break;
      case "applyingFor":
        error = validateApplyingFor(formData.applyingFor).error;
        break;
      default:
        break;
    }

    setFieldErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileValidation = validateFile(file);

      if (!fileValidation.valid) {
        setFieldErrors((prev) => ({ ...prev, resume: fileValidation.error }));
        return;
      }

      setResumeFile(file);
      setFieldErrors((prev) => ({ ...prev, resume: "" }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) handleFileSelect({ target: { files } });
  };

  // ✅ Final submit function
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

  // Validate form
  const validation = validateForm(formData, resumeFile);
  if (!validation.isValid) {
    setFieldErrors(validation.errors);
    return;
  }

  // Prepare FormData
  const data = new FormData();
  data.append("fullName", formData.fullName);
  data.append("gender", formData.gender);
  data.append("dob", formData.dob);
  data.append("address", formData.address);
  data.append("state", formData.stateAgent);
  data.append("pinCode", formData.pinCode);
  data.append("contactNumber", formData.contactNumber);
  data.append("email", formData.email);
  data.append("applyingFor", formData.applyingFor);
  data.append("resume", resumeFile);

  setLoading(true);

  try {
    const res = await dispatch(submitAgent(API_URL, data));
    console.log("Response:", res);

    // ✅ Your backend sends: { status: true, message: "...", data: {...} }
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

  return (
    <>
      <Navbar />
      {loading && <LoaderOverlay/>}
     <Popup
  visible={showSuccessModal}
  title="Application Submitted 🎉"
  message="Thank you for applying! Our team will review your application and contact you soon."
  buttonText="OK"
  onClose={() => setShowSuccessModal(false)}
/>


      <div style={{ backgroundColor: "#000", minHeight: "100vh", padding: "40px 20px" }}>
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
            {/* Heading */}
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

            {/* Applying For */}
            <div style={{ marginBottom: 32, marginTop: 32 }}>
              <FormField
                label="Applying For"
                field="applyingFor"
                type="select"
                value={applyingFor}
                onChange={(val) => handleChange("applyingFor", val)}
                onBlur={() => handleBlur("applyingFor")}
                error={fieldErrors.applyingFor}
                touched={touched.applyingFor}
                options={[
                  { value: "Employee", label: "Employee" },
                  { value: "POS", label: "POS" },
                ]}
              />
            </div>

            {/* Two-column layout */}
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
                  value={fullName}
                  onChange={(val) => handleChange("fullName", val)}
                  onBlur={() => handleBlur("fullName")}
                  error={fieldErrors.fullName}
                  touched={touched.fullName}
                />
                <FormField
                  label="Date Of Birth"
                  field="dob"
                  type="date"
                  value={dob}
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
                  value={address}
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
                  value={stateAgent}
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
                  value={gender}
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
                  value={pinCode}
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
                  value={email}
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
                  value={contactNumber}
                  onChange={(val) => handleChange("contactNumber", val)}
                  onBlur={() => handleBlur("contactNumber")}
                  error={fieldErrors.contactNumber}
                  touched={touched.contactNumber}
                />
              </div>
            </div>

            {/* Upload Resume */}
            <div style={{ marginBottom: 32 }}>
              <label
                style={{
                  color: "#fff",
                  fontSize: "0.95rem",
                  marginBottom: 8,
                  fontWeight: 500,
                  display: "block",
                }}
              >
                Upload Resume <span style={{ color: "#f44336" }}>*</span>
              </label>

              <input
                type="file"
                id="resumeUpload"
                onChange={handleFileSelect}
                style={{ display: "none" }}
                accept=".pdf,.doc,.docx"
              />

              <label
                htmlFor="resumeUpload"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  minHeight: "140px",
                  backgroundColor: dragActive ? "#2c2c2c" : "#1a1a1a",
                  border:
                    dragActive || fieldErrors.resume
                      ? dragActive
                        ? "2px dashed #8AC642"
                        : "2px dashed #f44336"
                      : "2px dashed #444",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: "20px",
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>📄</div>
                {resumeFile ? (
                  <>
                    <span style={{ color: "#8AC642", fontWeight: 600 }}>
                      {resumeFile.name}
                    </span>
                    <span style={{ color: "#999", fontSize: "0.85rem" }}>
                      Click to change file
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{ color: "#8AC642", fontWeight: 600 }}>
                      Drag and drop your resume here
                    </span>
                    <span style={{ color: "#999", fontSize: "0.85rem" }}>
                      or click to browse (PDF, DOC, DOCX)
                    </span>
                  </>
                )}
              </label>

              {fieldErrors.resume && (
                <span
                  style={{
                    color: "#f44336",
                    fontSize: "0.85rem",
                    display: "block",
                    marginTop: 4,
                  }}
                >
                  {fieldErrors.resume}
                </span>
              )}
            </div>

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
                size="lg"
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
                size="lg"
                onClick={() => window.history.back()}
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
