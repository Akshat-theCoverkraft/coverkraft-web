import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TextField } from '@mui/material';
import './GlobalDatePicker.css'; // Assuming you have this CSS file

const GlobalDatePicker = ({ selectedDate, handleDateChange, label, className, placeholder }) => {
  return (
    <div className="global-date-picker">
      <label className='' >{label}</label><br/>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="MM/dd/yyyy"
        className={`form-control py-5 form-control-lg custom-border ${className}`}
        placeholder={placeholder}
        popperClassName="custom-datepicker" // Custom class for additional styling
        renderInput={(params) => (
          <TextField {...params} sx={{ width: '118%' }} className="custom-datepicker-textfield"/>
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
};

export default GlobalDatePicker;
