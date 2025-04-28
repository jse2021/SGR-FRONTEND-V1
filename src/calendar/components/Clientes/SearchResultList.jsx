import React from 'react'
import "./SearchResultList.css"
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
              <th scope="col">Dni</th>
              <th scope="col">Nombre</th>
              <th scope="col">Apellido</th>
              <th scope="col">Email</th>
              <th scope="col">Celular</th>
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