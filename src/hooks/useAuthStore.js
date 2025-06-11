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
  const { status, user, errorMessage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  /**
   * INCIAR SESION
   */
  const startLogin = async ({ user, password }) => {
    dispatch(onChecking());

    try {
      const { data } = await calendarApi.post("/auth", { user, password });
      console.log({ data });
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(onLogin({ user: data.user, id: data.token }));
    } catch (error) {
      console.log({ error });
      dispatch(onLogout(error.response.data?.msg || "--"));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

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
    dispatch(onChecking());
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

      /**
       * Lo comento porque cuando registraba, intentaba loguear al usuario, pero no quiero eso
       */

      localStorage.setItem("token", data.token); //guardo toqken para que el usuario quede logueado
      localStorage.setItem("token-init-date", new Date().getTime());
      //Esto actualiza el estado global para reflejar que el usuario ya está registrado y logueado.
      dispatch(onLogin({ user: data.user, id: data.token }));
      return { ok: true };
    } catch (error) {
      const msg = error.response?.data?.msg || "Error al registrar el usuario";
      console.log({ msg });
      return { ok: false, msg };
    }
  };

  /**
   * CHEQUEAR TOKEN
   */
  const checkAuthToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return dispatch(onLogout());

    try {
      const { data } = await calendarApi.get("auth/renew");
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime()); // para renovar el token
      dispatch(onLogin({ user: data.user, id: data.token }));
    } catch (error) {
      localStorage.clear();
      dispatch(onLogout());
    }
  };

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
