import React, { createContext, useCallback, useContext, useState } from 'react'
import './SearchResult.css'

const SearchContext = React.createContext({});

export const SearchResult = ({result}) => {

    const [data, setData] = useState(result);
    // Pasamos el resultado del onClick como parámetro al contexto
    const { setResult } = useContext(SearchContext);

    const onClickUsuario = (e) => {
        
        if (setResult) {
          console.log(`Click en  ${data.nombre} ${data.apellido}`);
          setResult({ nombre: data.nombre, apellido: data.apellido }); 
        }
        console.log(result)
      };

  return (
    <div 
        className='search-result' 
        style={{cursor:"pointer"}}
        onClick={onClickUsuario}>{result.nombre} {result.apellido}</div>
  )
}

export default SearchResult;