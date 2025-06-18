import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { onCheckingConfiguracion } from "../store";
import { calendarApi } from "../api";

export const useConfiguracionStore = () => {
  const [error, setError] = useState(null);

  const startRegister = async ({ nombre, monto_cancha, monto_sena }) => {
    try {
      const { data } = await calendarApi.post("/configuracion/crearMonto", {
        nombre,
        monto_cancha,
        monto_sena,
      });
      return {
        ok: true,
        msg: "Precios registrados correctamente",
      };
    } catch (error) {
      console.error("Error al registrar precios:", error);
      return {
        ok: false,
        msg:
          error.response?.data?.msg || "Error desconocido al registrar precios",
      };
    }
  };

  return {
    startRegister,
  };
};
