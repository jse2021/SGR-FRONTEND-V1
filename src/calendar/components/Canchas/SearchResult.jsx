import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { calendarApi } from "../../../api";
import { BsPencil } from "react-icons/bs";
import { useUiStore } from "../../../hooks";

export const SearchResult = ({ result, onDeleteCancha }) => {
  /**
   * MANEJO EL CONTROL PARA ELMINAR
   */
  const handleEliminarCancha = async () => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar cancha?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        await calendarApi.delete(`/cancha/${result.id}`);
        onDeleteCancha(result.id);
        Swal.fire(
          "Eliminada",
          "La cancha fue eliminado correctamente",
          "success"
        );
      } catch (error) {
        console.error("Error al eliminar cancha:", error);
        Swal.fire(
          "Error",
          error.response?.data?.msg || "No se pudo eliminar la cancha",
          "error"
        );
      }
    }
  };
  return (
    <>
      <tr style={{ cursor: "pointer" }}>
        <td className="search-result">{result.nombre}</td>
        <td className="search-result">{result.medidas}</td>
        <td>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleEliminarCancha}
            title="Eliminar cancha"
          >
            <FaTrash />
          </button>
        </td>
      </tr>
    </>
  );
};
export default SearchResult;
