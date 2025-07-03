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
  // console.log("profileImage", profileImage);
  const [showImageInput, setShowImageInput] = useState(false);
  const [username, setuserName] = useState();
  const [useremail, setuserEmail] = useState();
  const [userDob, setuserDob] = useState();
  const [userAddress, setuserAddress] = useState();
  const [state, setstate] = useState("");
  // console.log("state", state);
  const [city, setCity] = useState("");
  // console.log("city", city);
  const [userPhone, setuserPhone] = useState();
  const [pinCode, setpinCode] = useState();
  const [gender, setgender] = useState();
  const [userImgFile, setuserImgFile] = useState(null);
  // console.log("userImgFile", userImgFile);
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
  const handleCitySelect = (cityId) => {
    setSelectedCityId(cityId);
  };
  //useeffect
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
    // Save the path only when the drawer opens
    if (open) {
      setReturnPath(location.pathname);
    }
  }, [open, location.pathname]);
  // useEffect(() => {
  //   if (userbyId.getUserById && userbyId.getUserById.data) {
  //     const data = userbyId.getUserById.data;
  //     console.log("data", data);
  //     setuserName(data.userName);
  //     setuserEmail(data.userEmail);
  //     setuserPhone(data.userPhone);
  //     setuserDob(new Date(data?.userDob?.split("/")?.reverse()?.join("-")));
  //     setuserAddress(data.userAddress);
  //     setstate(data.state === null ? null : data.state._id);
  //     setCity(data.city === null ? null : data.city._id);
  //     setpinCode(data.pinCode);
  //     setgender(data.gender);
  //     setProfileImage(
  //       data.userImg ? IMAGE_PATH + data.userImg : icDefaultProfile
  //     );
  //   }
  // }, [userbyId]);
  // console.log("userimg kya h", profileImage);

  useEffect(() => {
    if (userbyId.getUserById && userbyId.getUserById.data) {
      const data = userbyId.getUserById.data;

      setuserName(data.userName);
      setuserEmail(data.userEmail);
      setuserPhone(data.userPhone);
      setuserDob(new Date(data?.userDob?.split("/")?.reverse()?.join("-")));
      setuserAddress(data.userAddress);

      const stateId = data?.state?._id || "";
      const cityId = data?.city?._id || "";

      setstate(stateId);
      setSelectedStateId(stateId);

      setCity(cityId);
      setSelectedCityId(cityId);

      setpinCode(data.pinCode);
      setgender(data.gender);

      setProfileImage(
        data.userImg ? IMAGE_PATH + data.userImg : icDefaultProfile
      );
    }
  }, [userbyId]);

  const handleStateSelect = (stateId) => {
    setSelectedStateId(stateId);
  };
  //function to check user is above 18 or not
  const isOldEnough = (dob) => {
    const today = new Date(); // Get today's date
    const birthDate = new Date(dob); // Convert dob to a Date object
    let age = today.getFullYear() - birthDate.getFullYear(); // Calculate age

    // Calculate the month difference
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // If the birth month hasn't occurred yet this year, or it's the birth month but the birth day hasn't occurred yet, subtract one year from age
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    // Return true if age is 18 or older
    return age >= 18;
  };

  function handleUpateProfile() {
    const formData = new FormData();
    // console.log("FormData values before appending:", formData);

    formData.append("_id", sessionStorage.getItem("userId"));
    formData.append("userName", username);
    formData.append("userEmail", useremail);
    formData.append("userPhone", userPhone);
    formData.append("userDob", userDob);
    formData.append("userAddress", userAddress);
    formData.append("state", selectedStateId);
    formData.append("city", selectedCityId);
    formData.append("pinCode", pinCode);
    formData.append("gender", gender);
    if (userImgFile) {
      formData.append("userImg", userImgFile);
    }

    console.log(
      username,
      useremail,
      userPhone,
      userDob,
      userAddress,
      selectedStateId,
      selectedCityId,
      pinCode,
      gender,
      userImgFile
    );
    if (
      (username &&
        useremail &&
        userPhone &&
        userDob &&
        userAddress &&
        selectedStateId &&
        selectedCityId &&
        pinCode &&
        gender) ||
      userImgFile
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
      // .then(() => {
      //     toast.success('Updated successfully')
      // }).catch((error) => {
      //     toast.error('Error in updating')
      // })
      toast.success("Updated successfully");
      setTimeout(() => {
        onClose();
      }, 1000);
      // onClose();
    } else {
      toast.error("Please fill all required fields!");
      // console.log("No fields are being updated");
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
    // setAboutDrawerOpen(true);
    onClose();
    navigate("/about");
  };
  const handleHelpOpen = () => {
    // alert("Coming soon !");
    navigate("/contactus");
  };
  const handleLogout = () => {
    LOCAL_STORAGE_KEYS.forEach((key) => sessionStorage.removeItem(key));
    navigate("/");
    setTimeout(() => window.location.reload(), 100);
  };

  const handlePinCodeChange = (e) => {
    let pin = e.target.value.replace(/\D/g, ""); // Remove all non-digit characters
    pin = pin.slice(0, 6); // Limit to 6 digits
    setpinCode(pin);
    const isValidPin = /^\d{5,6}$/.test(pin); // Check if it's 5 or 6 digits
    setIsValidPinCode(isValidPin);
  };
  //function to handle email input field start
  const handleEmailChange = (e) => {
    const emailId = e.target.value;

    // Regular expression to validate the email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Regex to check for exactly one @ symbol and at least two dots after @
    const validEmail =
      emailRegex.test(emailId) &&
      emailId.split("@").length === 2 &&
      emailId.split("@")[1].split(".").length <= 3;
    setuserEmail(emailId);
    setIsValidEmail(validEmail);
  };
  //function to handle email input field start
  //function to handle phone number input field start
  const handlephonechange = (e) => {
    let number = e.target.value.replace(/\D/g, "");
    number = number.slice(0, 10);
    setuserPhone(number);
    const isValid = /^\d{10}$/.test(number.replace("+91", ""));
    setValid(isValid);
  };
  //function to handle phone number input field end
  const handleDobChange = (date) => {
    setuserDob(date);
  };

  const headerStyle = {
    wordWrap: "break-word", // Ensures long words break onto the next line
    overflowWrap: "break-word", // Alternative property to ensure wrapping
    maxWidth: "25%", // Ensures the element respects the container's width
    whiteSpace: "normal", // Ensures that text can wrap and does not stay in a single line
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: THEME_COLOR.FADE_BACKGROUND,
          width: "35vw", // ✅ Consistent width across the drawer
          maxWidth: "400px", // Optional: limit max width for responsiveness
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
            onClick={() => {
              onClose(); // Close the drawer first
              setTimeout(() => {
                navigate(returnPath); // Go back to the stored path
              }, 100); // Slight delay to let the drawer close smoothly
            }}
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
            {/* REUSABLE LIST ITEM COMPONENT RECOMMENDED HERE */}
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
          // --------------------------
          // Edit Mode
          // --------------------------
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

              {/* Gender dropdown (optional) */}
              <Grid item xs={12}>
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

            {/* Action Buttons */}
            <div className="flex gap-3 mt-5 justify-center">
              <Button
                size="lg"
                text="Update"
                onClick={handleUpateProfile}
                disabled={!isValidEmail}
                bgcolor={!isValidEmail ? "#d3d3d3" : "#8AC642"}
                customStyle={{
                  width: "100%",
                  height: "6vh",
                  borderRadius: "3rem",
                  fontSize: "1rem",
                }}
              />
              <Button
                size="lg"
                text="Cancel"
                onClick={handleEdit}
                customStyle={{
                  width: "100%",
                  height: "6vh",
                  borderRadius: "3rem",
                  fontSize: "1rem",
                }}
              />
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
