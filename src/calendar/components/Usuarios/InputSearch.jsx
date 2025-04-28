import React, { useState } from 'react'
import { calendarApi } from '../../../api';
import './usuarios.css'

export const InputSearch = ({setResults}) => {
    const [value, setValue] = useState("");

    const buscarUsuario = async(apellido) => {
        try {
            if (apellido.length === 0) return [];
            const {data} = await calendarApi.get(`/auth/${apellido}`)
            const usuarios = Array.from(data.usuario);
            setResults(usuarios)    
        } catch (error) {
            setError(error.response.data.msg);
        }
        
    }
 
    const handleChange = (value) => {
        setValue(value);
        buscarUsuario(value);
    }
    
    return (
        <div className="form-group mb-2">
            <input
                className= 'form-control'
                type="text"
                placeholder="Buscar por Apellido"
                value={value}
                onChange={(e) => handleChange(e.target.value)}
            />
        </div>
  )
}
export default InputSearch;