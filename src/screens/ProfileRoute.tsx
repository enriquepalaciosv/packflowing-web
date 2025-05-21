import { Box, Button, Container, FormGroup, Typography } from "@mui/material";
import { Save, Add } from "@mui/icons-material";
import AppBar from "../components/AppBar";
import FeeItem from "../components/inputs/FeeItem";
import InputFormik from "../components/inputs/InputFormik";
import NavBar from "../components/NavBar";
import useProfileFormik from "../hooks/useProfileHook";
import { useAgenciaStore } from "../zustand/useAgenciaStore";
import { FormikErrors } from "formik";
import Fee from "../interfaces/Fee";

function getArrayItem<T>(
  arr: T | T[] | undefined,
  index: number
): T | undefined {
  return Array.isArray(arr) ? arr[index] : undefined;
}

export default function ProfileRoute() {
  const { agencia } = useAgenciaStore();
  const {
    values,
    initialValues,
    loading,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
    dirty,
  } = useProfileFormik({
    tarifas: agencia?.tarifas,
    contacto: agencia?.contacto,
  });

  return (
    <>
      <AppBar />
      <Container maxWidth={false} sx={{ mt: 1, p: 1, ml: "17%", width: "83%" }}>
        <NavBar />
        <FormGroup
          sx={{
            paddingTop: 2,
            maxWidth: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6">Contacto</Typography>
            <InputFormik
              label="Celular"
              name="contacto"
              // value={values.contacto}
              defaultValue={initialValues.contacto}
              error={!!touched.contacto && !!errors.contacto}
              errorText={errors.contacto ?? ""}
              handleChange={handleChange("contacto")}
              handleBlur={handleBlur("contacto")}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Tarifas</Typography>
              <Button
                variant="contained"
                size="small"
                sx={{ display: "flex", gap: 0.5 }}
                onClick={() => {
                  const nuevasTarifas = [
                    ...values.tarifas,
                    { nombre: "", monto: 0, moneda: "USD" },
                  ];
                  setFieldValue("tarifas", nuevasTarifas);
                }}
              >
                <Add sx={{ width: 12, height: 12 }} />
                Agregar
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxHeight: 200,
                overflowY: "auto",
                paddingTop: 1,
                paddingBottom: 2,
              }}
            >
              {values.tarifas.map((fee, i) => (
                <FeeItem
                  key={i}
                  index={i}
                  tarifa={fee}
                  onRemove={(index) => {
                    const nuevasTarifas = [...values.tarifas];
                    nuevasTarifas.splice(index, 1);
                    setFieldValue("tarifas", nuevasTarifas);
                  }}
                  setFieldValue={setFieldValue}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  error={getArrayItem<FormikErrors<Fee>>(
                    errors.tarifas as FormikErrors<Fee>[],
                    i
                  )}
                  touched={getArrayItem(touched.tarifas, i)}
                />
              ))}
            </Box>
          </Box>
          <Box sx={{ marginLeft: "auto" }}>
            <Button
              onClick={() => handleSubmit()}
              disabled={!dirty || loading}
              size={"small"}
              variant="contained"
              sx={{ display: "flex", gap: 0.5 }}
            >
              <Save sx={{ width: 12, height: 12 }} />
              Guardar
            </Button>
          </Box>
        </FormGroup>
      </Container>
    </>
  );
}
