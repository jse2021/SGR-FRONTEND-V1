import React, { useEffect, useState } from 'react'
import './ResultadoPorCliente.css'
import { CalendarModal } from '../../..';


export const ResultadoPorCliente = ({result}) => {
  const [data, setData] = useState(result);
     
  const onClickCliente = () => {
        setData({ nombre: data.nombre, apellido: data.apellido });
        console.log(result.dni);
        console.log({ nombre: data.nombre, apellido: data.apellido });
    };
 
  return (
    <>
      <div
        className='search-result'
        style={{cursor:"pointer"}}
        onClick={onClickCliente}
        name='cliente'
        > {result.dni} - {result.nombre} {result.apellido}
      </div>
    </>    
  )
}
