import { Box, Container, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import AppBar from "../components/AppBar";
import CardStatistic from "../components/CardStatistic";
import NavBar from "../components/NavBar";
import TableUsers from "../components/TableUsers";
import { useAgenciaStore } from "../zustand/useAgenciaStore";
import { useUsuariosStore } from "../zustand/useUsuariosStore";

export default function UsersRoute() {
  const { agencia } = useAgenciaStore();
  const { fetchAllUsuarios, fetchCounts, countTotal } = useUsuariosStore();

  useEffect(() => {
    fetchCounts();
    fetchAllUsuarios();
  }, [fetchAllUsuarios, fetchCounts]);

  if (!agencia?.activo)
    return (
      <Container maxWidth={false} sx={{ mt: 1, p: 0 }}>
        <Typography sx={{ textAlign: "center" }}>
          Servicio no disponible por el momento
        </Typography>
      </Container>
    );

  return (
    <>
      <AppBar />
      <Container maxWidth={false} sx={{ mt: 1, p: 1, ml: "17%", width: "83%" }}>
        <NavBar />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: 2,
          }}
        >
          <Grid container spacing={2}>
            <CardStatistic
              title="Usuarios registrados"
              count={countTotal}
            />
          </Grid>
        </Box>
        <TableUsers />
      </Container>
    </>
  );
}
