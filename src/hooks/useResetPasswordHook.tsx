import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import resetPassword from "../services/auth/reset-password";

export default function useResetPasswordFormik() {
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
