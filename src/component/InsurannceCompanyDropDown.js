import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import API_URL from "../ServiceModule/Service";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import debounce from "lodash.debounce";
import { Box, Avatar } from "@mui/material";

const InsuranceDropdown = ({ onCompanySelect, initialValue }) => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

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
            icon: company.icon || null,
          }));

          setOptions(formatted);
        } catch (err) {
          console.error("Error fetching companies:", err);
          setOptions([]);
        } finally {
          setLoading(false);
        }
      }, 300),
    []
  );

  // Initial fetch
  useEffect(() => {
    fetchCompanies("");
  }, [fetchCompanies]);

  // Match and set initial value
  useEffect(() => {
    if (initialValue && options.length > 0 && !isInitialized) {
      console.log("Matching initialValue:", initialValue);
      const normalizedInitial = normalizeString(initialValue);

      // Try multiple matching strategies
      let match = options.find((opt) => normalizeString(opt.label) === normalizedInitial);
      
      if (!match) {
        match = options.find((opt) => 
          normalizeString(opt.label).includes(normalizedInitial)
        );
      }
      
      if (!match) {
        match = options.find((opt) => 
          normalizedInitial.includes(normalizeString(opt.label))
        );
      }

      if (match) {
        console.log("Found match:", match.label);
        setSelectedOption(match);
        setInputValue(match.label);
        onCompanySelect(match.label); // Send matched label to parent
      } else {
        console.log("No match found, using initial value as-is");
        setInputValue(initialValue);
      }
      
      setIsInitialized(true);
    }
  }, [initialValue, options, isInitialized, onCompanySelect]);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    if (newInputValue) {
      fetchCompanies(newInputValue);
    }
  };

  const handleChange = (event, newValue) => {
    console.log("Dropdown changed to:", newValue);
    setSelectedOption(newValue);

    if (newValue) {
      setInputValue(newValue.label);
      onCompanySelect(newValue.label);
    } else {
      setInputValue("");
      onCompanySelect("");
    }
  };

  const getInitials = (name) => {
    if (!name) return "IC";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Box sx={{ width: "100%" }}>
      <label
        className="form-label fw-bold text-light mb-2 d-block"
        htmlFor="insurance-company-autocomplete"
      >
        Insurance Company <span className="text-danger">*</span>
      </label>

      <Autocomplete
        id="insurance-company-autocomplete"
        sx={{
          width: "100%",
          ".MuiInputBase-root": {
            backgroundColor: "rgb(44, 44, 44)",
            color: "#fff",
            borderRadius: "42px",
            fontSize: "1.222rem",
            paddingLeft: "0.5rem",
            paddingRight: "0.5rem",
            height: "48px",
            border: "none",
            outline: "none",
            marginBottom: '11px'
          },
          ".MuiOutlinedInput-notchedOutline": { border: "none" },
          "& .Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
          "& .MuiInputLabel-root": { display: "none" },
          "& .MuiAutocomplete-popupIndicator": { color: "#fff" },
          "& .MuiAutocomplete-clearIndicator": { color: "#fff" },
        }}
        getOptionLabel={(option) => option.label || ""}
        options={options}
        loading={loading}
        value={selectedOption}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            key={option.value}
            sx={{
              display: "flex !important",
              alignItems: "center",
              gap: 1.5,
              padding: "8px 16px !important",
              backgroundColor: "#2c2c2c !important",
              color: "#fff !important",
              "&:hover": { backgroundColor: "#3a3a3a !important" },
            }}
          >
            <Avatar
              variant="rounded"
              src={option?.icon || undefined}
              sx={{
                width: 32,
                height: 32,
                backgroundColor: option?.icon ? "transparent" : "#00bcd4",
                fontSize: "0.875rem",
                fontWeight: "600",
              }}
            >
              {!option?.icon && getInitials(option.label)}
            </Avatar>
            <span style={{ fontSize: "1.222rem", fontWeight: "100" }}>
              {option.label}
            </span>
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Select an insurance company"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              style: {
                color: "#fff",
                fontSize: "1.222rem",
                fontWeight: "100",
                paddingLeft: "8px",
              },
              startAdornment: (
                <>
                  <Avatar
                    variant="rounded"
                    src={selectedOption?.icon || undefined}
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: selectedOption?.icon
                        ? "transparent"
                        : selectedOption
                        ? "#00bcd4"
                        : "#555",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      marginRight: 1,
                    }}
                  >
                    {!selectedOption?.icon &&
                      (selectedOption
                        ? getInitials(selectedOption.label)
                        : "IC")}
                  </Avatar>
                  {params.InputProps.startAdornment}
                </>
              ),
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        ListboxProps={{
          sx: {
            backgroundColor: "#2c2c2c",
            border: "1px solid #444",
            maxHeight: "300px",
            "& .MuiAutocomplete-option": {
              backgroundColor: "#2c2c2c !important",
            },
          },
        }}
      />
    </Box>
  );
};

export default InsuranceDropdown;