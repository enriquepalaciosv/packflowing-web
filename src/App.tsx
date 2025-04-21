import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginRoute from "./screens/LoginRoute";
import HomeRoute from "./screens/HomeRoute";
import ProtectedRoute from "./screens/ProtectedRoute";
import { useEffect } from "react";
import {
  guardarAgenciaDefault,
  obtenerAgencia,
} from "./firebase/firestore/agencia";
import { Agencia, useAgenciaStore } from "./zustand/useAgenciaStore";

function App() {
  const { setAgencia } = useAgenciaStore();

  // hardcode agencia
  useEffect(() => {
    const inicializarAgencia = async () => {
      await guardarAgenciaDefault();
    };

    inicializarAgencia();
  }, []);

  // Guardar agencia en store
  useEffect(() => {
    const obtenerAgenciaDefault = async () => {
      const agencia = await obtenerAgencia();
      if (agencia) {
        setAgencia(agencia as Agencia);
      }
    };

    obtenerAgenciaDefault();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomeRoute />} />
        </Route>

        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
