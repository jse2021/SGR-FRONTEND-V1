import React, { createContext, useCallback, useContext, useState } from 'react'
import './SearchResult.css'
import SearchContext from "./SearchContext";

export const SearchResult = ({result}) => {

    const [data, setData] = useState(result);
    // Pasamos el resultado del onClick como parámetro al contexto
    const { setResult } = useContext(SearchContext);

    const onClickUsuario = (e) => {
        console.log(`Click en  ${data.nombre} ${data.apellido}`);
        setResult({ nombre: data.nombre, apellido: data.apellido });
      };

  return (
    <div 
        className='search-result' 
        onClick={onClickUsuario}
        style={{cursor:"pointer"}}
        >{result.nombre} {result.apellido}</div>
  )
}

export default SearchResult;