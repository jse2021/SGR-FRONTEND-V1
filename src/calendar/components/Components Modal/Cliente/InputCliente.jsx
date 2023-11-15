import React, { useEffect, useState } from 'react'
import { calendarApi } from '../../../../api';

export const InputCliente = ({setResults }) => {
    const [value, setValue] = useState("");

    const buscarCliente = async(apellido) => {
        if (apellido.length === 0) return [];
            const {data} = await calendarApi.get(`/cliente/${apellido}`)
            const clientes = Array.from(data.cliente);
            setResults(clientes)
        }

    const handleChange = (value) => {
        setValue([value]);
        buscarCliente(value);
    }
    
    return (
        <div className="form-group mb-2">
            <input
                className= 'form-control'
                type="text"
                placeholder="Buscar Cliente"
                value={value}
                onChange={(e) => handleChange(e.target.value)}
            />
        </div>
  )
}
