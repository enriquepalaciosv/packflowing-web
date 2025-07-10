import { Box } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface DateRangePickerProps {
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
  setDate: (inicio: dayjs.Dayjs, fin: dayjs.Dayjs) => void;
  handleChange: () => void;
}

export default function DateRangePickerComponent({ start, end, setDate, handleChange } : DateRangePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", gap: 2 }}>
        <DatePicker
          label="Desde"
          value={start}
          onChange={(newValue) => {
            if (!newValue) return;
            const nuevoFin = end.isBefore(newValue) ? newValue : end;
            setDate(newValue, nuevoFin);
            handleChange()
          }}
          slotProps={{ textField: { size: "small" } }}
        />
        <DatePicker
          label="Hasta"
          value={end}
          onChange={(newValue) => {
            if (!newValue) return;
            const nuevoInicio = start.isAfter(newValue)
              ? newValue
              : start;
            setDate(nuevoInicio, newValue);
            handleChange()
          }}
          slotProps={{ textField: { size: "small" } }}
        />
      </Box>
    </LocalizationProvider>
  );
}
