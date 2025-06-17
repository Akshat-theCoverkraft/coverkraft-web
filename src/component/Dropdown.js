import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { THEME_COLOR } from "../constants";

const Dropdown = ({
  label,
  options,
  value,
  onChange,
  fullWidth = true,
  backgroundColor,
  ...props
}) => {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth={fullWidth}>
        <label
          id={`${label}-label`}
          className="form-label fw-bold text-light mb-3"
        >
          {label}
        </label>
        <Select
          labelId={`${label}-label`}
          id={`${label}-select`}
          value={value}
          // label={label}
          onChange={onChange}
          style={{
            borderRadius: "3rem",
            color: "#fff",
            padding: "0px 10px",
            height: "7vh",
          }}
          sx={{
            fontSize: "1.3rem",
          }}
          className="bg-dark"
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: "#121212 !important",
                color: "#fff",
                marginTop: "1rem",
                borderRadius: "2rem",
              },
            },
          }}
          {...props}
        >
          {options.map((option) => (
            // <MenuItem
            //   key={option.value}
            //   value={option.value}
            //   style={{
            //     backgroundColor: "#212529",
            //     color: THEME_COLOR.COLOR,
            //   }}
            // >
            //   {option.label}
            // </MenuItem>
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                backgroundColor: "#121212",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#343a40",
                },
                "&.Mui-selected": {
                  backgroundColor: "#3E3E3E !important",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "#495057",
                },
                margin: "0.5rem 0px",
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
};

export default Dropdown;
