import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Drawer, Box, Typography } from "@mui/material";
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
import CloseIcon from '@mui/icons-material/Close';

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
  const [isValidPinCode, setIsValidPinCode] = useState(true);
  const [valid, setValid] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const userbyId = useSelector((state) => state.user);
  const states = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [returnPath, setReturnPath] = useState("/");

  const LOCAL_STORAGE_KEYS = [
    "loggedIn",
    "verificationId",
    "userId",
    "policyId",
    "selectedPolicyId",
    "token",
  ];

  const calculateProfileCompletion = (data) => {
    const requiredFields = [
      "userName",
      "userEmail",
      "userPhone",
      "userImg"
    ];

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

  const handleStateSelect = (stateId) => {
    setSelectedStateId(stateId);
  };

  const handleCitySelect = (cityId) => {
    setSelectedCityId(cityId);
  };

  const isOldEnough = (dob) => {
    if (!dob) return false;

    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18;
  };

  const handleUpateProfile = () => {
    if (!isValidEmail || !valid || !isValidPinCode) {
      toast.error("Please correct the validation errors");
      return;
    }

    const formData = new FormData();
    formData.append("_id", sessionStorage.getItem("userId"));
    formData.append("userName", username);
    formData.append("userEmail", useremail);
    formData.append("userPhone", userPhone);

    if (userDob) {
      const formattedDob = userDob.toLocaleDateString('en-GB').split('/').reverse().join('-');
      formData.append("userDob", formattedDob);
    }

    formData.append("userAddress", userAddress);
    formData.append("state", selectedStateId);
    formData.append("city", selectedCityId);
    formData.append("pinCode", pinCode);
    formData.append("gender", gender);

    if (userImgFile) {
      formData.append("userImg", userImgFile);
    }

    if (!isOldEnough(userDob)) {
      toast.error("You must be at least 18 years old to register.");
      return;
    }

    dispatch(updateUser(API_URL, formData))
      .then(() => {
        toast.success("Profile updated successfully");
        setTimeout(() => {
          onClose();
          setUpdate(false);
        }, 1000);
      })
      .catch(() => {
        toast.error("Error updating profile");
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

  const handlePinCodeChange = (e) => {
    const pin = e.target.value.replace(/\D/g, "").slice(0, 6);
    setpinCode(pin);
    setIsValidPinCode(/^\d{5,6}$/.test(pin));
  };

  const handleEmailChange = (e) => {
    const emailId = e.target.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validEmail = emailRegex.test(emailId) &&
      emailId.split("@").length === 2 &&
      emailId.split("@")[1].split(".").length <= 3;
    setuserEmail(emailId);
    setIsValidEmail(validEmail);
  };

  const handlephonechange = (e) => {
    const number = e.target.value.replace(/\D/g, "").slice(0, 10);
    setuserPhone(number);
    setValid(/^\d{10}$/.test(number.replace("+91", "")));
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
          padding: 0,
          overflowX: "hidden",
          backgroundColor: THEME_COLOR.FADE_BACKGROUND,
        }}
        role="presentation"
      >
        <div className="flex items-center justify-end px-4 py-2">
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
              transition: "transform 0.2s ease, color 0.2s ease"
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
        </div>


        <div className="main-container">
          <div className="background-image-container1" style={{ height: "30vh", padding: "0 2rem" }}>
            <div className="profile-details">
              <div className="profile-image-container">
                <img src={profileImage} alt="Profile" className="profile-image" />
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
                {username}
              </h2>
              <p className="register-text text-center">{useremail}</p>

              {!update && (
                <div className="flex justify-center mt-3">
                  <Button
                    text={"Edit Profile"}
                    size="lg"
                    onClick={() => setUpdate(true)}
                    customStyle={{
                      width: "100%",
                      height: "5vh",
                      borderRadius: "3rem",
                      fontSize: "1rem",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {!update ? (
          <Card
            className="main-container m-3 p-4 my-4"
            style={{
              background: THEME_COLOR.FADE_BACKGROUND,
              color: THEME_COLOR.COLOR,
            }}
          >
            {[
              { label: "Family Member", icon: family, onClick: handleFamilyOpen },
              { label: "Communication Preferences", icon: communication, onClick: handleCommunicationOpen },
              { label: "Contact Us", icon: help, onClick: handleHelpOpen },
              { label: "About", icon: about, onClick: handleAboutOpen },
              { label: "Logout", icon: logout, onClick: handleLogout },
              { label: "Delete Account", icon: logout, onClick: () => setShowDeleteModal(true) },
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
                  marginBottom: "1rem",
                }}
              >
                <Grid item xs={2}>
                  <img src={item.icon} style={{ maxHeight: "2.5rem" }} alt={item.label} />
                </Grid>
                <Grid item xs={8}>
                  <span>{item.label}</span>
                </Grid>
                <Grid item xs={2}>
                  <img src={rightArrow} style={{ maxHeight: "2rem" }} alt="arrow" />
                </Grid>
              </Grid>
            ))}
          </Card>
        ) : (
          <div className="main-container mt-3 p-4">
            <Grid container spacing={2}>
              {/* Name */}
              <Grid item xs={12} md={6}>
                <CustomInput
                  label="Name"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setuserName(e.target.value)}
                  required
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} md={6}>
                <CustomInput
                  type="email"
                  label="Email Address"
                  value={useremail}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  error={!isValidEmail}
                  helperText={!isValidEmail ? "Please enter a valid email address" : ""}
                  required
                />
              </Grid>

              {/* Mobile Number */}
              <Grid item xs={12} md={6}>
                <CustomInput
                  type="tel"
                  label="Mobile Number"
                  value={userPhone}
                  onChange={handlephonechange}
                  placeholder="Enter your mobile number"
                  error={!valid}
                  helperText={!valid ? "Please enter a valid 10-digit mobile number" : ""}
                  required
                />
              </Grid>

              {/* DOB */}
              <Grid item xs={12} md={6}>
                <div style={{ height: "48px" }}>
                  <GlobalDatePicker
                    label="DOB"
                    selectedDate={userDob}
                    handleDateChange={handleDobChange}
                    className="custom-picker form-control rounded-5"
                    placeholder="Select Date"
                    width="100%"
                  />
                </div>
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <CustomInput
                  label="Address"
                  placeholder="Enter your Address"
                  value={userAddress}
                  onChange={(e) => setuserAddress(e.target.value)}
                />
              </Grid>

              {/* State Dropdown */}
              <Grid item xs={12} md={6}>
                <GlobalDropdown
                  onStateSelect={handleStateSelect}
                  initialValue={selectedStateId}
                />
              </Grid>

              {/* City Dropdown */}
              <Grid item xs={12} md={6}>
                <CityDropdown
                  selectedStateId={selectedStateId}
                  onCitySelect={handleCitySelect}
                  initialValue={selectedCityId}
                />
              </Grid>

              {/* Pincode */}
              <Grid item xs={12} md={6}>
                <CustomInput
                  label="Pincode"
                  placeholder="Enter your PinCode"
                  value={pinCode}
                  onChange={handlePinCodeChange}
                  error={!isValidPinCode}
                  helperText={
                    !isValidPinCode ? "Please enter a valid pin code (5 or 6 digits)" : ""
                  }
                />
              </Grid>

              {/* Gender */}
              <Grid item xs={12} md={6}>
                <label
                  className="form-label fw-bold text-light mb-2 block"
                  htmlFor="gender"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  className="dropdown-select w-full bg-dark text-light border rounded-lg py-2 px-4"
                  value={gender}
                  onChange={(e) => setgender(e.target.value)}
                >
                  <option disabled value="">Select Your Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </Grid>

              {/* Buttons - Side by Side on Desktop, Stacked on Mobile */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Button
                      size="sm"
                      text="Update"
                      onClick={handleUpateProfile}
                      disabled={!isValidEmail || !valid || !isValidPinCode}
                      bgcolor={(!isValidEmail || !valid || !isValidPinCode) ? "#d3d3d3" : "#8AC642"}
                      customStyle={{
                        width: "100%",
                        height: "6vh",
                        borderRadius: "3rem",
                        fontSize: "1rem",
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Button
                      size="sm"
                      text="Cancel"
                      onClick={() => setUpdate(false)}
                      customStyle={{
                        width: "100%",
                        height: "6vh",
                        borderRadius: "3rem",
                        fontSize: "1rem",
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
              background: "rgba(0,0,0,0.5)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "#212121",
                borderRadius: "1rem",
                padding: "2rem",
                minWidth: "300px",
                textAlign: "center",
              }}
            >
              <Typography variant="h6" style={{ marginBottom: "1rem", color: "#fff" }}>
                Are you sure you want to delete your account?
              </Typography>
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                <Button
                  text="Yes, Delete"
                  bgcolor="#e53935"
                  onClick={() => {
                    setShowDeleteModal(false);
                    handleDeleteAccount();
                  }}
                />
                <Button
                  text="Cancel"
                  bgcolor="#8AC642"
                  onClick={() => setShowDeleteModal(false)}
                />
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