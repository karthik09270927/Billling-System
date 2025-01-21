import React, { useState } from "react";
import { TextField, Autocomplete, CircularProgress } from "@mui/material";
import axios from "axios";

const CityAutocomplete: React.FC<{ onCitySelect: (city: string) => void }> = ({ onCitySelect }) => {
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");



  const fetchCitySuggestions = async (query: string) => {
    if (!query) return [];
    
    const apiKey = "d817ad2cdemsh79227f5e92e5063p180d3cjsnf0e6a83781ec"; // Replace with your actual API key
    const url = "https://countriesnow.space/api/v0.1/countries/population/cities";
  
    try {
      const response = await axios.post(
        url,
        { country: query }, // Modify this based on the API's expected payload
        {
          headers: {
            "Content-Type": "application/json",
            "x-rapidapi-host": "countries-cities1.p.rapidapi.com",
            "x-rapidapi-key": apiKey,
          },
        }
      );
      console.log("API Response:", response.data);
      return response.data; // Modify this based on the API's actual response structure
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
      return [];
    }
  };

  const handleInputChange = async (_event: React.ChangeEvent<{}>, value: string) => {
    setInputValue(value);

    if (value.length < 3) return; // Fetch suggestions only after 3 characters
    setLoading(true);

    const suggestions = await fetchCitySuggestions(value);
    setOptions(suggestions); // Update options with the fetched city data

    setLoading(false);
  };

  const handleCitySelect = (_event: React.ChangeEvent<{}>, selectedCity: string | null) => {
    if (selectedCity) {
      onCitySelect(selectedCity);
    }
  };

  return (
    <Autocomplete
      freeSolo
      options={options.map((option) => option.name)} 
      onInputChange={handleInputChange}
      onChange={handleCitySelect}
      inputValue={inputValue}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search city name"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={{
            borderRadius: "100px",
            width: "25%",
            marginBottom: "20px",
            "& .MuiOutlinedInput-root": {
            "& fieldset": {
              border: "none",
              color: "#000000"
            },
          },
          }}
        />
      )}
    />
  );
};

export default CityAutocomplete;
