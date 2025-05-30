import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dropdown.css"; // Import the CSS file
import API_URL from "../ServiceModule/Service";

const GlobalDropdown = ({ onStateSelect, initialValue }) => {
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
    setSelectedValue(event.target.value);
    onStateSelect(event.target.value);
  };

  return (
    <div className="dropdown-container">
      <label className="dropdown-label text-light" htmlFor="stateDropdown">
        Select State<span className="text-danger">*</span>
      </label>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="dropdown-error">{error}</p>
      ) : (
        <select
          id="stateDropdown"
          className="dropdown-select rounded-5 bg-dark rounded-5 text-light border-2 border-dark rounded-xl shadow-md focus:border-primary focus:ring-2 focus:ring-primary transition duration-300"
          value={selectedValue}
          onChange={handleChange}
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
