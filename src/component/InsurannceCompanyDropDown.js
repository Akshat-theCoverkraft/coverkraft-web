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
        options.find((opt) => opt.value === initialValue) ||
        options.find(
          (opt) => normalizeString(opt.label).includes(normalizedInitial)
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
      onCompanySelect(newValue.label); // ✅ pass company name instead of id
    } else {
      setInputValue(initialValue || "");
      onCompanySelect("");
    }
  };

  // Get initials for avatar
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
        Select Insurance Company <span className="text-danger">*</span>
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
        value={selectedOption || { label: inputValue, value: "" }}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
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