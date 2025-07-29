import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Drawer, Box, Typography, IconButton } from "@mui/material";
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

const FORM_FIELDS = {
  username: { required: true, minLength: 3 },
  useremail: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/ },
  userPhone: { pattern: /^\d{10}$/ },
  pinCode: { pattern: /^\d{5,6}$/ },
  userDob: { validator: 'isOldEnough' }
};

// Custom hooks
const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const isOldEnough = useCallback((date) => {
    if (!date) return true;
    const today = new Date();
    const ageDiff = today.getFullYear() - date.getFullYear();
    const hasHadBirthdayThisYear = 
      today.getMonth() > date.getMonth() || 
      (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());
    return hasHadBirthdayThisYear ? ageDiff >= 18 : ageDiff - 1 >= 18;
  }, []);

  const validateField = useCallback((fieldName, value) => {
    const field = FORM_FIELDS[fieldName];
    if (!field) return true;

    if (field.required && (!value || !value.toString().trim())) {
      return false;
    }
    if (field.minLength && value.toString().trim().length < field.minLength) {
      return false;
    }
    if (field.pattern && value && !field.pattern.test(value)) {
      return false;
    }
    if (field.validator === 'isOldEnough') {
      return isOldEnough(value);
    }
    return true;
  }, [isOldEnough]);

  const validateAllFields = useCallback((formData) => {
    const newErrors = {};
    Object.keys(FORM_FIELDS).forEach(fieldName => {
      if (!validateField(fieldName, formData[fieldName])) {
        newErrors[fieldName] = true;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validateField]);

  return { errors, validateField, validateAllFields, setErrors };
};

const ProfileDrawer = ({ open, onClose, userName }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redux selectors
  const userbyId = useSelector(state => state.user);
  const states = useSelector(state => state.user);
  
  // Custom hooks
  const { errors, validateField, validateAllFields } = useFormValidation();
  
  // State management
  const [drawers, setDrawers] = useState({
    family: false,
    communication: false,
    help: false
  });
  
  const [modals, setModals] = useState({
    delete: false
  });
  
  const [profileState, setProfileState] = useState({
    update: false,
    profileImage: icDefaultProfile,
    showImageInput: false,
    profileCompletion: 0
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
    const requiredFields = ["userName", "userEmail", "userPhone", "userImg"];
    const completedFields = requiredFields.filter(field => {
      const value = data?.[field];
      return value !== undefined && value !== null && value !== "";
    }).length;
    return Math.floor((completedFields / requiredFields.length) * 100);
  }, []);

  const getUserId = useCallback(() => sessionStorage.getItem("userId"), []);

  // Event handlers
  const handleDrawerToggle = useCallback((drawerName, isOpen) => {
    setDrawers(prev => ({ ...prev, [drawerName]: isOpen }));
  }, []);

  const handleModalToggle = useCallback((modalName, isOpen) => {
    setModals(prev => ({ ...prev, [modalName]: isOpen }));
  }, []);

  const handleFormChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

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
      };
      reader.readAsDataURL(file);
    }
  }, [handleFormChange, handleProfileStateChange]);

  const handleUpdateProfile = useCallback(() => {
    if (!validateAllFields(formData)) return;

    const userId = getUserId();
    const formDataToSend = new FormData();
    
    formDataToSend.append("_id", userId);
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'userDob' && value) {
        try {
          const formattedDob = value.toLocaleDateString("en-GB").split("/").reverse().join("-");
          formDataToSend.append(key, formattedDob);
        } catch (e) {
          formDataToSend.append(key, null);
        }
      } else if (key === 'selectedStateId') {
        formDataToSend.append('state', value);
      } else if (key === 'selectedCityId') {
        formDataToSend.append('city', value);
      } else if (value !== null && value !== undefined) {
        formDataToSend.append(key, value);
      }
    });

    dispatch(updateUser(API_URL, formDataToSend)).then((res) => {
      if (res.status) {
        toast.success("Profile updated successfully!");
        handleProfileStateChange('update', false);
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    });
  }, [formData, validateAllFields, getUserId, dispatch, handleProfileStateChange]);

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

  const fetchUserProfile = useCallback(() => {
    const userId = getUserId();
    if (userId) {
      dispatch(getBYIDUsers(API_URL, userId));
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

  // Populate form data when user data is loaded
  useEffect(() => {
    if (userbyId.getUserById?.data) {
      const data = userbyId.getUserById.data;
      const percentage = calculateProfileCompletion(data);
      
      setFormData({
        username: data.userName || "",
        useremail: data.userEmail || "",
        userPhone: data.userPhone || "",
        userDob: data.userDob ? new Date(data.userDob.split("/").reverse().join("-")) : null,
        userAddress: data.userAddress || "",
        pinCode: data.pinCode || "",
        gender: data.gender || "",
        selectedStateId: data?.state?._id || "",
        selectedCityId: data?.city?._id || "",
        userImgFile: null
      });
      
      handleProfileStateChange('profileCompletion', percentage);
      handleProfileStateChange('profileImage', 
        data.userImg ? IMAGE_PATH + data.userImg : icDefaultProfile
      );
    }
  }, [userbyId, calculateProfileCompletion, handleFormChange, handleProfileStateChange]);

  // Render functions
  const renderProfileHeader = () => (
    <div className="main-container">
      <div className="background-image-container1">
        <div className="profile-details">
          <div className="profile-image-container">
            <img
              src={profileState.profileImage || icDefaultProfile}
              alt="Profile"
              className="profile-image"
            />
            {profileState.update && (
              <label htmlFor="profile-image-upload">
                <img
                  src={editIcon}
                  alt="Edit"
                  className="edit-icon"
                  onClick={() => handleProfileStateChange('showImageInput', true)}
                />
              </label>
            )}
            <input
              id="profile-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
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
        borderBottom: "0.5px solid #fff",
        marginBottom: "1.2rem",
        marginTop: "0.02rem",
      }}
    >
      <Grid item xs={2}>
        <img src={item.icon} style={{ maxHeight: "2.5rem" }} alt={item.label} />
      </Grid>
      <Grid item xs={8}>
        <span>{item.label}</span>
      </Grid>
    </Grid>
  );

  const renderFormField = (fieldConfig) => {
    const { type, field, label, placeholder, disabled, component: Component = CustomInput } = fieldConfig;
    
    return (
      <Grid item style={commonItemStyle}>
        <Component
          type={type}
          label={label}
          placeholder={placeholder}
          value={formData[field]}
          onChange={(e) => {
            const value = type === 'tel' ? e.target.value.replace(/\D/g, "").slice(0, 10) : e.target.value;
            handleFormChange(field, value);
          }}
          disabled={disabled}
          fullWidth
          inputStyle={commonInputStyle}
          validationMessage={errors[field] ? `Please enter a valid ${label.toLowerCase()}` : ""}
        />
      </Grid>
    );
  };

  const renderUpdateForm = () => (
    <div className="main-container p-4">
      <Grid container spacing={2} direction="column" alignItems="center">
        {/* Form fields */}
        {renderFormField({ field: 'username', label: 'Full Name', placeholder: 'Enter your name' })}
        {renderFormField({ field: 'userPhone', label: 'Mobile Number', placeholder: 'Enter your mobile number', type: 'tel', disabled: true })}
        {renderFormField({ field: 'useremail', label: 'Email Address', placeholder: 'Enter your email', type: 'email' })}
        
        {/* Date picker */}
        <Grid item style={commonItemStyle}>
          <label className="form-label text-light mb-2 d-block">Date of Birth</label>
          <GlobalDatePicker
            selectedDate={formData.userDob}
            handleDateChange={(date) => handleFormChange('userDob', date)}
            placeholder="Select your date of birth"
            error={errors.userDob}
            validationMessage="You must be at least 18 years old"
          />
        </Grid>

        {renderFormField({ field: 'userAddress', label: 'Address', placeholder: 'Enter your address' })}

        {/* Dropdowns */}
        <Grid item style={commonItemStyle}>
          <GlobalDropdown
            className={formData.selectedStateId === "" ? 'placeholder-selected' : 'custom-dark-dropdown'}
            onStateSelect={(stateId) => handleFormChange('selectedStateId', stateId)}
            initialValue={formData.selectedStateId}
            style={commonInputStyle}
          />
        </Grid>

        <Grid item style={commonItemStyle}>
          <CityDropdown
            label="City"
            className={formData.selectedCityId === "" ? 'placeholder-selected' : 'custom-dark-dropdown'}
            selectedStateId={formData.selectedStateId}
            onCitySelect={(cityId) => handleFormChange('selectedCityId', cityId)}
            initialValue={formData.selectedCityId}
            style={commonInputStyle}
          />
        </Grid>

        {renderFormField({ field: 'pinCode', label: 'Pincode', placeholder: 'Enter your pincode' })}

        {/* Gender */}
        <Grid item style={commonItemStyle}>
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
        </Grid>

        {/* Buttons */}
        <Grid item style={commonItemStyle}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                text="Update Profile"
                onClick={handleUpdateProfile}
                disabled={!formData.username || errors.userDob}
                bgcolor={!formData.username ? "#ccc" : "#8AC642"}
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
                onClick={() => handleProfileStateChange('update', false)}
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
            className="main-container p-6 mt-8"
            style={{
              background: THEME_COLOR.FADE_BACKGROUND,
              color: THEME_COLOR.COLOR,
              marginTop: "30px",
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
    </Drawer>
  );
};

export default ProfileDrawer;