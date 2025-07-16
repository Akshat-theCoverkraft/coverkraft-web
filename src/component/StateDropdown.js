import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dropdown.css";
import API_URL from "../ServiceModule/Service";

const GlobalDropdown = ({
  onStateSelect,
  initialValue,
  required = false,
  className = "",
  style = {},
}) => {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`${API_URL}state/getAll`);
        const optionsData = response.data.data.map((item) => ({
          value: item._id,
          label: item.stateNameEnglish,
        }));
        setOptions(optionsData);
      } catch (error) {
        console.error("Error fetching options:", error);
        setError("Failed to load options");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    setSelectedValue(initialValue);
  }, [initialValue]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    onStateSelect(newValue);
  };

  const defaultStyle = {
    padding: "0.5rem",
    backgroundColor: "#2c2c2c",
    borderRadius: "1rem",
    color: "#fff",
    border: "2px solid #444",
    minHeight: "2.5rem",
  };

  const finalStyle = Object.keys(style).length > 0 ? style : defaultStyle;

  return (
    <div className="dropdown-container">
      <label className="dropdown-label text-light" htmlFor="stateDropdown">
        Select State{required && <span className="text-danger">*</span>}
      </label>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="dropdown-error">{error}</p>
      ) : (
        <select
          id="stateDropdown"
          className={`dropdown-select ${className}`}
          value={selectedValue}
          onChange={handleChange}
          required={required}
          style={finalStyle}
        >
          <option value="" disabled>
            Select a state
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default GlobalDropdown;
