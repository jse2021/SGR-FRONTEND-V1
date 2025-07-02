import axios from "axios";
import { getEnvVariables } from "../helpers";

/**
 * CONEXION AL BACKEND
 */
const { VITE_API_URL } = getEnvVariables();

const calendarApi = axios.create({
  baseURL: VITE_API_URL, // Base URL dinámica
});

//configurara receptores: nos va apermitir interceptar peticiones que van o regresan del backend - necesario para mantener la autenticacion
calendarApi.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers, //esparce todos los headers que vienen en config
    "x-token": localStorage.getItem("token"),
  };
  return config;
});

export default calendarApi;
