import React, { useEffect, useState } from "react";
import { Navbar } from "../Navbar";
import InputSearch from "./InputSearch";
import SearchResultsList from "./SearchResultsList";
import { calendarApi } from "../../../api";
import { ModalCanchas } from "./ModalCanchas";

export const ConsultarCancha = () => {
  // Para el manejo de la paginación.
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  //--------------------------------------------------------------------------------
  /**
   *TRABAJO ELIMINAR CLIENTE
   */
  const handleEliminarCancha = (id) => {
    setResults((prevResults) => prevResults.filter((r) => r._id !== id));
  };

  /**
   *TRABAJO BUSCAR CANCHA
   */
  useEffect(() => {
    const fetchCanchas = async () => {
      if (searchTerm.trim() == "") return;
      try {
        const { data } = await calendarApi.get(
          `/cancha/buscar/${searchTerm}?page=${currentPage}&limit=5`
        );

        setResults(data.canchas);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error al buscar canchas:", error);
      }
    };

    fetchCanchas();
  }, [searchTerm, currentPage]);
  //--------------------------------------------------------------------------------

  return (
    <>
      <Navbar />
      <h1 className="text-center my-4">Consultar Cancha</h1>
      {/* <div className="col-md-8 login-form-3"> */}
      <div className="col-md-8 login-form-3 mx-auto">
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
            onDeleteCancha={handleEliminarCancha}
          />
        </form>
      </div>
      <ModalCanchas />
    </>
  );
};
export default ConsultarCancha;
