import React, { useEffect, useState } from 'react'
import './ResultadoPorCliente.css'
import { CalendarModal } from '../../..';

export const ResultadoPorCliente = ({result}) => {
  const [data, setData] = useState(result);
  const [clienteSeleccionado, setClienteSeleccionado] = useState([]);
     
  const onClickCliente = (e) => {
      // setData({ nombre: data.nombre, apellido: data.apellido });
      setClienteSeleccionado(result);
      console.log(result.dni);
        console.log({ nombre: data.nombre, apellido: data.apellido });
    };
 
  return (
    <>
      <div
        className='search-result'
        style={{cursor:"pointer"}}
        onClick={onClickCliente}
        > {result.dni} - {result.nombre} {result.apellido}
      </div>
      
    </>
    
    
  )
}
