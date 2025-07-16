import React from "react";
import CloseIcon from '@mui/icons-material/Close';

const CloseIconButton = ({ onClose }) => {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: "8px 16px" }}>
      <CloseIcon
        onClick={onClose}
        sx={{
          cursor: "pointer",
          color: "#fff",
          fontSize: 32,
          transition: "transform 0.2s ease, color 0.2s ease",
          "&:hover": {
            color: "#8AC642",
            transform: "scale(1.2)",
          },
        }}
      />
    </div>
  );
};

export default CloseIconButton;
