import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import API_URL from "../ServiceModule/Service";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import debounce from "lodash.debounce";

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
        <Autocomplete
            id="insurance-company-autocomplete"
            sx={{
                width: "100%",
                ".MuiInputBase-root": {
                    backgroundColor: "#1c1c1c",
                    color: "#fff",
                    borderRadius: "8px",
                },
                ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "#333",
                },
                ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#00bcd4",
                },
                ".MuiInputLabel-root": {
                    color: "#ccc",
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
                    label="Select Insurance Company"
                    variant="outlined"
                    InputLabelProps={{ style: { color: "#ccc" } }}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};

export default InsuranceDropdown;
