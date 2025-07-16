import { Button, Container, FormControl, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import InputFormik from "../../components/inputs/InputFormik";
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
        Recuperar contraseña
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
            fontSize: {
              xs: 12,
              sm: 12,
              md: 16,
              lg: 16,
            },
          }}
        >
          Enviar instrucciones
        </Button>

        <Typography
          sx={{
            textAlign: "center",
          }}
        >
          Volver a
          <Typography
            component="span"
            onClick={handleLogin}
            style={{
              padding: 0,
              color: "0f0f0f",
              fontWeight: 700,
              marginLeft: 4,
              cursor: "pointer",
            }}
          >
            Iniciar sesión
          </Typography>
        </Typography>
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