import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CustomInput({
  type = "text",
  label,
  value,
  onChange,
  isValid,
  className = "",
  placeholder,
  onKeyDown,
  validationMessage,
  required = false,
  showAsterisk = true,
  name = "",
  children,
  backgroundColor,
  inputStyle,
  sx,
  padding = "0.5rem",
  fullWidth = true,
  containerStyle = {},
}) {
  const inputId = `inputField-${name}`;

  const baseClassNames =
    "form-control form-control-lg bg-dark text-light border-2 border-grey shadow-md focus:border-primary focus:ring-2 focus:ring-primary transition duration-300 ";

  const combinedStyle = {
    padding,
    backgroundColor: backgroundColor || "#2c2c2c",
    borderRadius: "30px",
    ...(!inputStyle && !sx ? {} : {}), // apply base only if no style provided
    ...(inputStyle || sx || {}), // override with provided style
  };

  return (
    <div
      data-mdb-input-init
      className={`form-outline mb-3 ${fullWidth ? "w-100" : ""}`}
      style={containerStyle}
    >
      {label && (
        <label className="form-label fw-bold text-light mb-2 d-block" htmlFor={inputId}>
          {label}
          {required && showAsterisk && <span className="text-danger">*</span>}
        </label>
      )}

      {type === "select" ? (
        <select
          id={inputId}
          className={`${baseClassNames} ${className}`}
          value={value}
          onChange={onChange}
          name={name}
          style={combinedStyle}
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
          className={`${baseClassNames} ${className}`}
          placeholderText={placeholder}
          name={name}
          dateFormat="dd/MM/yyyy"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          onKeyDown={onKeyDown}
          style={combinedStyle}
          calendarClassName="custom-datepicker"
        />
      ) : (
        <input
          type={type}
          id={inputId}
          //className={`${baseClassNames} ${className}`}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          name={name}
          style={combinedStyle}
        />
      )}

      {validationMessage && (
        <div className="invalid-feedback text-danger">{validationMessage}</div>
      )}
    </div>
  );
}

export default CustomInput;
