import axios from "axios";
import { getEnvVariables } from "../helpers";

/**
 * CONEXION AL BACKEND
 */
const { VITE_API_URL } = getEnvVariables();

//Toda peticion, pasa por aca
const calendarApi = axios.create({
  baseURL: VITE_API_URL,
});

//--> Luego agregamos el token a cada peticion, que se encuentra guardado en el localStorage.
calendarApi.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers, //esparce todos los headers que vienen en config
    "x-token": localStorage.getItem("token"),
  };
  return config;
});

export default calendarApi;
