import React from 'react'
import './SearchResult.css'
export const SearchResult = ({result}) => {
  return (
    <div className='search-result' onClick={(e) => console.log(`Click en  ${result.nombre} ${result.apellido}`)}>{result.nombre} {result.apellido}</div>
  )
}

export default SearchResult;