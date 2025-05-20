import { Box, Container, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import AppBar from "../components/AppBar";
import CardStatistic from "../components/CardStatistic";
import NavBar from "../components/NavBar";
import TablePackages from "../components/tables/TablePackages";
import { useAgenciaStore } from "../zustand/useAgenciaStore";
import { usePaqueteStore } from "../zustand/usePaquetesStore";
import DateRangePickerComponent from "../components/inputs/DateRangePicker";

export default function HomeRoute() {
  const { agencia } = useAgenciaStore();
  const {
    countEnTransito,
    countEntregado,
    countListoRetiro,
    countRecibido,
    fetchCounts,
    fetchAllPaquetes,
  } = usePaqueteStore();

  useEffect(() => {
    fetchCounts();
    fetchAllPaquetes();
  }, [fetchAllPaquetes, fetchCounts]);

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
          // startText="Desde"
          // endText="Hasta"
          // value={[from, to]}
          // onChange={([start, end]) => {
          //   if (start && end) setRange(start, end);
          // }}
          />
          <Grid container spacing={2}>
            <CardStatistic
              title="Paquetes en tránsito"
              count={countEnTransito}
            />
            <CardStatistic title="Paquetes entregados" count={countEntregado} />
            <CardStatistic
              title="Paquetes listos para recoger"
              count={countListoRetiro}
            />
            <CardStatistic title="Paquetes recibidos" count={countRecibido} />
          </Grid>
        </Box>
        <TablePackages />
      </Container>
    </>
  );
}
