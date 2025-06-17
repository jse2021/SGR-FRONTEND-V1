import React from "react";
import { SearchResult } from "./SearchResult";

export const SearchResultsList = ({
  results,
  totalPages,
  setCurrentPage,
  currentPage,
  onDeleteCancha,
}) => {
  return (
    <>
      <div className="table-responsive mt-3">
        {results.length > 0 ? (
          <table className="table table-bordered table-striped text-center">
            <thead className="table-dark text-uppercase">
              <tr>
                <th>Nombre</th>
                <th>Medidas</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {results.map((nombre) => (
                <SearchResult
                  key={nombre._id}
                  result={nombre}
                  onDeleteCancha={onDeleteCancha}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted text-center">No se encontraron canchas</p>
        )}
        <div className="d-flex justify-content-center mt-3">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              type="button"
              key={index + 1}
              className={`btn btn-sm mx-1 ${
                currentPage === index + 1
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
export default SearchResultsList;
