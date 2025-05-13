import { Delete } from "@mui/icons-material";
import {
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Paquete } from "../firebase/firestore/paquetes";
import { useAgenciaStore } from "../zustand/useAgenciaStore";

type FieldPath = keyof Paquete | "peso.monto" | "peso.unidad";

interface PaqueteItemProps {
  paquete: Partial<Paquete>;
  index: number;
  touched: Partial<Record<FieldPath, boolean>>;
  onChange: (
    index: number,
    field: keyof Paquete,
    value:
      | string
      | { monto: number; moneda: string }
      | { monto: number; unidad: "kg" | "lb" }
  ) => void;
  onBlur: (index: number, field: FieldPath) => void;
  onRemove: (index: number) => void;
  disableRemove: boolean;
  edit?: boolean;
}

export default function PaqueteItem({
  paquete,
  index,
  touched,
  onChange,
  onBlur,
  onRemove,
  disableRemove,
}: PaqueteItemProps) {
  const { agencia } = useAgenciaStore();

  return (
    <Grid container spacing={0.5} alignItems="center" sx={{ marginTop: 2 }}>
      <Grid size={{ xs: 2 }}>
        <TextField
          fullWidth
          label="Id de rastreo"
          size="small"
          value={paquete.idRastreo}
          onBlur={(e) => onBlur(index, "idRastreo")}
          onChange={(e) => onChange(index, "idRastreo", e.target.value)}
          error={touched?.idRastreo && !paquete?.idRastreo?.trim()}
        />
      </Grid>
      <Grid size={{ xs: 2 }}>
        <FormControl fullWidth>
          <InputLabel id={`via-label-${index}`}>Vía</InputLabel>
          <Select
            size="small"
            value={paquete.via}
            label="Vía"
            labelId={`via-label-${index}`}
            onChange={(e) => onChange(index, "via", e.target.value)}
            onBlur={(e) => onBlur(index, "via")}
            error={touched?.via && !paquete?.via}
          >
            <MenuItem value="aereo">Aérea</MenuItem>
            <MenuItem value="maritimo">Marítima</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 2 }}>
        <TextField
          fullWidth
          label="Contenido"
          size="small"
          value={paquete.contenido}
          // onBlur={(e) => onBlur(index, "contenido")}
          onChange={(e) => onChange(index, "contenido", e.target.value)}
          // error={touched?.contenido && !paquete?.contenido?.trim()}
        />
      </Grid>
      <Grid size={{ xs: 3 }} sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          label="Peso"
          type="number"
          value={paquete.peso?.monto ?? 0}
          // onBlur={(e) => onBlur(index, "peso.monto")}
          onChange={(e) =>
            onChange(index, "peso", {
              monto: Number(e.target.value),
              unidad: paquete.peso?.unidad ?? "kg",
            })
          }
          // error={touched?.["peso.monto"] && Number(paquete?.peso?.monto) <= 0}
        />

        <Select
          size="small"
          value={paquete.peso?.unidad ?? "kg"}
          // onBlur={(e) => onBlur(index, "peso.unidad")}
          onChange={(e) =>
            onChange(index, "peso", {
              monto: paquete.peso?.monto ?? 0,
              unidad: e.target.value as "kg" | "lb",
            })
          }
          sx={{ minWidth: 80 }}
          // error={touched?.["peso.unidad"] && !paquete?.peso?.unidad}
        >
          <MenuItem value="kg">kg</MenuItem>
          <MenuItem value="lb">lb</MenuItem>
        </Select>
      </Grid>
      <Grid size={{ xs: 2 }} sx={{ display: "flex" }}>
        <FormControl fullWidth>
          <InputLabel id={`tarifa-label-${index}`}>Tarifa</InputLabel>
          <Select
            size="small"
            value={paquete.tarifa}
            renderValue={(tarifa) => `${tarifa.moneda} ${tarifa.monto}`}
            label="Tarifa"
            labelId={`tarifa-label-${index}`}
            onChange={(e) =>
              onChange(
                index,
                "tarifa",
                // @ts-expect-error
                JSON.parse(e.target.value)
              )
            }
            // onBlur={(e) => onBlur(index, "tarifa")}
            // error={
            //   touched?.tarifa &&
            //   !paquete?.tarifa?.moneda &&
            //   !paquete?.tarifa?.monto
            // }
          >
            {agencia?.tarifas.map((tarifa, index) => (
              <MenuItem value={JSON.stringify(tarifa)}>
                {tarifa.nombre} - {tarifa.moneda} {tarifa.monto}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 1 }}>
        <IconButton onClick={() => onRemove(index)} disabled={disableRemove}>
          <Delete />
        </IconButton>
      </Grid>
    </Grid>
  );
}
