import axios from 'axios'
import {getEnvVariables} from '../helpers'

/**
 * CONEXION AL BACKEND
 */
const{VITE_API_URL} = getEnvVariables();

const calendarApi = axios.create({
    baseURL:VITE_API_URL
})
//configurara receptores: nos va apermitir interceptar peticiones que van o regresan del backend
calendarApi.interceptors.request.use(config=> {
    config.headers = {
        ...config.headers,
        'x-token': localStorage.getItem('token')
    }


    return config;
})

export default calendarApi;