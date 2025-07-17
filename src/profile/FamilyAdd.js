import React, { useState, useEffect } from "react";
import { Drawer, Box, Typography } from "@mui/material";
import CustomInput from "../component/CustomInput";
import Button from "../component/Button";
import backArrow from "../Images/ic_back_button.png";
import axios from "axios";
import API_URL from "../ServiceModule/Service";
import Dropdown from "../component/Dropdown";
import { toast } from "react-toastify"; // Only used for API success/failure
import { THEME_COLOR } from "../constants";

const FamilyAdd = ({ familyAdd, onfamilyAddClose, onSuccess }) => {
  const [familyMember, setFamilyMember] = useState("");
  const [fullName, setFullName] = useState("");
  const [userPhone, setuserPhone] = useState("");
  const [useremail, setuserEmail] = useState("");

  const [errors, setErrors] = useState({
    fullName: "",
    userPhone: "",
    useremail: "",
    familyMember: "",
  });

  const familyOption = [
    { value: "Spouse", label: "Spouse" },
    { value: "Son", label: "Son" },
    { value: "Daughter", label: "Daughter" },
    { value: "Father", label: "Father" },
    { value: "Mother", label: "Mother" },
  ];

  const commonInputStyle = {
    height: 48,
    fontSize: "1.222rem",
    borderRadius: 42,
    paddingLeft: "20px",
    width: "100%",
    color: "white",
    borderColor: "grey",
  };

  useEffect(() => {
    if (familyAdd) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [familyAdd]);

  const validateForm = () => {
    const tempErrors = {};
    let valid = true;

    if (!fullName.trim()) {
      tempErrors.fullName = "Full name is required.";
      valid = false;
    }

    if (!familyMember) {
      tempErrors.familyMember = "Please select a family member.";
      valid = false;
    }

    if (!/^\d{10}$/.test(userPhone)) {
      tempErrors.userPhone = "Enter a valid 10-digit phone number.";
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(useremail)) {
      tempErrors.useremail = "Enter a valid email address.";
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("fullName", fullName);
    formData.append("familyMember", familyMember);
    formData.append("mobile", userPhone);
    formData.append("email", useremail);

    try {
      const response = await axios.post(`${API_URL}family/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("Successfully Created");
        onSuccess();
        onfamilyAddClose();
        setFullName("");
        setFamilyMember("");
        setuserPhone("");
        setuserEmail("");
        setErrors({});
      } else {
        toast.error(response.message || "Something went wrong.");
      }
    } catch (err) {
      toast.error("Failed to add member.");
    }
  };

  return (
    <Drawer
      anchor="right"
      open={familyAdd}
      onClose={onfamilyAddClose}
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: THEME_COLOR.FADE_BACKGROUND,
          color: THEME_COLOR.COLOR,
          width: "35vw",
          maxWidth: "400px",
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "400px" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 5 }}>
            <Box sx={{ cursor: "pointer", mr: 2 }}>
              <img src={backArrow} alt="Back" onClick={onfamilyAddClose} />
            </Box>
            <Typography variant="h4">Add New Member</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Dropdown
              label="Family Member"
              options={familyOption}
              value={familyMember}
              onChange={(e) => setFamilyMember(e.target.value)}
              placeholder="Select"
              backgroundColor={THEME_COLOR.FADE_BACKGROUND}
              error={!!errors.familyMember}
              helperText={errors.familyMember}
              required
            />

          </Box>

          <Box sx={{ mb: 3 }}>
            <CustomInput
              label="Full Name"
              placeholder="Enter your Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              inputStyle={commonInputStyle}
              error={!!errors.fullName}
              validationMessage={errors.fullName}
              required
              padding="2rem"
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <CustomInput
              label="Phone Number"
              placeholder="Enter your Phone Number"
              value={userPhone}
              onChange={(e) =>
                setuserPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              inputStyle={commonInputStyle}
              error={!!errors.userPhone}
              validationMessage={errors.userPhone}
              required
              padding="2rem"
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <CustomInput
              label="Email"
              placeholder="Enter Email"
              value={useremail}
              onChange={(e) => setuserEmail(e.target.value)}
              inputStyle={commonInputStyle}
              error={!!errors.useremail}
              validationMessage={errors.useremail}
              required
              padding="2rem"
            />
          </Box>

          <Box>
            <Button text="Continue" size="sm" block={true} onClick={handleSubmit} />
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default FamilyAdd;
