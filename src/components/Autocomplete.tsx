import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
  AutocompleteRenderInputParams,
  SxProps,
} from "@mui/material";

interface AutocompleteProps<T> {
  options: T[];
  getOptionLabel: (option: T) => string;
  onChange?: (
    event: React.SyntheticEvent<Element, Event>,
    value: T | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<T>
  ) => void;
  onInputChange: (
    event: React.SyntheticEvent<Element, Event>,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => void;
  value: T | null;
  label?: string;
  renderInput: (params: AutocompleteRenderInputParams) => React.ReactNode;
  size: "small" | "medium";
  noOptionsText: string;
  edit?: boolean;
  sx?: SxProps;
  disabled?: boolean;
}

export default function AutocompleteComponent<T>({
  options,
  getOptionLabel,
  onChange,
  disabled,
  onInputChange,
  size,
  value,
  noOptionsText,
  renderInput,
  label,
  sx = {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 2,
    paddingRight: 2,
  },
  edit = true,
}: AutocompleteProps<T>) {
  return (
    <Autocomplete
      sx={sx}
      options={options}
      value={value}
      disabled={!edit || disabled}
      noOptionsText={noOptionsText}
      size={size}
      getOptionLabel={getOptionLabel}
      onInputChange={onInputChange}
      onChange={onChange}
      renderInput={renderInput}
    />
  );
}
