import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dropdown.css';
import API_URL from '../ServiceModule/Service';

const CityDropdown = ({
  selectedStateId,
  onCitySelect,
  initialValue,
  className = '',
  style = {},
}) => {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedStateId) {
      const fetchOptions = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${API_URL}city/getAll`, {
            params: { stateId: selectedStateId },
          });
          const optionsData = response.data.data.map((item) => ({
            value: item._id,
            label: item.cityNameEnglish,
          }));
          setOptions(optionsData);
        } catch (error) {
          console.error('Error fetching options:', error);
          setError('Failed to load options');
        } finally {
          setLoading(false);
        }
      };

      fetchOptions();
    }
  }, [selectedStateId]);

  useEffect(() => {
    setSelectedValue(initialValue);
  }, [initialValue]);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    onCitySelect(event.target.value);
  };

  // Fallback default inline style if none is passed
  const defaultStyle = {
    padding: '0.5rem',
    backgroundColor: '#2c2c2c',
    borderRadius: '1rem',
    color: '#fff',
    border: '2px solid #ccc',
    minHeight: '2.5rem',
  };

  const finalStyle = Object.keys(style).length > 0 ? style : defaultStyle;

  return (
    <div className="dropdown-container">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="dropdown-error">{error}</p>
      ) : (
        <select
          id="cityDropdown"
          className={`dropdown-select ${className}`}
          value={selectedValue}
          onChange={handleChange}
          disabled={!selectedStateId}
          style={finalStyle}
        >
          <option value="" disabled>
            Select a city
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

export default CityDropdown;
