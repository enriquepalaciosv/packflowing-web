import { Box, Button, Container, FormControl, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import InputFormik from "../../components/InputFormik";
import useLoginFormik from "../../hooks/useLoginHook";
import { useAgenciaStore } from "../../zustand/useAgenciaStore";

export default function LoginRoute() {
  const navigate = useNavigate();
  const { agencia } = useAgenciaStore();
  const {
    values,
    loading,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useLoginFormik();

  const handleRegister = () => navigate("/register");

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
          marginBottom: 2,
        }}
      >
        Iniciar sesión
      </Typography>
      <FormControl sx={{ width: "40%", margin: "0 auto", gap: 3 }}>
        <InputFormik
          label="Correo"
          name="email"
          value={values.email}
          error={!!touched.email && !!errors.email}
          errorText={errors.email ?? ""}
          handleChange={handleChange("email")}
          handleBlur={handleBlur("email")}
          type="email"
          autoCapitalize="none"
        />

        <InputFormik
          label="Contraseña"
          name="password"
          value={values.password}
          error={!!touched.password && !!errors.password}
          errorText={errors.password ?? ""}
          handleChange={handleChange("password")}
          handleBlur={handleBlur("password")}
          type="password"
        />

        <Button
          variant="contained"
          onClick={(e: any) => handleSubmit(e)}
          loading={loading}
          disabled={loading}
          sx={{
            fontWeight: 900,
            borderRadius: 10,
            backgroundColor: "#0f0f0f",
            color: "white",
          }}
        >
          Iniciar sesión
        </Button>

        {agencia?.registrarUsuarios && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 0.5,
              justifyContent: "center",
            }}
          >
            <Typography>Si desea registrar nuevos usuarios, ingresa</Typography>
            <Typography
              onClick={handleRegister}
              style={{
                padding: 0,
                margin: 0,
                color: "0f0f0f",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              aquí
            </Typography>
          </Box>
        )}
      </FormControl>
    </Container>
  );
}