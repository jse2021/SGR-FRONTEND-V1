import React, {useState } from 'react'

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
        >{result.nombre}</td>
      <td 
        className='search-result' 
        // onClick={onClickUsuario}
        >{result.medidas}</td>
    </tr>
      
    </>
  )
}
export default SearchResult;