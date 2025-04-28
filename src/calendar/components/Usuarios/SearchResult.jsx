import React, {useState } from 'react'
import './SearchResult.css'

export const SearchResult = ({result}) => {
     
  return (
    <>
    <tr style={{cursor:"pointer"}}>
      <td 
        className='search-result' 

      >{result.nombre}</td>
      <td 
        className='search-result' 

      >{result.apellido}</td>
      <td 
        className='search-result' 

      >{result.celular}</td>
      <td 
        className='search-result' 

      >{result.email}</td>
      <td 
        className='search-result' 

      >{result.user}</td>
      <td 
        className='search-result' 

      >{result.tipo_usuario}</td>
    </tr>
      
    </>
  )
}
export default SearchResult;