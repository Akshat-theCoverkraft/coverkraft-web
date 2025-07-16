import React from "react";
import { Typography } from "@mui/material";
import Button from "../component/Button";

const DeleteAccountModal = ({ onConfirm, onCancel }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw", height: "100vh",
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
        <Typography variant="h6" sx={{ mb: 2, color: "#fff" }}>
          Are you sure you want to delete your account?
        </Typography>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <Button
            text="Yes, Delete"
            bgcolor="#e53935"
            onClick={onConfirm}
          />
          <Button
            text="Cancel"
            bgcolor="#8AC642"
            onClick={onCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
