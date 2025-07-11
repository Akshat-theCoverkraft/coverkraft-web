import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import API_URL from "../ServiceModule/Service";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import debounce from "lodash.debounce";
import { Box, Typography } from "@mui/material";

const InsuranceDropdown = ({ onCompanySelect, initialValue }) => {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");

    // Debounced fetch
    const fetchCompanies = useMemo(() =>
        debounce(async (searchTerm) => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}api/dropdown`, {
                    params: { q: searchTerm },
                });

                const formatted = response.data.data.map((company) => ({
                    label: company.label,
                    value: company._id,
                }));

                setOptions(formatted);
            } catch (err) {
                console.error("Error fetching companies:", err);
            } finally {
                setLoading(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        fetchCompanies("");
    }, []);

    useEffect(() => {
        if (initialValue) {
            setSelectedOption((prev) => options.find((opt) => opt.value === initialValue) || null);
        }
    }, [initialValue, options]);

    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
        fetchCompanies(newInputValue);
    };

    const handleChange = (event, newValue) => {
        setSelectedOption(newValue);
        if (newValue) {
            onCompanySelect(newValue.value);
        } else {
            onCompanySelect("");
        }
    };

    return (
  <>
    <Box sx={{ width: "100%", marginY: 1 }}>
      <Typography
        variant="h6"
        sx={{
          color: "#fff",
          marginBottom: 1,
          fontWeight: 600,
          fontSize: "1.4rem",
        }}
      >
        Select Insurance Company <span style={{ color: "#f44336" }}>*</span>
      </Typography>
    </Box>

    <Autocomplete
      id="insurance-company-autocomplete"
      sx={{
        width: "100%",
        ".MuiInputBase-root": {
          backgroundColor: "#1c1c1c",
          color: "#fff",
          borderRadius: "40px", 
          fontSize: "1rem",    
            paddingX: 1.5,
            marginBottom: 2,
        },
        ".MuiOutlinedInput-notchedOutline": {
          borderColor: "#333",
          borderRadius: "40px",
        },
        "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#00bcd4",
        },
        "& .MuiInputLabel-root": {
          display: "none", // Hide floating label
        },
      }}
      getOptionLabel={(option) => option.label || ""}
      options={options}
      loading={loading}
      value={selectedOption}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Select Insurance Company"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            style: { color: "#fff", fontSize: "1rem", borderRadius: "40px" },
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  </>
);
};

export default InsuranceDropdown;
