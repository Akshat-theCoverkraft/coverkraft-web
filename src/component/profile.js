import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Drawer, Box, Typography, IconButton, Dialog, DialogContent, DialogActions } from "@mui/material";
import { Card, Grid } from "@material-ui/core";
import { toast, ToastContainer } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";

// Components
import Button from "../component/Button";
import CustomInput from "../component/CustomInput";
import GlobalDropdown from "./StateDropdown";
import CityDropdown from "./CityDropdown";
import GlobalDatePicker from "./GlobalDatePicker";
import Family from "../profile/Family";
import Communication from "../profile/Communication";
import ContactUs from "../profile/ContactUs";

// Assets
import icDefaultProfile from "../Images/ic_default_profile.png";
import editIcon from "../Images/edit-icon.png";
import backArrow from "../Images/ic_back_button.png";
import family from "../Images/ic_family_member.png";
import about from "../Images/ic_about.png";
import communication from "../Images/ic_communication_pref.png";
import help from "../Images/ic_help.png";
import logout from "../Images/ic_logout.png";

// Actions & Utils
import { getBYIDUsers, updateUser, getAllState, deleteAccount } from "../store/action/action";
import API_URL from "../ServiceModule/Service";
import IMAGE_PATH from "../ServiceModule/imagePath";
import { THEME_COLOR } from "../constants";
import { capitalizeFirstLetter } from "../utils/helpers";

// Constants
const LOCAL_STORAGE_KEYS = [
  "loggedIn", "verificationId", "userId", "policyId",
  "selectedPolicyId", "token"
];

const MENU_ITEMS = [
  { label: "Family Member", icon: family, action: "family" },
  { label: "Communication Preferences", icon: communication, action: "communication" },
  { label: "Contact Us", icon: help, action: "help" },
  { label: "About", icon: about, action: "about" },
  { label: "Logout", icon: logout, action: "logout" },
  { label: "Delete Account", icon: logout, action: "delete" }
];

