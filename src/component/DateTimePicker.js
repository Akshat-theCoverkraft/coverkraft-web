import React, { useState, useEffect, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './GlobalDatePicker.css'; // Pull in Global style
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

const DateTimePicker = (props) => {
    const [selectedDate, setSelectedDate] = useState(
        props.value ? new Date(props.value.split('/').reverse().join('-')) : null
    );

    useEffect(() => {
        if (props.value) {
            setSelectedDate(new Date(props.value.split('/').reverse().join('-')));
        }
    }, [props.value]);

    const handleChange = (date) => {
        const formattedDate = date
            ? `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
            : '';
        setSelectedDate(date);
        if (props.onChange) {
            props.onChange(formattedDate);
        }
    };

    const CustomInput = forwardRef(({ value, onClick }, ref) => (
        <div className="global-date-picker" onClick={onClick} ref={ref}>
            <input
                type="text"
                className={`custom-date-input ${props.className || ''} ${props.error ? 'date-picker-error' : ''}`}
                value={value}
                placeholder={props.label || 'Select date'}
                readOnly
            />
            {props.isIcon && (
                <FontAwesomeIcon icon={faCalendar} className="calendar-icon" />
            )}
            {props.error && props.validationMessage && (
                <div className="invalid-feedback text-danger d-block">{props.validationMessage}</div>
            )}
        </div>
    ));

    return (
        <DatePicker
            selected={selectedDate}
            onChange={handleChange}
            dateFormat="dd/MM/yyyy"
            customInput={<CustomInput />}
            popperPlacement="bottom"
            {...(props.minDate ? { minDate: new Date(props.minDate) } : {})}
            {...(props.maxDate ? { maxDate: new Date(props.maxDate) } : {})}
        />
    );
};

export default DateTimePicker;
