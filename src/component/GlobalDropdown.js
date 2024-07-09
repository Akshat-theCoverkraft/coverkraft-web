import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const GlobalDropdown = ({ label, options, value, onChange, fullWidth = true, ...props }) => {
  
  return (
    <Box sx={{ minWidth: 250 }}>
      <FormControl fullWidth={fullWidth}>
        <label id={`${label}-label`} className='fs-6 fw-bold'>{label}</label>
        <Select
          labelId={`${label}-label`}
          id={`${label}-select`}
          value={value}
        //   label={label}
          onChange={onChange}
          
          {...props}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

GlobalDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  fullWidth: PropTypes.bool,
};

export default GlobalDropdown;
