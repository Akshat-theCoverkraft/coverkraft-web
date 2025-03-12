import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dropdown.css'; // Import the CSS file
import API_URL from '../ServiceModule/Service';

const CityDropdown = ({ selectedStateId,onCitySelect,initialValue }) => {
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
    onCitySelect(event.target.value)
    // You can handle city selection here if needed
  };

  return (
    <div className="dropdown-container">
      <label className="dropdown-label" htmlFor="cityDropdown">Select City<span className='text-danger'>*</span></label>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="dropdown-error">{error}</p>
      ) : (
        <select
          id="cityDropdown"
          className="dropdown-select  rounded-5 bg-dark rounded-5 text-light border-2 border-dark rounded-xl shadow-md focus:border-primary focus:ring-2 focus:ring-primary transition duration-300"
          value={selectedValue}
          onChange={handleChange}
          disabled={!selectedStateId}
        >
          <option value="" disabled>Select a city</option>
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
