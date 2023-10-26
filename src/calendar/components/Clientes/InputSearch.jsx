import React, { useState } from 'react'
import { calendarApi } from '../../../api';
import './clientes.css'

export const InputSearch = ({setResults}) => {
    const [value, setValue] = useState("");

    const buscarCliente = async(apellido) => {
        if (apellido.length === 0) return [];
        const {data} = await calendarApi.get(`/cliente/${apellido}`)
        const clientes = Array.from(data.cliente);
        console.log({clientes})
        setResults(clientes)
    }
 
    const handleChange = (value) => {
        setValue(value);
        buscarCliente(value);
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