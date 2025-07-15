import "./App.css"
import { Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { obtenerAgencia } from "./firebase/firestore/agencia";
import { Agency } from "./interfaces/Agency";
import HomeRoute from "./screens/HomeRoute";
import ProfileRoute from "./screens/ProfileRoute";
import ProtectedRoute from "./screens/ProtectedRoute";
import LoginRoute from "./screens/auth/LoginRoute";
import RegisterRoute from "./screens/auth/RegisterRoute";
import ResetPasswordScreen from "./screens/auth/ResetPasswordRoute";
import PrivacyPolicyScreen from "./screens/PrivacyPolicy";
import { useAgenciaStore } from "./zustand/useAgenciaStore";
import UsersRoute from "./screens/UsersRoute";
import AnalyticsRoute from "./screens/AnalyticsRoute";

function App() {
  const { setAgencia, agencia } = useAgenciaStore();

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
      <Typography sx={{ textAlign: "center" }}>Cargando...</Typography>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          {agencia.registrarUsuarios && (
            <Route path="/register" element={<RegisterRoute />} />
          )}
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyScreen />} />
          <Route path="/reset-password" element={<ResetPasswordScreen />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomeRoute />} />            
            <Route path="/users" element={<UsersRoute />} />
            <Route path="/analytics" element={<AnalyticsRoute />} />
            <Route path="/settings" element={<ProfileRoute />} />
          </Route>
          <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
