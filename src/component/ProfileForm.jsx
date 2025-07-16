import React from "react";
import { Box, Grid, FormLabel } from "@mui/material";
import CustomInput from "../component/CustomInput";
import GlobalDropdown from "./StateDropdown";
import CityDropdown from "./CityDropdown";
import GlobalDatePicker from "./GlobalDatePicker";
import Button from "../component/Button";

const ProfileForm = ({
  username, setuserName,
  useremail, handleEmailChange,
  userPhone, handlephonechange,
  userDob, handleDobChange,
  userAddress, setuserAddress,
  selectedStateId, handleStateSelect,
  selectedCityId, handleCitySelect,
  pinCode, handlePinCodeChange,
  isValidPinCode,
  gender, setgender,
  handleUpdate,
  cancelUpdate,
  isValidEmail,
  valid
}) => {
  return (
    <Box
      sx={{
        maxHeight: "70vh",
        overflowY: "auto",
        scrollbarWidth: "none", // Firefox
        "&::-webkit-scrollbar": { display: "none" }, // Chrome
      }}
    >
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <CustomInput
            label="Name"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setuserName(e.target.value)}
            required
                                                              inputStyle={commonInputStyle}

          />
        </Grid>

        <Grid item>
          <CustomInput
            type="email"
            label="Email Address"
            value={useremail}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            error={!isValidEmail}
            helperText={!isValidEmail ? "Please enter a valid email address" : ""}
            required
                                                              inputStyle={commonInputStyle}

          />
        </Grid>

        <Grid item>
          <CustomInput
            type="tel"
            label="Mobile Number"
            value={userPhone}
            onChange={handlephonechange}
            placeholder="Enter your mobile number"
            error={!valid}
                                                  inputStyle={commonInputStyle}

            helperText={!valid ? "Please enter a valid 10-digit mobile number" : ""}
            required
          />
        </Grid>

        <Grid item>
          <GlobalDatePicker
            label="DOB"
            selectedDate={userDob}
            handleDateChange={handleDobChange}
            placeholder="Select Date"
            width="100%"
                                                              inputStyle={commonInputStyle}

          />
        </Grid>

        <Grid item>
          <CustomInput
            label="Address"
            placeholder="Enter your Address"
            value={userAddress}
            onChange={(e) => setuserAddress(e.target.value)}
                                                              inputStyle={commonInputStyle}

          />
        </Grid>

        <Grid item>
          <GlobalDropdown
            onStateSelect={handleStateSelect}
            initialValue={selectedStateId}
          />
        </Grid>

        <Grid item>
          <CityDropdown
            selectedStateId={selectedStateId}
            onCitySelect={handleCitySelect}
            initialValue={selectedCityId}
          />
        </Grid>

        <Grid item>
          <CustomInput
            label="Pincode"
            placeholder="Enter your PinCode"
            value={pinCode}
            onChange={handlePinCodeChange}
            error={!isValidPinCode}
            helperText={!isValidPinCode ? "Please enter a valid pin code (5 or 6 digits)" : ""}
                                                              inputStyle={commonInputStyle}

          />
        </Grid>

        <Grid item>
          <FormLabel style={{ color: "#fff", marginBottom: "4px" }}>Gender</FormLabel>
          <select
            value={gender}
            onChange={(e) => setgender(e.target.value)}
            className="form-control bg-dark text-light"
          >
            <option value="" disabled>Select Your Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </Grid>

        <Grid item container spacing={2}>
          <Grid item xs={12}>
            <Button
              text="Update"
              onClick={handleUpdate}
              disabled={!isValidEmail || !valid || !isValidPinCode}
              bgcolor={(!isValidEmail || !valid || !isValidPinCode) ? "#d3d3d3" : "#8AC642"}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              text="Cancel"
              onClick={cancelUpdate}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileForm;
