import React, { useEffect, useState } from "react";
import { Navbar } from "../Navbar";
import InputSearch from "./InputSearch";
import SearchResultsList from "./SearchResultsList";
import { ModalUsuarios } from "./ModalUsuarios";
import { calendarApi } from "../../../api";

export const ConsultarUsuario = () => {
  // Para el manejo de la paginación.
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  /**
   *TRABAJO ELIMINAR USUARIO
   */
  const handleEliminarUsuario = (id) => {
    setResults((prevResults) => prevResults.filter((r) => r._id !== id));
  };
  /**
   *TRABAJO BUSCAR USUARIO
   */
  useEffect(() => {
    const fetchUsuarios = async () => {
      if (searchTerm.trim() == "") return;
      try {
        const { data } = await calendarApi.get(
          `/auth/buscar/${searchTerm}?page=${currentPage}&limit=5`
        );

        setResults(data.usuarios);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error al buscar usuarios:", error);
      }
    };

    fetchUsuarios();
  }, [searchTerm, currentPage]);

  return (
    <>
      <Navbar />
      <h1 className="text-center my-4 mt-5">Consultar Usuarios</h1>
      <div className="col-md-8 login-form-3 mx-auto">
        <form>
          <InputSearch
            setSearchTerm={setSearchTerm}
            setCurrentPage={setCurrentPage}
          />
          <SearchResultsList
            results={results}
            onDeleteUsuario={handleEliminarUsuario}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </form>
      </div>
      <ModalUsuarios />
    </>
  );
};

export default ConsultarUsuario;
