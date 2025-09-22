import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, LinearProgress } from "@mui/material";
import { THEME_COLOR } from "../constants";

const AlertModal = ({ open, onClose, message, type = "success" }) => {
  const [progress, setProgress] = useState(0);
  const duration = 2000; // 2 seconds
  const intervalTime = 20; // update every 20ms

  useEffect(() => {
    if (open) {
      setProgress(0);
      const increment = (intervalTime / duration) * 100;
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          const newProgress = oldProgress + increment;
          if (newProgress >= 100) {
            clearInterval(timer);
            onClose();
          }
          return newProgress;
        });
      }, intervalTime);

      return () => clearInterval(timer);
    }
  }, [open, onClose]);

  return (
    <Modal open={open} onClose={onClose} hideBackdrop>
      <Box
        sx={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: THEME_COLOR.FADE_BACKGROUND,
          color: THEME_COLOR.COLOR,
          padding: "16px 24px",
          borderRadius: "12px",
          minWidth: "200px",
          maxWidth: "350px",
          width: "100%",
          zIndex: 99999,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          fontWeight: "500",
            fontSize: "16px",
            
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="body1">{message}</Typography>
          <Button
            variant="text"
            sx={{ color: "white", minWidth: "50px", ml: 2 }}
            onClick={onClose}
          >
            ✖
          </Button>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            mt: 1,
            height: 4,
            borderRadius: 2,
            backgroundColor: "#333",
            "& .MuiLinearProgress-bar": {
              backgroundColor: THEME_COLOR.GREEN,
            },
          }}
        />
      </Box>
    </Modal>
  );
};

export default AlertModal;
