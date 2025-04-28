

export const SearchResult = ({result}) => {
     
  return (
    <>
      <tr style={{cursor:"pointer"}}>
        <td className='search-result'>{result.nombre}</td>
        <td className='search-result'>{result.medidas}</td>
      </tr>
    </>
  )
}
export default SearchResult;