import React, { useEffect, useState } from "react";
import { Navbar } from "../Navbar";
import InputSearch from "./InputSearch";
import SearchResultsList from "./SearchResultList";
import { calendarApi } from "../../../api";

export const ConsultarCliente = () => {
  // Para el manejo de la paginación.
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect;
  () => {
    const fetchClientes = async () => {
      if (searchTerm.trim() == "") return;
      try {
        const { data } = await calendarApi.get(
          `/cliente/buscar/${searchTerm}?page=${currentPage}&limit=5`
        );
        console.log(data);
        setResults(data.clientes);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.log("Error al buscar clientes: ", error);
      }
    };
    fetchClientes();
  },
    [searchTerm, currentPage];

  return (
    <>
      <Navbar />
      <h1 className="display-5">Consultar Clientes</h1>
      <div className="col-md-8 login-form-3">
        <form>
          <InputSearch
            setSearchTerm={setSearchTerm}
            setCurrentPage={setCurrentPage}
          />
          <SearchResultsList
            results={results}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </form>
      </div>
    </>
  );
};
export default ConsultarCliente;
