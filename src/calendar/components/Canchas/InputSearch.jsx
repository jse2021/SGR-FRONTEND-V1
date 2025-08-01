import React, { useState } from "react";
import { calendarApi } from "../../../api";
import "./canchas.css";

export const InputSearch = ({ setSearchTerm, setCurrentPage }) => {
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reinicio paginación
  };

  return (
    <div className="form-group mb-2">
      <input
        className="form-control"
        type="text"
        placeholder="Buscar Cancha"
        onChange={handleChange}
      />
    </div>
  );
};
export default InputSearch;
