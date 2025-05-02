import DeleteIcon from "@mui/icons-material/Delete";
import { Grid, IconButton, MenuItem, Select } from "@mui/material";
import Fee from "../interfaces/Fee";
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
      <Grid size={{ xs: 5 }}>
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
      <Grid size={{ xs: 3 }}>
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
      <Grid size={{ xs: 3 }}>
        <Select
          value={tarifa.moneda}
          onChange={(e) =>
            setFieldValue(`tarifas[${index}].moneda`, e.target.value)
          }
          onBlur={handleBlur}
          name={`tarifas[${index}].moneda`}
          fullWidth
          size="small"
          error={touched?.moneda && !!error?.moneda}
        >
          <MenuItem value="USD">USD</MenuItem>
          <MenuItem value="C$">C$</MenuItem>
        </Select>
      </Grid>
      <Grid size={{ xs: 1 }} display="flex" justifyContent="center">
        <IconButton onClick={() => onRemove(index)}>
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}
