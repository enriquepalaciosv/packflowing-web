import { Box, Container, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import AppBar from "../components/AppBar";
import CardStatistic from "../components/cards/CardStatistic";
import NavBar from "../components/NavBar";
import TableUsers from "../components/tables/TableUsers";
import { useAgenciaStore } from "../zustand/useAgenciaStore";
import { useUsuariosStore } from "../zustand/useUsuariosStore";
import DateRangePickerComponent from "../components/inputs/DateRangePicker";
import { useDateRangeStore } from "../zustand/useDateRangeStore";
import CardTopUsers from "../components/cards/CardTop";

export default function UsersRoute() {
  const { agencia } = useAgenciaStore();
  const { fetchAllUsuarios, fetchCounts, countTotal, fetchTopUsuarios, topUsuarios } = useUsuariosStore();
  const { fechaInicio, fechaFin, setFechas } = useDateRangeStore();

  useEffect(() => {
    fetchCounts();
    fetchAllUsuarios();
    fetchTopUsuarios();
  }, [fetchAllUsuarios, fetchCounts, fetchTopUsuarios, fechaInicio, fechaFin]);

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
          <DateRangePickerComponent
            start={fechaInicio}
            end={fechaFin}
            setDate={setFechas}
            handleChange={() => fetchTopUsuarios()}
          />
          <Grid container spacing={2}>
            <CardStatistic
              title="Usuarios registrados"
              count={countTotal}
            />
            {
              topUsuarios.length ?
                topUsuarios.map((usuario, index) => (
                  <CardTopUsers
                    key={index}
                    title={usuario.name + " " + usuario.lastName}
                    total={usuario.total}
                    packages={usuario.packages}
                    position={index + 1}
                  />
                )) : null
            }
          </Grid>
        </Box>
        <TableUsers />
      </Container>
    </>
  );
}
