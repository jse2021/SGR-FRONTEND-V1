import React from 'react'
import './ListaCliente.css'
import { ResultadoPorCliente } from './ResultadoPorCliente'
export const ListaCliente = ({results}) => {
  return (
    <div className='results-list'>
        {
            results.map((result, id) => {
                return <ResultadoPorCliente result={result} key={id}/>
            })
        }
    </div>
  )
}
