import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { Paquete } from "../firebase/firestore/paquetes";
import { Usuario } from "../firebase/firestore/usuarios";

interface Props {
  selectedUser: Usuario;
  paquetes: Partial<Paquete>[];
  handleBack: () => void;
  handleSave: () => void;
  isLoading: boolean;
}

export default function StepResumen({
  selectedUser,
  paquetes,
  handleBack,
  handleSave,
  isLoading,
}: Props) {
  return (
    <Box
      sx={{
        minHeight: 300,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ px: 2 }}>
        <Typography variant="h6" gutterBottom>
          Resumen del paquete
        </Typography>

        {/* Usuario */}
        <Typography variant="subtitle1" gutterBottom>
          Usuario
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, width: "auto !important" }}>
          {selectedUser ? (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography>
                  <strong>Nombre:</strong> {selectedUser.name}{" "}
                  {selectedUser.lastName}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography>
                  <strong>Locker:</strong> {selectedUser.lockerCode}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography>
                  <strong>Email:</strong> {selectedUser.email}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography>
                  <strong>Teléfono:</strong> {selectedUser.phone}
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Typography color="text.secondary">
              No se seleccionó un usuario.
            </Typography>
          )}
        </Paper>

        {/* Paquetes */}
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ marginBottom: 1, marginTop: 1 }}
        >
          Paquetes
        </Typography>

        {paquetes.length === 0 ? (
          <Typography color="text.secondary">
            No hay paquetes cargados.
          </Typography>
        ) : (
          paquetes.map((paquete, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{ p: 2, width: "auto !important", marginBottom: 1 }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Paquete #{index + 1}
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography>
                    <strong>Contenido:</strong> {paquete.contenido || "-"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography>
                    <strong>Rastreo:</strong> {paquete.idRastreo || "-"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography>
                    <strong>Peso:</strong> {paquete.peso?.monto ?? "-"}{" "}
                    {paquete.peso?.unidad ?? ""}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography>
                    <strong>Vía:</strong> {paquete.via || "-"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography>
                    <strong>Tarifa:</strong> {paquete.tarifa?.moneda ?? ""}{" "}
                    {paquete.tarifa?.monto ?? "-"}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          ))
        )}
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Button onClick={handleBack} sx={{ mr: 1 }}>
          Anterior
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button onClick={handleSave} variant="contained" disabled={isLoading}>
          {isLoading ? "Guardando..." : "Guardar"}
        </Button>
      </Box>
    </Box>
  );
}
