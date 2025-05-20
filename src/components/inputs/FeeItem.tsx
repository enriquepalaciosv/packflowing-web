import DeleteIcon from "@mui/icons-material/Delete";
import {
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Fee from "../../interfaces/Fee";
import InputFormik from "./InputFormik";

interface FeeItemProps {
  index: number;
  tarifa: Fee;
  onRemove: (index: number) => void;
  setFieldValue: (field: string, value: any) => void;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  error?: Partial<Record<keyof Fee, string>>;
  touched?: Partial<Record<keyof Fee, boolean>>;
}

export default function FeeItem({
  index,
  tarifa,
  onRemove,
  setFieldValue,
  handleChange,
  handleBlur,
  error,
  touched,
}: FeeItemProps) {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid size={{ xs: 4, md: 5 }}>
        <InputFormik
          label="Nombre"
          name={`tarifas[${index}].nombre`}
          value={tarifa.nombre}
          error={!!touched?.nombre && !!error?.nombre}
          errorText={error?.nombre ?? ""}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />
      </Grid>
      <Grid size={{ xs: 3, md: 3 }}>
        <InputFormik
          label="Monto"
          type={"number"}
          name={`tarifas[${index}].monto`}
          value={String(tarifa.monto)}
          error={!!touched?.monto && !!error?.monto}
          errorText={error?.monto ?? ""}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />
      </Grid>
      <Grid size={{ xs: 3, md: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="select-currency">Moneda</InputLabel>
          <Select
            labelId="select-currency"
            id="demo-simple-select"
            value={tarifa.moneda}
            label="Moneda"
            onChange={(e) =>
              setFieldValue(`tarifas[${index}].moneda`, e.target.value)
            }
            size="small"
          >
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="C$">C$</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 1 }} display="flex" justifyContent="center">
        <IconButton onClick={() => onRemove(index)}>
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}
