import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Drawer, Box, Typography, TextField } from "@mui/material";
import Button from "../component/Button";
import CustomInput from "../component/CustomInput";
import icProfileBg from "../Images/ic_profile_bg.png";
import icDefaultProfile from "../Images/ic_default_profile.png";
import editIcon from "../Images/edit-icon.png";
import { getBYIDUsers, updateUser } from "../store/action/action";
import API_URL from "../ServiceModule/Service";
import IMAGE_PATH from "../ServiceModule/imagePath";
import { getAllState } from "../store/action/action";
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
  const [aboutDrawerOpen, setAboutDrawerOpen] = useState(false);
  const [helpDrawerOpen, setHelpDrawerOpen] = useState(false);
  const userEmail = sessionStorage.getItem("userEmail");
  const [profileImage, setProfileImage] = useState(icDefaultProfile);
  const [showImageInput, setShowImageInput] = useState(false);
  const [username, setuserName] = useState();
  const [useremail, setuserEmail] = useState();
  const [userDob, setuserDob] = useState();
  const [userAddress, setuserAddress] = useState();
  const [state, setstate] = useState("");
  const [city, setCity] = useState("");
  const [userPhone, setuserPhone] = useState();
  const [pinCode, setpinCode] = useState();
  const [gender, setgender] = useState();
  const [userImgFile, setuserImgFile] = useState(null);
  const userbyId = useSelector((state) => state.user);
  const states = useSelector((state) => state.user);
  const [update, setUpdate] = useState(false);
  const navigate = useNavigate();
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [isValidPinCode, setIsValidPinCode] = useState(true);
  const [valid, setValid] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const location = useLocation();
  const [returnPath, setReturnPath] = useState("/");

  // Reset edit mode when drawer closes
  useEffect(() => {
    if (!open) {
      setUpdate(false);
    }
  }, [open]);

  const handleCitySelect = (cityId) => {
    setSelectedCityId(cityId);
  };

  const calculateProfileCompletion = (data) => {
    const requiredFields = [
      "userName",
      "userEmail",
      "userPhone",
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

  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    if (userbyId.getUserById && userbyId.getUserById.data) {
      const data = userbyId.getUserById.data;
      const percentage = calculateProfileCompletion(data);
      setProfileCompletion(percentage);
    }
  }, [userbyId]);

  useEffect(() => {
    dispatch(getAllState(API_URL));
  }, [dispatch]);

  const LOCAL_STORAGE_KEYS = [
    "loggedIn",
    "verificationId",
    "userId",
    "policyId",
    "selectedPolicyId",
    "token",
  ];

  useEffect(() => {
    if (states !== null && states !== undefined) {
      if (states.getAllState !== null && states.getAllState !== undefined) {
        if (
          states.getAllState.data !== null &&
          states.getAllState.data !== undefined
        ) {
          setstate(states.getAllState.data);
        }
      }
    }
  }, [states]);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    dispatch(getBYIDUsers(API_URL, userId));
  }, [dispatch]);

  useEffect(() => {
    if (open) {
      setReturnPath(location.pathname);
    }
  }, [open, location.pathname]);

  // Helper function to parse date safely
  const parseDate = (dateString) => {
    if (!dateString) return null;
    
    try {
      // If it's already a valid date string, try to parse it directly
      let parsedDate = new Date(dateString);
      
      // If that fails, try parsing DD/MM/YYYY format
      if (isNaN(parsedDate.getTime()) && typeof dateString === 'string') {
        const parts = dateString.split('/');
        if (parts.length === 3) {
          // Assuming DD/MM/YYYY format, convert to MM/DD/YYYY for proper parsing
          const [day, month, year] = parts;
          parsedDate = new Date(`${month}/${day}/${year}`);
        }
      }
      
      // Return the date only if it's valid
      return !isNaN(parsedDate.getTime()) ? parsedDate : null;
    } catch (error) {
      console.error('Error parsing date:', error);
      return null;
    }
  };

  useEffect(() => {
    if (userbyId.getUserById && userbyId.getUserById.data) {
      const data = userbyId.getUserById.data;

      setuserName(data.userName || "");
      setuserEmail(data.userEmail || "");
      setuserPhone(data.userPhone || "");
      
      // Safe date parsing
      const parsedDob = parseDate(data.userDob);
      setuserDob(parsedDob);
      
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

  const isOldEnough = (dob) => {
    // Check if date is valid
    if (!dob || isNaN(dob.getTime())) {
      return false;
    }
    
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 18;
  };

  function handleUpateProfile() {
    const formData = new FormData();

    // Format date for submission
    const formatDateForSubmission = (date) => {
      if (!date || isNaN(date.getTime())) return "";
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    };

    formData.append("_id", sessionStorage.getItem("userId"));
    formData.append("userName", username || "");
    formData.append("userEmail", useremail || "");
    formData.append("userPhone", userPhone || "");
    formData.append("userDob", formatDateForSubmission(userDob));
    formData.append("userAddress", userAddress || "");
    formData.append("state", selectedStateId || "");
    formData.append("city", selectedCityId || "");
    formData.append("pinCode", pinCode || "");
    formData.append("gender", gender || "");
    if (userImgFile) {
      formData.append("userImg", userImgFile);
    }

    if (
      username &&
      useremail &&
      userPhone &&
      userDob &&
      userAddress &&
      selectedStateId &&
      selectedCityId &&
      pinCode &&
      gender
    ) {
      if (!isOldEnough(userDob)) {
        toast.error("You must be at least 18 years old to register.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      dispatch(updateUser(API_URL, formData));
      toast.success("Updated successfully");
      setTimeout(() => {
        setUpdate(false);
        onClose();
      }, 1000);
    } else {
      toast.error("Please fill all required fields!");
    }
  }

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

  const toggleImageInput = () => {
    setShowImageInput(!showImageInput);
  };

  const handleEdit = () => {
    setUpdate(!update);
  };

  const handleFamilyClose = () => {
    setDrawerOpen(false);
  };
  const handleCommunicationclose = () => {
    setCommunicationDrawerOpen(false);
  };
  const handleHelpclose = () => {
    setHelpDrawerOpen(false);
  };
  const handleAboutClose = () => {
    setAboutDrawerOpen(false);
  };
  const handleFamilyOpen = () => {
    setDrawerOpen(true);
  };
  const handleCommunicationOpen = () => {
    setCommunicationDrawerOpen(true);
  };
  const handleAboutOpen = () => {
    onClose();
    navigate("/about");
  };
  const handleHelpOpen = () => {
    navigate("/contactus");
  };
  const handleLogout = () => {
    LOCAL_STORAGE_KEYS.forEach((key) => sessionStorage.removeItem(key));
    navigate("/");
    setTimeout(() => window.location.reload(), 100);
  };

  const handlePinCodeChange = (e) => {
    let pin = e.target.value.replace(/\D/g, "");
    pin = pin.slice(0, 6);
    setpinCode(pin);
    const isValidPin = /^\d{5,6}$/.test(pin);
    setIsValidPinCode(isValidPin);
  };

  const handleEmailChange = (e) => {
    const emailId = e.target.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validEmail =
      emailRegex.test(emailId) &&
      emailId.split("@").length === 2 &&
      emailId.split("@")[1].split(".").length <= 3;
    setuserEmail(emailId);
    setIsValidEmail(validEmail);
  };

  const handlephonechange = (e) => {
    let number = e.target.value.replace(/\D/g, "");
    number = number.slice(0, 10);
    setuserPhone(number);
    const isValid = /^\d{10}$/.test(number.replace("+91", ""));
    setValid(isValid);
  };

  const handleDobChange = (date) => {
    setuserDob(date);
  };

  const handleCloseDrawer = () => {
    setUpdate(false); // Reset edit mode when closing
    onClose();
    setTimeout(() => {
      navigate(returnPath);
    }, 100);
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
        <div className="flex items-center px-4 py-2">
          <CloseIcon
            style={{ cursor: "pointer", color: "#fff", fontSize: "2rem" }}
            onClick={handleCloseDrawer}
          />
        </div>
        <div className="main-container">
          {/* Profile Header Section */}
          <div
            className="background-image-container1"
            style={{ height: "30vh", padding: "0 2rem" }}
          >
            <div className="profile-details">
              <div className="profile-image-container bg-red-600">
                <img src={profileImage} alt="Profile" className="profile-image" />
                {update && (
                  <label htmlFor="profile-image-upload">
                    <img
                      src={editIcon}
                      alt="Edit"
                      className="edit-icon"
                      onClick={toggleImageInput}
                    />
                  </label>
                )}
                {showImageInput && (
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                )}
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
                    onClick={handleEdit}
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

        {/* Profile Options */}
        {!update ? (
          <Card
            className="main-container m-3 p-4 my-4"
            style={{
              background: THEME_COLOR.FADE_BACKGROUND,
              color: THEME_COLOR.COLOR,
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
              {
                label: "Contact Us",
                icon: help,
                onClick: handleHelpOpen,
              },
              {
                label: "About",
                icon: about,
                onClick: handleAboutOpen,
              },
              {
                label: "Logout",
                icon: logout,
                onClick: handleLogout,
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
                  marginBottom: "1rem",
                }}
              >
                <Grid item xs={2}>
                  <img src={item.icon} style={{ maxHeight: "2.5rem" }} />
                </Grid>
                <Grid item xs={8}>
                  <span>{item.label}</span>
                </Grid>
                <Grid item xs={2}>
                  <img src={rightArrow} style={{ maxHeight: "2rem" }} />
                </Grid>
              </Grid>
            ))}
          </Card>
        ) : (
          // Edit Mode
          <div className="main-container mt-3 p-4">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomInput
                  label="Name"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setuserName(e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <CustomInput
                  type="email"
                  label="Email Address"
                  value={useremail}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  className={!isValidEmail ? "is-invalid" : ""}
                  validationMessage={
                    !isValidEmail
                      ? "Please enter a valid email address containing @."
                      : ""
                  }
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <CustomInput
                  type="text"
                  label="Mobile Number"
                  value={userPhone}
                  onChange={handlephonechange}
                  placeholder="Enter your mobile number"
                  className={!valid ? "is-invalid" : ""}
                  validationMessage={
                    !valid
                      ? "Please enter a valid 10-digit mobile number."
                      : ""
                  }
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <GlobalDatePicker
                  label="DOB"
                  selectedDate={userDob}
                  handleDateChange={handleDobChange}
                  className="custom-picker form-control rounded-5 p-5"
                  placeholder="Select Date"
                  style={{ width: "100%", height: "50px", marginTop: "5px" }}
                  maxDate={new Date()} 
                />
              </Grid>

              <Grid item xs={12}>
                <CustomInput
                  label="Address"
                  placeholder="Enter your Address"
                  value={userAddress}
                  onChange={(e) => setuserAddress(e.target.value)}
                />
              </Grid>

              <Grid item xs={6}>
                <GlobalDropdown
                  onStateSelect={handleStateSelect}
                  initialValue={state}
                />
              </Grid>

              <Grid item xs={6}>
                <CityDropdown
                  selectedStateId={selectedStateId}
                  onCitySelect={handleCitySelect}
                  initialValue={city}
                />
              </Grid>

              <Grid item xs={6}>
                <CustomInput
                  label="Pincode"
                  placeholder="Enter your PinCode"
                  value={pinCode}
                  onChange={handlePinCodeChange}
                  className={!isValidPinCode ? "is-invalid" : ""}
                  validationMessage={
                    !isValidPinCode
                      ? "Please enter a valid pin code (5 or 6 digits)."
                      : ""
                  }
                />
              </Grid>

              <Grid item xs={6}>
                <label
                  className="form-label fw-bold text-light"
                  htmlFor="gender"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  className="dropdown-select w-full bg-dark text-light border rounded-lg py-2 px-4"
                  value={gender}
                  onChange={(e) => setgender(e.target.value)}
                  style={{
                    width: "100%",
                    height: "45px",
                    marginTop: "5px"
                  }}
                >
                  <option disabled value="">
                    Select Your Gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </Grid>
            </Grid>

            {/* Action Buttons - Side by Side */}
            <div className="w-full mt-6">
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    size="sm"
                    text="Update"
                    onClick={handleUpateProfile}
                    disabled={!isValidEmail}
                    bgcolor={!isValidEmail ? "#d3d3d3" : "#8AC642"}
                    customStyle={{
                      width: "100%",
                      height: "45px",
                      borderRadius: "2rem",
                      fontSize: "0.9rem",
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button
                    size="sm"
                    text="Cancel"
                    onClick={handleEdit}
                    customStyle={{
                      width: "100%",
                      height: "45px",
                      borderRadius: "2rem",
                      fontSize: "0.9rem",
                      backgroundColor: "#6c757d",
                    }}
                  />
                </Grid>
              </Grid>
            </div>
          </div>
        )}
      </Box>

      {/* DRAWER MODALS */}
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