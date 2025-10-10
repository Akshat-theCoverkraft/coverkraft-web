import React from "react";
import Button from "../Button"; // ✅ adjust path if Button is in another folder

const Popup = ({
  visible,
  title = "Application Submitted 🎉",
  message = "Thank you! Your submission was successful.",
  buttonText = "OK",
  onClose,
}) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          background: "#1e1e1e",
          padding: "2em",
          borderRadius: "16px",
          maxWidth: "450px",
          width: "90%",
          textAlign: "center",
          color: "#fff",
          boxShadow: "0 0 20px rgba(0,0,0,0.7)",
          animation: "fadeIn 0.3s ease-out",
        }}
      >
        <h2 style={{ marginBottom: "1em", fontSize: "1.5em", color: "#8AC642" }}>
          {title}
        </h2>

        <p style={{ marginBottom: "1.5em", color: "#ccc", lineHeight: 1.6 }}>
          {message}
        </p>

        <Button
          text={buttonText}
          size="md"
          block={true}
          onClick={onClose}
          style={{
            backgroundColor: "#8AC642",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "15px",
          }}
        />

        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default Popup;
