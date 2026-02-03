import React from "react";

const FormField = ({
  label,
  field,
  type = "text",
  placeholder = "",
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = true,
  disabled = false,
  options = [], // For select fields
  className = "",
  style = {},
  leftIcon = null, // ✅ new
  rightIcon = null, // ✅ new
}) => {
  const hasError = error && touched;

  const baseInputStyle = {
    height: 48,
    fontSize: "1.2rem",
    borderRadius: 42,
    paddingLeft: leftIcon ? "45px" : "20px", // ✅ more space if icon
    paddingRight: rightIcon ? "35px" : "20px",
    color: "white",
    backgroundColor: "#2c2c2c",
    border: `1px solid ${hasError ? "#FF4444" : "#444"}`,
    width: "100%",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    outline: "none",
       appearance: "none",
    ...style,
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = hasError ? "#FF4444" : "#8AC642";
  };

  const handleBlurEvent = (e) => {
    e.target.style.borderColor = hasError ? "#FF4444" : "#444";
    if (onBlur) onBlur();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
      {/* Label */}
      <label
        style={{
          color: "#fff",
             fontSize: "1.5rem",
          marginBottom: 8,
          fontWeight: 500,
        }}
      >
        {label} {required && <span style={{ color: "#f44336" }}>*</span>}
      </label>

      {/* Input Wrapper with icons */}
      <div style={{ position: "relative", width: "100%" }}>
        {/* Left Icon */}
        {leftIcon && (
          <div
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#aaa",
              display: "flex",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            {leftIcon}
          </div>
        )}

        {/* Right Icon */}
        {rightIcon && (
          <div
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#aaa",
              display: "flex",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            {rightIcon}
          </div>
        )}

        {/* Input / Select */}
        {type === "select" ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleBlurEvent}
            onFocus={handleFocus}
            style={baseInputStyle}
            disabled={disabled}
            className={className}
          >
            <option value="" disabled>
              Select {label}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleBlurEvent}
            onFocus={handleFocus}
            placeholder={placeholder}
            style={baseInputStyle}
            disabled={disabled}
            className={className}
          />
        )}
      </div>

      {/* Error Message */}
      <div style={{ minHeight: "20px", marginTop: 4 }}>
        {hasError && (
          <span
            style={{
              color: "#FF4444",
              fontSize: "1.3rem",
              display: "block",
            }}
          >
            {error}
          </span>
        )}
      </div>
    </div>
  );
};

export default FormField;
