import React from 'react'
import { SearchResult } from './SearchResult'


export const SearchResultsList = ({results}) => {

  const searchResult = results.map((result, id) =>{
    return <SearchResult result={result} key={id}/>
  })
        
  return (
    <>
    <div className="table-responsive">
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

    </div>
      
    </>
    
  )
  }
export default SearchResultsList;