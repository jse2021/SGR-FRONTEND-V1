import React from "react";
import { useDispatch } from "react-redux";
import { calendarApi } from "../api";

export const useClienteStore = () => {
  const dispatch = useDispatch();

  /**
   * REGISTRAR CLIENTES
   */
  const startRegister = async ({ dni, nombre, apellido, email, celular }) => {
    try {
      const { data } = await calendarApi.post("cliente/crearCliente", {
        dni,
        nombre,
        apellido,
        email,
        celular,
      });
      return { ok: true };
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.msg;
      return { ok: false, msg };
    }
  };

  return {
    startRegister,
  };
};
