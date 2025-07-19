import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { updateUsuario, Usuario } from "../firebase/firestore/usuarios";
import { useUsuariosStore } from "../zustand/useUsuariosStore";

export default function useUserFormik(entity: Usuario) {
  const { fetchAllUsuarios } = useUsuariosStore()
  const [loading, setLoading] = useState(false);

  // Validaciones
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es obligatorio"),
    lastName: Yup.string().required("El apellido es obligatorio"),
    email: Yup.string()
      .email("Correo inválido")
      .required("El correo es obligatorio"),
    countryCode: Yup.string()
      .matches(/^\+\d{1,4}$/, "Prefijo inválido")
      .required("El prefijo es obligatorio"),
    phone: Yup.string()
      .matches(/^\d{7,12}$/, "Número de teléfono inválido")
      .required("El teléfono es obligatorio"),
    lockerCode: Yup.string().required("El cliente es obligatorio"),
  });

  const formik = useFormik({
    initialValues: {
      id: entity?.id ?? "",
      name: entity?.name ?? "",
      lastName: entity?.lastName ?? "",
      email: entity?.email ?? "",
      countryCode: entity?.countryCode ?? "",
      phone: entity?.phone ?? "",
      lockerCode: entity?.lockerCode ?? "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);

      try {
        await updateUsuario(values.id, values);
      } catch (err) {
        console.log({ err });
      } finally {
        setLoading(false);
        fetchAllUsuarios();
      }

    },
  });

  return { ...formik, loading };
}