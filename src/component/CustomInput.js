// import React from 'react';

// function CustomInput({ type,label, value, onChange,isValid,className, placeholder, onKeyDown,validationMessage ,required}) {
//   return (
//     <div data-mdb-input-init className="form-outline mb-4">
//       <label className="form-label fw-bold" htmlFor="inputField">
//         {label} {required && <span className='text-danger'>*</span>}
//       </label>
//       <input
//         type={type}
//         id="inputField"
//         className={`form-control form-control-lg ${className} `}
//         value={value}
//         onChange={onChange}
//         onKeyDown={onKeyDown}
//         placeholder={placeholder}
//         style={{padding:'28px 15px'}}

//       />
//        {validationMessage && (
//         <div className="invalid-feedback">{validationMessage}</div>
//       )}
//     </div>
//   );
// }

// export default CustomInput;

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
  name = "",
  children,
  backgroundColor,
  inputStyle = {},
  padding = "0.5rem",
  height = "1vh",
}) {
  const inputId = `inputField-${name}`;

  const baseClassNames =
    "form-control form-control-lg bg-dark text-light border-5 border-dark shadow-md focus:border-primary focus:ring-2 focus:ring-primary transition duration-300";

  return (
    <div data-mdb-input-init className="form-outline mb-2">
      <label className="form-label fw-bold text-light mb-3" htmlFor={inputId}>
        {label} {required && <span className="text-danger">*</span>}
      </label>

      {type === "select" ? (
        <select
          id={inputId}
          className={`${baseClassNames} ${className}`}
          value={value}
          onChange={onChange}
          name={name}
          style={{
            padding: "15px 15px",
            backgroundColor: backgroundColor || "#2c2c2c",
            ...inputStyle,
          }}
        >
          {children}
        </select>
      ) : type === "date" ? (
        <DatePicker
          id={inputId}
          selected={value ? new Date(value) : null}
          onChange={(date) =>
            onChange({ target: { name, value: date?.toISOString()?.split("T")[0] || "" } })
          }
          className={`${baseClassNames} ${className}`}
          placeholderText={placeholder}
          name={name}
          dateFormat="dd/MM/yyyy"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          onKeyDown={onKeyDown}
          style={{
            padding: "22px 22px",
            backgroundColor: backgroundColor || "#2c2c2c",
            ...inputStyle,
            borderRadius: "30px",
          }}
          calendarClassName="custom-datepicker"
        />
      ) : (
        <input
          type={type}
          id={inputId}
          className={`${baseClassNames} ${className}`}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          name={name}
          style={{
            padding: "22px 22px",
            backgroundColor: backgroundColor || "#2c2c2c",
            ...inputStyle,
            borderRadius: "30px",
          }}
        />
      )}

      {validationMessage && (
        <div className="invalid-feedback text-danger">{validationMessage}</div>
      )}
    </div>
  );
}

export default CustomInput;
