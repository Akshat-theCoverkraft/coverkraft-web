import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dropdown.css";
import API_URL from "../ServiceModule/Service";
import SessionExpiredModal from "../utils/sessionExpireModal";

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
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const navigate = useNavigate(); // navigation hook

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
          console.error('Error fetching options:', error);
          if (error.response?.status === 401) {
            setShowSessionExpired(true);
          } else {
            setError('Failed to load options');
          }
        }  finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);
 const handleSessionExpiredOk = () => {
   // Clear all saved data
  localStorage.clear();
  sessionStorage.clear(); 
    setShowSessionExpired(false);
    navigate('/login');
  };

  useEffect(() => {
    setSelectedValue(initialValue);
  }, [initialValue]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    onStateSelect(newValue);
  };

  const defaultStyle = {
    padding: "0.5rem 0.5rem 0.5rem",
    backgroundColor: "rgb(44, 44, 44)",
    borderRadius: "42px",
    color: "white",
    border: "none",
    outline: "none",
    boxShadow: "none",
    height: "48px",
    fontSize: "1.222rem",
    width: "100%",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
  };

  const finalStyle = Object.keys(style).length > 0 ? style : defaultStyle;

  return (
    <div className="dropdown-container">
      <label class="form-label fw-bold text-light mb-2 d-block" for="inputField-">Select State{required && <span className="text-danger">*</span>}</label>
   <SessionExpiredModal
        visible={showSessionExpired}
        onConfirm={handleSessionExpiredOk}
      />
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
