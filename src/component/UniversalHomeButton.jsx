import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai"; // Ant Design icon

const UniversalHomeButton = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate("/coverkraft")}
            className="universal-home-button"
            type="button"
            title="Go to Home"
            aria-label="Home"
            style={homeBtnStyle}
        >
            <AiOutlineHome size={20} />
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
    padding: "0.6rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    zIndex: 9999,
};

export default UniversalHomeButton;
