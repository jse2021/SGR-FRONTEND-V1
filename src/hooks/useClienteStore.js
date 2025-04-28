import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { onCheckingCliente } from '../store/cliente/clienteSlice';
import { calendarApi } from '../api';

export const useClienteStore = () => {
 
    /**
     * REGISTRAR CLIENTES
     */
    const dispatch = useDispatch();
        const startRegister = async ({dni, nombre, apellido, email, celular}) => {
            try {

                dispatch(onCheckingCliente());
                const {data} = await calendarApi.post('cliente/crearCliente',{dni, nombre, apellido, email, celular});

            } catch (error) {
                setTimeout(() => {
                    dispatch( clearErrorMessage() );
                }, 10);              
            }

        }

  return {

    startRegister

  }
}
