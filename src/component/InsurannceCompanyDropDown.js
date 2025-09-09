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
  console.log("initt", initialValue);
  const normalizeString = (str = "") => str.replace(/\s+/g, "").toLowerCase();
  // Debounced fetch
  const fetchCompanies = useMemo(
    () =>
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
    if (initialValue && options.length > 0) {
      const normalizedInitial = normalizeString(initialValue);

      const match =
        options.find((opt) => opt.value === initialValue) || // id match
        options.find(
          (opt) => normalizeString(opt.label).includes(normalizedInitial) // partial match
        ) ||
        null;

      setSelectedOption(match);
    }
  }, [initialValue, options]);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    fetchCompanies(newInputValue);
  };

  const handleChange = (event, newValue) => {
    setSelectedOption(newValue);

    if (newValue) {
      onCompanySelect(newValue.value); // pass id
    } else {
      // keep typed text visible instead of blacking out
      setInputValue(initialValue || "");
      onCompanySelect("");
    }
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        {/* <Typography
          variant="h6"
          sx={{
            color: "#fff",
            marginBottom: 1,
            fontWeight: 600,
            fontSize: "1.4rem",
          }}
        >
          Select Insurance Company <span style={{ color: "#f44336" }}>*</span>
        </Typography> */}
        <label
          className="form-label fw-bold text-light mb-2 d-block" // ensure tight spacing
          htmlFor="start-date"
        >
          Select Insurance Company <span className="text-danger">*</span>
        </label>
      </Box>

      <Autocomplete
        id="insurance-company-autocomplete"
        sx={{
          width: "100%",
          ".MuiInputBase-root": {
            backgroundColor: "#2c2c2c",
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
        value={selectedOption || { label: inputValue, value: "" }}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              style: {
                color: "#fff",
                fontSize: "1.222rem",
                borderRadius: "40px",
                fontWeight: "100",
              },
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
