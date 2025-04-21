import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { registerUserService } from "../services/auth/register";

export default function useRegisterFormik() {
  const navigate = useNavigate();
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
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("La contraseña es obligatoria"),
  });

  // Formik para manejar el formulario
  const formik = useFormik({
    initialValues: {
      name: "",
      lastName: "",
      email: "",
      countryCode: "",
      phone: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const admin = { ...values, role: "Admin" };
      setLoading(true);

      try {
        const user = await registerUserService(admin);
        if (user) {
          navigate("/login");
        }
      } catch (err) {
        console.log({ err });
      }

      setLoading(false);
    },
  });

  return { ...formik, loading };
}
