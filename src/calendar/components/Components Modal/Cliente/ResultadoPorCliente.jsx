import React, { useState } from 'react'
import './ResultadoPorCliente.css'

export const ResultadoPorCliente = ({result}) => {
  const [data, setData] = useState(result);
     
  const onClickCliente = (e) => {
      setData({ nombre: data.nombre, apellido: data.apellido });
        console.log({ nombre: data.nombre, apellido: data.apellido });
    };


  return (
    <div
        className='search-result'
        style={{cursor:"pointer"}}
        onClick={onClickCliente}
    > {result.dni} - {result.nombre} {result.apellido}</div>
  )
}
