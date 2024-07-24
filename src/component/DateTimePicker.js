import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import './DateTimePickere.css'; // Import your custom styles if needed

const DateTimePicker = (props) => {
    const [selectedDate, setSelectedDate] = useState(
        props.value ? new Date(props.value.split('/').reverse().join('-')) : null
    );

    useEffect(() => {
        if (props.value) {
            setSelectedDate(new Date(props.value.split('/').reverse().join('-')));
        }
    }, [props.value]);

    const handleDateChange = (date) => {
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        setSelectedDate(date);
        if (props.onChange) {
            props.onChange(formattedDate);
        }
    };

    const formattedDate = selectedDate
        ? `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`
        : '';

    return (
        <div className="datetime-picker-container" style={{ height: props.height }}>
            <input
                type="text"
                className="datetime-picker-input"
                placeholder={props.label}
                readOnly
                value={formattedDate}
                onClick={() => document.getElementById('datepicker').focus()}
            />
            {props.isIcon && (
                <button className="calendar-button" onClick={() => document.getElementById('datepicker').focus()}>
                    <FaCalendarAlt size={24} />
                </button>
            )}
            <DatePicker
                id="datepicker"
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                customInput={<input type="hidden" />}
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default DateTimePicker;
