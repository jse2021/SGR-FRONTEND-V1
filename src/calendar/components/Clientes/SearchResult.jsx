import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { calendarApi } from "../../../api";
import { BsPencil } from "react-icons/bs";
import { useUiStore } from "../../../hooks";

export const SearchResult = ({ result }) => {
  return (
    <>
      <tr style={{ cursor: "pointer" }}>
        <td className="search-result">{result.dni}</td>
        <td className="search-result">{result.nombre}</td>
        <td className="search-result">{result.apellido}</td>
        <td className="search-result">{result.email}</td>
        <td className="search-result">{result.celular}</td>
      </tr>
    </>
  );
};
export default SearchResult;
