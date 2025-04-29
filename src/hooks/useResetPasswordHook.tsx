import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { loginAdminService } from "../services/auth/login";
import { useAuthStore } from "../zustand/useAuthStore";
import resetPassword from "../services/auth/reset-password";

export default function useResetPasswordFormik() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Correo inválido")
      .required("El correo es obligatorio"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);

      try {
        await resetPassword(values.email);
      } catch (err) {
        console.log({ err });
      } finally {
        setLoading(false);
      }
    },
  });

  return { ...formik, loading };
}
