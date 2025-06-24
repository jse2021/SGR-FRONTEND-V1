import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { LoginPage } from "../auth";
import {
  CalendarPage,
  AltaUsuario,
  AltaCliente,
  ConsultarUsuario,
  AltaCancha,
  ConsultarCancha,
  PrecioCancha,
  PagosDeReserva,
  Recaudacion,
  FormaPago,
  ConsultarCliente,
  ReservaPorCliente,
  ReservasFecha,
} from "../calendar";
import { useAuthStore } from "../hooks";
import "./AppRouter.css";

export const AppRouter = () => {
  const { status, checkAuthToken, user } = useAuthStore();
  const usuario = user.tipo_usuario;
  console.log(usuario);

  useEffect(() => {
    checkAuthToken();
  }, []);

  if (status === "checking") {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden"></span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {status === "not-authenticated" ? (
        <>
          <Route path="/auth/*" element={<LoginPage />} />
          <Route path="/*" element={<Navigate to="/auth/login" />} />
        </>
      ) : (
        <>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/pages/CalendarPage" element={<CalendarPage />} />

          {/* Rutas comunes */}
          <Route path="/AltaCliente" element={<AltaCliente />} />
          <Route path="/ConsultarCliente" element={<ConsultarCliente />} />
          <Route path="/ReservaDelaFecha" element={<ReservasFecha />} />
          <Route path="/PagosDeReserva" element={<PagosDeReserva />} />
          <Route path="/AltaCancha" element={<AltaCancha />} />
          <Route path="/ConsultarCancha" element={<ConsultarCancha />} />
          <Route path="/PrecioCancha" element={<PrecioCancha />} />

          {/* Condicional por tipo de usuario */}
          {usuario === "Administrador" && (
            <>
              <Route path="/AltaUsuario" element={<AltaUsuario />} />
              <Route path="/ConsultarUsuario" element={<ConsultarUsuario />} />
              <Route path="/Recaudacion" element={<Recaudacion />} />
              <Route path="/FormasPago" element={<FormaPago />} />
            </>
          )}

          <Route path="/*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
};
