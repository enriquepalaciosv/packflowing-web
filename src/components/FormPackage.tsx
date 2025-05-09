import { DialogContent } from "@mui/material";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import * as React from "react";
import {
  Paquete,
  PaqueteDto,
  savePaquete,
  updatePaquete,
} from "../firebase/firestore/paquetes";
import { Usuario } from "../firebase/firestore/usuarios";
import { useAgenciaStore } from "../zustand/useAgenciaStore";
import StepPaquetes from "./StepPaquetes";
import StepResumen from "./StepResumen";
import StepUsuario from "./StepUsuarios";
import { toast } from "react-toastify";

const steps = ["Datos del usuario", "Datos Paquetes", "Detalles"];

type FormData = {
  usuario: Usuario | undefined;
  paquetes: Partial<Paquete>[];
};

export default function FormPackage({
  entity,
  onClose,
}: {
  entity?: PaqueteDto;
  onClose: () => void;
}) {
  const { agencia } = useAgenciaStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState<FormData>({
    usuario: entity?.usuario ?? undefined,
    paquetes: [
      {
        id: entity?.id ?? "",
        idRastreo: entity?.idRastreo ?? "",
        via: entity?.via ?? "aereo",
        contenido: entity?.contenido ?? undefined,
        tarifa: entity?.tarifa ?? agencia?.tarifas[0],
        peso: entity?.peso ?? {
          monto: 0,
          unidad: "kg",
        },
      },
    ],
  });

  const handleNext = () =>
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

  const handleBack = () =>
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleUsuario = (usuario: Usuario) =>
    setFormData({ ...formData, usuario });

  const handlePaquetes = (paquetes: Partial<Paquete>[]) =>
    setFormData((prev) => ({ ...prev, paquetes }));

  const handleSave = async () => {
    if (!formData.usuario || formData.paquetes.length === 0) return;
    setIsLoading(true);
    try {
      for (const paquete of formData.paquetes) {
        if (paquete.id) {
          await updatePaquete(paquete.id, {
            ...paquete,
            idUsuario: formData.usuario.id,
          });
        } else {
          await savePaquete({
            ...paquete,
            idUsuario: formData.usuario.id,
          } as Paquete);
        }
      }

      toast.success(
        `${
          formData.paquetes.length === 1
            ? "Paquete guardado con éxito"
            : "Paquetes guardados con éxito"
        }`
      );
    } catch (error) {
      console.error("Error al guardar paquetes:", error);
      toast.error("Ocurrió un error al guardar");
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <DialogContent sx={{ maxWidth: "100%" }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <React.Fragment>
        {activeStep === 0 && (
          <StepUsuario
            selectedUser={formData.usuario}
            setSelectedUser={handleUsuario}
            handleNext={handleNext}
            handleBack={handleBack}
            activeStep={activeStep}
          />
        )}

        {activeStep === 1 && formData.usuario && (
          <StepPaquetes
            paquetes={formData.paquetes}
            setPaquetes={handlePaquetes}
            handleNext={handleNext}
            handleBack={handleBack}
            activeStep={activeStep}
          />
        )}

        {activeStep === 2 && formData.usuario && (
          <StepResumen
            selectedUser={formData.usuario}
            paquetes={formData.paquetes}
            handleBack={handleBack}
            handleSave={handleSave}
            isLoading={isLoading}
          />
        )}
      </React.Fragment>
    </DialogContent>
  );
}
