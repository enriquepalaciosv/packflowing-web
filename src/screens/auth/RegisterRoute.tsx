import {
  Box,
  Button,
  Container,
  FormControl,
  Stack,
  Typography,
} from "@mui/material";
import useRegisterFormik from "../../hooks/useRegisterHook";
import { useNavigate } from "react-router-dom";
import InputFormik from "../../components/inputs/InputFormik";
import SelectCountryCodes from "../../components/inputs/SelectCountryCodes";
import useBreakpoint from "../../utils/useBreakpoint";

export default function RegisterScreen() {
  const bp = useBreakpoint();
  const navigate = useNavigate();
  const {
    values,
    loading,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
  } = useRegisterFormik();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "95vh",
        width: {
          xs: "100%",
          sm: "100%",
          md: "75%",
          lg: "75%",
        },
        padding: 4,
        gap: 1,
      }}
    >
      <img
        style={{ margin: "0 auto", width: 80 }}
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
        }}
      >
        Registrar usuarios
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
          label="Nombre"
          name="name"
          value={values.name}
          error={!!touched.name && !!errors.name}
          errorText={errors.name ?? ""}
          handleChange={handleChange("name")}
          handleBlur={handleBlur("name")}
        />

        <InputFormik
          label="Apellido"
          name="lastName"
          value={values.lastName}
          error={!!touched.lastName && !!errors.lastName}
          errorText={errors.lastName ?? ""}
          handleChange={handleChange("lastName")}
          handleBlur={handleBlur("lastName")}
        />

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

        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <SelectCountryCodes
            label={"Cód."}
            name={"countryCode"}
            value={values.countryCode}
            error={!!touched.countryCode && !!errors.countryCode}
            errorText={errors.countryCode ?? ""}
            setFieldValue={setFieldValue}
            handleBlur={handleBlur("countryCode")}
          />

          <InputFormik
            label="Teléfono"
            name="phone"
            value={values.phone}
            error={!!touched.phone && !!errors.phone}
            errorText={errors.phone ?? ""}
            handleChange={handleChange("phone")}
            handleBlur={handleBlur("phone")}
            style={{ width: bp === "xs" || bp === "sm" ? "60%" : "70%" }}
          />
        </Stack>

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
          Registrarse
        </Button>

        <Typography sx={{ textAlign: "center" }}>
          Si ya tienes cuenta, ingresa
          <Typography
            component="span"
            onClick={handleLogin}
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
      </FormControl>
    </Container>
  );
}
