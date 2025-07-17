import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CustomInput({
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
}) {
  const inputId = `inputField-${name}`;

  const combinedStyle = {
    padding: "0.5rem",
    backgroundColor: backgroundColor || "#2c2c2c",
    borderRadius: "30px",
    border: validationMessage ? "1px solid red" : "0",
    outline: "none",
    boxShadow: validationMessage ? "0 0 0 2px rgba(255, 0, 0, 0.4)" : "none",
    ...(inputStyle || sx || {}),
  };

  return (
    <div className={`form-outline mb-3 ${fullWidth ? "w-100" : ""}`} style={containerStyle}>
      {label && (
        <label className="form-label fw-bold text-light mb-2 d-block" htmlFor={inputId}>
          {label}
        </label>
      )}

      {type === "select" ? (
        <select
          id={inputId}
          className={`${className}`}
          value={value}
          onChange={onChange}
          name={name}
          style={combinedStyle}
          aria-invalid={!!validationMessage}
        >
          {children}
        </select>
      ) : type === "date" ? (
        <DatePicker
          id={inputId}
          selected={value ? new Date(value) : null}
          onChange={(date) =>
            onChange({
              target: {
                name,
                value: date?.toISOString()?.split("T")[0] || "",
              },
            })
          }
          placeholderText={placeholder}
          name={name}
          dateFormat="dd/MM/yyyy"
          className={className}
          style={combinedStyle}
        />
      ) : (
        <input
          type={type}
          id={inputId}
          className={className}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          name={name}
          style={combinedStyle}
          aria-invalid={!!validationMessage}
        />
      )}

      {validationMessage && (
        <div className="invalid-feedback text-danger d-block">{validationMessage}</div>
      )}
    </div>
  );
}

export default CustomInput;
