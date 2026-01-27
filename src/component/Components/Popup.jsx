import React from "react";
import Button from "../Button";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // ✅ default left icon
import { useNavigate } from "react-router-dom";

const Popup = ({
  visible,
  title = "Application Submitted 🎉",
  message = "Thank you! Your submission was successful.",
  messageHtml = null, 
  buttons = [],
  buttonText = "OK",
  onClose,
  navigateTo = -1, 
  leftIcon = <CheckCircleIcon sx={{ color: "#8AC642", fontSize: 28 }} />, // ✅ optional left icon
 radioOptions = null, // ✅ NEW: Array of {label, value} for radio buttons
  selectedRadio = "", // ✅ NEW: Currently selected radio value
  onRadioChange = null,
}) => {
  const navigate = useNavigate();

  if (!visible) return null;

  // ✅ Default single button fallback
  const buttonList =
    buttons.length > 0
      ? buttons
      : [
          {
            label: buttonText,
            onClick: onClose,
            style: {
              backgroundColor: "#8AC642",
              color: "#fff",
            },
          },
        ];

  // ✅ Handles close or navigate
  const handleClose = () => {
    if (navigateTo) {
      navigate(navigateTo);
    } else if (onClose) {
      onClose();
    } else {
      window.history.back();
    }
  };

  return (
    <div
      onClick={handleClose} // click outside closes/navigates
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        backdropFilter: "blur(6px)",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside popup
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
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Header bar with close icon */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50px",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 12px",
          }}
        >
          {/* Circular close icon */}
          <div
            onClick={handleClose}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "rgba(138,198,66,0.2)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
            }
          >
            <CloseIcon
              style={{
                color: "#fff",
                fontSize: "20px",
              }}
            />
          </div>
        </div>

        {/* Title with left icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginTop: "2.2em",
            marginBottom: "1em",
          }}
        >
          {/* {leftIcon && leftIcon} */}
          <h2
            style={{
              fontSize: "1.5em",
              color: "#8AC642",
              margin: 0,
            }}
          >
            {title}
          </h2>
        </div>

       {/* Message - ✅ Support both HTML and plain text */}
        {messageHtml ? (
          <div
            style={{
              marginBottom: "1.5em",
              color: "#ccc",
              lineHeight: 1.6,
            }}
            dangerouslySetInnerHTML={{ __html: messageHtml }}
          />
        ) : (
          <p
            style={{
              marginBottom: "1.5em",
              color: "#ccc",
              lineHeight: 1.6,
              whiteSpace: "pre-line",
            }}
          >
            {message}
          </p>
        )}

          {/* ✅ NEW: Radio Button Section */}
{/* ✅ NEW: Radio Button Section */}
{/* ✅ Radio Button Section - CENTERED */}
{radioOptions && radioOptions.length > 0 && (
  <div style={{ marginBottom: "2em", textAlign: "center" }}>
    <p
      style={{
        color: "#fff",
        fontWeight: 600,
        marginBottom: "20px",
        fontSize: "1.1rem",
        textAlign: "center",
      }}
    >
      Continue as:
    </p>
    <div
      style={{
        display: "flex",
        gap: "32px",
        alignItems: "center",
        justifyContent: "center", // ✅ CHANGED: center instead of flex-start
        paddingLeft: "0", // ✅ CHANGED: removed left padding
      }}
    >
      {radioOptions.map((option) => {
        const isSelected = selectedRadio === option.value;
        return (
          <label
            key={option.value}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              gap: "12px",
            }}
            onClick={() => onRadioChange && onRadioChange(option.value)}
          >
            <span
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                border: `2px solid ${isSelected ? "#8AC642" : "#666"}`,
                backgroundColor: isSelected ? "#8AC642" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                flexShrink: 0,
              }}
            >
              {isSelected && (
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#1e1e1e",
                  }}
                ></span>
              )}
            </span>

            <span
              style={{
                color: "#fff",
                fontWeight: 500,
                fontSize: "1rem",
              }}
            >
              {option.label}
            </span>
          </label>
        );
      })}
    </div>
  </div>
)}


        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {buttonList.map((btn, idx) => (
            <Button
              key={idx}
              text={btn.label}
              block={true}
              onClick={btn.onClick}
              style={{
                backgroundColor: btn.style?.backgroundColor || "#8AC642",
                color: btn.style?.color || "#fff",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "15px",
                border: btn.style?.border || "none",
              }}
            />
          ))}
        </div>

        {/* Animation */}
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
