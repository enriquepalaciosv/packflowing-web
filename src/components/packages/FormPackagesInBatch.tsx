import { GridRowId } from "@mui/x-data-grid";
import { useAgenciaStore } from "../../zustand/useAgenciaStore";
import { useState } from "react";
import {
  Usuario,
  searchUsersByFullNameOrLocker,
} from "../../firebase/firestore/usuarios";
import Fee from "../../interfaces/Fee";
import { updatePackagesInBatch } from "../../firebase/firestore/paquetes";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import STATUS_PACKAGES from "../../utils/statusPackages";
import AutocompleteComponent from "../inputs/Autocomplete";
import { usePaqueteStore } from "../../zustand/usePaquetesStore";

export default function FormPackagesInBatch({
  onClose,
  ids,
}: {
  onClose: () => void;
  ids?: Set<GridRowId>;
}) {
  const { agencia } = useAgenciaStore();
  const tarifas = agencia?.tarifas || [];
  const [selectedField, setSelectedField] = useState<
    "estado" | "idUsuario" | "via" | "tarifa" | null
  >(null);
  const { fetchAllPaquetes, fetchCounts } = usePaqueteStore();

  const [estado, setEstado] = useState("");
  const [cliente, setCliente] = useState<Usuario>();
  const [via, setVia] = useState("");
  const [tarifa, setTarifa] = useState<Fee>();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = async (_: any, newValue: string) => {
    if (newValue.length >= 2) {
      const usuarios = await searchUsersByFullNameOrLocker(newValue);
      setUsuarios(usuarios || []);
    }
  };

  const handleBatchUpdate = async () => {
    if (!ids || ids?.size === 0 || !selectedField) return;

    setIsLoading(true);

    try {
      const idsString = Array.from(ids).map(String);
      await updatePackagesInBatch({
        ids: idsString,
        field: selectedField,
        value:
          selectedField === "estado"
            ? estado
            : selectedField === "idUsuario"
            ? cliente?.id
            : selectedField === "via"
            ? via
            : selectedField === "tarifa"
            ? tarifa
            : "",
      });
      toast.success(`${ids.size} paquete(s) actualizado(s) con éxito`);
    } catch (error) {
      toast.error(`Error al actualizar paquetes. Intente nuevamente`);
    } finally {
      setIsLoading(false);
      onClose();
      await Promise.all([fetchAllPaquetes(), fetchCounts()]);
    }
  };

  return (
    <>
      <Divider />
      <Box display="flex" flexDirection="column" gap={2} mt={2} px={2}>
        <Typography variant="subtitle1" fontWeight="bold">
          Selecciona un campo para editar
        </Typography>

        <Box
          sx={{
            border: "1px solid rgba(0,0,0,.25)",
            borderRadius: 2,
            gap: 6,
            padding: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="subtitle2" fontWeight={600}>
            Cambiar estado
          </Typography>
          <FormControl
            sx={{ width: "80%" }}
            variant="outlined"
            disabled={selectedField !== null && selectedField !== "estado"}
            size="small"
          >
            <InputLabel id="estado-label">Estado</InputLabel>
            <Select
              value={estado}
              onChange={(e) => {
                setSelectedField("estado");
                setEstado(e.target.value);
              }}
              labelId="estado-label"
              id="estado"
              label="Estado"
              size="small"
            >
              {STATUS_PACKAGES.map((status) => (
                <MenuItem key={status} value={status}>
                  {status.replaceAll("_", " ")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            border: "1px solid rgba(0,0,0,.25)",
            borderRadius: 2,
            gap: 6,
            padding: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="subtitle2" fontWeight={600}>
            Cambiar usuario
          </Typography>
          <AutocompleteComponent
            options={usuarios}
            value={cliente}
            disabled={selectedField !== null && selectedField !== "idUsuario"}
            noOptionsText="No hay registros disponibles"
            size="small"
            getOptionLabel={(user) =>
              `${user?.name} ${user?.lastName} — ${user?.lockerCode}`
            }
            onInputChange={(e, value) => {
              setSelectedField("idUsuario");
              handleInputChange(e, value);
            }}
            onChange={(_, value) => {
              setSelectedField("idUsuario");
              if (value) setCliente(value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar usuario por nombre o locker"
              />
            )}
            sx={{ width: "80%" }}
          />
        </Box>

        <Box
          sx={{
            border: "1px solid rgba(0,0,0,.25)",
            borderRadius: 2,
            gap: 6,
            padding: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="subtitle2" fontWeight={600}>
            Cambiar vía
          </Typography>
          <FormControl
            sx={{ width: "80%" }}
            disabled={selectedField !== null && selectedField !== "via"}
            variant="outlined"
            size="small"
          >
            <InputLabel id="via-label">Vía</InputLabel>
            <Select
              value={via}
              onChange={(e) => {
                setSelectedField("via");
                setVia(e.target.value);
              }}
              labelId="via-label"
              id="via"
              label="Vía"
            >
              <MenuItem value="maritimo">Marítimo</MenuItem>
              <MenuItem value="aereo">Aéreo</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            border: "1px solid rgba(0,0,0,.25)",
            borderRadius: 2,
            gap: 6,
            padding: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="subtitle2" fontWeight={600}>
            Cambiar Tarifa
          </Typography>
          <FormControl
            sx={{ width: "80%" }}
            disabled={selectedField !== null && selectedField !== "tarifa"}
            variant="outlined"
            size="small"
          >
            <InputLabel id="tarifa-label">Tarifa</InputLabel>
            <Select
              value={tarifa}
              onChange={(e) => {
                setSelectedField("tarifa");
                // @ts-expect-error
                setTarifa(JSON.parse(e.target.value) as Fee);
              }}
              renderValue={(tarifa) => {
                // @ts-expect-error
                const tarifaParse = JSON.parse(tarifa);
                return `${tarifaParse.moneda} ${tarifaParse.monto}`;
              }}
              labelId="tarifa-label"
              id="tarifa"
              label="Tarifa"
            >
              {tarifas.map((tarifa) => (
                <MenuItem key={tarifa.nombre} value={JSON.stringify(tarifa)}>
                  {tarifa.nombre} - {tarifa.moneda} {tarifa.monto}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Divider sx={{ marginTop: 2 }} />
      <Box display="flex" gap={2} p={2}>
        <Button onClick={onClose} sx={{ mr: 1 }}>
          Cancelar
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button
          onClick={() => handleBatchUpdate()}
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? "Guardando..." : "Guardar"}
        </Button>
      </Box>
    </>
  );
}
