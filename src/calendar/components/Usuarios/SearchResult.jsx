import React, { createContext, useCallback, useContext, useState } from 'react'
import './SearchResult.css'


export const SearchResult = ({result}) => {
   
    const [data, setData] = useState(result);
    

    // Pasamos el resultado del onClick como parámetro al contexto
    const onClickUsuario = (e) => {
      setData({ nombre: data.nombre, apellido: data.apellido });
        console.log({ nombre: data.nombre, apellido: data.apellido });
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