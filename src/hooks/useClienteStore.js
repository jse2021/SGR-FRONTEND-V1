import React from "react";
import { useDispatch } from "react-redux";
import { calendarApi } from "../api";

export const useClienteStore = () => {
  const dispatch = useDispatch();

  /**
   * REGISTRAR CLIENTES
   */
  const startRegister = async ({ dni, nombre, apellido, email, telefono }) => {
    try {
      const { data } = await calendarApi.post("cliente", {
        dni,
        nombre,
        apellido,
        email,
        telefono,
      });
      if (data?.ok === false) {
        return {
          ok: false,
          msg: data?.msg || "No se pudo registrar el cliente",
        };
      }
      return { ok: true };
    } catch (error) {
      const msg = error.response?.data?.msg;
      return { ok: false, msg };
    }
  };

  return {
    startRegister,
  };
};
