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
  const { status, checkAuthToken } = useAuthStore();

  useEffect(() => {
    checkAuthToken();
  }, []);

  if (status === "checking") {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          {/* <div role="status"> */}
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

          <Route path="/AltaUsuario" element={<AltaUsuario />} />
          <Route path="/ConsultarUsuario" element={<ConsultarUsuario />} />

          <Route path="/AltaCancha" element={<AltaCancha />} />
          <Route path="/ConsultarCancha" element={<ConsultarCancha />} />

          <Route path="/PrecioCancha" element={<PrecioCancha />} />

          <Route path="/PagosDeReserva" element={<PagosDeReserva />} />
          <Route path="/Recaudacion" element={<Recaudacion />} />
          <Route path="/FormasPago" element={<FormaPago />} />

          <Route path="/AltaCliente" element={<AltaCliente />} />
          <Route path="/ConsultarCliente" element={<ConsultarCliente />} />

          <Route path="/ReservaPorCliente" element={<ReservaPorCliente />} />
          <Route path="/ReservaDelaFecha" element={<ReservasFecha />} />

          <Route path="/*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
};
