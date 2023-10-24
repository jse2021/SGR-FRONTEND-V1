import React from 'react'
import "./SearchResultsList.css"
import { SearchResult } from './SearchResult'


export const SearchResultsList = ({results}) => {

    if (!Array.isArray(results)) {
        return <div className="results-list">No hay resultados</div>;
      }
      
  return (
    <div className='results-list'>
        {results.map((result, id) =>{
            return <SearchResult result={result} key={id}/>
        })}
         
    </div>
  )
}
export default SearchResultsList;