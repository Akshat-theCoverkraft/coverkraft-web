import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TextField } from '@mui/material';
import './GlobalDatePicker.css';

const GlobalDatePicker = ({
  selectedDate,
  handleDateChange,
  label,
  className = '',
  placeholder,
  width,
  sx = {},
}) => {
  // Default fallback sx styles
  const defaultSx = {
    width: width || '118%',
    height: '48%',
    backgroundColor: '#121212',
    borderRadius: '40px',
    color: '#fff',
  };

  // Final sx to apply
  const finalSx = Object.keys(sx).length === 0 ? defaultSx : sx;

  return (
    <div className="global-date-picker">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="MM/dd/yyyy"
        className={`form-control form-control-lg custom-border ${className} bg-dark rounded-5 text-light border-2 border-grey-500 shadow-md focus:border-primary focus:ring-2 focus:ring-primary transition duration-300`}
        style={{padding: "40%"}}
        placeholderText={placeholder}
        popperClassName="custom-datepicker"
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            sx={finalSx}
            className="custom-datepicker-textfield"
          />
        )}
      />
    </div>
  );
};

GlobalDatePicker.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  handleDateChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sx: PropTypes.object,
};

export default GlobalDatePicker;
