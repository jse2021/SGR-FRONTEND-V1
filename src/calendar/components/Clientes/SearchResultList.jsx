import React from "react";
import "./SearchResultList.css";
import { SearchResult } from "./SearchResult";

export const SearchResultsList = ({
  results,
  totalPages,
  setCurrentPage,
  currentPage,
}) => {
  return (
    <>
      <div className="table-responsive mt-3">
        {results.length > 0 ? (
          <table className="table table-bordered table-striped text-center">
            <thead className="table-dark text-uppercase">
              <tr>
                <th>Dni</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Celular</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {results.map((dni) => (
                <SearchResult key={dni._id} result={dni} />
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted text-center">No se encontraron clientes</p>
        )}
        <div className="d-flex justify-content-center mt-3">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
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
