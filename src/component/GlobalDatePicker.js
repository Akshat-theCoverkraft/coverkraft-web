import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './GlobalDatePicker.css';

const GlobalDatePicker = ({
  selectedDate,
  handleDateChange,
  placeholder,
  className,
  error = false,
  validationMessage = '',

}) => {
  return (
    <div className="">
      <DatePicker
        
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="MM/dd/yyyy"
        placeholderText={placeholder}
        className={`custom-date-input ${className} ${error ? 'date-picker-error' : ''}`}
        popperClassName="custom-datepicker"
      />
      {error && validationMessage && (
        <div className="invalid-feedback text-danger d-block">{validationMessage}</div>
      )}
    </div>
  );
};

GlobalDatePicker.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  handleDateChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  className: PropTypes.string,
  error: PropTypes.bool,
  validationMessage: PropTypes.string,
};

export default GlobalDatePicker;
