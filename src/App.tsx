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
import { useAgenciaStore } from "./zustand/useAgenciaStore";
import { seedRandomPackages } from "./hardcode";
import UsersRoute from "./screens/UsersRoute";

function App() {
  const { setAgencia, agencia } = useAgenciaStore();

  useEffect(() => {
    // seedRandomPackages recibe un número como parametro
    // El número indica la cantidad de elementos a agregar
    // Descomentar la línea 26 para insertar los elementos
    const addRandomPackages = () => seedRandomPackages(100);
    // addRandomPackages()
  }, []);

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
            <Route path="/users" element={<UsersRoute />} />
          </Route>

          <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
