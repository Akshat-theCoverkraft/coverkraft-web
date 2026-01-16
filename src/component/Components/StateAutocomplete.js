import React, { useState, useRef, useEffect } from "react";

const StateAutocomplete = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  touched,
  options = [],
  placeholder = "Search and select state",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const wrapperRef = useRef(null);

  // Update filtered options when search term or options change
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  // Set search term to selected value
  useEffect(() => {
    if (value) {
      setSearchTerm(value);
    } else {
      setSearchTerm("");
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    setIsOpen(true);

    // If user clears the input, clear the selection
    if (inputValue === "") {
      onChange("");
    }
  };

  const handleOptionClick = (option) => {
    setSearchTerm(option.label);
    onChange(option.value);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    // Delay to allow option click to register
    setTimeout(() => {
      if (onBlur) {
        onBlur();
      }
    }, 200);
  };

  return (
    <div style={{ marginBottom: 0 }} ref={wrapperRef}>
      <label
        style={{
          color: "#fff",
          fontSize: "1.05rem",
          marginBottom: 8,
          fontWeight: 500,
          display: "block",
        }}
      >
        {label} <span style={{ color: "#f44336" }}>*</span>
      </label>

      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          style={{
            width: "100%",
            padding: "16px 16px",
            fontSize: "1rem",
            color: "#fff",
            backgroundColor: "rgb(44, 44, 44)",
            border: error && touched ? "2px solid #f44336" : "2px solid #444",
            borderRadius: "25px",
            outline: "none",
            transition: "all 0.3s ease",
            cursor: disabled ? "not-allowed" : "text",
            opacity: disabled ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.target.style.borderColor = "#8AC642";
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled) {
              e.target.style.borderColor = error && touched ? "#f44336" : "#444";
            }
          }}
          onFocusCapture={(e) => {
            if (!disabled) {
              e.target.style.borderColor = "#8AC642";
            }
          }}
          onBlurCapture={(e) => {
            setTimeout(() => {
              e.target.style.borderColor = error && touched ? "#f44336" : "#444";
            }, 200);
          }}
        />

        {/* Dropdown Icon */}
        <div
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "#8AC642",
            fontSize: "1.2rem",
          }}
        >
          {isOpen ? "▲" : "▼"}
        </div>

        {/* Dropdown List */}
        {isOpen && !disabled && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              marginTop: "4px",
              backgroundColor: "#1a1a1a",
              border: "2px solid #444",
              borderRadius: "8px",
              maxHeight: "250px",
              overflowY: "auto",
              zIndex: 1000,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
            }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    color: "#fff",
                    backgroundColor:
                      value === option.value ? "#2a2a2a" : "transparent",
                    transition: "background-color 0.2s ease",
                    borderBottom:
                      index < filteredOptions.length - 1
                        ? "1px solid #333"
                        : "none",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#2a2a2a";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor =
                      value === option.value ? "#2a2a2a" : "transparent";
                  }}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: "12px 16px",
                  color: "#999",
                  textAlign: "center",
                }}
              >
                No states found
              </div>
            )}
          </div>
        )}
      </div>

      {error && touched && (
        <span
          style={{
            color: "#f44336",
            fontSize: "0.85rem",
            display: "block",
            marginTop: 4,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default StateAutocomplete;