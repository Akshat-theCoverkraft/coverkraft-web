import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { TextField, IconButton, InputAdornment } from '@mui/material';

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

    const formattedDate = selectedDate
        ? `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`
        : '';

    return (
        <TextField
            variant="outlined"
            value={formattedDate}
            placeholder={props.label}
            onClick={(e) => e.preventDefault()}
            InputProps={{
                readOnly: true,
                endAdornment: props.isIcon ? (
                    <InputAdornment position="end">
                        <IconButton onClick={() => document.getElementById('date-picker').focus()}>
                            <FontAwesomeIcon icon={faCalendar} />
                        </IconButton>
                    </InputAdornment>
                ) : null,
            }}
            sx={{
                width: '100%',
                marginTop: '10px',
                '& .MuiOutlinedInput-root': {
                    borderRadius: '28px',
                },
            }}
        >
            <DatePicker
                selected={selectedDate}
                onChange={handleChange}
                dateFormat="dd/MM/yyyy"
                id="date-picker"
                popperPlacement="bottom"
                maxDate={moment().subtract(18, 'years').toDate()}
                minDate={moment().subtract(120, 'years').toDate()}
                customInput={<input style={{ display: 'none' }} />}
            />
        </TextField>
    );
};

export default DateTimePicker;
