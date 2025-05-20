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
    <Box sx={{ width: { xs: "40%", md: "30%" } }}>
      <PhoneInput
        value={value}
        onChange={(phone) => setFieldValue(name, `+${phone}`)}
        onBlur={handleBlur}
        preferredCountries={["us", "ni"]}
        inputStyle={{
          width: "100%",
          borderColor: error ? "#f44336" : "#CCCCCC",
          height: "40px",
          paddingLeft: "50%",
        }}
        placeholder={label}
        specialLabel={label}
        buttonStyle={{
          width: "40%",
          height: "40px",
          borderColor: error ? "#f44336" : "#CCCCCC",
          borderRightColor: "#CCCCCC",
          paddingRight: "5px",
        }}
        containerStyle={{ height: "40px" }}
        searchStyle={{ height: "40px" }}
        inputProps={{
          name,
        }}
      />
      {error && (
        <Typography
          fontSize={12}
          marginTop={0.5}
          color="error"
          sx={{ width: "max-content" }}
        >
          {errorText}
        </Typography>
      )}
    </Box>
  );
}
