import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Drawer, Box, Typography, IconButton } from "@mui/material";
import Button from "../component/Button";
import CustomInput from "../component/CustomInput";
import icDefaultProfile from "../Images/ic_default_profile.png";
import editIcon from "../Images/edit-icon.png";
import { getBYIDUsers, updateUser } from "../store/action/action";
import API_URL from "../ServiceModule/Service";
import IMAGE_PATH from "../ServiceModule/imagePath";
import { getAllState, deleteAccount } from "../store/action/action";
import GlobalDropdown from "./StateDropdown";
import { Card, Grid } from "@material-ui/core";
import family from "../Images/ic_family_member.png";
import about from "../Images/ic_about.png";
import communication from "../Images/ic_communication_pref.png";
import help from "../Images/ic_help.png";
import logout from "../Images/ic_logout.png";
import rightArrow from "../Images/Symbol.png";
import Family from "../profile/Family";
import Communication from "../profile/Communication";
import { useNavigate } from "react-router-dom";
import CityDropdown from "./CityDropdown";
import GlobalDatePicker from "./GlobalDatePicker";
import { toast, ToastContainer } from "react-toastify";
import { THEME_COLOR } from "../constants";
import ContactUs from "../profile/ContactUs";
import CloseIcon from "@mui/icons-material/Close";
import { BorderColor, Padding } from "@mui/icons-material";
import backArrow from "../Images/ic_back_button.png";
import { capitalizeFirstLetter } from "../utils/helpers";
import { color } from "framer-motion";

