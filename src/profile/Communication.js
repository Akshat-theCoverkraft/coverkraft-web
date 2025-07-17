import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Grid,
  Typography,
  Card,
  CircularProgress,
  useMediaQuery,
  Stack,
  IconButton,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Radio from "@mui/material/Radio";
import { getBYIDUsers, updateUser } from "../store/action/action";
import { useDispatch, useSelector } from "react-redux";
import API_URL from "../ServiceModule/Service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import backArrow from "../Images/ic_back_button.png";
import sms from "../Images/ic-sms.png";
import call from "../Images/ic-call.png";
import wtsp from "../Images/ic-wtsp.png";
import email from "../Images/ic-mail.png";

const PinkSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#8AC642",
    "&:hover": {
      backgroundColor: "#e1f5d6",
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#8AC642",
  },
}));

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
    const data = userbyId.getUserById?.data;
    if (data) {
      setSwitchStates({
        userSms: data.userSms,
        userCall: data.userCall,
        userWhatsapp: data.userWhatsapp,
        userEmail: data.userEmail,
      });
      setSelectedValue(data.userFrequent);
    }
  }, [userbyId]);

  const handleSwitchUpdate = (key) => async (event) => {
    const checked = event.target.checked;
    setSwitchStates((prev) => ({ ...prev, [key]: checked }));
    setLoading(true);

    const formData = new FormData();
    formData.append("_id", userId);
    formData.append(key, checked);

    try {
      await dispatch(updateUser(API_URL, formData));
    } catch {
      toast.error("Error updating preference");
    } finally {
      setLoading(false);
    }
  };

  const handleRadioChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);
    setLoading(true);

    const formData = new FormData();
    formData.append("_id", userId);
    formData.append("userFrequent", value);

    dispatch(updateUser(API_URL, formData))
      .then(() => toast.success("Successfully Updated"))
      .catch(() => toast.error("Error in updating"))
      .finally(() => setLoading(false));
  };

  const contactMethods = [
    { icon: sms, label: "SMS", key: "userSms" },
    { icon: call, label: "Call", key: "userCall" },
    { icon: wtsp, label: "WhatsApp", key: "userWhatsapp" },
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
        "& .MuiDrawer-paper": {
          width: "35vw",
          maxWidth: "400px",
          backgroundColor: "#111",
          color: "#fff",
          padding: theme.spacing(4),
        },
      }}
    >
      <ToastContainer position="top-center" />
      <Box>
        <Stack direction="row" alignItems="center" spacing={2} mb={4}>
          <IconButton onClick={onCommunicationClose}>
            <img src={backArrow} alt="Back" style={{ width: 24 }} />
          </IconButton>
          <Typography variant="h5" fontWeight={600}>
            Communication Preferences
          </Typography>
        </Stack>

        <Box mb={5}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Policy Updates
          </Typography>
          <Typography sx={{ fontSize: "1.3rem" }} color="white" mb={3}>
            Receive important updates for your policies — payments, renewals, and more.
          </Typography>

          <Stack spacing={2}>
            {contactMethods.map(({ icon, label, key }) => (
              <Stack key={key} direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <img src={icon} alt={label} width={24} />
                  <Typography variant="body1">{label}</Typography>
                </Stack>
                <PinkSwitch checked={switchStates[key]} onChange={handleSwitchUpdate(key)} />
              </Stack>
            ))}
          </Stack>
        </Box>

        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Frequency
          </Typography>
          <Typography sx={{ fontSize: "1.3rem" }} color="white" mb={3}>
            How often would you like to hear from us?
          </Typography>

          <Stack spacing={2}>
            {frequencyOptions.map(({ value, label }) => (
              <Stack key={value} direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body1">{label}</Typography>
                <PinkSwitch
                  checked={selectedValue === value}
                  onChange={handleRadioChange}
                  value={value}
                  sx={{
                    color: "#8AC642",
                    "&.Mui-checked": {
                      color: "#8AC642",
                    },
                  }}
                />
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>

      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      )}
    </Drawer>
  );
};

export default Communication;
