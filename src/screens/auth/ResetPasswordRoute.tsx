import { Box, Button, Container, FormControl, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import InputFormik from "../../components/InputFormik";
import useResetPasswordFormik from "../../hooks/useResetPasswordHook";

const ResetPasswordScreen = () => {
  const navigate = useNavigate();
  const {
    values,
    errors,
    touched,
    loading,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useResetPasswordFormik();

  const handleLogin = () => navigate("/login");
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
        Recuperar contraseña
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
          Enviar instrucciones
        </Button>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 0.5,
            justifyContent: "center",
          }}
        >
          <Typography>Volver a </Typography>
          <Typography
            onClick={handleLogin}
            style={{
              padding: 0,
              margin: 0,
              color: "0f0f0f",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Iniciar sesión
          </Typography>
        </Box>
        {/* 

        <View style={styles.footer}>
          <Text>Volver a </Text>
          <Text
            onPress={() => router.push("/sign-in")}
            style={styles.footerLink}
          >
            iniciar sesión
          </Text>
        </View> */}
      </FormControl>
    </Container>
  );
};

export default ResetPasswordScreen;
