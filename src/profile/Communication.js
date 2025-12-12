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
      backgroundColor: "rgba(138, 198, 66, 0.1)",
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#8AC642",
  },
  "& .MuiSwitch-switchBase": {
    color: "#888888",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
  },
  "& .MuiSwitch-track": {
    backgroundColor: "#555555",
    opacity: 1,
  },
}));

const Communication = ({ communication, onCommunicationClose }) => {
  const [selectedValue, setSelectedValue] = useState("a");
  const [switchStates, setSwitchStates] = useState({});
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
    console.log("data", data);
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

    // Update UI immediately (optimistic update)
    setSwitchStates((prev) => ({
      ...prev,
      [key]: checked,
    }));

    setLoading(true);
    const formData = new FormData();
    formData.append("_id", userId);
formData.append(key, checked ? true : false);


    try {
      await dispatch(updateUser(API_URL, formData));
    } catch (error) {
      // Revert the optimistic update on error
      setSwitchStates((prev) => ({
        ...prev,
        [key]: !checked,
      }));
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
    {
      icon: sms,
      label: "Reach out for personalized policy options tailored to my family's needs.",
      key: "userSms",
    },
    {
      icon: call,
      label: "Limit communication to once a month.",
      key: "userCall",
    },
    {
      icon: wtsp,
      label: "Kindly avoid phone calls — I prefer communication via email or WhatsApp.",
      key: "userWhatsapp",
    },
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
          width: isMobile ? "100%" : "500px",
          backgroundColor: "#1E1E1E",
          color: "#fff",
          padding: "20px",
        },
      }}
    >
      <Box>
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <IconButton onClick={onCommunicationClose}>
            <img src={backArrow} alt="back" style={{ width: "24px" }} />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">
            Communication Preferences
          </Typography>
        </Stack>

        <Box mb={5}>

          <Typography sx={{
            height: 48,
            fontSize: "1.3rem",
            justifyContent: "center",
            borderRadius: 42,
            width: "100%",
            color: "#fff",
          }} color="white" mb={1}>
            Please contact me around the time of my policy renewal.
          </Typography>

          <Stack spacing={2}>
            {contactMethods.map(({ icon, label, key }) => (
              <Stack key={key} direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <img src={icon} alt={label} width={24} />
                  <Typography style={{
                    height: 48,
                    fontSize: "1.3rem",
                    paddingTop: 5,
                    borderRadius: 42,
                    width: "100%",
                    color: "#fff",
                  }}>{label}</Typography>
                </Stack>
                <PinkSwitch checked={switchStates[key]} onChange={handleSwitchUpdate(key)} />
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