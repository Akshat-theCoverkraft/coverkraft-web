import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TextField } from '@mui/material';
import './GlobalDatePicker.css'; // Assuming you have this CSS file

const GlobalDatePicker = ({ selectedDate, handleDateChange, label, className, placeholder, width }) => {
  return (
    <div className="global-date-picker">
      <label className='form-label fw-bold text-light' style={{fontSize:'15px'}} >{label}<span className='text-danger'>*</span></label><br/>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="MM/dd/yyyy"
        className={`form-control py-3 form-control-lg custom-border ${className} bg-dark rounded-5 text-light border-2 border-dark rounded-xl shadow-md focus:border-primary focus:ring-2 focus:ring-primary transition duration-300`}
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
