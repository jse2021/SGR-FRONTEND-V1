import React from 'react'
// import "./SearchResultsList.css"
import { SearchResult } from './SearchResult'


export const SearchResultsList = ({results}) => {

    // if (!Array.isArray(results)) {
    //     return <div className="results-list">No hay resultados</div>;
    //   }

      
  const searchResult = results.map((result, id) =>{
                      return <SearchResult result={result} key={id}/>
  })
        
  return (
    <>
      <table className="table table-hover">
    <thead>
      <tr>
        <th scope="col">Nombre</th>
        <th scope="col">Medidas</th>
      </tr>
    </thead>
    <tbody>

      {searchResult}

    </tbody>
  </table>
    </>
    
  )
  }
export default SearchResultsList;