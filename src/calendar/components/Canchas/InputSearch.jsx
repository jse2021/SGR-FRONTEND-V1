import React, { useState } from 'react'
import { calendarApi } from '../../../api';
import './canchas.css'

export const InputSearch = ({setResults}) => {
    const [value, setValue] = useState("");

    const buscarCancha = async(nombre) => {
        if (nombre.length === 0) return [];
        const {data} = await calendarApi.get(`/cancha/${nombre}`)
        const canchas = Array.from(data.cancha);
        setResults(canchas)
        console.log({data})
    }
 
    const handleChange = (value) => {
        setValue(value);
        buscarCancha(value);
    }
    
    return (
        <div className="form-group mb-2">
            <input
                className= 'form-control'
                type="text"
                placeholder="Buscar por Nombre"
                value={value}
                onChange={(e) => handleChange(e.target.value)}
            />
        </div>
  )
}
export default InputSearch;