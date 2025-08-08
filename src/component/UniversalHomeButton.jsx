import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";

const UniversalHomeButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Correct check for homepage
  if (location.pathname === "/") return null;

  return (
    <button
      onClick={() => navigate("/")}
      className="universal-home-button"
      type="button"
      title="Go to Home"
      aria-label="Home"
      style={homeBtnStyle}
    >
      <AiOutlineHome size={32} />
    </button>
  );
};

const homeBtnStyle = {
  position: "fixed",
  bottom: "1rem",
  left: "1rem",
  backgroundColor: "#1e1e1e",
  color: "#8bc642",
  border: "1px solid #333",
  borderRadius: "50%",
  padding: "1.2rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  zIndex: 9999,
  ":hover": {
  transform: "scale(1.1)",
  backgroundColor: "#2a2a2a",
}
};

export default UniversalHomeButton;
