import React, {  useState } from 'react'

export const SearchResult = ({result}) => {
   
  const [data, setData] = useState(result);
      
  return (
    <>
      <tr style={{cursor:"pointer"}}>
        <td className='search-result'>{result.dni}</td>
        <td className='search-result'>{result.nombre}</td>
        <td className='search-result'>{result.apellido}</td>
        <td className='search-result'>{result.email}</td>
        <td className='search-result' >{result.celular}</td>
      </tr>
    </>
  )
}
export default SearchResult;