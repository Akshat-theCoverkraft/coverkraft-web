// CustomInput.jsx
import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CustomInput({
  children,
  onKeyDown = () => { },
  type = "text",
  label,
  value,
  onChange,
  validationMessage,
  placeholder,
  name = "",
  className = "",
  backgroundColor,
  inputStyle,
  sx,
  fullWidth = true,
  containerStyle = {},
  required = false,
}) {
  const inputId = `inputField-${name}`;

  const combinedStyle = {
    padding: "0.5rem",
    backgroundColor: backgroundColor || "#2c2c2c",
    borderRadius: "30px",
    border: validationMessage ? "1px solid red" : "0",
    outline: "none",
    boxShadow: validationMessage ? "0 0 0 2px rgba(255, 0, 0, 0.4)" : "none",
    width: "100%", // Ensures date picker fills the container
    color: "white", // Matching your dark theme
    ...(inputStyle || sx || {}),
  };

  // This internal component ensures the DatePicker looks exactly like your other inputs
  const DateCustomRender = forwardRef(({ value, onClick, placeholder }, ref) => (
    <input
      className={className}
      style={combinedStyle}
      onClick={onClick}
      value={value}
      placeholder={placeholder}
      ref={ref}
      readOnly // Prevents mobile keyboard from popping up on some devices
    />
  ));

  return (
    <div className={`form-outline mb-3 ${fullWidth ? "w-100" : ""}`} style={containerStyle}>
      {label && (
        <label className="form-label fw-bold text-light mb-2 d-block" htmlFor={inputId}>
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      {type === "select" ? (
        <select
          id={inputId}
          className={`${className}`}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          name={name}
          style={combinedStyle}
          aria-invalid={!!validationMessage}
        >
          {children}
        </select>
      ) : type === "date" ? (
        <div className="custom-datepicker-wrapper">
          <DatePicker
            id={inputId}
            selected={value ? new Date(value) : null}
            onChange={(date) =>
              onChange({
                target: {
                  name,
                  value: date ? date.toISOString().split("T")[0] : "",
                },
              })
            }
            onKeyDown={onKeyDown}
            placeholderText={placeholder}
            dateFormat="dd/MM/yyyy"
            // Use the custom renderer to apply your design
            customInput={<DateCustomRender />}
          />
        </div>
      ) : (
        <input
          type={type}
          id={inputId}
          className={className}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          name={name}
          style={combinedStyle}
          aria-invalid={!!validationMessage}
        />
      )}

      {validationMessage && (
        <div className="invalid-feedback text-danger d-block mt-1">{validationMessage}</div>
      )}
    </div>
  );
}

export default CustomInput;