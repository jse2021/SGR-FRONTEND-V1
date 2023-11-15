import React, { useEffect, useState } from 'react'
import './ResultadoPorCliente.css'

export const ResultadoPorCliente = ({result}) => {
  const [data, setData] = useState(result);
  const onClickCliente = () => {
        setData({ nombre: data.nombre, apellido: data.apellido });
        window.dispatchEvent(new CustomEvent("clienteSeleccionado", { detail: data }));
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

export default ResultadoPorCliente;
