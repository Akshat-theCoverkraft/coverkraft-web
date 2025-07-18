import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const Dropdown = ({
  label,
  options,
  value,
  onChange,
  fullWidth = true,
  required = false,
  ...props
}) => {
  return (
    <Box sx={{ width: "100%" }}>
      <FormControl fullWidth={fullWidth} variant="standard">
        <label
          htmlFor={`${label}-select`}
          className="form-label fw-bold text-light mb-2 d-block"
        >
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
        <Select
          id={`${label}-select`}
          value={value}
          onChange={onChange}
          displayEmpty
          required={required}
          disableUnderline
          renderValue={(selected) => {
            if (!selected) {
              return <span style={{ color: "#aaa" }}>Select a value</span>;
            }
            // Find label from value
            const selectedOption = options.find((opt) => opt.value === selected);
            return selectedOption ? selectedOption.label : "";
          }}
          style={{
            backgroundColor: "rgb(44, 44, 44)",
            borderRadius: "42px",
            color: value ? "white" : "#aaa",
            padding: "0.5rem 1.25rem 0.5rem 20px",
            height: "48px",
            fontSize: "1.222rem",
            width: "100%",
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: "rgb(44, 44, 44)",
                color: "white",
                borderRadius: "16px",
                mt: 1,
                boxShadow: "none",
              },
            },
            MenuListProps: {
              disablePadding: true,
              sx: {
                padding: 0,
              },
            },
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                backgroundColor: "rgb(44, 44, 44)",
                color: "#ffffff",
                fontSize: "1.222rem",
                "&:hover": {
                  backgroundColor: "#5a5a5a",
                },
                "&.Mui-selected": {
                  backgroundColor: "rgb(44, 44, 44)",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "#5a5a5a",
                },
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>

      </FormControl>
    </Box>
  );
};

Dropdown.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  fullWidth: PropTypes.bool,
  required: PropTypes.bool,
};

export default Dropdown;
