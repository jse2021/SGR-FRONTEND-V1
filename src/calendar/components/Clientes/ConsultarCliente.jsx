import React, { useState } from 'react'
import { Navbar } from '../Navbar';
import InputSearch from './InputSearch';
import SearchResultsList from './SearchResultList';

export const ConsultarCliente = () => {
  const [results, setResults] = useState([]);
    return (
      <>
        <Navbar />
          <h1 className='display-5'>Consultar Clientes</h1>
            <div className="col-md-8 login-form-3">        
              <form>
                  <InputSearch setResults = {setResults}/>
                  <SearchResultsList results = {results}/>
              </form>
            </div>
      </>
      
    );
}
export default ConsultarCliente;