import React, { useEffect, useState } from 'react'
import './ListaCliente.css'
import { ResultadoPorCliente } from './ResultadoPorCliente'
import { InputCliente } from './InputCliente';
export const ListaCliente = ({results}) => {
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    window.addEventListener("clienteSeleccionado", (event) => {
      setSelectedClient(event.detail);
    });
  }, []);
  return (
    <div className='results-list'>
        {
            results.map((result, id) => {
                return <ResultadoPorCliente 
                          result={result}
                          key={id} 
                          selectedClient={selectedClient}/>
            })
        }
        <InputCliente selectedClient={selectedClient} />
    </div>
  )
}
