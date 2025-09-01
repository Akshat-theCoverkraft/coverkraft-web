import React, { useState, useEffect } from "react";
import { Drawer, Box, Typography } from "@mui/material";
import CustomInput from "../component/CustomInput";
import Button from "../component/Button";
import backArrow from "../Images/ic_back_button.png";
import axios from "axios";
import API_URL from "../ServiceModule/Service";
import Dropdown from "../component/Dropdown";
import { toast, ToastContainer } from "react-toastify";
import { THEME_COLOR } from "../constants";

// ✅ Utility function to format Title Case
const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .filter((word) => word.trim() !== "")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const FamilyAdd = ({ familyAdd, onfamilyAddClose, onSuccess, mode = "add", editData = null }) => {
  const [familyMember, setFamilyMember] = useState("");
  const [fullName, setFullName] = useState("");
  const [userPhone, setuserPhone] = useState("");
  const [useremail, setuserEmail] = useState("");

  const [errors, setErrors] = useState({});

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
    if (familyAdd && mode === "edit" && editData) {
      setFamilyMember(editData.familyMember || "");
      // ✅ Apply Title Case formatting when setting fullName from editData
      setFullName(editData.fullName ? toTitleCase(editData.fullName) : "");
      setuserPhone(editData.mobile || "");
      setuserEmail(editData.email || "");
    } else if (mode === "add") {
      resetForm();
    }
  }, [familyAdd, mode, editData]);

  const resetForm = () => {
    setFamilyMember("");
    setFullName("");
    setuserPhone("");
    setuserEmail("");
    setErrors({});
  };

  const validateField = (name, value) => {
    let message = "";

    switch (name) {
      case "fullName":
        if (
          !value.trim() ||
          value.trim().length < 3 ||
          !/^([A-Z][a-z]*)(\s[A-Z][a-z]*)*$/.test(value.trim())
        ) {
          message = "Full name must be in Title Case and at least 3 characters long.";
        }
        break;
      case "userPhone":
        if (!/^\d{10}$/.test(value)) message = "Enter a valid 10-digit phone number.";
        break;
      case "useremail":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) message = "Enter a valid email address.";
        break;
      case "familyMember":
        if (!value) message = "Please select relation.";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: message }));
  };

  const validateForm = () => {
    const tempErrors = {};
    let valid = true;

    if (
      !fullName.trim() ||
      fullName.trim().length < 3 ||
      !/^([A-Z][a-z]*)(\s[A-Z][a-z]*)*$/.test(fullName.trim())
    ) {
      tempErrors.fullName = "Full name must be in Title Case and at least 3 characters long.";
      valid = false;
    }

    if (!familyMember) {
      tempErrors.familyMember = "Please select relation.";
      valid = false;
    }
    if (!/^\d{10}$/.test(userPhone)) {
      tempErrors.userPhone = "Enter a valid 10-digit phone number.";
      valid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
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

    const formData = {
      userId,
      fullName: toTitleCase(fullName), // ✅ Ensure Title Case before sending to API
      familyMember,
      mobile: userPhone,
      email: useremail,
    };

    const formDataEdit = {
      ...formData,
      _id: editData?._id,
    };

    try {
      let response;
      if (mode === "edit" && editData?._id) {
        response = await axios.post(`${API_URL}family/update`, formDataEdit, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await axios.post(`${API_URL}family/create`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.status === 200) {
        toast.success(mode === "edit" ? "Member updated successfully" : "Member added successfully");
        onSuccess();
        onfamilyAddClose();
        resetForm();
      } else {
        toast.error("Something went wrong.");
      }
    } catch (err) {
      toast.error(mode === "edit" ? "Failed to update member." : "Failed to save member.");
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
      <ToastContainer />
      <Box
        sx={{
          marginTop: "20px",
          height: "100%",
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          marginLeft: "25px",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "450px" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ cursor: "pointer", mr: 2 }}>
              <img src={backArrow} alt="Back" onClick={onfamilyAddClose} />
            </Box>
            <Typography variant="h4">{mode === "edit" ? "Edit Member" : "Add New Member"}</Typography>
          </Box>

          <Box sx={{ mb: 3, mt: 5, width: "90%" }}>
            <Dropdown
              label="Family Member"
              options={familyOption}
              value={familyMember}
              onChange={(e) => {
                const value = e.target.value;
                setFamilyMember(value);
                validateField("familyMember", value);
              }}
              placeholder="Select"
              backgroundColor={THEME_COLOR.FADE_BACKGROUND}
              error={!!errors.familyMember}
              helperText={errors.familyMember}
              required
            />
            {errors.familyMember && (
              <div className="invalid-feedback text-danger d-block">{errors.familyMember}</div>
            )}
          </Box>

          <Box sx={{ mb: 3, width: "90%" }}>
            <CustomInput
              label="Full Name"
              placeholder="Enter Full Name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                validateField("fullName", e.target.value);
              }}
              inputStyle={commonInputStyle}
              error={!!errors.fullName}
              validationMessage={errors.fullName}
              required
            />
          </Box>

          <Box sx={{ mb: 3, width: "90%" }}>
            <CustomInput
              label="Phone Number"
              placeholder="Enter Phone Number"
              value={userPhone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setuserPhone(value);
                validateField("userPhone", value);
              }}
              inputStyle={commonInputStyle}
              error={!!errors.userPhone}
              validationMessage={errors.userPhone}
              required
            />
          </Box>

          <Box sx={{ mb: 3, width: "90%" }}>
            <CustomInput
              label="Email"
              placeholder="Enter Email"
              value={useremail}
              onChange={(e) => {
                setuserEmail(e.target.value);
                validateField("useremail", e.target.value);
              }}
              inputStyle={commonInputStyle}
              error={!!errors.useremail}
              validationMessage={errors.useremail}
              required
            />
          </Box>

          <Box sx={{ mb: 3, width: "90%" }}>
            <Button
              text={mode === "edit" ? "Update" : "Save"}
              size="sm"
              block={true}
              onClick={handleSubmit}
            />
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default FamilyAdd;
