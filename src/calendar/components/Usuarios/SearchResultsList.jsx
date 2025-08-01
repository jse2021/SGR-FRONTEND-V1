import React from "react";
import "./SearchResultsList.css";
import { SearchResult } from "./SearchResult";

export const SearchResultsList = ({
  results,
  onDeleteUsuario,
  totalPages,
  setCurrentPage,
  currentPage,
}) => {
  return (
    <div className="table-responsive mt-3">
      {results.length > 0 ? (
        <table className="table table-bordered table-striped text-center">
          <thead className="table-dark text-uppercase">
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Celular</th>
              <th>Email</th>
              <th>Usuario</th>
              <th>Tipo Usuario</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {results.map((user) => (
              <SearchResult
                key={user.id}
                result={user}
                onDeleteUsuario={onDeleteUsuario}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-muted text-center">No se encontraron usuarios</p>
      )}
      <div className="d-flex justify-content-center mt-3">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            type="button" // para evitar submit
            key={index + 1}
            className={`btn btn-sm mx-1 ${
              currentPage === index + 1 ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
export default SearchResultsList;
