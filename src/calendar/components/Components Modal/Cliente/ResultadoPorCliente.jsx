import React from 'react'

import './ResultadoPorCliente.css'

export const ResultadoPorCliente = ({result}) => {
  return (
    <div
        className='search-result'
        style={{cursor:"pointer"}}
    > {result.dni} - {result.nombre} {result.apellido}</div>
  )
}
