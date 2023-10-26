import React, {  useState } from 'react'

export const SearchResult = ({result}) => {
   
    const [data, setData] = useState(result);
    
    // Pasamos el resultado del onClick como parámetro al contexto
    // const onClickUsuario = (e) => {
    //   setData({ nombre: data.nombre, apellido: data.apellido });
    //     console.log({ nombre: data.nombre, apellido: data.apellido });
    // };
     
  return (
    <>
    <tr style={{cursor:"pointer"}}>
    <td 
        className='search-result' 
        // onClick={onClickUsuario}
      >{result.dni}</td>
      <td 
        className='search-result' 
        // onClick={onClickUsuario}
        // style={{cursor:"pointer"}}
      >{result.nombre}</td>
      <td 
        className='search-result' 
        // onClick={onClickUsuario}
      >{result.apellido}</td>
      <td 
        className='search-result' 
        // onClick={onClickUsuario}
      >{result.email}</td>
      <td 
        className='search-result' 
        // onClick={onClickUsuario}
      >{result.celular}</td>
    </tr>
      
    </>
  )
}
export default SearchResult;