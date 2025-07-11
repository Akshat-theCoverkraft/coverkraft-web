import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Grid,
  Typography,
  Card,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import backArrow from "../Images/ic_back_button.png";
import sms from "../Images/ic-sms.png";
import call from "../Images/ic-call.png";
import wtsp from "../Images/ic-wtsp.png";
import email from "../Images/ic-mail.png";
import { alpha, styled, useTheme } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Radio from "@mui/material/Radio";
import { getBYIDUsers, updateUser } from "../store/action/action";
import { useDispatch, useSelector } from "react-redux";
import API_URL from "../ServiceModule/Service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { THEME_COLOR } from "../constants";

const PinkSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#8AC642",
    "&:hover": {
      backgroundColor: alpha("#8AC642", theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#8AC642",
  },
}));

const label = { inputProps: { "aria-label": "Color switch demo" } };

const Communication = ({ communication, onCommunicationClose }) => {
  const [selectedValue, setSelectedValue] = useState("a");
  const [switchStates, setSwitchStates] = useState({
    userSms: false,
    userCall: false,
    userWhatsapp: false,
    userEmail: false,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userId = sessionStorage.getItem("userId");
  const userbyId = useSelector((state) => state.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    dispatch(getBYIDUsers(API_URL, userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (userbyId.getUserById?.data) {
      const data = userbyId.getUserById.data;
      setSwitchStates({
        userSms: data.userSms,
        userCall: data.userCall,
        userWhatsapp: data.userWhatsapp,
        userEmail: data.userEmail,
      });
      setSelectedValue(data.userFrequent);
    }
  }, [userbyId]);

  const handleSwitchUpdate = (switchName) => async (event) => {
    const newChecked = event.target.checked;
    setSwitchStates((prev) => ({ ...prev, [switchName]: newChecked }));
    setLoading(true);

    const formData = new FormData();
    formData.append("_id", userId);
    formData.append(switchName, newChecked);

    try {
      await dispatch(updateUser(API_URL, formData));
    } catch (error) {
      console.error("Error updating the switch state", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRadioChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    setLoading(true);

    const formData = new FormData();
    formData.append("_id", userId);
    formData.append("userFrequent", newValue);

    dispatch(updateUser(API_URL, formData))
      .then(() => toast.success("Successfully Updated"))
      .catch(() => toast.error("Error in updating"))
      .finally(() => setLoading(false));
  };

  const controlProps = (item) => ({
    checked: selectedValue === item,
    onChange: handleRadioChange,
    value: item,
    name: "color-radio-button-demo",
    inputProps: { "aria-label": item },
  });

  const contactMethods = [
    { icon: sms, label: "SMS", key: "userSms" },
    { icon: call, label: "Call", key: "userCall" },
    { icon: wtsp, label: "Whatsapp", key: "userWhatsapp" },
    { icon: email, label: "Email", key: "userEmail" },
  ];

  const frequencyOptions = [
    { value: "1", label: "Monthly" },
    { value: "2", label: "Yearly" },
    { value: "3", label: "Never" },
  ];

  return (
    <Drawer
      anchor="right"
      open={communication}
      onClose={onCommunicationClose}
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: THEME_COLOR.FADE_BACKGROUND,
          color: THEME_COLOR.COLOR,
          width: isMobile ? "100vw" : "480px",
          maxWidth: "100vw",
          boxSizing: "border-box",
        },
      }}
    >
      <ToastContainer position="top-center" style={{ zIndex: 99999 }} />

      <Box
        sx={{
          height: "100vh",
          overflow: "hidden",
          padding: isMobile ? 2 : 3,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <img src={backArrow} alt="Back" onClick={onCommunicationClose} style={{ cursor: "pointer", paddingLeft: "10px" }} />
          </Grid>
          <Grid item>
            <Typography variant={isMobile ? "h6" : "h4"}>Communication Preferences</Typography>
          </Grid>
        </Grid>

        <Card sx={{ borderRadius: 4, marginRight:"30px", paddingRight: "30px" }}>
          <Typography variant="h6" gutterBottom>Policy Updates</Typography>
          <Typography variant="body2" sx={{ color: "#bbb", mb: 2 }}>
            Important updates for your purchased policies — payment, issuance, renewal, and reminders.
          </Typography>
          {contactMethods.map((item) => (
            <Grid container key={item.key} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Grid item display="flex" alignItems="center">
                <img src={item.icon} height={24} alt={item.label} style={{ marginRight: 12 }} />
                <Typography>{item.label}</Typography>
              </Grid>
              <Grid item>
                <PinkSwitch {...label} checked={switchStates[item.key]} onChange={handleSwitchUpdate(item.key)} />
              </Grid>
            </Grid>
          ))}
        </Card>

        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Typography variant="h6" gutterBottom>Frequent Communication</Typography>
          <Typography variant="body2" sx={{ color: "#bbb", mb: 2 }}>
            Manage your communication preferences easily and stay informed your way.
          </Typography>
          {frequencyOptions.map((option) => (
            <Grid container key={option.value} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography>{option.label}</Typography>
              <PinkSwitch {...controlProps(option.value)} />
            </Grid>
          ))}
        </Card>
      </Box>

      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1300,
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      )}
    </Drawer>
  );
};

export default Communication;
