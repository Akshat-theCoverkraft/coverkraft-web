import { useState, useEffect } from "react";

const Loader = ({ size = 50, message = "Content Loading..." }) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShowMessage(true), 1000); // delay message slightly
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: "2rem",
        // backgroundColor: "#f9f9f9", // optional light background
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          border: "4px solid #e0e0e0",
          borderTop: "4px solid #8AC642",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />

      {showMessage && (
        <p style={{ marginTop: "1rem", fontSize: "1rem", fontWeight: "500", color: "#fff" }}>
          {message}
        </p>
      )}

      {/* Spinner animation */}
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

export default Loader;
