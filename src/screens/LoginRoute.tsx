import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LoginRoute() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("user", "true");
    navigate("/");
  };

  return (
    <Container maxWidth={false} sx={{ mt: 4, p: 0, ml: "17%", width: "83%" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        ¡Hola desde Material UI! Login
      </Typography>
      <Button onClick={handleLogin}>Login</Button>
    </Container>
  );
}
