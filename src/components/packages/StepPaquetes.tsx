// components/FormPackage/StepPaquetes.tsx
import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { Paquete } from "../../firebase/firestore/paquetes";
import PaqueteItem from "./PackageItem";

type FieldPath = keyof Paquete | "peso.monto" | "peso.unidad";

interface Props {
  paquetes: Partial<Paquete>[];
  setPaquetes: (paquetes: Partial<Paquete>[]) => void;
  handleNext: () => void;
  handleBack: () => void;
  activeStep: number;
}

export default function StepPaquetes({
  paquetes,
  setPaquetes,
  handleNext,
  handleBack,
  activeStep,
}: Props) {
  const [touched, setTouched] = React.useState<{
    [index: number]: Partial<Record<FieldPath, boolean>>;
  }>({});

  const handleAgregarPaquete = () => {
    setPaquetes([
      ...paquetes,
      {
        idRastreo: "",
        via: "aereo",
        contenido: "",
        tarifa: undefined,
        peso: {
          monto: 0,
          unidad: "lb",
        },
      },
    ]);
  };

  const handleBlur = (index: number, field: FieldPath) => {
    setTouched((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: true,
      },
    }));
  };

  const handleRemove = (index: number) => {
    setPaquetes(paquetes.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: keyof Paquete,
    value:
      | string
      | { monto: number; moneda: string }
      | { monto: number; unidad: "kg" | "lb" }
  ) => {
    const newPaquetes = [...paquetes];
    newPaquetes[index] = {
      ...newPaquetes[index],
      [field]: value,
    };
    setPaquetes(newPaquetes);
  };

  return (
    <Box
      sx={{
        minHeight: 300,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Información de los paquetes
        </Typography>
        <Stack spacing={2}>
          {paquetes.map((paquete, index) => (
            <PaqueteItem
              key={index}
              index={index}
              paquete={paquete}
              onChange={handleChange}
              onRemove={handleRemove}
              touched={touched[index]}
              onBlur={handleBlur}
              disableRemove={false}
            />
          ))}
          <Button onClick={handleAgregarPaquete} variant="outlined">
            Agregar paquete
          </Button>
        </Stack>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
          Anterior
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button
          onClick={handleNext}
          disabled={
            !paquetes.every((p) => p.idRastreo?.trim() && p.via?.trim())
          }
        >
          Siguiente
        </Button>
      </Box>
    </Box>
  );
}
