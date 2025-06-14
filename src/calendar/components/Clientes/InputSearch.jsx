import React, { useState } from "react";
import "./clientes.css";

export const InputSearch = ({ setResults, setSearchTerm, setCurrentPage }) => {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    console.log(value);
    setSearchTerm(value);
    setCurrentPage(1); // Reinicio paginación
  };

  return (
    <div className="form-group mb-2">
      <input
        className="form-control"
        type="text"
        placeholder="Buscar cliente"
        onChange={handleChange}
      />
    </div>
  );
};
export default InputSearch;