// Utility function to convert text to Title Case
const toTitleCase = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Circular Progress Component
const CircularProgress = ({ percentage, size = 120, strokeWidth = 6, showPercentage = true }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  // Dynamic color based on percentage
  const getProgressColor = (percent) => {
    if (percent >= 80) return "#4CAF50"; // Green
    if (percent >= 60) return "#FF9800"; // Orange
    if (percent >= 40) return "#FFC107"; // Yellow
    return "#F44336"; // Red
  };




  return (
    <div style={{
      position: 'relative',
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <svg
        width={size}
        height={size}
        style={{
          position: 'absolute',
          transform: 'rotate(-90deg)',
          zIndex: 1
        }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getProgressColor(percentage)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.5s ease-in-out',
            filter: 'drop-shadow(0 0 6px rgba(138, 198, 66, 0.3))'
          }}
        />
      </svg>

      {/* Percentage text */}
      {showPercentage && (
        <div style={{
          position: 'absolute',
          bottom: -8,
          right: -8,
          backgroundColor: getProgressColor(percentage),
          color: '#fff',
          borderRadius: '12px',
          padding: '2px 6px',
          fontSize: '10px',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          zIndex: 2
        }}>
          {percentage}%
        </div>
      )}
    </div>
  );
};

const ProfileDrawer = ({ open, onClose, userName }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [openDialog, setOpenDialog] = useState(false);
  // Redux selectors
  const userbyId = useSelector(state => state.user);
  const states = useSelector(state => state.user);
  const [openCamera, setOpenCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  // State management
  const [drawers, setDrawers] = useState({
    family: false,
    communication: false,
    help: false
  });

  useEffect(() => {
    if (openCamera) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((s) => {
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.error("Camera error:", err);
          setOpenCamera(false);
        });
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [openCamera]);


  const [modals, setModals] = useState({
    delete: false
  });

  const [profileState, setProfileState] = useState({
    update: false,
    profileImage: icDefaultProfile,
    showImageInput: false,
    profileCompletion: 0,
    isUpdating: false
  });

  const [formData, setFormData] = useState({
    username: "",
    useremail: "",
    userDob: null,
    userAddress: "",
    state: "",
    city: "",
    userPhone: "",
    pinCode: "",
    gender: "",
    userImgFile: null,
    selectedStateId: "",
    selectedCityId: ""
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [returnPath, setReturnPath] = useState("/");

  // Memoized values
  const commonInputStyle = useMemo(() => ({
    height: 48,
    fontSize: "1.222rem",
    borderRadius: 42,
    paddingLeft: "20px",
    width: "100%",
    color: "#fff",
  }), []);

  const commonItemStyle = useMemo(() => ({
    maxWidth: 900,
    width: "100%",
    paddingLeft: "10px !important",
  }), []);

  // Utility functions
  const calculateProfileCompletion = useCallback((data) => {
    const requiredFields = [
      { field: "userName", weight: 20 },
      { field: "userEmail", weight: 15 },
      { field: "userPhone", weight: 15 },
      { field: "userImg", weight: 10 },
      { field: "userAddress", weight: 10 },
      { field: "state", weight: 10 },
      { field: "city", weight: 10 },
      { field: "pinCode", weight: 5 },
      { field: "gender", weight: 5 }
    ];

    let totalScore = 0;
    requiredFields.forEach(({ field, weight }) => {
      const value = data?.[field];
      if (value !== undefined && value !== null && value !== "" &&
        !(typeof value === 'object' && Object.keys(value).length === 0)) {
        totalScore += weight;
      }
    });

    return Math.min(100, totalScore);
  }, []);

  const getUserId = useCallback(() => sessionStorage.getItem("userId"), []);

  const isOldEnough = useCallback((date) => {
    if (!date) return true;
    const today = new Date();
    const ageDiff = today.getFullYear() - date.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > date.getMonth() ||
      (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());
    return hasHadBirthdayThisYear ? ageDiff >= 18 : ageDiff - 1 >= 18;
  }, []);

  // Event handlers
  const handleDrawerToggle = useCallback((drawerName, isOpen) => {
    setDrawers(prev => ({ ...prev, [drawerName]: isOpen }));
  }, []);

  const handleCapture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "captured_photo.jpg", { type: "image/jpeg" });
        const reader = new FileReader();
        reader.onloadend = () => {
          handleProfileStateChange("profileImage", reader.result);
          handleFormChange("userImgFile", file);
        };
        reader.readAsDataURL(file);
      }
    }, "image/jpeg");

    setOpenCamera(false);
    setOpenDialog(false);
  };


  const handleModalToggle = useCallback((modalName, isOpen) => {
    setModals(prev => ({ ...prev, [modalName]: isOpen }));
  }, []);

  const handleFormChange = useCallback((field, value) => {
    // Apply Title Case formatting specifically for the username field
    const processedValue = field === 'username' ? toTitleCase(value) : value;
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [validationErrors]);

  const handleProfileStateChange = useCallback((field, value) => {
    setProfileState(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleMenuAction = useCallback((action) => {
    const actions = {
      family: () => handleDrawerToggle('family', true),
      communication: () => handleDrawerToggle('communication', true),
      help: () => navigate("/contactus"),
      about: () => { onClose(); navigate("/about"); },
      logout: () => {
        LOCAL_STORAGE_KEYS.forEach(key => sessionStorage.removeItem(key));
        navigate("/");
        setTimeout(() => window.location.reload(), 100);
      },
      delete: () => handleModalToggle('delete', true)
    };
    actions[action]?.();
  }, [handleDrawerToggle, handleModalToggle, navigate, onClose]);

  const handleImageChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleProfileStateChange('profileImage', reader.result);
        handleFormChange('userImgFile', file);
        setOpenDialog(false);
      };
      reader.readAsDataURL(file);
    }
  }, [handleFormChange, handleProfileStateChange]);

  // Validation function
  const validateForm = useCallback(() => {
    const errors = {};

    // Name validation
    if (
      !formData.username ||
      formData.username.trim().length < 3 ||
      !/^([A-Z][a-z]*)(\s[A-Z][a-z]*)*$/.test(formData.username.trim())
    ) {
      errors.username = "Full name must be in Title Case and at least 3 characters long";
    }

    // Email validation
    if (formData.useremail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.useremail)) {
      errors.useremail = "Please enter a valid email address";
    }

    // Phone validation
    if (formData.userPhone && !/^\d{10}$/.test(formData.userPhone)) {
      errors.userPhone = "Please enter a valid 10-digit phone number";
    }

    // Pin code validation
    if (formData.pinCode && !/^\d{5,6}$/.test(formData.pinCode)) {
      errors.pinCode = "Please enter a valid pin code (5 or 6 digits)";
    }

    // Date of birth validation
    if (formData.userDob && !isOldEnough(formData.userDob)) {
      errors.userDob = "You must be at least 18 years old";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, isOldEnough]);

  // Fixed update profile function
  const handleUpdateProfile = useCallback(async () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    const userId = getUserId();
    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    handleProfileStateChange('isUpdating', true);

    try {
      const formDataToSend = new FormData();

      // Add user ID
      formDataToSend.append("_id", userId);

      // Add form fields with proper mapping
      formDataToSend.append("userName", formData.username || '');
      formDataToSend.append("userEmail", formData.useremail || '');
      formDataToSend.append("userPhone", formData.userPhone || '');
      formDataToSend.append("userAddress", formData.userAddress || '');
      formDataToSend.append("pinCode", formData.pinCode || '');
      formDataToSend.append("gender", formData.gender || '');

      // Handle date of birth
      if (formData.userDob) {
        try {
          const formattedDob = formData.userDob.toLocaleDateString("en-GB");
          formDataToSend.append("userDob", formattedDob);
        } catch (e) {
          console.error("Date formatting error:", e);
          formDataToSend.append("userDob", '');
        }
      } else {
        formDataToSend.append("userDob", '');
      }

      // Handle state and city
      formDataToSend.append("state", formData.selectedStateId || '');
      formDataToSend.append("city", formData.selectedCityId || '');

      // Handle image file
      if (formData.userImgFile) {
        formDataToSend.append("userImg", formData.userImgFile);
      }

      // Debug: Log form data (remove in production)
      console.log("Sending form data:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      const response = await dispatch(updateUser(API_URL, formDataToSend));

      if (response && response.status) {
        toast.success("Profile updated successfully!");
        handleProfileStateChange('update', false);

        // CRITICAL: Refresh user data after successful update
        await fetchUserProfile();

      } else {
        const errorMessage = response?.message || response?.error || "Failed to update profile";
        toast.error(errorMessage);
        console.error("Update failed:", response);
      }

    } catch (error) {
      console.error("Update error:", error);
      toast.error("An error occurred while updating profile");
    } finally {
      handleProfileStateChange('isUpdating', false);
    }
  }, [formData, validateForm, getUserId, dispatch, handleProfileStateChange]);

  const handleDeleteAccount = useCallback(() => {
    const userId = getUserId();
    if (userId) {
      dispatch(deleteAccount(API_URL, userId))
        .then(() => {
          toast.success("Account deleted successfully");
          sessionStorage.clear();
          navigate("/login");
        })
        .catch(() => {
          toast.error("Error deleting account");
        });
    }
  }, [getUserId, dispatch, navigate]);

  const fetchUserProfile = useCallback(async () => {
    const userId = getUserId();
    if (userId) {
      try {
        await dispatch(getBYIDUsers(API_URL, userId));
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
  }, [getUserId, dispatch]);

  // Effects
  useEffect(() => {
    handleProfileStateChange('update', false);
  }, [handleProfileStateChange]);

  useEffect(() => {
    dispatch(getAllState(API_URL));
  }, [dispatch]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (open) {
      setReturnPath(location.pathname);
    }
  }, [open, location.pathname]);

  // FIXED: Populate form data when user data is loaded with proper Title Case handling
  useEffect(() => {
    if (userbyId.getUserById?.data) {
      const data = userbyId.getUserById.data;
      const percentage = calculateProfileCompletion(data);

      console.log("Populating form with user data:", data); // Debug log
      
      // Update form data with fresh API data, ensuring proper Title Case for username
      setFormData(prevFormData => ({
        ...prevFormData,
        username: toTitleCase(data.userName) || "", // Apply Title Case formatting here
        useremail: data.userEmail || "",
        userPhone: data.userPhone || "",
        userDob: data.userDob ? new Date(data.userDob.split("/").reverse().join("-")) : null,
        userAddress: data.userAddress || "",
        pinCode: data.pinCode || "",
        gender: data.gender || "",
        selectedStateId: data?.state?._id || "",
        selectedCityId: data?.city?._id || "",
        userImgFile: null // Reset file input
      }));

      handleProfileStateChange('profileCompletion', percentage);
      const profileImageUrl = data.userImg || icDefaultProfile;
      handleProfileStateChange('profileImage', profileImageUrl);
    }
  }, [userbyId.getUserById?.data, calculateProfileCompletion, handleProfileStateChange]);

  // Render functions
  const renderProfileHeader = () => (
    <div className="main-container">
      <div className="background-image-container1">
        <div className="profile-details">
          <div className="profile-image-container" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress
              percentage={profileState.profileCompletion}
              size={profileState.update ? 100 : 120}
              strokeWidth={4}
              showPercentage={true}
            />
            <div style={{
              position: 'absolute',
              width: profileState.update ? '70px' : '85px',
              height: profileState.update ? '70px' : '85px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={profileState.profileImage || icDefaultProfile}
                alt="Profile"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
            </div>
            {profileState.update && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  cursor: 'pointer',
                  zIndex: 10
                }}
                onClick={() => setOpenDialog(true)} // only open dialog
              >
                <img
                  src={editIcon}
                  alt="Edit"
                  style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#8AC642',
                    borderRadius: '50%',
                    padding: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                />
              </div>

            )}
            <input
              id="profile-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}   // <-- put this back
              style={{ display: "none" }}
            />
            <input
              id="camera-input"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}   // <-- and here too
              style={{ display: "none" }}
            />

          </div>

          {/* {!profileState.update && (
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <Typography
                variant="caption"
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '12px',
                  fontWeight: '500',
                  marginTop: "30px"
                }}
              >
                Profile Complete
              </Typography>
            </div>
          )} */}

          <h2 className="text-header text-light mt-2 text-center">
            {capitalizeFirstLetter(formData.username)}
          </h2>
          {formData.useremail && (
            <p className="register-text text-center">{formData.useremail}</p>
          )}
          {!profileState.update && (
            <div className="flex justify-center mt-2 mb-10">
              <Button
                text="Edit Profile"
                size="lg"
                onClick={() => handleProfileStateChange('update', true)}
                customStyle={{
                  width: "100%",
                  height: "5vh",
                  borderRadius: "3rem",
                  fontSize: "1.5rem",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMenuItem = (item, idx) => (
    <Grid
      container
      spacing={2}
      alignItems="center"
      key={idx}
      onClick={() => handleMenuAction(item.action)}
      style={{
        cursor: "pointer",
        borderBottom: `0.5px solid #fff`,
        marginBottom: "1.2rem",
        marginTop: "0.02rem",
        color:`${item.label==="Delete Account"?"red":""}`
      }}
    >
      <Grid item xs={2}>
        <img src={item.icon} style={{ maxHeight: "2.5rem" }} alt={item.label} />
      </Grid>
      <Grid item xs={8} >
        <span>{item.label}</span>
      </Grid>
    </Grid>
  );

  const renderUpdateForm = () => (
    <div className="main-container p-4">
      <Grid container spacing={2} direction="column" alignItems="center">
        {/* Full Name */}
        <Grid item style={commonItemStyle}>
          <CustomInput
            label="Full Name"
            placeholder="Enter your name"
            value={formData.username}
            onChange={(e) => handleFormChange('username', e.target.value)}
            required
            fullWidth
            inputStyle={commonInputStyle}
            validationMessage={validationErrors.username}
          />
        </Grid>

        {/* Phone */}
        <Grid item style={commonItemStyle}>
          <CustomInput
            type="tel"
            label="Mobile Number"
            placeholder="Enter your mobile number"
            value={formData.userPhone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              handleFormChange('userPhone', value);
            }}
            disabled
            fullWidth
            inputStyle={commonInputStyle}
            validationMessage={validationErrors.userPhone}
          />
        </Grid>

        {/* Email */}
        <Grid item style={commonItemStyle}>
          <CustomInput
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={formData.useremail}
            onChange={(e) => handleFormChange('useremail', e.target.value)}
            fullWidth
            inputStyle={commonInputStyle}
            validationMessage={validationErrors.useremail}
          />
        </Grid>

        {/* Address */}
        <Grid item style={commonItemStyle}>
          <CustomInput
            label="Address"
            placeholder="Enter your address"
            value={formData.userAddress}
            onChange={(e) => handleFormChange('userAddress', e.target.value)}
            fullWidth
            inputStyle={commonInputStyle}
          />
        </Grid>

        {/* State */}
        <Grid item style={commonItemStyle}>
          <GlobalDropdown
            className={formData.selectedStateId === "" ? 'placeholder-selected' : 'custom-dark-dropdown'}
            onStateSelect={(stateId) => handleFormChange('selectedStateId', stateId)}
            initialValue={formData.selectedStateId}
            style={commonInputStyle}
          />
        </Grid>

        {/* City */}
        <Grid item style={commonItemStyle}>
          <CityDropdown
            label="District"
            className={formData.selectedCityId === "" ? 'placeholder-selected' : 'custom-dark-dropdown'}
            selectedStateId={formData.selectedStateId}
            onCitySelect={(cityId) => handleFormChange('selectedCityId', cityId)}
            initialValue={formData.selectedCityId}
            style={commonInputStyle}
          />
        </Grid>

        {/* Pincode */}
        <Grid item style={commonItemStyle}>
          <CustomInput
            label="Pincode"
            placeholder="Enter your pincode"
            value={formData.pinCode}
            onChange={(e) => {
              const pin = e.target.value.replace(/\D/g, "").slice(0, 6);
              handleFormChange('pinCode', pin);
            }}
            fullWidth
            inputStyle={commonInputStyle}
            validationMessage={validationErrors.pinCode}
          />
        </Grid>

        {/* Gender */}
        {/* <Grid item style={commonItemStyle}>
          <label className="form-label fw-bold text-light mb-2 d-block">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => handleFormChange('gender', e.target.value)}
            className={formData.gender === '' ? 'placeholder-selected' : 'custom-dark-dropdown'}
          >
            <option value="">Select Your Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </Grid> */}

        {/* Buttons */}
        <Grid item style={commonItemStyle}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                text={profileState.isUpdating ? "Updating..." : "Update Profile"}
                onClick={handleUpdateProfile}
                disabled={profileState.isUpdating || !formData.username}
                bgcolor={profileState.isUpdating || !formData.username ? "#ccc" : "#8AC642"}
                customStyle={{
                  width: "100%",
                  height: 48,
                  borderRadius: 24,
                  fontSize: "1.4rem",
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                text="Cancel"
                onClick={() => {
                  handleProfileStateChange('update', false);
                  fetchUserProfile(); // Reset form data
                }}
                disabled={profileState.isUpdating}
                customStyle={{
                  width: "100%",
                  height: 48,
                  borderRadius: 24,
                  fontSize: "1.4rem",
                  backgroundColor: "#444",
                  color: "#fff",
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );

  const renderDeleteModal = () => (
    modals.delete && (
      <div style={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        background: "rgba(0, 0, 0, 0.6)", zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
      }}>
        <div style={{
          backgroundColor: "#1c1c1c", borderRadius: "16px", padding: "2rem",
          maxWidth: "500px", width: "100%", boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          textAlign: "center", border: "1px solid rgba(255,255,255,0.1)"
        }}>
          <Typography variant="h5" sx={{ mb: 1, color: "#fff", fontWeight: 800, fontSize: "1.8rem" }}>
            Delete Account
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "#ccc", fontSize: "1.3rem", lineHeight: 1.6 }}>
            Are you sure you want to delete your account? All your data will be permanently lost.
          </Typography>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button
              style={{
                flex: 1, minWidth: "120px", backgroundColor: "#e53935", color: "#fff",
                border: "none", borderRadius: "30px", padding: "14px 0",
                fontSize: "16px", fontWeight: 600, cursor: "pointer"
              }}
              onClick={() => {
                handleModalToggle('delete', false);
                handleDeleteAccount();
              }}
            >
              Delete
            </button>
            <button
              style={{
                flex: 1, minWidth: "120px", backgroundColor: "#8AC642", color: "#000",
                border: "none", borderRadius: "30px", padding: "14px 0",
                fontSize: "16px", fontWeight: 600, cursor: "pointer"
              }}
              onClick={() => handleModalToggle('delete', false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: THEME_COLOR.FADE_BACKGROUND,
          width: "35vw",
          maxWidth: "400px",
        },
      }}
    >
      <ToastContainer />
      <Box
        sx={{
          width: "100%",
          padding: 1,
          overflowX: "hidden",
          backgroundColor: THEME_COLOR.FADE_BACKGROUND,
        }}
        role="presentation"
      >
        {/* Header */}
        {profileState.update ? (
          <IconButton onClick={() => {
            fetchUserProfile();
            handleProfileStateChange('update', false);
          }}>
            <img src={backArrow} alt="Back" style={{ width: 24 }} />
          </IconButton>
        ) : (
          <div className="flex items-center justify-end px-4">
            <CloseIcon
              onClick={() => {
                onClose();
                handleProfileStateChange('update', false);
                setTimeout(() => navigate(returnPath), 150);
              }}
              style={{
                cursor: "pointer", color: "#fff", fontSize: "2rem",
                transition: "transform 0.2s ease, color 0.2s ease"
              }}
            />
          </div>
        )}

        {renderProfileHeader()}

        {!profileState.update ? (
          <Card
            className="main-container"
            style={{
              background: THEME_COLOR.FADE_BACKGROUND,
              color: THEME_COLOR.COLOR,
              marginTop: "20%",
            }}
          >
            {MENU_ITEMS.map(renderMenuItem)}
          </Card>
        ) : (
          renderUpdateForm()
        )}

        {renderDeleteModal()}
      </Box>
      {/* Sub-drawers */}
      <Family family={drawers.family} onfamilyclose={() => handleDrawerToggle('family', false)} />
      <Communication
        communication={drawers.communication}
        onCommunicationClose={() => handleDrawerToggle('communication', false)}
      />
      <ContactUs help={drawers.help} onHelpClose={() => handleDrawerToggle('help', false)} />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} minWidth >
        <DialogContent sx={{ borderBottom: "2px solid #8ac642", bgcolor: "#212121", fontWeight: 600 }}>
          <Typography variant="h5" align="" gutterBottom color={"white"}>
            Select Image Source<br></br>
            Choose how you want to update your profile picture.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            px: 3,
            pb: 3,
            bgcolor: "#212121"
          }}
        >
          {openCamera ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Camera Preview */}
              <video
                ref={videoRef}
                autoPlay
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "70vh",
                  borderRadius: "12px",
                  objectFit: "cover",
                }}
              />
              <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                <Typography
                  variant="h5"
                  align="end"
                  sx={{ cursor: "pointer", color: "error.main", width: "100%", fontWeight: 600 }}
                  onClick={() => setOpenDialog(false)}
                >Take Photo</Typography>
                <Typography
                  variant="h5"
                  align="end"
                  sx={{ cursor: "pointer", color: "error.main", width: "100%", fontWeight: 600 }}
                  onClick={() => setOpenCamera(false)}
                >Cancel</Typography>
              </div>
            </div>
          ) : (
            <>
              <Typography
                variant="h5"
                align="end"
                sx={{ cursor: "pointer", color: "white", width: "100%", fontWeight: 600 }}
                onClick={() => document.getElementById("profile-image-upload").click()}
              >Upload from Files</Typography>
              <Typography
                variant="h5"
                align="end"
                sx={{ cursor: "pointer", color: "white", width: "100%", fontWeight: 600 }}
                onClick={() => setOpenCamera(true)}
              >Take Photo</Typography>
              <Typography
                variant="h5"
                align="end"
                sx={{ cursor: "pointer", color: "error.main", width: "100%", fontWeight: 600 }}
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Typography>
            </>
          )}
        </DialogActions>
      </Dialog>
      <Dialog open={openCamera} onClose={() => setOpenCamera(false)} fullWidth maxWidth="sm">
        <IconButton
          aria-label="close"
          onClick={() => setOpenCamera(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
            bgcolor: "#212121",
            borderRadius: "50%",
            "&:hover": {
              bgcolor: "#333", // darker on hover
            },
          }}
        >
          <CloseIcon sx={{ fontSize: "2rem", fontWeight: 600 }} />
        </IconButton>

        <DialogContent sx={{ textAlign: "center", bgcolor: "#212121" }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: "100%", borderRadius: "8px" }}
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 2, bgcolor: "#212121" }}>
          <button
            className="ps-3 pe-3"
            variant="contained"
            onClick={handleCapture}
            style={{
              background: "#212121",
              color: "white",
              fontWeight: 900,
              borderRadius: "20px",
              border: "2px solid #8ac642",
              padding: "0.5rem"
            }}
          >
            📸 Take Photo
          </button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default ProfileDrawer;