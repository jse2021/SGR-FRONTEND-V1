import React, { useEffect, useState } from "react";
import { calendarApi } from "../../../api";
import "./usuarios.css";

export const InputSearch = ({ setResults, setSearchTerm, setCurrentPage }) => {
  const [value, setValue] = useState("");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (value.trim() === "") {
  //         setResults([]);
  //         return;
  //       }

  //       const response = await calendarApi.get(`/auth/buscar/${value}`);
  //       setResults(response.data.usuarios);
  //     } catch (error) {
  //       console.error("Error al buscar usuarios:", error);
  //       setResults([]);
  //     }
  //   };

  //   fetchData();
  // }, [value]);

  const handleChange = (e) => {
    const value = e.target.value; // <-- Esto asegura que sea string
    setSearchTerm(value); // 🔥 NO pases el evento completo
    setCurrentPage(1); // Reinicio paginación
  };

  return (
    <div className="form-group mb-2">
      <input
        className="form-control"
        type="text"
        placeholder="Buscar Usuario"
        // value={value}
        onChange={handleChange}
      />
    </div>
  );
};
export default InputSearch;
