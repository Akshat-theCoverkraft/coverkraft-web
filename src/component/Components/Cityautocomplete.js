import React, { useState, useRef, useEffect } from "react";

const CityAutocomplete = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder = "Search and select city",
  disabled = false,
  stateId, // Required: the selected state ID to fetch cities
  apiBaseUrl = "https://api.thecoverkraft.com", // API base URL
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
  const wrapperRef = useRef(null);

  console.log("stateId--", stateId)

  // Fetch cities when stateId changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!stateId) {
        setCities([]);
        setFilteredOptions([]);
        return;
      }

      setLoading(true);
    //   setError(null);

      try {
        const response = await fetch(
          `${apiBaseUrl}/city/getAll?stateId=${stateId}`
        );
        const result = await response.json();

        if (result.status && result.data) {
          // Transform API data to options format
          const cityOptions = result.data.map((city) => ({
             id: city._id,
             value: city.cityNameEnglish,
            label: city.cityNameEnglish
          }));
          setCities(cityOptions);
          setFilteredOptions(cityOptions);
        } else {
          setCities([]);
          setFilteredOptions([]);
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
        // setError("Failed to load cities");
        setCities([]);
        setFilteredOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [stateId, apiBaseUrl]);

  // Update filtered options when search term changes
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredOptions(cities);
    } else {
      const filtered = cities.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, cities]);

  // Set search term to selected value
  useEffect(() => {
    if (value && cities.length > 0) {
      const selectedCity = cities.find((city) => city.value === value || city.label === value);
      if (selectedCity) {
        setSearchTerm(selectedCity.label);
      }
    } else {
      setSearchTerm("");
    }
  }, [value, cities]);

  // Reset city when state changes
  useEffect(() => {
    if (value) {
      onChange(""); // Clear selected city when state changes
      setSearchTerm("");
    }
  }, [stateId]);

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

  const isDisabled = disabled || loading || !stateId;

  return (
    <div style={{ marginBottom: 0 }} ref={wrapperRef}>
      <label
        style={{
          color: "#fff",
          fontSize: "1.5rem",
          marginBottom: 8,
          fontWeight: 500,
          display: "block",
        }}
      >
        {label} <span style={{ color: "#FF4444" }}>*</span>
      </label>

      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={
            !stateId
              ? "Please select a state first"
              : loading
              ? "Loading cities..."
              : placeholder
          }
          disabled={isDisabled}
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
            cursor: isDisabled ? "not-allowed" : "text",
            opacity: isDisabled ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isDisabled) {
              e.target.style.borderColor = "#8AC642";
            }
          }}
          onMouseLeave={(e) => {
            if (!isDisabled) {
              e.target.style.borderColor = error && touched ? "#f44336" : "#444";
            }
          }}
          onFocusCapture={(e) => {
            if (!isDisabled) {
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
          {loading ? "⏳" : isOpen ? "▲" : "▼"}
        </div>

        {/* Dropdown List */}
        {isOpen && !isDisabled && (
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
                  key={option.value}
                  onClick={() => handleOptionClick(option)}
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    color: "#fff",
                    backgroundColor:
                      value === option.value || value === option.label ? "#2a2a2a" : "transparent",
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
                      value === option.value || value === option.label ? "#2a2a2a" : "transparent";
                  }}
                >
                  <div>{option.label}</div>
                  {option.labelHindi && (
                    <div style={{ fontSize: "0.85rem", color: "#999" }}>
                      {option.labelHindi}
                    </div>
                  )}
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
                {error ? error : "No cities found"}
              </div>
            )}
          </div>
        )}
      </div>

      {error && touched && (
        <span
          style={{
            color: "#FF4444",
            fontSize: "1.3rem",
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

export default CityAutocomplete;
