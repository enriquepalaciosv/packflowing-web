import { Box, Button, Container, FormControl, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import InputFormik from "../../components/inputs/InputFormik";
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
  const handleResetPassword = () => navigate("/reset-password");

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: {
          xs: "100%",
          sm: "100%",
          md: "75%",
          lg: "75%",
        },
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
          fontSize: {
            xs: 20,
            sm: 20,
            md: 25,
            lg: 25,
          },
          textAlign: "center",
          marginBottom: 2,
        }}
      >
        Iniciar sesión
      </Typography>
      <FormControl
        sx={{
          width: {
            xs: "100%",
            sm: "80%",
            md: "60%",
            lg: "40%",
          },
          mx: "auto",
          gap: 2,
        }}
      >
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

        <Box>
          <InputFormik
            label="Contraseña"
            name="password"
            value={values.password}
            error={!!touched.password && !!errors.password}
            errorText={errors.password ?? ""}
            handleChange={handleChange("password")}
            handleBlur={handleBlur("password")}
            handleSubmit={(e: any) => handleSubmit(e)}
            type="password"
          />

          <Button
            variant="text"
            sx={{
              fontSize: "small",
              marginTop: 1,
              textTransform: "none",
              padding: 0,
            }}
            onClick={handleResetPassword}
          >
            ¿Has olvidado tu contraseña?
          </Button>
        </Box>

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
          <Typography sx={{ textAlign: "center" }}>
            Si desea registrar nuevos usuarios, ingresa
            <Typography
              component="span"
              onClick={handleRegister}
              style={{
                padding: 0,
                color: "0f0f0f",
                fontWeight: 700,
                cursor: "pointer",
                marginLeft: 4,
              }}
            >
              aquí
            </Typography>
          </Typography>
        )}
      </FormControl>
    </Container>
  );
}
