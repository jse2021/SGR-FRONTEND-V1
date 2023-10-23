import React from 'react'
import { useSelector } from 'react-redux'
import { calendarApi } from '../../../api'

export const getUsuarioByApellido = (apellido = '') => {
  
    
    const {user} = useSelector(state => state.auth)

    const mostrarUsuarios = async () => {
        apellido = apellido.trim();
        if (apellido.length === 0) return [];
        const {data} = await calendarApi.get(`/auth/${ apellido}`)
        console.log({data})
    }
    
    return{
        mostrarUsuarios
    }
}