const ProfileDrawer = ({ open, onClose, userName }) => {
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [communicationDrawerOpen, setCommunicationDrawerOpen] = useState(false);
  const [helpDrawerOpen, setHelpDrawerOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(icDefaultProfile);
  const [showImageInput, setShowImageInput] = useState(false);
  const [username, setuserName] = useState("");
  const [useremail, setuserEmail] = useState("");
  const [userDob, setuserDob] = useState(null);
  const [userAddress, setuserAddress] = useState("");
  const [state, setstate] = useState("");
  const [city, setCity] = useState("");
  const [userPhone, setuserPhone] = useState("");
  const [pinCode, setpinCode] = useState("");
  const [gender, setgender] = useState("");
  const [userImgFile, setuserImgFile] = useState(null);
  const [update, setUpdate] = useState(false);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [valid, setValid] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

  const [nameError, setNameError] = useState("");
  const [isValidName, setIsValidName] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPhone, setIsValidPhone] = useState(true);
  const [isValidPinCode, setIsValidPinCode] = useState(true);
  const [isValidDob, setIsValidDob] = useState(true);

  const userbyId = useSelector((state) => state.user);
  const states = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [returnPath, setReturnPath] = useState("/");
  const commonItemStyle = {
    maxWidth: 900,
    width: "100%",
    paddingLeft: "10px !important",
  };

  
  const commonInputStyle = {
    height: 48,
    fontSize: "1.222rem",
    borderRadius: 42,
    paddingLeft: "20px",
    width: "100%",
    color: "#fff",
  };

  const LOCAL_STORAGE_KEYS = [
    "loggedIn",
    "verificationId",
    "userId",
    "policyId",
    "selectedPolicyId",
    "token",
  ];

  const calculateProfileCompletion = (data) => {
    const requiredFields = ["userName", "userEmail", "userPhone", "userImg"];

    const totalFields = requiredFields.length;
    let completedFields = 0;

    requiredFields.forEach((field) => {
      const value = data?.[field];
      if (value !== undefined && value !== null && value !== "") {
        completedFields++;
      }
    });

    return Math.floor((completedFields / totalFields) * 100);
  };
  useEffect(() => {
    setUpdate(false);
  }, []);

  useEffect(() => {
    dispatch(getAllState(API_URL));
  }, [dispatch]);

  useEffect(() => {
    if (states?.getAllState?.data) {
      setstate(states.getAllState.data);
    }
  }, [states]);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
      dispatch(getBYIDUsers(API_URL, userId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (open) {
      setReturnPath(location.pathname);
    }
  }, [open, location.pathname]);

  useEffect(() => {
    if (userbyId.getUserById?.data) {
      const data = userbyId.getUserById.data;
      const percentage = calculateProfileCompletion(data);
      setProfileCompletion(percentage);

      setuserName(data.userName || "");
      setuserEmail(data.userEmail || "");
      setuserPhone(data.userPhone || "");

      if (data.userDob) {
        setuserDob(new Date(data.userDob.split("/").reverse().join("-")));
      }

      setuserAddress(data.userAddress || "");

      const stateId = data?.state?._id || "";
      const cityId = data?.city?._id || "";

      setstate(stateId);
      setSelectedStateId(stateId);
      setCity(cityId);
      setSelectedCityId(cityId);

      setpinCode(data.pinCode || "");
      setgender(data.gender || "");

      setProfileImage(
        data.userImg ? IMAGE_PATH + data.userImg : icDefaultProfile
      );
    }
  }, [userbyId]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setuserName(value);

    if (!value.trim()) {
      setNameError("Full name is required");
    } else if (value.trim().length < 3) {
      setNameError("Full name must be at least 3 characters");
    } else {
      setNameError("");
    }
  };

  const handleStateSelect = (stateId) => {
    setSelectedStateId(stateId);
  };

  const handleCitySelect = (cityId) => {
    setSelectedCityId(cityId);
  };

  const isOldEnough = (date) => {
    if (!date) return false;

    const today = new Date();
    const ageDiff = today.getFullYear() - date.getFullYear();

    // Account for month/day
    const hasHadBirthdayThisYear =
      today.getMonth() > date.getMonth() ||
      (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());

    const actualAge = hasHadBirthdayThisYear ? ageDiff : ageDiff - 1;

    return actualAge >= 18;
  };


  const handleUpateProfile = () => {
    const nameValid = username.trim().length >= 3;
    setIsValidName(nameValid);

    const emailValid =
      !useremail || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(useremail);
    setIsValidEmail(emailValid);

    const phoneValid = !userPhone || /^\d{10}$/.test(userPhone);
    setIsValidPhone(phoneValid);

    const pinValid = !pinCode || /^\d{5,6}$/.test(pinCode);
    setIsValidPinCode(pinValid);

    const dobValid = userDob || isOldEnough(userDob);
    setIsValidDob(dobValid);

    if (!nameValid) {
      return;
    }

    const formData = new FormData();
    formData.append("_id", sessionStorage.getItem("userId"));
    formData.append("userName", username);
    if (useremail) formData.append("userEmail", useremail);
    if (userPhone) formData.append("userPhone", userPhone);
    if (userDob) {
      const formattedDob = userDob.toLocaleDateString("en-GB").split("/").reverse().join("-");
      formData.append("userDob", formattedDob);
    }
    formData.append("userAddress", userAddress);
    formData.append("state", selectedStateId);
    formData.append("city", selectedCityId);
    if (pinCode) formData.append("pinCode", pinCode);
    formData.append("gender", gender);
    if (userImgFile) formData.append("userImg", userImgFile);

    dispatch(updateUser(API_URL, formData)).then(() => {
      setUpdate(false);
      onClose();
    });
  };



  const handleDeleteAccount = () => {
    const userId = sessionStorage.getItem("userId");
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
  };



  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setuserImgFile(file);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleDobChange = (date) => {
    setuserDob(date);
  };

  const handleFamilyOpen = () => setDrawerOpen(true);
  const handleFamilyClose = () => setDrawerOpen(false);
  const handleCommunicationOpen = () => setCommunicationDrawerOpen(true);
  const handleCommunicationclose = () => setCommunicationDrawerOpen(false);
  const handleHelpOpen = () => navigate("/contactus");
  const handleHelpclose = () => setHelpDrawerOpen(false);
  const handleAboutOpen = () => {
    onClose();
    navigate("/about");
  };
  const handleLogout = () => {
    LOCAL_STORAGE_KEYS.forEach((key) => sessionStorage.removeItem(key));
    navigate("/");
    setTimeout(() => window.location.reload(), 100);
  };

  const fetchUserProfile = () => {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
      dispatch(getBYIDUsers(API_URL, userId));
    }
  }

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
        {update ? (<>
          <IconButton
            onClick={() => {
              fetchUserProfile();
              setUpdate(false);
            }}
          >
            <img src={backArrow} alt="Back" style={{ width: 24 }} />
          </IconButton>
        </>) : (
          <div className="flex items-center justify-end px-4">
            <CloseIcon
              onClick={() => {
                onClose();
                setUpdate(false);
                setTimeout(() => navigate(returnPath), 150);
              }}
              style={{
                cursor: "pointer",
                color: "#fff",
                fontSize: "2rem",
                transition: "transform 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.2)";
                e.target.style.color = "#8AC642";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.color = "#fff";
              }}
            />
          </div>)}

        <div className="main-container">
          <div
            className="background-image-container1"
          >
            <div className="profile-details">
              <div className="profile-image-container">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="profile-image"
                />
                {update && (
                  <label htmlFor="profile-image-upload">
                    <img
                      src={editIcon}
                      alt="Edit"
                      className="edit-icon"
                      onClick={() => setShowImageInput(true)}
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
                {capitalizeFirstLetter(username)}
              </h2>
              {useremail && <p className="register-text text-center">{useremail}</p>}

              {!update && (
                <div className="flex justify-center mt-4 mb-8">
                  <Button
                    text={"Edit Profile"}
                    size="lg"
                    onClick={() => setUpdate(true)}
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

        {!update ? (
          <Card
            className="main-container p-6 mt-4"
            style={{
              background: THEME_COLOR.FADE_BACKGROUND,
              color: THEME_COLOR.COLOR,
              marginTop: "30px",
            }}
          >
            {[
              {
                label: "Family Member",
                icon: family,
                onClick: handleFamilyOpen,
              },
              {
                label: "Communication Preferences",
                icon: communication,
                onClick: handleCommunicationOpen,
              },
              { label: "Contact Us", icon: help, onClick: handleHelpOpen },
              { label: "About", icon: about, onClick: handleAboutOpen },
              { label: "Logout", icon: logout, onClick: handleLogout },
              {
                label: "Delete Account",
                icon: logout,
                onClick: () => setShowDeleteModal(true),
              },
            ].map((item, idx) => (
              <Grid
                container
                spacing={2}
                alignItems="center"
                key={idx}
                onClick={item.onClick}
                style={{
                  cursor: "pointer",
                  borderBottom: "0.5px solid #fff",
                  marginBottom: "1.2rem",
                  marginTop: "0.02rem",
                }}
              >
                <Grid item xs={2}>
                  <img
                    src={item.icon}
                    style={{ maxHeight: "2.5rem" }}
                    alt={item.label}
                  />
                </Grid>
                <Grid item xs={8}>
                  <span>{item.label}</span>
                </Grid>
                {/* <Grid item xs={2}>
                  <img
                    src={rightArrow}
                    style={{ maxHeight: "2rem" }}
                    alt="arrow"
                  />
                </Grid> */}
              </Grid>
            ))}
          </Card>
        ) : (
          <div className="main-container p-4">
            <Grid container spacing={2} direction="column" alignItems="center">
              {/* Full Name */}
              <Grid item style={commonItemStyle}>
                <CustomInput
                  label="Full Name"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => {
                    const val = e.target.value;
                    setuserName(val);
                    setIsValidName(val.trim().length >= 3);
                  }}
                  required
                  fullWidth
                  inputStyle={commonInputStyle}
                  validationMessage={
                    !isValidName ? "Full name must be at least 3 characters" : ""
                  }
                />

              </Grid>
                {/* Phone */}
              <Grid item style={commonItemStyle}>
                <CustomInput
                  type="tel"
                  label="Mobile Number"
                  placeholder="Enter your mobile number"
                  value={userPhone}
                  fullWidth
                  inputStyle={commonInputStyle}
                  disabled
                  required
                />


              </Grid>
              {/* Email */}
              <Grid item style={commonItemStyle}>
                <CustomInput
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  value={useremail}
                  onChange={(e) => {
                    const val = e.target.value;
                    setuserEmail(val);
                    const valid =
                      !val || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
                    setIsValidEmail(valid);
                  }}
                  fullWidth
                  inputStyle={commonInputStyle}
                  validationMessage={
                    useremail && !isValidEmail ? "Please enter a valid email" : ""
                  }
                />

              </Grid>

             

              <Grid item style={commonItemStyle}>
                <label
                  htmlFor="dob"
                  className="form-label text-light mb-2 d-block"
                >
                  Date of Birth
                </label>
                  <GlobalDatePicker
                    selectedDate={userDob}
                    handleDateChange={(date) => {
                      setuserDob(date);
                      setIsValidDob(date ? isOldEnough(date) : false);
                    }}
                    placeholder="Select your date of birth"
                    error={!isValidDob}
                    validationMessage="You must be at least 18 years old"
                  />

              </Grid>


              {/* Address */}
              <Grid item style={commonItemStyle}>
                <CustomInput
                  label="Address"
                  placeholder="Enter your address"
                  value={userAddress}
                  onChange={(e) => setuserAddress(e.target.value)}
                  fullWidth
                  inputStyle={commonInputStyle}
                />
              </Grid>

              {/* State */}
              <Grid item style={commonItemStyle}>
                <GlobalDropdown
                                    className={` ${selectedStateId === ""? 'placeholder-selected !important' : 'custom-dark-dropdown'}`}

                  onStateSelect={handleStateSelect}
                  initialValue={selectedStateId}
                  style={{ ...commonInputStyle, width: "100%" }}
                />
              </Grid>

              {/* City */}
              <Grid item style={commonItemStyle}>
                <CityDropdown
                  label="City"
                    className={` ${selectedCityId === ""? 'placeholder-selected' : 'custom-dark-dropdown'}`}
                  selectedStateId={selectedStateId}
                  onCitySelect={handleCitySelect}
                  initialValue={selectedCityId}
                  style={{ ...commonInputStyle, width: "100%" }}
                />
              </Grid>

              {/* Pincode */}
              <Grid item style={commonItemStyle}>
                <CustomInput
                  label="Pincode"
                  placeholder="Enter your pincode"
                  value={pinCode}
                  onChange={(e) => {
                    const pin = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setpinCode(pin);
                    setIsValidPinCode(!pin || /^\d{5,6}$/.test(pin));
                  }}
                  fullWidth
                  inputStyle={commonInputStyle}
                  validationMessage={
                    pinCode && !isValidPinCode
                      ? "Please enter a valid pin code (5 or 6 digits)"
                      : ""
                  }
                />

              </Grid>

              {/* Gender */}
              <Grid item style={commonItemStyle}>
                <label
                  htmlFor="gender"
                  className="form-label fw-bold text-light mb-2 d-block"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setgender(e.target.value)}
  className={` ${gender === ''? 'placeholder-selected' : 'custom-dark-dropdown'}`}
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
                  <Grid item xs={12}>
                    <Button
                      text="Update Profile"
                      onClick={handleUpateProfile}
                      disabled={
                        !username
                      }
                      bgcolor={
                        !username
                          ? "#ccc"
                          : "#8AC642"
                      }
                      customStyle={{
                        width: "100%",
                        height: 48,
                        borderRadius: 24,
                        fontSize: "1.4rem",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      text="Cancel"
                      onClick={() => setUpdate(false)}
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
        )}

        {showDeleteModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0, 0, 0, 0.6)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "#1c1c1c",
                borderRadius: "16px",
                padding: "2rem",
                maxWidth: "500px",
                width: "100%",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 1,
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "1.8rem",
                }}
              >
                Delete Account
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  color: "#ccc",
                  fontSize: "1.3rem",
                  lineHeight: 1.6,
                }}
              >
                Are you sure you want to delete your account? All your data will be permanently lost.

              </Typography>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: "1rem",
                  justifyContent: "center",
                }}
              >
                <button
                  style={{
                    flex: 1,
                    minWidth: "120px",
                    backgroundColor: "#e53935",
                    color: "#fff",
                    border: "none",
                    borderRadius: "30px",
                    padding: "14px 0",
                    fontSize: "16px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background 0.3s",
                  }}
                  onClick={() => {
                    setShowDeleteModal(false);
                    handleDeleteAccount();
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#d32f2f")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "#e53935")}
                >
                  Delete
                </button>

                <button
                  style={{
                    flex: 1,
                    minWidth: "120px",
                    backgroundColor: "#8AC642",
                    color: "#000",
                    border: "none",
                    borderRadius: "30px",
                    padding: "14px 0",
                    fontSize: "16px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background 0.3s",
                  }}
                  onClick={() => setShowDeleteModal(false)}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#7ab634")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "#8AC642")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </Box>
      <Family family={drawerOpen} onfamilyclose={handleFamilyClose} />
      <Communication
        communication={communicationDrawerOpen}
        onCommunicationClose={handleCommunicationclose}
      />
      <ContactUs help={helpDrawerOpen} onHelpClose={handleHelpclose} />
    </Drawer>
  );
};

export default ProfileDrawer;
