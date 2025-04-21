import React from "react";
import { TextField, Typography, Box } from "@mui/material";

interface InputFormikProps {
  name: string;
  label: string;
  defaultValue?: string;
  value: string;
  error: boolean;
  errorText: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  type?: string;
  style?: React.CSSProperties;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export default function InputFormik({
  name,
  label,
  defaultValue = "",
  value,
  error,
  errorText,
  handleChange,
  handleBlur,
  type = "text",
  style = {},
  autoCapitalize = "sentences",
}: InputFormikProps) {
  return (
    <Box style={style}>
      <TextField
        fullWidth
        name={name}
        label={label}
        defaultValue={defaultValue}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        type={type}
        variant="outlined"
        size="small"
        error={error}
        autoComplete="off"
        inputProps={{
          autoCapitalize,
        }}
      />
      {error && (
        <Typography color="error" fontSize={12} marginTop={0.5}>
          {errorText}
        </Typography>
      )}
    </Box>
  );
}
