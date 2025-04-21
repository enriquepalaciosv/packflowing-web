import { Container, Typography } from "@mui/material";
import AppBar from "../components/AppBar";
import NavBar from "../components/NavBar";
import { useAgenciaStore } from "../zustand/useAgenciaStore";

export default function HomeRoute() {
  const { agencia } = useAgenciaStore();

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
      <Container maxWidth={false} sx={{ mt: 1, p: 0, ml: "17%", width: "83%" }}>
        <NavBar />
      </Container>
    </>
  );
}
