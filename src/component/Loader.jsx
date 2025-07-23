import { useState, useEffect } from "react";

const Loader = ({ size = 50, message = "Content Loading..." }) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShowMessage(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        background: "#000000bf",
        position: "absolute",
        inset: 0,
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          border: "5px solid rgba(138, 198, 66, 0.3)", // faded green background ring
          borderTop: "5px solid #8AC642", // strong green highlight
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />

      {showMessage && (
        <p
          style={{
            marginTop: "1rem",
            fontSize: "1rem",
            fontWeight: "500",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          {message}
        </p>
      )}

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
