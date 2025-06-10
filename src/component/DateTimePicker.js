import React, { useState, useEffect, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { THEME_COLOR } from '../constants';
import moment from 'moment';

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

    // Custom input for react-datepicker using MUI TextField
    const CustomInput = forwardRef(({ value, onClick }, ref) => (
        <TextField
            variant="outlined"
            value={value}
            placeholder={props.label}
            onClick={onClick}
            inputRef={ref}
            InputProps={{
                readOnly: true,
                endAdornment: props.isIcon && (
                    <InputAdornment position="end">
                        <IconButton>
                            <FontAwesomeIcon icon={faCalendar} />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            sx={{
                width: '100%',
                marginTop: '10px',
                '& .MuiOutlinedInput-root': {
                    borderRadius: '28px',
                    background: 'rgb(33 37 41)',
                    color: THEME_COLOR.COLOR
                },
            }}
        />
    ));

    return (
        <DatePicker
            selected={selectedDate}
            onChange={handleChange}
            dateFormat="dd/MM/yyyy"
            maxDate={moment().subtract(18, 'years').toDate()}
            minDate={moment().subtract(120, 'years').toDate()}
            customInput={<CustomInput />}
            popperPlacement="bottom"
        />
    );
};

export default DateTimePicker;
