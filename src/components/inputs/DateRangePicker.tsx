import { Box } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDateRangeStore } from "../../zustand/useDateRangeStore";
import { usePaqueteStore } from "../../zustand/usePaquetesStore";

export default function DateRangePickerComponent() { 
  const { fechaInicio, fechaFin, setFechas } = useDateRangeStore();
  const { resetPackages, fetchCounts, fetchAllPaquetes } = usePaqueteStore();

  function fetchData() {
    resetPackages();
    fetchCounts();
    fetchAllPaquetes();
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", gap: 2 }}>
        <DatePicker
          label="Desde"
          value={fechaInicio}
          onChange={(newValue) => {
            if (!newValue) return;
            const nuevoFin = fechaFin.isBefore(newValue) ? newValue : fechaFin;
            setFechas(newValue, nuevoFin);
            fetchData();
          }}
          slotProps={{ textField: { size: "small" } }}
        />
        <DatePicker
          label="Hasta"
          value={fechaFin}
          onChange={(newValue) => {
            if (!newValue) return;
            const nuevoInicio = fechaInicio.isAfter(newValue)
              ? newValue
              : fechaInicio;
            setFechas(nuevoInicio, newValue);
            fetchData();
          }}
          slotProps={{ textField: { size: "small" } }}
        />
      </Box>
    </LocalizationProvider>
  );
}
