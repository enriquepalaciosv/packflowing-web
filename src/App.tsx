import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginRoute from "./screens/auth/LoginRoute";
import HomeRoute from "./screens/HomeRoute";
import ProtectedRoute from "./screens/ProtectedRoute";
import { useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  // guardarAgenciaDefault,
  obtenerAgencia,
} from "./firebase/firestore/agencia";
import { useAgenciaStore } from "./zustand/useAgenciaStore";
import RegisterRoute from "./screens/auth/RegisterRoute";
import { Typography } from "@mui/material";
import { ToastContainer } from "react-toastify";
import ProfileRoute from "./screens/ProfileRoute";
import { Agency } from "./interfaces/Agency";
import ResetPasswordScreen from "./screens/auth/ResetPasswordRoute";
import { seedRandomPackages } from "./hardcode";

function App() {
  const { setAgencia, agencia } = useAgenciaStore();

  // hardcode agencia
  // useEffect(() => {
  //   const inicializarAgencia = async () => {
  //     await guardarAgenciaDefault();
  //   };

  //   inicializarAgencia();
  // }, []);

  // Guardar agencia en store
  useEffect(() => {
    const obtenerAgenciaDefault = async () => {
      const agencia = await obtenerAgencia();
      if (agencia) {
        setAgencia(agencia as Agency);
      }
    };

    obtenerAgenciaDefault();
  }, [setAgencia]);

  if (!agencia) {
    return (
      <Typography sx={{ textAlign: "center" }}>Cargando agencia...</Typography>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <ToastContainer />

        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/reset-password" element={<ResetPasswordScreen />} />
          {agencia.registrarUsuarios && (
            <Route path="/register" element={<RegisterRoute />} />
          )}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/profile" element={<ProfileRoute />} />
          </Route>

          <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
