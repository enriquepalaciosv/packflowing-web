import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import Fee from "../interfaces/Fee";
import { actualizarAgencia } from "../firebase/firestore/agencia";
import { useAgenciaStore } from "../zustand/useAgenciaStore";

interface ProfileEntity {
  tarifas?: Fee[];
  contacto?: string;
}

const feeSchema = Yup.object({
  nombre: Yup.string().required("El nombre es obligatorio"),
  monto: Yup.number()
    .typeError("Debe ser un número")
    .min(0, "Debe ser mayor o igual a 0")
    .required("El monto es obligatorio"),
  moneda: Yup.string().required("La moneda es obligatoria"),
});

export default function useProfileFormik(entity: ProfileEntity) {
  const { setAgencia } = useAgenciaStore();
  const [loading, setLoading] = useState(false);

  // Validaciones
  const validationSchema = Yup.object().shape({
    tarifas: Yup.array().of(feeSchema).min(1, "Debe haber al menos una tarifa"),
    contacto: Yup.string().required("El número de contacto es obligatorio"),
  });

  // Formik para manejar el formulario
  const formik = useFormik({
    initialValues: {
      tarifas: entity?.tarifas ?? [],
      contacto: entity?.contacto ?? "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);

      try {
        const agency = await actualizarAgencia(values);
        if (agency) {
          setAgencia(agency);
        }
      } catch (err) {
        console.log({ err });
      } finally {
        setLoading(false);
      }
    },
  });

  return { ...formik, loading };
}
