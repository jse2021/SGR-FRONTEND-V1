import { useDispatch, useSelector } from "react-redux";
import { calendarApi } from "../api";
import {
  clearErrorMessage,
  onChecking,
  onLogin,
  onLogout,
  onLogoutCalendar,
} from "../store";
import Swal from "sweetalert2";

export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector((state) => state.auth); //el estado actual de autenticación desde Redux.
  const dispatch = useDispatch();

  /**
   * INCIAR SESION
   */
  const startLogin = async ({ user, password }) => {
    dispatch(onChecking());
    try {
      const { data } = await calendarApi.post("/auth", { user, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(onLogin({ user: data.user, id: data.token }));
      return { ok: true };
    } catch (error) {
      console.error(" Error login", error);
      const msg = error.response.data?.msg;
      dispatch(onLogout());
      return { ok: false, msg };
    }
  };
  //_----------------------------------------------------------------------------------------------
  /**
   * REGISTRAR USUARIOS
   */
  const startRegister = async ({
    nombre,
    apellido,
    celular,
    user,
    tipo_usuario,
    email,
    password,
  }) => {
    try {
      const { data } = await calendarApi.post("/auth/new", {
        nombre,
        apellido,
        celular,
        user,
        tipo_usuario,
        email,
        password,
      });

      localStorage.setItem("token", data.token); //guardo toqken para que el usuario quede logueado
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token-init-date", new Date().getTime());
      //Esto actualiza el estado global para reflejar que el usuario ya está registrado y logueado.
      dispatch(onLogin({ user: data.user, id: data.token }));
      return { ok: true };
    } catch (error) {
      const msg = error.response?.data?.msg || "Error al registrar el usuario";
      return { ok: false, msg };
    }
  };
  //_----------------------------------------------------------------------------------------------
  /**
   * CHEQUEAR TOKEN
   */
  const checkAuthToken = async () => {
    const token = localStorage.getItem("token");
    const userStorage = localStorage.getItem("user");

    if (!token || !userStorage) {
      return dispatch(onLogout());
    }

    try {
      const { data } = await calendarApi.get("auth/renew");
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime()); // para renovar el token
      localStorage.setItem("user", JSON.stringify(data.user));
      dispatch(onLogin({ user: data.user, id: data.token }));
    } catch (error) {
      console.error("Error en /auth/renew:", error.response?.data || error);
      localStorage.clear();
      dispatch(onLogout());
    }
  };
  //_----------------------------------------------------------------------------------------------
  /**
   * LIMPIAR SESION AL SALIR
   */

  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogoutCalendar());
    dispatch(onLogout());
  };

  return {
    //* Propiedades
    errorMessage,
    status,
    user,

    //* Métodos
    checkAuthToken,
    startLogin,
    startLogout,
    startRegister,
  };
};
