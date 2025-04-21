import {
  Button,
  Container,
  FormControl,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAgenciaStore } from "../../zustand/useAgenciaStore";

export default function LoginRoute() {
  const navigate = useNavigate();
  const { agencia } = useAgenciaStore();

  const handleLogin = () => {
    localStorage.setItem("user", "true");
    navigate("/");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "75%",
        padding: 4,
        justifyContent: "center",
        gap: 1,
      }}
    >
      <img
        style={{ margin: ".25rem auto", width: 80 }}
        alt="logo"
        src={"/logo.png"}
      />
      <Typography
        sx={{
          color: "#0f0f0f",
          fontWeight: 900,
          fontSize: 25,
          textAlign: "center",
        }}
      >
        Iniciar sesión
      </Typography>
      <FormControl></FormControl>
      <Stack
        sx={{ width: "25%", margin: "0 auto" }}
        spacing={1}
        direction="column"
      >
        {agencia?.registrarUsuarios && (
          <Button variant="contained" onClick={handleRegister}>
            Registro
          </Button>
        )}
        <Button variant="contained" onClick={handleLogin}>
          Login
        </Button>
      </Stack>
    </Container>
  );
}
