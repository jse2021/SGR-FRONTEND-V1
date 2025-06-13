import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { calendarApi } from "../../../api";
import { BsPencil } from "react-icons/bs";
import { useUiStore } from "../../../hooks";

export const SearchResult = ({ result, onDeleteCliente }) => {
  /**
   * MANEJO EL CONTROL PARA ELMINAR
   */
  const handleEliminarCliente = async () => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar cliente?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        await calendarApi.delete(`/cliente/${result.id}`);
        onDeleteCliente(result.id);
        Swal.fire(
          "Eliminado",
          "El cliente fue eliminado correctamente",
          "success"
        );
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        Swal.fire(
          "Error",
          error.response?.data?.msg || "No se pudo eliminar el cliente",
          "error"
        );
      }
    }
  };
  return (
    <>
      <tr style={{ cursor: "pointer" }}>
        <td className="search-result">{result.dni}</td>
        <td className="search-result">{result.nombre}</td>
        <td className="search-result">{result.apellido}</td>
        <td className="search-result">{result.email}</td>
        <td className="search-result">{result.celular}</td>
        <td>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleEliminarCliente}
            title="Eliminar Cliente"
          >
            <FaTrash />
          </button>
        </td>
      </tr>
    </>
  );
};
export default SearchResult;
