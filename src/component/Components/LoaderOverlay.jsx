import React from "react";

const LoaderOverlay = ({ message = "Please wait..." }) => {
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
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 20000,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          width: "65px",
          height: "65px",
          border: "6px solid rgba(255,255,255,0.2)",
          borderTop: "6px solid #8AC642",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>

      <p
        style={{
          color: "#fff",
          marginTop: "20px",
          fontSize: "1rem",
          letterSpacing: "0.5px",
        }}
      >
        {message}
      </p>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoaderOverlay;
