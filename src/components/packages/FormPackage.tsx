import { DialogContent } from "@mui/material";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import * as React from "react";
import { toast } from "react-toastify";
import {
  Paquete,
  PaqueteDto,
  savePaquete,
  updatePaquete,
} from "../../firebase/firestore/paquetes";
import { Usuario } from "../../firebase/firestore/usuarios";
import { usePaqueteStore } from "../../zustand/usePaquetesStore";
import StepPaquetes from "./StepPaquetes";
import StepResumen from "./StepResumen";
import StepUsuario from "./StepUsuarios";

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
        tarifa: entity?.tarifa ?? undefined,
        peso: entity?.peso ?? {
          monto: 0,
          unidad: "lb",
        },
        rastreo: entity?.rastreo ?? [],
        estado: entity?.estado ?? "recibido",
        createdAt: entity?.createdAt,
        updatedAt: entity?.updatedAt,
        observaciones: entity?.observaciones
      },
    ],
  });
  const { fetchAllPaquetes, fetchCounts } = usePaqueteStore();

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

    const resultados = {
      exitosos: 0,
      fallidos: 0,
    };

    try {
      for (const paquete of formData.paquetes) {
        try {
          const paqueteData = {
            ...paquete,
            idUsuario: formData.usuario.id,
          };

          if (paquete.id) {
            await updatePaquete(paqueteData as Paquete);
          } else {
            await savePaquete(paqueteData as Paquete);
          }

          resultados.exitosos++;
        } catch (error) {
          resultados.fallidos++;
          console.error(`Error al guardar paquete`, paquete, error);
          toast.error(
            `Error en paquete con id de rastreo ${paquete.idRastreo}`
          );
        }
      }

      if (resultados.fallidos === 0) {
        toast.success(
          `${resultados.exitosos} paquete${resultados.exitosos > 1 ? "s" : ""
          } guardado${resultados.exitosos > 1 ? "s" : ""} con éxito`
        );
      } else {
        toast.error(
          `${resultados.fallidos} error${resultados.fallidos > 1 ? "es" : ""
          }, ${resultados.exitosos} guardado${resultados.exitosos > 1 ? "s" : ""
          } con éxito`
        );
      }
    } catch (error) {
      console.error("Error inesperado al guardar paquetes:", error);
      toast.error("Ocurrió un error inesperado");
    } finally {
      await Promise.all([fetchAllPaquetes(), fetchCounts()]);
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
