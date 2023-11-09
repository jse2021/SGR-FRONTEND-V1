import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { onCheckingConfiguracion } from '../store';
import { calendarApi } from '../api';


export const useConfiguracionStore = () => {

    const [error, setError] = useState(null);
    
    const startRegister = async({nombre, monto_cancha, monto_sena}) => {        
        // const useDispatch = useDispatch();
        try {
            // useDispatch(onCheckingConfiguracion());
            const {data} = await calendarApi.post('/configuracion/crearMonto',{nombre, monto_cancha, monto_sena});
            
        } catch (error) {
            setError(error.response.data.msg);
            console.log(error.response.data.msg);
        }
    }
    
    return {
        startRegister,
        error
  }
}
