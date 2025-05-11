// components/FormPackage/StepPaquetes.tsx
import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import PaqueteItem from "./PackageItem";
import { Paquete } from "../firebase/firestore/paquetes";
import { useAgenciaStore } from "../zustand/useAgenciaStore";

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
  const { agencia } = useAgenciaStore();
  const [touched, setTouched] = React.useState<{
    [index: number]: Partial<Record<keyof Paquete, boolean>>;
  }>({});

  const handleAgregarPaquete = () => {
    setPaquetes([
      ...paquetes,
      {
        idRastreo: "",
        via: "aereo",
        contenido: "",
        tarifa: agencia?.tarifas[0],
        peso: {
          monto: 0,
          unidad: "kg",
        },
      },
    ]);
  };

  const handleBlur = (index: number, field: keyof Paquete) => {
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
              touched={!!touched[index]}
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
            !paquetes.every((p) => p.idRastreo?.trim() && p.contenido?.trim())
          }
        >
          Siguiente
        </Button>
      </Box>
    </Box>
  );
}
