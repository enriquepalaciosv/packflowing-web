import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { loginAdminService } from "../services/auth/login";
import { useAuthStore } from "../zustand/useAuthStore";

export default function useLoginFormik() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Correo inválido")
      .required("El correo es obligatorio"),
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("La contraseña es obligatoria"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);

      try {
        const user = await loginAdminService(values);
        if (user) {
          useAuthStore.getState().setUser(user);
          navigate("/");
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
