import axios from "axios";
import { getEnvVariables } from "../helpers";

/**
 * CONEXION AL BACKEND
 */
const { VITE_API_URL } = getEnvVariables();
// const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const calendarApi = axios.create({
  baseURL: VITE_API_URL, // Base URL dinámica
});
// const calendarApi = axios.create({
//   //   baseURL: VITE_API_URL, //para localhost
//   //   baseURL: import.meta.env.VITE_API_URL, //para produccion
//   // baseURL: VITE_API_URL, //  funciona tanto en localhost como en producción
//   // baseURL: import.meta.env.VITE_API_URL, // Debe terminar en /api
// });
//configurara receptores: nos va apermitir interceptar peticiones que van o regresan del backend - necesario para mantener la autenticacion
calendarApi.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers, //esparce todos los headers que vienen en config
    "x-token": localStorage.getItem("token"),
  };
  return config;
});

export default calendarApi;
