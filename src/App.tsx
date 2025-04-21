import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginRoute from "./screens/auth/LoginRoute";
import HomeRoute from "./screens/HomeRoute";
import ProtectedRoute from "./screens/ProtectedRoute";
import { useEffect } from "react";
import {
  // guardarAgenciaDefault,
  obtenerAgencia,
} from "./firebase/firestore/agencia";
import { Agencia, useAgenciaStore } from "./zustand/useAgenciaStore";
import RegisterRoute from "./screens/auth/RegisterRoute";
import { Typography } from "@mui/material";
import { ToastContainer } from "react-toastify";

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
        setAgencia(agencia as Agencia);
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
    <BrowserRouter>
      <ToastContainer />

      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        {agencia.registrarUsuarios && (
          <Route path="/register" element={<RegisterRoute />} />
        )}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomeRoute />} />
        </Route>

        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
