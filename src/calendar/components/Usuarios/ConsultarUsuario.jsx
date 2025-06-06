import React, { useState } from 'react'
import { Navbar } from '../Navbar';
import InputSearch from './InputSearch';
import SearchResultsList from './SearchResultsList';

/**
 * 1 - SEPARAR LA TABLA EN OTRO COMPONENTE
 * 2- INCORPORAR EL COMPONENTE AL CONSULTAR USUARIO 
 * 3- DISEÑAR EL GetUsuarioByApellido
 * 4- LLAMARLO AL CONSULTAR USUARIO
 */
export const ConsultarUsuario = () => {
  const [results, setResults] = useState([]);
  /**
   * Usa useState para guardar los usuarios encontrados (results).
   * Pasa setResults a InputSearch, para que el input pueda actualizar los resultados.
   * Pasa results a SearchResultsList para mostrar lo encontrado.
   */
  return (
    <>
    <Navbar />
      <h1 className='display-5'>Consultar Usuarios</h1>
      <div className="col-md-8 login-form-3">        
      <form >   
          <InputSearch setResults = {setResults}/>
          <SearchResultsList  results = {results}/> 
        </form>
      </div>
    </>
  )
}
export default ConsultarUsuario;