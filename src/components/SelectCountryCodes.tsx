import React from "react";
import PhoneInput from "react-country-phone-input";
import "react-country-phone-input/lib/style.css";
import { Box, Typography } from "@mui/material";

interface SelectCountryCodesProps {
  name: string;
  label: string;
  value: string;
  error: boolean;
  errorText: string;
  setFieldValue: (field: string, value: any) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export default function SelectCountryCodes({
  name,
  label,
  value,
  error,
  errorText,
  setFieldValue,
  handleBlur,
}: SelectCountryCodesProps) {
  return (
    <Box sx={{ width: "100%", maxWidth: 200, maxHeight: "40px" }}>
      <PhoneInput
        value={value}
        onChange={(phone) => setFieldValue(name, `+${phone}`)}
        onBlur={handleBlur}
        preferredCountries={["us", "ni"]}
        inputStyle={{
          width: "100%",
          borderColor: error ? "#f44336" : "#ccc",
          height: "100%",
        }}
        placeholder={label}
        specialLabel={label}
        buttonStyle={{ height: "100%" }}
        containerStyle={{ height: "100%" }}
        searchStyle={{ height: "100%" }}
        inputProps={{
          name,
        }}
      />
      {error && (
        <Typography variant="caption" color="error">
          {errorText}
        </Typography>
      )}
    </Box>
  );
}
